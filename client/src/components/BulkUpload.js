import React, { useState } from 'react';
import productService from '../services/productService';
import './BulkUpload.css';

const BulkUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file first.');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await productService.uploadProductsCSV(formData);
            setMessage(response.data.message);
            onUploadSuccess(); // Refresh the product list
        } catch (error) {
            setMessage('Upload failed. Please check the file format.');
            console.error(error);
        }
    };

    return (
        <div className="upload-container">
            <h3>Bulk Upload Products</h3>
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload CSV</button>
            {message && <p>{message}</p>}
        </div>
    );
};
export default BulkUpload;