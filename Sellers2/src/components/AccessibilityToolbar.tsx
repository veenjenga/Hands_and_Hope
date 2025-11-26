import { Type, Contrast, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from './ui/button';

interface AccessibilityToolbarProps {
  fontSize: 'normal' | 'large' | 'extra-large';
  setFontSize: (size: 'normal' | 'large' | 'extra-large') => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
}

export function AccessibilityToolbar({
  fontSize,
  setFontSize,
  highContrast,
  setHighContrast,
}: AccessibilityToolbarProps) {
  const increaseFontSize = () => {
    if (fontSize === 'normal') setFontSize('large');
    else if (fontSize === 'large') setFontSize('extra-large');
  };

  const decreaseFontSize = () => {
    if (fontSize === 'extra-large') setFontSize('large');
    else if (fontSize === 'large') setFontSize('normal');
  };

  return (
    <div className="sticky top-0 z-50 border-b bg-white shadow-sm" role="toolbar" aria-label="Accessibility controls">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <span className="sr-only">Accessibility Options</span>
          
          <div className="flex items-center gap-2">
            <span className="mr-2 hidden md:inline">Accessibility:</span>
            
            <Button
              variant="outline"
              size="lg"
              onClick={decreaseFontSize}
              disabled={fontSize === 'normal'}
              aria-label="Decrease text size"
              className="h-12 w-12 p-0"
            >
              <ZoomOut className="h-5 w-5" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={increaseFontSize}
              disabled={fontSize === 'extra-large'}
              aria-label="Increase text size"
              className="h-12 w-12 p-0"
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
            
            <Button
              variant={highContrast ? 'default' : 'outline'}
              size="lg"
              onClick={() => setHighContrast(!highContrast)}
              aria-label={highContrast ? 'Disable high contrast mode' : 'Enable high contrast mode'}
              aria-pressed={highContrast}
              className="h-12 gap-2 px-4"
            >
              <Contrast className="h-5 w-5" />
              <span className="hidden md:inline">High Contrast</span>
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              setFontSize('normal');
              setHighContrast(false);
            }}
            aria-label="Reset accessibility settings"
            className="h-12 px-4"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
