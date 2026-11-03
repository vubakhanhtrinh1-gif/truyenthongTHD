/**
 * Zone: Chronological Timeline Room (TimelineScene)
 * "DÒNG CHẢY 60 NĂM — 1966–2026"
 * Trường THPT A Trần Hưng Đạo
 *
 * Implements:
 * - Real-time 3D Walkable Gallery with First-Person Controls & Raycasting
 * - Central illuminated timeline ribbon with 18 chronological milestone pylons
 * - 6 navigable chapters from 1966 to 2026
 * - Smooth camera sliding when jumping between chapters or selecting years
 * - Compact interactive milestone detail modal
 * - Return to Main Hall portal & action
 * - Dynamic Cloud Firestore `editorial_contents` integration
 */

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import {
  TIMELINE_ROOM_CONTENT,
  TIMELINE_CHAPTERS,
  TIMELINE_MILESTONES,
  TimelineMilestone,
  TimelineChapter,
} from './config/timelineContentData';
import {
  buildTimelineArchitecture,
  TimelineSceneElements,
} from './components/TimelineArchitecture';
import { createTimelineMaterials } from './materials/TimelineMaterials';
import { timelineAudio } from './audio/TimelineAudio';
import { TimelineMilestoneModal } from './components/TimelineMilestoneModal';
import { useRoomEditorialMap } from '../../services/dynamicContentService';
import {
  Volume2,
  VolumeX,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Calendar,
  Compass,
  CheckCircle2,
  Shield,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  X,
  Layers,
} from 'lucide-react';

interface Props {
  onReturnToLobby: () => void;
  onOpenCmd?: () => void;
  onNavigateDestination?: (roomId: string) => void;
}

