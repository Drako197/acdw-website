# Daily Dev Branch Sync Setup

## Overview

Automated script to pull latest changes from `origin/Dev` branch every weekday at 9:00 AM.

## Files Created

1. **`scripts/pull-dev-branch.sh`** - The sync script
2. **`scripts/com.acdw.pull-dev.plist`** - macOS LaunchAgent configuration
3. **`.git-pull-log.txt`** - Log file (created automatically)

---

## Setup Instructions (macOS)

### Option 1: LaunchAgent (Recommended - Automatic)

1. **Copy the plist file to LaunchAgents:**
   ```bash
   cp "/Users/uxdesign/Desktop/Project/ACDW Website/scripts/com.acdw.pull-dev.plist" ~/Library/LaunchAgents/
   ```

2. **Load the LaunchAgent:**
   ```bash
   launchctl load ~/Library/LaunchAgents/com.acdw.pull-dev.plist
   ```

3. **Verify it's loaded:**
   ```bash
   launchctl list | grep com.acdw.pull-dev
   ```

4. **Test it manually (optional):**
   ```bash
   launchctl start com.acdw.pull-dev
   ```

### Option 2: Manual Script (Run when needed)

Simply run the script manually:
```bash
/Users/uxdesign/Desktop/Project/ACDW Website/scripts/pull-dev-branch.sh
```

### Option 3: Cron (Alternative)

If you prefer cron, add this to your crontab:
```bash
crontab -e
```

Add this line:
```
0 9 * * 1-5 /Users/uxdesign/Desktop/Project/ACDW Website/scripts/pull-dev-branch.sh
```

---

## Schedule

- **Time:** 9:00 AM
- **Days:** Monday through Friday
- **Action:** Pulls latest changes from `origin/Dev`

---

## What the Script Does

1. ✅ Checks if you're on Dev branch (switches if needed)
2. ✅ Fetches latest changes from origin
3. ✅ Checks if updates are available
4. ✅ Pulls changes if available
5. ✅ Logs all activity to `.git-pull-log.txt`

---

## Logs

- **Success logs:** `.git-pull-log.txt`
- **Error logs:** `.git-pull-log-errors.txt`

View recent activity:
```bash
tail -20 "/Users/uxdesign/Desktop/Project/ACDW Website/.git-pull-log.txt"
```

---

## Troubleshooting

### Script not running?

1. **Check if LaunchAgent is loaded:**
   ```bash
   launchctl list | grep com.acdw.pull-dev
   ```

2. **Check logs:**
   ```bash
   cat "/Users/uxdesign/Desktop/Project/ACDW Website/.git-pull-log.txt"
   cat "/Users/uxdesign/Desktop/Project/ACDW Website/.git-pull-log-errors.txt"
   ```

3. **Reload LaunchAgent:**
   ```bash
   launchctl unload ~/Library/LaunchAgents/com.acdw.pull-dev.plist
   launchctl load ~/Library/LaunchAgents/com.acdw.pull-dev.plist
   ```

### Update the schedule?

Edit the plist file:
```bash
nano ~/Library/LaunchAgents/com.acdw.pull-dev.plist
```

Change the `StartCalendarInterval` section:
- `Hour`: 0-23 (9 = 9 AM)
- `Minute`: 0-59 (0 = top of hour)
- `Weekday`: 1-7 (1 = Monday, 7 = Sunday)

Then reload:
```bash
launchctl unload ~/Library/LaunchAgents/com.acdw.pull-dev.plist
launchctl load ~/Library/LaunchAgents/com.acdw.pull-dev.plist
```

### Remove the scheduled task?

```bash
launchctl unload ~/Library/LaunchAgents/com.acdw.pull-dev.plist
rm ~/Library/LaunchAgents/com.acdw.pull-dev.plist
```

---

## For Your Coworker

Your coworker needs to set this up on their machine too:

1. Pull the latest code (which includes these scripts)
2. Follow the same setup instructions above
3. The script will run automatically at 9:00 AM on weekdays

**Note:** Each person needs to set this up on their own machine since it's a local automation.

---

## Manual Sync (If Needed)

If you need to sync outside the scheduled time:
```bash
/Users/uxdesign/Desktop/Project/ACDW Website/scripts/pull-dev-branch.sh
```

---

## Security Note

The script only **pulls** changes - it never pushes or modifies code. It's safe to run automatically.

