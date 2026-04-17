import client from './client';

export const getTecnicos   = ()      => client.get('/tecnicos').then(r => r.data);
export const getTecnico    = (id)    => client.get(`/tecnicos/${id}`).then(r => r.data);
export const createTecnico = (d)     => client.post('/tecnicos', d).then(r => r.data);
export const updateTecnico = (id, d) => client.put(`/tecnicos/${id}`, d).then(r => r.data);
export const deleteTecnico = (id)    => client.delete(`/tecnicos/${id}`).then(r => r.data);
