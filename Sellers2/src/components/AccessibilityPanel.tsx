import { useEffect, useState } from 'react';
import { ZoomIn, ZoomOut, Contrast, Volume2, X, RotateCcw, Mic, MicOff, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface AccessibilityPanelProps {
  fontSize: 'normal' | 'large' | 'extra-large';
  setFontSize: (size: 'normal' | 'large' | 'extra-large') => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  screenReader: boolean;
  setScreenReader: (value: boolean) => void;
  voiceNavigation: boolean;
  setVoiceNavigation: (value: boolean) => void;
  onClose: () => void;
  onNavigate?: (page: string) => void;
}

export function AccessibilityPanel({
  fontSize,
  setFontSize,
  highContrast,
  setHighContrast,
  screenReader,
  setScreenReader,
  voiceNavigation,
  setVoiceNavigation,
  onClose,
  onNavigate,
}: AccessibilityPanelProps) {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');
  const [recognition, setRecognition] = useState<any>(null);
  const [supportsSpeech, setSupportsSpeech] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);

  useEffect(() => {
    // Check if browser supports Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setSupportsSpeech(true);
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        setLastCommand(transcript);
        handleVoiceCommand(transcript);
      };

      recognitionInstance.onerror = (event: any) => {
        // Silently handle common errors that don't need user attention
        if (event.error === 'no-speech' || event.error === 'aborted') {
          return;
        }
        
        // Only show permission error if user explicitly tried to enable voice nav
        if (event.error === 'not-allowed' && voiceNavigation) {
          console.log('Microphone permission needed for voice navigation');
          setPermissionError(true);
          setErrorMessage('Microphone permission needed.');
          setVoiceNavigation(false);
          setIsListening(false);
        }
      };

      recognitionInstance.onend = () => {
        // Automatically restart if voice navigation is still enabled
        if (voiceNavigation && isListening) {
          try {
            recognitionInstance.start();
          } catch (e) {
            console.error('Error restarting recognition:', e);
          }
        }
      };

      setRecognition(recognitionInstance);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  // Auto-start voice navigation if it's enabled by default
  useEffect(() => {
    if (voiceNavigation && !isListening && recognition && supportsSpeech) {
      // Small delay to ensure recognition is ready
      const timer = setTimeout(() => {
        toggleVoiceNavigation(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [recognition, supportsSpeech]);

  useEffect(() => {
    if (!recognition) return;

    if (voiceNavigation && isListening) {
      try {
        recognition.start();
        speak('Voice navigation activated. You can say commands like: go to dashboard, go to products, go to notifications, increase text size, enable high contrast, or disable high contrast.');
      } catch (e) {
        console.error('Error starting recognition:', e);
      }
    } else {
      try {
        recognition.stop();
      } catch (e) {
        console.error('Error stopping recognition:', e);
      }
    }
  }, [voiceNavigation, isListening, recognition]);

  const speak = (text: string) => {
    if (!screenReader && !voiceNavigation) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceCommand = (command: string) => {
    console.log('Voice command:', command);

    // Navigation commands
    if (command.includes('go to dashboard') || command.includes('open dashboard')) {
      onNavigate?.('dashboard');
      speak('Navigating to dashboard');
    } else if (command.includes('go to products') || command.includes('open products') || command.includes('show products')) {
      onNavigate?.('products');
      speak('Navigating to products');
    } else if (command.includes('go to inquiries') || command.includes('open inquiries') || command.includes('show inquiries')) {
      onNavigate?.('inquiries');
      speak('Navigating to inquiries');
    } else if (command.includes('go to notifications') || command.includes('open notifications') || command.includes('show notifications')) {
      onNavigate?.('notifications');
      speak('Navigating to notifications');
    } else if (command.includes('go to profile') || command.includes('open profile') || command.includes('show profile')) {
      onNavigate?.('profile');
      speak('Navigating to profile');
    } else if (command.includes('go to settings') || command.includes('open settings') || command.includes('show settings')) {
      onNavigate?.('settings');
      speak('Navigating to settings');
    } else if (command.includes('go to help') || command.includes('open help') || command.includes('show help')) {
      onNavigate?.('help');
      speak('Navigating to help');
    }
    // Text size commands
    else if (command.includes('increase text') || command.includes('larger text') || command.includes('bigger text')) {
      if (fontSize === 'normal') {
        setFontSize('large');
        speak('Text size increased to large');
      } else if (fontSize === 'large') {
        setFontSize('extra-large');
        speak('Text size increased to extra large');
      } else {
        speak('Text size is already at maximum');
      }
    } else if (command.includes('decrease text') || command.includes('smaller text')) {
      if (fontSize === 'extra-large') {
        setFontSize('large');
        speak('Text size decreased to large');
      } else if (fontSize === 'large') {
        setFontSize('normal');
        speak('Text size decreased to normal');
      } else {
        speak('Text size is already at minimum');
      }
    }
    // High contrast commands
    else if (command.includes('enable high contrast') || command.includes('turn on high contrast') || command.includes('activate high contrast')) {
      setHighContrast(true);
      speak('High contrast mode enabled');
    } else if (command.includes('disable high contrast') || command.includes('turn off high contrast') || command.includes('deactivate high contrast')) {
      setHighContrast(false);
      speak('High contrast mode disabled');
    }
    // Screen reader commands
    else if (command.includes('enable screen reader') || command.includes('turn on screen reader')) {
      setScreenReader(true);
      speak('Screen reader mode enabled');
    } else if (command.includes('disable screen reader') || command.includes('turn off screen reader')) {
      setScreenReader(false);
      speak('Screen reader mode disabled');
    }
    // Reset command
    else if (command.includes('reset settings') || command.includes('reset all')) {
      resetAll();
      speak('All accessibility settings have been reset');
    }
    // Help command
    else if (command.includes('help') || command.includes('what can i say') || command.includes('commands')) {
      speak('Available commands: Go to dashboard, products, inquiries, notifications, profile, settings, or help. You can also say: increase text size, decrease text size, enable high contrast, disable high contrast, or reset settings.');
    }
  };

  const increaseFontSize = () => {
    if (fontSize === 'normal') {
      setFontSize('large');
      speak('Text size increased to large');
    } else if (fontSize === 'large') {
      setFontSize('extra-large');
      speak('Text size increased to extra large');
    }
  };

  const decreaseFontSize = () => {
    if (fontSize === 'extra-large') {
      setFontSize('large');
      speak('Text size decreased to large');
    } else if (fontSize === 'large') {
      setFontSize('normal');
      speak('Text size decreased to normal');
    }
  };

  const resetAll = () => {
    setFontSize('normal');
    setHighContrast(false);
    setScreenReader(false);
    setVoiceNavigation(false);
    setIsListening(false);
  };

  const toggleVoiceNavigation = async (enabled: boolean) => {
    if (enabled) {
      setPermissionError(false);
      setErrorMessage('');
      
      // Check if we're on HTTPS or localhost
      const isSecureContext = window.isSecureContext;
      if (!isSecureContext) {
        setPermissionError(true);
        setErrorMessage('Voice navigation requires a secure connection (HTTPS). This feature may not work on HTTP sites.');
        setVoiceNavigation(false);
        setIsListening(false);
        return;
      }

      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setPermissionError(true);
        setErrorMessage('Your browser does not support microphone access. Please use a modern browser like Chrome, Edge, or Safari.');
        setVoiceNavigation(false);
        setIsListening(false);
        return;
      }
      
      // Request microphone permission
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop the stream immediately, we just needed permission
        stream.getTracks().forEach(track => track.stop());
        
        setVoiceNavigation(true);
        setIsListening(true);
        setPermissionError(false);
        setErrorMessage('');
        setPermissionGranted(true);
      } catch (error: any) {
        // Don't log permission errors to console - they're expected when user denies access
        setPermissionError(true);
        
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          setErrorMessage('Microphone access was denied. Click "Show Instructions" below for help.');
        } else if (error.name === 'NotFoundError') {
          setErrorMessage('No microphone found. Please connect a microphone and try again.');
        } else if (error.name === 'NotReadableError') {
          setErrorMessage('Microphone is being used by another application. Please close other apps and try again.');
        } else {
          setErrorMessage('Unable to access microphone. Please check your browser settings and try again.');
        }
        
        setVoiceNavigation(false);
        setIsListening(false);
      }
    } else {
      setVoiceNavigation(false);
      setIsListening(false);
      setLastCommand('');
      setPermissionError(false);
      setErrorMessage('');
      setPermissionGranted(false);
    }
  };

  const retryPermission = () => {
    setPermissionError(false);
    setErrorMessage('');
    toggleVoiceNavigation(true);
  };

  return (
    <Card className="fixed right-6 top-24 z-50 w-96 shadow-2xl max-h-[calc(100vh-8rem)] overflow-y-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 sticky top-0 bg-white z-10 border-b">
        <CardTitle className="flex items-center gap-2">
          Accessibility Options
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close accessibility panel"
        >
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Voice Navigation */}
        <div className={`rounded-lg border-2 p-4 ${voiceNavigation ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between space-x-4 mb-3">
            <div className="flex items-start gap-3">
              {isListening ? (
                <Mic className="mt-1 h-6 w-6 text-red-600 animate-pulse" />
              ) : (
                <MicOff className="mt-1 h-6 w-6 text-blue-600" />
              )}
              <div className="flex-1">
                <Label htmlFor="voice-navigation" className="cursor-pointer text-base">
                  Voice Navigation
                </Label>
                <p className="mt-1 text-sm text-gray-600">
                  Control the app with voice commands
                </p>
              </div>
            </div>
            <Switch
              id="voice-navigation"
              checked={voiceNavigation}
              onCheckedChange={toggleVoiceNavigation}
              aria-label="Toggle voice navigation"
              disabled={!supportsSpeech}
            />
          </div>

          {!voiceNavigation && supportsSpeech && !permissionError && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900 mb-2">
                🎤 <strong>Voice Navigation is ready!</strong> Click the toggle above or this button to activate:
              </p>
              <Button 
                onClick={() => toggleVoiceNavigation(true)}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <Mic className="mr-2 h-5 w-5" />
                Enable Voice Commands
              </Button>
            </div>
          )}

          {!supportsSpeech && (
            <div className="mt-2 rounded bg-yellow-50 border border-yellow-200 p-2">
              <p className="text-sm text-yellow-800">
                Voice navigation is not supported in your browser. Try Chrome, Edge, or Safari.
              </p>
            </div>
          )}

          {permissionError && (
            <div className="mt-2 rounded bg-amber-50 border-2 border-amber-300 p-4">
              <div className="flex items-start gap-2 mb-3">
                <HelpCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-amber-900 mb-1">
                    Microphone Access Required
                  </p>
                  <p className="text-sm text-amber-800">
                    {errorMessage}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="default" size="sm" className="flex-1 bg-amber-600 hover:bg-amber-700">
                      <HelpCircle className="h-4 w-4 mr-1" />
                      Show Instructions
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>How to Enable Microphone Access</DialogTitle>
                      <DialogDescription>
                        Follow these steps to allow microphone access in your browser
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 mt-4">
                      {/* Quick Steps */}
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg">
                        <h3 className="font-semibold mb-2 text-blue-900">⚡ Quick Fix (Most Common)</h3>
                        <ol className="list-decimal list-inside space-y-1.5 text-sm text-blue-900">
                          <li>Look for the 🔒 <strong>lock icon</strong> or 🚫 <strong>blocked icon</strong> in your browser's address bar</li>
                          <li>Click it and find <strong>"Microphone"</strong></li>
                          <li>Change from "Block" to <strong>"Allow"</strong></li>
                          <li>Refresh this page</li>
                          <li>Click "Try Again" below</li>
                        </ol>
                      </div>

                      {/* Chrome/Edge Instructions */}
                      <div>
                        <h3 className="font-semibold mb-2">🌐 Google Chrome / Microsoft Edge</h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          <li>Look for the 🔒 <strong>lock icon</strong> or 🎤 <strong>microphone icon</strong> in the address bar</li>
                          <li>Click on it to open the permissions menu</li>
                          <li>Find <strong>"Microphone"</strong> in the list</li>
                          <li>Change the setting from "Block" to <strong>"Allow"</strong></li>
                          <li>Refresh the page and try again</li>
                        </ol>
                        <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                          <p className="text-xs text-blue-800">
                            <strong>Alternative:</strong> Go to Settings → Privacy and security → Site settings → Microphone → Add this site to "Allowed to use your microphone"
                          </p>
                        </div>
                      </div>

                      {/* Firefox Instructions */}
                      <div>
                        <h3 className="font-semibold mb-2">🦊 Mozilla Firefox</h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          <li>Click the 🎤 <strong>microphone icon</strong> in the address bar</li>
                          <li>Click on <strong>"Blocked Temporarily"</strong></li>
                          <li>Select <strong>"Always Allow"</strong></li>
                          <li>Click "Allow" when the permission prompt appears</li>
                          <li>Refresh the page if needed</li>
                        </ol>
                      </div>

                      {/* Safari Instructions */}
                      <div>
                        <h3 className="font-semibold mb-2">🧭 Safari (macOS)</h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          <li>Go to <strong>Safari</strong> menu → <strong>Settings</strong> (or Preferences)</li>
                          <li>Click the <strong>"Websites"</strong> tab</li>
                          <li>Select <strong>"Microphone"</strong> from the left sidebar</li>
                          <li>Find this website in the list</li>
                          <li>Change the permission to <strong>"Allow"</strong></li>
                          <li>Refresh the page and try again</li>
                        </ol>
                      </div>

                      {/* System Permissions */}
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                        <h3 className="font-semibold mb-2">⚠️ System Permissions (macOS/Windows)</h3>
                        <p className="text-sm mb-2">If the above doesn't work, check your system settings:</p>
                        
                        <div className="space-y-2 text-sm">
                          <div>
                            <strong>macOS:</strong>
                            <ol className="list-decimal list-inside ml-4 mt-1">
                              <li>Go to System Settings → Privacy & Security → Microphone</li>
                              <li>Make sure your browser (Chrome/Safari/etc.) is checked</li>
                              <li>Restart your browser</li>
                            </ol>
                          </div>
                          
                          <div>
                            <strong>Windows:</strong>
                            <ol className="list-decimal list-inside ml-4 mt-1">
                              <li>Go to Settings → Privacy → Microphone</li>
                              <li>Make sure "Allow apps to access your microphone" is ON</li>
                              <li>Scroll down and enable for your browser</li>
                            </ol>
                          </div>
                        </div>
                      </div>

                      {/* Troubleshooting */}
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                        <h3 className="font-semibold mb-2">🔧 Still Not Working?</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Make sure your microphone is properly connected</li>
                          <li>Close other applications that might be using the microphone (Zoom, Skype, etc.)</li>
                          <li>Try restarting your browser</li>
                          <li>Make sure you're on a secure connection (HTTPS)</li>
                          <li>Try a different browser (Chrome works best for voice features)</li>
                        </ul>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={retryPermission}
                  className="flex-1"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {voiceNavigation && supportsSpeech && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={isListening ? 'default' : 'secondary'} className="gap-1">
                  {isListening ? (
                    <>
                      <Mic className="h-3 w-3" />
                      Listening...
                    </>
                  ) : (
                    <>
                      <MicOff className="h-3 w-3" />
                      Not Listening
                    </>
                  )}
                </Badge>
              </div>
              
              {lastCommand && (
                <div className="rounded bg-blue-100 p-2">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">Last command:</span> "{lastCommand}"
                  </p>
                </div>
              )}

              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800">
                  View voice commands
                </summary>
                <div className="mt-2 space-y-1 text-sm text-gray-700 rounded bg-white p-3 border">
                  <p className="font-semibold mb-2">Navigation:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>"Go to dashboard"</li>
                    <li>"Go to products"</li>
                    <li>"Go to inquiries"</li>
                    <li>"Go to notifications"</li>
                    <li>"Go to profile"</li>
                    <li>"Go to settings"</li>
                  </ul>
                  <p className="font-semibold mt-3 mb-2">Accessibility:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>"Increase text size"</li>
                    <li>"Decrease text size"</li>
                    <li>"Enable high contrast"</li>
                    <li>"Disable high contrast"</li>
                    <li>"Reset settings"</li>
                  </ul>
                </div>
              </details>
            </div>
          )}
        </div>

        {/* Text Size Controls */}
        <div className="space-y-3">
          <Label className="text-lg">Text Size</Label>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={decreaseFontSize}
              disabled={fontSize === 'normal'}
              aria-label="Decrease text size"
              className="flex-1"
            >
              <ZoomOut className="mr-2 h-5 w-5" />
              Smaller
            </Button>
            <div className="flex h-12 w-24 items-center justify-center rounded-md border-2 border-gray-300 px-2">
              <span className="capitalize">{fontSize}</span>
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={increaseFontSize}
              disabled={fontSize === 'extra-large'}
              aria-label="Increase text size"
              className="flex-1"
            >
              <ZoomIn className="mr-2 h-5 w-5" />
              Larger
            </Button>
          </div>
        </div>

        {/* High Contrast Mode */}
        <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
          <div className="flex items-start gap-3">
            <Contrast className="mt-1 h-6 w-6 text-blue-600" />
            <div className="flex-1">
              <Label htmlFor="high-contrast" className="cursor-pointer text-base">
                High Contrast Mode
              </Label>
              <p className="mt-1 text-sm text-gray-600">
                Increase contrast for better visibility
              </p>
            </div>
          </div>
          <Switch
            id="high-contrast"
            checked={highContrast}
            onCheckedChange={(checked) => {
              setHighContrast(checked);
              speak(checked ? 'High contrast mode enabled' : 'High contrast mode disabled');
            }}
            aria-label="Toggle high contrast mode"
          />
        </div>

        {/* Screen Reader Optimization */}
        <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
          <div className="flex items-start gap-3">
            <Volume2 className="mt-1 h-6 w-6 text-blue-600" />
            <div className="flex-1">
              <Label htmlFor="screen-reader" className="cursor-pointer text-base">
                Screen Reader Mode
              </Label>
              <p className="mt-1 text-sm text-gray-600">
                Enable text-to-speech feedback
              </p>
            </div>
          </div>
          <Switch
            id="screen-reader"
            checked={screenReader}
            onCheckedChange={(checked) => {
              setScreenReader(checked);
              if (checked) {
                speak('Screen reader mode enabled. The app will now provide audio feedback.');
              }
            }}
            aria-label="Toggle screen reader optimization"
          />
        </div>

        {/* Reset Button */}
        <Button
          variant="outline"
          size="lg"
          onClick={resetAll}
          className="w-full"
          aria-label="Reset all accessibility settings"
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          Reset All Settings
        </Button>
      </CardContent>
    </Card>
  );
}