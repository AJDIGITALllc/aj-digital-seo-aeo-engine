param(
    [string]$ExpectedRemote = "git@github.com:AJDIGITALllc/aj-digital-seo-aeo-engine.git",
    [string]$DefaultBranch = "main"
)

$ErrorActionPreference = "Stop"

function Step($msg) {
    Write-Host "`n==> $msg" -ForegroundColor Cyan
}

function Pass($msg) {
    Write-Host "PASS: $msg" -ForegroundColor Green
}

function Warn($msg) {
    Write-Host "WARN: $msg" -ForegroundColor Yellow
}

function Fail($msg) {
    Write-Host "FAIL: $msg" -ForegroundColor Red
    $script:HasFailure = $true
}

function Check-PathExists {
    param([string]$Path, [string]$Label)
    if (Test-Path $Path) {
        Pass "$Label exists: $Path"
    } else {
        Fail "$Label missing: $Path"
    }
}

function Check-OptionalPathExists {
    param([string]$Path, [string]$Label)
    if (Test-Path $Path) {
        Pass "$Label exists: $Path"
    } else {
        Warn "$Label missing: $Path"
    }
}

$script:HasFailure = $false

Step "Validate repo context"
if (!(Test-Path ".git")) {
    Fail "Current directory is not a Git repository."
    exit 1
} else {
    Pass "Inside a Git repository"
}

$currentPath = (Get-Location).Path
Write-Host "Repo path: $currentPath"

Step "Check Git remote"
$remoteUrl = git remote get-url origin 2>$null
if (-not $remoteUrl) {
    Fail "No origin remote found"
} elseif ($remoteUrl -eq $ExpectedRemote) {
    Pass "Origin remote matches expected repo"
} else {
    Warn "Origin remote differs from expected"
    Write-Host "Expected: $ExpectedRemote"
    Write-Host "Actual:   $remoteUrl"
}

Step "Check branch status"
$currentBranch = git rev-parse --abbrev-ref HEAD
Write-Host "Current branch: $currentBranch"
if ($currentBranch -eq $DefaultBranch) {
    Pass "On default branch: $DefaultBranch"
} else {
    Warn "Not on default branch"
}

$gitStatus = git status --short
if (-not $gitStatus) {
    Pass "Working tree clean"
} else {
    Warn "Working tree has changes"
    $gitStatus | ForEach-Object { Write-Host "  $_" }
}

Step "Check sync with remote"
try {
    git fetch origin --quiet
    $localHash = git rev-parse HEAD
    $remoteHash = git rev-parse "origin/$DefaultBranch"
    if ($currentBranch -eq $DefaultBranch) {
        if ($localHash -eq $remoteHash) {
            Pass "Local $DefaultBranch matches origin/$DefaultBranch"
        } else {
            Warn "Local $DefaultBranch differs from origin/$DefaultBranch"
        }
    } else {
        Warn "Sync check limited because current branch is $currentBranch"
    }
} catch {
    Warn "Could not verify remote sync"
}

Step "Check required structure"
Check-PathExists "README.md" "README"
Check-PathExists "CHANGELOG.md" "CHANGELOG"
Check-PathExists "CLAUDE.md" "CLAUDE instructions"
Check-PathExists ".gitignore" ".gitignore"
Check-PathExists ".env.example" ".env.example"

Check-PathExists "docs" "docs directory"
Check-PathExists "skills" "skills directory"
Check-PathExists "prompts" "prompts directory"
Check-PathExists "schemas" "schemas directory"
Check-PathExists "workflows" "workflows directory"
Check-PathExists "templates" "templates directory"
Check-PathExists "examples" "examples directory"

Step "Check key implementation files"
Check-PathExists "skills/content_creation/seo/perplexity-seo-aeo-research-operator.skill.md" "core skill"
Check-PathExists "workflows/n8n/seo-aeo-engine-workflow.md" "n8n workflow spec"
Check-OptionalPathExists "workflows/n8n/seo-aeo-engine-workflow.json" "n8n workflow JSON"
Check-PathExists "schemas/opportunity-matrix.schema.json" "opportunity schema"
Check-PathExists "schemas/topic-map.schema.json" "topic map schema"
Check-PathExists "schemas/page-brief.schema.json" "page brief schema"
Check-PathExists "schemas/ai-citation-brief.schema.json" "AI citation schema"
Check-PathExists "scripts/git-smart-pr.ps1" "git automation script"

Step "Check common repo quality signals"
$readme = Get-Content "README.md" -Raw
if ($readme.Length -gt 50) {
    Pass "README is not a stub"
} else {
    Warn "README looks very short"
}

if (!(Test-Path ".env.example")) {
    Warn ".env.example missing - skipping variable checks"
    $missingEnv = @()
} else {

$envExample = Get-Content ".env.example" -Raw
$requiredEnv = @(
    "PERPLEXITY_API_KEY",
    "OPENAI_API_KEY",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_REFRESH_TOKEN",
    "GSC_SITE_URL",
    "TELEGRAM_BOT_TOKEN",
    "TELEGRAM_CHAT_ID",
    "SANITY_PROJECT_ID",
    "SANITY_DATASET",
    "SANITY_API_TOKEN"
)

$missingEnv = @()
foreach ($key in $requiredEnv) {
    if ($envExample -notmatch [regex]::Escape($key)) {
        $missingEnv += $key
    }
}

if ($missingEnv.Count -eq 0) {
    Pass ".env.example contains required V1 variables"
} else {
    Warn ".env.example is missing expected variables:"
    $missingEnv | ForEach-Object { Write-Host "  $_" }
}

} # end .env.example check

Step "Check for nested Git repos"
$nestedGitDirs = Get-ChildItem -Recurse -Force -Directory -Filter ".git" 2>$null |
    Where-Object { $_.FullName -ne (Join-Path $currentPath ".git") }

if ($nestedGitDirs.Count -eq 0) {
    Pass "No nested Git repositories detected"
} else {
    Warn "Nested Git directories detected:"
    $nestedGitDirs | ForEach-Object { Write-Host "  $($_.FullName)" }
}

Step "Check recent commits"
git log --oneline -5 | ForEach-Object { Write-Host "  $_" }

Step "Summary"
if ($script:HasFailure) {
    Write-Host "Repository health check completed with FAILURES." -ForegroundColor Red
    exit 1
} else {
    Write-Host "Repository health check completed. No blocking failures detected." -ForegroundColor Green
}
