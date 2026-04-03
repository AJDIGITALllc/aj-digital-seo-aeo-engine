param(
    [string]$Title = "",
    [string]$Body = "",
    [string]$Base = "main",
    [switch]$Draft,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

function Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Info($msg) { Write-Host "    $msg" -ForegroundColor White }
function Pass($msg) { Write-Host "OK: $msg" -ForegroundColor Green }
function Warn($msg) { Write-Host "WARN: $msg" -ForegroundColor Yellow }
function Fail($msg) { Write-Host "FAIL: $msg" -ForegroundColor Red; exit 1 }

# ─── Pre-flight checks ────────────────────────────────────────────────────────

Step "Pre-flight checks"

if (!(Test-Path ".git")) { Fail "Not inside a Git repository." }
Pass "Inside a Git repository"

$ghInstalled = Get-Command gh -ErrorAction SilentlyContinue
if (!$ghInstalled) { Fail "GitHub CLI (gh) is not installed. Install from https://cli.github.com" }
Pass "GitHub CLI available"

$currentBranch = git rev-parse --abbrev-ref HEAD
if ($currentBranch -eq $Base) {
    Fail "You are on '$Base'. Create a feature branch first."
}
Info "Branch: $currentBranch → $Base"

# ─── Ensure branch is pushed ──────────────────────────────────────────────────

Step "Ensure branch is pushed to origin"

$trackingBranch = git rev-parse --abbrev-ref --symbolic-full-name "@{u}" 2>$null
if (!$trackingBranch) {
    Info "No upstream set. Pushing branch to origin..."
    if (!$DryRun) {
        git push --set-upstream origin $currentBranch
    } else {
        Info "[DryRun] Would run: git push --set-upstream origin $currentBranch"
    }
    Pass "Branch pushed"
} else {
    $localHash  = git rev-parse HEAD
    $remoteHash = git rev-parse "@{u}" 2>$null
    if ($localHash -ne $remoteHash) {
        Info "Local commits not yet on origin. Pushing..."
        if (!$DryRun) { git push } else { Info "[DryRun] Would run: git push" }
        Pass "Branch synced"
    } else {
        Pass "Branch already up-to-date with origin"
    }
}

# ─── Build PR title ───────────────────────────────────────────────────────────

Step "Build PR title"

if (!$Title) {
    # Auto-generate from branch name: feature/add-foo-bar → Add foo bar
    $branchSlug = $currentBranch -replace '^(feature|fix|chore|docs|refactor|test)/', ''
    $Title = (Get-Culture).TextInfo.ToTitleCase(($branchSlug -replace '[-_]', ' '))
    Info "Auto-generated title: $Title"
} else {
    Info "Using provided title: $Title"
}

if ($Title.Length -gt 70) {
    Warn "PR title exceeds 70 characters ($($Title.Length)). Consider shortening."
}

# ─── Build PR body ────────────────────────────────────────────────────────────

Step "Build PR body"

if (!$Body) {
    $commitLog = git log --oneline "$Base..HEAD" 2>$null
    $commitSummary = if ($commitLog) { $commitLog -join "`n- " } else { "See commits above." }

    $Body = @"
## Summary

- $commitSummary

## Test plan

- [ ] Ran repo health check: ``.\scripts\repo-health-check.ps1``
- [ ] Validated schema files parse correctly
- [ ] Reviewed workflow spec for accuracy
- [ ] Checked for missing env vars in `.env.example`

## Checklist

- [ ] No secrets committed
- [ ] No nested `.git` directories introduced
- [ ] CHANGELOG.md updated if this is a user-facing change

---
*Created with [git-smart-pr.ps1](scripts/git-smart-pr.ps1)*
"@
    Info "Auto-generated PR body from commit log"
}

# ─── Check for existing PR ────────────────────────────────────────────────────

Step "Check for existing PR"

$existingPr = gh pr view $currentBranch --json number,url 2>$null | ConvertFrom-Json -ErrorAction SilentlyContinue
if ($existingPr) {
    Warn "PR already exists for this branch: $($existingPr.url)"
    $answer = Read-Host "Open existing PR instead? [Y/n]"
    if ($answer -ne 'n') {
        gh pr view $currentBranch --web
        exit 0
    }
}

# ─── Create PR ────────────────────────────────────────────────────────────────

Step "Create pull request"

$draftFlag = if ($Draft) { "--draft" } else { "" }

if ($DryRun) {
    Info "[DryRun] Would run:"
    Info "  gh pr create --base $Base --title `"$Title`" $draftFlag"
    Info "  Body (truncated): $($Body.Substring(0, [Math]::Min(100, $Body.Length)))..."
    Pass "Dry run complete. No PR created."
    exit 0
}

$prUrl = gh pr create `
    --base $Base `
    --title $Title `
    --body $Body `
    $draftFlag

if ($LASTEXITCODE -eq 0) {
    Pass "Pull request created: $prUrl"
} else {
    Fail "gh pr create failed. Check output above."
}

# ─── Summary ──────────────────────────────────────────────────────────────────

Step "Done"
Info "PR: $prUrl"
Info "Branch: $currentBranch → $Base"
if ($Draft) { Warn "Created as DRAFT. Mark ready for review when complete." }
