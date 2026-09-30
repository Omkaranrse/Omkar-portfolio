'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import Link from 'next/link';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform float uTime;
uniform float uHover;
uniform float uClick;
uniform vec3 uBaseColor;
uniform vec3 uGlassColor;
uniform vec2 uResolution;

// Hash function for pseudo-randomness
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

// Simplex-style noise
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// Fractal Brownian Motion for liquid distortion
float fbm(vec2 p) {
    float f = 0.0;
    float amp = 0.5;
    for(int i = 0; i < 4; i++) {
        f += amp * noise(p);
        p *= 2.0;
        amp *= 0.5;
    }
    return f;
}

void main() {
    // Aspect-corrected coordinates for perfect pill shape math
    float aspect = uResolution.x / uResolution.y;
    vec2 p = vUv * 2.0 - 1.0;
    p.x *= aspect;

    // Center calculations for the liquid click surge
    vec2 center = vec2(0.5);
    vec2 dirToCenter = normalize(vUv - center + vec2(0.0001));
    float distToCenter = length(vUv - center);

    // 1. SDF (Signed Distance Field) for a Pill Shape
    float r = 1.0; 
    vec2 b = vec2(max(aspect - 1.0, 0.0), 0.0);
    vec2 d = abs(p) - b;
    float dist = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - r;
    
    // Normalized distance from edge (0 = edge, 1 = center)
    float innerDist = clamp(abs(dist), 0.0, 1.0);

    // 2. Dynamic Liquid Noise Field
    float t = uTime;
    
    // Stretch noise horizontally
    vec2 noiseUv = vUv * vec2(2.0, 1.0); 
    
    // Dynamic warping on hover + Liquid Surge on Click
    vec2 warp = vec2(fbm(noiseUv + t * 0.5), fbm(noiseUv + t * 0.5 + 12.34)) * mix(0.0, 0.4, uHover);
    warp -= dirToCenter * uClick * 0.25 * smoothstep(0.8, 0.0, distToCenter); 
    
    float n1 = fbm(noiseUv + warp + vec2(t, 0.0));
    float n2 = fbm(noiseUv + warp + vec2(n1, t * 1.2));

    // 3. Glassy Rim & Specular Highlights
    float rimWidth = mix(0.15, 0.35, n2) * mix(1.0, 1.4, uHover);
    rimWidth += uClick * 0.15; // Rim expands on click
    float rim = smoothstep(rimWidth, 0.0, innerDist);
    
    float specDist = abs(innerDist - 0.12 + n1 * 0.08);
    float specular = smoothstep(0.03, 0.0, specDist);

    float rightBias = smoothstep(0.2, 1.0, vUv.x);
    rim *= mix(0.6, 1.5, rightBias);
    specular *= mix(0.5, 2.0, rightBias);

    // 4. Highly Dynamic Stars / Particles
    vec2 starUv = vUv * vec2(aspect * 6.0, 6.0);
    
    // Drift uses the accumulated uTime so it accelerates smoothly without jumping
    starUv.x -= uTime * 0.2; 
    starUv.y += sin(uTime * 0.5 + starUv.x) * mix(0.2, 0.6, uHover); 
    
    // Star Burst on Click
    starUv += dirToCenter * uClick * 1.5;

    vec2 id = floor(starUv);
    vec2 gv = fract(starUv) - 0.5;
    float nStar = hash(id);
    float star = 0.0;
    
    float starThreshold = mix(0.94, 0.86, uHover); 
    
    if (nStar > starThreshold) { 
        // Randomize size per star
        float sizeMod = mix(0.5, 2.5, hash(id + 13.37)); 
        
        // Local micro-movements (wiggling inside their cell on hover)
        vec2 localWiggle = vec2(
            sin(uTime * 2.0 + nStar * 50.0),
            cos(uTime * 2.3 + nStar * 40.0)
        ) * 0.25 * uHover;

        float starDist = length(gv - localWiggle) * sizeMod;
        
        // Core brightness + Outer glow
        star = smoothstep(0.12, 0.0, starDist);
        star += smoothstep(0.25, 0.0, starDist) * 0.3;

        // Twinkle phase uses accumulated time to naturally speed up
        float twinklePhase = uTime * mix(5.0, 15.0, hash(id + 42.0));
        star *= sin(twinklePhase + nStar * 100.0) * 0.5 + 0.5; 
        
        // Fade stars out near the edge
        star *= smoothstep(0.05, 0.2, innerDist); 
    }

    // 5. Compositing
    vec3 color = uBaseColor;
    
    float innerLiquid = smoothstep(0.2, 0.9, n2) * (1.0 - innerDist) * mix(0.2, 0.45, uHover);
    color += uGlassColor * innerLiquid;
    
    color += uGlassColor * rim * mix(0.6, 1.2, uHover);
    color += vec3(1.0) * specular * mix(0.8, 2.0, uHover);
    
    color += vec3(1.0) * star * mix(0.8, 1.5, uHover);

    // Click Flash Effects
    color += uGlassColor * rim * uClick * 0.8;
    color += vec3(1.0) * specular * uClick * 1.5;
    color += uGlassColor * exp(-distToCenter * 6.0) * uClick * 0.6; // Volumetric center glow

    color *= smoothstep(1.5, 0.2, length(vUv - 0.5));

    gl_FragColor = vec4(color, 1.0);
}
`;

export interface FluidGlassButtonProps {
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  children?: React.ReactNode;
  text?: string;
  icon?: 'arrow' | 'diagonal' | 'sparkle' | 'none';
  baseColor?: string;
  glassColor?: string;
  hoverSpeed?: number;
  borderRadius?: number | string;
  padding?: string;
  fontSize?: string;
  fontWeight?: number | string;
  className?: string;
  style?: React.CSSProperties;
  target?: string;
  rel?: string;
  livePreview?: boolean;
}

export default function FluidGlassButton({
  href,
  onClick,
  children,
  text = 'Get Started',
  icon = 'none',
  baseColor = '#000000',
  glassColor = '#C2C2C2',
  hoverSpeed = 0.6,
  borderRadius = 999,
  padding = '12px 28px',
  fontSize = '15px',
  fontWeight = 600,
  className = '',
  style,
  target,
  rel,
  livePreview = false,
}: FluidGlassButtonProps) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const outerRef = useRef<HTMLElement | null>(null);
  const hoverRef = useRef(0);
  const clickRef = useRef(0);

  const uniformsRef = useRef({
    uTime: { value: 0 },
    uHover: { value: 0 },
    uClick: { value: 0 },
    uBaseColor: { value: new THREE.Color(baseColor) },
    uGlassColor: { value: new THREE.Color(glassColor) },
    uResolution: { value: new THREE.Vector2(1, 1) },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    uniformsRef.current.uBaseColor.value.set(baseColor);
    uniformsRef.current.uGlassColor.value.set(glassColor);
  }, [baseColor, glassColor]);

  useEffect(() => {
    if (!mounted) return;
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const canvas = renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';

    container.appendChild(canvas);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: uniformsRef.current,
      transparent: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationFrameId: number;
    let timeAccumulator = 0;
    let lastTime = performance.now();
    let isIntersecting = false;
    let currentHoverValue = 0;
    let currentClickValue = 0;

    const renderLoop = (time: number) => {
      animationFrameId = requestAnimationFrame(renderLoop);
      if (!isIntersecting && !livePreview) {
        lastTime = time;
        return;
      }
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      const targetHover = hoverRef.current;
      currentHoverValue = THREE.MathUtils.lerp(currentHoverValue, targetHover, delta * 4);

      if (clickRef.current > 0) {
        currentClickValue = clickRef.current;
        clickRef.current = 0;
      }
      currentClickValue = THREE.MathUtils.lerp(currentClickValue, 0, delta * 6);

      const currentSpeed = THREE.MathUtils.lerp(0.15, hoverSpeed, currentHoverValue);
      timeAccumulator += delta * currentSpeed;

      uniformsRef.current.uTime.value = timeAccumulator;
      uniformsRef.current.uHover.value = currentHoverValue;
      uniformsRef.current.uClick.value = currentClickValue;

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width === 0 || height === 0) return;
        renderer.setSize(width, height);
        uniformsRef.current.uResolution.value.set(width, height);
      }
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        isIntersecting = entry.isIntersecting;
      }
    });
    intersectionObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, [mounted, hoverSpeed, livePreview]);

  const handleMouseEnter = useCallback(() => {
    hoverRef.current = 1;
    if (outerRef.current) {
      outerRef.current.style.transform = 'translateY(-1px) scale(1.02)';
      outerRef.current.style.boxShadow =
        'inset 0 0 0 1px rgba(255, 255, 255, 0.3), 0 16px 36px -8px rgba(0, 0, 0, 0.6)';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    hoverRef.current = 0;
    if (outerRef.current) {
      outerRef.current.style.transform = 'translateY(0) scale(1)';
      outerRef.current.style.boxShadow =
        'inset 0 0 0 1px rgba(255, 255, 255, 0.18), 0 10px 30px -10px rgba(0, 0, 0, 0.5)';
    }
  }, []);

  const handleMouseDown = useCallback(() => {
    clickRef.current = 1;
    if (outerRef.current) {
      outerRef.current.style.transform = 'scale(0.96)';
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    if (outerRef.current) {
      outerRef.current.style.transform = 'translateY(-1px) scale(1.02)';
    }
  }, []);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
    cursor: 'pointer',
    padding: padding,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    backgroundColor: baseColor,
    boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.18), 0 10px 30px -10px rgba(0, 0, 0, 0.5)',
    transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
    zIndex: 1,
    textDecoration: 'none',
    outline: 'none',
    border: 'none',
    margin: 0,
    fontFamily: 'inherit',
    overflow: 'hidden',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    ...style,
  };

  const renderIcon = () => {
    if (icon === 'arrow') {
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: 'transform 0.25s ease' }}
          className="fluid-btn-icon"
          aria-hidden="true"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      );
    }
    if (icon === 'diagonal') {
      return (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: 'transform 0.25s ease' }}
          className="fluid-btn-icon"
          aria-hidden="true"
        >
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      );
    }
    if (icon === 'sparkle') {
      return (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 2l2.4 7.2L21.6 12l-7.2 2.4L12 21.6l-2.4-7.2L2.4 12l7.2-2.4z" />
        </svg>
      );
    }
    return null;
  };

  const innerContent = (
    <>
      {/* 3D WebGL Shader Canvas Backing */}
      <div
        ref={containerRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      />

      {/* Button Label & Icon */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          color: '#ffffff',
          pointerEvents: 'none',
          textAlign: 'center',
          textShadow: '0 1px 8px rgba(0, 0, 0, 0.45)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: fontWeight,
          fontSize: fontSize,
          letterSpacing: '-0.01em',
          lineHeight: 1,
        }}
      >
        <span>{children || text}</span>
        {renderIcon()}
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        ref={outerRef as React.RefObject<HTMLAnchorElement>}
        style={containerStyle}
        className={`fluid-glass-button ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        target={target}
        rel={rel}
      >
        {innerContent}
      </Link>
    );
  }

  return (
    <button
      type="button"
      ref={outerRef as React.RefObject<HTMLButtonElement>}
      style={containerStyle}
      className={`fluid-glass-button ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
    >
      {innerContent}
    </button>
  );
}
