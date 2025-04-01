import React, { useEffect, useRef } from 'react';

interface LiveStreamProps {
  streamUrl: string;
}

const LiveStream: React.FC<LiveStreamProps> = ({ streamUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    // Check if the browser can play HLS natively.
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      video.play().catch((err) => {
        console.error('Error attempting to play video:', err);
      });
    } else {
      // Dynamically import hls.js for browsers that don't support HLS natively.
      import('hls.js')
        .then((HlsModule) => {
          const Hls = HlsModule.default;
          if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
          } else {
            console.error('HLS is not supported in this browser.');
          }
        })
        .catch((err) => {
          console.error('Error loading hls.js:', err);
        });
    }
  }, [streamUrl]);

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      muted
      className="w-full h-full absolute" 
    />
  );
};

export default LiveStream;
