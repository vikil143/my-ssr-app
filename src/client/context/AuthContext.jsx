import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../lib/api.js';

const AuthContext = createContext(null);

// Non-sensitive hint stored in localStorage so we skip the /api/auth/me call
// (and its 401 console noise) when no session cookie can possibly exist.
// The real auth token lives in the httpOnly cookie — this is only a UI hint.
const SESSION_KEY = 'has_session';

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on first render — only runs on the client
  useEffect(() => {
    // Skip the network call entirely if we know there's no active session
    if (!localStorage.getItem(SESSION_KEY)) {
      setLoading(false);
      return;
    }

    apiFetch('/api/auth/me')
      .then((u) => {
        setUser(u);
      })
      .catch(() => {
        // Cookie expired or was cleared externally — clean up the hint
        localStorage.removeItem(SESSION_KEY);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const u = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem(SESSION_KEY, '1');
    setUser(u);
    return u;
  }

  async function register(name, email, password) {
    const u = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    localStorage.setItem(SESSION_KEY, '1');
    setUser(u);
    return u;
  }

  async function logout() {
    await apiFetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
