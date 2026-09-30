'use client';

import * as React from 'react';
import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

export type DragonChatState = 'idle' | 'typing' | 'streaming' | 'finished';

export interface CreatureBehavior {
  speed: number;
  flapMultiplier: number;
  curveBiasToPerch: boolean;
  emitFlames: boolean;
  victorySwoop: boolean;
}

// ── 01. State-to-Behavior Map ──
export const CREATURE_STATE_MAP: Record<DragonChatState, CreatureBehavior> = {
  idle: {
    speed: 0.55,
    flapMultiplier: 1.0,
    curveBiasToPerch: false,
    emitFlames: false,
    victorySwoop: false,
  },
  typing: {
    speed: 0.32,
    flapMultiplier: 0.8,
    curveBiasToPerch: true, // Perches watchfully in upper-left airspace near plant/bookshelf
    emitFlames: false,
    victorySwoop: false,
  },
  streaming: {
    speed: 0.95,
    flapMultiplier: 1.4,
    curveBiasToPerch: false,
    emitFlames: true, // Burst flame breath from mouth
    victorySwoop: false,
  },
  finished: {
    speed: 0.75,
    flapMultiplier: 1.25,
    curveBiasToPerch: false,
    emitFlames: false,
    victorySwoop: true, // Parabolic victory loop
  },
};

const MAX_PARTICLES = 200;

