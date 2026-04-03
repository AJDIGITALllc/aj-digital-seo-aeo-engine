param(
    [string]$BaseBranch = "main",
    [string]$Repo = "AJDIGITALllc/aj-digital-seo-aeo-engine",
    [switch]$SkipPR,
    [switch]$NoPush
)

$ErrorActionPreference = "Stop"

function Write-Step {
    param([string]$Message)
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Fail {
    param([string]$Message)
    Write-Host "ERROR: $Message" -ForegroundColor Red
    exit 1
}

function Test-CommandExists {
    param([string]$CommandName)
    return $null -ne (Get-Command $CommandName -ErrorAction SilentlyContinue)
}

function Get-ChangedFiles {
    $status = git status --porcelain
    if (-not $status) { return @() }

    $files = @()
    foreach ($line in $status) {
        if ($line.Length -lt 4) { continue }
        $path = $line.Substring(3).Trim()
        if ($path -match "->") {
            $parts = $path -split "->"
            $path = $parts[-1].Trim()
        }
        if ($path) { $files += $path }
    }

    return $files | Sort-Object -Unique
}

function Get-ChangeType {
    param([string[]]$Files)

    if (-not $Files -or $Files.Count -eq 0) {
        return "chore"
    }

    $joined = $Files -join "`n"

    if ($joined -match "^workflows/" -or $joined -match "\.json$") {
        return "feat"
    }
    if ($joined -match "^skills/") {
        return "feat"
    }
    if ($joined -match "^docs/" -or $joined -match "\.md$") {
        return "docs"
    }
    if ($joined -match "^scripts/" -or $joined -match "\.ps1$" -or $joined -match "\.sh$") {
        return "chore"
    }
    if ($joined -match "^schemas/" -or $joined -match "^templates/" -or $joined -match "^examples/") {
        return "feat"
    }

    return "chore"
}

function Get-Scope {
    param([string[]]$Files)

    if (-not $Files -or $Files.Count -eq 0) {
        return "repo"
    }

    $topFolders = $Files |
        ForEach-Object {
            $parts = $_ -split "[/\\]"
            if ($parts.Count -gt 1) { $parts[0] } else { "root" }
        } |
        Group-Object |
        Sort-Object Count -Descending

    $scope = $topFolders[0].Name.ToLower()

    switch ($scope) {
        "workflows" { return "n8n" }
        "skills"    { return "skill" }
        "docs"      { return "docs" }
        "scripts"   { return "scripts" }
        "schemas"   { return "schema" }
        "examples"  { return "examples" }
        "templates" { return "templates" }
        "root"      { return "repo" }
        default     { return $scope }
    }
}

function Get-PrimaryTarget {
    param([string[]]$Files)

    if (-not $Files -or $Files.Count -eq 0) {
        return "update"
    }

    $priorityPatterns = @(
        @{ Pattern = "seo-aeo-engine-workflow\.md"; Target = "workflow-spec" },
        @{ Pattern = "seo-aeo-engine-workflow\.json"; Target = "workflow-json" },
        @{ Pattern = "\.skill\.md$"; Target = "skill-spec" },
        @{ Pattern = "^docs/credentials\.md$"; Target = "credentials-doc" },
        @{ Pattern = "^README\.md$"; Target = "readme" },
        @{ Pattern = "^\.env\.example$"; Target = "env-template" },
        @{ Pattern = "^scripts/"; Target = "automation-script" }
    )

    foreach ($rule in $priorityPatterns) {
        if ($Files | Where-Object { $_ -match $rule.Pattern }) {
            return $rule.Target
        }
    }

    $first = Split-Path $Files[0] -Leaf
    $slug = ($first -replace "\.[^.]+$", "") -replace "[^a-zA-Z0-9\-]+", "-" -replace "-+", "-"
    return $slug.ToLower().Trim("-")
}

function Get-CommitMessage {
    param(
        [string]$Type,
        [string]$Scope,
        [string[]]$Files
    )

    $fileCount = $Files.Count
    $target = Get-PrimaryTarget -Files $Files

    $rootFiles = @("README.md", "CHANGELOG.md", ".gitignore", ".env.example", "CLAUDE.md", "LICENSE.md")
    $nonRootFiles = $Files | Where-Object { $rootFiles -notcontains (Split-Path $_ -Leaf) }

    if ($fileCount -eq 1) {
        $single = $Files[0]
        $leaf = Split-Path $single -Leaf

        if ($leaf -eq "README.md") { return "docs(readme): update repository documentation" }
        if ($leaf -eq ".env.example") { return "chore(env): update environment template" }
        if ($leaf -eq ".gitignore") { return "chore(repo): expand gitignore coverage" }
        if ($leaf -like "*.skill.md") { return "feat(skill): update skill specification" }
        if ($leaf -eq "seo-aeo-engine-workflow.md") { return "feat(n8n): add workflow specification" }
        if ($leaf -eq "seo-aeo-engine-workflow.json") { return "feat(n8n): add importable workflow scaffold" }
        if ($leaf -like "*.ps1") { return "chore(scripts): add git automation script" }
    }

    if ($Files | Where-Object { $_ -match "^workflows/n8n/" }) {
        if ($Files | Where-Object { $_ -match "\.json$" }) {
            return "feat(n8n): add workflow scaffold and supporting updates"
        }
        return "feat(n8n): add workflow spec and supporting updates"
    }

    if ($Files | Where-Object { $_ -match "^docs/" }) {
        return "docs($Scope): update documentation set"
    }

    if ($Files | Where-Object { $_ -match "^scripts/" }) {
        return "chore(scripts): add git and PR automation"
    }

    if ($nonRootFiles.Count -gt 0) {
        return "$Type($Scope): update $target and related files"
    }

    return "$Type($Scope): repository maintenance updates"
}

function Get-BranchName {
    param(
        [string]$Type,
        [string]$Scope,
        [string[]]$Files
    )

    $target = Get-PrimaryTarget -Files $Files
    $prefix = switch ($Type) {
        "feat" { "feat" }
        "docs" { "docs" }
        "fix"  { "fix" }
        default { "chore" }
    }

    return "$prefix/$Scope-$target"
}

function Get-PRTitle {
    param([string]$CommitMessage)

    if ($CommitMessage -match "^[a-z]+\([^)]+\):\s*(.+)$") {
        $rest = $Matches[1]
        return ($rest.Substring(0,1).ToUpper() + $rest.Substring(1))
    }

    return $CommitMessage
}

function Get-PRBody {
    param(
        [string]$CommitMessage,
        [string[]]$Files,
        [string]$BaseBranch
    )

    $grouped = @{}
    foreach ($file in $Files) {
        $parts = $file -split "[/\\]"
        $group = if ($parts.Count -gt 1) { $parts[0] } else { "root" }
        if (-not $grouped.ContainsKey($group)) {
            $grouped[$group] = New-Object System.Collections.Generic.List[string]
        }
        $grouped[$group].Add($file)
    }

    $summary = switch -Regex ($CommitMessage) {
        "^feat\(n8n\)"   { "Adds or updates the n8n workflow implementation artifacts." ; break }
        "^feat\(skill\)" { "Adds or updates a core skill specification." ; break }
        "^docs\("        { "Updates project documentation and operator guidance." ; break }
        "^chore\(scripts\)" { "Adds or improves repository automation scripts." ; break }
        "^chore\(env\)"  { "Updates environment variable templates and setup guidance." ; break }
        default          { "Applies repository updates based on the current working tree changes." }
    }

    $body = @()
    $body += "## Summary"
    $body += $summary
    $body += ""
    $body += "## Base"
    $body += "- Target branch: `$BaseBranch`"
    $body += ""
    $body += "## Changes"
    foreach ($key in ($grouped.Keys | Sort-Object)) {
        $body += "- **$key/**"
        foreach ($file in ($grouped[$key] | Sort-Object)) {
            $body += "  - `$file`"
        }
    }
    $body += ""
    $body += "## Notes"
    $body += "- Commit message: `$CommitMessage`"
    $body += "- Generated automatically from current git changes"

    return ($body -join "`n")
}

function Ensure-On-Branch {
    param([string]$BranchName)

    $current = git rev-parse --abbrev-ref HEAD
    if ($current -eq $BranchName) {
        Write-Step "Already on branch $BranchName"
        return
    }

    $existing = git branch --list $BranchName
    if ($existing) {
        Write-Step "Switching to existing branch $BranchName"
        git checkout $BranchName | Out-Null
    } else {
        Write-Step "Creating and switching to branch $BranchName"
        git checkout -b $BranchName | Out-Null
    }
}

Write-Step "Validating environment"

if (!(Test-Path ".git")) {
    Fail "Not inside a git repository."
}

if (-not (Test-CommandExists "git")) {
    Fail "git is not installed or not available in PATH."
}

$changedFiles = Get-ChangedFiles
if ($changedFiles.Count -eq 0) {
    Fail "No uncommitted changes detected."
}

$type = Get-ChangeType -Files $changedFiles
$scope = Get-Scope -Files $changedFiles
$commitMessage = Get-CommitMessage -Type $type -Scope $scope -Files $changedFiles
$branchName = Get-BranchName -Type $type -Scope $scope -Files $changedFiles
$prTitle = Get-PRTitle -CommitMessage $commitMessage
$prBody = Get-PRBody -CommitMessage $commitMessage -Files $changedFiles -BaseBranch $BaseBranch

Write-Host ""
Write-Host "Detected changes:" -ForegroundColor Yellow
$changedFiles | ForEach-Object { Write-Host " - $_" }

Write-Host ""
Write-Host "Generated metadata:" -ForegroundColor Yellow
Write-Host "Branch:        $branchName"
Write-Host "Commit:        $commitMessage"
Write-Host "PR title:      $prTitle"
Write-Host ""

Ensure-On-Branch -BranchName $branchName

Write-Step "Staging changes"
git add .

$hasStaged = git diff --cached --name-only
if (-not $hasStaged) {
    Fail "No staged files found after git add."
}

Write-Step "Creating commit"
try {
    git commit -m $commitMessage | Out-Null
} catch {
    $status = git status --short
    if (-not $status) {
        Fail "Nothing to commit."
    }
    throw
}

if (-not $NoPush) {
    Write-Step "Pushing branch to origin"
    git push -u origin $branchName
} else {
    Write-Host "Skipping push because -NoPush was provided." -ForegroundColor Yellow
}

if (-not $SkipPR) {
    if (-not (Test-CommandExists "gh")) {
        Fail "GitHub CLI 'gh' is not installed. Install it or rerun with -SkipPR."
    }

    Write-Step "Creating pull request"

    $tempFile = Join-Path $env:TEMP ("pr-body-" + [guid]::NewGuid().ToString() + ".md")
    Set-Content -Path $tempFile -Value $prBody -Encoding UTF8

    try {
        gh pr create `
            --repo $Repo `
            --base $BaseBranch `
            --head $branchName `
            --title $prTitle `
            --body-file $tempFile
    } finally {
        Remove-Item $tempFile -ErrorAction SilentlyContinue
    }
} else {
    Write-Host "Skipping PR creation because -SkipPR was provided." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Completed successfully." -ForegroundColor Green
Write-Host "Branch: $branchName"
Write-Host "Commit: $commitMessage"
if (-not $SkipPR) {
    Write-Host "PR Title: $prTitle"
}