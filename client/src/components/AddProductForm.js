import React, { useState } from 'react';
import productService from '../services/productService';
import { toast } from 'react-toastify';
import './AddProductForm.css';

const AddProductForm = ({ onProductAdded }) => {
  const [product, setProduct] = useState({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    threshold: 10,
    sku: '',
    barcode: '',
    expiryDate: '',
  });
  const [errors, setErrors] = useState({}); // State to hold validation errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    const skuPattern = /^[A-Z]{2,4}-\d{4,6}$/; // Example pattern: ABC-1234
    
    if (!skuPattern.test(product.sku)) {
      newErrors.sku = 'SKU format must be ABC-1234 (2-4 letters, a dash, 4-6 numbers).';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
        toast.error("Please fix the validation errors.");
        return; // Stop if validation fails
    }
    try {
      const productData = { ...product };
      if (!productData.expiryDate) {
        delete productData.expiryDate;
      }
      await productService.createProduct(productData);
      toast.success('Product added successfully!');
      setProduct({ name: '', category: '', price: 0, stock: 0, threshold: 10, sku: '', barcode: '', expiryDate: '' });
      setErrors({}); // Clear errors on success
      onProductAdded();
    } catch (err) {
      toast.error('Failed to add product. Please check the details.');
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <h3>Add New Product</h3>
      <form onSubmit={handleSubmit}>
        <input name="name" value={product.name} onChange={handleChange} placeholder="Product Name" required />
        <input name="category" value={product.category} onChange={handleChange} placeholder="Category" required />
        <div>
            <input name="sku" value={product.sku} onChange={handleChange} placeholder="SKU (e.g., ELEC-1001)" required />
            {errors.sku && <p className="validation-error">{errors.sku}</p>}
        </div>
        <input name="barcode" value={product.barcode} onChange={handleChange} placeholder="Barcode (Optional)" />
        <input name="price" type="number" value={product.price} onChange={handleChange} placeholder="Price" step="0.01" required />
        <input name="stock" type="number" value={product.stock} onChange={handleChange} placeholder="Stock Quantity" required />
        <input name="threshold" type="number" value={product.threshold} onChange={handleChange} placeholder="Low Stock Threshold" required />
        <input name="expiryDate" type="date" value={product.expiryDate} onChange={handleChange} />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProductForm;