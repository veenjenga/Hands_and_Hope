// src/components/VoiceCamera.js
import React, { useEffect, useRef, useState } from 'react';
import styles from './VoiceCamera.module.css';

function VoiceCamera({ onCapture, onCancel }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    initCamera();
    
    return () => {
      // Cleanup camera stream on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initCamera = async () => {
    try {
      // Stop any existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } // Prefer rear camera if available with better resolution
      });
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      // Try with any camera if environment fails
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        setStream(fallbackStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
        }
      } catch (fallbackErr) {
        console.error('Fallback camera access failed:', fallbackErr);
        setError('Could not access camera. Please ensure you have given permission and try again.');
        
        // Announce error with voice if enabled
        window.dispatchEvent(new CustomEvent('voicePrompt', { 
          detail: { 
            message: "Camera access error. Please check your camera permissions and try again." 
          } 
        }));
      }
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      setIsProcessing(true);
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to data URL with better quality
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageDataUrl);
      setIsProcessing(false);
    }
  };

  const useImage = () => {
    if (capturedImage && onCapture) {
      onCapture(capturedImage);
    }
  };

  const retakeImage = () => {
    setCapturedImage(null);
  };

  return (
    <div className={styles.cameraOverlay}>
      <div className={styles.cameraContainer}>
        <h2 className={styles.title}>
          <i className="fas fa-camera"></i> Product Photo
        </h2>
        
        {error ? (
          <div className={styles.error}>
            <p><i className="fas fa-exclamation-triangle"></i> {error}</p>
            <button 
              className={styles.retryButton}
              onClick={initCamera}
            >
              <i className="fas fa-redo"></i> Retry
            </button>
          </div>
        ) : (
          <>
            <div className={styles.cameraView}>
              {!capturedImage ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted
                  className={styles.videoFeed}
                />
              ) : (
                <img 
                  src={capturedImage} 
                  alt="Captured product" 
                  className={styles.capturedImage}
                />
              )}
              
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
            
            <div className={styles.controls}>
              {!capturedImage ? (
                <>
                  <button 
                    className={styles.captureButton}
                    onClick={captureImage}
                    disabled={isProcessing}
                    aria-label="Capture photo"
                  >
                    {isProcessing ? (
                      <div className={styles.processingSpinner}>
                        <i className="fas fa-spinner fa-spin"></i>
                      </div>
                    ) : (
                      <div className={styles.captureCircle}></div>
                    )}
                  </button>
                  <button 
                    className={styles.cancelButton}
                    onClick={onCancel}
                  >
                    <i className="fas fa-times"></i> Cancel
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className={styles.useButton}
                    onClick={useImage}
                  >
                    <i className="fas fa-check"></i> Use Photo
                  </button>
                  <button 
                    className={styles.retakeButton}
                    onClick={retakeImage}
                  >
                    <i className="fas fa-redo"></i> Retake
                  </button>
                  <button 
                    className={styles.cancelButton}
                    onClick={onCancel}
                  >
                    <i className="fas fa-times"></i> Cancel
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default VoiceCamera;