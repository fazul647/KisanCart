# KisanCart
# 🌾 KisanCart – Farmer Marketplace Platform

## 🚀 Overview

KisanCart is a full-stack web application that connects farmers directly with buyers.
It eliminates middlemen by allowing farmers to list their crops and buyers to purchase fresh produce directly.

The platform also includes AI assistance, messaging, and order tracking to enhance user experience.

---

## ✨ Features

### 👤 Authentication

* User Registration & Login (Farmer / Buyer roles)
* JWT-based Authentication
* Secure Password Handling

### 🧑‍🌾 Farmer Features

* Add & manage crops
* View **My Products**
* Track orders (pending, shipped, delivered)
* Chat with buyers
* Upload profile image

### 🛒 Buyer Features

* Browse products
* Search & filter farmers
* Add to cart & place orders
* View order history
* Chat with farmers

### 🤖 AI Assistant

* Smart chatbot for agriculture queries
* Helps farmers with crop suggestions and fertilizers

### 💬 Messaging System

* Real-time communication between farmer and buyer

### 📊 Dashboard

* Separate dashboards for farmer & buyer
* Order statistics overview

### 🔐 Password Reset

* Email-based password reset system (Nodemailer)

---

## 🛠️ Tech Stack

### Frontend

* React.js (Vite)
* Bootstrap 5
* Axios

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose

### Other Tools

* JWT Authentication
* Multer (image upload)
* Nodemailer (email service)

---

## 📁 Project Structure

```
KisanCart/
├── client/        # React frontend
├── server/        # Node backend
├── uploads/       # Profile images (local)
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/fazul647/KisanCart.git
cd KisanCart
```

### 2️⃣ Setup Backend

```bash
cd server
npm install
```

Create `.env` file:

```
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
```

Run server:

```bash
npm start
```

---

### 3️⃣ Setup Frontend

```bash
cd client
npm install
```

Create `.env`:

```
VITE_API_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

---

## 🌐 Deployment

* Frontend: Vercel
* Backend: (Recommended: Render / Railway)

---

## 📸 Screenshots

👉 Add your project screenshots here:

* Home Page
* Dashboard
* Farmers Page
* Profile Page

---

## 🚧 Future Improvements

* Cloudinary integration for image upload
* Payment gateway integration
* Ratings & reviews system
* Real-time notifications

---

## 👨‍💻 Author

**Shaik Fazul Ahammad**
📧 [fazulahammads@gmail.com](mailto:fazulahammads@gmail.com)

---

## ⭐ Conclusion

KisanCart is a scalable MERN stack project demonstrating real-world features like authentication, role-based access, AI integration, and full CRUD operations.

---

⭐ If you like this project, give it a star!
