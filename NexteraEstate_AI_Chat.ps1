# NexteraEstate AI Team Communication - PowerShell Version
# For Windows 11 - Direct connection to your AI agents

$Host.UI.RawUI.WindowTitle = "NexteraEstate AI Team Communication"

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "    NexteraEstate AI Team Communication" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Configuration - REPLACE WITH YOUR ACTUAL EMERGENT URL
Write-Host "[SETUP] Please enter your Emergent preview URL:" -ForegroundColor Yellow
Write-Host "Example: https://3001-username-project.emergent.com" -ForegroundColor Gray
$PreviewUrl = Read-Host "Preview URL"

if (-not $PreviewUrl) {
    Write-Host "[ERROR] No URL provided. Exiting." -ForegroundColor Red
    exit 1
}

# Convert to backend URL
$BackendUrl = $PreviewUrl -replace "3001-", "8001-"
$BackendUrl = "$BackendUrl/api"

Write-Host ""
Write-Host "[INFO] Backend URL: $BackendUrl" -ForegroundColor Green

# Test connection
Write-Host "[TEST] Testing connection to AI team..." -ForegroundColor Yellow

try {
    $healthUrl = $BackendUrl -replace "/api$", "/api/health"
    $healthResponse = Invoke-RestMethod -Uri $healthUrl -Method Get -TimeoutSec 10
    Write-Host "[SUCCESS] Connected to AI team!" -ForegroundColor Green
    Write-Host "[STATUS] $($healthResponse.status)" -ForegroundColor Green
}
catch {
    Write-Host "[ERROR] Cannot connect to AI team." -ForegroundColor Red
    Write-Host "[DEBUG] URL: $healthUrl" -ForegroundColor Gray
    Write-Host "[DEBUG] Error: $($_.Exception.Message)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Please check:" -ForegroundColor Yellow
    Write-Host "1. Your Emergent environment is running" -ForegroundColor Gray
    Write-Host "2. Backend is accessible on port 8001" -ForegroundColor Gray
    Write-Host "3. URL format is correct" -ForegroundColor Gray
    Read-Host "Press Enter to exit"
    exit 1
}

# Main chat loop
do {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "    Select Your AI Agent" -ForegroundColor White
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "[1] AutoLex Core      - Legal intelligence & development" -ForegroundColor Green
    Write-Host "[2] Senior AI Manager - System monitoring & optimization" -ForegroundColor Blue  
    Write-Host "[3] Full AI Team      - Coordinated team response" -ForegroundColor Magenta
    Write-Host "[4] Quick Status      - System health report" -ForegroundColor Cyan
    Write-Host "[5] Exit" -ForegroundColor Red
    Write-Host ""
    
    $choice = Read-Host "Select option (1-5)"
    
    switch ($choice) {
        "1" { 
            $recipient = "autolex"
            $agentName = "AutoLex Core"
        }
        "2" { 
            $recipient = "senior_manager"
            $agentName = "Senior AI Manager"
        }
        "3" { 
            $recipient = "team"
            $agentName = "Full AI Team"
        }
        "4" {
            $recipient = "senior_manager"
            $agentName = "Senior AI Manager"
            $message = "Provide a comprehensive system status report including all components, performance metrics, and any issues or recommendations."
        }
        "5" { 
            Write-Host "Goodbye!" -ForegroundColor Green
            exit 0 
        }
        default { 
            Write-Host "Invalid choice. Please try again." -ForegroundColor Red
            continue 
        }
    }
    
    if ($choice -ne "4") {
        Write-Host ""
        Write-Host "Talking to: $agentName" -ForegroundColor Green
        Write-Host ""
        Write-Host "Quick options:" -ForegroundColor Yellow
        Write-Host "[1] System status check"
        Write-Host "[2] California will requirements"  
        Write-Host "[3] Production optimization help"
        Write-Host "[4] Competitive advantages analysis"
        Write-Host "[5] Custom message"
        Write-Host ""
        
        $msgChoice = Read-Host "Select quick option or 5 for custom (1-5)"
        
        switch ($msgChoice) {
            "1" { $message = "What is the current system status? Please provide detailed information about all components and their operational state." }
            "2" { $message = "What are the requirements for a valid will in California? Please provide comprehensive legal guidance with specific requirements." }
            "3" { $message = "Help me optimize my NexteraEstate platform for production launch. What are the key areas I should focus on?" }
            "4" { $message = "What are my NexteraEstate platform's competitive advantages over LegalZoom, Rocket Lawyer, and other estate planning services?" }
            "5" { 
                Write-Host ""
                $message = Read-Host "Enter your message for $agentName"
            }
            default { 
                Write-Host "Invalid choice." -ForegroundColor Red
                continue 
            }
        }
    }
    
    if (-not $message -or $message.Trim() -eq "") {
        Write-Host "No message entered." -ForegroundColor Red
        continue
    }
    
    Write-Host ""
    Write-Host "[SENDING] Communicating with $agentName..." -ForegroundColor Yellow
    Write-Host "[MESSAGE] $message" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Please wait while your AI agent processes the request..." -ForegroundColor Yellow
    
    try {
        $requestBody = @{
            message = $message
            recipient = $recipient
            priority = "high"
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "$BackendUrl/ai-team/communicate" -Method Post -Body $requestBody -ContentType "application/json" -TimeoutSec 60
        
        Write-Host ""
        Write-Host "================================================" -ForegroundColor Cyan
        Write-Host "    AI TEAM RESPONSE" -ForegroundColor White
        Write-Host "================================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Communication ID: $($response.communication_id)" -ForegroundColor Gray
        Write-Host "Timestamp: $($response.timestamp)" -ForegroundColor Gray
        Write-Host ""
        
        if ($response.responses) {
            foreach ($agentResponse in $response.responses.PSObject.Properties) {
                $agent = $agentResponse.Value
                if ($agent.response -and $agent.response -ne "No response") {
                    $confidence = [math]::Round($agent.confidence * 100, 1)
                    Write-Host "🤖 $($agent.agent)" -ForegroundColor Green
                    Write-Host "Confidence: $confidence%" -ForegroundColor Cyan
                    Write-Host ""
                    Write-Host $agent.response -ForegroundColor White
                    
                    if ($agent.recommendations -and $agent.recommendations.Count -gt 0) {
                        Write-Host ""
                        Write-Host "💡 Recommendations:" -ForegroundColor Yellow
                        foreach ($rec in $agent.recommendations) {
                            Write-Host "  • $rec" -ForegroundColor Gray
                        }
                    }
                    Write-Host ""
                }
            }
        }
        
    }
    catch {
        Write-Host ""
        Write-Host "[ERROR] Failed to communicate with AI team." -ForegroundColor Red
        Write-Host "[DEBUG] $($_.Exception.Message)" -ForegroundColor Gray
        Write-Host "[URL] $BackendUrl/ai-team/communicate" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Cyan
    $continue = Read-Host "Press Enter to continue or type 'exit' to quit"
    
} while ($continue -ne "exit")

Write-Host ""
Write-Host "Thank you for using NexteraEstate AI Team!" -ForegroundColor Green
Write-Host ""