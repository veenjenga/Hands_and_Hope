# 🎤 Voice Navigation - Quick Start Guide

## 🚀 Getting Started (30 Seconds)

### Step 1: Check if You're in Figma Preview
**Look for a yellow warning box** when you open the Accessibility Panel.

```
⚠️ If you see this yellow box:
┌─────────────────────────────────────────────┐
│ ⚠️ Running in Preview/Iframe Mode          │
│ Voice navigation may not work...            │
│ [🔓 Open in New Tab to Enable Voice Nav]   │
└─────────────────────────────────────────────┘
```

**If YES:** Click the button → Voice nav will work in new tab ✅  
**If NO:** Continue to Step 2 ↓

---

### Step 2: Enable Voice Navigation
1. Click yellow **♿ Accessibility** button (top-right)
2. Find **"Voice Navigation"** section
3. Toggle the switch **ON** or click **"Enable Voice Commands"**
4. Grant microphone permission when browser asks
5. Wait for **"Listening..."** status with pulsing 🎤 icon

---

### Step 3: Start Talking!
Say commands like:
- "Go to dashboard"
- "Go to products"
- "Increase text size"
- "Enable high contrast"

You'll hear audio confirmation and see your command displayed.

---

## 🎯 Command Categories

### Navigate Pages
```
✓ "Go to dashboard"
✓ "Go to products"
✓ "Go to inquiries"
✓ "Go to notifications"
✓ "Go to profile"
✓ "Go to settings"
✓ "Go to help"
```

### Authentication (Login/Register Pages)
```
✓ "Sign in" / "Log in"
✓ "Create account" / "Sign up" / "Register"
```

### Adjust Text Size
```
✓ "Increase text" / "Larger text"
✓ "Decrease text" / "Smaller text"
```

### Display Settings
```
✓ "Enable high contrast"
✓ "Disable high contrast"
```

### Screen Reader
```
✓ "Enable screen reader"
✓ "Disable screen reader"
```

### System
```
✓ "Reset settings"
✓ "Help" - Lists all available commands
```

---

## 🔍 Troubleshooting (If Not Working)

### Run Diagnostics
1. Open Accessibility Panel
2. Click **"🔍 Check Voice Navigation Status"**
3. Read the report:

```
Example Good Status:
✓ Secure Context: YES
✓ Running in iframe: NO
✓ Speech Recognition: YES
✓ getUserMedia: YES
✓ Microphone Permission: GRANTED

Example Problem Status:
✓ Secure Context: YES
✓ Running in iframe: YES          ← Problem!
⚠️ Figma Preview Environment
✓ Speech Recognition: YES
✓ getUserMedia: YES
✓ Microphone Permission: DENIED   ← Problem!
⚠️ IFRAME RESTRICTION DETECTED
Solution: Open in new tab
```

### Common Issues & Instant Fixes

| What You See | Problem | Fix |
|--------------|---------|-----|
| "Running in iframe: YES" | In Figma preview | Click "Open in New Tab" button |
| "Permission: DENIED" + iframe | Browser security | Open in new tab |
| "Permission: DENIED" no iframe | Need to allow | Click lock icon → Allow microphone |
| "Not Listening" | Voice nav off | Toggle switch ON |
| Yellow warning box | In iframe/preview | Click "Open in New Tab" button |

---

## ✅ Success Indicators

You'll know it's working when you see:

1. **🎤 Pulsing microphone icon** (red, animated)
2. **Green badge** saying "Listening..."
3. **Your spoken words** appear in "Last command" box
4. **Audio feedback** confirms your command
5. **Page changes** when you say navigation commands

---

## 💡 Pro Tips

### Tip 1: Speak Naturally
- Use normal speaking voice
- Clear pronunciation helps
- Don't shout or whisper

### Tip 2: Use Full Phrases
- ✅ "Go to products" (clear, works)
- ❌ "Products" (unclear, may not work)

### Tip 3: Wait for Feedback
- System speaks back to confirm
- Wait for audio to finish
- Then give next command

### Tip 4: Check Environment
- Quiet room works best
- Reduce background noise
- Close other apps using microphone

### Tip 5: View Commands Anytime
- Expand "View voice commands" in panel
- Or just say "Help"
- System will list all available commands

---

## 🌐 Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Excellent | Recommended |
| Edge | ✅ Excellent | Recommended |
| Safari | ✅ Good | macOS/iOS |
| Firefox | ⚠️ Fair | May have issues |
| Others | ❌ Limited | Use Chrome/Edge |

---

## 🔐 Privacy & Security

- ✅ All voice processing happens **in your browser**
- ✅ **No audio sent to servers**
- ✅ **No recordings stored**
- ✅ Microphone only active when Voice Nav is ON
- ✅ Toggle OFF anytime to stop listening
- ✅ Permission can be revoked in browser settings

---

## 📱 Mobile Support

Voice navigation works on mobile too!

**iOS Safari:**
- Tap Accessibility button
- Enable Voice Navigation
- Grant microphone permission
- Start speaking!

**Android Chrome:**
- Same process as desktop
- Works great with built-in mic
- Or use Bluetooth headset

---

## 🎓 Learning Path

### Beginner (Day 1)
Learn 3 basic commands:
1. "Go to dashboard"
2. "Increase text"
3. "Help"

### Intermediate (Day 2-3)
Add navigation:
1. "Go to products"
2. "Go to notifications"
3. "Go to profile"

### Advanced (Day 4+)
Full accessibility control:
1. "Enable high contrast"
2. "Reset settings"
3. Combine with other features

---

## 📚 Related Documentation

- **Detailed Guide:** [VOICE_NAVIGATION_GUIDE.md](./VOICE_NAVIGATION_GUIDE.md)
- **Troubleshooting:** [VOICE_NAVIGATION_TROUBLESHOOTING.md](./VOICE_NAVIGATION_TROUBLESHOOTING.md)
- **Figma/Iframe Fix:** [FIGMA_IFRAME_VOICE_NAV_FIX.md](./FIGMA_IFRAME_VOICE_NAV_FIX.md)

---

## ⚡ TL;DR - Absolute Fastest Start

1. **In Figma preview?** → Click "Open in New Tab" button in yellow warning
2. **In new tab/window?** → Toggle Voice Navigation ON
3. **Allow microphone** when browser asks
4. **Say "help"** to hear all commands
5. **Done!** Start navigating by voice 🎉

---

*Hands & Hope - Making accessibility accessible to everyone*
*Last Updated: November 27, 2025*