// ── 02. Instanced Flame Particle System ──
function FlameParticles({
  active,
  emitterPos,
  emitterDir,
}: {
  active: boolean;
  emitterPos: THREE.Vector3;
  emitterDir: THREE.Vector3;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const particles = useRef<
    Array<{
      pos: THREE.Vector3;
      vel: THREE.Vector3;
      life: number;
      maxLife: number;
      scale: number;
      color: THREE.Color;
    }>
  >([]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geom = useMemo(() => new THREE.SphereGeometry(0.04, 6, 6), []);
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0xff6611,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  useEffect(() => {
    particles.current = Array.from({ length: MAX_PARTICLES }, () => ({
      pos: new THREE.Vector3(0, -999, 0),
      vel: new THREE.Vector3(),
      life: 0,
      maxLife: 0.6,
      scale: 1,
      color: new THREE.Color(0xff4400),
    }));

    return () => {
      geom.dispose();
      mat.dispose();
    };
  }, [geom, mat]);

  const nextSpawnTime = useRef(0);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const t = state.clock.getElapsedTime();

    if (active && t > nextSpawnTime.current) {
      nextSpawnTime.current = t + 0.016;
      const p = particles.current.find((item) => item.life <= 0);
      if (p) {
        p.life = 1.0;
        p.maxLife = 0.45 + Math.random() * 0.3;
        p.pos.copy(emitterPos).add(
          new THREE.Vector3(
            (Math.random() - 0.5) * 0.08,
            (Math.random() - 0.5) * 0.08,
            (Math.random() - 0.5) * 0.08
          )
        );

        p.vel
          .copy(emitterDir)
          .multiplyScalar(2.2 + Math.random() * 1.2)
          .add(
            new THREE.Vector3(
              (Math.random() - 0.5) * 0.6,
              (Math.random() - 0.2) * 0.6,
              (Math.random() - 0.5) * 0.6
            )
          );

        p.scale = 0.8 + Math.random() * 0.6;
      }
    }

    let activeCount = 0;
    particles.current.forEach((p, idx) => {
      if (p.life > 0) {
        p.life -= delta / p.maxLife;
        p.pos.addScaledVector(p.vel, delta);
        p.vel.y += delta * 0.5;

        const lifeRatio = Math.max(0, p.life);
        const currentScale = p.scale * (1 + (1 - lifeRatio) * 1.5) * lifeRatio;

        dummy.position.copy(p.pos);
        dummy.scale.set(currentScale, currentScale, currentScale);
        dummy.updateMatrix();
        mesh.setMatrixAt(idx, dummy.matrix);

        p.color.setHSL(0.04 + lifeRatio * 0.09, 1.0, 0.4 + lifeRatio * 0.4);
        mesh.setColorAt(idx, p.color);
        activeCount++;
      } else {
        dummy.position.set(0, -999, 0);
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        mesh.setMatrixAt(idx, dummy.matrix);
      }
    });

    if (activeCount > 0 || active) {
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
  });

  return <instancedMesh ref={meshRef} args={[geom, mat, MAX_PARTICLES]} />;
}

// ── 03. Charizard Dragon Creature (Outer Airspace Flight Loop, Never on Desktop Screen) ──
function CharizardCreature({
  modelUrl,
  chatState,
}: {
  modelUrl: string;
  chatState: DragonChatState;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const behavior = CREATURE_STATE_MAP[chatState] || CREATURE_STATE_MAP.idle;
  const gltf = useGLTF(modelUrl);
  const { actions, names } = useAnimations(gltf.animations, gltf.scene);

  const { modelHeight, modelCenter, mouthNode } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const mouthRef: { current: THREE.Object3D | null } = { current: null };
    gltf.scene.traverse((node) => {
      const lower = node.name.toLowerCase();
      if (!mouthRef.current && (lower.includes('jaw') || lower.includes('mouth') || lower.includes('head') || lower.includes('snout'))) {
        mouthRef.current = node;
      }
    });

    return {
      modelHeight: Math.max(0.5, size.y),
      modelCenter: center,
      mouthNode: mouthRef.current,
    };
  }, [gltf.scene]);

  useEffect(() => {
    const flapName = names.find((n) => /fly|flap|wing|take/i.test(n)) || names[0];
    if (flapName && actions[flapName]) {
      const action = actions[flapName];
      action.reset().fadeIn(0.25).play();
      return () => {
        action.fadeOut(0.25);
      };
    }
  }, [actions, names]);

  useEffect(() => {
    const flapName = names.find((n) => /fly|flap|wing|take/i.test(n)) || names[0];
    if (flapName && actions[flapName]) {
      actions[flapName].timeScale = Math.max(0.4, behavior.speed * behavior.flapMultiplier * 2.2);
    }
  }, [behavior, actions, names]);

  // Charizard Flight Loop: Swoops gracefully in the MID TO BOTTOM zone across the desk,
  // in front of the iMac stand and around the keyboard, strictly clear of the screen frame.
  const curve = useMemo(() => {
    const w = viewport.width;
    const h = viewport.height;

    const pts = [
      new THREE.Vector3(0.0,        -h * 0.125, 1.25), // 1. Center in front of stand, above keyboard
      new THREE.Vector3(w * 0.16,   -h * 0.130, 1.20), // 2. Gliding right across desk mat
      new THREE.Vector3(w * 0.28,   -h * 0.140, 1.10), // 3. Banking over right desk near mouse
      new THREE.Vector3(w * 0.32,   -h * 0.125, 0.95), // 4. Smooth wide banking turn on right desk
      new THREE.Vector3(w * 0.18,   -h * 0.118, 0.90), // 5. Gliding behind keyboard in front of stand
      new THREE.Vector3(0.0,        -h * 0.115, 0.88), // 6. Center behind keyboard in front of stand
      new THREE.Vector3(-w * 0.18,  -h * 0.118, 0.90), // 7. Gliding behind keyboard toward left
      new THREE.Vector3(-w * 0.32,  -h * 0.125, 0.95), // 8. Smooth wide banking turn on left desk
      new THREE.Vector3(-w * 0.28,  -h * 0.140, 1.10), // 9. Banking over left desk mat
      new THREE.Vector3(-w * 0.16,  -h * 0.130, 1.20), // 10. Swooping toward center
    ];

    return new THREE.CatmullRomCurve3(pts, true, 'centripetal');
  }, [viewport.width, viewport.height]);

  const progress = useRef(0);
  const victoryStartTime = useRef(0);
  const prevChatState = useRef(chatState);

  useEffect(() => {
    if (chatState === 'finished' && prevChatState.current !== 'finished') {
      victoryStartTime.current = performance.now() / 1000;
    }
    prevChatState.current = chatState;
  }, [chatState]);

  const mouthPos = useRef(new THREE.Vector3());
  const mouthDir = useRef(new THREE.Vector3(0, 0, 1));

  // Smoothed position, tangent & rotation for silky interpolation and buttery turns
  const smoothedPos = useRef(new THREE.Vector3());
  const smoothedTangent = useRef(new THREE.Vector3(0, 0, 1));
  const isFirstFrame = useRef(true);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const smoothedBank = useRef(0);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const t = state.clock.getElapsedTime();
    const clampedDelta = Math.min(delta, 0.05); // Prevent jumps on tab switch

    const currentSpeed = behavior.speed;
    progress.current = (progress.current + clampedDelta * currentSpeed * 0.055) % 1.0;

    const rawPos = curve.getPointAt(progress.current);
    const tangent = curve.getTangentAt(progress.current).normalize();

    // Look ahead along curve to anticipate banking and turns early
    const lookAheadU = (progress.current + 0.04) % 1.0;
    const nextTangent = curve.getTangentAt(lookAheadU).normalize();

    // When typing, hover gently on the left desk area beside the keyboard
    if (behavior.curveBiasToPerch) {
      rawPos.x = THREE.MathUtils.lerp(rawPos.x, -viewport.width * 0.25, 0.08);
      rawPos.y = THREE.MathUtils.lerp(rawPos.y, -viewport.height * 0.13, 0.08);
      rawPos.z = THREE.MathUtils.lerp(rawPos.z, 1.15, 0.08);
    }

    // Gentle vertical breathing — very subtle, slow sine wave
    const verticalBob = Math.sin(t * 1.6) * (viewport.height * 0.003);
    rawPos.y += verticalBob;

    let victoryPitch = 0;
    if (behavior.victorySwoop) {
      const elapsed = t - victoryStartTime.current;
      if (elapsed >= 0 && elapsed <= 1.5) {
        const swoopRatio = elapsed / 1.5;
        rawPos.y += Math.sin(swoopRatio * Math.PI) * (viewport.height * 0.015);
        victoryPitch = -Math.sin(swoopRatio * Math.PI) * 0.25;
      }
    }

    // STRICT MID-TO-BOTTOM CLAMP:
    // Screen frame bottom edge is at -0.068 * h; chin is at -0.10 * h.
    // Charizard strictly stays below -0.112 * h, never touching the screen frame!
    rawPos.y = THREE.MathUtils.clamp(rawPos.y, -viewport.height * 0.165, -viewport.height * 0.112);

    // Smooth position & tangent interpolation — completely eliminates jerky turns
    if (isFirstFrame.current) {
      smoothedPos.current.copy(rawPos);
      smoothedTangent.current.copy(tangent);
    } else {
      const smoothFactor = 1.0 - Math.pow(0.001, clampedDelta);
      smoothedPos.current.lerp(rawPos, smoothFactor);
      const tangentFactor = 1.0 - Math.pow(0.002, clampedDelta);
      smoothedTangent.current.lerp(tangent, tangentFactor).normalize();
    }

    group.position.copy(smoothedPos.current);

    // Compute ideal orientation on dummy helper using smoothed tangent
    dummy.position.copy(smoothedPos.current);
    const lookTarget = smoothedPos.current.clone().add(smoothedTangent.current);
    dummy.lookAt(lookTarget);

    // Smooth anticipatory banking into curves
    const lateralTurn = smoothedTangent.current.x * nextTangent.z - smoothedTangent.current.z * nextTangent.x;
    const targetBank = THREE.MathUtils.clamp(lateralTurn * 4.5, -0.32, 0.32);
    smoothedBank.current = THREE.MathUtils.lerp(
      smoothedBank.current,
      targetBank,
      1.0 - Math.pow(0.005, clampedDelta)
    );
    dummy.rotateZ(smoothedBank.current);

    if (victoryPitch !== 0) {
      dummy.rotateX(victoryPitch);
    }

    // Silky quaternion slerp for turning — eliminates all jerky turns
    if (isFirstFrame.current) {
      group.quaternion.copy(dummy.quaternion);
      isFirstFrame.current = false;
    } else {
      const rotFactor = 1.0 - Math.pow(0.0006, clampedDelta);
      group.quaternion.slerp(dummy.quaternion, rotFactor);
    }

    // Scale Charizard: increased size (~13.8% screen height) for a bolder, more impressive companion
    const targetHeight = viewport.height * 0.138;
    const scale = targetHeight / modelHeight;
    group.scale.set(scale, scale, scale);

    // Update flame burst position from mouth/head
    if (mouthNode) {
      mouthNode.getWorldPosition(mouthPos.current);
      mouthNode.getWorldDirection(mouthDir.current);
    } else {
      mouthPos.current.copy(smoothedPos.current).add(smoothedTangent.current.clone().multiplyScalar(scale * 0.6));
      mouthDir.current.copy(smoothedTangent.current);
    }
  });

  return (
    <>
      <group ref={groupRef}>
        {/* Model centered at pivot with NO 180° rotation -> flies head-first forward */}
        <group position={[-modelCenter.x, -modelCenter.y, -modelCenter.z]}>
          <primitive object={gltf.scene} />
        </group>
      </group>

      <FlameParticles
        active={behavior.emitFlames}
        emitterPos={mouthPos.current}
        emitterDir={mouthDir.current}
      />
    </>
  );
}

