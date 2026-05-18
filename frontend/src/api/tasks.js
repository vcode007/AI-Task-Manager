import axios from 'axios';

const BASE = 'http://localhost:5000/api';

export const getTasks    = ()          => axios.get(`${BASE}/tasks`);
export const createTask  = (task)      => axios.post(`${BASE}/tasks`, task);
export const updateTask  = (id, task)  => axios.put(`${BASE}/tasks/${id}`, task);
export const deleteTask  = (id)        => axios.delete(`${BASE}/tasks/${id}`);
export const prioritize  = ()          => axios.get(`${BASE}/ai/prioritize`);
