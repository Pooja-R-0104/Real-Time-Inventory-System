import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';
import productService from '../services/productService';
import logService from '../services/logService';
import './ReportsDashboard.css';

const ReportsDashboard = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    const fetchDataForCharts = async () => {
      try {
        const [productsResponse, logsResponse] = await Promise.all([
          productService.getProducts(),
          logService.getLogs()
        ]);
        const products = productsResponse.data;
        const logs = logsResponse.data;

        // ---- Pie Chart Data ----
        const dataByCat = products.reduce((acc, product) => {
          const cat = product.category;
          if (!acc[cat]) acc[cat] = 0;
          acc[cat] += product.stock;
          return acc;
        }, {});
        setCategoryData(Object.keys(dataByCat).map(cat => ({
          name: cat,
          value: dataByCat[cat]
        })));

        // ---- Line Chart Data ----
        if (logs.length > 0 && products.length > 0) {
          const sortedLogs = [...logs].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          const finalTotalStock = products.reduce((sum, p) => sum + p.stock, 0);
          const totalChangeInLogs = sortedLogs.reduce((sum, log) => sum + log.quantityChange, 0);
          const startingStock = finalTotalStock - totalChangeInLogs;

          const trend = sortedLogs.reduce((acc, log, idx) => {
            const prevStock = idx === 0 ? startingStock : acc[idx - 1].totalStock;
            const currStock = prevStock + log.quantityChange;
            acc.push({
              date: new Date(log.createdAt).toLocaleString('en-IN', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              }),
              totalStock: currStock
            });
            return acc;
          }, []);

          setTrendData(trend.slice(-15));
        }
      } catch (error) {
        console.error("Failed to fetch data for reports", error);
      }
    };

    fetchDataForCharts();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // ✅ Dark/light mode-aware Tooltip
  const isDarkMode = window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const CustomLineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0px 2px 10px rgba(0,0,0,0.15)'
          }}
        >
          <p><strong>{label}</strong></p>
          <p>Total Stock: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="reports-container">
        <h2>Reports</h2>
        <div className="charts-grid">
          <div className="chart-wrapper">
            <h3>Inventory by Category</h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={130}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-wrapper">
            <h3>Total Stock Trend</h3>
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<CustomLineTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalStock"
                    name="Total Stock"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p>Not enough data for a trend. Please add, update, or delete some products to see a trend.</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportsDashboard;
