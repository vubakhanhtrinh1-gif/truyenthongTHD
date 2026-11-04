/**
 * Zone: Gratitude & Memories Room (MemoryScene)
 * "PHÒNG TRI ÂN & KÝ ỨC" — TRƯỜNG THPT A TRẦN HƯNG ĐẠO
 *
 * High-Fidelity Reference-Based Architecture (image_bcc828e9.png):
 * - Closely spaced parallel warm natural wood ceiling slats with recessed spotlights
 * - Light natural oak wood plank floor with neutral woven linen rug
 * - Honed warm light-gray / beige sandstone walls with horizontal reveal shadow grooves (SOLID - no glass/outdoor forest)
 * - Continuous horizontal honey-oak display band mounted at eye level
 * - Dark graphite section header blocks ("Path of Challenge" architectural style)
 * - Slim dark-metal framed photographic displays
 * - Wall 3 Grand Dedication Monument ("TRI ÂN NHỮNG NGƯỜI LÁI ĐÒ")
 * - Wall 4 Entrance portal leading back to Main Hall
 * - Minimalist black steel frame benches with segmented leather cushions
 *
 * Controls & Physics:
 * - Robust 'YXZ' Euler camera rotation (non-inverted vertical mouse look: up looks up, down looks down)
 * - Resilient keyboard movement with window blur / visibilitychange / keyup safety to prevent stuck keys
 * - Dynamic Cloud Firestore `editorial_contents` integration
 */

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import {
  MEMORY_ROOM_CONTENT,
  INITIAL_GRATITUDE_ESSAY,
  INITIAL_ENTRANCE_INTRO,
  INITIAL_TEACHERS,
  INITIAL_MOMENTS,
  TeacherItem,
  MomentItem,
  GratitudeEssayData,
  EntranceIntroData,
} from './config/memoryContentData';
import {
  buildMemoryArchitecture,
  MemorySceneElements,
  updateMemoryArchitectureContent,
} from './components/MemoryArchitecture';
import {
  createMemoryMaterials,
  MemoryMaterialSet,
} from './materials/MemoryMaterials';
import { memoryAudio } from './audio/MemoryAudio';
import { PhotoDetailModal } from './components/PhotoDetailModal';
import { EssayReadingModal } from './components/EssayReadingModal';
import { useRoomEditorialMap } from '../../services/dynamicContentService';
import {
  Volume2,
  VolumeX,
  ArrowLeft,
  Compass,
  Shield,
  HelpCircle,
  ChevronRight,
  Heart,
  X,
  BookOpen,
} from 'lucide-react';

interface Props {
  onReturnToLobby: () => void;
  onOpenCmd?: () => void;
  onNavigateDestination?: (roomId: string) => void;
}

