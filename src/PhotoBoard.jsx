import { useState, useRef, useEffect } from 'react';
import './PhotoBoard.css';

const FRICTION = 0.94;
const MAGNET_STRENGTH = 0.00004;
const MIN_SPAWN_GAP = 360;
const MAX_PLACEMENT_ATTEMPTS = 300;

const buildInitialImages = (photos) => {
  const spreadWidth = window.innerWidth * 1.6;
  const spreadHeight = window.innerHeight * 1.4;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  const placed = [];

  return photos.map((src, index) => {
    let x, y, attempts = 0;

    do {
      x = centerX + (Math.random() - 0.5) * spreadWidth;
      y = centerY + (Math.random() - 0.5) * spreadHeight;
      attempts += 1;
    } while (
      attempts < MAX_PLACEMENT_ATTEMPTS &&
      placed.some(p => Math.hypot(p.x - x, p.y - y) < MIN_SPAWN_GAP)
    );

    placed.push({ x, y });

    return {
      id: index + 1,
      x,
      y,
      src,
      alt: `Portfolio piece ${index + 1}`,
      wide: false,
      zIndex: index + 1,
    };
  });
};

const PhotoBoard = ({ photos, background = null, overlay = null }) => {
  const [images, setImages] = useState(() => buildInitialImages(photos));

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(0);
  const [dragState, setDragState] = useState(null);
  const [draggingImage, setDraggingImage] = useState(null);

  const zoom = 2 ** zoomLevel;
  const zoomRef = useRef(zoom);
  const panRef = useRef(pan);
  const dragStateRef = useRef(dragState);
  const draggingImageRef = useRef(draggingImage);
  const panVelocityRef = useRef({ x: 0, y: 0 });
  const velocitiesRef = useRef({});
  const magnetEnabledRef = useRef(true);
  const topZRef = useRef(photos.length);
  const mousePositionRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => { panRef.current = pan; }, [pan]);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);
  useEffect(() => { dragStateRef.current = dragState; }, [dragState]);
  useEffect(() => { draggingImageRef.current = draggingImage; }, [draggingImage]);

  useEffect(() => {
    images.forEach(({ id, src }) => {
      const probe = new Image();
      probe.onload = () => {
        if (probe.naturalWidth > probe.naturalHeight) {
          setImages(imgs => imgs.map(img =>
            img.id === id ? { ...img, wide: true } : img
          ));
        }
      };
      probe.src = src;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBoardMouseDown = (e) => {
    panVelocityRef.current = { x: 0, y: 0 };
    setDragState({ type: 'pan', lastX: e.clientX, lastY: e.clientY });
  };

  const handleItemMouseDown = (e, imageId) => {
    e.preventDefault();
    e.stopPropagation();
    velocitiesRef.current[imageId] = { x: 0, y: 0 };
    setDraggingImage(imageId);
    setDragState({ type: 'image', id: imageId, lastX: e.clientX, lastY: e.clientY });

    topZRef.current += 1;
    const newZ = topZRef.current;
    setImages(imgs => imgs.map(img =>
      img.id === imageId ? { ...img, zIndex: newZ } : img
    ));
  };

  const handleMouseMove = (e) => {
    if (!dragState) return;

    const dx = (e.clientX - dragState.lastX) / zoomRef.current;
    const dy = (e.clientY - dragState.lastY) / zoomRef.current;

    if (dragState.type === 'pan') {
      panVelocityRef.current = { x: dx, y: dy };
      setPan(p => ({ x: p.x + dx, y: p.y + dy }));
    } else {
      velocitiesRef.current[dragState.id] = { x: dx, y: dy };
      setImages(imgs => imgs.map(img =>
        img.id === dragState.id
          ? { ...img, x: img.x + dx, y: img.y + dy }
          : img
      ));
    }

    setDragState(s => ({ ...s, lastX: e.clientX, lastY: e.clientY }));
  };

  const handleMouseUp = () => {
    setDragState(null);
    setDraggingImage(null);
  };

  useEffect(() => {
    if (!dragState) return;

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState]);

  useEffect(() => {
    const trackMouse = (e) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', trackMouse);
    return () => window.removeEventListener('mousemove', trackMouse);
  }, []);

  // Continuous loop: camera inertia + per-image inertia with a gentle pull toward the mouse.
  useEffect(() => {
    let frameId;

    const tick = () => {
      if (!dragStateRef.current || dragStateRef.current.type !== 'pan') {
        const pv = panVelocityRef.current;
        if (Math.abs(pv.x) > 0.01 || Math.abs(pv.y) > 0.01) {
          panVelocityRef.current = { x: pv.x * FRICTION, y: pv.y * FRICTION };
          setPan(p => ({ x: p.x + pv.x, y: p.y + pv.y }));
        }
      }

      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;
      const zoomNow = zoomRef.current;
      const targetX = viewportCenterX + (mousePositionRef.current.x - viewportCenterX) / zoomNow - panRef.current.x;
      const targetY = viewportCenterY + (mousePositionRef.current.y - viewportCenterY) / zoomNow - panRef.current.y;
      const draggedId = draggingImageRef.current;
      const magnetOn = magnetEnabledRef.current;

      setImages(imgs => imgs.map(img => {
        if (draggedId) return img;

        const vel = velocitiesRef.current[img.id] || { x: 0, y: 0 };
        const pullX = magnetOn ? (targetX - img.x) * MAGNET_STRENGTH : 0;
        const pullY = magnetOn ? (targetY - img.y) * MAGNET_STRENGTH : 0;
        const vx = (vel.x + pullX) * FRICTION;
        const vy = (vel.y + pullY) * FRICTION;

        velocitiesRef.current[img.id] = { x: vx, y: vy };

        return { ...img, x: img.x + vx, y: img.y + vy };
      }));

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    const magnetTimeout = setTimeout(() => {
      magnetEnabledRef.current = false;
    }, 10000);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(magnetTimeout);
    };
  }, []);

  return (
    <div className="gallery-container">
      {background}

      <div
        className="gallery"
        onMouseDown={handleBoardMouseDown}
      >
        <div
          className="board"
          style={{
            transform: `translate3d(${window.innerWidth / 2}px, ${window.innerHeight / 2}px, 0) scale(${zoom}) translate3d(${pan.x - window.innerWidth / 2}px, ${pan.y - window.innerHeight / 2}px, 0)`,
          }}
        >
          {images.map((image) => {
            const isDragging = draggingImage === image.id;
            return (
            <div
              key={image.id}
              className={`gallery-item ${image.wide ? 'wide' : ''} ${isDragging ? 'dragging' : ''}`}
              style={{
                transform: `translate3d(${image.x}px, ${image.y}px, 0) translate(-50%, -50%) scale(${isDragging ? 1.05 : 1})`,
                zIndex: image.zIndex,
              }}
              onMouseDown={(e) => handleItemMouseDown(e, image.id)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="gallery-image"
                draggable={false}
              />
            </div>
            );
          })}
        </div>
      </div>

      {overlay}

      <div className="zoom-control">
        <span className="zoom-icon">-</span>
        <input
          type="range"
          min="-1.5"
          max="1.5"
          step="0.01"
          value={zoomLevel}
          onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
        />
        <span className="zoom-icon">+</span>
      </div>
    </div>
  );
};

export default PhotoBoard;
