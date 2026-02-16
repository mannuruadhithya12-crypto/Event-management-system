$headers = @{ "Content-Type" = "application/json" }
$body = @{ email = "dean@test.com"; password = "password" } | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Headers $headers -Body $body
    Write-Host "Login Successful!"
    Write-Host "Role: $($response.data.user.role)"
    Write-Host "CollegeId: $($response.data.user.collegeId)"
    Write-Host "Token: $($response.data.token.Substring(0, 20))..."
}
catch {
    Write-Host "Login Failed: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader $_.Exception.Response.GetResponseStream()
        Write-Host "Response: $($reader.ReadToEnd())"
    }
}
