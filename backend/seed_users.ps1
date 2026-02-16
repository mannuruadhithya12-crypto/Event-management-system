$headers = @{ "Content-Type" = "application/json" }

Write-Host "Registering Dean..."
$deanBody = @{
    name = "Dean Smith"
    email = "dean@test.com"
    password = "password"
    role = "dean_of_campus"
    collegeId = "college-1"
} | ConvertTo-Json
try { 
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method Post -Headers $headers -Body $deanBody 
    Write-Host "Dean Registered: $($response.message)"
} catch { 
    Write-Host "Dean Registration Failed: $($_.Exception.Message)"
}

Write-Host "Registering Coordinator..."
$coordBody = @{
    name = "Coord Jones"
    email = "coord@test.com"
    password = "password"
    role = "faculty_coordinator"
    collegeId = "college-1"
    department = "Computer Science"
} | ConvertTo-Json
try { 
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method Post -Headers $headers -Body $coordBody 
    Write-Host "Coordinator Registered: $($response.message)"
} catch { 
    Write-Host "Coordinator Registration Failed: $($_.Exception.Message)"
}

Write-Host "Registering HOD..."
$hodBody = @{
    name = "Dr. HOD"
    email = "hod@test.com"
    password = "password"
    role = "hod"
    collegeId = "college-1"
    department = "Computer Science"
    directorRole = "ROLE_HOD"
} | ConvertTo-Json
try { 
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method Post -Headers $headers -Body $hodBody
    Write-Host "HOD Registered: $($response.message)"
} catch { 
    Write-Host "HOD Registration Failed: $($_.Exception.Message)"
}

Write-Host "Registering Student..."
$studentBody = @{
    name = "Student Joe"
    email = "student@test.com"
    password = "password"
    role = "student"
    collegeId = "college-1"
    year = 2
    department = "Computer Science"
} | ConvertTo-Json
try { 
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method Post -Headers $headers -Body $studentBody
    Write-Host "Student Registered: $($response.message)"
} catch { 
    Write-Host "Student Registration Failed: $($_.Exception.Message)"
}
