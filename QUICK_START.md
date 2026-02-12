# Quick Start Guide - Event Management System

## 🚀 How to Start the Application

### Prerequisites
✅ Java 17 is installed at: `C:\Java\jdk-17.0.14+7`
✅ Node.js and npm are installed
✅ Maven is installed

---

## Starting the Servers

### Method 1: Using the Startup Scripts (RECOMMENDED)

#### Start Backend:
1. Open PowerShell
2. Navigate to project directory:
   ```powershell
   cd "c:/Event Managemnt system/smart-intercollege-event-hackathon-manager/smart-intercollege-event-hackathon-manager"
   ```
3. Run the backend script:
   ```powershell
   .\start-backend.ps1
   ```
4. Wait for "Started EventManagerApplication" message
5. Backend will be running at: **http://localhost:8080**

#### Start Frontend:
1. Open a NEW PowerShell window
2. Navigate to project directory:
   ```powershell
   cd "c:/Event Managemnt system/smart-intercollege-event-hackathon-manager/smart-intercollege-event-hackathon-manager"
   ```
3. Run the frontend script:
   ```powershell
   .\start-frontend.ps1
   ```
4. Frontend will be running at: **http://localhost:5173**

---

### Method 2: Manual Commands

#### Backend:
```powershell
cd "c:/Event Managemnt system/smart-intercollege-event-hackathon-manager/smart-intercollege-event-hackathon-manager/backend"
$env:JAVA_HOME="C:\Java\jdk-17.0.14+7"
$env:Path="C:\Java\jdk-17.0.14+7\bin;" + $env:Path
mvn spring-boot:run -DskipTests
```

#### Frontend:
```powershell
cd "c:/Event Managemnt system/smart-intercollege-event-hackathon-manager/smart-intercollege-event-hackathon-manager/frontend"
npm run dev
```

---

## Accessing the Application

Once both servers are running:

1. **Open your browser**
2. **Go to:** http://localhost:5173
3. **You should see the login page**

### Test Accounts (if seeded):
- **Student:** student@example.com / password
- **Faculty:** faculty@example.com / password
- **Admin:** admin@example.com / password

---

## Troubleshooting

### Backend won't start - "Database locked" error:
```powershell
# Stop all Java processes
Get-Process | Where-Object {$_.ProcessName -like "*java*"} | Stop-Process -Force

# Remove lock file
Remove-Item "c:/Event Managemnt system/smart-intercollege-event-hackathon-manager/smart-intercollege-event-hackathon-manager/backend/data/eventdb.mv.db.lock" -Force -ErrorAction SilentlyContinue

# Try starting again
.\start-backend.ps1
```

### "java" command not found:
```powershell
$env:JAVA_HOME="C:\Java\jdk-17.0.14+7"
$env:Path="C:\Java\jdk-17.0.14+7\bin;" + $env:Path
java -version  # Should show 17.0.14
```

### Frontend won't start:
```powershell
cd frontend
npm install  # Reinstall dependencies
npm run dev
```

### Port already in use:
```powershell
# Find process using port 8080 (backend)
netstat -ano | findstr :8080

# Find process using port 5173 (frontend)
netstat -ano | findstr :5173

# Kill the process (replace PID with actual process ID)
Stop-Process -Id <PID> -Force
```

---

## Stopping the Servers

Press **Ctrl+C** in each PowerShell window running the servers.

---

## Project Structure

```
smart-intercollege-event-hackathon-manager/
├── backend/                    # Spring Boot application
│   ├── src/
│   ├── pom.xml
│   └── data/                   # H2 database files
├── frontend/                   # React + Vite application
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── start-backend.ps1          # Backend startup script
├── start-frontend.ps1         # Frontend startup script
└── QUICK_START.md            # This file
```

---

## Features Available

### Student Features:
- Browse events and hackathons
- Register for events
- Join hackathon teams
- View webinars
- Access certificates
- Community chat and forum

### Faculty Features:
- Create and manage events
- Create hackathons
- Upload content
- View analytics
- Approve content

### Admin Features:
- Manage colleges
- Manage users
- View system analytics
- Handle grievances

---

## API Endpoints

Backend API is available at: **http://localhost:8080/api/**

Key endpoints:
- `/api/auth/login` - User login
- `/api/auth/register` - User registration
- `/api/events` - Events management
- `/api/hackathons` - Hackathons management
- `/api/webinars` - Webinars management
- `/api/clubs` - Clubs management

---

## Development Tips

### Hot Reload:
- **Frontend:** Automatically reloads on file changes
- **Backend:** Restart required for code changes

### Database:
- **Type:** H2 (in-memory for development)
- **Console:** http://localhost:8080/h2-console
- **JDBC URL:** `jdbc:h2:file:./data/eventdb`
- **Username:** `sa`
- **Password:** `password`

### Logs:
- **Backend:** Check PowerShell window running backend
- **Frontend:** Check PowerShell window running frontend
- **Browser:** Open DevTools (F12) for frontend logs

---

## Next Steps

1. ✅ Start both servers using the scripts
2. ✅ Open http://localhost:5173 in your browser
3. ✅ Test the login functionality
4. ✅ Explore the features
5. ✅ Check the backend API responses

---

**🎉 You're all set! Happy coding!**
