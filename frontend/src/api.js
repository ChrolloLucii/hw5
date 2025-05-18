const API = 'http://localhost:3000';

export async function register(login, password) {
  const res = await fetch(`${API}/register`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password }),
  });
  return res.json();
}

export async function login(login, password) {
  const res = await fetch(`${API}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password }),
  });
  return res.json();
}

export async function getProfile() {
  const res = await fetch(`${API}/profile`, {
    credentials: 'include',
  });
  return res.ok ? res.json() : null;
}

export async function logout() {
  await fetch(`${API}/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function getData() {
  const res = await fetch(`${API}/data`, {
    credentials: 'include',
  });
  return res.ok ? res.json() : null;
}