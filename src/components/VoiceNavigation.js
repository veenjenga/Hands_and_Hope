import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import annyang from 'annyang';

function VoiceNavigation({ isVoiceNavigationEnabled }) {
  const navigate = useNavigate();
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

  useEffect(() => {
    const isSpeechRecognitionSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    if (!isSpeechRecognitionSupported) {
      console.warn('Speech recognition is not supported in this browser. Please use a supported browser like Chrome or Edge.');
      setIsSpeechSupported(false);
      return;
    }

    const isSpeechSynthesisSupported = 'speechSynthesis' in window;
    if (!isSpeechSynthesisSupported) {
      console.warn('Speech synthesis is not supported in this browser. Announcements will not be audible.');
    }

    if (annyang && isVoiceNavigationEnabled) {
      console.log('Annyang is loaded and starting voice navigation...');

      const commands = {
        'go to home': () => {
          navigate('/');
          announce('Navigated to Home');
        },
        'navigate to home': () => {
          navigate('/');
          announce('Navigated to Home');
        },
        'register': () => {
          navigate('/register');
          announce('Navigated to Register');
        },
        'go to register': () => {
          navigate('/register');
          announce('Navigated to Register');
        },
        'navigate to register': () => {
          navigate('/register');
          announce('Navigated to Register');
        },
        'go to settings': () => {
          navigate('/settings');
          announce('Navigated to Settings');
        },
        'navigate to settings': () => {
          navigate('/settings');
          announce('Navigated to Settings');
        },
        'go to help': () => {
          navigate('/help');
          announce('Navigated to Help');
        },
        'navigate to help': () => {
          navigate('/help');
          announce('Navigated to Help');
        },
      };

      // Register the commands with annyang
      annyang.addCommands(commands);

      annyang.addCallback('soundstart', () => {
        console.log('Sound detected');
      });

      annyang.addCallback('soundend', () => {
        console.log('Sound ended');
      });

      annyang.addCallback('result', (phrases) => {
        console.log('Voice command recognized:', phrases);
      });

      annyang.addCallback('error', (error) => {
        console.error('Annyang error:', error);
        if (error.error === 'network') {
          announce('Voice navigation error: Network issue. Please check your internet connection.');
        } else if (error.error === 'audio-capture') {
          announce('Voice navigation error: Microphone issue. Please check your microphone.');
        }
      });

      annyang.addCallback('start', () => {
        console.log('Voice navigation started');
        announce('Voice navigation enabled');
      });

      annyang.setLanguage('en-US');

      annyang.start({ autoRestart: true, continuous: true });

      return () => {
        console.log('Stopping voice navigation');
        annyang.abort();
      };
    } else if (!annyang) {
      console.error('Annyang is not available. Voice navigation will not work.');
    }
  }, [navigate, isVoiceNavigationEnabled]);

  const announce = (message) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech synthesis not supported. Falling back to ARIA live region.');
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('style', 'position: absolute; left: -9999px;');
      liveRegion.textContent = message;
      document.body.appendChild(liveRegion);
      setTimeout(() => {
        document.body.removeChild(liveRegion);
      }, 2000);
    }
  };

  if (!isSpeechSupported) {
    return (
      <div style={{ position: 'fixed', bottom: '10px', right: '10px', background: '#fff', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <p style={{ margin: 0, color: '#dc2626' }}>
          Voice navigation is not supported in this browser. Please use Chrome, Edge, or Safari.
        </p>
      </div>
    );
  }

  return null;
}

export default VoiceNavigation;