// ── 04. Mew Psychic Creature (Agile Companion Loop, Safe Zone, Never In Navbar or Screen) ──
function MewCreature({
  modelUrl,
  chatState,
}: {
  modelUrl: string;
  chatState: DragonChatState;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const behavior = CREATURE_STATE_MAP[chatState] || CREATURE_STATE_MAP.idle;
  const gltf = useGLTF(modelUrl);
  const { actions, names } = useAnimations(gltf.animations, gltf.scene);

  const { modelHeight, modelCenter } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    return {
      modelHeight: Math.max(0.4, size.y),
      modelCenter: center,
    };
  }, [gltf.scene]);

  useEffect(() => {
    const flapName = names.find((n) => /fly|flap|wing|take/i.test(n)) || names[0];
    if (flapName && actions[flapName]) {
      const action = actions[flapName];
      action.reset().fadeIn(0.25).play();
      return () => {
        action.fadeOut(0.25);
      };
    }
  }, [actions, names]);

  useEffect(() => {
    const flapName = names.find((n) => /fly|flap|wing|take/i.test(n)) || names[0];
    if (flapName && actions[flapName]) {
      actions[flapName].timeScale = Math.max(0.4, behavior.speed * behavior.flapMultiplier * 2.4);
    }
  }, [behavior, actions, names]);

  // Mew Flight Loop: Playful companion soaring strictly in the MID TO TOP zone
  // across the upper room, warm lamp, monstera plant, and top airspace above the monitor.
  const curve = useMemo(() => {
    const w = viewport.width;
    const h = viewport.height;

    const pts = [
      new THREE.Vector3(0.0,        h * 0.35, 0.85), // 1. High airspace center above monitor
      new THREE.Vector3(w * 0.18,   h * 0.33, 0.95), // 2. High pass over top right
      new THREE.Vector3(w * 0.28,   h * 0.25, 1.10), // 3. Gliding right near warm lamp
      new THREE.Vector3(w * 0.32,   h * 0.20, 1.15), // 4. Arcing turn beside monitor right bezel
      new THREE.Vector3(w * 0.22,   h * 0.26, 1.05), // 5. Swooping up right
      new THREE.Vector3(0.0,        h * 0.36, 0.85), // 6. High arch across top
      new THREE.Vector3(-w * 0.22,  h * 0.26, 1.05), // 7. Swooping up left
      new THREE.Vector3(-w * 0.32,  h * 0.20, 1.15), // 8. Arcing turn beside monitor left bezel
      new THREE.Vector3(-w * 0.28,  h * 0.25, 1.10), // 9. Gliding through monstera plant on left
      new THREE.Vector3(-w * 0.18,  h * 0.33, 0.95), // 10. High pass over top left toward center
    ];

    return new THREE.CatmullRomCurve3(pts, true, 'centripetal');
  }, [viewport.width, viewport.height]);

  // Start with offset so Mew and Charizard are on opposite sides of the room
  const progress = useRef(0.45);

  // Smoothed position, tangent & rotation for silky interpolation and buttery turns
  const smoothedPos = useRef(new THREE.Vector3());
  const smoothedTangent = useRef(new THREE.Vector3(0, 0, 1));
  const isFirstFrame = useRef(true);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const smoothedBank = useRef(0);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const t = state.clock.getElapsedTime();
    const clampedDelta = Math.min(delta, 0.05); // Prevent jumps on tab switch

    // Mew is agile and slightly faster
    const currentSpeed = behavior.speed * 1.12;
    progress.current = (progress.current + clampedDelta * currentSpeed * 0.055) % 1.0;

    const rawPos = curve.getPointAt(progress.current);
    const tangent = curve.getTangentAt(progress.current).normalize();

    // Look slightly ahead to anticipate turns smoothly
    const lookAheadU = (progress.current + 0.035) % 1.0;
    const nextTangent = curve.getTangentAt(lookAheadU).normalize();

    // Gentle vertical breathing — slow and subtle
    const verticalBob = Math.sin(t * 1.8) * (viewport.height * 0.003);
    rawPos.y += verticalBob;

    // Very subtle horizontal sway
    const horizontalSway = Math.cos(t * 1.3) * (viewport.width * 0.003);
    rawPos.x += horizontalSway;

    // ── STRICT MID-TO-TOP FLIGHT ZONE ──
    // Screen top is at +0.306 * h.
    // When in front of / above the monitor (|x| < 0.22 * w), Mew strictly stays above +0.32 * h.
    // On the sides (|x| >= 0.22 * w), Mew glides gracefully between +0.19 * h and +0.38 * h.
    if (Math.abs(rawPos.x) < viewport.width * 0.22) {
      rawPos.y = Math.max(rawPos.y, viewport.height * 0.32);
    }
    rawPos.y = THREE.MathUtils.clamp(rawPos.y, viewport.height * 0.19, viewport.height * 0.42);
    rawPos.x = THREE.MathUtils.clamp(rawPos.x, -viewport.width * 0.35, viewport.width * 0.35);

    // Smooth position & tangent interpolation — completely eliminates snappy turns
    if (isFirstFrame.current) {
      smoothedPos.current.copy(rawPos);
      smoothedTangent.current.copy(tangent);
    } else {
      const smoothFactor = 1.0 - Math.pow(0.001, clampedDelta);
      smoothedPos.current.lerp(rawPos, smoothFactor);
      const tangentFactor = 1.0 - Math.pow(0.002, clampedDelta);
      smoothedTangent.current.lerp(tangent, tangentFactor).normalize();
    }

    group.position.copy(smoothedPos.current);

    // Compute ideal orientation on dummy helper using smoothed tangent
    dummy.position.copy(smoothedPos.current);
    const lookTarget = smoothedPos.current.clone().add(smoothedTangent.current);
    dummy.lookAt(lookTarget);

    // Smooth anticipatory banking into curves
    const lateralTurn = smoothedTangent.current.x * nextTangent.z - smoothedTangent.current.z * nextTangent.x;
    const targetBank = THREE.MathUtils.clamp(lateralTurn * 5.0, -0.35, 0.35);
    smoothedBank.current = THREE.MathUtils.lerp(
      smoothedBank.current,
      targetBank,
      1.0 - Math.pow(0.005, clampedDelta)
    );
    dummy.rotateZ(smoothedBank.current);

    // Silky quaternion slerp for Mew
    if (isFirstFrame.current) {
      group.quaternion.copy(dummy.quaternion);
      isFirstFrame.current = false;
    } else {
      const rotFactor = 1.0 - Math.pow(0.0006, clampedDelta);
      group.quaternion.slerp(dummy.quaternion, rotFactor);
    }

    // Scale Mew to ~10.5% screen height
    const targetHeight = viewport.height * 0.105;
    const scale = targetHeight / modelHeight;
    group.scale.set(scale, scale, scale);
  });

  return (
    <group ref={groupRef}>
      {/* Model centered at pivot with NO 180° flip -> flies head-first forward */}
      <group position={[-modelCenter.x, -modelCenter.y, -modelCenter.z]}>
        <primitive object={gltf.scene} />
      </group>
    </group>
  );
}

