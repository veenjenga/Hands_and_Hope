# 🎯 Quick Fix: Voice Navigation in Figma Preview

## The Problem

You're seeing **"Microphone Permission: DENIED"** even though you've allowed microphone access. This is because the app is running in a **Figma iframe preview**, and browsers block microphone access in iframes for security reasons.

---

## ✅ The Solution (2 Options)

### Option 1: Open in New Tab (Recommended - Takes 5 Seconds)

1. **Look for the yellow warning box** at the top of the Voice Navigation section that says:
   - "⚠️ Running in Preview/Iframe Mode"

2. **Click the button**: "🔓 Open in New Tab to Enable Voice Navigation"

3. **In the new tab**: Enable voice navigation - it will work!

**OR manually:**
- Right-click anywhere on the page
- Select **"Open in New Tab"** or **"Open in New Window"**
- Enable voice navigation in the new tab

---

### Option 2: Use Browser Address Bar

1. **Copy the URL** from your browser's address bar
2. **Open a new tab** (Ctrl+T or Cmd+T)
3. **Paste and go** to that URL
4. Enable voice navigation - now it works!

---

## Why This Happens

```
Browser Security Policy:
┌─────────────────────────────────┐
│  Figma Website (Parent)         │  ✓ Can access microphone
│  ┌───────────────────────────┐  │
│  │ Your App (Iframe)         │  │  ✗ Blocked by security
│  │ - Cannot access mic       │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘

When opened directly:
┌─────────────────────────────────┐
│  Your App (Direct Tab)          │  ✓ Can access microphone
└─────────────────────────────────┘
```

**Explanation:**
- When your app runs inside Figma's preview iframe, the browser blocks microphone access as a security feature
- This prevents malicious embedded content from recording audio without permission
- Opening the app in its own tab removes this restriction

---

## 🔍 How to Verify It's Working

After opening in a new tab:

1. Open **Accessibility Panel** (yellow ♿ button)
2. Click **"🔍 Check Voice Navigation Status"**
3. You should now see:
   ```
   ✓ Secure Context: YES
   ✓ Running in iframe: NO          ← Changed from YES
   ✓ Speech Recognition: YES
   ✓ getUserMedia: YES
   ✓ Microphone Permission: PROMPT  ← Changed from DENIED
   ```

4. Toggle **Voice Navigation ON**
5. Grant microphone permission when prompted
6. Status should change to: **"Microphone Permission: GRANTED"**
7. You'll see: **"Listening..."** with a pulsing microphone icon

---

## 🎤 Test It's Working

Say any of these commands:
- "Go to dashboard"
- "Go to products"
- "Increase text size"
- "Enable high contrast"
- "Help"

You should hear audio feedback and see your command in the "Last command" box.

---

## ⚡ Quick Reference

| Issue | In Iframe? | In New Tab? |
|-------|-----------|-------------|
| Yellow warning visible | ✓ Yes | ✗ No |
| "Running in iframe: YES" | ✓ Yes | ✗ No |
| "Permission: DENIED" always | ✓ Usually | ✗ Rare |
| Voice navigation works | ✗ No | ✓ Yes |

---

## 🚀 Once Opened in New Tab

You can:
- ✅ Use all voice commands
- ✅ Navigate hands-free
- ✅ Control accessibility settings by voice
- ✅ Get audio feedback
- ✅ No restrictions!

---

## 📱 For Mobile Users

Same issue can happen in mobile browsers:

**iOS Safari:**
1. Tap the **"Share"** button
2. Select **"Open in New Tab"**
3. Enable voice navigation

**Android Chrome:**
1. Tap the **menu (⋮)** button
2. Select **"Open in Chrome"** or **"Open in new tab"**
3. Enable voice navigation

---

## 💡 Developer Note

If you're deploying this app:
- Host it on its own domain (not in an iframe)
- If you must use an iframe, add the `allow` attribute:
  ```html
  <iframe allow="microphone" src="your-app-url"></iframe>
  ```
- Note: The parent page must also have microphone permission

---

**Bottom Line:** Just open the app in a new tab and voice navigation will work perfectly! 🎉

*Last Updated: November 27, 2025*
