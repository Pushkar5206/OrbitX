// backend/server.js
const express = require('express');
const cors = require('cors');
const { authClient, dbClient } = require('./supabaseClient');

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());

function sendError(res, status, message, details) {
    return res.status(status).json({ error: message, details });
}

function normalizeIdPart(value, mode) {
    const words = String(value || '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map(part => part.replace(/[^a-zA-Z0-9]/g, ''));

    if (!words.length) {
        return 'XX';
    }

    if (words.length === 1) {
        return words[0].slice(0, 2).padEnd(2, 'X').toUpperCase();
    }

    if (mode === 'company') {
        return `${words[0][0] || 'X'}${words[1][0] || 'X'}`.toUpperCase();
    }

    return `${words[0].slice(0, 2)}${words[1].slice(0, 2)}`.toUpperCase();
}

function buildLoginId(companyName, personName, year, serial) {
    const companyCode = normalizeIdPart(companyName, 'company');
    const nameCode = normalizeIdPart(personName, 'name');
    return `${companyCode}${nameCode}${year}${String(serial).padStart(4, '0')}`;
}

function formatDateKey(date = new Date()) {
    return date.toISOString().slice(0, 10);
}

function formatTimeKey(date = new Date()) {
    return date.toTimeString().slice(0, 8);
}

async function getEmployeeByUserId(userId) {
    const { data, error } = await dbClient
        .from('employees')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data;
}

async function requireAuth(req, res) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        sendError(res, 401, 'Missing bearer token');
        return null;
    }

    const { data: userData, error: userError } = await authClient.auth.getUser(token);

    if (userError || !userData?.user) {
        sendError(res, 401, 'Invalid or expired token');
        return null;
    }

    const employee = await getEmployeeByUserId(userData.user.id);

    if (!employee) {
        sendError(res, 404, 'Employee profile not found for authenticated user');
        return null;
    }

    return { user: userData.user, employee };
}

app.post('/api/auth/signup', async (req, res) => {
    try {
        const { companyName, name, email, password, role = 'employee' } = req.body || {};

        if (!companyName || !name || !email || !password) {
            return sendError(res, 400, 'companyName, name, email, and password are required');
        }

        const { data: signUpData, error: signUpError } = await dbClient.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
        });

        if (signUpError) {
            return sendError(res, 400, signUpError.message);
        }

        const userId = signUpData?.user?.id;

        if (!userId) {
            return sendError(res, 500, 'Supabase did not return a user id');
        }

        const currentYear = new Date().getFullYear();
        const prefix = `${normalizeIdPart(companyName, 'company')}${normalizeIdPart(name, 'name')}${currentYear}`;

        const { count, error: countError } = await dbClient
            .from('employees')
            .select('id', { count: 'exact', head: true })
            .ilike('login_id', `${prefix}%`);

        if (countError) {
            return sendError(res, 500, countError.message);
        }

        const loginId = buildLoginId(companyName, name, currentYear, (count || 0) + 1);

        const { data: employee, error: employeeError } = await dbClient
            .from('employees')
            .insert([
                {
                    name,
                    email,
                    role,
                    user_id: userId,
                    login_id: loginId,
                },
            ])
            .select('*')
            .single();

        if (employeeError) {
            return sendError(res, 500, employeeError.message);
        }

        return res.status(201).json({
            message: 'User registered successfully',
            loginId,
            userId,
            employee,
            session: null,
        });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
});

app.post('/api/auth/signin', async (req, res) => {
    try {
        const { email, loginId, password } = req.body || {};

        if (!password || (!email && !loginId)) {
            return sendError(res, 400, 'email or loginId and password are required');
        }

        let resolvedEmail = email;

        if (!resolvedEmail && loginId) {
            const identifier = String(loginId).trim();
            const lookupQuery = identifier.includes('@')
                ? dbClient.from('employees').select('email').eq('email', identifier).maybeSingle()
                : dbClient.from('employees').select('email').or(`login_id.eq.${identifier},email.eq.${identifier}`).maybeSingle();

            const { data: employeeByLoginId, error: lookupError } = await lookupQuery;

            if (lookupError) {
                return sendError(res, 500, lookupError.message);
            }

            if (!employeeByLoginId?.email) {
                return sendError(res, 404, 'No employee found for the provided loginId or email');
            }

            resolvedEmail = employeeByLoginId.email;
        }

        if (!resolvedEmail && email) {
            resolvedEmail = String(email).trim();
        }

        if (!resolvedEmail) {
            return sendError(res, 400, 'Unable to resolve a login email');
        }

        const { data: signInData, error: signInError } = await authClient.auth.signInWithPassword({
            email: resolvedEmail,
            password,
        });

        if (signInError) {
            return sendError(res, 401, signInError.message);
        }

        const userId = signInData?.user?.id;

        if (!userId) {
            return sendError(res, 500, 'Supabase did not return a user id');
        }

        const employee = await getEmployeeByUserId(userId);

        if (!employee) {
            const { data: fallbackEmployee, error: fallbackError } = await dbClient
                .from('employees')
                .select('*')
                .or(`user_id.eq.${userId},email.eq.${resolvedEmail}`)
                .maybeSingle();

            if (fallbackError) {
                return sendError(res, 500, fallbackError.message);
            }

            if (!fallbackEmployee) {
                return sendError(res, 404, 'Employee profile not found');
            }

            return res.json({
                accessToken: signInData.session?.access_token,
                refreshToken: signInData.session?.refresh_token,
                expiresAt: signInData.session?.expires_at,
                employee: fallbackEmployee,
                user: signInData.user,
            });
        }

        return res.json({
            accessToken: signInData.session?.access_token,
            refreshToken: signInData.session?.refresh_token,
            expiresAt: signInData.session?.expires_at,
            employee,
            user: signInData.user,
        });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
});

app.get('/api/employees', async (req, res) => {
    try {
        const auth = await requireAuth(req, res);
        if (!auth) {
            return;
        }

        const isAdmin = String(auth.employee.role || '').toLowerCase() === 'admin';

        if (isAdmin) {
            const { data, error } = await dbClient.from('employees').select('*').order('name', { ascending: true });

            if (error) {
                return sendError(res, 500, error.message);
            }

            return res.json({ employees: data });
        }

        return res.json({ employee: auth.employee });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
});

app.get('/api/attendance', async (req, res) => {
    try {
        const auth = await requireAuth(req, res);
        if (!auth) {
            return;
        }

        const isAdmin = String(auth.employee.role || '').toLowerCase() === 'admin';
        const query = dbClient.from('attendance').select('*').order('created_at', { ascending: false });

        const { data, error } = isAdmin
            ? await query
            : await query.eq('employee_id', auth.employee.id);

        if (error) {
            return sendError(res, 500, error.message);
        }

        return res.json({ attendance: data });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
});

app.post('/api/attendance', async (req, res) => {
    try {
        const auth = await requireAuth(req, res);
        if (!auth) {
            return;
        }

        const action = String(req.body?.action || '').toLowerCase();
        const workDate = req.body?.date || formatDateKey();
        const nowTime = req.body?.time || formatTimeKey();

        const { data: existingRow, error: existingError } = await dbClient
            .from('attendance')
            .select('*')
            .eq('employee_id', auth.employee.id)
            .eq('work_date', workDate)
            .maybeSingle();

        if (existingError) {
            return sendError(res, 500, existingError.message);
        }

        if (!existingRow) {
            const { data, error } = await dbClient
                .from('attendance')
                .insert([
                    {
                        employee_id: auth.employee.id,
                        user_id: auth.user.id,
                        work_date: workDate,
                        check_in: action === 'check-out' ? null : nowTime,
                        check_out: action === 'check-out' ? nowTime : null,
                        status: action === 'check-out' ? 'checked-out' : 'checked-in',
                    },
                ])
                .select('*')
                .single();

            if (error) {
                return sendError(res, 500, error.message);
            }

            return res.status(201).json({ attendance: data });
        }

        const updatePayload = {};
        const shouldCheckOut = action === 'check-out' || (existingRow.check_in && !existingRow.check_out);

        if (shouldCheckOut) {
            updatePayload.check_out = nowTime;
            updatePayload.status = 'checked-out';
        } else {
            updatePayload.check_in = existingRow.check_in || nowTime;
            updatePayload.status = 'checked-in';
        }

        const { data, error } = await dbClient
            .from('attendance')
            .update(updatePayload)
            .eq('id', existingRow.id)
            .select('*')
            .single();

        if (error) {
            return sendError(res, 500, error.message);
        }

        return res.json({ attendance: data });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
});

app.get('/api/time-off', async (req, res) => {
    try {
        const auth = await requireAuth(req, res);
        if (!auth) {
            return;
        }

        const isAdmin = String(auth.employee.role || '').toLowerCase() === 'admin';
        const query = dbClient.from('time_off').select('*').order('created_at', { ascending: false });

        const { data, error } = isAdmin
            ? await query
            : await query.eq('employee_id', auth.employee.id);

        if (error) {
            return sendError(res, 500, error.message);
        }

        return res.json({ timeOff: data });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
});

app.post('/api/time-off', async (req, res) => {
    try {
        const auth = await requireAuth(req, res);
        if (!auth) {
            return;
        }

        const { startDate, endDate, type, reason } = req.body || {};

        if (!startDate || !endDate || !type) {
            return sendError(res, 400, 'startDate, endDate, and type are required');
        }

        const { data, error } = await dbClient
            .from('time_off')
            .insert([
                {
                    employee_id: auth.employee.id,
                    user_id: auth.user.id,
                    start_date: startDate,
                    end_date: endDate,
                    type,
                    reason: reason || null,
                    status: 'pending',
                },
            ])
            .select('*')
            .single();

        if (error) {
            return sendError(res, 500, error.message);
        }

        return res.status(201).json({ timeOff: data });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
});

app.patch(['/api/time-off', '/api/time-off/:id'], async (req, res) => {
    try {
        const auth = await requireAuth(req, res);
        if (!auth) {
            return;
        }

        const isAdmin = String(auth.employee.role || '').toLowerCase() === 'admin';

        if (!isAdmin) {
            return sendError(res, 403, 'Only admins can approve or reject leave requests');
        }

        const requestId = req.params.id || req.body?.id;
        const status = String(req.body?.status || '').toLowerCase();

        if (!requestId || !['approved', 'rejected', 'pending'].includes(status)) {
            return sendError(res, 400, 'id and a valid status are required');
        }

        const { data, error } = await dbClient
            .from('time_off')
            .update({
                status,
                updated_at: new Date().toISOString(),
            })
            .eq('id', requestId)
            .select('*')
            .single();

        if (error) {
            return sendError(res, 500, error.message);
        }

        return res.json({ timeOff: data });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});