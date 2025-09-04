# NexteraEstate AI Team PowerShell Interface
# Talk to your AI team directly from PowerShell

param(
    [string]$Message = "",
    [string]$Agent = "senior_manager",
    [string]$Priority = "normal"
)

# Configuration
$BackendUrl = "http://localhost:8001"
$ApiEndpoint = "$BackendUrl/api/ai-team/communicate"

# Colors for output
$ColorScheme = @{
    Header = "Cyan"
    Success = "Green" 
    Error = "Red"
    Info = "Yellow"
    Response = "White"
}

function Write-ColorText {
    param([string]$Text, [string]$Color = "White")
    Write-Host $Text -ForegroundColor $ColorScheme[$Color]
}

function Test-BackendConnection {
    try {
        $healthCheck = Invoke-RestMethod -Uri "$BackendUrl/api/health" -Method Get -TimeoutSec 5
        if ($healthCheck.ok) {
            Write-ColorText "✅ Backend connection successful" "Success"
            return $true
        }
    }
    catch {
        Write-ColorText "❌ Cannot connect to backend at $BackendUrl" "Error"
        Write-ColorText "Make sure your NexteraEstate backend is running" "Info"
        return $false
    }
}

function Send-AIMessage {
    param(
        [string]$MessageText,
        [string]$Recipient,
        [string]$MessagePriority
    )
    
    $payload = @{
        message = $MessageText
        recipient = $Recipient
        priority = $MessagePriority
        context = @{
            interface = "powershell"
            timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        }
    } | ConvertTo-Json
    
    try {
        Write-ColorText "🤖 Sending message to $Recipient..." "Info"
        
        $response = Invoke-RestMethod -Uri $ApiEndpoint -Method Post -Body $payload -ContentType "application/json" -TimeoutSec 30
        
        Write-ColorText "`n📨 Message sent successfully!" "Success"
        Write-ColorText "Communication ID: $($response.communication_id)" "Info"
        
        # Display responses
        foreach ($agentName in $response.responses.PSObject.Properties.Name) {
            $agentResponse = $response.responses.$agentName
            Write-ColorText "`n🤖 Response from $($agentResponse.agent):" "Header"
            Write-ColorText "Confidence: $([math]::Round($agentResponse.confidence * 100, 1))%" "Info"
            Write-ColorText "`n$($agentResponse.response)" "Response"
            
            if ($agentResponse.recommendations.Count -gt 0) {
                Write-ColorText "`n💡 Recommendations:" "Header"
                foreach ($rec in $agentResponse.recommendations) {
                    Write-ColorText "  • $rec" "Info"
                }
            }
            
            if ($agentResponse.escalation_needed) {
                Write-ColorText "`n⚠️  ESCALATION NEEDED" "Error"
            }
        }
        
    }
    catch {
        Write-ColorText "❌ Error communicating with AI team: $($_.Exception.Message)" "Error"
    }
}

function Show-Menu {
    Write-ColorText "`n🏢 NexteraEstate AI Team Interface" "Header"
    Write-ColorText "=================================" "Header"
    Write-ColorText "1. Senior AI Manager (System status, performance, executive briefings)" "Info"
    Write-ColorText "2. AutoLex Core (Legal questions, development assistance)" "Info" 
    Write-ColorText "3. Full AI Team (Coordinated responses)" "Info"
    Write-ColorText "4. Custom message" "Info"
    Write-ColorText "5. System health check" "Info"
    Write-ColorText "6. Exit" "Info"
    Write-ColorText "=================================" "Header"
}

function Get-SystemHealth {
    try {
        $health = Invoke-RestMethod -Uri "$BackendUrl/api/ai-team/status" -Method Get
        Write-ColorText "`n🏥 System Health Report:" "Header"
        Write-ColorText "Overall Status: $($health.status)" "Success"
        Write-ColorText "Timestamp: $($health.timestamp)" "Info"
        
        if ($health.systems) {
            foreach ($system in $health.systems.PSObject.Properties.Name) {
                $systemInfo = $health.systems.$system
                Write-ColorText "  $system`: $($systemInfo.status)" "Info"
            }
        }
    }
    catch {
        Write-ColorText "❌ Could not retrieve system health" "Error"
    }
}

# Main execution
Write-ColorText "🚀 NexteraEstate AI Team PowerShell Interface" "Header"

if (-not (Test-BackendConnection)) {
    exit 1
}

# If message provided as parameter, send it directly
if ($Message) {
    Send-AIMessage -MessageText $Message -Recipient $Agent -MessagePriority $Priority
    exit 0
}

# Interactive mode
do {
    Show-Menu
    $choice = Read-Host "`nSelect option (1-6)"
    
    switch ($choice) {
        "1" {
            $msg = Read-Host "Enter your message for Senior AI Manager"
            if ($msg) { Send-AIMessage -MessageText $msg -Recipient "senior_manager" -MessagePriority "normal" }
        }
        "2" {
            $msg = Read-Host "Enter your message for AutoLex Core"
            if ($msg) { Send-AIMessage -MessageText $msg -Recipient "autolex" -MessagePriority "normal" }
        }
        "3" {
            $msg = Read-Host "Enter your message for the full AI team"
            if ($msg) { Send-AIMessage -MessageText $msg -Recipient "team" -MessagePriority "normal" }
        }
        "4" {
            $msg = Read-Host "Enter your custom message"
            $recipient = Read-Host "Enter recipient (senior_manager/autolex/team)"
            $priority = Read-Host "Enter priority (low/normal/high/urgent) [default: normal]"
            if (-not $priority) { $priority = "normal" }
            if ($msg) { Send-AIMessage -MessageText $msg -Recipient $recipient -MessagePriority $priority }
        }
        "5" {
            Get-SystemHealth
        }
        "6" {
            Write-ColorText "👋 Goodbye!" "Success"
            break
        }
        default {
            Write-ColorText "Invalid option. Please select 1-6." "Error"
        }
    }
    
    if ($choice -ne "6") {
        Write-Host "`nPress Enter to continue..." -ForegroundColor Yellow
        Read-Host
    }
    
} while ($choice -ne "6")