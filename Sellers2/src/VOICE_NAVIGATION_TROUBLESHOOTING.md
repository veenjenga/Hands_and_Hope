# 🔧 Voice Navigation Troubleshooting Guide

## Problem: "Microphone Access Required" Error Even After Granting Permission

If you keep seeing the "microphone access required" error even though you've already allowed microphone access, follow these steps:

---

## 🚨 MOST COMMON ISSUE: Running in Figma Preview/Iframe

### If you see: "Microphone Permission: DENIED"

**You're probably in a Figma iframe preview!** This is the #1 cause of voice navigation issues.

**INSTANT FIX:**
1. **Look for yellow warning** at the top of Voice Navigation section
2. **Click: "🔓 Open in New Tab to Enable Voice Navigation"**
3. Done! Voice navigation will work in the new tab.

**Why?** Browsers block microphone access in iframes for security. Opening in a new tab removes this restriction.

📖 **See:** [FIGMA_IFRAME_VOICE_NAV_FIX.md](./FIGMA_IFRAME_VOICE_NAV_FIX.md) for detailed explanation.

---

## ✅ Other Quick Fixes

### 1. **Check the Diagnostic Tool**
- Open the Accessibility Panel (yellow ♿ button)
- Click **"🔍 Check Voice Navigation Status"** button
- Read the diagnostic information
- Look for "Running in iframe: YES" → If yes, open in new tab!
- This will tell you exactly what's wrong

### 2. **Hard Refresh the Page**
Sometimes the browser caches old permission states:
- **Windows/Linux**: Press `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac**: Press `Cmd + Shift + R`
- This forces a complete page reload

### 3. **Clear and Re-grant Permission**
#### Chrome/Edge:
1. Click the 🔒 **lock icon** in the address bar
2. Find **"Microphone"** in the dropdown
3. Change it to **"Ask (default)"** or **"Block"** first
4. Refresh the page
5. Now change it back to **"Allow"**
6. Try enabling voice navigation again

#### Firefox:
1. Click the 🔒 **lock icon** → **"Connection Secure"**
2. Click **"More Information"**
3. Go to **Permissions** tab
4. Find **"Use the Microphone"**
5. Uncheck **"Use Default"**
6. Click **"Allow"**
7. Refresh page

#### Safari:
1. Go to **Safari** → **Settings** → **Websites**
2. Click **"Microphone"** in left sidebar
3. Find this website
4. Change to **"Deny"** first, close settings
5. Reopen, change to **"Allow"**
6. Refresh page

---

## 🔍 Deep Troubleshooting

### Issue: Permission is "Granted" but Still Getting Error

This usually means another application is using your microphone.

**Windows:**
1. Close apps that might use microphone:
   - Zoom, Teams, Skype, Discord
   - Any recording software
   - Other browser tabs using voice features
2. Open **Settings** → **Privacy** → **Microphone**
3. Make sure your browser has permission
4. Try voice navigation again

**macOS:**
1. Close Zoom, Teams, FaceTime, etc.
2. Open **System Settings** → **Privacy & Security** → **Microphone**
3. Make sure your browser is checked
4. If it's already checked, uncheck it, wait 5 seconds, check it again
5. Restart your browser completely

---

### Issue: Browser Shows "Not Allowed" Permission

**Step 1: Find Where Permission is Blocked**

The permission could be blocked in three places:
1. ❌ **Page level** (address bar icon)
2. ❌ **Browser settings** (site permissions)
3. ❌ **System level** (OS privacy settings)

**Step 2: Check Page Level**
- Look for 🚫 or 🔒 in the address bar
- Click it and look for microphone
- If blocked, change to "Allow"

**Step 3: Check Browser Settings**

**Chrome:**
1. Go to `chrome://settings/content/microphone`
2. Look in **"Not allowed"** section
3. Remove this site from the blocked list
4. Refresh and try again

**Edge:**
1. Go to `edge://settings/content/microphone`
2. Check **"Not allowed"** section
3. Remove this site if it's there

**Firefox:**
1. Go to `about:preferences#privacy`
2. Scroll to **Permissions** → **Microphone** → **Settings**
3. Find this website
4. Change status to "Allow"
5. Save

**Safari:**
1. **Safari** → **Settings** → **Websites** → **Microphone**
2. Find this website
3. Change to **"Allow"**

**Step 4: Check System Level**

