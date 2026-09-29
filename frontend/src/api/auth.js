import client from './client';

export const login = async (username, password) => {
  const form = new URLSearchParams();
  form.append('username', username);
  form.append('password', password);
  const { data } = await client.post('/auth/login', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return data;
};

export const getMe        = ()           => client.get('/auth/me').then(r => r.data);
export const getUsers     = ()           => client.get('/auth/users').then(r => r.data);
export const registerUser = (data)       => client.post('/auth/register', data).then(r => r.data);
export const changePassword = (data)     => client.put('/auth/change-password', data).then(r => r.data);
export const toggleUser   = (username)   => client.put(`/auth/toggle/${username}`).then(r => r.data);
export const changeRole   = (username, rol) => client.put(`/auth/role/${username}`, { rol }).then(r => r.data);
