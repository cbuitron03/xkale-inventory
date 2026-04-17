import client from './client';

export const getTickets          = ()    => client.get('/tickets').then(r => r.data);
export const getTicket           = (id)  => client.get(`/tickets/${id}`).then(r => r.data);
export const createTicket        = (d)   => client.post('/tickets', d).then(r => r.data);
export const updateTicket        = (id, d) => client.put(`/tickets/${id}`, d).then(r => r.data);
export const deleteTicket        = (id)  => client.delete(`/tickets/${id}`).then(r => r.data);
export const getTicketsByHostname = (h)  => client.get(`/consultas/tickets/hostname/${h}/detalle`).then(r => r.data);
export const getTicketsByTecnico  = (c)  => client.get(`/consultas/tickets/tecnico/${c}`).then(r => r.data);
