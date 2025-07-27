import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import logService from '../services/logService';
import { toast } from 'react-toastify';
import './InventoryLogsPage.css';

const InventoryLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '' });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await logService.getLogs(filters);
      setLogs(response.data);
    } catch (error) {
      console.error("Failed to fetch logs", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleExport = async () => {
    try {
      const response = await logService.exportLogs();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'logs.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Logs exported successfully!');
    } catch (error) {
      toast.error('Failed to export logs.');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="logs-container">
        <h2>Inventory Movement Logs</h2>

        <div className="logs-header">
            <div className="filters-container">
              <select name="type" value={filters.type} onChange={handleFilterChange}>
                <option value="">All Actions</option>
                <option value="CREATE">Create</option>
                <option value="UPDATE">Update</option>
                <option value="DELETE">Delete</option>
              </select>
            </div>
            <button onClick={handleExport} className="export-button">Export as CSV</button>
        </div>

        {loading ? (
          <div>Loading logs...</div>
        ) : (
          <table className="logs-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Product</th>
                <th>SKU</th>
                <th>User</th>
                <th>Action</th>
                <th>Quantity Change</th>
                <th>Stock After</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{formatDate(log.createdAt)}</td>
                  <td>{log.Product ? log.Product.name : 'N/A'}</td>
                  <td>{log.Product ? log.Product.sku : 'N/A'}</td>
                  <td>{log.User ? log.User.name : 'N/A'}</td>
                  <td><span className={`log-type ${log.type.toLowerCase()}`}>{log.type}</span></td>
                  <td>{log.quantityChange}</td>
                  <td>{log.stockAfter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
};

export default InventoryLogsPage;