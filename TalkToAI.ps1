# PowerShell Script to Communicate with NexteraEstate AI Agents
# Usage: .\TalkToAI.ps1 "Your question here"

param(
    [Parameter(Mandatory=$true)]
    [string]$Message
)

# Try different backend URLs in case of connectivity issues
$BackendUrls = @(
    "http://localhost:8001",
    "http://127.0.0.1:8001"
)

$Endpoint = "/api/ai-team/communicate"
$Success = $false

foreach ($BaseUrl in $BackendUrls) {
    try {
        Write-Host "🤖 Connecting to AI agents at $BaseUrl..." -ForegroundColor Cyan
        Write-Host "=" * 60 -ForegroundColor Gray
        
        # Prepare the request body
        $Body = @{
            message = $Message
            recipient = "team"  
            priority = "normal"
        } | ConvertTo-Json -Depth 3
        
        # Make the API call
        $Response = Invoke-RestMethod -Uri "$BaseUrl$Endpoint" -Method POST -Body $Body -ContentType "application/json" -TimeoutSec 30
        
        # Display the response
        Write-Host "✅ AI Team Response:" -ForegroundColor Green
        Write-Host ""
        
        # Display AutoLex Core response
        if ($Response.responses.autolex_core) {
            Write-Host "🏛️ AutoLex Core (Legal Intelligence):" -ForegroundColor Yellow
            Write-Host "   Response: $($Response.responses.autolex_core.response)" -ForegroundColor White
            Write-Host "   Confidence: $([math]::Round($Response.responses.autolex_core.confidence * 100, 1))%" -ForegroundColor Gray
            Write-Host ""
        }
        
        # Display Senior AI Manager response  
        if ($Response.responses.senior_ai_manager) {
            Write-Host "👨‍💼 Senior AI Manager (System Operations):" -ForegroundColor Magenta
            Write-Host "   Response: $($Response.responses.senior_ai_manager.response)" -ForegroundColor White
            Write-Host "   Confidence: $([math]::Round($Response.responses.senior_ai_manager.confidence * 100, 1))%" -ForegroundColor Gray
            Write-Host ""
        }
        
        # Display team coordination summary
        if ($Response.responses.team_coordination) {
            Write-Host "🤝 Team Coordination Summary:" -ForegroundColor Blue
            Write-Host "   $($Response.responses.team_coordination.team_consensus)" -ForegroundColor White
            Write-Host ""
        }
        
        Write-Host "=" * 60 -ForegroundColor Gray
        Write-Host "✅ Communication ID: $($Response.communication_id)" -ForegroundColor Green
        Write-Host "📅 Timestamp: $($Response.timestamp)" -ForegroundColor Gray
        
        $Success = $true
        break
        
    } catch {
        Write-Host "❌ Connection failed to $BaseUrl" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
        continue
    }
}

if (-not $Success) {
    Write-Host ""
    Write-Host "❌ Unable to connect to AI agents at any backend URL" -ForegroundColor Red
    Write-Host "💡 Make sure the backend server is running on port 8001" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔧 Try these troubleshooting steps:" -ForegroundColor Cyan
    Write-Host "   1. Check if backend is running: curl http://localhost:8001/api/health" -ForegroundColor White
    Write-Host "   2. Restart backend: sudo supervisorctl restart backend" -ForegroundColor White
    Write-Host "   3. Check backend logs: tail -f /var/log/supervisor/backend.*.log" -ForegroundColor White
}