import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import voiceCommandProcessor from '../utils/voiceCommandProcessor';
import productNLP from '../utils/productNLP';
import VoiceCamera from './VoiceCamera';

function VoiceNavigation({ isVoiceNavigationEnabled, isNewUser, setIsNewUser }) {
  const history = useHistory();
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
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
  const [welcomeTour, setWelcomeTour] = useState(false); // Track if we're in welcome tour
  const [tourStep, setTourStep] = useState(0);
  
  const messageQueue = useRef([]);
  const audioContext = useRef(null);
  const recognitionRef = useRef(null);

  // Memoize functions to use as dependencies
  const announce = useCallback((message) => {
    // Always use Eleven Labs for voice feedback
    announceWithElevenLabs(message);
  }, []);

  const announceWithElevenLabs = useCallback(async (message) => {
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
      const apiKey = process.env.REACT_APP_ELEVEN_LABS_API_KEY || 'sk_20734ae2903209818628e37d95e46a5c6f59a503a17d1eb3';
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': apiKey,
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
        fallbackToBrowserSpeech(message);
      }
    } catch (error) {
      console.error('Eleven Labs API error:', error);
      // Even if Eleven Labs fails, we still want to provide feedback
      fallbackToBrowserSpeech(message);
    }
  }, [isPlayingFeedback]);

  const fallbackToBrowserSpeech = useCallback((text) => {
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
  }, [announce]);

  const handleVoiceCommand = useCallback((command) => {
    // Prevent processing if voice navigation is disabled
    if (!isVoiceNavigationEnabled) {
      console.log('Voice navigation is disabled, ignoring command:', command);
      return;
    }
    
    // Prevent processing empty or repeated commands
    if (!command || command.trim().length === 0) {
      return;
    }
    
    // Prevent processing the same command repeatedly (loop prevention)
    const lastCommand = sessionStorage.getItem('lastVoiceCommand');
    const lastCommandTime = sessionStorage.getItem('lastVoiceCommandTime');
    const currentTime = Date.now();
    
    if (lastCommand === command && lastCommandTime && (currentTime - parseInt(lastCommandTime)) < 2000) {
      console.log('Preventing duplicate command processing:', command);
      return;
    }
    
    // Store the command to prevent duplicates
    sessionStorage.setItem('lastVoiceCommand', command);
    sessionStorage.setItem('lastVoiceCommandTime', currentTime.toString());
    
    // If in welcome tour, handle tour navigation
    if (welcomeTour) {
      handleTourCommand(command);
      return;
    }

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
          announce("What product would you like to add? Please tell me the name, price, and description. Would you like me to take a picture of the product for you?");
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
        // Dispatch event to update the field in AddProduct component
        window.dispatchEvent(new CustomEvent('voiceFieldUpdate', { detail: { field: 'name', value: action.value } }));
        announce(`Product name set to ${action.value}`);
        break;
        
      case 'SET_PRODUCT_PRICE':
        setProductState(prev => ({ ...prev, price: action.value }));
        // Dispatch event to update the field in AddProduct component
        window.dispatchEvent(new CustomEvent('voiceFieldUpdate', { detail: { field: 'price', value: action.value } }));
        announce(`Product price set to $${action.value}`);
        break;
        
      case 'SET_PRODUCT_CATEGORY':
        setProductState(prev => ({ ...prev, category: action.value }));
        // Dispatch event to update the field in AddProduct component
        window.dispatchEvent(new CustomEvent('voiceFieldUpdate', { detail: { field: 'category', value: action.value } }));
        announce(`Product category set to ${action.value}`);
        break;
        
      case 'SET_PRODUCT_DESCRIPTION':
        setProductState(prev => ({ ...prev, description: action.value }));
        // Dispatch event to update the field in AddProduct component
        window.dispatchEvent(new CustomEvent('voiceFieldUpdate', { detail: { field: 'description', value: action.value } }));
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
        if (welcomeTour) {
          setWelcomeTour(false);
          announce('Exited welcome tour.');
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
        } else if (welcomeTour) {
          // In tour, treat as question
          announce("I'm here to help. You can ask me to show you different parts of the platform or say 'continue tour' to proceed.");
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
  }, [history, welcomeTour, interactiveMode, pendingQuestions, listingFlow, lastMessage, announce, productState]);

  const handleTourCommand = useCallback((command) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('continue') || lowerCommand.includes('next')) {
      if (tourStep < 7) {
        const nextStep = tourStep + 1;
        setTourStep(nextStep);
        announceWelcomeTourStep(nextStep);
      } else {
        setWelcomeTour(false);
        announce("That concludes the tour. Feel free to explore on your own or ask me for help anytime!");
      }
    } else if (lowerCommand.includes('stop') || lowerCommand.includes('exit') || lowerCommand.includes('cancel')) {
      setWelcomeTour(false);
      announce("Exiting tour. Feel free to ask me for help anytime!");
    } else if (lowerCommand.includes('yes') || lowerCommand.includes('enable') || lowerCommand.includes('continue')) {
      setWelcomeTour(false);
      announce("Great! Voice navigation is now enabled. Feel free to ask me for help anytime!");
    } else {
      // Treat as a question
      announce("I'm here to help. You can ask me to show you different parts of the platform, say 'continue tour' to proceed with the tour, or say 'yes' to continue with voice navigation enabled.");
    }
  }, [tourStep, announce]);

  const announceWelcomeTourStep = useCallback((step) => {
    const tourSteps = [
      "Welcome to Hand and Hope! Congratulations on signing up. I'm your AI assistant and I'll guide you through the platform.",
      "This is your dashboard where you can see an overview of your products and sales.",
      "You can navigate to different sections using voice commands.",
      "To add a new product, say 'add new product'.",
      "To view your existing products, say 'go to products'.",
      "To check customer inquiries, say 'go to inquiries'.",
      "To update your profile or change settings, say 'go to settings'.",
      "Would you like to continue with voice navigation enabled?",
    ];

    if (step < tourSteps.length) {
      announce(tourSteps[step]);
    }
  }, [announce]);

  const handleProductDescription = useCallback((description) => {
    // Extract product information using NLP
    const productInfo = productNLP.extractProductInfo(description);
    
    // Update product state with extracted info
    updateProductState(productInfo);
    
    // Check what information is missing and ask questions accordingly
    if ((productState.name || productInfo.name) && (productState.price || productInfo.price)) {
      // Ask for category if not provided
      if (!productState.category && !productInfo.category) {
        const categories = productNLP.getCategories();
        announce(`What category should the product be in? Available categories are: ${categories.join(', ')}.`);
        return;
      }
      
      // If we have name, price, and category, ask for description
      if (!productState.description && !productInfo.description) {
        announce("Please provide a description for your product, or say 'skip' to skip this step.");
        return;
      }
      
      // If we have all required fields, ask for image
      if (!productState.image && !productInfo.image) {
        announce("Would you like to upload an image of your product? Say 'take photo' to activate the camera or 'skip' to list without an image.");
        return;
      }
      
      // All information collected
      announce("I've collected all the information for your product. Say 'save product' to list it.");
      return;
    }
    
    // If we're missing critical information, ask for it
    const questions = productNLP.generateQuestions({ ...productState, ...productInfo });
    if (questions.length > 0) {
      setInteractiveMode(true);
      setPendingQuestions(questions);
      setCurrentQuestionIndex(0);
      announce(questions[0]);
    } else {
      announce("I've collected all the information for your product. Say 'save product' to list it.");
    }
  }, [productState, announce]);

  const updateProductState = useCallback((productInfo) => {
    const newState = { ...productState };
    
    if (productInfo.name) {
      newState.name = productInfo.name;
      // Dispatch event to update the field in AddProduct component
      window.dispatchEvent(new CustomEvent('voiceFieldUpdate', { detail: { field: 'name', value: productInfo.name } }));
    }
    
    if (productInfo.price) {
      newState.price = productInfo.price;
      // Dispatch event to update the field in AddProduct component
      window.dispatchEvent(new CustomEvent('voiceFieldUpdate', { detail: { field: 'price', value: productInfo.price } }));
    }
    
    if (productInfo.category) {
      newState.category = productInfo.category;
      // Dispatch event to update the field in AddProduct component
      window.dispatchEvent(new CustomEvent('voiceFieldUpdate', { detail: { field: 'category', value: productInfo.category } }));
    }
    
    if (productInfo.description) {
      newState.description = productInfo.description;
      // Dispatch event to update the field in AddProduct component
      window.dispatchEvent(new CustomEvent('voiceFieldUpdate', { detail: { field: 'description', value: productInfo.description } }));
    }
    
    setProductState(newState);
  }, [productState]);

  const announceProductInfoSummary = useCallback((productInfo) => {
    // Only announce if voice navigation is enabled
    if (!isVoiceNavigationEnabled) return;
    
    const summaryParts = [];
    if (productInfo.name) summaryParts.push(`Product name: ${productInfo.name}`);
    if (productInfo.price) summaryParts.push(`Price: $${productInfo.price}`);
    if (productInfo.category) summaryParts.push(`Category: ${productInfo.category}`);
    if (productInfo.description) summaryParts.push(`Description: ${productInfo.description.substring(0, 50)}${productInfo.description.length > 50 ? '...' : ''}`);
    
    if (summaryParts.length > 0) {
      const summary = "I've extracted the following information: " + summaryParts.join(". ") + ". You can continue providing more details or say 'save product' to add this item.";
      announce(summary);
    }
  }, [isVoiceNavigationEnabled, announce]);

  const startInteractiveMode = useCallback(() => {
    const questions = productNLP.generateQuestions(productState);
    if (questions.length > 0) {
      setInteractiveMode(true);
      setPendingQuestions(questions);
      setCurrentQuestionIndex(0);
      announce(questions[0]);
    } else {
      announce("All product information has been filled. Say 'save product' to save your product.");
    }
  }, [productState, announce]);

  const exitInteractiveMode = useCallback(() => {
    setInteractiveMode(false);
    setPendingQuestions([]);
    setCurrentQuestionIndex(0);
    announce("Exited interactive mode.");
  }, [announce]);

  const handleInteractiveAnswer = useCallback((answer) => {
    // Prevent processing empty answers
    if (!answer || answer.trim().length === 0) {
      return;
    }
    
    const currentQuestion = pendingQuestions[currentQuestionIndex];
    let fieldUpdated = false;
    
    // Handle natural language responses for product details
    if (answer.toLowerCase().includes("the product name is") || answer.toLowerCase().includes("product name is")) {
      // Extract name after "the product name is"
      const nameMatch = answer.match(/(?:the )?product name is (.+)/i);
      if (nameMatch && nameMatch[1]) {
        const productName = nameMatch[1].trim();
        setProductState(prev => ({ ...prev, name: productName }));
        window.dispatchEvent(new CustomEvent('voiceFieldUpdate', { detail: { field: 'name', value: productName } }));
        fieldUpdated = true;
        announce(`Got it. Product name set to ${productName}`);
        
        // After setting name, ask for price
        setTimeout(() => {
          announce("What is the price of your product?");
        }, 1000);
        return;
      }
    } else if (answer.toLowerCase().includes("price is") || answer.toLowerCase().includes("costs")) {
      // Extract price from various formats
      const priceMatch = answer.match(/\$?(\d+(?:\.\d+)?)/);
      if (priceMatch && priceMatch[1]) {
        setProductState(prev => ({ ...prev, price: priceMatch[1] }));
        window.dispatchEvent(new CustomEvent('voiceFieldUpdate', { detail: { field: 'price', value: priceMatch[1] } }));
        fieldUpdated = true;
        announce(`Got it. Price set to $${priceMatch[1]}`);
        
        // After setting price, ask for category
        setTimeout(() => {
          const categories = productNLP.getCategories();
          announce(`What category should the product be in? Available categories are: ${categories.join(', ')}.`);
        }, 1000);
        return;
      }
    } else if (currentQuestion.includes("category") || 
               answer.toLowerCase().includes("category") || 
               productNLP.getCategories().some(cat => answer.toLowerCase().includes(cat.toLowerCase()))) {
      // Handle category selection
      const categories = productNLP.getCategories();
      const matchedCategory = categories.find(cat => 
        cat.toLowerCase() === answer.toLowerCase() || 
        answer.toLowerCase().includes(cat.toLowerCase())
      );
      
      if (matchedCategory) {
        setProductState(prev => ({ ...prev, category: matchedCategory }));
        window.dispatchEvent(new CustomEvent('voiceFieldUpdate', { detail: { field: 'category', value: matchedCategory } }));
        fieldUpdated = true;
        announce(`Got it. Category set to ${matchedCategory}`);
        
        // After setting category, ask for description
        setTimeout(() => {
          announce("Please provide a description for your product, or say 'skip' to skip this step.");
        }, 1000);
        return;
      } else if (answer.toLowerCase() !== 'skip') {
        announce(`I didn't recognize that category. Available categories are: ${categories.join(', ')}. Please try again.`);
        return;
      }
    } else if (currentQuestion.includes("describe") || currentQuestion.includes("detail") || 
               answer.toLowerCase().includes("description") || answer.toLowerCase().includes("it's") ||
               answer.toLowerCase().includes("it is")) {
      if (answer.toLowerCase() !== 'skip') {
        setProductState(prev => ({ ...prev, description: answer }));
        window.dispatchEvent(new CustomEvent('voiceFieldUpdate', { detail: { field: 'description', value: answer } }));
        fieldUpdated = true;
        announce('Got it. Description updated.');
      } else {
        announce('Skipping description.');
      }
      
      // After setting description, ask for image
      setTimeout(() => {
        announce("Would you like to upload an image of your product? Say 'take photo' to activate the camera or 'skip' to list without an image.");
      }, 1000);
      return;
    } else if (currentQuestion.includes("picture") || currentQuestion.includes("photo") || 
               answer.toLowerCase().includes("take photo") || answer.toLowerCase().includes("take snap") ||
               answer.toLowerCase().includes("upload image")) {
      // Open camera
      setShowCamera(true);
      announce('Opening camera. Point your camera at the product and say "take photo" or click the capture button.');
      return;
    } else if (answer.toLowerCase() === 'skip') {
      // Handle skip command
      announce('Skipping this step.');
      fieldUpdated = true;
    } else if (currentQuestion.includes("name")) {
      setProductState(prev => ({ ...prev, name: answer }));
      window.dispatchEvent(new CustomEvent('voiceFieldUpdate', { detail: { field: 'name', value: answer } }));
      fieldUpdated = true;
      announce(`Got it. Product name set to ${answer}`);
      
      // After setting name, ask for price
      setTimeout(() => {
        announce("What is the price of your product?");
      }, 1000);
      return;
    } else if (currentQuestion.includes("price")) {
      // Extract numeric value from price
      const priceMatch = answer.match(/\$?(\d+(?:\.\d+)?)/);
      if (priceMatch && priceMatch[1]) {
        setProductState(prev => ({ ...prev, price: priceMatch[1] }));
        window.dispatchEvent(new CustomEvent('voiceFieldUpdate', { detail: { field: 'price', value: priceMatch[1] } }));
        fieldUpdated = true;
        announce(`Got it. Price set to $${priceMatch[1]}`);
        
        // After setting price, ask for category
        setTimeout(() => {
          const categories = productNLP.getCategories();
          announce(`What category should the product be in? Available categories are: ${categories.join(', ')}.`);
        }, 1000);
        return;
      }
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
  }, [pendingQuestions, currentQuestionIndex, exitInteractiveMode, announce]);

  const handleCameraCapture = useCallback((imageDataUrl) => {
    setShowCamera(false);
    setProductState(prev => ({ ...prev, image: imageDataUrl }));
    window.dispatchEvent(new CustomEvent('voiceFieldUpdate', { detail: { field: 'image', value: imageDataUrl } }));
    announce('Photo captured and set as product image. Continuing with product details...');
    
    // Continue with next question if in interactive mode
    if (interactiveMode && currentQuestionIndex < pendingQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setTimeout(() => {
        announce(pendingQuestions[nextIndex]);
      }, 1000);
    } else if (interactiveMode) {
      // All questions answered
      exitInteractiveMode();
      setListingFlow(false);
      announce("All product information has been collected. Say 'save product' to list your product.");
    }
  }, [interactiveMode, currentQuestionIndex, pendingQuestions, exitInteractiveMode, announce]);

  const handleCameraCancel = useCallback(() => {
    setShowCamera(false);
    announce('Camera closed. Continuing with product details...');
    
    // Continue with next question if in interactive mode
    if (interactiveMode && currentQuestionIndex < pendingQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setTimeout(() => {
        announce(pendingQuestions[nextIndex]);
      }, 1000);
    }
  }, [interactiveMode, currentQuestionIndex, pendingQuestions, announce]);

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const isSpeechRecognitionSupported = !!SpeechRecognition;
    
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

    // Clean up any existing recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.warn('Error stopping existing recognition:', error);
      }
    }

    // Initialize speech recognition
    if (isVoiceNavigationEnabled) {
      console.log('Initializing custom voice navigation...');
      
      const recognition = new SpeechRecognition();
      recognition.continuous = false; // Changed to false to prevent aggressive restarting
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
          
        console.log('Voice command recognized:', transcript);
        // Only process command if voice navigation is still enabled
        if (isVoiceNavigationEnabled) {
          handleVoiceCommand(transcript);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        // Only announce errors if voice navigation is still enabled
        if (isVoiceNavigationEnabled) {
          if (event.error === 'network') {
            announce('Voice navigation error: Network issue. Please check your internet connection.');
          } else if (event.error === 'audio-capture') {
            announce('Voice navigation error: Microphone issue. Please check your microphone.');
          } else if (event.error !== 'aborted' && event.error !== 'no-speech') {
            // Don't announce aborted or no-speech errors as they're expected
            announce(`Voice navigation error: ${event.error}`);
          }
        }
      };
      
      recognition.onstart = () => {
        console.log('Voice navigation started');
        // Only announce if not already announced to prevent loops and only if enabled
        if (isVoiceNavigationEnabled && !sessionStorage.getItem('voiceNavStarted')) {
          sessionStorage.setItem('voiceNavStarted', 'true');
          announce('Voice navigation enabled. Say "what can I say" for a list of commands.');
        }
      };
      
      recognition.onend = () => {
        console.log('Voice navigation ended');
        // Restart if still enabled and not manually stopped
        if (isVoiceNavigationEnabled) {
          // Add a small delay before restarting to prevent rapid loops
          setTimeout(() => {
            if (isVoiceNavigationEnabled && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (error) {
                console.warn('Could not restart recognition:', error);
              }
            }
          }, 500);
        }
      };
      
      recognitionRef.current = recognition;
      
      // Start recognition if enabled
      if (isVoiceNavigationEnabled) {
        try {
          recognition.start();
        } catch (error) {
          console.error('Failed to start voice recognition:', error);
        }
      }
    }

    return () => {
      console.log('Cleaning up voice navigation');
      // Clean up session storage when component unmounts
      sessionStorage.removeItem('voiceNavStarted');
      // Stop recognition properly
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.warn('Error stopping recognition:', error);
        }
        recognitionRef.current = null;
      }
      // Close audio context safely
      if (audioContext.current && audioContext.current.state !== 'closed') {
        audioContext.current.close();
      }
    };
  }, [isVoiceNavigationEnabled, handleVoiceCommand, announce]);

  // Listen for welcome tour start event
  useEffect(() => {
    const handleStartWelcomeTour = () => {
      setWelcomeTour(true);
      setTourStep(0);
      setTimeout(() => {
        announceWelcomeTourStep(0);
      }, 1000);
    };

    window.addEventListener('startWelcomeTour', handleStartWelcomeTour);
    return () => {
      window.removeEventListener('startWelcomeTour', handleStartWelcomeTour);
    };
  }, [announceWelcomeTourStep]);

  // Start welcome tour for new users
  useEffect(() => {
    if (isNewUser && isVoiceNavigationEnabled) {
      // Start the welcome tour after a short delay
      setTimeout(() => {
        setWelcomeTour(true);
        setTourStep(0);
        announceWelcomeTourStep(0);
        // Mark user as no longer new
        setIsNewUser(false);
      }, 2000);
    }
  }, [isNewUser, isVoiceNavigationEnabled, setIsNewUser, announceWelcomeTourStep]);

  // Listen for product listing start event
  useEffect(() => {
    const handleStartProductListing = () => {
      setListingFlow(true);
      setTimeout(() => {
        announce("What product would you like to add? Please tell me the name, price, and description. You can say something like 'The product name is iPhone 12, the price is $500'.");
      }, 1000);
    };

    window.addEventListener('startProductListing', handleStartProductListing);
    return () => {
      window.removeEventListener('startProductListing', handleStartProductListing);
    };
  }, [announce]);

  // Listen for voice prompts from other components
  useEffect(() => {
    const handleVoicePrompt = (event) => {
      if (event.detail && event.detail.message) {
        announce(event.detail.message);
      }
    };

    window.addEventListener('voicePrompt', handleVoicePrompt);
    return () => {
      window.removeEventListener('voicePrompt', handleVoicePrompt);
    };
  }, [announce]);

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