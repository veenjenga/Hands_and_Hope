// src/utils/voiceFeedback.js
// Utility for providing consistent voice feedback across the application

class VoiceFeedback {
  constructor() {
    this.isPlaying = false;
    this.messageQueue = [];
  }

  /**
   * Announce a message with voice feedback
   * @param {string} message - The message to announce
   * @param {boolean} force - Force announcement even if voice feedback is disabled
   */
  announce(message, force = false) {
    // Check if voice feedback is enabled
    const voiceFeedbackEnabled = localStorage.getItem('voiceFeedback') === 'enabled';
    
    // Only announce if voice feedback is enabled or forced
    if (!voiceFeedbackEnabled && !force) {
      return;
    }
    
    // Use Eleven Labs for high-quality voice if available
    this.announceWithElevenLabs(message);
  }

  /**
   * Announce with Eleven Labs API
   * @param {string} message - The message to announce
   */
  async announceWithElevenLabs(message) {
    // Prevent overlapping feedback
    if (this.isPlaying) {
      // Queue the message to be played after the current one finishes
      this.messageQueue.push(message);
      return;
    }
    
    this.isPlaying = true;
    
    // Cancel any ongoing speech synthesis to prevent overlap
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    
    try {
      // Use Eleven Labs API for high-quality speech synthesis
      const apiKey = process.env.REACT_APP_ELEVEN_LABS_API_KEY;
      
      // If no API key is available, fall back to browser speech
      if (!apiKey) {
        console.warn('Eleven Labs API key not found, falling back to browser speech');
        this.fallbackToBrowserSpeech(message);
        return;
      }
      
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
          this.isPlaying = false;
          // Play next message in queue if available
          if (this.messageQueue.length > 0) {
            const nextMessage = this.messageQueue.shift();
            this.announce(nextMessage);
          }
        };
      } else {
        console.error('Eleven Labs API error:', response.status);
        // Even if Eleven Labs fails, we still want to provide feedback
        this.fallbackToBrowserSpeech(message);
      }
    } catch (error) {
      console.error('Eleven Labs API error:', error);
      // Even if Eleven Labs fails, we still want to provide feedback
      this.fallbackToBrowserSpeech(message);
    }
  }

  /**
   * Fallback to browser speech synthesis
   * @param {string} text - The text to speak
   */
  fallbackToBrowserSpeech(text) {
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
        this.isPlaying = false;
        // Play next message in queue if available
        if (this.messageQueue.length > 0) {
          const nextMessage = this.messageQueue.shift();
          this.announce(nextMessage);
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
        this.isPlaying = false;
        // Play next message in queue if available
        if (this.messageQueue.length > 0) {
          const nextMessage = this.messageQueue.shift();
          this.announce(nextMessage);
        }
      }, 2000);
    }
  }
}

// Export singleton instance
const voiceFeedbackInstance = new VoiceFeedback();
export default voiceFeedbackInstance;