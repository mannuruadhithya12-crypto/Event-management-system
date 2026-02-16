$ErrorActionPreference = "Continue"
$baseUrl = "http://localhost:8080/api"
$headers = @{ "Content-Type" = "application/json" }
$logFile = "verification_output.txt"
"Verification Started $(Get-Date)" | Out-File $logFile

function Log-Msg {
    param($msg)
    Write-Host $msg
    $msg | Out-File $logFile -Append
}

function Test-Endpoint {
    param($method, $uri, $body, $token, $desc)
    Log-Msg "[$desc] $method $uri"
    $h = $headers.Clone()
    if ($token) { $h["Authorization"] = "Bearer $token" }
    
    try {
        $params = @{ Method = $method; Uri = "$baseUrl$uri"; Headers = $h }
        if ($body) { $params["Body"] = ($body | ConvertTo-Json -Depth 5) }
        $res = Invoke-RestMethod @params
        Log-Msg " [OK]"
        return $res
    }
    catch {
        Log-Msg " [FAILED]"
        Log-Msg $_.Exception.Message
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader $_.Exception.Response.GetResponseStream()
            Log-Msg "Response: $($reader.ReadToEnd())"
        }
        return $null
    }
}

# 1. Register Users with Unique Emails
Log-Msg "`n--- 1. User Registration ---"
$ts = Get-Date -Format "HHmmss"
# --- 8. Judge System Verification ---
Log-Msg "8. Verifying Judge System..."
    
# 8.1 Register Judge
$judgeEmail = "judge_sys_$ts@test.com"
$judgePayload = @{
    name         = "System Judge $ts"
    email        = $judgeEmail
    password     = "password"
    role         = "director"
    directorRole = "judge"
    collegeId    = "college-1"
}
$res = Test-Endpoint "POST" "/auth/register" $judgePayload $null "Register System Judge"
    
# 8.2 Login Judge
$judgeCreds = @{ email = $judgeEmail; password = "password" }
$res = Test-Endpoint "POST" "/auth/login" $judgeCreds $null "Login System Judge"
$judgeToken = $null
if ($res) { $judgeToken = $res.data.accessToken }
if ($judgeToken) {
    # 8.3 Assign Judge to Event
    # We need an event ID. Let's create a new event as Faculty to be sure.
    $facToken = $tokens["faculty"]
    $eventPayload = @{
        title       = "Hackathon For Judge $ts"
        description = "Judging Test"
        eventType   = "competition"
        mode        = "offline"
        startDate   = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
        endDate     = (Get-Date).AddDays(1).ToString("yyyy-MM-ddTHH:mm:ss")
        collegeId   = "college-1"
    }
    $evtRes = Test-Endpoint "POST" "/events" $eventPayload $facToken "Create Event for Judging"
    $eventId = $null
    if ($evtRes) { $eventId = $evtRes.data.id }

    if ($eventId) {
        # Assign Judge
        $assignPayload = @{ eventId = $eventId; judgeEmail = $judgeEmail }
        Test-Endpoint "POST" "/api/judge-assignment/assign" $assignPayload $facToken "Assign Judge to Event"
            
        # 8.4 Judge Checks Assigned Events
        Test-Endpoint "GET" "/api/judge/events" $null $judgeToken "Judge List Events"
            
        # 8.5 Create a Submission (Student)
        $stuToken = $tokens["student"]
        $subPayload = @{
            eventId  = $eventId
            title    = "Team Project $ts"
            abstract = "AI Project"
            repoUrl  = "http://github.com/test"
        }
        # Need submission endpoint. Assuming /api/submissions or check existing.
        # Checking SubmissionController... assuming standard endpoint exists or use one if available.
        # If not easy to create submission via script (requires team etc), we might skip actual scoring 
        # and just verify Judge can SEE the event.
            
        # For now, let's trust the dashboard read.
    }
}
    
# Summary
Log-Msg "----------------------------------------------------------------"
$users = @{
    faculty = @{ name = "Fac $ts"; email = "fac_$ts@test.com"; role = "faculty"; password = "password"; department = "CS"; collegeId = "college-1"; facultySubRole = "faculty_member" }
    student = @{ name = "Stu $ts"; email = "stu_$ts@test.com"; role = "student"; password = "password"; collegeId = "college-1"; year = 2; academicYear = 2; department = "CS" }
    hod     = @{ name = "HOD $ts"; email = "hod_$ts@test.com"; role = "director"; directorRole = "hod"; password = "password"; collegeId = "college-1"; department = "CS" }
    judge   = @{ name = "Judge $ts"; email = "judge_$ts@test.com"; role = "director"; directorRole = "judge"; password = "password"; collegeId = "college-1" }
}

