import React, { useEffect, useRef, useState, useMemo } from 'react';
import { PlayCircle, PauseCircle } from 'lucide-react';

interface VideoPlayerProps {
  url?: string;
  type?: 'html5' | 'youtube' | 'vimeo' | 'file';
  title?: string;
  onProgress?: (currentTime: number, duration: number, percent: number) => void;
  onEnded?: () => void;
  lastPosition?: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, type = 'html5', title, onProgress, onEnded, lastPosition = 0 }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const ytPlayerRef = useRef<any>(null);
  const ytContainerRef = useRef<HTMLDivElement>(null);
  const vimeoContainerRef = useRef<HTMLDivElement>(null);
  const vimeoPlayerRef = useRef<any>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  // Track max allowed time to prevent skipping
  const maxTimeReached = useRef(lastPosition);
  const progressInterval = useRef<any>(null);

  // Normalize URL (ensure absolute if it's a relative storage path)
  const normalizedUrl = useMemo(() => {
    console.log('VideoPlayer URL Input:', url);
    if (!url) return '';
    if (url.startsWith('/') && !url.startsWith('//')) {
      const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://127.0.0.1:8000';
      const fullUrl = `${baseUrl}${url}`;
      console.log('Normalized URL (relative):', fullUrl);
      return fullUrl;
    }
    console.log('Normalized URL (absolute):', url);
    return url;
  }, [url]);

  useEffect(() => {
    console.log('VideoPlayer Active Lesson Effect - Type:', type, 'URL:', normalizedUrl);
    maxTimeReached.current = lastPosition;
  }, [normalizedUrl, type]);

  // Handle Vimeo API
  useEffect(() => {
    if (type !== 'vimeo' || !normalizedUrl) return;

    const match = normalizedUrl.match(/(?:vimeo\.com\/|video\/)(\d+)/);
    const videoId = match ? match[1] : null;
    if (!videoId) return;

    const initVimeo = () => {
        if (!vimeoContainerRef.current) return;
        
        // Cleanup existing player if any
        if (vimeoPlayerRef.current) {
            vimeoPlayerRef.current.destroy();
        }

        const player = new (window as any).Vimeo.Player(vimeoContainerRef.current, {
            id: videoId,
            width: 640,
            autopause: false,
            transparent: false,
            responsive: true
        });
        vimeoPlayerRef.current = player;

        player.on('play', () => {
            setIsPlaying(true);
            startTrackingVimeo();
        });
        player.on('pause', () => {
            setIsPlaying(false);
            stopTrackingVimeo();
        });
        player.on('ended', () => {
            if (onEnded) onEnded();
        });
        
        player.ready().then(() => {
            setIsReady(true);
            if (lastPosition > 0) {
                player.setCurrentTime(lastPosition);
            }
        });
    };

    if (!(window as any).Vimeo) {
        const script = document.createElement('script');
        script.src = 'https://player.vimeo.com/api/player.js';
        script.onload = initVimeo;
        document.body.appendChild(script);
    } else {
        initVimeo();
    }

    return () => {
        stopTrackingVimeo();
        if (vimeoPlayerRef.current) {
            vimeoPlayerRef.current.destroy();
        }
    };
  }, [normalizedUrl, type]);

  const startTrackingVimeo = () => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    progressInterval.current = setInterval(async () => {
        if (!vimeoPlayerRef.current) return;
        try {
            const time = await vimeoPlayerRef.current.getCurrentTime();
            const duration = await vimeoPlayerRef.current.getDuration();
            
            if (time > maxTimeReached.current + 5) {
                vimeoPlayerRef.current.setCurrentTime(maxTimeReached.current);
            } else {
                maxTimeReached.current = Math.max(maxTimeReached.current, time);
                const percent = Math.floor((maxTimeReached.current / duration) * 100);
                if (onProgress) onProgress(maxTimeReached.current, duration, percent);
            }
        } catch (e) {}
    }, 1000);
  };

  const stopTrackingVimeo = () => {
    if (progressInterval.current) clearInterval(progressInterval.current);
  };

  // Handle YouTube API
  useEffect(() => {
    if (type !== 'youtube' || !normalizedUrl) return;

    const match = normalizedUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    const videoId = match ? match[1] : null;

    if (!videoId) return;

    const initYT = () => {
        if (!ytContainerRef.current || !window.YT || !window.YT.Player) return;
        
        if (ytPlayerRef.current) {
            ytPlayerRef.current.destroy();
        }

        ytPlayerRef.current = new window.YT.Player(ytContainerRef.current, {
          videoId,
          playerVars: {
            autoplay: 0,
            controls: 1,
            disablekb: 1,
            modestbranding: 1,
            rel: 0,
            start: Math.floor(lastPosition),
          },
          events: {
            onReady: () => {
              setIsReady(true);
            },
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                startTrackingYT();
              } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
                setIsPlaying(false);
                stopTrackingYT();
                if (event.data === window.YT.PlayerState.ENDED && onEnded) {
                  onEnded();
                }
              }
            }
          }
        });
    };

    if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        if (firstScriptTag.parentNode) {
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
        (window as any).onYouTubeIframeAPIReady = initYT;
    } else {
        initYT();
    }

    return () => {
      stopTrackingYT();
      if (ytPlayerRef.current) {
        ytPlayerRef.current.destroy();
      }
    };
  }, [normalizedUrl, type]);

  const startTrackingYT = () => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    progressInterval.current = setInterval(() => {
      if (!ytPlayerRef.current || !ytPlayerRef.current.getCurrentTime) return;
      const time = ytPlayerRef.current.getCurrentTime();
      const duration = ytPlayerRef.current.getDuration() || 1;
      
      if (time > maxTimeReached.current + 5) {
        ytPlayerRef.current.seekTo(maxTimeReached.current);
      } else {
        maxTimeReached.current = Math.max(maxTimeReached.current, time);
        const percent = Math.floor((maxTimeReached.current / duration) * 100);
        if (onProgress) onProgress(maxTimeReached.current, duration, percent);
      }
    }, 1000);
  };

  const stopTrackingYT = () => {
    if (progressInterval.current) clearInterval(progressInterval.current);
  };

  // Handle HTML5 Video
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 1;

    if (time > maxTimeReached.current + 2) {
      videoRef.current.currentTime = maxTimeReached.current;
    } else {
      maxTimeReached.current = Math.max(maxTimeReached.current, time);
      const percent = Math.floor((maxTimeReached.current / duration) * 100);
      if (onProgress) onProgress(maxTimeReached.current, duration, percent);
    }
  };

  const handleLoadedMetadata = () => {
     if (videoRef.current && lastPosition > 0) {
         videoRef.current.currentTime = lastPosition;
     }
  };

  if (!normalizedUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-900 text-slate-500 p-8 text-center space-y-4">
        <PlayCircle className="w-16 h-16 opacity-20" />
        <div>
            <p className="font-bold text-slate-300">{title || 'فيديو غير متوفر'}</p>
            <p className="text-xs">لم يتم توفير رابط لهذا الدرس أو المحتوى غير متاح حالياً.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative flex items-center justify-center bg-black overflow-hidden group">
      {type === 'youtube' ? (
        <div className="w-full h-full">
            <div ref={ytContainerRef} className="w-full h-full" />
        </div>
      ) : type === 'vimeo' ? (
        <div className="w-full h-full">
            <div ref={vimeoContainerRef} className="w-full h-full flex items-center justify-center" />
        </div>
      ) : (
        <video
          ref={videoRef}
          src={normalizedUrl}
          className="w-full h-full object-contain"
          controls
          controlsList="nodownload"
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={onEnded}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
