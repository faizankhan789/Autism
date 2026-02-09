import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Custom hook for eye-tracking input.
 *
 * FUTURE: Integrate MediaPipe FaceMesh for real eye-gaze estimation.
 * The implementation would:
 *   1. Access the user's webcam via navigator.mediaDevices.getUserMedia().
 *   2. Load the FaceMesh model from @mediapipe/face_mesh.
 *   3. On each video frame, extract iris landmarks (landmarks 468-477).
 *   4. Map iris position relative to the eye bounding box to screen coordinates.
 *   5. Apply a Kalman filter or exponential smoothing to reduce jitter.
 *
 * CURRENT FALLBACK: Uses mouse position as a gaze proxy so that
 * downstream components can develop against the same API shape.
 */
export default function useEyeTracking() {
  const [gazePosition, setGazePosition] = useState({ x: 0, y: 0 });
  const [isTracking, setIsTracking] = useState(false);
  const animFrameRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Mouse-move listener used as fallback for gaze data
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    if (isTracking) {
      window.addEventListener('mousemove', handleMouseMove);

      // Use requestAnimationFrame to throttle state updates to ~60 fps
      const tick = () => {
        setGazePosition({ ...mouseRef.current });
        animFrameRef.current = requestAnimationFrame(tick);
      };
      animFrameRef.current = requestAnimationFrame(tick);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isTracking]);

  /**
   * Start tracking gaze (currently starts the mouse-position fallback).
   *
   * TODO (MediaPipe integration):
   *   - Request camera permission.
   *   - Initialise FaceMesh and begin processing video frames.
   *   - Emit gaze coordinates via setGazePosition.
   */
  const startTracking = useCallback(() => {
    setIsTracking(true);
  }, []);

  /**
   * Stop tracking and release resources.
   *
   * TODO (MediaPipe integration):
   *   - Stop the camera stream tracks.
   *   - Close the FaceMesh instance.
   */
  const stopTracking = useCallback(() => {
    setIsTracking(false);
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  return {
    gazePosition,
    isTracking,
    startTracking,
    stopTracking,
  };
}