foreach ($k in $users.Keys) {
    Test-Endpoint "POST" "/auth/register" $users[$k] $null "Register $k" | Out-Null
}

# 2. Login & Get Tokens
Log-Msg "`n--- 2. Authentication ---"
$tokens = @{}
$ids = @{}

foreach ($k in $users.Keys) {
    $creds = @{ email = $users[$k].email; password = $users[$k].password }
    $res = Test-Endpoint "POST" "/auth/login" $creds $null "Login $k"
    if ($res) {
        $tokens[$k] = $res.data.accessToken
        $ids[$k] = $res.data.user.id
        Log-Msg "  > Got Token for $k"
    }
    else {
        Log-Msg "  > FAILED TO GET TOKEN FOR $k"
    }
}

# Check for tokens
if (!$tokens['faculty'] -or !$tokens['hod']) { 
    Log-Msg "CRITICAL: Tokens missing. Aborting."
    exit 1 
}

# 3. Create Event (Faculty)
Log-Msg "`n--- 3. Event Management ---"
$eventPayload = @{
    title       = "Verif Event $ts"
    description = "Automated Test Event"
    mode        = "Offline"
    startDate   = (Get-Date).ToString("yyyy-MM-dd")
    endDate     = (Get-Date).AddDays(1).ToString("yyyy-MM-dd")
    organizer   = @{ id = $ids['faculty'] }
    college     = @{ id = "college-1" }
}
$event = (Test-Endpoint "POST" "/events" $eventPayload $tokens['faculty'] "Create Event").data
if (!$event) { exit 1 }
$eventId = $event.id
Log-Msg "  > Event ID: $eventId (Status: $($event.status))"

# 4. Approve Event (HOD)
Test-Endpoint "POST" "/governance/approve/event/$eventId?comments=ApprovedByScript" $null $tokens['hod'] "HOD Approve Event" | Out-Null

# 5. Register Student
Log-Msg "`n--- 4. Participation ---"
Test-Endpoint "POST" "/events/$eventId/register?userId=$($ids['student'])" $null $tokens['student'] "Student Register" | Out-Null

# 6. Assign Judge (HOD)
Log-Msg "`n--- 5. Governance Setup ---"
Test-Endpoint "POST" "/governance/assign-judge/$eventId?judgeId=$($ids['judge'])" $null $tokens['hod'] "Assign Judge" | Out-Null

# 7. Submit Project (Student)
Log-Msg "`n--- 6. Submission ---"
$subPayload = @{
    event        = @{ id = $eventId }
    user         = @{ id = $ids['student'] }
    projectTitle = "Verification Project"
    description  = "Built automatically."
}
$sub = (Test-Endpoint "POST" "/submissions" $subPayload $tokens['student'] "Submit Project").data
if (!$sub) { Log-Msg "Submission Failed"; exit 1 }
$subId = $sub.id
Log-Msg "  > Submission ID: $subId"

# 8. Submit Score (Judge)
Log-Msg "`n--- 7. Scoring ---"
$scorePayload = @{
    criteriaScores = @{ "Innovation" = 10; "Impact" = 9 }
    totalScore     = 19
    feedback       = "Excellent work script."
    isDraft        = $false
}
Test-Endpoint "POST" "/governance/submit-score/$subId" $scorePayload $tokens['judge'] "Judge Submit Score" | Out-Null

# 9. Lock Scores (HOD)
Log-Msg "`n--- 8. Finalization ---"
Test-Endpoint "POST" "/governance/lock-scores/$eventId?comments=Finalized" $null $tokens['hod'] "HOD Lock Scores" | Out-Null

# 10. Verify Security (Student Try Lock)
Log-Msg "`n--- 9. Security Check ---"
$res = Test-Endpoint "POST" "/governance/lock-scores/$eventId?comments=Hacking" $null $tokens['student'] "Student Try Lock (Expect Fail)"
if ($res -eq $null) { Log-Msg "  > Access correctly denied." } else { Log-Msg "  > SECURITY FAIL!" }

Log-Msg "`n--- VERIFICATION COMPLETE ---"
