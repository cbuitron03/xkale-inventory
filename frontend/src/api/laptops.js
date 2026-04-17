import client from './client';

export const getLaptops       = ()       => client.get('/laptops').then(r => r.data);
export const getLaptop        = (id)     => client.get(`/laptops/${id}`).then(r => r.data);
export const createLaptop     = (data)   => client.post('/laptops', data).then(r => r.data);
export const updateLaptop     = (id, d)  => client.put(`/laptops/${id}`, d).then(r => r.data);
export const deleteLaptop     = (id)     => client.delete(`/laptops/${id}`).then(r => r.data);
export const getLaptopDetalle = (h)      => client.get(`/consultas/laptops/hostname/${h}/detalle`).then(r => r.data);
export const getLaptopsMarca  = (m)      => client.get(`/consultas/laptops/marca/${m}`).then(r => r.data);