export function TimelineScene({
  onReturnToLobby,
  onOpenCmd,
  onNavigateDestination,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const elementsRef = useRef<TimelineSceneElements | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Player position & movement state
  const playerPos = useRef(new THREE.Vector3(0, 1.7, 18.5)); // Starts near South entrance
  const playerVel = useRef(new THREE.Vector3(0, 0, 0));
  const cameraRotation = useRef({ yaw: 0, pitch: 0 });
  const keysDown = useRef<{ [key: string]: boolean }>({});
  const isPointerDown = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  // Smooth camera slide animation state
  const targetCameraPos = useRef<THREE.Vector3 | null>(null);

  // UI state
  const [selectedMilestone, setSelectedMilestone] = useState<TimelineMilestone | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<string>('chap1');
  const [isMuted, setIsMuted] = useState(timelineAudio.getMuted());
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [isNearPortal, setIsNearPortal] = useState(false);
  const [nearbyMilestone, setNearbyMilestone] = useState<TimelineMilestone | null>(null);

  // Dynamic editorial updates from Cloud Firestore
  const { itemsMap: firestoreItems } = useRoomEditorialMap('timeline');

  // Merge base milestone content with real-time Firestore updates
  const milestones: TimelineMilestone[] = useMemo(() => {
    return TIMELINE_MILESTONES.map((item) => {
      const stored = firestoreItems.get(`timeline.${item.id}`) || firestoreItems.get(item.id);
      if (stored) {
        const copy = { ...item };
        if (stored.textValues?.titleVi) copy.titleVi = stored.textValues.titleVi;
        if (stored.textValues?.summaryVi) copy.summaryVi = stored.textValues.summaryVi;
        if (stored.textValues?.detailVi) copy.detailVi = stored.textValues.detailVi;
        if (stored.textValues?.sourceNote) copy.sourceNote = stored.textValues.sourceNote;
        if (stored.attachments && stored.attachments.length > 0) {
          const img = stored.attachments.find((a) => a.type === 'image');
          if (img) copy.customUrl = img.downloadUrl;
        }
        return copy;
      }
      return item;
    });
  }, [firestoreItems]);

  // Audio Toggle
  const toggleAudio = useCallback(() => {
    const muted = timelineAudio.toggleMute();
    setIsMuted(muted);
  }, []);

  // Jump to Chapter
  const handleJumpToChapter = useCallback((chapter: TimelineChapter) => {
    timelineAudio.playChapterSlide();
    setActiveChapterId(chapter.id);
    targetCameraPos.current = new THREE.Vector3(0, 1.7, chapter.focusZ);
  }, []);

  // Jump to Milestone
  const handleSelectMilestone = useCallback((milestone: TimelineMilestone) => {
    timelineAudio.playMilestoneSelect();
    setSelectedMilestone(milestone);
    setActiveChapterId(milestone.chapterId);

    // Position camera just in front of the milestone facing it
    const isLeft = milestone.side === 'left';
    targetCameraPos.current = new THREE.Vector3(
      isLeft ? -1.8 : 1.8,
      1.7,
      milestone.positionZ + 1.2
    );
  }, []);

  // Navigate Modal Previous / Next
  const handleModalNext = useCallback(() => {
    if (!selectedMilestone) return;
    const currentIndex = milestones.findIndex((m) => m.id === selectedMilestone.id);
    if (currentIndex < milestones.length - 1) {
      handleSelectMilestone(milestones[currentIndex + 1]);
    }
  }, [selectedMilestone, milestones, handleSelectMilestone]);

  const handleModalPrev = useCallback(() => {
    if (!selectedMilestone) return;
    const currentIndex = milestones.findIndex((m) => m.id === selectedMilestone.id);
    if (currentIndex > 0) {
      handleSelectMilestone(milestones[currentIndex - 1]);
    }
  }, [selectedMilestone, milestones, handleSelectMilestone]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    timelineAudio.ensureRunning();

    // 1. Scene setup: Warm Archival Ivory / Amber atmosphere
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x28221B); // Warm archival amber-charcoal depth
    scene.fog = new THREE.Fog(0x28221B, 28, 54);
    sceneRef.current = scene;

    // 2. Camera setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(58, width / height, 0.1, 70);
    camera.position.copy(playerPos.current);
    cameraRef.current = camera;

    // 3. WebGL Renderer with ACES Tone Mapping
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

    // 4. Base Lighting Baseline: Warm Ivory Ambient (0xFFF8EE) + Champagne Key Light (0xFFF1D8)
    const ambientLight = new THREE.AmbientLight(0xFFF8EE, 1.15);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xFFF1D6, 0x423224, 0.95);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xFFF1D8, 1.25);
    dirLight.position.set(4, 14, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.0003;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xFFEED6, 0.65);
    fillLight.position.set(-5, 11, -8);
    scene.add(fillLight);

    // 5. Build 3D Timeline Gallery Architecture
    const materials = createTimelineMaterials();
    const elements = buildTimelineArchitecture(materials);
    scene.add(elements.masterGroup);
    elementsRef.current = elements;

    // 6. Keyboard & Mouse Movement Listeners
    const clearKeys = () => {
      keysDown.current = {};
      playerVel.current.set(0, 0, 0);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      const code = e.code;
      const key = e.key ? e.key.toLowerCase() : '';
      if (code) keysDown.current[code] = true;
      if (key) keysDown.current[key] = true;

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(code)) {
        e.preventDefault();
      }

      timelineAudio.ensureRunning();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const code = e.code;
      const key = e.key ? e.key.toLowerCase() : '';
      if (code) keysDown.current[code] = false;
      if (key) keysDown.current[key] = false;
    };

    const handleWindowBlur = () => {
      clearKeys();
      isPointerDown.current = false;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearKeys();
        isPointerDown.current = false;
      }
    };

    const handlePointerLockChange = () => {
      if (document.pointerLockElement !== renderer.domElement) {
        clearKeys();
        isPointerDown.current = false;
      }
    };

    let pointerDownPos = { x: 0, y: 0 };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isPointerDown.current = true;
      timelineAudio.ensureRunning();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      lastPointer.current = { x: clientX, y: clientY };
      pointerDownPos = { x: clientX, y: clientY };
    };

    const handleClick = (e: MouseEvent) => {
      const dx = Math.abs(e.clientX - pointerDownPos.x);
      const dy = Math.abs(e.clientY - pointerDownPos.y);
      if (dx > 6 || dy > 6) return; // Ignore drag moves

      const rect = container.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(elements.interactiveMeshes, true);

      if (intersects.length > 0) {
        let cur: THREE.Object3D | null = intersects[0].object;
        while (cur && cur !== scene) {
          if (cur.userData?.type === 'milestone') {
            const m = cur.userData.milestone as TimelineMilestone;
            handleSelectMilestone(m);
            return;
          }
          if (cur.userData?.type === 'portal_return') {
            timelineAudio.playDoorReturn();
            onReturnToLobby();
            return;
          }
          cur = cur.parent;
        }
      }
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const isLocked = document.pointerLockElement === renderer.domElement;
      let deltaX = 0;
      let deltaY = 0;

      if (isLocked && 'movementX' in e) {
        deltaX = (e as MouseEvent).movementX || 0;
        deltaY = (e as MouseEvent).movementY || 0;
      } else if (isPointerDown.current) {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
        deltaX = clientX - lastPointer.current.x;
        deltaY = clientY - lastPointer.current.y;
        lastPointer.current = { x: clientX, y: clientY };
      } else {
        return;
      }

      // Sensitivity: In Three.js 'YXZ' convention, pitch rotates around camera local X axis.
      // Moving mouse upward (deltaY < 0 or movementY < 0) subtracts a negative, increasing pitch (looks up).
      // Moving mouse downward (deltaY > 0 or movementY > 0) subtracts a positive, decreasing pitch (looks down).
      cameraRotation.current.yaw -= deltaX * 0.0028;
      cameraRotation.current.pitch = Math.max(-0.75, Math.min(0.75, cameraRotation.current.pitch - deltaY * 0.0022));

      // Cancel target glide on manual user look
      targetCameraPos.current = null;
    };

    const handlePointerUp = () => {
      isPointerDown.current = false;
    };

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('click', handleClick);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);
    window.addEventListener('resize', handleResize);

    // 7. Animation Loop
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      animFrameRef.current = requestAnimationFrame(animate);

      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Smooth camera position interpolation when jumping to a chapter or milestone
      if (targetCameraPos.current) {
        playerPos.current.lerp(targetCameraPos.current, delta * 3.5);
        if (playerPos.current.distanceTo(targetCameraPos.current) < 0.05) {
          playerPos.current.copy(targetCameraPos.current);
          targetCameraPos.current = null;
        }
      } else {
        // First-person WASD / Arrow movement with dual code+key resilience
        const speed = 4.2;
        const moveVec = new THREE.Vector3();

        const isForward = !!(keysDown.current['KeyW'] || keysDown.current['w'] || keysDown.current['ArrowUp'] || keysDown.current['arrowup']);
        const isBackward = !!(keysDown.current['KeyS'] || keysDown.current['s'] || keysDown.current['ArrowDown'] || keysDown.current['arrowdown']);
        const isLeft = !!(keysDown.current['KeyA'] || keysDown.current['a'] || keysDown.current['ArrowLeft'] || keysDown.current['arrowleft']);
        const isRight = !!(keysDown.current['KeyD'] || keysDown.current['d'] || keysDown.current['ArrowRight'] || keysDown.current['arrowright']);

        if (isForward) moveVec.z -= 1;
        if (isBackward) moveVec.z += 1;
        if (isLeft) moveVec.x -= 1;
        if (isRight) moveVec.x += 1;

        if (moveVec.lengthSq() > 0) {
          moveVec.normalize();
          moveVec.applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraRotation.current.yaw);
          playerVel.current.copy(moveVec).multiplyScalar(speed * delta);
          playerPos.current.add(playerVel.current);

          // Room boundary collision clamping (Width: 16m, Length: 42m)
          playerPos.current.x = Math.max(-6.2, Math.min(6.2, playerPos.current.x));
          playerPos.current.z = Math.max(-18.5, Math.min(19.2, playerPos.current.z));
        }
      }

      // Update Camera Transform using robust 'YXZ' Euler orientation (yaw around world Y, pitch around local X)
      camera.position.set(playerPos.current.x, 1.7, playerPos.current.z);
      const euler = new THREE.Euler(cameraRotation.current.pitch, cameraRotation.current.yaw, 0, 'YXZ');
      camera.quaternion.setFromEuler(euler);

      // Check proximity to South entrance portal
      const distToPortal = playerPos.current.distanceTo(new THREE.Vector3(0, 1.7, 19.5));
      setIsNearPortal(distToPortal < 3.2);

      // Check proximity to nearest milestone
      let closestMilestone: TimelineMilestone | null = null;
      let minDistance = 3.2;

      milestones.forEach((m) => {
        const pX = m.side === 'left' ? -3.8 : 3.8;
        const dist = playerPos.current.distanceTo(new THREE.Vector3(pX, 1.7, m.positionZ));
        if (dist < minDistance) {
          minDistance = dist;
          closestMilestone = m;
        }
      });
      setNearbyMilestone(closestMilestone);

      // Dynamically highlight active chapter based on Z position
      const curZ = playerPos.current.z;
      if (curZ >= 11) setActiveChapterId('chap1');
      else if (curZ >= 5) setActiveChapterId('chap2');
      else if (curZ >= -0.5) setActiveChapterId('chap3');
      else if (curZ >= -6.5) setActiveChapterId('chap4');
      else if (curZ >= -12.5) setActiveChapterId('chap5');
      else setActiveChapterId('chap6');

      // Animate celestial glowing star particles drifting along the River of Time
      if (elements.riverParticles && elements.riverParticlePos) {
        const pos = elements.riverParticlePos;
        const count = pos.length / 3;
        for (let p = 0; p < count; p++) {
          pos[p * 3 + 2] -= delta * 1.8; // Drifting along the river toward the North finale
          if (pos[p * 3 + 2] < -19.0) {
            pos[p * 3 + 2] = 19.0;
            pos[p * 3] = (Math.random() - 0.5) * 3.1;
          }
          // Delicate water ripple undulating bobbing
          pos[p * 3 + 1] = 0.024 + Math.sin(currentTime * 0.0025 + p) * 0.012;
        }
        elements.riverParticles.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('resize', handleResize);

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [milestones, handleSelectMilestone, onReturnToLobby]);

  // Reset keys and activeElement when modals close to prevent stuck focus
  useEffect(() => {
    if (!selectedMilestone && !helpModalOpen) {
      keysDown.current = {};
      playerVel.current.set(0, 0, 0);
      if (document.activeElement && (document.activeElement as HTMLElement).blur) {
        (document.activeElement as HTMLElement).blur();
      }
    }
  }, [selectedMilestone, helpModalOpen]);

  // Milestone modal navigation indices
  const currentMilestoneIndex = selectedMilestone
    ? milestones.findIndex((m) => m.id === selectedMilestone.id)
    : -1;
  const hasNext = currentMilestoneIndex >= 0 && currentMilestoneIndex < milestones.length - 1;
  const hasPrev = currentMilestoneIndex > 0;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#1B212D] select-none font-sans">
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        title="Kéo chuột để quan sát • Phím W A S D để bước đi dọc trục Dòng Thời Gian"
      />

      {/* TOP HUD: Title, Return to Lobby, Sound & Help Controls */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-start justify-between pointer-events-none z-20">
        {/* Left: Room Identity */}
        <div className="flex items-center gap-3.5 pointer-events-auto">
          <button
            onClick={() => {
              timelineAudio.playDoorReturn();
              onReturnToLobby();
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#141B30]/90 hover:bg-[#141B30] border border-[#CBA45B]/60 hover:border-[#CBA45B] text-[#F0E7D6] hover:text-[#F4D58B] transition-all backdrop-blur-md shadow-xl text-xs cursor-pointer group font-serif"
            title="Trở về Sảnh Chính Di Sản"
          >
            <ArrowLeft className="w-4 h-4 text-[#CBA45B] group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-semibold hidden sm:inline">VỀ SẢNH CHÍNH</span>
          </button>

          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#141B30]/85 border border-[#CBA45B]/40 backdrop-blur-md">
              <Compass className="w-3 h-3 text-[#CBA45B]" />
              <span className="text-[10px] font-mono tracking-widest text-[#F4D58B] uppercase">
                TRỤC BIÊN NIÊN SỬ 3D
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-serif font-bold tracking-wide text-[#F0E7D6] leading-tight">
              {TIMELINE_ROOM_CONTENT.titleVi}
            </h1>
            <p className="text-[11px] text-[#CBA45B] italic hidden sm:block">
              {TIMELINE_ROOM_CONTENT.schoolNameVi} • 60 Năm Di Sản & Tự Hào
            </p>
          </div>
        </div>

        {/* Right: Sound, Guide & CMD */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {onOpenCmd && (
            <button
              onClick={onOpenCmd}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0B1020]/80 hover:bg-[#0B1020] border border-[#CBA45B]/40 text-[#F4D58B] text-xs font-mono backdrop-blur-md shadow-lg cursor-pointer transition-all"
              title="Quản lý tư liệu dòng thời gian"
            >
              <Shield className="w-4 h-4 text-[#CBA45B]" />
              <span className="hidden md:inline">CMD</span>
            </button>
          )}

          <button
            onClick={() => setHelpModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#141B30]/80 hover:bg-[#141B30] border border-[#CBA45B]/40 text-[#F0E7D6] hover:text-[#F4D58B] text-xs backdrop-blur-md shadow-lg cursor-pointer transition-all"
            title="Hướng dẫn tham quan & điều khiển"
          >
            <HelpCircle className="w-4 h-4 text-[#CBA45B]" />
            <span className="hidden sm:inline">HƯỚNG DẪN</span>
          </button>

          <button
            onClick={toggleAudio}
            className="p-2 rounded-xl bg-[#141B30]/80 hover:bg-[#141B30] border border-[#CBA45B]/40 text-[#F0E7D6] hover:text-[#F4D58B] backdrop-blur-md shadow-lg cursor-pointer transition-all"
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-zinc-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#CBA45B]" />
            )}
          </button>
        </div>
      </div>

      {/* BOTTOM CONTROLS: 6 CHRONOLOGICAL CHAPTER NAVIGATION PILLS */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-auto max-w-[94vw] w-full sm:w-auto">
        <div className="p-2 rounded-2xl bg-[#101728]/90 border border-[#CBA45B]/40 shadow-2xl backdrop-blur-xl flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto scrollbar-none">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 text-[11px] font-mono text-[#CBA45B] border-r border-[#CBA45B]/30 mr-1 flex-shrink-0">
            <Layers className="w-3.5 h-3.5" />
            <span>6 THỜI KỲ:</span>
          </div>

          {TIMELINE_CHAPTERS.map((chap) => {
            const isActive = activeChapterId === chap.id;
            return (
              <button
                key={chap.id}
                onClick={() => handleJumpToChapter(chap)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#CBA45B] to-[#F4D58B] text-[#0B1020] font-bold shadow-md scale-105'
                    : 'bg-[#141B30]/70 hover:bg-[#141B30] text-zinc-300 hover:text-white border border-transparent hover:border-[#CBA45B]/30'
                }`}
                title={chap.titleVi}
              >
                <span className="font-bold">{chap.period}</span>
                <span className="hidden xl:inline text-[10px] opacity-80 truncate max-w-[120px]">
                  • {chap.titleVi}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PROXIMITY TOOLTIP NOTIFICATIONS */}
      {/* 1. Portal return prompt */}
      {isNearPortal && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-auto animate-in fade-in duration-200">
          <div className="p-3 px-5 rounded-2xl bg-[#141B30]/95 border-2 border-[#CBA45B] shadow-2xl backdrop-blur-md text-center space-y-1.5 max-w-xs">
            <span className="text-[10px] font-mono uppercase text-[#F4D58B] tracking-wider">
              CỔNG KẾT NỐI KHÔNG GIAN
            </span>
            <h4 className="text-sm font-bold text-[#F0E7D6]">SẢNH CHÍNH DI SẢN</h4>
            <button
              onClick={() => {
                timelineAudio.playDoorReturn();
                onReturnToLobby();
              }}
              className="mt-1 w-full py-1.5 px-3 rounded-xl text-xs font-bold text-[#0B1020] bg-gradient-to-r from-[#CBA45B] to-[#F4D58B] hover:from-[#F4D58B] hover:to-[#CBA45B] transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>BƯỚC VÀO SẢNH</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Approaching Milestone Notification */}
      {nearbyMilestone && !selectedMilestone && !isNearPortal && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-auto animate-in fade-in duration-200">
          <div
            onClick={() => handleSelectMilestone(nearbyMilestone)}
            className="p-3 px-5 rounded-2xl bg-[#141B30]/95 border-2 border-[#CBA45B] shadow-2xl backdrop-blur-md text-center space-y-1 max-w-sm cursor-pointer hover:border-[#F4D58B] transition-all group"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-mono font-bold text-[#F4D58B] px-2 py-0.5 rounded bg-[#0B1020] border border-[#CBA45B]/40">
                MỐC SON {nearbyMilestone.year}
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-serif font-bold text-[#F0E7D6] group-hover:text-[#F4D58B] transition-colors line-clamp-1">
              {nearbyMilestone.titleVi}
            </h4>
            <p className="text-[11px] text-zinc-300 font-sans italic line-clamp-1">
              « {nearbyMilestone.summaryVi} »
            </p>
            <span className="text-[10px] font-mono text-[#CBA45B] block pt-0.5">
              ✦ Nhấp để mở hồ sơ tư liệu chi tiết ✦
            </span>
          </div>
        </div>
      )}

      {/* INTERACTIVE MODAL FOR SELECTED MILESTONE */}
      <TimelineMilestoneModal
        milestone={selectedMilestone}
        onClose={() => setSelectedMilestone(null)}
        onNavigateNext={handleModalNext}
        onNavigatePrev={handleModalPrev}
        hasNext={hasNext}
        hasPrev={hasPrev}
      />

      {/* VISITOR HELP GUIDE MODAL */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#141B30]/95 border-2 border-[#CBA45B] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5 text-[#F0E7D6]">
            <div className="flex items-center justify-between pb-3 border-b border-[#CBA45B]/30">
              <div className="flex items-center gap-2 text-[#F4D58B]">
                <BookOpen className="w-5 h-5" />
                <h3 className="font-serif font-bold text-base uppercase tracking-wider">
                  CẨM NANG THAM QUAN BIÊN NIÊN SỬ
                </h3>
              </div>
              <button
                onClick={() => setHelpModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-zinc-300 leading-relaxed font-sans">
              <div className="p-3 rounded-xl bg-[#0B1020]/70 border border-zinc-800 space-y-1">
                <span className="font-mono font-bold text-[#F4D58B]">DI CHUYỂN DỌC TRỤC THỜI GIAN</span>
                <p>
                  Sử dụng phím <strong>W, A, S, D</strong> hoặc <strong>Phím Mũi Tên</strong> để bước đi dọc theo dải ruy-băng hoàng kim 60 năm.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0B1020]/70 border border-zinc-800 space-y-1">
                <span className="font-mono font-bold text-[#F4D58B]">QUAN SÁT 360 ĐỘ</span>
                <p>
                  Nhấp giữ và kéo chuột (hoặc vuốt cảm ứng trên điện thoại) để xoay chuyển góc nhìn toàn cảnh phòng triển lãm.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0B1020]/70 border border-zinc-800 space-y-1">
                <span className="font-mono font-bold text-[#F4D58B]">TƯƠNG TÁC XEM MỐC LỊCH SỬ</span>
                <p>
                  Nhấp trực tiếp vào bất kỳ đài mốc son nào hoặc nhấp vào thanh chọn 6 Thời kỳ ở dưới đáy màn hình để mở hồ sơ tư liệu đã được xác thực 100%.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0B1020]/70 border border-zinc-800 space-y-1">
                <span className="font-mono font-bold text-[#F4D58B]">QUAY LẠI SẢNH CHÍNH</span>
                <p>
                  Quay người về phía sau (hướng Nam) và tiến vào cổng vòm, hoặc nhấp nút <strong>VỀ SẢNH CHÍNH</strong> ở góc trên bên trái.
                </p>
              </div>
            </div>

            <button
              onClick={() => setHelpModalOpen(false)}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-[#0B1020] bg-gradient-to-r from-[#CBA45B] to-[#F4D58B] hover:from-[#F4D58B] hover:to-[#CBA45B] transition-all cursor-pointer font-serif"
            >
              ĐÃ HIỂU • BẮT ĐẦU TRẢI NGHIỆM
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
