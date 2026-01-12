/**
 * Video Player Component
 * Supports YouTube, Vimeo, and direct video URLs
 */

'use client';

import { useState } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnail?: string;
  title?: string;
  autoplay?: boolean;
  controls?: boolean;
  className?: string;
}

export default function VideoPlayer({
  videoUrl,
  thumbnail,
  title,
  autoplay = false,
  controls = true,
  className = '',
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay);

  // Check if it's a YouTube URL
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  // Check if it's a Vimeo URL
  const isVimeo = videoUrl.includes('vimeo.com');

  // Extract YouTube video ID
  const getYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Extract Vimeo video ID
  const getVimeoId = (url: string): string | null => {
    const regExp = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Render YouTube embed
  if (isYouTube) {
    const videoId = getYouTubeId(videoUrl);
    if (!videoId) return null;

    const embedUrl = `https://www.youtube.com/embed/${videoId}${autoplay ? '?autoplay=1' : ''}${controls ? '&controls=1' : '&controls=0'}`;

    return (
      <div className={`relative w-full ${className}`}>
        <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={embedUrl}
            title={title || 'Video player'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  // Render Vimeo embed
  if (isVimeo) {
    const videoId = getVimeoId(videoUrl);
    if (!videoId) return null;

    const embedUrl = `https://player.vimeo.com/video/${videoId}${autoplay ? '?autoplay=1' : ''}${controls ? '&controls=1' : '&controls=0'}`;

    return (
      <div className={`relative w-full ${className}`}>
        <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={embedUrl}
            title={title || 'Video player'}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  // Render direct video file
  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative rounded-lg overflow-hidden bg-black">
        <video
          className="w-full"
          controls={controls}
          autoPlay={autoplay}
          poster={thumbnail}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
          <source src={videoUrl} type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

