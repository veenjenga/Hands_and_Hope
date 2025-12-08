// src/utils/productNLP.js
// Advanced NLP utility for extracting product information from natural language descriptions

class ProductNLP {
  constructor() {
    // Predefined categories based on buyer categories
    this.categories = [
      'Electronics',
      'Furniture',
      'Smart Home',
      'Wearables',
      'Gaming',
      'Audio',
      'Clothing',
      'Home Decor',
      'Accessories',
      'Other'
    ];
    
    // Regex patterns for extracting product information
    this.patterns = {
      name: [
        /(?:name|called|named|titled)\s+(?:is\s+)?["']?([^"']+?)["']?(?=\s|$|\.|,)/i,
        /(?:product|item)\s+(?:is\s+)?["']?([^"']+?)["']?(?=\s|$|\.|,)/i,
        /(?:selling|have|want)\s+(?:a\s+)?["']?([^"']+?)["']?(?=\s|$|\.|,)/i,
        /(?:the\s+)?product\s+name\s+is\s+["']?([^"']+?)["']?(?=\s|$|\.|,)/i
      ],
      price: [
        /(?:costs?|price|priced|costing)\s+(?:is\s+)?\$?(\d+(?:\.\d+)?)/i,
        /(?:price|cost)\s+(?:is\s+)?\$?(\d+(?:\.\d+)?)/i,
        /\$?(\d+(?:\.\d+)?)\s*(?:dollars?|USD)/i,
        /(?:the\s+)?price\s+is\s+\$?(\d+(?:\.\d+)?)/i
      ],
      category: [
        /(?:category|type|kind)\s+(?:is\s+)?["']?([^"']+?)["']?(?=\s|$|\.|,)/i,
        /(?:in|under|within)\s+(?:the\s+)?(?:category|section)\s+of\s+["']?([^"']+?)["']?(?=\s|$|\.|,)/i,
        /(?:the\s+)?category\s+is\s+["']?([^"']+?)["']?(?=\s|$|\.|,)/i
      ],
      description: [
        /(?:description|details|info|information)\s+(?:is\s+)?["']?([^"']+?)["']?(?=\s|$|\.)/i,
        /(?:looks?|seems?|appears)\s+(?:like\s+)?["']?([^"']+?)["']?(?=\s|$|\.)/i,
        /(?:the\s+)?description\s+is\s+["']?([^"']+?)["']?(?=\s|$|\.)/i
      ]
    };
  }

  /**
   * Extract product information from a natural language description
   * @param {string} description - Natural language product description
   * @returns {Object} - Extracted product information
   */
  extractProductInfo(description) {
    const productInfo = {
      name: '',
      price: '',
      category: '',
      description: ''
    };

    // Extract name
    for (const pattern of this.patterns.name) {
      const match = description.match(pattern);
      if (match && match[1]) {
        productInfo.name = match[1].trim();
        break;
      }
    }

    // Extract price
    for (const pattern of this.patterns.price) {
      const match = description.match(pattern);
      if (match && match[1]) {
        productInfo.price = match[1].trim();
        break;
      }
    }

    // Extract category
    for (const pattern of this.patterns.category) {
      const match = description.match(pattern);
      if (match && match[1]) {
        productInfo.category = match[1].trim();
        break;
      }
    }

    // Extract description
    for (const pattern of this.patterns.description) {
      const match = description.match(pattern);
      if (match && match[1]) {
        productInfo.description = match[1].trim();
        break;
      }
    }

    // If no name was extracted, try to get the first noun phrase
    if (!productInfo.name) {
      const firstNounPhrase = this.extractFirstNounPhrase(description);
      if (firstNounPhrase) {
        productInfo.name = firstNounPhrase;
      }
    }

    return productInfo;
  }

  /**
   * Extract the first noun phrase from a sentence
   * @param {string} text - Input text
   * @returns {string} - First noun phrase
   */
  extractFirstNounPhrase(text) {
    // Simple heuristic: take the first quoted phrase or first few words
    const quotedMatch = text.match(/["']([^"']+)["']/);
    if (quotedMatch && quotedMatch[1]) {
      return quotedMatch[1].trim();
    }
    
    // If no quotes, take first 3-5 words
    const words = text.split(/\s+/);
    if (words.length >= 3) {
      return words.slice(0, Math.min(5, words.length)).join(' ');
    }
    
    return text.trim();
  }

  /**
   * Generate interactive questions based on missing product information
   * @param {Object} currentInfo - Current product information
   * @returns {Array} - Array of questions to ask the user
   */
  generateQuestions(currentInfo) {
    const questions = [];
    
    if (!currentInfo.name) {
      questions.push("What would you like to name your product?");
    }
    
    if (!currentInfo.price) {
      questions.push("What is the price of your product?");
    }
    
    if (!currentInfo.category) {
      questions.push("Which category does your product belong to? Available categories are: " + this.categories.join(", "));
    }
    
    if (!currentInfo.description) {
      questions.push("Can you describe your product in more detail?");
    }
    
    return questions;
  }
  
  /**
   * Get the list of available categories
   * @returns {Array} - Array of category names
   */
  getCategories() {
    return this.categories;
  }
  
  /**
   * Match a spoken category to available categories
   * @param {string} spokenCategory - Category mentioned by user
   * @returns {string|null} - Matching category or null if not found
   */
  matchCategory(spokenCategory) {
    if (!spokenCategory) return null;
    
    // Direct match
    const exactMatch = this.categories.find(cat => 
      cat.toLowerCase() === spokenCategory.toLowerCase()
    );
    
    if (exactMatch) return exactMatch;
    
    // Partial match
    const partialMatch = this.categories.find(cat => 
      spokenCategory.toLowerCase().includes(cat.toLowerCase()) ||
      cat.toLowerCase().includes(spokenCategory.toLowerCase())
    );
    
    return partialMatch || null;
  }
}

// Export singleton instance
const productNLPInstance = new ProductNLP();
export default productNLPInstance;