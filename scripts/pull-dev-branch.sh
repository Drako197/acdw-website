#!/bin/bash

# Daily Dev Branch Sync Script
# Pulls latest changes from origin/Dev branch
# Runs Monday-Friday at 9:00 AM

# Get the script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Log file for tracking pulls
LOG_FILE="$PROJECT_DIR/.git-pull-log.txt"

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Change to project directory
cd "$PROJECT_DIR" || {
    log "ERROR: Failed to change to project directory: $PROJECT_DIR"
    exit 1
}

# Check if we're on Dev branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "Dev" ]; then
    log "WARNING: Not on Dev branch (currently on: $CURRENT_BRANCH). Switching to Dev..."
    git checkout Dev || {
        log "ERROR: Failed to checkout Dev branch"
        exit 1
    }
fi

# Fetch latest changes
log "Fetching latest changes from origin..."
git fetch origin || {
    log "ERROR: Failed to fetch from origin"
    exit 1
}

# Check if there are updates
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/Dev)

if [ "$LOCAL" = "$REMOTE" ]; then
    log "✅ Already up to date with origin/Dev"
    exit 0
fi

# Pull latest changes
log "Pulling latest changes from origin/Dev..."
git pull origin Dev || {
    log "ERROR: Failed to pull from origin/Dev"
    exit 1
}

# Show what changed
log "✅ Successfully pulled latest changes"
log "Recent commits:"
git log --oneline "$LOCAL"..HEAD | head -5 | while read -r line; do
    log "  - $line"
done

exit 0