// ── 05. Error Boundary ──
class CreatureErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: unknown) {
    console.warn('[FlyingCreatures] Failed to render model:', err);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// ── 06. Main FlyingDragon Component (Renders Both Creatures Together) ──
export interface FlyingDragonProps {
  chatState: DragonChatState;
  style?: React.CSSProperties;
}

export default function FlyingDragon({ chatState, style }: FlyingDragonProps) {
  const [charizardUrl, setCharizardUrl] = useState<string | null>(null);
  const [mewUrl, setMewUrl] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);

  // Responsive & Accessibility check: Disable below 768px and when prefers-reduced-motion is true
  useEffect(() => {
    const updateEligibility = () => {
      const isDesktop = window.innerWidth >= 768;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setEnabled(isDesktop && !reducedMotion);
    };

    updateEligibility();
    window.addEventListener('resize', updateEligibility);
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', updateEligibility);

    return () => {
      window.removeEventListener('resize', updateEligibility);
      motionQuery.removeEventListener('change', updateEligibility);
    };
  }, []);

  // Pause rendering when tab is hidden
  useEffect(() => {
    const handleVis = () => {
      setIsTabVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVis);
    return () => document.removeEventListener('visibilitychange', handleVis);
  }, []);

  // Detect and resolve both models
  useEffect(() => {
    let active = true;

    async function checkUrl(url: string): Promise<boolean> {
      try {
        const res = await fetch(url, { method: 'HEAD' });
        if (res.ok) return true;
      } catch {
        // try GET fallback
      }
      try {
        const res = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-100' } });
        if (res.ok) return true;
      } catch {
        // ignore
      }
      return false;
    }

    async function detectModels() {
      // 1. Check Charizard candidate models
      const charizardCandidates = [
        '/models/charizard_flying_animation.glb',
        '/models/charizard.glb',
      ];
      let foundCharizard: string | null = null;
      for (const url of charizardCandidates) {
        const exists = await checkUrl(url);
        if (exists) {
          foundCharizard = url;
          break;
        }
      }
      // If neither replied to fetch, fallback to first path
      if (!foundCharizard) foundCharizard = charizardCandidates[0];

      // 2. Check Mew candidate model
      const mewCandidate = '/models/mew_-_flying.glb';
      let foundMew: string | null = null;
      const mewExists = await checkUrl(mewCandidate);
      if (mewExists) {
        foundMew = mewCandidate;
      } else {
        foundMew = mewCandidate; // fallback
      }

      if (active) {
        setCharizardUrl(foundCharizard);
        setMewUrl(foundMew);
        console.log(`[FlyingCreatures] Active models: Charizard="${foundCharizard}", Mew="${foundMew}"`);
      }
    }

    detectModels();

    return () => {
      active = false;
    };
  }, []);

