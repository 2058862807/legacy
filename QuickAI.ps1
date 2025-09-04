# Quick AI Chat - Single Command Interface
param([string]$Message)

$BackendUrl = "http://localhost:8001/api/ai-team/communicate"

if (-not $Message) {
    $Message = Read-Host "Enter your message for Senior AI Manager"
}

$payload = @{
    message = $Message
    recipient = "senior_manager"
    priority = "normal"
} | ConvertTo-Json

try {
    Write-Host "🤖 Contacting Senior AI Manager..." -ForegroundColor Cyan
    $response = Invoke-RestMethod -Uri $BackendUrl -Method Post -Body $payload -ContentType "application/json"
    
    $aiResponse = $response.responses.senior_ai_manager.response
    Write-Host "`n📋 Senior AI Manager Response:" -ForegroundColor Green
    Write-Host $aiResponse -ForegroundColor White
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure NexteraEstate backend is running on localhost:8001" -ForegroundColor Yellow
}