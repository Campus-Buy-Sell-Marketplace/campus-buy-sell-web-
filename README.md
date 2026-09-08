# Campus Marketplace - Web

The **Campus Marketplace Web** is the web frontend of the Campus Marketplace platform, built to help students buy and sell products within their campus community.

## Features

* User registration and login
* Browse product listings
* Search and filter products
* View product details
* Create, edit, and delete listings
* Upload product images
* View user/seller information
* Responsive web interface

## Tech Stack

* **Frontend:** React
* **Backend:** Node.js + Express
* **Database:** MongoDB
* **Authentication:** JWT
* **Image Storage:** External/Cloud Storage
* **API:** REST API

## Project Structure

```text
web/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── utils/
│   └── assets/
├── App.js / App.jsx
├── package.json
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd web
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file and add the backend API URL:

```env
VITE_API_BASE_URL=<backend-api-url>
```

Do not commit `.env` files or sensitive credentials.

### 4. Run the Web App

```bash
npm run dev
```

## Backend

The web application communicates with the **Campus Marketplace Backend** through REST APIs for authentication, listings, users, and other marketplace operations.

## Project Status

**Status:** In Development

Developed as part of the **OJT Semester 3 — Product Development** project.

#COMPLETE PROJECT DOCUMENTATION LINK : https://drive.google.com/file/d/1miNHk4CkprCCCL1-ocQIEOyejaK9Fbui/view?usp=sharing
