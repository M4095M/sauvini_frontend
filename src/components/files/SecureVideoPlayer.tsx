"use client";

import React, { useRef, useEffect, useState } from "react";
import { FilesApi, FileAccessResponse } from "@/api/files";

interface SecureVideoPlayerProps {
  fileId: string;
  onAccessGranted?: (url: string) => void;
  onAccessDenied?: (error: string) => void;
  onVideoEnd?: () => void;
  className?: string;
  autoPlay?: boolean;
}

/**
 * Secure Video Player with access control
 * Provides secure video streaming with signed URL access
 */
export const SecureVideoPlayer: React.FC<SecureVideoPlayerProps> = ({
  fileId,
  onAccessGranted,
  onAccessDenied,
  onVideoEnd,
  className = "",
  autoPlay = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessGranted, setAccessGranted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Request secure video access
  useEffect(() => {
    const requestVideoAccess = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await FilesApi.getFileAccess(fileId, {
          access_type: "stream",
          expires_in: 3600, // 1 hour
        });

        if (response.success && response.data) {
          setVideoUrl(response.data.signed_url);
          setAccessGranted(true);
          onAccessGranted?.(response.data.signed_url);
        } else {
          throw new Error(response.message || "Access denied");
        }
      } catch (error: any) {
        const errorMessage = error.message || "Failed to access video";
        setError(errorMessage);
        onAccessDenied?.(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    requestVideoAccess();
  }, [fileId]);

  // Disable right-click context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  // Disable common keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Disable F12 (dev tools), Ctrl+Shift+I (dev tools), Ctrl+S (save), etc.
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && e.key === "I") ||
      (e.ctrlKey && e.key === "s") ||
      (e.ctrlKey && e.key === "S") ||
      (e.ctrlKey && e.shiftKey && e.key === "C")
    ) {
      e.preventDefault();
      return false;
    }
  };

  // Disable drag and drop
  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
    return false;
  };

  // Detect tab visibility to pause video when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (videoRef.current && document.hidden) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Video event handlers
  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    onVideoEnd?.();
  };

  // CSS to disable video controls context menu
  const videoStyle: React.CSSProperties = {
    pointerEvents: "auto",
  };

  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center bg-black ${className}`}
        onContextMenu={handleContextMenu}
        onKeyDown={handleKeyDown}
        onDragStart={handleDragStart}
      >
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-sm">Loading secure video...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-black ${className}`}
        onContextMenu={handleContextMenu}
        onKeyDown={handleKeyDown}
        onDragStart={handleDragStart}
      >
        <div className="text-white text-center">
          <p className="text-red-500">⚠️ Failed to load video</p>
          <p className="text-sm text-gray-400 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!videoUrl || !accessGranted) {
    return (
      <div
        className={`flex items-center justify-center bg-black ${className}`}
        onContextMenu={handleContextMenu}
        onKeyDown={handleKeyDown}
        onDragStart={handleDragStart}
      >
        <div className="text-white text-center">
          <p className="text-gray-400">No video available</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-black ${className}`}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      onDragStart={handleDragStart}
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
    >
      {/* Overlay to prevent interaction outside video */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%)",
        }}
      />

      {/* Video player */}
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        controlsList="nodownload"
        disablePictureInPicture
        playsInline
        autoPlay={autoPlay}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        style={videoStyle}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Hide download button, but keep fullscreen and playback controls */}
      <style jsx global>{`
        video::-webkit-media-controls {
          display: flex !important;
        }
        video::-webkit-media-controls-enclosure {
          display: flex;
        }
        /* Hide download button in controls */
        video::-webkit-media-controls-download-button {
          display: none !important;
        }
        /* Keep fullscreen button visible */
        video::-webkit-media-controls-fullscreen-button {
          display: flex !important;
        }
        /* Keep playback rate button visible */
        video::-webkit-media-controls-playback-rate-button {
          display: flex !important;
        }
        video::-webkit-media-controls-playback-rate-value {
          display: flex !important;
        }
      `}</style>
    </div>
  );
};

export default SecureVideoPlayer;
