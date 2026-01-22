import { useState, useEffect } from 'react';
import { X, Type, Eye, Keyboard, Volume2, Contrast, Link as LinkIcon, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';

interface AccessibilityMenuProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  onSettingsChange: (settings: AccessibilitySettings) => void;
}

export interface AccessibilitySettings {
  textSize: number; // 100 = normal, 125 = large, 150 = extra large
  highContrast: boolean;
  screenReader: boolean;
  voiceNavigation: boolean;
  underlineLinks: boolean;
  keyboardNavigation: boolean;
  reduceMotion: boolean;
}

export default function AccessibilityMenu({ 
  isOpen, 
  onClose, 
  settings, 
  onSettingsChange 
}: AccessibilityMenuProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  // Announce changes for screen readers
  const announceChange = (message: string) => {
    if (settings.screenReader) {
      setAnnouncement(message);
      setTimeout(() => setAnnouncement(''), 1000);
    }
  };

  // Text-to-speech function
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleTextSizeChange = (value: number[]) => {
    const newSize = value[0];
    onSettingsChange({ ...settings, textSize: newSize });
    announceChange(`Text size changed to ${newSize}%`);
  };

  const handleToggle = (setting: keyof AccessibilitySettings, label: string) => {
    const newValue = !settings[setting];
    onSettingsChange({ ...settings, [setting]: newValue });
    announceChange(`${label} ${newValue ? 'enabled' : 'disabled'}`);
  };

  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      textSize: 100,
      highContrast: false,
      screenReader: false,
      voiceNavigation: false,
      underlineLinks: false,
      keyboardNavigation: true,
      reduceMotion: false
    };
    onSettingsChange(defaultSettings);
    announceChange('All accessibility settings reset to default');
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        className="fixed right-4 bottom-20 w-96 max-h-[80vh] overflow-y-auto bg-white rounded-lg shadow-2xl z-50 border-4 border-[#1e2875]"
        role="dialog"
        aria-labelledby="accessibility-menu-title"
        aria-modal="true"
      >
        <Card className="border-0">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-[#1e2875] text-white rounded-full w-12 h-12 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M12 2a2 2 0 100 4 2 2 0 000-4zM8.5 8a1.5 1.5 0 00-1.5 1.5V14a1 1 0 01-2 0V9.5a3.5 3.5 0 013-3.465A3.5 3.5 0 0111.5 3h1a3.5 3.5 0 013.5 3.5V14a1 1 0 11-2 0V9.5A1.5 1.5 0 0012.5 8h-1a1.5 1.5 0 00-1.5 1.5V18l2.5 4a1 1 0 11-1.714 1.028L8 18.618l-2.786 4.41A1 1 0 013.5 22l2.5-4V9.5A1.5 1.5 0 018.5 8z"/>
                  </svg>
                </div>
                <h2 id="accessibility-menu-title" className="text-[#1e2875]">
                  Accessibility Options
                </h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-500 hover:text-[#1e2875]"
                aria-label="Close accessibility menu"
              >
                <X size={24} />
              </Button>
            </div>

            {/* Text Size Control */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Type size={20} className="text-[#1e2875]" aria-hidden="true" />
                <Label htmlFor="text-size" className="text-[#1e2875]">
                  Text Size: {settings.textSize}%
                </Label>
              </div>
              <Slider
                id="text-size"
                min={75}
                max={200}
                step={25}
                value={[settings.textSize]}
                onValueChange={handleTextSizeChange}
                className="mb-2"
                aria-label="Adjust text size"
              />
              <div className="flex justify-between text-gray-600 mt-2">
                <span>75%</span>
                <span>100%</span>
                <span>125%</span>
                <span>150%</span>
                <span>200%</span>
              </div>
            </div>

            {/* High Contrast Mode */}
            <div className="mb-4 p-4 border border-gray-200 rounded-lg hover:border-[#1e2875] transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Contrast size={20} className="text-[#1e2875]" aria-hidden="true" />
                  <div>
                    <Label htmlFor="high-contrast" className="text-[#1e2875] cursor-pointer">
                      High Contrast Mode
                    </Label>
                    <p className="text-gray-600 mt-1">
                      Increase color contrast for better visibility
                    </p>
                  </div>
                </div>
                <Switch
                  id="high-contrast"
                  checked={settings.highContrast}
                  onCheckedChange={() => handleToggle('highContrast', 'High contrast mode')}
                  aria-label="Toggle high contrast mode"
                />
              </div>
            </div>

            {/* Screen Reader Support */}
            <div className="mb-4 p-4 border border-gray-200 rounded-lg hover:border-[#1e2875] transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye size={20} className="text-[#1e2875]" aria-hidden="true" />
                  <div>
                    <Label htmlFor="screen-reader" className="text-[#1e2875] cursor-pointer">
                      Enhanced Screen Reader
                    </Label>
                    <p className="text-gray-600 mt-1">
                      Additional announcements for screen readers
                    </p>
                  </div>
                </div>
                <Switch
                  id="screen-reader"
                  checked={settings.screenReader}
                  onCheckedChange={() => handleToggle('screenReader', 'Screen reader support')}
                  aria-label="Toggle screen reader support"
                />
              </div>
            </div>

            {/* Voice Navigation */}
            <div className="mb-4 p-4 border border-gray-200 rounded-lg hover:border-[#1e2875] transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Volume2 size={20} className="text-[#1e2875]" aria-hidden="true" />
                  <div>
                    <Label htmlFor="voice-nav" className="text-[#1e2875] cursor-pointer">
                      Voice Navigation
                    </Label>
                    <p className="text-gray-600 mt-1">
                      Read page content aloud
                    </p>
                  </div>
                </div>
                <Switch
                  id="voice-nav"
                  checked={settings.voiceNavigation}
                  onCheckedChange={() => handleToggle('voiceNavigation', 'Voice navigation')}
                  aria-label="Toggle voice navigation"
                />
              </div>
              {settings.voiceNavigation && (
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    onClick={() => speak('Welcome to Hands and Hope. This is an accessible e-commerce platform for people with disabilities to showcase and sell their handmade products.')}
                    className="bg-[#1e2875] hover:bg-[#2a3490] text-white flex-1"
                    disabled={isSpeaking}
                  >
                    <Volume2 size={16} className="mr-2" />
                    Test Voice
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={stopSpeaking}
                    className="border-[#1e2875] text-[#1e2875]"
                    disabled={!isSpeaking}
                  >
                    Stop
                  </Button>
                </div>
              )}
            </div>

            {/* Keyboard Navigation */}
            <div className="mb-4 p-4 border border-gray-200 rounded-lg hover:border-[#1e2875] transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Keyboard size={20} className="text-[#1e2875]" aria-hidden="true" />
                  <div>
                    <Label htmlFor="keyboard-nav" className="text-[#1e2875] cursor-pointer">
                      Enhanced Keyboard Navigation
                    </Label>
                    <p className="text-gray-600 mt-1">
                      Visible focus indicators and shortcuts
                    </p>
                  </div>
                </div>
                <Switch
                  id="keyboard-nav"
                  checked={settings.keyboardNavigation}
                  onCheckedChange={() => handleToggle('keyboardNavigation', 'Keyboard navigation')}
                  aria-label="Toggle keyboard navigation"
                />
              </div>
            </div>

            {/* Underline Links */}
            <div className="mb-4 p-4 border border-gray-200 rounded-lg hover:border-[#1e2875] transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LinkIcon size={20} className="text-[#1e2875]" aria-hidden="true" />
                  <div>
                    <Label htmlFor="underline-links" className="text-[#1e2875] cursor-pointer">
                      Underline All Links
                    </Label>
                    <p className="text-gray-600 mt-1">
                      Make links easier to identify
                    </p>
                  </div>
                </div>
                <Switch
                  id="underline-links"
                  checked={settings.underlineLinks}
                  onCheckedChange={() => handleToggle('underlineLinks', 'Underline links')}
                  aria-label="Toggle underline links"
                />
              </div>
            </div>

            {/* Reduce Motion */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg hover:border-[#1e2875] transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap size={20} className="text-[#1e2875]" aria-hidden="true" />
                  <div>
                    <Label htmlFor="reduce-motion" className="text-[#1e2875] cursor-pointer">
                      Reduce Motion
                    </Label>
                    <p className="text-gray-600 mt-1">
                      Minimize animations and transitions
                    </p>
                  </div>
                </div>
                <Switch
                  id="reduce-motion"
                  checked={settings.reduceMotion}
                  onCheckedChange={() => handleToggle('reduceMotion', 'Reduce motion')}
                  aria-label="Toggle reduce motion"
                />
              </div>
            </div>

            {/* Reset Button */}
            <Button
              onClick={resetSettings}
              variant="outline"
              className="w-full border-2 border-[#1e2875] text-[#1e2875] hover:bg-[#1e2875] hover:text-white"
              aria-label="Reset all accessibility settings to default"
            >
              Reset All Settings
            </Button>

            {/* Keyboard Shortcuts Info */}
            {settings.keyboardNavigation && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-[#1e2875] mb-2">
                  Keyboard Shortcuts:
                </p>
                <ul className="text-gray-700 space-y-1">
                  <li><kbd className="px-2 py-1 bg-white rounded border">Tab</kbd> - Navigate forward</li>
                  <li><kbd className="px-2 py-1 bg-white rounded border">Shift + Tab</kbd> - Navigate backward</li>
                  <li><kbd className="px-2 py-1 bg-white rounded border">Enter</kbd> - Activate links/buttons</li>
                  <li><kbd className="px-2 py-1 bg-white rounded border">Esc</kbd> - Close menus</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
    </>
  );
}
