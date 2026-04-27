# Student Management Backend

This backend now runs locally without Docker using an embedded **H2** database by default.

## Run the backend

```powershell
.\mvnw.cmd spring-boot:run
```

## API base URL

- `http://localhost:8080/api`

## Health check

- `GET /api/health`

## Local database

- Default DB: file-based H2 (`./data/student_lab_db`)
- H2 Console: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:file:./data/student_lab_db`
  - User: `sa`
  - Password: *(empty)*

## Optional: use external MySQL (no Docker required)

Set environment variables before running:

```powershell
$env:SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/student_lab_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:SPRING_DATASOURCE_DRIVER_CLASS_NAME="com.mysql.cj.jdbc.Driver"
$env:SPRING_DATASOURCE_USERNAME="root"
$env:SPRING_DATASOURCE_PASSWORD="your_password"
.\mvnw.cmd spring-boot:run
```

## Search API (for search bar)

- `GET /api/search/equipment?q=microscope`
- `GET /api/search/equipment?query=microscope`
- `GET /api/search/equipment?search=microscope`
- `GET /api/search/equipment?term=microscope`
- `GET /api/search?q=microscope` (route alias)
- `GET /api/equipment?q=microscope` (backward-compatible)

## Frontend search bar hookup

Use this request from your search input handler:

```javascript
const API_BASE = "http://localhost:8080/api";

async function searchEquipment(text) {
  const url = `${API_BASE}/search/equipment?q=${encodeURIComponent(text || "")}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Search failed");
  return await response.json();
}
```

## Frontend origins allowed by CORS

- `http://localhost:3000`
- `http://localhost:5173`
