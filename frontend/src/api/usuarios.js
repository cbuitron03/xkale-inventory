import client from './client';

export const getUsuarios        = ()     => client.get('/usuarios').then(r => r.data);
export const getUsuario         = (id)   => client.get(`/usuarios/${id}`).then(r => r.data);
export const createUsuario      = (d)    => client.post('/usuarios', d).then(r => r.data);
export const updateUsuario      = (id,d) => client.put(`/usuarios/${id}`, d).then(r => r.data);
export const deleteUsuario      = (id)   => client.delete(`/usuarios/${id}`).then(r => r.data);
export const getUsuarioByCorreo = (c)    => client.get(`/consultas/usuarios/correo/${c}`).then(r => r.data);
export const getUsuarioLaptops  = (c)    => client.get(`/consultas/usuarios/correo/${c}/laptops`).then(r => r.data);
