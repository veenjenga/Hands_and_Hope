import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import annyang from 'annyang';
import voiceCommandProcessor from '../utils/voiceCommandProcessor';
import productNLP from '../utils/productNLP';
import VoiceCamera from './VoiceCamera';
import styles from './VoiceNavigation.module.css';

function VoiceNavigation({ isVoiceNavigationEnabled, onProductFieldUpdate }) {
  const history = useHistory();
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [isUsingElevenLabs, setIsUsingElevenLabs] = useState(true);
  const [isPlayingFeedback, setIsPlayingFeedback] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [lastMessage, setLastMessage] = useState('');
  const [interactiveMode, setInteractiveMode] = useState(false);
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [productState, setProductState] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: ''
  });
  const [listingFlow, setListingFlow] = useState(false); // Track if we're in product listing flow
  
  const messageQueue = useRef([]);
  const audioContext = useRef(null);

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

    // Initialize audio context for better audio control
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (annyang && isVoiceNavigationEnabled) {
      console.log('Annyang is loaded and starting voice navigation...');

      // Set up annyang callbacks
      annyang.addCallback('result', (phrases) => {
        console.log('Voice command recognized:', phrases);
        if (phrases && phrases.length > 0) {
          handleVoiceCommand(phrases[0]);
        }
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
        // Only announce if not already announced to prevent loops
        if (!sessionStorage.getItem('voiceNavStarted')) {
          sessionStorage.setItem('voiceNavStarted', 'true');
          announce('Voice navigation enabled. Say "what can I say" for a list of commands.');
        }
      });

      annyang.setLanguage('en-US');
      annyang.start({ autoRestart: true, continuous: true });

      return () => {
        console.log('Stopping voice navigation');
        annyang.abort();
        // Clean up session storage when component unmounts
        sessionStorage.removeItem('voiceNavStarted');
        // Close audio context
        if (audioContext.current) {
          audioContext.current.close();
        }
      };
    } else if (!annyang) {
      console.error('Annyang is not available. Voice navigation will not work.');
    }
  }, [history, isVoiceNavigationEnabled, onProductFieldUpdate]);

  const handleVoiceCommand = (command) => {
    // If in interactive mode, treat the command as an answer to a question
    if (interactiveMode && pendingQuestions.length > 0) {
      handleInteractiveAnswer(command);
      return;
    }

    // If in product listing flow, process product description
    if (listingFlow) {
      handleProductDescription(command);
      return;
    }

    // Process the command using our NLP processor
    const action = voiceCommandProcessor.processCommand(command);
    console.log('Processed action:', action);
    
    switch (action.type) {
      // Navigation commands
      case 'NAVIGATE_DASHBOARD':
        history.push('/');
        announce('Navigating to dashboard');
        break;
        
      case 'NAVIGATE_PRODUCTS':
        history.push('/products');
        announce('Navigating to products');
        break;
        
      case 'NAVIGATE_ADD_PRODUCT':
        history.push('/add-product');
        // Start product listing flow when navigating to add product page
        setListingFlow(true);
        setTimeout(() => {
          announce('What product would you like to list? Please describe it to me.');
        }, 1000);
        break;
        
      case 'NAVIGATE_INQUIRIES':
        history.push('/inquiries');
        announce('Navigating to inquiries');
        break;
        
      case 'NAVIGATE_SETTINGS':
        history.push('/settings');
        announce('Navigating to settings');
        break;
        
      case 'NAVIGATE_HELP':
        history.push('/help');
        announce('Navigating to help');
        break;
        
      case 'LOGOUT':
        history.push('/login');
        announce('Logging out');
        break;
        
      // Product management commands
      case 'SET_PRODUCT_NAME':
        setProductState(prev => ({ ...prev, name: action.value }));
        if (onProductFieldUpdate) {
          onProductFieldUpdate('name', action.value);
        }
        announce(`Product name set to ${action.value}`);
        break;
        
      case 'SET_PRODUCT_PRICE':
        setProductState(prev => ({ ...prev, price: action.value }));
        if (onProductFieldUpdate) {
          onProductFieldUpdate('price', action.value);
        }
        announce(`Product price set to $${action.value}`);
        break;
        
      case 'SET_PRODUCT_CATEGORY':
        setProductState(prev => ({ ...prev, category: action.value }));
        if (onProductFieldUpdate) {
          onProductFieldUpdate('category', action.value);
        }
        announce(`Product category set to ${action.value}`);
        break;
        
      case 'SET_PRODUCT_DESCRIPTION':
        setProductState(prev => ({ ...prev, description: action.value }));
        if (onProductFieldUpdate) {
          onProductFieldUpdate('description', action.value);
        }
        announce('Product description updated');
        break;
        
      // New: Process natural language product description
      case 'SAVE_PRODUCT':
        // This would trigger the actual product save in the parent component
        announce('Saving product. Please wait...');
        // In a real implementation, we would call a function to save the product
        break;
        
      // New: Handle natural language product description
      case 'SET_PRODUCT_DETAILS':
        const extractedProductInfo = productNLP.extractProductInfo(action.originalCommand);
        updateProductState(extractedProductInfo);
        announceProductInfoSummary(extractedProductInfo);
        break;
        
      // Camera commands
      case 'OPEN_CAMERA':
        setShowCamera(true);
        announce('Opening camera. Point your camera at the product and say "take photo" or click the capture button.');
        break;
        
      case 'USE_CAPTURED_IMAGE':
        // This would be handled by the camera component
        announce('Using captured image');
        break;
        
      // Settings commands
      case 'ENABLE_VOICE_NAVIGATION':
        announce('Voice navigation is already enabled');
        break;
        
      case 'DISABLE_VOICE_NAVIGATION':
        // This would need to be handled by the parent component
        announce('Disabling voice navigation');
        break;
        
      case 'ENABLE_VOICE_FEEDBACK':
        announce('Voice feedback is already enabled');
        break;
        
      case 'DISABLE_VOICE_FEEDBACK':
        announce('Voice feedback cannot be disabled while voice navigation is active');
        break;
        
      case 'INCREASE_FONT_SIZE':
        // This would need to be handled by the parent component
        announce('Increasing font size');
        break;
        
      case 'DECREASE_FONT_SIZE':
        // This would need to be handled by the parent component
        announce('Decreasing font size');
        break;
        
      // Help commands
      case 'SHOW_COMMANDS':
        const commandsList = voiceCommandProcessor.getAvailableCommands();
        announce('Available commands: ' + commandsList.join('. ') + '.');
        break;
        
      // Interactive mode commands
      case 'START_INTERACTIVE_MODE':
        startInteractiveMode();
        break;
        
      // Generic commands
      case 'CANCEL_ACTION':
        if (interactiveMode) {
          exitInteractiveMode();
        }
        if (listingFlow) {
          setListingFlow(false);
          announce('Exited product listing mode.');
        }
        announce('Action cancelled');
        break;
        
      case 'REPEAT_LAST_MESSAGE':
        if (lastMessage) {
          announce(lastMessage);
        } else {
          announce('No previous message to repeat');
        }
        break;
        
      case 'UNKNOWN_COMMAND':
        // If we're in listing flow, treat as product description
        if (listingFlow) {
          handleProductDescription(action.originalCommand);
        } else {
          // Try to interpret as product description
          const unknownProductInfo = productNLP.extractProductInfo(action.originalCommand);
          if (unknownProductInfo.name || unknownProductInfo.price || unknownProductInfo.category || unknownProductInfo.description) {
            updateProductState(unknownProductInfo);
            announceProductInfoSummary(unknownProductInfo);
          } else {
            announce(`Sorry, I didn't understand "${action.originalCommand}". Say "what can I say" for a list of commands.`);
          }
        }
        break;
        
      default:
        announce('Command not recognized');
    }
  };

  const handleProductDescription = (description) => {
    const productInfo = productNLP.extractProductInfo(description);
    
    // Update product state with extracted info
    updateProductState(productInfo);
    
    // Generate questions for missing information
    const questions = productNLP.generateQuestions({ ...productState, ...productInfo });
    
    if (questions.length > 0) {
      // Enter interactive mode to ask for missing details
      setInteractiveMode(true);
      setPendingQuestions(questions);
      setCurrentQuestionIndex(0);
      announce(questions[0]);
    } else {
      // All information collected, ask to save
      announce("I've collected all the information for your product. Say 'save product' to list it.");
    }
  };

  const updateProductState = (productInfo) => {
    const newState = { ...productState };
    
    if (productInfo.name) {
      newState.name = productInfo.name;
      if (onProductFieldUpdate) {
        onProductFieldUpdate('name', productInfo.name);
      }
    }
    
    if (productInfo.price) {
      newState.price = productInfo.price;
      if (onProductFieldUpdate) {
        onProductFieldUpdate('price', productInfo.price);
      }
    }
    
    if (productInfo.category) {
      newState.category = productInfo.category;
      if (onProductFieldUpdate) {
        onProductFieldUpdate('category', productInfo.category);
      }
    }
    
    if (productInfo.description) {
      newState.description = productInfo.description;
      if (onProductFieldUpdate) {
        onProductFieldUpdate('description', productInfo.description);
      }
    }
    
    setProductState(newState);
  };

  const announceProductInfoSummary = (productInfo) => {
    const parts = [];
    
    if (productInfo.name) {
      parts.push(`Product name: ${productInfo.name}`);
    }
    
    if (productInfo.price) {
      parts.push(`Price: $${productInfo.price}`);
    }
    
    if (productInfo.category) {
      parts.push(`Category: ${productInfo.category}`);
    }
    
    if (productInfo.description) {
      parts.push(`Description: ${productInfo.description.substring(0, 50)}${productInfo.description.length > 50 ? '...' : ''}`);
    }
    
    if (parts.length > 0) {
      announce(`I've extracted the following information: ${parts.join(', ')}.`);
    } else {
      announce("I couldn't extract any product information from that description. Would you like to try again or answer some questions about your product?");
    }
  };

  const startInteractiveMode = () => {
    const questions = productNLP.generateQuestions(productState);
    if (questions.length > 0) {
      setInteractiveMode(true);
      setPendingQuestions(questions);
      setCurrentQuestionIndex(0);
      announce(questions[0]);
    } else {
      announce("All product information has been filled. Say 'save product' to save your product.");
    }
  };

  const exitInteractiveMode = () => {
    setInteractiveMode(false);
    setPendingQuestions([]);
    setCurrentQuestionIndex(0);
    announce("Exited interactive mode.");
  };

  const handleInteractiveAnswer = (answer) => {
    const currentQuestion = pendingQuestions[currentQuestionIndex];
    let fieldUpdated = false;
    
    // Map questions to fields
    if (currentQuestion.includes("name")) {
      setProductState(prev => ({ ...prev, name: answer }));
      if (onProductFieldUpdate) {
        onProductFieldUpdate('name', answer);
      }
      fieldUpdated = true;
    } else if (currentQuestion.includes("price")) {
      // Extract numeric value from price
      const priceMatch = answer.match(/\$?(\d+(?:\.\d+)?)/);
      if (priceMatch && priceMatch[1]) {
        setProductState(prev => ({ ...prev, price: priceMatch[1] }));
        if (onProductFieldUpdate) {
          onProductFieldUpdate('price', priceMatch[1]);
        }
        fieldUpdated = true;
      }
    } else if (currentQuestion.includes("category")) {
      setProductState(prev => ({ ...prev, category: answer }));
      if (onProductFieldUpdate) {
        onProductFieldUpdate('category', answer);
      }
      fieldUpdated = true;
    } else if (currentQuestion.includes("describe") || currentQuestion.includes("detail")) {
      setProductState(prev => ({ ...prev, description: answer }));
      if (onProductFieldUpdate) {
        onProductFieldUpdate('description', answer);
      }
      fieldUpdated = true;
    }
    
    if (fieldUpdated) {
      announce(`Got it. ${answer}`);
    }
    
    // Move to next question or exit interactive mode
    if (currentQuestionIndex < pendingQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setTimeout(() => {
        announce(pendingQuestions[nextIndex]);
      }, 1000);
    } else {
      // All questions answered
      exitInteractiveMode();
      setListingFlow(false);
      announce("All product information has been collected. Say 'save product' to list your product.");
    }
  };

  const handleCameraCapture = (imageDataUrl) => {
    setShowCamera(false);
    setProductState(prev => ({ ...prev, image: imageDataUrl }));
    if (onProductFieldUpdate) {
      onProductFieldUpdate('image', imageDataUrl);
    }
    announce('Photo captured and set as product image');
  };

  const handleCameraCancel = () => {
    setShowCamera(false);
    announce('Camera closed');
  };

  const announceWithElevenLabs = async (message) => {
    // Prevent overlapping feedback
    if (isPlayingFeedback) {
      // Queue the message to be played after the current one finishes
      messageQueue.current.push(message);
      return;
    }
    
    setIsPlayingFeedback(true);
    setLastMessage(message);
    
    // Cancel any ongoing speech synthesis to prevent overlap
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    
    try {
      // Use Eleven Labs API for high-quality speech synthesis
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': 'sk_20734ae2903209818628e37d95e46a5c6f59a503a17d1eb3',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: message,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        // Play the Eleven Labs audio
        audio.play();
        
        // Reset the playing flag when audio finishes
        audio.onended = () => {
          setIsPlayingFeedback(false);
          // Play next message in queue if available
          if (messageQueue.current.length > 0) {
            const nextMessage = messageQueue.current.shift();
            announce(nextMessage);
          }
        };
      } else {
        console.error('Eleven Labs API error:', response.status);
        // Even if Eleven Labs fails, we still want to provide feedback
        announce(message); // This will use the fallback
      }
    } catch (error) {
      console.error('Eleven Labs API error:', error);
      // Even if Eleven Labs fails, we still want to provide feedback
      announce(message); // This will use the fallback
    }
  };

  const fallbackToBrowserSpeech = (text) => {
    // Cancel any ongoing speech synthesis to prevent overlap
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Reset the playing flag when speech ends
      utterance.onend = () => {
        setIsPlayingFeedback(false);
        setLastMessage(text);
        // Play next message in queue if available
        if (messageQueue.current.length > 0) {
          const nextMessage = messageQueue.current.shift();
          announce(nextMessage);
        }
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech synthesis not supported. Falling back to ARIA live region.');
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('style', 'position: absolute; left: -9999px;');
      liveRegion.textContent = text;
      document.body.appendChild(liveRegion);
      setTimeout(() => {
        document.body.removeChild(liveRegion);
        setIsPlayingFeedback(false);
        setLastMessage(text);
        // Play next message in queue if available
        if (messageQueue.current.length > 0) {
          const nextMessage = messageQueue.current.shift();
          announce(nextMessage);
        }
      }, 2000);
    }
  };

  const announce = (message) => {
    if (isUsingElevenLabs) {
      announceWithElevenLabs(message);
    } else {
      fallbackToBrowserSpeech(message);
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

  return (
    <>
      {showCamera && (
        <VoiceCamera 
          onCapture={handleCameraCapture}
          onCancel={handleCameraCancel}
        />
      )}
    </>
  );
}

export default VoiceNavigation;