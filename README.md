# 🌐 Full Stack Authentication System - Frontend (React)

## 📌 Overview

The **Full Stack Authentication System (Frontend)** is a modern React-based user interface for handling authentication workflows such as registration, login, OTP verification, email notifications, and password recovery.

It connects seamlessly with the backend API to provide a smooth and secure user experience.

---

## 🚀 Features

* 📝 User Registration with form validation
* 🔐 Secure Login system
* 📧 Email OTP Verification UI
* 🔢 OTP input & validation screen
* 🔔 Real-time feedback (success/error messages)
* 🔑 Forgot Password & Reset Password UI
* 🔄 API integration with backend
* 📱 Responsive design

---

## 🛠️ Technologies Used

* React.js
* Axios (API calls)
* React Router DOM
* Tailwind CSS / CSS
* Context API / Redux (optional for state management)

---

## 📂 Project Structure

```id="f9a2x1"
Authentication-Frontend/
│
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Main pages (Login, Register, OTP, etc.)
│   ├── services/          # API calls (Axios)
│   ├── context/           # Auth state management (optional)
│   ├── utils/             # Helper functions
│   ├── App.js             # Main app component
│   └── index.js           # Entry point
│
├── public/
├── package.json
└── README.md
```

---

## ⚙️ Installation

### 1. Create React App

```bash id="g7m2p9"
npx create-react-app authentication-frontend
cd authentication-frontend
```

---

### 2. Install Dependencies

```bash id="v3k8d5"
npm install axios react-router-dom
```

(Optional)

```bash id="n1z7c4"
npm install tailwindcss
```

---

## ▶️ Running the App

```bash id="p8q4x6"
npm start
```

App will run on:
👉 http://localhost:3000

---

## 🔗 API Configuration

Create a file: `src/services/api.js`

```javascript id="h2m9k1"
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/auth",
});

export default API;
```

---

## 📄 Pages

* 🏠 **Login Page**
* 📝 **Register Page**
* 🔢 **OTP Verification Page**
* 🔑 **Forgot Password Page**
* 🔄 **Reset Password Page**

---

## 🔐 Authentication Flow

### 🧾 Registration

1. User fills registration form
2. Data sent to backend
3. OTP sent to email
4. Redirect to OTP verification page

---

### 🔢 OTP Verification

1. User enters OTP
2. Verify with backend
3. Account activated

---

### 🔐 Login

1. Enter email & password
2. Backend validates
3. Redirect to dashboard

---

### 🔑 Forgot Password

1. Enter email
2. Receive OTP
3. Reset password

---

## 🧪 Example Components

### 🔹 Login API Call

```javascript id="w6z2x8"
import API from "../services/api";

export const loginUser = async (data) => {
  return await API.post("/login", data);
};
```

---

### 🔹 Register API Call

```javascript id="k4d9p2"
export const registerUser = async (data) => {
  return await API.post("/register", data);
};
```

---

## 🎨 UI Suggestions

* Use Tailwind for clean UI
* Add loading spinners
* Show toast notifications
* Highlight validation errors

---

## 📈 Future Improvements

* JWT token storage & auto-login
* Protected routes (Private Routes)
* Dashboard UI
* Dark mode
* Multi-language support

---

## 🤝 Contributing

1. Fork the repo
2. Create a new branch
3. Commit changes
4. Push & open PR

---

## 📄 License

MIT License

---

## 👨‍💻 Author

Developed by **Your Name**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