export function MemoryScene({
  onReturnToLobby,
  onOpenCmd,
  onNavigateDestination,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const elementsRef = useRef<MemorySceneElements | null>(null);
  const materialsRef = useRef<MemoryMaterialSet | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Player position & movement state
  // Spawns near South entrance at z = +9.5m facing North directly toward Wall 3
  const playerPos = useRef(new THREE.Vector3(0, 1.7, 9.5));
  const playerVel = useRef(new THREE.Vector3(0, 0, 0));
  const cameraRotation = useRef({ yaw: 0, pitch: 0 });
  const keysDown = useRef<{ [key: string]: boolean }>({});
  const isPointerDown = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  // UI state
  const [selectedItem, setSelectedItem] = useState<TeacherItem | MomentItem | null>(null);
  const [selectedType, setSelectedType] = useState<'teacher' | 'moment' | null>(null);
  const [isEssayModalOpen, setIsEssayModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(memoryAudio.getMuted());
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [isNearPortal, setIsNearPortal] = useState(false);
  const [isNearEssay, setIsNearEssay] = useState(false);

  // Clear keys helper
  const clearKeys = useCallback(() => {
    keysDown.current = {};
    playerVel.current.set(0, 0, 0);
  }, []);

  // Clear keys whenever any modal opens
  useEffect(() => {
    if (selectedItem || isEssayModalOpen || helpModalOpen) {
      clearKeys();
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
    }
  }, [selectedItem, isEssayModalOpen, helpModalOpen, clearKeys]);

  // Dynamic editorial updates from Cloud Firestore
  const { itemsMap: firestoreItems } = useRoomEditorialMap('memory');

  // Merge Gratitude Essay with Firestore updates
  const gratitudeEssay: GratitudeEssayData = useMemo(() => {
    const base = { ...INITIAL_GRATITUDE_ESSAY };
    const stored = firestoreItems.get('memory.gratitude_essay');
    if (stored?.textValues) {
      if (stored.textValues.title) base.title = stored.textValues.title;
      if (stored.textValues.subtitle) base.subtitle = stored.textValues.subtitle;
      if (stored.textValues.paragraphs) {
        if (Array.isArray(stored.textValues.paragraphs)) {
          base.paragraphs = stored.textValues.paragraphs;
        } else if (typeof stored.textValues.paragraphs === 'string') {
          base.paragraphs = stored.textValues.paragraphs.split('\n\n').filter(Boolean);
        }
      }
      if (stored.textValues.closing) base.closing = stored.textValues.closing;
      if (stored.textValues.signoff) base.signoff = stored.textValues.signoff;
    }
    return base;
  }, [firestoreItems]);

  // Merge Entrance Intro with Firestore updates
  const entranceIntro: EntranceIntroData = useMemo(() => {
    const base = { ...INITIAL_ENTRANCE_INTRO };
    const stored = firestoreItems.get('memory.entrance_intro');
    if (stored?.textValues) {
      if (stored.textValues.roomTitleVi) base.roomTitleVi = stored.textValues.roomTitleVi;
      if (stored.textValues.headingVi) base.headingVi = stored.textValues.headingVi;
      if (stored.textValues.introParagraph) base.introParagraph = stored.textValues.introParagraph;
      if (stored.textValues.mottoVi) base.mottoVi = stored.textValues.mottoVi;
    }
    return base;
  }, [firestoreItems]);

  // Merge Wall 1 Heading (Teachers Section) with Firestore updates
  const { wall1Title, wall1Subtitle } = useMemo(() => {
    let title = MEMORY_ROOM_CONTENT.wall1Title;
    let subtitle = MEMORY_ROOM_CONTENT.wall1Subtitle;
    const stored = firestoreItems.get('memory.teachers_intro');
    if (stored?.textValues?.title) title = stored.textValues.title;
    if (stored?.textValues?.subtitle) subtitle = stored.textValues.subtitle;
    return { wall1Title: title, wall1Subtitle: subtitle };
  }, [firestoreItems]);

  // Merge Wall 2 Heading (Moments Section) with Firestore updates
  const { wall2Title, wall2Subtitle } = useMemo(() => {
    let title = MEMORY_ROOM_CONTENT.wall2Title;
    let subtitle = MEMORY_ROOM_CONTENT.wall2Subtitle;
    const stored = firestoreItems.get('memory.moments_intro');
    if (stored?.textValues?.title) title = stored.textValues.title;
    if (stored?.textValues?.subtitle) subtitle = stored.textValues.subtitle;
    return { wall2Title: title, wall2Subtitle: subtitle };
  }, [firestoreItems]);

  // Merge Tribute Overview with Firestore updates
  const tributeOverview = useMemo(() => {
    let titleVi = 'KÝ ỨC THỜI GIAN – TRI ÂN THẦY CÔ';
    let prologueVi =
      'Dành trọn tấm lòng biết ơn sâu sắc tới các thầy cô giáo lão thành, những người đã gieo mầm tri thức dưới mưa bom bão đạn và thắp sáng tương lai của bao thế hệ học sinh.';
    const stored = firestoreItems.get('memory.tribute_overview');
    if (stored?.textValues?.titleVi) titleVi = stored.textValues.titleVi;
    if (stored?.textValues?.prologueVi) prologueVi = stored.textValues.prologueVi;
    return { titleVi, prologueVi };
  }, [firestoreItems]);

  // Merge Teachers Gallery with Firestore updates
  const teachers: TeacherItem[] = useMemo(() => {
    return INITIAL_TEACHERS.map((t) => {
      const stored = firestoreItems.get(`memory.${t.id}`) || firestoreItems.get(t.id);
      if (stored) {
        const copy = { ...t };
        if (stored.textValues?.title) copy.title = stored.textValues.title;
        if (stored.textValues?.teacherName) copy.teacherName = stored.textValues.teacherName;
        if (stored.textValues?.role) copy.role = stored.textValues.role;
        if (stored.textValues?.period) copy.period = stored.textValues.period;
        if (stored.textValues?.bio) copy.bio = stored.textValues.bio;
        if (stored.attachments && stored.attachments.length > 0) {
          const img = stored.attachments.find((a) => a.type === 'image');
          if (img) copy.customUrl = img.downloadUrl;
        }
        return copy;
      }
      return t;
    });
  }, [firestoreItems]);

  // Merge Moments Gallery with Firestore updates
  const moments: MomentItem[] = useMemo(() => {
    return INITIAL_MOMENTS.map((m) => {
      const stored = firestoreItems.get(`memory.${m.id}`) || firestoreItems.get(m.id);
      if (stored) {
        const copy = { ...m };
        if (stored.textValues?.title) copy.title = stored.textValues.title;
        if (stored.textValues?.caption) copy.caption = stored.textValues.caption;
        if (stored.textValues?.schoolYear) copy.schoolYear = stored.textValues.schoolYear;
        if (stored.textValues?.category) copy.category = stored.textValues.category;
        if (stored.textValues?.story) copy.story = stored.textValues.story;
        if (stored.attachments && stored.attachments.length > 0) {
          const img = stored.attachments.find((a) => a.type === 'image');
          if (img) copy.customUrl = img.downloadUrl;
        }
        return copy;
      }
      return m;
    });
  }, [firestoreItems]);

  // Current mutable data references for interaction & live texture updating
  const teachersRef = useRef<TeacherItem[]>(teachers);
  const momentsRef = useRef<MomentItem[]>(moments);
  const gratitudeEssayRef = useRef<GratitudeEssayData>(gratitudeEssay);
  const entranceIntroRef = useRef<EntranceIntroData>(entranceIntro);
  const wall1TitleRef = useRef<string>(wall1Title);
  const wall1SubtitleRef = useRef<string>(wall1Subtitle);
  const wall2TitleRef = useRef<string>(wall2Title);
  const wall2SubtitleRef = useRef<string>(wall2Subtitle);

  // Keep selected modal item synchronized with real-time updates
  useEffect(() => {
    if (!selectedItem || !selectedType) return;
    if (selectedType === 'teacher') {
      const updated = teachers.find((t) => t.id === selectedItem.id);
      if (updated && updated !== selectedItem) {
        setSelectedItem(updated);
      }
    } else {
      const updated = moments.find((m) => m.id === selectedItem.id);
      if (updated && updated !== selectedItem) {
        setSelectedItem(updated);
      }
    }
  }, [teachers, moments, selectedItem, selectedType]);

  // Audio Toggle
  const toggleAudio = useCallback(() => {
    const muted = memoryAudio.toggleMute();
    setIsMuted(muted);
  }, []);

  // Modal navigation handlers
  const handleModalNext = useCallback(() => {
    if (!selectedItem || !selectedType) return;
    if (selectedType === 'teacher') {
      const idx = teachers.findIndex((t) => t.id === selectedItem.id);
      if (idx < teachers.length - 1) {
        setSelectedItem(teachers[idx + 1]);
        memoryAudio.playPhotoInspect();
      }
    } else {
      const idx = moments.findIndex((m) => m.id === selectedItem.id);
      if (idx < moments.length - 1) {
        setSelectedItem(moments[idx + 1]);
        memoryAudio.playPhotoInspect();
      }
    }
  }, [selectedItem, selectedType, teachers, moments]);

  const handleModalPrev = useCallback(() => {
    if (!selectedItem || !selectedType) return;
    if (selectedType === 'teacher') {
      const idx = teachers.findIndex((t) => t.id === selectedItem.id);
      if (idx > 0) {
        setSelectedItem(teachers[idx - 1]);
        memoryAudio.playPhotoInspect();
      }
    } else {
      const idx = moments.findIndex((m) => m.id === selectedItem.id);
      if (idx > 0) {
        setSelectedItem(moments[idx - 1]);
        memoryAudio.playPhotoInspect();
      }
    }
  }, [selectedItem, selectedType, teachers, moments]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    memoryAudio.ensureRunning();

    // 1. Scene setup: warm modern gallery lighting matching reference
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1B1E22);
    scene.fog = new THREE.Fog(0x1B1E22, 22, 42);
    sceneRef.current = scene;

    // 2. Camera setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 60);
    camera.position.copy(playerPos.current);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting: Ambient fill and key directional gallery light
    const ambientLight = new THREE.AmbientLight(0xFFF9F0, 0.95);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xFFF4DE, 0x2A2218, 0.85);
    scene.add(hemiLight);

    const mainKey = new THREE.DirectionalLight(0xFFF4DE, 1.1);
    mainKey.position.set(0, 9, 3);
    mainKey.castShadow = true;
    mainKey.shadow.mapSize.width = 1024;
    mainKey.shadow.mapSize.height = 1024;
    scene.add(mainKey);

    // 5. Build 3D Architecture
    const materials = createMemoryMaterials(
      gratitudeEssayRef.current,
      entranceIntroRef.current,
      wall1TitleRef.current,
      wall1SubtitleRef.current,
      wall2TitleRef.current,
      wall2SubtitleRef.current
    );
    materialsRef.current = materials;

    const elements = buildMemoryArchitecture(materials, teachersRef.current, momentsRef.current);
    scene.add(elements.masterGroup);
    elementsRef.current = elements;

    // 6. User Input Listeners (Resilient keyboard tracking & corrected mouse look)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keystrokes when typing in inputs/textareas
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      keysDown.current[e.code] = true;
      if (e.key) keysDown.current[e.key.toLowerCase()] = true;
      memoryAudio.ensureRunning();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysDown.current[e.code] = false;
      if (e.key) keysDown.current[e.key.toLowerCase()] = false;
    };

    let pointerDownPos = { x: 0, y: 0 };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isPointerDown.current = true;
      memoryAudio.ensureRunning();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
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
          if (cur.userData?.type === 'teacher') {
            const initialTeacher = cur.userData.teacher as TeacherItem;
            const freshTeacher =
              teachersRef.current.find((t) => t.id === (cur?.userData?.teacherId || initialTeacher.id)) ||
              initialTeacher;
            setSelectedItem(freshTeacher);
            setSelectedType('teacher');
            memoryAudio.playPhotoInspect();
            return;
          }
          if (cur.userData?.type === 'moment') {
            const initialMoment = cur.userData.moment as MomentItem;
            const freshMoment =
              momentsRef.current.find((m) => m.id === (cur?.userData?.momentId || initialMoment.id)) ||
              initialMoment;
            setSelectedItem(freshMoment);
            setSelectedType('moment');
            memoryAudio.playPhotoInspect();
            return;
          }
          if (cur.userData?.type === 'essay') {
            setIsEssayModalOpen(true);
            memoryAudio.playEssayInspect();
            return;
          }
          if (cur.userData?.type === 'portal_return') {
            memoryAudio.playDoorReturn();
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

      // Vertical Mouse Look:
      // In Three.js 'YXZ' Euler convention, moving mouse upward (deltaY < 0 or movementY < 0)
      // subtracts negative deltaY, increasing pitch, which tilts the camera UP toward the ceiling.
      // Moving mouse downward (deltaY > 0 or movementY > 0) decreases pitch, tilting DOWN toward the floor.
      cameraRotation.current.yaw -= deltaX * 0.0028;
      cameraRotation.current.pitch = Math.max(
        -0.75,
        Math.min(0.75, cameraRotation.current.pitch - deltaY * 0.0022)
      );
    };

    const handlePointerUp = () => {
      isPointerDown.current = false;
    };

    // Clean up stuck keys on window blur or visibility change
    const handleBlur = () => {
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
      if (!document.pointerLockElement) {
        clearKeys();
      }
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
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('pointerlockchange', handlePointerLockChange);

    renderer.domElement.addEventListener('mousedown', handlePointerDown);
    renderer.domElement.addEventListener('click', handleClick);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    renderer.domElement.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);
    window.addEventListener('resize', handleResize);

    // 7. Animation Loop
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      animFrameRef.current = requestAnimationFrame(animate);

      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // First-person WASD / Arrow movement with dual code+key resilience
      const speed = 4.2;
      const moveVec = new THREE.Vector3();

      const isForward = !!(
        keysDown.current['KeyW'] ||
        keysDown.current['w'] ||
        keysDown.current['ArrowUp'] ||
        keysDown.current['arrowup']
      );
      const isBackward = !!(
        keysDown.current['KeyS'] ||
        keysDown.current['s'] ||
        keysDown.current['ArrowDown'] ||
        keysDown.current['arrowdown']
      );
      const isLeft = !!(
        keysDown.current['KeyA'] ||
        keysDown.current['a'] ||
        keysDown.current['ArrowLeft'] ||
        keysDown.current['arrowleft']
      );
      const isRight = !!(
        keysDown.current['KeyD'] ||
        keysDown.current['d'] ||
        keysDown.current['ArrowRight'] ||
        keysDown.current['arrowright']
      );

      if (isForward) moveVec.z -= 1;
      if (isBackward) moveVec.z += 1;
      if (isLeft) moveVec.x -= 1;
      if (isRight) moveVec.x += 1;

      if (moveVec.lengthSq() > 0) {
        moveVec.normalize();
        moveVec.applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraRotation.current.yaw);
        playerVel.current.copy(moveVec).multiplyScalar(speed * delta);
        playerPos.current.add(playerVel.current);

        // Room boundary collision clamping (Width: 18m, Length: 24m)
        playerPos.current.x = Math.max(-7.8, Math.min(7.8, playerPos.current.x));
        playerPos.current.z = Math.max(-10.2, Math.min(10.5, playerPos.current.z));
      }

      // Update Camera Transform using robust 'YXZ' Euler orientation
      camera.position.set(playerPos.current.x, 1.7, playerPos.current.z);
      const euler = new THREE.Euler(
        cameraRotation.current.pitch,
        cameraRotation.current.yaw,
        0,
        'YXZ'
      );
      camera.quaternion.setFromEuler(euler);

      // Check proximity to South entrance portal
      const distToPortal = playerPos.current.distanceTo(new THREE.Vector3(0, 1.7, 11.2));
      setIsNearPortal(distToPortal < 3.2);

      // Check proximity to Wall 3 Dedication Panel
      const distToEssay = playerPos.current.distanceTo(new THREE.Vector3(0, 1.7, -10.5));
      setIsNearEssay(distToEssay < 4.5);

      renderer.render(scene, camera);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);

      if (renderer.domElement) {
        renderer.domElement.removeEventListener('mousedown', handlePointerDown);
        renderer.domElement.removeEventListener('click', handleClick);
        renderer.domElement.removeEventListener('touchstart', handlePointerDown);
      }
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('resize', handleResize);

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onReturnToLobby, clearKeys]);

  // Real-time synchronization of 3D canvas textures & data without tearing down WebGL scene
  useEffect(() => {
    teachersRef.current = teachers;
    momentsRef.current = moments;
    gratitudeEssayRef.current = gratitudeEssay;
    entranceIntroRef.current = entranceIntro;
    wall1TitleRef.current = wall1Title;
    wall1SubtitleRef.current = wall1Subtitle;
    wall2TitleRef.current = wall2Title;
    wall2SubtitleRef.current = wall2Subtitle;

    if (!elementsRef.current || !materialsRef.current) return;
    updateMemoryArchitectureContent(
      elementsRef.current,
      materialsRef.current,
      teachers,
      moments,
      gratitudeEssay,
      entranceIntro,
      wall1Title,
      wall1Subtitle,
      wall2Title,
      wall2Subtitle
    );
  }, [teachers, moments, gratitudeEssay, entranceIntro, wall1Title, wall1Subtitle, wall2Title, wall2Subtitle]);

  // Modal navigation indices
  const currentItemIndex = useMemo(() => {
    if (!selectedItem || !selectedType) return -1;
    if (selectedType === 'teacher') {
      return teachers.findIndex((t) => t.id === selectedItem.id);
    }
    return moments.findIndex((m) => m.id === selectedItem.id);
  }, [selectedItem, selectedType, teachers, moments]);

  const listLength = selectedType === 'teacher' ? teachers.length : moments.length;
  const hasNext = currentItemIndex >= 0 && currentItemIndex < listLength - 1;
  const hasPrev = currentItemIndex > 0;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#181B1F] select-none font-sans">
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        title="Kéo chuột để quan sát 360 độ • Phím W A S D để bước đi trong phòng tri ân"
      />

      {/* TOP HUD: Title, Return to Lobby, Sound & Help Controls */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-start justify-between pointer-events-none z-20">
        {/* Left: Room Identity */}
        <div className="flex items-center gap-3.5 pointer-events-auto">
          <button
            onClick={() => {
              memoryAudio.playDoorReturn();
              onReturnToLobby();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#23272E]/90 hover:bg-[#2C313A] border border-[#D4AF37]/40 text-[#F5F5F7] hover:text-[#D4AF37] transition-all backdrop-blur-md shadow-xl text-xs cursor-pointer group font-serif font-bold"
            title="Trở về Sảnh Chính Di Sản"
          >
            <ArrowLeft className="w-4 h-4 text-[#D4AF37] group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">VỀ SẢNH CHÍNH</span>
          </button>

          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#181B1F]/90 border border-[#D4AF37]/40 backdrop-blur-md">
              <Heart className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
              <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase">
                TRI ÂN & KÝ ỨC
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-serif font-bold tracking-wide text-[#FFFFFF] leading-tight drop-shadow-md">
              {entranceIntro.roomTitleVi}
            </h1>
            <p className="text-[11px] text-[#D4AF37] italic hidden sm:block drop-shadow-sm">
              {tributeOverview.titleVi || MEMORY_ROOM_CONTENT.schoolNameVi} • {entranceIntro.mottoVi}
            </p>
          </div>
        </div>

        {/* Right: Sound, Guide & CMD */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {onOpenCmd && (
            <button
              onClick={onOpenCmd}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#23272E]/90 hover:bg-[#2C313A] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono backdrop-blur-md shadow-lg cursor-pointer transition-all font-bold"
              title="Quản lý tư liệu phòng tri ân qua CMD Admin"
            >
              <Shield className="w-4 h-4 text-[#D4AF37]" />
              <span className="hidden md:inline">CMD</span>
            </button>
          )}

          <button
            onClick={() => setHelpModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#23272E]/90 hover:bg-[#2C313A] border border-white/20 text-[#E0E2E8] hover:text-[#D4AF37] text-xs backdrop-blur-md shadow-lg cursor-pointer transition-all font-medium"
            title="Hướng dẫn tham quan & điều khiển"
          >
            <HelpCircle className="w-4 h-4 text-[#D4AF37]" />
            <span className="hidden sm:inline">HƯỚNG DẪN</span>
          </button>
        </div>
      </div>

      {/* QUICK WALL NAVIGATION BAR AT BOTTOM */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-auto max-w-[94vw] w-full sm:w-auto">
        <div className="p-2 rounded-2xl bg-[#1E2228]/95 border border-[#D4AF37]/50 shadow-2xl backdrop-blur-xl flex items-center justify-start sm:justify-center gap-2 overflow-x-auto scrollbar-none">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 text-[11px] font-mono text-[#D4AF37] border-r border-white/10 mr-1 flex-shrink-0 font-bold">
            <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>4 VÁCH TRI ÂN:</span>
          </div>

          <button
            onClick={() => {
              playerPos.current.set(-6.2, 1.7, 0);
              cameraRotation.current.yaw = -Math.PI / 2;
              cameraRotation.current.pitch = 0;
            }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold bg-[#272B33] hover:bg-[#323742] text-[#E0E2E8] hover:text-[#D4AF37] border border-white/10 transition-all cursor-pointer flex-shrink-0"
          >
            Vách Tả: {wall1Title}
          </button>

          <button
            onClick={() => {
              playerPos.current.set(0, 1.7, -7.5);
              cameraRotation.current.yaw = 0;
              cameraRotation.current.pitch = 0;
            }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold bg-gradient-to-r from-[#8B2121] to-[#D4AF37] text-white transition-all cursor-pointer flex-shrink-0 shadow-md"
          >
            Vách Chính: {gratitudeEssay.title}
          </button>

          <button
            onClick={() => {
              playerPos.current.set(6.2, 1.7, 0);
              cameraRotation.current.yaw = Math.PI / 2;
              cameraRotation.current.pitch = 0;
            }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold bg-[#272B33] hover:bg-[#323742] text-[#E0E2E8] hover:text-[#D4AF37] border border-white/10 transition-all cursor-pointer flex-shrink-0"
          >
            Vách Hữu: {wall2Title}
          </button>

          <button
            onClick={() => {
              playerPos.current.set(0, 1.7, 7.5);
              cameraRotation.current.yaw = Math.PI;
              cameraRotation.current.pitch = 0;
            }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold bg-[#272B33] hover:bg-[#323742] text-[#E0E2E8] hover:text-[#D4AF37] border border-white/10 transition-all cursor-pointer flex-shrink-0"
          >
            Vách Cửa: Về Sảnh
          </button>
        </div>
      </div>

      {/* PROXIMITY TOOLTIP NOTIFICATIONS */}
      {/* 1. Portal return prompt */}
      {isNearPortal && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-auto animate-in fade-in duration-200">
          <div className="p-3 px-5 rounded-2xl bg-[#1E2228]/95 border-2 border-[#D4AF37] shadow-2xl backdrop-blur-md text-center space-y-1.5 max-w-xs text-white">
            <span className="text-[10px] font-mono uppercase text-[#D4AF37] font-bold tracking-wider">
              CỔNG KẾT NỐI KHÔNG GIAN
            </span>
            <h4 className="text-sm font-serif font-bold text-white">SẢNH CHÍNH DI SẢN</h4>
            <button
              onClick={() => {
                memoryAudio.playDoorReturn();
                onReturnToLobby();
              }}
              className="mt-1 w-full py-1.5 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8B2121] to-[#D4AF37] hover:from-[#721A1A] hover:to-[#B8942A] transition-all cursor-pointer flex items-center justify-center gap-1.5 font-serif shadow-md"
            >
              <span>BƯỚC VÀO SẢNH</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Dedication Essay Proximity Callout */}
      {isNearEssay && !isEssayModalOpen && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-auto animate-in fade-in duration-200">
          <div
            onClick={() => {
              setIsEssayModalOpen(true);
              memoryAudio.playEssayInspect();
            }}
            className="p-3 px-6 rounded-2xl bg-[#1E2228]/95 border-2 border-[#D4AF37] shadow-2xl backdrop-blur-md text-center space-y-1 max-w-sm cursor-pointer hover:border-[#8B2121] transition-all group text-white"
          >
            <div className="flex items-center justify-center gap-1.5 text-[#D4AF37]">
              <Heart className="w-4 h-4 fill-[#D4AF37]" />
              <span className="text-xs font-serif font-bold uppercase tracking-wider">
                VĂN BIA TRI ÂN THẦY CÔ
              </span>
            </div>
            <h4 className="text-sm font-serif font-bold text-white group-hover:text-[#D4AF37] transition-colors">
              « {gratitudeEssay.title} »
            </h4>
            <span className="text-[10px] font-mono text-[#D4AF37] block font-bold">
              ✦ Nhấp để mở bảng đọc toàn văn bài tri ân ✦
            </span>
          </div>
        </div>
      )}

      {/* PHOTO DETAIL MODAL */}
      <PhotoDetailModal
        item={selectedItem}
        type={selectedType}
        onClose={() => {
          setSelectedItem(null);
          setSelectedType(null);
        }}
        onNavigatePrev={handleModalPrev}
        onNavigateNext={handleModalNext}
        hasPrev={hasPrev}
        hasNext={hasNext}
        onOpenCmd={onOpenCmd}
      />

      {/* ESSAY READING MODAL */}
      <EssayReadingModal
        essay={gratitudeEssay}
        isOpen={isEssayModalOpen}
        onClose={() => setIsEssayModalOpen(false)}
        onOpenCmd={onOpenCmd}
      />

      {/* VISITOR HELP GUIDE MODAL */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#1E2228] border-2 border-[#D4AF37] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <BookOpen className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-serif font-bold text-base uppercase tracking-wider">
                  CẨM NANG THAM QUAN PHÒNG TRI ÂN & KÝ ỨC
                </h3>
              </div>
              <button
                onClick={() => setHelpModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-zinc-300 leading-relaxed font-sans">
              {tributeOverview.prologueVi && (
                <div className="p-3.5 rounded-xl bg-[#272B33]/90 border border-[#D4AF37]/40 space-y-1 text-zinc-200">
                  <span className="font-mono font-bold text-[#D4AF37] text-[11px] uppercase block">
                    {tributeOverview.titleVi || 'LỜI TỰA TRI ÂN'}
                  </span>
                  <p className="italic font-serif leading-relaxed text-[#F4D58B]">
                    &ldquo;{tributeOverview.prologueVi}&rdquo;
                  </p>
                </div>
              )}

              <div className="p-3 rounded-xl bg-[#272B33] border border-white/10 space-y-1">
                <span className="font-mono font-bold text-[#D4AF37]">DI CHUYỂN & QUAN SÁT 360 ĐỘ</span>
                <p>
                  Sử dụng phím <strong>W, A, S, D</strong> hoặc <strong>Phím Mũi Tên</strong> để bước đi dọc lối đi trung tâm. Nhấp giữ và kéo chuột để quan sát toàn cảnh 4 vách triển lãm (chuột đẩy lên: nhìn lên; chuột kéo xuống: nhìn xuống).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#272B33] border border-white/10 space-y-1">
                <span className="font-mono font-bold text-[#D4AF37]">VÁCH TẢ (BÊN TRÁI): NHỮNG NGƯỜI LÁI ĐÒ</span>
                <p>
                  Nơi tôn vinh các thế hệ cán bộ giáo viên, người thầy khai sáng trên dải gỗ ngang phong cách triển lãm hiện đại. Nhấp vào từng khung ảnh để xem tiểu sử và đóng góp sư phạm.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#272B33] border border-white/10 space-y-1">
                <span className="font-mono font-bold text-[#D4AF37]">VÁCH CHÍNH (ĐỐI DIỆN): VĂN BIA TRI ÂN</span>
                <p>
                  Tâm điểm cảm xúc của phòng với bài văn tri ân sâu sắc gửi tới người thầy dưới ánh đèn ấm áp. Nhấp vào văn bia để mở bảng đọc toàn văn.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#272B33] border border-white/10 space-y-1">
                <span className="font-mono font-bold text-[#D4AF37]">VÁCH HỮU (BÊN PHẢI): KHOẢNH KHẮC KHÔNG QUÊN</span>
                <p>
                  Gìn giữ hình ảnh lớp học, kỷ niệm thầy trò và hoạt động trường lớp qua các thời kỳ. Nhấp vào để xem ảnh phóng to.
                </p>
              </div>
            </div>

            <button
              onClick={() => setHelpModalOpen(false)}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8B2121] to-[#D4AF37] hover:from-[#721A1A] hover:to-[#B8942A] transition-all cursor-pointer font-serif shadow-lg"
            >
              ĐÃ HIỂU • BẮT ĐẦU TRẢI NGHIỆM
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
