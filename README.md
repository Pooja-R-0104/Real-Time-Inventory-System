# Real-Time Inventory Management System

A full-stack, feature-rich inventory management system designed for hackathon submission. This application provides a complete solution for businesses to manage products, track inventory movements, and receive real-time alerts, all wrapped in a polished, modern UI with a professional login system.

---
## ✨ Key Features

### Core Functionality
* **Secure Role-Based Authentication:** Full login/registration flow with distinct **Admin** and **Staff** roles.
* **Dynamic UI:** The interface automatically hides sensitive controls (Add, Edit, Delete) from Staff users.
* **Comprehensive Product Dashboard:** Full **CRUD** (Create, Read, Update, Delete) functionality for all products.
* **Powerful Search:** Instantly search products by name, SKU, category, or barcode.
* **Multi-Item Management:** A clean "selection mode" allows Admins to delete multiple products at once for efficient management.

### Alerts & Reporting
* **Automated Alerts:**
    * **Browser Notifications:** Real-time push notifications when stock drops below its threshold.
    * **Email Alerts:** Automated emails sent to the Admin's address upon low-stock events.
* **Dynamic Reporting:** A dedicated reports page with interactive charts:
    * **Stock Distribution Pie Chart:** Visualizes inventory count by category.
    * **Stock Trend Line Chart:** Tracks the history of total inventory over time.
* **Complete Audit Trail:**
    * **Inventory Movement Logging:** Every create, update, or delete action is logged with user details and timestamps.
    * **Interactive Log Viewer:** A dedicated page to view and filter all historical logs by action type.

### UI/UX & Advanced Features
* **Bulk CSV Import/Export:** Admins can upload a CSV file to add products in bulk and export the product list or logs.
* **Polished UI/UX:**
    * **Dark/Light Theme:** A sleek, modern UI with a persistent theme toggle.
    * **Animations:** Smooth page transitions and subtle hover effects.
    * **Toast Notifications:** Professional feedback for all user actions.
* **Advanced Form Validation:** Real-time validation for password strength, password matching, and SKU format.

---
## 🛠️ Tech Stack

* **Frontend:** React.js, React Router, Axios, Framer Motion, Recharts, React Toastify
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL with Sequelize ORM
* **Authentication:** JWT (JSON Web Tokens) + bcrypt
* **File Handling:** Multer, CSV-Parser, json2csv
* **Emailing:** Nodemailer with Ethereal

---
## ⚙️ Setup and Installation

To run this project locally, follow these steps:

### 1. Prerequisites
-   Node.js & npm
-   PostgreSQL

### 2. Backend Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd Real-Time-Inventory-System/server

# Install dependencies
npm install

# Create a .env file and add your credentials:
# DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/inventory_system"
# JWT_SECRET="yourSuperSecretKey"

# Start the server (this will also create the database tables)
npm start
```

### 3. Frontend Setup
```bash
# Navigate to the client directory from the root
cd ../client

# Install dependencies
npm install

# Create a .env file with this line:
# DANGEROUSLY_DISABLE_HOST_CHECK=true

# Start the React application
npm start
```

---
## 🧪 Login Instructions

> ⚠️ This system utilizes **Role-Based Access Control** — Admin and Staff users have distinct permissions and registration methods.

### 🔐 Admin Access

Admin accounts provide full control over the inventory system.

* **Registration:** Admin accounts **must be registered via a backend API endpoint (e.g., using Postman)**. There is no direct frontend registration for Admin users for security reasons.
* **Capabilities:** Once logged in, Admins can:
    * **Add, edit, and delete** products.
    * **Import/Export** product data and audit logs in bulk (CSV).
    * Access and filter all **inventory movement logs**.
    * View all **reports and interactive charts**.
    * Receive **email and browser notifications** for low stock.

🧾 Example Admin Credentials (used in the demo):
```bash
Email: debug.admin@test.com
Password: DebugPassword123

### 👤 Staff Access

Staff accounts are designed for daily operational use with view-only permissions for sensitive actions.

* **Registration:** Staff users can **register themselves directly from the frontend login page**.
* **Capabilities:** Once logged in, Staff users can:
    * **View** product listings and details.
    * **View** reports, charts, and audit logs.
    * Receive **browser notifications** for low stock.
* **Restricted Actions:** Staff users **cannot**:
    * **Add, edit, or delete** products.
    * **Import or Export** data.

🧾 Example Staff Credentials:
```bash
Email: example3@test.com
Password: test12345
