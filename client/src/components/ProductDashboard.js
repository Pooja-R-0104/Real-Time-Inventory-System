import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import productService from '../services/productService';
import notificationService from '../services/notificationService';
import AddProductForm from './AddProductForm';
import EditProductModal from './EditProductModal';
import BulkUpload from './BulkUpload';
import { toast } from 'react-toastify';
import './ProductDashboard.css';

const ProductDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectMode, setSelectMode] = useState(false);

  const fetchProducts = useCallback(async (search = '') => {
    try {
      if (products.length === 0) setLoading(true); 
      const response = await productService.getProducts(search);
      setProducts(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch products.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [products.length]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(searchTerm);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchProducts]);

  useEffect(() => {
    if(user) {
        notificationService.requestPermission();
    }
  }, [user]);
  
  const handleRowClick = (productId) => {
    if (!selectMode) return;
    setSelectedProducts(prevSelected =>
      prevSelected.includes(productId)
        ? prevSelected.filter(id => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const handleDeleteMultiple = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} selected products?`)) {
      try {
        await productService.deleteMultipleProducts(selectedProducts);
        toast.success(`${selectedProducts.length} products deleted successfully!`);
        setSelectedProducts([]);
        setSelectMode(false);
        fetchProducts(searchTerm);
      } catch (error) {
        toast.error('Failed to delete selected products.');
      }
    }
  };
  
  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    setSelectedProducts([]);
  };

  const handleExport = async () => {
    try {
      const response = await productService.exportProducts();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Products exported successfully!');
    } catch (error) {
      toast.error('Failed to export products.');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(productId);
        setProducts(prevProducts => 
          prevProducts.filter(product => product.id !== productId)
        );
        toast.success('Product deleted successfully!');
      } catch (err) {
        toast.error('Failed to delete product.');
      }
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleUpdate = async (updatedProductData) => {
    try {
        const response = await productService.updateProduct(
            updatedProductData.id, 
            updatedProductData
        );
        const updatedProduct = response.data;
        handleCloseModal();
        await fetchProducts(searchTerm);
        notificationService.checkAndNotify(updatedProduct);
        toast.success('Product updated successfully!');
    } catch (err) {
        toast.error('Failed to update product.');
    }
  };
  
  const handleAdd = async () => { await fetchProducts(searchTerm); }
  const handleUpload = async () => { await fetchProducts(searchTerm); }

  if (error && products.length === 0) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="error">{error}</div>
        </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="dashboard-container">
        <h2>Product Dashboard</h2>
        
        {user && user.role === 'Admin' && (
          <>
            <AddProductForm onProductAdded={handleAdd} />
            <BulkUpload onUploadSuccess={handleUpload} />
          </>
        )}
        
        <div className="dashboard-header">
            <div className="search-container">
                <input 
                    type="text"
                    placeholder="Search by name, SKU, category, barcode..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {user && user.role === 'Admin' && (
              <div className="header-actions">
                {!selectMode ? (
                  <button onClick={toggleSelectMode} className="select-button">Select</button>
                ) : (
                  <>
                    <button onClick={toggleSelectMode} className="cancel-button">Cancel</button>
                    {selectedProducts.length > 0 && (
                      <button onClick={handleDeleteMultiple} className="delete-selected-button">
                        Delete ({selectedProducts.length})
                      </button>
                    )}
                  </>
                )}
                <button onClick={handleExport} className="export-button">Export CSV</button>
              </div>
            )}
        </div>
        
        {loading ? (
          <div>Loading products...</div>
        ) : (
          <table className="product-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>SKU</th>
                <th>Barcode</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Threshold</th>
                <th>Expiry Date</th>
                {user && user.role === 'Admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr 
                  key={product.id}
                  onClick={() => handleRowClick(product.id)}
                  className={`
                    ${product.stock <= product.threshold ? 'low-stock-row' : ''}
                    ${selectedProducts.includes(product.id) ? 'selected-row' : ''}
                    ${selectMode ? 'selectable' : ''}
                  `}
                >
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.sku}</td>
                  <td>{product.barcode || 'N/A'}</td>
                  <td>${product.price ? product.price.toFixed(2) : '0.00'}</td>
                  <td>{product.stock}</td>
                  <td>{product.threshold}</td>
                  <td>{product.expiryDate || 'N/A'}</td>
                  {user && user.role === 'Admin' && (
                    <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="edit-button"
                        onClick={() => handleEditClick(product)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {isModalOpen && (
          <EditProductModal 
              product={editingProduct}
              onClose={handleCloseModal}
              onUpdate={handleUpdate}
          />
        )}
      </div>
    </motion.div>
  );
};

export default ProductDashboard;