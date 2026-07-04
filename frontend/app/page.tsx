'use client';
import { useApp } from './lib/store';
import AuthView from './components/AuthView';
import AppShell from './components/AppShell';

export default function Home() {
  const { isLoggedIn } = useApp();

  return (
    <>
      <div className="bg-blobs">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
      </div>
      {isLoggedIn ? <AppShell /> : <AuthView />}
    </>
  );
}
