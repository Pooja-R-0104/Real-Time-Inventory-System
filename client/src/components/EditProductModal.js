import React, { useState, useEffect } from 'react';
import './EditProductModal.css';

const EditProductModal = ({ product, onClose, onUpdate }) => {
  // Ensure expiryDate is formatted correctly for the date input
  const formatDate = (date) => {
    if (!date) return '';
    // The date from the database is already in 'YYYY-MM-DD' format
    return date;
  };

  const [formData, setFormData] = useState({ ...product, expiryDate: formatDate(product.expiryDate) });

  useEffect(() => {
    setFormData({ ...product, expiryDate: formatDate(product.expiryDate) });
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = { ...formData };
    if (!submissionData.expiryDate) {
        submissionData.expiryDate = null;
    }
    onUpdate(submissionData);
  };

  if (!product) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Product</h2>
        <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input name="name" value={formData.name} onChange={handleChange} />
            <label>Category</label>
            <input name="category" value={formData.category} onChange={handleChange} />
            <label>SKU</label>
            <input name="sku" value={formData.sku} onChange={handleChange} />
            <label>Barcode</label>
            <input name="barcode" value={formData.barcode || ''} onChange={handleChange} />
            <label>Price</label>
            <input name="price" type="number" value={formData.price} onChange={handleChange} step="0.01" />
            <label>Stock</label>
            <input name="stock" type="number" value={formData.stock} onChange={handleChange} />
            <label>Threshold</label>
            <input name="threshold" type="number" value={formData.threshold} onChange={handleChange} />
            <label>Expiry Date</label>
            <input name="expiryDate" type="date" value={formData.expiryDate} onChange={handleChange} />
            <div className="modal-actions">
                <button type="submit" className="update-button">Update Product</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;