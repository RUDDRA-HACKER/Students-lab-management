# 🚀 Project Execution Guide

This guide provides commands to run the **Student Lab Management System**, including the Spring Boot backend and the Vanilla JS frontend.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- **Java 17** or higher
- **Node.js** (for serving the frontend)
- **Maven** (optional, as `mvnw` is included)

---

## 🖥️ Backend Setup (Spring Boot)

The backend is located in the `Student_labmangment_backend` directory.

### 1. Run the Backend
Use the Maven Wrapper to start the Spring Boot application:

```powershell
.\mvnw.cmd spring-boot:run
```

- **API Base URL:** `http://localhost:8080/api`
- **Health Check:** `http://localhost:8080/api/health`
- **H2 Console:** `http://localhost:8080/h2-console`

### 2. Optional: Run with external MySQL
If you prefer MySQL installed locally, set env vars before starting:

```powershell
$env:SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/student_lab_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:SPRING_DATASOURCE_DRIVER_CLASS_NAME="com.mysql.cj.jdbc.Driver"
$env:SPRING_DATASOURCE_USERNAME="root"
$env:SPRING_DATASOURCE_PASSWORD="your_password"
.\mvnw.cmd spring-boot:run
```

---

## 🌐 Frontend Setup (Vanilla JS)

The frontend is located in the `Student_labmangment_frontend` directory. Since it uses vanilla JavaScript, you can serve it using any simple web server.

### Option 1: Using `npx serve` (Recommended)
From the root or the frontend directory, run:

```powershell
# If in the root directory:
npx serve Student_labmangment_frontend

# If inside Student_labmangment_frontend:
npx serve
```

### Option 2: Using JetBrains Built-in Server / Any Static Server
Serve `index.html` from `Student_labmangment_frontend` using your preferred static file server.

### Option 3: Direct Open
You can also simply double-click `index.html` to open it in your browser, but some features (like API calls) might be blocked by CORS or origin restrictions depending on your browser settings.

---

## 🔍 Troubleshooting

- **Database Connection Issues:** Verify backend defaults to H2, or confirm your MySQL env vars are correct.
- **Port Conflicts:** If port `8080` is already in use, change `server.port` in `application.properties`.
- **CORS Errors:** Backend allows `http://localhost:3000` and `http://localhost:5173`. If your frontend runs on a different port, update `app.cors.allowed-origins`.

---

## 📝 Common Commands Summary

| Task | Command | Directory |
| :--- | :--- | :--- |
| **Run Backend** | `./mvnw.cmd spring-boot:run` | `Student_labmangment_backend` |
| **Clean Backend**| `./mvnw.cmd clean` | `Student_labmangment_backend` |
| **Run Frontend** | `npx serve` | `Student_labmangment_frontend` |
