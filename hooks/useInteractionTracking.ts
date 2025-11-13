import { useEffect, useRef, useCallback } from 'react';
import { useConsciousnessStore } from '@/store/consciousness';
import {
  MouseInteraction,
  KeyboardInteraction,
  ScrollInteraction,
  TouchInteraction,
  DeviceInteraction,
} from '@/types/interactions';

export function useInteractionTracking() {
  const addInteraction = useConsciousnessStore((state) => state.addInteraction);
  const trackingEnabled = useConsciousnessStore((state) => state.trackingEnabled);

  // Mouse tracking state
  const lastMousePos = useRef({ x: 0, y: 0, timestamp: 0 });
  const lastMouseVelocity = useRef({ vx: 0, vy: 0, timestamp: 0 });
  const mouseDownTime = useRef<number>(0);
  const lastClickTime = useRef<number>(0);
  const hoverStartTime = useRef<Map<Element, number>>(new Map());
  const mousePath = useRef<{ x: number; y: number; t: number }[]>([]);

  // Keyboard tracking state
  const lastKeyTime = useRef<number>(0);
  const backspaceCount = useRef<number>(0);
  const totalKeys = useRef<number>(0);

  // Scroll tracking state
  const lastScrollPos = useRef({ x: 0, y: 0, timestamp: 0 });

  // Idle detection
  const lastActivityTime = useRef<number>(Date.now());
  const idleCheckInterval = useRef<NodeJS.Timeout>();

  // Calculate velocity and acceleration
  const calculateMouseMetrics = useCallback(
    (x: number, y: number, timestamp: number) => {
      const dt = (timestamp - lastMousePos.current.timestamp) / 1000; // Convert to seconds
      if (dt === 0) return { velocityX: 0, velocityY: 0, accelerationX: 0, accelerationY: 0, jerk: 0 };

      const dx = x - lastMousePos.current.x;
      const dy = y - lastMousePos.current.y;

      const velocityX = dx / dt;
      const velocityY = dy / dt;

      const dvx = velocityX - lastMouseVelocity.current.vx;
      const dvy = velocityY - lastMouseVelocity.current.vy;
      const dvt = (timestamp - lastMouseVelocity.current.timestamp) / 1000;

      const accelerationX = dvt > 0 ? dvx / dvt : 0;
      const accelerationY = dvt > 0 ? dvy / dvt : 0;

      // Calculate jerk (rate of change of acceleration)
      const acceleration = Math.sqrt(accelerationX ** 2 + accelerationY ** 2);
      const jerk = acceleration / (dt || 0.001);

      // Calculate path curvature
      let curvature = 0;
      if (mousePath.current.length >= 3) {
        const recent = mousePath.current.slice(-3);
        const v1x = recent[1].x - recent[0].x;
        const v1y = recent[1].y - recent[0].y;
        const v2x = recent[2].x - recent[1].x;
        const v2y = recent[2].y - recent[1].y;

        const cross = v1x * v2y - v1y * v2x;
        const v1len = Math.sqrt(v1x ** 2 + v1y ** 2);
        const v2len = Math.sqrt(v2x ** 2 + v2y ** 2);

        if (v1len > 0 && v2len > 0) {
          curvature = Math.abs(cross) / (v1len * v2len);
        }
      }

      return { velocityX, velocityY, accelerationX, accelerationY, jerk, curvature };
    },
    []
  );

  // Mouse move handler with 10ms throttling
  useEffect(() => {
    if (!trackingEnabled) return;

    let animationFrameId: number;
    let lastEmitTime = 0;
    const EMIT_INTERVAL = 10; // 10ms = 100Hz

    const handleMouseMove = (e: MouseEvent) => {
      lastActivityTime.current = Date.now();

      const now = Date.now();
      if (now - lastEmitTime < EMIT_INTERVAL) return;
      lastEmitTime = now;

      const { velocityX, velocityY, accelerationX, accelerationY, jerk, curvature } =
        calculateMouseMetrics(e.clientX, e.clientY, now);

      // Add to path for curvature calculation
      mousePath.current.push({ x: e.clientX, y: e.clientY, t: now });
      if (mousePath.current.length > 10) {
        mousePath.current.shift();
      }

      const interaction: MouseInteraction = {
        type: 'mousemove',
        timestamp: now,
        x: e.clientX,
        y: e.clientY,
        velocityX,
        velocityY,
        accelerationX,
        accelerationY,
        jerk,
        curvature,
        targetElement: (e.target as Element)?.tagName,
      };

      addInteraction(interaction);

      lastMousePos.current = { x: e.clientX, y: e.clientY, timestamp: now };
      lastMouseVelocity.current = { vx: velocityX, vy: velocityY, timestamp: now };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [trackingEnabled, addInteraction, calculateMouseMetrics]);

  // Mouse click handlers
  useEffect(() => {
    if (!trackingEnabled) return;

    const handleMouseDown = (e: MouseEvent) => {
      lastActivityTime.current = Date.now();
      mouseDownTime.current = Date.now();
    };

    const handleMouseUp = (e: MouseEvent) => {
      lastActivityTime.current = Date.now();
      const now = Date.now();
      const duration = now - mouseDownTime.current;

      const interaction: MouseInteraction = {
        type: 'click',
        timestamp: now,
        x: e.clientX,
        y: e.clientY,
        pressure: duration, // Use duration as proxy for pressure
        targetElement: (e.target as Element)?.tagName,
      };

      addInteraction(interaction);
    };

    const handleDoubleClick = (e: MouseEvent) => {
      lastActivityTime.current = Date.now();
      const now = Date.now();
      const timeSinceLastClick = now - lastClickTime.current;

      const interaction: MouseInteraction = {
        type: 'dblclick',
        timestamp: now,
        x: e.clientX,
        y: e.clientY,
        pressure: timeSinceLastClick,
        targetElement: (e.target as Element)?.tagName,
      };

      addInteraction(interaction);
      lastClickTime.current = now;
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('dblclick', handleDoubleClick);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [trackingEnabled, addInteraction]);

  // Keyboard handlers
  useEffect(() => {
    if (!trackingEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      lastActivityTime.current = Date.now();
      const now = Date.now();
      const timeSinceLastKey = now - lastKeyTime.current;

      const isBackspace = e.key === 'Backspace';
      if (isBackspace) backspaceCount.current++;
      totalKeys.current++;

      const interaction: KeyboardInteraction = {
        type: 'keydown',
        timestamp: now,
        key: e.key,
        code: e.code,
        isBackspace,
        timeSinceLastKey,
      };

      addInteraction(interaction);
      lastKeyTime.current = now;
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [trackingEnabled, addInteraction]);

  // Scroll handler
  useEffect(() => {
    if (!trackingEnabled) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      lastActivityTime.current = Date.now();
      const now = Date.now();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      const dt = (now - lastScrollPos.current.timestamp) / 1000;
      const velocityY = dt > 0 ? (scrollY - lastScrollPos.current.y) / dt : 0;
      const velocityX = dt > 0 ? (scrollX - lastScrollPos.current.x) / dt : 0;

      const interaction: ScrollInteraction = {
        type: 'scroll',
        timestamp: now,
        scrollY,
        scrollX,
        velocityY,
        velocityX,
      };

      addInteraction(interaction);

      lastScrollPos.current = { x: scrollX, y: scrollY, timestamp: now };
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [trackingEnabled, addInteraction]);

  // Touch handlers for mobile
  useEffect(() => {
    if (!trackingEnabled) return;

    const handleTouch = (e: TouchEvent) => {
      lastActivityTime.current = Date.now();
      const now = Date.now();

      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];

        const interaction: TouchInteraction = {
          type: e.type as 'touchstart' | 'touchmove' | 'touchend',
          timestamp: now,
          x: touch.clientX,
          y: touch.clientY,
          pressure: touch.force || 0,
          radiusX: touch.radiusX || 0,
          radiusY: touch.radiusY || 0,
        };

        addInteraction(interaction);
      }
    };

    window.addEventListener('touchstart', handleTouch, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });
    window.addEventListener('touchend', handleTouch, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('touchend', handleTouch);
    };
  }, [trackingEnabled, addInteraction]);

  // Device event handlers
  useEffect(() => {
    if (!trackingEnabled) return;

    const handleFocus = () => {
      const interaction: DeviceInteraction = {
        type: 'focus',
        timestamp: Date.now(),
      };
      addInteraction(interaction);
    };

    const handleBlur = () => {
      const interaction: DeviceInteraction = {
        type: 'blur',
        timestamp: Date.now(),
      };
      addInteraction(interaction);
    };

    const handleResize = () => {
      const interaction: DeviceInteraction = {
        type: 'resize',
        timestamp: Date.now(),
        data: { width: window.innerWidth, height: window.innerHeight },
      };
      addInteraction(interaction);
    };

    const handleOrientation = () => {
      const interaction: DeviceInteraction = {
        type: 'orientation',
        timestamp: Date.now(),
        data: { orientation: window.screen.orientation?.type },
      };
      addInteraction(interaction);
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientation);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientation);
    };
  }, [trackingEnabled, addInteraction]);

  // Idle detection
  useEffect(() => {
    if (!trackingEnabled) return;

    idleCheckInterval.current = setInterval(() => {
      const idleTime = Date.now() - lastActivityTime.current;
      if (idleTime > 2000) {
        // User is idle for more than 2 seconds
        // This will be used in statistical analysis
      }
    }, 1000);

    return () => {
      if (idleCheckInterval.current) {
        clearInterval(idleCheckInterval.current);
      }
    };
  }, [trackingEnabled]);

  return {
    lastActivityTime: lastActivityTime.current,
    backspaceCount: backspaceCount.current,
    totalKeys: totalKeys.current,
  };
}
