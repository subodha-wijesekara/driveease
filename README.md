# 🏎️ DriveEase | Premium Vehicle Rentals

DriveEase is a state-of-the-art vehicle rental platform designed with a high-performance, industrial aesthetic. Engineered for reliability and built with modern technologies, it provides a seamless experience for customers to browse a premium fleet and manage their bookings.

---

## 🚀 Key Features

- **Premium Fleet Catalog**: Dynamically categorized vehicles including Sedans, SUVs, Performance cars, and Motorcycles.
- **Smart Booking System**: Real-time availability checking and automated rental duration calculations.
- **Dynamic Specifications**: Detailed vehicle attributes (Seats, Fuel Type, Transmission) powered by a robust backend.
- **Modern User Authentication**: Secure JWT-based authentication for users and administrators.
- **Admin Dashboard**: Comprehensive management of vehicle inventory and booking status.
- **High-Performance Design**: A Toyota-inspired, high-contrast UI (Red/Black/White) optimized for all devices.

---

## 🛠️ Technology Stack

### **Backend**
- **Framework**: Spring Boot 3.2+
- **Database**: MySQL 8.0
- **Security**: Spring Security & JWT
- **Persistence**: Spring Data JPA (Hibernate)
- **Utilities**: Lombok, SpringDoc (Swagger UI)

### **Frontend**
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS & Lucide Icons
- **State Management**: React Context API
- **Data Fetching**: Axios & React Query

---

## 🏁 Getting Started

### **Prerequisites**
- **Java 17+**
- **Node.js 18+**
- **MySQL 8.0**

### **1. Database Setup**
1. Create a database named `driveease_rentals`:
   ```sql
   CREATE DATABASE driveease_rentals;
   ```
2. Update database credentials in `backend/src/main/resources/application.yml` if necessary.

### **2. Start Backend Server**
```bash
cd backend
./mvnw spring-boot:run
```
- Base URL: `http://localhost:8080/api`
- Swagger Docs: `http://localhost:8080/api/swagger-ui.html`

### **3. Start Frontend Server**
```bash
cd frontend
npm install
npm run dev
```
- App URL: `http://localhost:3000`

---

## 🔐 Default Admin Credentials
For testing and management:
- **Email**: `admin@driveease.com`
- **Password**: `Admin@1234`

---

## 📁 Project Structure

```text
├── backend/            # Spring Boot API
│   ├── src/            # Java Source & Resources
│   └── pom.xml         # Maven Dependencies
├── frontend/           # Next.js Application
│   ├── src/            # App Components & Logic
│   └── package.json    # Frontend Dependencies
└── .gitignore          # Unified Git configuration
```

---

## 📝 License
This project is developed for educational and professional demonstration purposes.

---

*Engineered with precision. Driven by passion.*