**Windows 11:**
1. **Settings** → **Privacy & Security** → **Microphone**
2. Turn ON **"Microphone access"**
3. Turn ON **"Let desktop apps access your microphone"**
4. Find your browser in the list, make sure it's ON
5. Restart browser

**Windows 10:**
1. **Settings** → **Privacy** → **Microphone**
2. Turn ON **"Allow apps to access your microphone"**
3. Scroll down, make sure browser is ON
4. Restart browser

**macOS:**
1. **System Settings** → **Privacy & Security** → **Microphone**
2. Find your browser (Chrome, Safari, etc.)
3. Toggle it OFF, wait 3 seconds, toggle it ON
4. Close and restart your browser completely

---

### Issue: Using HTTP Instead of HTTPS

Voice navigation requires a secure connection (HTTPS).

**Check your URL:**
- ✅ Good: `https://yoursite.com`
- ❌ Bad: `http://yoursite.com`

**Solutions:**
1. If possible, access the site with `https://` in the URL
2. Contact the site administrator to enable HTTPS
3. If testing locally, use `localhost` instead of `127.0.0.1`

---

### Issue: Browser Not Supported

**Check Browser Compatibility:**

✅ **Fully Supported:**
- Chrome 25+ (Windows, Mac, Linux, Android)
- Edge 79+ (Windows, Mac)
- Safari 14.1+ (Mac, iOS)

⚠️ **Partially Supported:**
- Firefox 62+ (may have issues on some systems)

❌ **Not Supported:**
- Internet Explorer
- Opera Mini
- Older mobile browsers

**Solution:** Use Chrome or Edge for best experience.

---

## 🧪 Advanced Diagnostics

### Test Your Microphone
1. Go to: https://www.onlinemictest.com/
2. Click "Allow" when asked for permission
3. Speak and see if the bars move
4. If it doesn't work here, the problem is with your microphone or system settings, not our app

### Check Browser Console
1. Press **F12** to open Developer Tools
2. Go to **Console** tab
3. Try enabling voice navigation
4. Look for error messages
5. Common errors and solutions:

| Error Message | Solution |
|---------------|----------|
| `NotAllowedError` | Permission denied - check browser settings |
| `NotFoundError` | No microphone detected - plug in a microphone |
| `NotReadableError` | Microphone in use by another app - close other apps |
| `AbortError` | Usually temporary - try again |
| `SecurityError` | Not on HTTPS - use secure connection |

---

## 🎯 Step-by-Step Reset Process

If nothing else works, try this complete reset:

### Chrome/Edge:
1. Go to `chrome://settings/content/siteDetails?site=YOUR_SITE_URL`
2. Find **Microphone**, click **"Reset permission"**
3. Close ALL browser windows (completely quit)
4. Clear browser cache: `Ctrl + Shift + Delete` → Select "Cookies and site data" → "Clear data"
5. Restart browser
6. Go back to the site
7. You'll see a fresh microphone permission prompt

### Firefox:
1. Go to `about:preferences#privacy`
2. Click **"Manage Permissions"** next to Microphone
3. Remove this site from the list
4. Close browser completely
5. Restart browser
6. Fresh permission prompt will appear

### Safari:
1. **Safari** → **Settings** → **Websites** → **Microphone**
2. Remove this site
3. **Safari** → **Clear History**
4. Select "all history" → **Clear History**
5. Quit and restart Safari
6. Fresh permission prompt will appear

---

## 📞 Still Having Issues?

### Before Asking for Help, Provide:

1. **Browser Info**: Chrome 120, Safari 17, etc.
2. **Operating System**: Windows 11, macOS Sonoma, etc.
3. **Diagnostic Results**: From "🔍 Check Voice Navigation Status" button
4. **Error Message**: Exact text of the error
5. **What You Tried**: Which steps above you've already attempted

### Alternative: Use Keyboard/Mouse
While we work on fixing your voice navigation, you can still use:
- Mouse/trackpad navigation
- Keyboard shortcuts
- Touch controls (on mobile)
- Screen reader mode (for text-to-speech feedback)

---

## 🔒 Privacy Note

- Voice navigation processes all audio **locally in your browser**
- No audio data is sent to our servers
- No recordings are stored
- Permission can be revoked anytime
- Audio processing stops when you toggle voice navigation OFF

---

*Last Updated: November 27, 2025*
*Platform: Hands & Hope Accessible Marketplace*
