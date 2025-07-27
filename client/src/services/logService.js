import apiClient from './apiClient';

const getLogs = (filters = {}) => {
  const params = new URLSearchParams(filters);
  return apiClient.get(`/logs?${params.toString()}`);
};

const exportLogs = () => {
  return apiClient.get('/export/logs', { responseType: 'blob' });
};

const logService = {
  getLogs,
  exportLogs,
};

export default logService;