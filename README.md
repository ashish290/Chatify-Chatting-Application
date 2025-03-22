# Chatify - Real-Time Chat Application

🚀 **Chatify** is a versatile real-time chat application built for both personal messaging and group conversations. With powerful search capabilities, secure JWT-based authentication, and the ability to share files, photos, and emojis, Chatify delivers a seamless communication experience.

## ✨ Features

- 🔹 **Personal Messaging with Search** – Quickly find and connect with contacts to send private messages.
- 🔹 **Group Chat** – Create and manage group conversations by adding or removing participants.
- 🔹 **File & Photo Sharing** – Easily share files, photos, and emojis within your chats.
- 🔹 **Fully Authorized with JWT** – Enjoy secure access and sessions through JWT-based authentication.
- 🔹 **User Profile Management** – Change and update your profile information whenever you want.
- 🔹 **Real-Time Communication** – Powered by Socket.io for instant messaging.
- 🔹 **Strict Type Safety** – Developed with TypeScript to ensure robust, error-free code.

## 🛠️ Tech Stack

### **Frontend:**

- ⚛️ **React** – For building interactive user interfaces.
- 🎨 **ShadCN UI & Tailwind CSS** – Utilized for modern, responsive design and utility-first styling. Tailwind CSS is integrated to build custom layouts quickly and maintain a consistent design system.
- 🏗 **Zustand** – Lightweight state management for seamless interactions.
- 🚀 **TypeScript** – Providing strict type-checking and reliability.

### **Backend:**

- 🟢 **Node.js with TypeScript** – A modern, type-safe runtime environment.
- 🗄 **MongoDB** – Used as the primary database for storing user, chat, and message data (often via Mongoose for schema-based solutions).
- 🔌 **Socket.io** – Enabling real-time, bidirectional communication.
- 🔐 **JWT Authentication** – Ensuring secure user sessions and data.
- 🛠 **Multer** – Handling file uploads for sharing photos and files.
- 🏗 **Express.js** – A robust framework for building the API.
- ☁️ **Render** – Backend hosting for scalability and performance.
- 🚀 **Netlify** – Frontend deployment for blazing-fast delivery.

## 📂 Folder Structure

📦 chatify
-├── 📂 frontend          # React frontend with Tailwind CSS, ShadCN UI, and Zustand
-├── 📂 backend           # Node.js & TypeScript backend services
-│   ├── 📂 controllers   # Express controllers & socket event handlers
-│   ├── 📂 middleware    # JWT authentication and other middleware
-│   ├── 📂 models        # Mongoose models for chats, messages, and users
-│   ├── 📂 routes        # API routes and socket endpoints
-│   ├── 📂 utils         # Utility functions and helpers
-├── 📄 README.md         # Project documentation

## 🖥️ Real-Time Features Breakdown

### **Login**
![Screenshot 2025-03-14 203043](https://github.com/user-attachments/assets/5d48f6dc-74c0-4936-8661-1140f9ee708f)

### **SignUp**
![Screenshot 2025-03-14 203106](https://github.com/user-attachments/assets/ea6b0b73-6a33-43d4-b4b8-9678ae5f06e3)

### **Profile-Section**
![Screenshot 2025-03-14 210109](https://github.com/user-attachments/assets/3a8d053e-fdc5-4728-9a1b-9c63c68101df)

### **Dashboard**
![Screenshot 2025-03-14 210211](https://github.com/user-attachments/assets/1a43e98a-8ef4-4814-a3d5-b8663e8a255c)

- **Overview:** Displays user activities, notifications, recent chats, and profile updates.
- **Widgets:** Quick access to personal messages, group chats, and file-sharing activities.
- **Future Enhancements:** Integration of summary graphs and analytics (with placeholder images to be added).

### **One-to-One Chat**
![Screenshot 2025-03-14 210952](https://github.com/user-attachments/assets/198d1035-7656-404d-93f3-f302d5856204)

- **Personal Messaging:** Secure direct messaging with robust search functionality to find contacts quickly.
- **File & Photo Sharing:** Attach and preview files, photos, and emojis directly in your conversation.
- **User Experience:** Clean, real-time messaging interface for a focused conversation experience.

### **Group Chat**
![Screenshot 2025-03-14 212633](https://github.com/user-attachments/assets/2d56ada2-757d-4770-9140-dcbcdeb8a0c5)

- **Dynamic Group Creation:** Easily create group chats, add or remove participants, and manage group settings.
- **Real-Time Updates:** Immediate broadcast of messages, file shares, and emoji reactions to all group members.
- **Enhanced Media Support:** Future plans include adding group chat banners and in-chat photo previews.

## 🌍 Deployment

- 🚀 **Frontend:** Deployed on **Netlify** for fast, reliable access.
- 🚀 **Backend:** Hosted on **Render**, ensuring scalability and robustness.

## 🔮 Future Plans

- 🎤 **Audio & Video Calls:** Integrate WebRTC for real-time voice and video communication.
- 📎 **Advanced File Sharing:** Enhance the file sharing experience with support for larger files and media previews.
- 💬 **Enhanced Emoji Reactions:** Allow users to react to messages with a wide range of emojis.
- 📸 **Dashboard & Chat Visuals:** Add detailed screenshots and visual columns for the dashboard, one-to-one chatting, and group chatting.

---

### ⭐ If you like Chatify, please consider giving it a star! ⭐

This README outlines the core features and technical foundation of Chatify, highlighting its real-time messaging powered by Socket.io, secure JWT authentication, and MongoDB as the primary database. Enjoy building and chatting in real time!