  if (!enabled || (!charizardUrl && !mewUrl)) {
    return null;
  }

  return (
    <div
      className="flying-dragon-canvas-layer"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 25, // In front of desktop monitor screen (z-index: 20) so model body parts never go inside the screen
        ...style,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={[1, 2]}
        frameloop={isTabVisible ? 'always' : 'never'}
        style={{ pointerEvents: 'none', width: '100%', height: '100%' }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        {/* Warm ambient & directional lighting matching amber room preset */}
        <ambientLight intensity={1.5} color="#FFF8E8" />
        <directionalLight position={[6, 8, 6]} intensity={2.2} color="#FFE8C8" />
        <directionalLight position={[-5, 3, -3]} intensity={1.0} color="#FFDCA8" />
        <pointLight position={[2, -1, 3]} intensity={1.2} color="#FFA552" distance={15} />
        <hemisphereLight args={['#FFE8C8', '#382215', 0.8]} />

        {/* Soft Contact Shadows on desk */}
        <ContactShadows
          opacity={0.35}
          scale={10}
          blur={2.5}
          far={4}
          position={[0, -2.4, 0]}
        />

        {/* Charizard Creature Companion */}
        {charizardUrl && (
          <CreatureErrorBoundary>
            <React.Suspense fallback={null}>
              <CharizardCreature modelUrl={charizardUrl} chatState={chatState} />
            </React.Suspense>
          </CreatureErrorBoundary>
        )}

        {/* Mew Creature Companion */}
        {mewUrl && (
          <CreatureErrorBoundary>
            <React.Suspense fallback={null}>
              <MewCreature modelUrl={mewUrl} chatState={chatState} />
            </React.Suspense>
          </CreatureErrorBoundary>
        )}
      </Canvas>
    </div>
  );
}

// Preload both models for instantaneous rendering
useGLTF.preload('/models/charizard_flying_animation.glb');
useGLTF.preload('/models/mew_-_flying.glb');
useGLTF.preload('/models/charizard.glb');
