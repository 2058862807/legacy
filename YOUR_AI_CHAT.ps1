# NexteraEstate AI Team - PowerShell Version for estate-genius-1
# Direct connection to your AI agents

$Host.UI.RawUI.WindowTitle = "NexteraEstate AI Team - estate-genius-1"

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "    NexteraEstate AI Team Communication" -ForegroundColor Green
Write-Host "    estate-genius-1.preview.emergentagent.com" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Your exact backend URL
$BackendUrl = "https://nextera-estate-fix.preview.emergentagent.com:8001/api"
Write-Host "[INFO] Backend URL: $BackendUrl" -ForegroundColor Green

# Test connection
Write-Host "[TEST] Testing connection to your AI team..." -ForegroundColor Yellow

try {
    $healthUrl = "https://nextera-estate-fix.preview.emergentagent.com:8001/api/health"
    $healthResponse = Invoke-RestMethod -Uri $healthUrl -Method Get -TimeoutSec 15
    Write-Host "[SUCCESS] ✅ Connected to AI team!" -ForegroundColor Green
    Write-Host "[STATUS] $($healthResponse.status)" -ForegroundColor Green
}
catch {
    Write-Host "[WARNING] Port 8001 failed, trying alternative..." -ForegroundColor Yellow
    try {
        $healthUrl = "https://nextera-estate-fix.preview.emergentagent.com/api/health"
        $BackendUrl = "https://nextera-estate-fix.preview.emergentagent.com/api"
        $healthResponse = Invoke-RestMethod -Uri $healthUrl -Method Get -TimeoutSec 15
        Write-Host "[SUCCESS] ✅ Connected to AI team!" -ForegroundColor Green
    }
    catch {
        Write-Host "[ERROR] ❌ Cannot connect to AI team." -ForegroundColor Red
        Write-Host "[DEBUG] Tried URLs:" -ForegroundColor Gray
        Write-Host "  - https://nextera-estate-fix.preview.emergentagent.com:8001/api/health" -ForegroundColor Gray
        Write-Host "  - https://nextera-estate-fix.preview.emergentagent.com/api/health" -ForegroundColor Gray
        Write-Host "[SOLUTION] Make sure your Emergent environment is running" -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Main chat loop
do {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "    Select Your AI Agent" -ForegroundColor White
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "[1] 🧠 AutoLex Core      - Legal intelligence & development" -ForegroundColor Green
    Write-Host "[2] 👔 Senior AI Manager - System monitoring & optimization" -ForegroundColor Blue  
    Write-Host "[3] 👥 Full AI Team      - Coordinated team response" -ForegroundColor Magenta
    Write-Host "[4] 📊 System Status     - Complete health report" -ForegroundColor Cyan
    Write-Host "[5] 💡 Quick Questions   - Common queries" -ForegroundColor Yellow
    Write-Host "[6] 🚪 Exit" -ForegroundColor Red
    Write-Host ""
    
    $choice = Read-Host "Select option (1-6)"
    
    switch ($choice) {
        "1" { 
            $recipient = "autolex"
            $agentName = "AutoLex Core 🧠"
        }
        "2" { 
            $recipient = "senior_manager"
            $agentName = "Senior AI Manager 👔"
        }
        "3" { 
            $recipient = "team"
            $agentName = "Full AI Team 👥"
        }
        "4" {
            $recipient = "senior_manager"
            $agentName = "Senior AI Manager 👔"
            $message = "Provide a comprehensive system status report for NexteraEstate including all components, performance metrics, operational status, any issues, and recommendations for optimization or production readiness."
        }
        "5" {
            Write-Host ""
            Write-Host "Quick Questions:" -ForegroundColor Yellow
            Write-Host "[1] What are my platform's competitive advantages?"
            Write-Host "[2] Help me prepare for production launch"
            Write-Host "[3] California will legal requirements"
            Write-Host "[4] Platform optimization recommendations"
            Write-Host "[5] Legal compliance review"
            Write-Host ""
            $quickChoice = Read-Host "Select quick question (1-5)"
            
            switch ($quickChoice) {
                "1" { 
                    $recipient = "autolex"
                    $agentName = "AutoLex Core 🧠"
                    $message = "What are NexteraEstate's key competitive advantages over LegalZoom, Rocket Lawyer, and other estate planning platforms? How should I position these advantages in the market?"
                }
                "2" { 
                    $recipient = "team"
                    $agentName = "Full AI Team 👥"
                    $message = "Help me prepare my NexteraEstate platform for production launch. What are the critical steps, potential issues to address, infrastructure requirements, and optimization recommendations?"
                }
                "3" { 
                    $recipient = "autolex"
                    $agentName = "AutoLex Core 🧠"
                    $message = "What are the complete legal requirements for creating a valid will in California? Please provide comprehensive guidance including witness requirements, notarization rules, and compliance standards."
                }
                "4" { 
                    $recipient = "senior_manager"
                    $agentName = "Senior AI Manager 👔"
                    $message = "How can I optimize my NexteraEstate platform for better performance, user experience, and scalability? What are the priority areas to focus on for maximum impact?"
                }
                "5" { 
                    $recipient = "autolex"
                    $agentName = "AutoLex Core 🧠"
                    $message = "Review my NexteraEstate platform's legal compliance features, including the 50-state compliance system. Are there any gaps, improvements needed, or additional features that would strengthen our legal defensibility?"
                }
                default { continue }
            }
        }
        "6" { 
            Write-Host "Thank you for using NexteraEstate AI Team! 🚀" -ForegroundColor Green
            exit 0 
        }
        default { 
            Write-Host "Invalid choice. Please try again." -ForegroundColor Red
            continue 
        }
    }
    
    if ($choice -notin @("4", "5")) {
        Write-Host ""
        Write-Host "Talking to: $agentName" -ForegroundColor Green
        Write-Host ""
        $message = Read-Host "Enter your message for $agentName"
    }
    
    if (-not $message -or $message.Trim() -eq "") {
        Write-Host "No message entered." -ForegroundColor Red
        continue
    }
    
    Write-Host ""
    Write-Host "[SENDING] 🚀 Communicating with $agentName..." -ForegroundColor Yellow
    Write-Host "[MESSAGE] $message" -ForegroundColor Gray
    Write-Host ""
    Write-Host "⏳ Please wait while your AI agent processes the request..." -ForegroundColor Yellow
    
    try {
        $requestBody = @{
            message = $message
            recipient = $recipient
            priority = "high"
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "$BackendUrl/ai-team/communicate" -Method Post -Body $requestBody -ContentType "application/json" -TimeoutSec 60
        
        Write-Host ""
        Write-Host "================================================" -ForegroundColor Cyan
        Write-Host "    🤖 AI TEAM RESPONSE" -ForegroundColor White
        Write-Host "================================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📋 Communication ID: $($response.communication_id)" -ForegroundColor Gray
        Write-Host "🕐 Timestamp: $([DateTime]::Parse($response.timestamp).ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor Gray
        Write-Host ""
        
        if ($response.responses) {
            foreach ($agentResponse in $response.responses.PSObject.Properties) {
                $agent = $agentResponse.Value
                if ($agent.response -and $agent.response -ne "No response" -and $agent.response.Trim() -ne "") {
                    $confidence = [math]::Round($agent.confidence * 100, 1)
                    Write-Host "$($agent.agent)" -ForegroundColor Green
                    Write-Host "📊 Confidence: $confidence%" -ForegroundColor Cyan
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
                    Write-Host "────────────────────────────────────────" -ForegroundColor DarkGray
                }
            }
        } else {
            Write-Host "⚠️  No response received from AI agents" -ForegroundColor Yellow
        }
        
    }
    catch {
        Write-Host ""
        Write-Host "[ERROR] ❌ Failed to communicate with AI team." -ForegroundColor Red
        Write-Host "[DEBUG] $($_.Exception.Message)" -ForegroundColor Gray
        Write-Host "[URL] $BackendUrl/ai-team/communicate" -ForegroundColor Gray
        Write-Host ""
        Write-Host "💡 Troubleshooting tips:" -ForegroundColor Yellow
        Write-Host "  • Make sure your Emergent environment is running" -ForegroundColor Gray
        Write-Host "  • Check that backend service is active on port 8001" -ForegroundColor Gray
        Write-Host "  • Try refreshing your Emergent workspace" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Cyan
    $continue = Read-Host "Press Enter to continue or type 'exit' to quit"
    
} while ($continue -ne "exit")

Write-Host ""
Write-Host "🚀 Thank you for using NexteraEstate AI Team!" -ForegroundColor Green
Write-Host "Your AI agents are always here to help you build the future of estate planning!" -ForegroundColor Cyan
Write-Host ""