import { useEffect, useCallback } from 'react';

interface UseScreenReaderOptions {
  enabled: boolean;
  rate?: number; // Speech rate (0.1 to 10, default 1)
  pitch?: number; // Speech pitch (0 to 2, default 1)
  volume?: number; // Speech volume (0 to 1, default 1)
}

export function useScreenReader({ 
  enabled, 
  rate = 1.0, 
  pitch = 1.0, 
  volume = 1.0 
}: UseScreenReaderOptions) {
  
  const speak = useCallback((text: string, interrupt: boolean = false) => {
    if (!enabled) return;
    
    // Cancel ongoing speech if interrupt is true
    if (interrupt) {
      window.speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    
    // Prefer high-quality voices if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith('en') && voice.localService
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  }, [enabled, rate, pitch, volume]);

  const readElement = useCallback((element: HTMLElement) => {
    if (!enabled) return;
    
    // Get the text content of the element
    let textToRead = '';
    
    // Check for ARIA label first (most important for accessibility)
    if (element.hasAttribute('aria-label')) {
      textToRead = element.getAttribute('aria-label') || '';
    }
    // Check for title attribute
    else if (element.hasAttribute('title')) {
      textToRead = element.getAttribute('title') || '';
    }
    // Check for alt text (for images)
    else if (element.tagName === 'IMG' && element.hasAttribute('alt')) {
      textToRead = `Image: ${element.getAttribute('alt')}`;
    }
    // For buttons, read the button text
    else if (element.tagName === 'BUTTON') {
      textToRead = `Button: ${element.textContent?.trim() || 'unlabeled'}`;
    }
    // For links
    else if (element.tagName === 'A') {
      textToRead = `Link: ${element.textContent?.trim() || 'unlabeled'}`;
    }
    // For inputs
    else if (element.tagName === 'INPUT') {
      const input = element as HTMLInputElement;
      const label = document.querySelector(`label[for="${input.id}"]`);
      const labelText = label?.textContent?.trim() || input.placeholder || 'input field';
      textToRead = `${labelText}, ${input.type} input`;
      if (input.value) {
        textToRead += `, current value: ${input.value}`;
      }
    }
    // For textareas
    else if (element.tagName === 'TEXTAREA') {
      const textarea = element as HTMLTextAreaElement;
      const label = document.querySelector(`label[for="${textarea.id}"]`);
      const labelText = label?.textContent?.trim() || textarea.placeholder || 'text area';
      textToRead = `${labelText}, text area`;
    }
    // For select dropdowns
    else if (element.tagName === 'SELECT') {
      const select = element as HTMLSelectElement;
      const label = document.querySelector(`label[for="${select.id}"]`);
      const labelText = label?.textContent?.trim() || 'dropdown';
      const selectedOption = select.options[select.selectedIndex];
      textToRead = `${labelText}, dropdown, selected: ${selectedOption?.text || 'none'}`;
    }
    // For headings
    else if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(element.tagName)) {
      textToRead = `Heading level ${element.tagName.charAt(1)}: ${element.textContent?.trim()}`;
    }
    // Default: read text content
    else {
      textToRead = element.textContent?.trim() || '';
    }
    
    if (textToRead) {
      speak(textToRead, true);
    }
  }, [enabled, speak]);

  const announcePageChange = useCallback((pageName: string) => {
    if (!enabled) return;
    speak(`Navigated to ${pageName} page`, true);
  }, [enabled, speak]);

  const announceNotification = useCallback((message: string) => {
    if (!enabled) return;
    speak(`Notification: ${message}`, false);
  }, [enabled, speak]);

  const announceError = useCallback((error: string) => {
    if (!enabled) return;
    speak(`Error: ${error}`, true);
  }, [enabled, speak]);

  const announceSuccess = useCallback((message: string) => {
    if (!enabled) return;
    speak(`Success: ${message}`, false);
  }, [enabled, speak]);

  useEffect(() => {
    if (!enabled) {
      // Cancel any ongoing speech when screen reader is disabled
      window.speechSynthesis.cancel();
      return;
    }

    // Set up focus event listeners
    const handleFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (target && target.tagName) {
        readElement(target);
      }
    };

    // Set up click event listeners for interactive elements
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target && target.tagName) {
        // Only read on click if it's not an input/textarea (to avoid double reading)
        if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
          readElement(target);
        }
      }
    };

    // Add event listeners
    document.addEventListener('focus', handleFocus, true);
    document.addEventListener('click', handleClick, true);

    // Clean up
    return () => {
      document.removeEventListener('focus', handleFocus, true);
      document.removeEventListener('click', handleClick, true);
      window.speechSynthesis.cancel();
    };
  }, [enabled, readElement]);

  // Announce when screen reader is enabled/disabled
  useEffect(() => {
    if (enabled) {
      speak('Screen reader mode enabled. The app will now provide audio feedback for all interactive elements.', true);
    } else {
      window.speechSynthesis.cancel();
    }
  }, [enabled]); // Only depend on enabled, not speak

  return {
    speak,
    readElement,
    announcePageChange,
    announceNotification,
    announceError,
    announceSuccess,
  };
}
