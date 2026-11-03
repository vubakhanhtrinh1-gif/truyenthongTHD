import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { entranceConfig } from './config/entranceConfig';
import { createEntranceMaterials } from './materials/EntranceMaterials';
import { buildEntrance3DScene, EntranceSceneElements } from './components/Entrance3DEnvironment';
import { entranceAudio } from './audio/EntranceAudio';
import { Volume2, VolumeX, Sparkles, ChevronRight, Terminal } from 'lucide-react';
import { useEditorialItem } from '../services/dynamicContentService';
import { useSchoolBranding } from '../services/brandingService';

interface Props {
  onEnterMuseum?: () => void;
  onOpenCmd?: () => void;
}

export const EntranceScene: React.FC<Props> = ({ onEnterMuseum, onOpenCmd }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(entranceAudio.getMutedState());
  const [ctaVisible, setCtaVisible] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [enteredFinished, setEnteredFinished] = useState(false);

  // Dynamic editorial content hook - binds live to Cloud Firestore
  const { data: dynamicData } = useEditorialItem('entrance.gateway', {
    projectTitle: entranceConfig.projectTitle,
    projectSubtitle: entranceConfig.projectSubtitle,
    tagline: entranceConfig.tagline,
    guideText: entranceConfig.primaryCtaText,
  });

  const { branding } = useSchoolBranding();

  // References for render loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const elementsRef = useRef<EntranceSceneElements | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Interaction tracking
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });
  const isHoveredRef = useRef(false);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseVectorRef = useRef(new THREE.Vector2());

  // Handle Mute toggle
  const toggleAudio = useCallback(() => {
    const muted = entranceAudio.toggleMute();
    setIsMuted(muted);
  }, []);

  // Handle Enter Gate Action
  const handleEnterGate = useCallback(() => {
    if (isEntering || enteredFinished) return;
    setIsEntering(true);
    entranceAudio.playGateEnter();
  }, [isEntering, enteredFinished]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup — Clean bright white museum environment
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfafbfc);
    scene.fog = new THREE.FogExp2(0xfafbfc, 0.015);
    sceneRef.current = scene;

    // 2. Camera setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(entranceConfig.camera.fov, width / height, 0.1, 80);
    camera.position.set(...entranceConfig.camera.initialPosition);
    camera.lookAt(...entranceConfig.camera.lookAt);
    cameraRef.current = camera;

    // 3. WebGL Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Base Museum Lighting (Brightened & Welcoming)
    const ambientLight = new THREE.AmbientLight(0xfff6ea, 0.55);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xfff6e5, 0x1c273c, 1.15);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfff2dc, 1.45);
    dirLight.position.set(4, 9, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.0004;
    scene.add(dirLight);

    // 5. Build procedural materials & 3D entrance geometry
    const materials = createEntranceMaterials();
    const elements = buildEntrance3DScene(materials);
    scene.add(elements.group);
    elementsRef.current = elements;

    // 6. Time and progress tracking
    const clock = new THREE.Clock();
    let startTime = performance.now();
    let cameraZ = entranceConfig.camera.initialPosition[2];
    let enterStartTime = 0;

    // 7. Mouse move handler for calm parallax look
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      mouseRef.current.targetX = normX;
      mouseRef.current.targetY = normY;

      mouseVectorRef.current.x = normX;
      mouseVectorRef.current.y = normY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        mouseRef.current.targetX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.targetY = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // 8. Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // 9. Main Animation Loop
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const now = performance.now();
      const ageSeconds = (now - startTime) / 1000;

      // 5-10 second reveal curve
      const revealFactor = Math.min(ageSeconds / entranceConfig.timings.revealDuration, 1.0);

      if (ageSeconds > 4.5 && !ctaVisible) {
        setCtaVisible(true);
      }

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.045;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.045;

      // Rotate orbital particles around the gold ring
      if (elements.orbitalParticles) {
        elements.orbitalParticles.rotation.z = elapsedTime * 0.35;
      }
      if (elements.starParticles) {
        elements.starParticles.rotation.y = elapsedTime * 0.015;
      }

      // Animate Mystical Ground Fog Planes (undulation, slow drift, soft breathing)
      if (elements.fogPlanes) {
        elements.fogPlanes.forEach((fogPlane, idx) => {
          fogPlane.rotation.z += 0.0012 * (idx % 2 === 0 ? 1 : -1);
          fogPlane.position.y = 0.14 + Math.sin(elapsedTime * 0.7 + idx * 0.8) * 0.035;
          const mat = fogPlane.material as THREE.MeshBasicMaterial;
          mat.opacity = (0.26 + Math.sin(elapsedTime * 0.5 + idx * 0.6) * 0.09) * revealFactor;
        });
      }

      // Animate Volumetric Beam
      if (elements.volumetricBeam) {
        const beamMat = elements.volumetricBeam.material as THREE.MeshBasicMaterial;
        beamMat.opacity = (0.075 + Math.sin(elapsedTime * 0.8) * 0.025) * revealFactor;
      }

      // Dynamic breathing of scene atmospheric fog
      if (scene.fog && scene.fog instanceof THREE.FogExp2) {
        scene.fog.density = 0.032 + Math.sin(elapsedTime * 0.35) * 0.003;
      }

      // Subtle breath pulse on the signature gold ring
      const pulse = Math.sin(elapsedTime * 1.6) * 0.15;
      const baseEmissive = 1.6 * revealFactor;

      // Raycasting hover check
      raycasterRef.current.setFromCamera(mouseVectorRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(elements.interactiveObjects, true);

      const isHovered = intersects.length > 0;
      if (isHovered && !isHoveredRef.current) {
        isHoveredRef.current = true;
        entranceAudio.playGateHover();
      } else if (!isHovered && isHoveredRef.current) {
        isHoveredRef.current = false;
      }

      // Dynamic light response
      const hoverBoost = isHovered ? 0.9 : 0.0;
      (elements.goldRing.material as THREE.MeshStandardMaterial).emissiveIntensity =
        baseEmissive + pulse + hoverBoost;
      elements.ringPointLight.intensity = (2.2 + hoverBoost * 1.2) * revealFactor;

      // Handle forward camera transition when user clicks "BẮT ĐẦU THAM QUAN"
      if (isEntering) {
        if (enterStartTime === 0) enterStartTime = now;
        const enterElapsed = (now - enterStartTime) / 1000;
        const enterNorm = Math.min(enterElapsed / entranceConfig.timings.enterTransitionDuration, 1.0);

        setTransitionProgress(enterNorm);

        // Smooth cubic ease forward push
        const ease = enterNorm < 0.5 ? 4 * enterNorm * enterNorm * enterNorm : 1 - Math.pow(-2 * enterNorm + 2, 3) / 2;
        cameraZ = THREE.MathUtils.lerp(
          entranceConfig.camera.initialPosition[2],
          entranceConfig.camera.forwardTargetZ,
          ease
        );

        // Ring flares during entry
        (elements.goldRing.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.5 + enterNorm * 3.5;
        elements.ringPointLight.intensity = 3.0 + enterNorm * 4.0;

        if (enterNorm >= 1.0 && !enteredFinished) {
          setEnteredFinished(true);
          if (onEnterMuseum) {
            onEnterMuseum();
          }
        }
      }

      // Camera parallax positioning (calm, museum-like)
      camera.position.x = mouseRef.current.x * 0.45;
      camera.position.y = entranceConfig.camera.initialPosition[1] + mouseRef.current.y * 0.25;
      camera.position.z = cameraZ;

      // Camera look direction
      camera.lookAt(
        mouseRef.current.x * 0.15,
        entranceConfig.camera.lookAt[1] + mouseRef.current.y * 0.12,
        0
      );

      renderer.render(scene, camera);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    // 10. Cleanup
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isEntering, enteredFinished, onEnterMuseum, ctaVisible]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FAFBFC] select-none font-sans">
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        onClick={handleEnterGate}
        className="absolute inset-0 cursor-pointer"
        title="Nhấp để tiến vào không gian triển lãm"
      />

      {/* TOP HUD: Project Identity & Audio Controls */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-start justify-between pointer-events-none z-20">
        {/* Left Project Identity with Authentic School Emblem */}
        <div className="flex items-center gap-3 animate-in fade-in duration-1000">
          <div className="w-11 h-11 rounded-xl bg-[#141B30]/90 border border-[#C7A15A]/50 p-1 flex items-center justify-center backdrop-blur-md shadow-xl flex-shrink-0">
            {branding?.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt="Huy hiệu Trường THPT A Trần Hưng Đạo"
                className="w-full h-full object-contain filter drop-shadow"
              />
            ) : (
              <div className="w-full h-full rounded-lg bg-gradient-to-br from-[#1a233a] to-[#0c111e] flex flex-col items-center justify-center text-[#C7A15A] p-0.5">
                <Sparkles className="w-4 h-4 text-[#C7A15A]" />
                <span className="text-[7px] font-bold font-mono tracking-tighter text-[#F3ECDD]">THD</span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#141B30]/80 border border-[#C7A15A]/40 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#C7A15A]" />
              <span className="text-[11px] font-mono tracking-widest text-[#F3ECDD] uppercase">
                {dynamicData.projectTitle || entranceConfig.projectTitle} • {entranceConfig.anniversaryLabel}
              </span>
            </div>
            <div className="text-sm font-semibold tracking-wide text-[#F3ECDD]/90">
              {dynamicData.projectSubtitle || entranceConfig.schoolName}
            </div>
          </div>
        </div>

        {/* Right Controls: Audio Mute & Discreet Help */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={toggleAudio}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141B30]/80 hover:bg-[#141B30] border border-[#C7A15A]/40 text-[#F3ECDD] hover:text-[#C7A15A] transition-all backdrop-blur-md text-xs cursor-pointer shadow-lg"
            title={isMuted ? 'Bật âm thanh không gian' : 'Tắt âm thanh'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-zinc-400" />
                <span className="text-[11px] font-mono text-zinc-400">ÂM THANH: TẮT</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#C7A15A]" />
                <span className="text-[11px] font-mono text-[#C7A15A]">ÂM THANH: BẬT</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* BOTTOM HUD: Physical Museum Entrance CTA */}
      <div
        className={`absolute bottom-12 left-0 right-0 flex flex-col items-center justify-center p-4 transition-all duration-1000 z-20 pointer-events-none ${
          ctaVisible && !isEntering ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="text-center space-y-3 pointer-events-auto">
          {/* Luminous Museum CTA Button */}
          <button
            onClick={handleEnterGate}
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-[#141B30]/85 hover:bg-[#1c2644] border border-[#C7A15A] hover:border-[#ffd988] shadow-2xl shadow-[#C7A15A]/20 transition-all duration-300 backdrop-blur-md cursor-pointer"
          >
            {/* Soft gold glow aura */}
            <div className="absolute inset-0 rounded-2xl bg-[#C7A15A]/10 group-hover:bg-[#C7A15A]/20 transition-colors pointer-events-none" />

            <span className="text-xs sm:text-sm font-bold tracking-widest text-[#F3ECDD] group-hover:text-white uppercase font-serif">
              {dynamicData.guideText || entranceConfig.primaryCtaText}
            </span>
            <ChevronRight className="w-4 h-4 text-[#C7A15A] group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Subtitle instruction */}
          <div className="text-[11px] font-mono tracking-widest text-[#C7A15A]/80 uppercase">
            {entranceConfig.entranceLabel} • NHẤP VÀO CỔNG HOẶC NÚT ĐỂ TIẾN VÀO
          </div>
        </div>
      </div>

      {/* BOTTOM-RIGHT: Discreet CMD Entrance */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-auto">
        <button
          onClick={onOpenCmd}
          className="text-[10px] font-mono text-zinc-600 hover:text-[#C7A15A] px-2 py-1 rounded hover:bg-[#141B30]/60 transition-colors cursor-pointer"
          title="Quản trị hệ thống (CMD)"
        >
          [ CMD ]
        </button>
      </div>

      {/* CINEMATIC TRANSITION OVERLAY: Activates during forward push */}
      <div
        className="absolute inset-0 bg-[#0B1020] pointer-events-none transition-opacity duration-300 z-30 flex flex-col items-center justify-center text-center p-6"
        style={{
          opacity: isEntering ? Math.min(transitionProgress * 1.2, 1.0) : 0,
        }}
      >
        {isEntering && (
          <div className="space-y-4 max-w-md animate-in fade-in duration-700">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#C7A15A] to-[#ffd988] flex items-center justify-center shadow-xl shadow-[#C7A15A]/40 mx-auto">
              <Sparkles className="w-6 h-6 text-[#0B1020]" />
            </div>
            <div className="text-base sm:text-lg font-serif font-bold text-[#F3ECDD] tracking-wider uppercase">
              {dynamicData.projectTitle || entranceConfig.projectTitle}
            </div>
            <div className="text-xs text-[#C7A15A] font-mono tracking-widest">
              ĐANG KẾT NỐI VÀO SẢNH TRIỂN LÃM SỐ (CONNECTING TO MEMORY)...
            </div>
            <div className="text-[11px] text-zinc-400 italic">
              &quot;{dynamicData.tagline || entranceConfig.tagline}&quot;
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
