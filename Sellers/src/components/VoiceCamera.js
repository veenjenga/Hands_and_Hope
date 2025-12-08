// src/components/VoiceCamera.js
import React, { useState, useRef, useEffect } from 'react';
import styles from './VoiceCamera.module.css';

function VoiceCamera({ onCapture, onCancel }) {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Initialize camera on component mount
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
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Prefer rear camera if available
      });
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please ensure you have given permission and try again.');
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to data URL
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageDataUrl);
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
        <h2 className={styles.title}>Voice Camera</h2>
        
        {error ? (
          <div className={styles.error}>
            <p>{error}</p>
            <button 
              className={styles.retryButton}
              onClick={initCamera}
            >
              Retry
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
                    aria-label="Capture photo"
                  >
                    <div className={styles.captureCircle}></div>
                  </button>
                  <button 
                    className={styles.cancelButton}
                    onClick={onCancel}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className={styles.useButton}
                    onClick={useImage}
                  >
                    Use Photo
                  </button>
                  <button 
                    className={styles.retakeButton}
                    onClick={retakeImage}
                  >
                    Retake
                  </button>
                  <button 
                    className={styles.cancelButton}
                    onClick={onCancel}
                  >
                    Cancel
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