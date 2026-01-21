// src/utils/voiceCommandProcessor.js
// Utility to process natural language voice commands into structured actions

class VoiceCommandProcessor {
  constructor() {
    // Define command patterns with regex and corresponding actions
    this.commandPatterns = [
      // Navigation commands
      {
        pattern: /(go to|navigate to|open)\s+(dashboard|home)/i,
        action: 'NAVIGATE_DASHBOARD'
      },
      {
        pattern: /(go to|navigate to|open)\s+(products|product listing|product list)/i,
        action: 'NAVIGATE_PRODUCTS'
      },
      {
        pattern: /(add|create)\s+(new\s+)?product/i,
        action: 'NAVIGATE_ADD_PRODUCT'
      },
      {
        pattern: /(go to|navigate to|open)\s+(inquiries|messages)/i,
        action: 'NAVIGATE_INQUIRIES'
      },
      {
        pattern: /(go to|navigate to|open)\s+(settings|preferences)/i,
        action: 'NAVIGATE_SETTINGS'
      },
      {
        pattern: /(go to|navigate to|open)\s+(help|support)/i,
        action: 'NAVIGATE_HELP'
      },
      {
        pattern: /(log out|sign out|logout|signout)/i,
        action: 'LOGOUT'
      },
      
      // Product management commands
      {
        pattern: /(set|change|update)\s+product\s+name\s+to\s+(.+)/i,
        action: 'SET_PRODUCT_NAME',
        captureIndex: 2
      },
      {
        pattern: /(set|change|update)\s+product\s+price\s+to\s+(\d+(?:\.\d+)?)/i,
        action: 'SET_PRODUCT_PRICE',
        captureIndex: 2
      },
      {
        pattern: /(set|change|update)\s+product\s+(category|type)\s+to\s+(.+)/i,
        action: 'SET_PRODUCT_CATEGORY',
        captureIndex: 3
      },
      {
        pattern: /(add|set|update)\s+product\s+(description|details)\s+to\s+(.+)/i,
        action: 'SET_PRODUCT_DESCRIPTION',
        captureIndex: 3
      },
      {
        pattern: /(save|submit|create|add)\s+(this\s+)?(product|item)/i,
        action: 'SAVE_PRODUCT'
      },
      
      // Natural language product description
      {
        pattern: /(i want to sell|i'm selling|selling|have a product|product is)\s+(.+)/i,
        action: 'SET_PRODUCT_DETAILS',
        captureIndex: 2
      },
      {
        pattern: /(my product|the item)\s+(is|looks like|seems like)\s+(.+)/i,
        action: 'SET_PRODUCT_DETAILS',
        captureIndex: 3
      },
      
      // Camera commands
      {
        pattern: /(take|capture)\s+(a\s+)?(photo|picture|image|snap)/i,
        action: 'OPEN_CAMERA'
      },
      {
        pattern: /(use|select)\s+(this\s+)?(photo|picture|image)/i,
        action: 'USE_CAPTURED_IMAGE'
      },
      
      // Settings commands
      {
        pattern: /(turn on|enable)\s+(voice navigation|voice control)/i,
        action: 'ENABLE_VOICE_NAVIGATION'
      },
      {
        pattern: /(turn off|disable)\s+(voice navigation|voice control)/i,
        action: 'DISABLE_VOICE_NAVIGATION'
      },
      {
        pattern: /(turn on|enable)\s+voice\s+feedback/i,
        action: 'ENABLE_VOICE_FEEDBACK'
      },
      {
        pattern: /(turn off|disable)\s+voice\s+feedback/i,
        action: 'DISABLE_VOICE_FEEDBACK'
      },
      {
        pattern: /(increase|make)\s+(font|text)\s+(bigger|larger)/i,
        action: 'INCREASE_FONT_SIZE'
      },
      {
        pattern: /(decrease|make)\s+(font|text)\s+(smaller)/i,
        action: 'DECREASE_FONT_SIZE'
      },
      
      // Interactive mode commands
      {
        pattern: /(ask me questions|interactive mode|question mode)/i,
        action: 'START_INTERACTIVE_MODE'
      },
      
      // Help commands
      {
        pattern: /(what can i say|help me|commands|what can i do)/i,
        action: 'SHOW_COMMANDS'
      },
      
      // Generic commands
      {
        pattern: /cancel|never mind/i,
        action: 'CANCEL_ACTION'
      },
      {
        pattern: /repeat|say again/i,
        action: 'REPEAT_LAST_MESSAGE'
      },
      
      // New commands for enhanced product listing
      {
        pattern: /save\s+item/i,
        action: 'SAVE_PRODUCT'
      },
      {
        pattern: /take\s+snap/i,
        action: 'OPEN_CAMERA'
      }
    ];
  }

  /**
   * Process a voice command and return structured action
   * @param {string} command - The voice command to process
   * @returns {Object} - Structured action with type and parameters
   */
  processCommand(command) {
    // Normalize the command
    const normalizedCommand = command.trim().toLowerCase();
    
    // Check each pattern
    for (const patternObj of this.commandPatterns) {
      const match = normalizedCommand.match(patternObj.pattern);
      if (match) {
        const action = {
          type: patternObj.action,
          originalCommand: command
        };
        
        // Extract captured groups if specified
        if (patternObj.captureIndex && match[patternObj.captureIndex]) {
          action.value = match[patternObj.captureIndex].trim();
        }
        
        return action;
      }
    }
    
    // If no pattern matched, return unknown command
    return {
      type: 'UNKNOWN_COMMAND',
      originalCommand: command
    };
  }

  /**
   * Get list of available commands for help
   * @returns {Array} - List of command descriptions
   */
  getAvailableCommands() {
    return [
      "Navigate: 'Go to dashboard', 'Open products', 'Show inquiries'",
      "Product Management: 'Add new product', 'Set product name to [name]', 'Set product price to [amount]'",
      "Natural Language: 'I want to sell [product description]', 'My product is [description]'",
      "Interactive Mode: 'Ask me questions' to enter interactive mode",
      "Camera: 'Take a photo', 'Use this image', 'Take snap'",
      "Save Items: 'Save item', 'Save product'",
      "Settings: 'Turn on voice navigation', 'Increase font size', 'Enable voice feedback'",
      "Help: 'What can I say', 'Repeat last message'",
      "Cancel: 'Cancel', 'Never mind'"
    ];
  }
}

// Export singleton instance
const voiceCommandProcessorInstance = new VoiceCommandProcessor();
export default voiceCommandProcessorInstance;