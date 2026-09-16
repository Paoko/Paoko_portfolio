import { useRef, useEffect } from 'react';
import './ScrollVideo.css';
import grokVideo from './assets/galería/grok-video-2516af66-039a-42e3-8797-78da216fe019.mp4';

const SCROLL_HEIGHT_VH = 400;

const ScrollVideo = () => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const durationRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    let ticking = false;

    const onLoadedMetadata = () => {
      durationRef.current = video.duration || 0;
      updateFrame();
    };

    const updateFrame = () => {
      ticking = false;
      const duration = durationRef.current;
      if (!duration) return;

      const rect = container.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      if (scrollableDistance <= 0) return;

      const progress = Math.min(1, Math.max(0, -rect.top / scrollableDistance));
      const targetTime = progress * duration;

      if (Math.abs(video.currentTime - targetTime) > 0.01) {
        video.currentTime = targetTime;
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateFrame);
      }
    };

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="scroll-video-container" ref={containerRef} style={{ height: `${SCROLL_HEIGHT_VH}vh` }}>
      <div className="scroll-video-sticky">
        <video
          ref={videoRef}
          className="scroll-video"
          src={grokVideo}
          muted
          playsInline
          preload="auto"
        />
        <div className="scroll-video-hint">Scrollea</div>
      </div>
    </div>
  );
};

export default ScrollVideo;
