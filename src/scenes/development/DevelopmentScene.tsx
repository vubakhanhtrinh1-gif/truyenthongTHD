/**
 * Zone 2: The Development Journey (1974–2026) Interactive 3D Exhibition Room
 * Concept: MODERN HERITAGE — THE JOURNEY OF TRANSFORMATION
 * Bright Luxury Heritage Design
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { developmentRoomConfig, DevelopmentZone } from './config/developmentRoomConfig';
import { createDevelopmentMaterials } from './materials/DevelopmentMaterials';
import {
  buildDevelopmentRoomArchitecture,
  DevelopmentSceneElements,
  InteractiveDevelopmentExhibit,
} from './components/DevelopmentArchitecture';
import { useDevelopmentContent } from './services/developmentContentService';
import {
  Volume2,
  VolumeX,
  Compass,
  ArrowLeft,
  Calendar,
  Award,
  Users,
  Clock,
  X,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Cpu,
  Layers,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Headphones,
  Languages,
  Medal,
  Award as MedalIcon,
  ChevronLeft,
  Image as ImageIcon,
} from 'lucide-react';
import { developmentAudio } from './audio/DevelopmentAudio';

interface Props {
  onReturnToLobby: () => void;
  onOpenCmd?: () => void;
  onNavigateDestination?: (roomId: string) => void;
}

export const DevelopmentScene: React.FC<Props> = ({
  onReturnToLobby,
  onOpenCmd,
  onNavigateDestination,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const [isMuted, setIsMuted] = useState(developmentAudio.getMutedState());
  const [isNarrating, setIsNarrating] = useState(false);
  const [currentZone, setCurrentZone] = useState<DevelopmentZone>(developmentRoomConfig.zones[0]);
  const [activeNearbyExhibit, setActiveNearbyExhibit] = useState<InteractiveDevelopmentExhibit | null>(null);

  // Modals state
  const [activeModalExhibit, setActiveModalExhibit] = useState<InteractiveDevelopmentExhibit | null>(null);
  const [pillarPaintingIndex, setPillarPaintingIndex] = useState<number | null>(null);
  const [endWallPhotoIndex, setEndWallPhotoIndex] = useState<number | null>(null);
  const [honorsAwardKey, setHonorsAwardKey] = useState<
    'threeLaborOrders' | 'governmentMinistryProvinceAward' | 'primeMinisterAward' | null
  >(null);
  const [statueModalOpen, setStatueModalOpen] = useState(false);
  const [portraitModalOpen, setPortraitModalOpen] = useState(false);
  const [medalsModalOpen, setMedalsModalOpen] = useState(false);
  const [growthModalOpen, setGrowthModalOpen] = useState(false);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [digitalModalOpen, setDigitalModalOpen] = useState(false);
  const [leadershipModalOpen, setLeadershipModalOpen] = useState(false);
  const [masterTimelineModalOpen, setMasterTimelineModalOpen] = useState(false);
  const [valuesModalOpen, setValuesModalOpen] = useState(false);
  const [orgModalOpen, setOrgModalOpen] = useState(false);

  // Live dynamic Firestore data
  const devData = useDevelopmentContent();

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const elementsRef = useRef<DevelopmentSceneElements | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Player movement state
  const playerPos = useRef(new THREE.Vector3(...developmentRoomConfig.camera.initialPosition));
  const playerVel = useRef(new THREE.Vector3(0, 0, 0));
  const cameraRotation = useRef({ yaw: 0, pitch: 0 });
  const keysDown = useRef<{ [key: string]: boolean }>({});
  const isPointerDown = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const pointerDownPos = useRef({ x: 0, y: 0 });
  const activeNearbyExhibitRef = useRef<InteractiveDevelopmentExhibit | null>(null);
  const raycaster = useRef(new THREE.Raycaster());
  const mouseVec = useRef(new THREE.Vector2());

  // Audio toggles
  const toggleAudio = useCallback(() => {
    const muted = developmentAudio.toggleMute();
    setIsMuted(muted);
    if (muted) setIsNarrating(false);
  }, []);

  const toggleNarration = useCallback(() => {
    developmentAudio.ensureRunning();
    if (isNarrating) {
      developmentAudio.stopNarration();
      setIsNarrating(false);
    } else {
      developmentAudio.playClick();
      const narrativeText = lang === 'vi'
        ? `Chào mừng bạn đến với Phân khu 2: Quá trình phát triển 1974 đến 2026 của Trường THPT A Trần Hưng Đạo. Trọng tâm của không gian là Cột trụ lớn gồm 3 khung hình ảnh Đức Thánh Trần để bạn trực tiếp tải ảnh lên qua hệ thống CMD. Ở vách cuối phòng là bộ 3 khung ảnh tư liệu cũng được dành riêng để bạn trực tiếp tải ảnh từ CMD. Nội dung phân khu được tổ chức hài hòa làm hai phần ở hai bên: bên trái là Lịch sử trường từ 1975 đến 2026 và Lịch sử Ban Giám hiệu; bên phải là Những điểm nổi bật của nhà trường ngày nay. Đặc biệt ở trung tâm bên phải là cụm giới thiệu các danh hiệu cao quý: bên phải phần trung tâm là Ba Huân chương Lao động và hình ảnh, ở giữa là các phần thưởng lớn của Tỉnh, Bộ Giáo dục và Đào tạo cùng Chính phủ, và bên trái là Bằng khen của Thủ tướng Chính phủ. Chúc bạn có trải nghiệm ý nghĩa và tự hào.`
        : `Welcome to Zone 2: The Development Journey 1974 to 2026 of Tran Hung Dao High School. At the center stands the Grand Monumental Pillar with three photo frames dedicated to Supreme Commander Tran Hung Dao, ready for direct photo uploads via CMD Admin. At the far end wall are three archival photo frames, also ready for your direct uploads. On the left is the school history from 1975 to 2026 and Principal Leadership history; on the right are Today's Highlights and the prestigious State Honors and Awards.`;

      developmentAudio.startNarration(narrativeText, lang, () => setIsNarrating(false));
      setIsNarrating(true);
    }
  }, [isNarrating, lang]);

  // Quick teleport within Zone 2
  const teleportToArea = (
    area:
      | 'entry'
      | 'pillar'
      | 'statue'
      | 'timeline'
      | 'medals'
      | 'honors'
      | 'era1'
      | 'era2'
      | 'era3'
      | 'org'
      | 'leadership'
      | 'growth'
      | 'end_photos'
  ) => {
    developmentAudio.playTeleport();
    if (area === 'entry') {
      playerPos.current.set(0, 1.6, 14.8);
      cameraRotation.current = { yaw: 0, pitch: 0 };
    } else if (area === 'pillar' || area === 'statue') {
      // Facing the grand monumental column with 3 photos of Duc Thanh Tran
      playerPos.current.set(0, 1.6, 5.8);
      cameraRotation.current = { yaw: 0, pitch: 0.08 };
    } else if (area === 'honors') {
      // Facing the central right honors awards on the East wall
      playerPos.current.set(3.8, 1.6, -2.25);
      cameraRotation.current = { yaw: Math.PI / 2, pitch: 0.02 };
    } else if (area === 'era1') {
      // West wall 1975-2026 history
      playerPos.current.set(-3.5, 1.6, 2.25);
      cameraRotation.current = { yaw: -Math.PI / 2, pitch: 0 };
    } else if (area === 'leadership') {
      // West wall leadership history
      playerPos.current.set(-3.5, 1.6, -11.25);
      cameraRotation.current = { yaw: -Math.PI / 2, pitch: 0 };
    } else if (area === 'growth') {
      // East wall school highlights today
      playerPos.current.set(3.8, 1.6, 6.75);
      cameraRotation.current = { yaw: Math.PI / 2, pitch: 0 };
    } else if (area === 'timeline') {
      playerPos.current.set(0, 1.6, 10.2);
      cameraRotation.current = { yaw: 0, pitch: -0.05 };
    } else if (area === 'medals') {
      playerPos.current.set(4.5, 1.6, 15.75);
      cameraRotation.current = { yaw: Math.PI / 2, pitch: 0 };
    } else if (area === 'era2') {
      playerPos.current.set(3.5, 1.6, 2.25);
      cameraRotation.current = { yaw: Math.PI / 2, pitch: 0 };
    } else if (area === 'org') {
      playerPos.current.set(3.8, 1.6, -15.75);
      cameraRotation.current = { yaw: Math.PI / 2, pitch: 0 };
    } else if (area === 'end_photos' || area === 'era3') {
      // Facing the 3 end wall archival frames at the North Wall
      playerPos.current.set(0, 1.6, -14.2);
      cameraRotation.current = { yaw: 0, pitch: 0.05 };
    }
  };

  const handleExhibitClick = useCallback((exhibit: InteractiveDevelopmentExhibit) => {
    if (exhibit.type === 'central_pillar_painting' || exhibit.id.startsWith('development_central_pillar_painting')) {
      developmentAudio.playBronzeBell();
      const order = (exhibit.dataPayload as any)?.order;
      const idx = typeof order === 'number' ? order - 1 : (exhibit.id.endsWith('1') ? 0 : exhibit.id.endsWith('2') ? 1 : 2);
      setPillarPaintingIndex(Math.max(0, Math.min(2, idx)));
    } else if (exhibit.type === 'end_wall_photo' || exhibit.id.startsWith('development_end_wall_photo')) {
      developmentAudio.playBronzeBell();
      const order = (exhibit.dataPayload as any)?.order;
      const idx = typeof order === 'number' ? order - 1 : (exhibit.id.endsWith('1') ? 0 : exhibit.id.endsWith('2') ? 1 : 2);
      setEndWallPhotoIndex(Math.max(0, Math.min(2, idx)));
    } else if (exhibit.type === 'honors_award' || exhibit.id.startsWith('development_award_')) {
      developmentAudio.playBronzeBell();
      if (exhibit.id === 'development_award_three_labor_orders' || exhibit.dataPayload?.awardType === 'three_labor_orders') {
        setHonorsAwardKey('threeLaborOrders');
      } else if (exhibit.id === 'development_award_government_ministry_province' || exhibit.dataPayload?.awardType === 'government_ministry_province') {
        setHonorsAwardKey('governmentMinistryProvinceAward');
      } else {
        setHonorsAwardKey('primeMinisterAward');
      }
    } else if (exhibit.type === 'tran_hung_dao_statue' || exhibit.id === 'development_sacred_stele') {
      developmentAudio.playBronzeBell();
      setStatueModalOpen(true);
    } else if (exhibit.type === 'growth_overview' || exhibit.id === 'development_growth_overview') {
      developmentAudio.playExhibitInspect();
      setGrowthModalOpen(true);
    } else if (exhibit.type === 'duc_thanh_tran' || exhibit.id === 'central_duc_thanh_tran_frame') {
      developmentAudio.playExhibitInspect();
      setPortraitModalOpen(true);
    } else if (exhibit.type === 'important_medals' || exhibit.id === 'development_medals_gallery') {
      developmentAudio.playExhibitInspect();
      setMedalsModalOpen(true);
    } else if (exhibit.type === 'master_timeline' || exhibit.id === 'development_master_timeline') {
      developmentAudio.playExhibitInspect();
      setMasterTimelineModalOpen(true);
    } else if (exhibit.type === 'statistics' || exhibit.id === 'development_school_statistics') {
      developmentAudio.playExhibitInspect();
      setStatsModalOpen(true);
    } else if (exhibit.type === 'digital_management' || exhibit.id === 'development_digital_management') {
      developmentAudio.playExhibitInspect();
      setDigitalModalOpen(true);
    } else if (exhibit.type === 'leadership' || exhibit.id === 'development_leadership_gallery') {
      developmentAudio.playExhibitInspect();
      setLeadershipModalOpen(true);
    } else if (exhibit.type === 'organization' || exhibit.id === 'development_current_organization') {
      developmentAudio.playExhibitInspect();
      setOrgModalOpen(true);
    } else if (exhibit.type === 'values' || exhibit.id === 'development_values') {
      developmentAudio.playExhibitInspect();
      setValuesModalOpen(true);
    } else {
      developmentAudio.playExhibitInspect();
      setActiveModalExhibit(exhibit);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    developmentAudio.ensureRunning();

    // 1. Scene Setup — Luxurious Golden Exhibition with ~30% deep museum black contrast (identical to Room 1)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x221a12);
    scene.fog = new THREE.FogExp2(0x1a130c, 0.016);
    sceneRef.current = scene;

    // 2. Camera Setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(developmentRoomConfig.camera.fov, width / height, 0.1, 100);
    camera.position.copy(playerPos.current);
    camera.lookAt(0, 1.6, 4.0);
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
    renderer.toneMappingExposure = 1.0;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Build Architecture and Exhibits
    const materials = createDevelopmentMaterials();
    const elements = buildDevelopmentRoomArchitecture(materials);
    scene.add(elements.group);
    elementsRef.current = elements;

    // 5. Input Event Listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      keysDown.current[e.key.toLowerCase()] = true;
      if (e.key.toLowerCase() === 'e' || e.key === 'Enter') {
        if (activeNearbyExhibitRef.current) {
          handleExhibitClick(activeNearbyExhibitRef.current);
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysDown.current[e.key.toLowerCase()] = false;
    };

    const handlePointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).tagName !== 'CANVAS') return;
      isPointerDown.current = true;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      pointerDownPos.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      // Raycasting for interactive exhibit hover
      const rect = renderer.domElement.getBoundingClientRect();
      mouseVec.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVec.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (!isPointerDown.current) return;
      const deltaX = e.clientX - lastPointer.current.x;
      const deltaY = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };

      const SENSITIVITY = 0.0035;
      cameraRotation.current.yaw -= deltaX * SENSITIVITY;
      cameraRotation.current.pitch -= deltaY * SENSITIVITY;
      cameraRotation.current.pitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, cameraRotation.current.pitch));
    };

    const handlePointerUp = (e: PointerEvent) => {
      isPointerDown.current = false;

      // Only treat as exhibit click if the user was clicking, not dragging to rotate view
      const dragDist = Math.hypot(e.clientX - pointerDownPos.current.x, e.clientY - pointerDownPos.current.y);
      if (dragDist > 8) return;

      // Check click raycast for interaction
      if (cameraRef.current && elementsRef.current) {
        raycaster.current.setFromCamera(mouseVec.current, cameraRef.current);
        const hitMeshes: THREE.Object3D[] = [];
        elementsRef.current.interactiveExhibits.forEach((ex) => {
          hitMeshes.push(ex.mesh);
          ex.mesh.traverse((c) => hitMeshes.push(c));
        });

        const intersects = raycaster.current.intersectObjects(hitMeshes, true);
        if (intersects.length > 0) {
          const hit = intersects[0].object;
          const found = elementsRef.current.interactiveExhibits.find((ex) => {
            let cur: THREE.Object3D | null = hit;
            while (cur) {
              if (cur === ex.mesh) return true;
              cur = cur.parent;
            }
            return false;
          });
          if (found) {
            handleExhibitClick(found);
          }
        }
      }
    };

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('resize', handleResize);

    // 6. Animation & Physics Game Loop
    let lastTime = performance.now();
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();
      const moveSpeed = developmentRoomConfig.camera.moveSpeed;

      // Dynamic rotation on Black Hole Monument golden accretion bands & celestial particles (identical to Room 1)
      if (elements.monumentRing) {
        elements.monumentRing.rotation.z = elapsedTime * 0.28;
      }
      if (elements.blackHoleRing2) {
        elements.blackHoleRing2.rotation.z = -elapsedTime * 0.22;
      }
      if (elements.blackHoleRing3) {
        elements.blackHoleRing3.rotation.y = elapsedTime * 0.18;
      }
      if (elements.blackHoleAccretionMesh) {
        elements.blackHoleAccretionMesh.rotation.z = elapsedTime * 0.15;
      }
      if (elements.orbitParticles) {
        elements.orbitParticles.rotation.y = elapsedTime * 0.02;
      }

      // Movement vector calculations
      const forward = new THREE.Vector3(
        -Math.sin(cameraRotation.current.yaw),
        0,
        -Math.cos(cameraRotation.current.yaw)
      ).normalize();
      const right = new THREE.Vector3(
        Math.cos(cameraRotation.current.yaw),
        0,
        -Math.sin(cameraRotation.current.yaw)
      ).normalize();

      const moveDir = new THREE.Vector3();
      if (keysDown.current['w'] || keysDown.current['arrowup']) moveDir.add(forward);
      if (keysDown.current['s'] || keysDown.current['arrowdown']) moveDir.sub(forward);
      if (keysDown.current['a'] || keysDown.current['arrowleft']) moveDir.sub(right);
      if (keysDown.current['d'] || keysDown.current['arrowright']) moveDir.add(right);

      if (moveDir.lengthSq() > 0) {
        moveDir.normalize();
        playerVel.current.copy(moveDir.multiplyScalar(moveSpeed * delta));
        playerPos.current.add(playerVel.current);

        // Room boundary collision
        playerPos.current.x = Math.max(-7.2, Math.min(7.2, playerPos.current.x));
        playerPos.current.z = Math.max(-17.0, Math.min(17.0, playerPos.current.z));
      }

      // Update camera
      camera.position.set(playerPos.current.x, 1.6, playerPos.current.z);
      const targetLook = new THREE.Vector3(
        camera.position.x - Math.sin(cameraRotation.current.yaw) * Math.cos(cameraRotation.current.pitch),
        camera.position.y + Math.sin(cameraRotation.current.pitch),
        camera.position.z - Math.cos(cameraRotation.current.yaw) * Math.cos(cameraRotation.current.pitch)
      );
      camera.lookAt(targetLook);

      // Proximity detection to exhibits
      if (elementsRef.current) {
        let closest: InteractiveDevelopmentExhibit | null = null;
        let minDist = 3.6;

        for (const ex of elementsRef.current.interactiveExhibits) {
          const worldPos = new THREE.Vector3();
          ex.mesh.getWorldPosition(worldPos);
          const dist = playerPos.current.distanceTo(worldPos);
          if (dist < minDist) {
            minDist = dist;
            closest = ex;
          }
        }
        setActiveNearbyExhibit(closest);
        activeNearbyExhibitRef.current = closest;

        // Zone detection
        for (const z of developmentRoomConfig.zones) {
          if (
            playerPos.current.z >= z.bounds.minZ &&
            playerPos.current.z <= z.bounds.maxZ &&
            playerPos.current.x >= z.bounds.minX &&
            playerPos.current.x <= z.bounds.maxX
          ) {
            if (currentZone.id !== z.id) {
              setCurrentZone(z);
            }
            break;
          }
        }
      }

      renderer.render(scene, camera);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);

      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
        if (rendererRef.current.domElement.parentElement) {
          rendererRef.current.domElement.parentElement.removeChild(rendererRef.current.domElement);
        }
      }
    };
  }, [handleExhibitClick]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#142238] select-none text-white font-sans">
      {/* 3D Canvas Mount Point */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* TOP HUD: Room Identity & Quick Navigation */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-start justify-between pointer-events-none z-20">
        <div className="space-y-1.5 pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#142238]/90 border border-[#b8924b]/40 backdrop-blur-md shadow-lg shadow-black/40">
            <Sparkles className="w-4 h-4 text-[#d9bd79]" />
            <span className="text-[11px] font-mono tracking-widest text-[#f3ebdd] font-semibold uppercase">
              KHU 2 • QUÁ TRÌNH PHÁT TRIỂN (1974–2026)
            </span>
          </div>

          <div className="text-sm sm:text-base font-serif font-bold text-[#f3ebdd] drop-shadow-md">
            {devData.thematicTitleVi}
          </div>

          <div className="text-xs text-[#d9bd79] font-medium tracking-wide">
            &quot;{devData.coreMottoVi}&quot;
          </div>
        </div>

        {/* Top-Right Quick Jump & Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Quick Area Jump Dropdown */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[#142238]/90 border border-[#b8924b]/40 rounded-xl p-1 backdrop-blur-md shadow-lg shadow-black/40">
            <button
              onClick={() => teleportToArea('entry')}
              className="px-2.5 py-1 text-[11px] rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              {lang === 'vi' ? 'Cổng vào' : 'Entrance'}
            </button>
            <button
              onClick={() => teleportToArea('pillar')}
              className="px-2.5 py-1 text-[11px] rounded-lg text-[#ffd988] font-bold bg-[#b8924b]/20 hover:bg-[#b8924b]/30 transition-colors cursor-pointer border border-[#b8924b]/50"
            >
              🏛️ {lang === 'vi' ? 'Cột Đức Thánh Trần' : 'Tran Hung Dao Pillar'}
            </button>
            <button
              onClick={() => teleportToArea('era1')}
              className="px-2.5 py-1 text-[11px] rounded-lg text-amber-200 hover:bg-white/10 transition-colors cursor-pointer"
            >
              ⬅️ {lang === 'vi' ? 'Lịch sử 1975–2026' : '1975–2026'}
            </button>
            <button
              onClick={() => teleportToArea('leadership')}
              className="px-2.5 py-1 text-[11px] rounded-lg text-[#ffd988] hover:bg-white/10 transition-colors cursor-pointer"
            >
              ⬅️ {lang === 'vi' ? 'Lịch sử BGH' : 'Principals'}
            </button>
            <button
              onClick={() => teleportToArea('honors')}
              className="px-2.5 py-1 text-[11px] rounded-lg text-amber-300 font-bold hover:bg-white/10 transition-colors cursor-pointer border border-amber-400/40"
            >
              ➡️ {lang === 'vi' ? 'Trung tâm Danh hiệu' : 'Honors & Awards'}
            </button>
            <button
              onClick={() => teleportToArea('growth')}
              className="px-2.5 py-1 text-[11px] rounded-lg text-emerald-300 hover:bg-white/10 transition-colors cursor-pointer"
            >
              ➡️ {lang === 'vi' ? 'Trường ngày nay' : 'Today Highlights'}
            </button>
            <button
              onClick={() => teleportToArea('timeline')}
              className="px-2.5 py-1 text-[11px] rounded-lg text-zinc-300 hover:bg-white/10 transition-colors cursor-pointer"
            >
              {lang === 'vi' ? 'Trục thời gian' : 'Timeline'}
            </button>
            <button
              onClick={() => teleportToArea('era3')}
              className="px-2.5 py-1 text-[11px] rounded-lg text-cyan-300 font-bold hover:bg-white/10 transition-colors cursor-pointer"
            >
              {lang === 'vi' ? '60 Năm' : '60th Anniv'}
            </button>
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => {
              setLang(lang === 'vi' ? 'en' : 'vi');
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#142238]/85 border border-[#b8924b]/40 text-[#ffd988] hover:bg-white/10 transition-colors cursor-pointer text-xs font-mono font-bold"
            title="Đổi ngôn ngữ / Switch Language"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'EN' : 'VI'}</span>
          </button>
        </div>
      </div>

      {/* BOTTOM-LEFT: Navigation Back to Main Hall / History Room */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-auto flex items-center gap-2.5">
        <button
          onClick={onReturnToLobby}
          className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#142238]/90 hover:bg-[#1c2940] border border-[#b8924b] text-[#f3ebdd] hover:text-white shadow-xl shadow-black/50 transition-all cursor-pointer backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4 text-[#d9bd79] group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-serif font-bold uppercase tracking-wider">
            VỀ SẢNH CHÍNH
          </span>
        </button>

        {onNavigateDestination && (
          <>
            <button
              onClick={() => onNavigateDestination('achievements')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-950/70 hover:bg-amber-900/80 border border-amber-600/50 text-xs text-amber-200 hover:text-white backdrop-blur-md transition-colors cursor-pointer"
            >
              <MedalIcon className="w-3.5 h-3.5 text-[#ffd988]" />
              <span>Phòng Thành Tích (Khu 3)</span>
            </button>
            <button
              onClick={() => onNavigateDestination('history')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 hover:text-white backdrop-blur-md transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#d9bd79]" />
              <span>Phòng Lịch Sử (1966–1975)</span>
            </button>
          </>
        )}
      </div>

      {/* BOTTOM-RIGHT: Discreet CMD Admin Access Button */}
      <div className="absolute bottom-6 right-6 z-20 pointer-events-auto">
        <button
          onClick={onOpenCmd}
          className="text-[10px] font-mono text-zinc-500 hover:text-[#d9bd79] px-2.5 py-1.5 rounded-lg bg-[#142238]/60 hover:bg-[#142238] border border-zinc-800 hover:border-[#b8924b]/40 transition-colors cursor-pointer"
          title="Quản trị hệ thống (CMD)"
        >
          [ CMD ]
        </button>
      </div>

      {/* Current Zone Breadcrumb Overlay (Bottom-Center) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center">
        <div className="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full bg-[#142238]/95 border-2 border-[#b8924b]/70 text-[#f3ebdd] backdrop-blur-md shadow-2xl shadow-black/50">
          <Compass className="w-3.5 h-3.5 text-[#ffd988] animate-pulse" />
          <span className="text-[11px] font-mono text-[#ffd988] uppercase font-bold tracking-wider">
            {currentZone.code}: {currentZone.nameVi}
          </span>
          <span className="text-[#b8924b] text-[10px] hidden sm:inline">•</span>
          <span className="text-[11px] text-[#f3ebdd] font-serif hidden sm:inline">{currentZone.subtitleVi}</span>
        </div>
        <p className="text-[10px] text-zinc-400 mt-1 font-mono tracking-tight drop-shadow">
          Dùng phím W, A, S, D hoặc Mũi tên để di chuyển • Kéo chuột để xoay góc nhìn • Nhấn phím E để xem tư liệu
        </p>
      </div>

      {/* BOTTOM CENTER: Interactive Exhibit Hover Prompt */}
      {activeNearbyExhibit && (
        <div className="absolute bottom-22 left-1/2 -translate-x-1/2 z-30 pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={() => handleExhibitClick(activeNearbyExhibit)}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#142238]/98 border-2 border-[#ffd988] shadow-2xl shadow-black/70 backdrop-blur-md text-[#f3ebdd] hover:scale-105 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#ffd988] animate-pulse flex-shrink-0" />
            <div className="text-left">
              <span className="text-xs font-serif font-bold text-white block">
                {activeNearbyExhibit.titleVi}
              </span>
              <span className="text-[10px] text-[#ffd988] block font-mono">
                NHẤP HOẶC NHẤN PHÍM [E] ĐỂ XEM HỒ SƠ TƯ LIỆU
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#ffd988] ml-1" />
          </button>
        </div>
      )}

      {/* MODAL: Central Monumental Pillar - 3 Duc Thanh Tran Photo Frames */}
      {pillarPaintingIndex !== null && (() => {
        const painting = devData.centralPillarPaintings[pillarPaintingIndex];
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#142238] border-2 border-[#d4af37] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-left text-[#f3ebdd] relative">
              <button
                onClick={() => setPillarPaintingIndex(null)}
                className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#ffd988] text-xs font-mono font-bold tracking-wider">
                  ✦ CỘT TRỤ TRUNG TÂM • HÌNH ẢNH ĐỨC THÁNH TRẦN ✦
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                  ẢNH ĐỨC THÁNH TRẦN {painting.order}: {painting.titleVi.toUpperCase()}
                </h2>
                <div className="text-sm text-[#ffd988] font-serif italic">
                  {painting.captionVi}
                </div>
              </div>

              {/* Quick Tab Switcher for 3 Duc Thanh Tran Frames */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/40 border border-[#d4af37]/30">
                {devData.centralPillarPaintings.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      developmentAudio.playClick();
                      setPillarPaintingIndex(idx);
                    }}
                    className={`flex-1 min-w-[140px] px-3 py-2 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      pillarPaintingIndex === idx
                        ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20'
                        : 'bg-transparent text-zinc-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="font-mono text-[11px]">Ảnh {p.order}:</span>
                    <span className="truncate">{p.titleVi}</span>
                  </button>
                ))}
              </div>

              {/* Artwork Canvas / Image Preview (Displayed strictly when uploaded, zero fake placeholders) */}
              {painting.customUrl && (
                <div className="p-4 sm:p-6 rounded-2xl bg-black/60 border-2 border-[#d4af37]/50 shadow-inner flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden">
                  <img
                    src={painting.customUrl}
                    alt={painting.titleVi}
                    className="w-full max-h-[380px] object-contain rounded-xl border border-[#d4af37]/40 shadow-2xl"
                  />
                  {painting.captionVi && (
                    <span className="text-xs font-serif text-[#ffd988] italic">
                      {painting.captionVi}
                    </span>
                  )}
                </div>
              )}

              {/* Detailed Description */}
              <div className="p-5 rounded-2xl bg-black/40 border border-zinc-800 text-sm leading-relaxed text-zinc-200 space-y-2.5 font-serif">
                <h3 className="font-bold text-sm text-[#ffd988] font-sans flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#ffd988]" />
                  Ý Nghĩa & Lời Dẫn Tư Liệu
                </h3>
                <p>{painting.descriptionVi}</p>
              </div>

              {/* CMD Management Notice & Navigation */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-zinc-800">
                <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>
                    Mã CMD: <strong>development.central_pillar_painting_{painting.order}</strong> (Quản lý nội dung)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={pillarPaintingIndex === 0}
                    onClick={() => {
                      developmentAudio.playClick();
                      setPillarPaintingIndex((prev) => Math.max(0, (prev || 0) - 1));
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-serif font-bold flex items-center gap-1 transition-all ${
                      pillarPaintingIndex === 0
                        ? 'opacity-30 border-zinc-700 text-zinc-500 cursor-not-allowed'
                        : 'border-[#d4af37]/60 text-[#ffd988] hover:bg-white/10 cursor-pointer'
                    }`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Ảnh trước</span>
                  </button>
                  <button
                    disabled={pillarPaintingIndex === 2}
                    onClick={() => {
                      developmentAudio.playClick();
                      setPillarPaintingIndex((prev) => Math.min(2, (prev || 0) + 1));
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-serif font-bold flex items-center gap-1 transition-all ${
                      pillarPaintingIndex === 2
                        ? 'opacity-30 border-zinc-700 text-zinc-500 cursor-not-allowed'
                        : 'border-[#d4af37]/60 text-[#ffd988] hover:bg-white/10 cursor-pointer'
                    }`}
                  >
                    <span>Ảnh kế tiếp</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  {onOpenCmd && (
                    <button
                      onClick={() => {
                        setPillarPaintingIndex(null);
                        onOpenCmd();
                      }}
                      className="ml-2 px-3 py-1.5 rounded-xl bg-[#d4af37]/20 hover:bg-[#d4af37]/30 border border-[#d4af37] text-xs font-mono font-bold text-[#ffd988] transition-all cursor-pointer"
                    >
                      Tải ảnh lên qua CMD →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL: End Wall 3 Archival Photo Frames (Far End Wall / North Wall) */}
      {endWallPhotoIndex !== null && (() => {
        const photo = devData.endWallPhotos[endWallPhotoIndex];
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#142238] border-2 border-[#d4af37] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-left text-[#f3ebdd] relative">
              <button
                onClick={() => setEndWallPhotoIndex(null)}
                className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#ffd988] text-xs font-mono font-bold tracking-wider">
                  ✦ VÁCH CUỐI PHÒNG • BỘ 3 KHUNG ẢNH TƯ LIỆU (KỶ NIỆM 60 NĂM) ✦
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                  KHUNG ẢNH {photo.order}: {photo.titleVi.toUpperCase()}
                </h2>
                <div className="text-sm text-[#ffd988] font-serif italic">
                  {photo.captionVi}
                </div>
              </div>

              {/* Quick Tab Switcher for 3 End Wall Frames */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/40 border border-[#d4af37]/30">
                {devData.endWallPhotos.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      developmentAudio.playClick();
                      setEndWallPhotoIndex(idx);
                    }}
                    className={`flex-1 min-w-[140px] px-3 py-2 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      endWallPhotoIndex === idx
                        ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20'
                        : 'bg-transparent text-zinc-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="font-mono text-[11px]">Khung {p.order}:</span>
                    <span className="truncate">{p.titleVi}</span>
                  </button>
                ))}
              </div>

              {/* Artwork Canvas / Image Preview (Displayed strictly when uploaded, zero fake placeholders) */}
              {photo.customUrl && (
                <div className="p-4 sm:p-6 rounded-2xl bg-black/60 border-2 border-[#d4af37]/50 shadow-inner flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden">
                  <img
                    src={photo.customUrl}
                    alt={photo.titleVi}
                    className="w-full max-h-[380px] object-contain rounded-xl border border-[#d4af37]/40 shadow-2xl"
                  />
                  {photo.captionVi && (
                    <span className="text-xs font-serif text-[#ffd988] italic">
                      {photo.captionVi}
                    </span>
                  )}
                </div>
              )}

              {/* Detailed Description */}
              <div className="p-5 rounded-2xl bg-black/40 border border-zinc-800 text-sm leading-relaxed text-zinc-200 space-y-2.5 font-serif">
                <h3 className="font-bold text-sm text-[#ffd988] font-sans flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#ffd988]" />
                  Thông Tin & Mô Tả Tư Liệu
                </h3>
                <p>{photo.descriptionVi}</p>
              </div>

              {/* CMD Management Notice & Navigation */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-zinc-800">
                <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>
                    Mã CMD: <strong>development.end_wall_photo_{photo.order}</strong> (Quản lý nội dung)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={endWallPhotoIndex === 0}
                    onClick={() => {
                      developmentAudio.playClick();
                      setEndWallPhotoIndex((prev) => Math.max(0, (prev || 0) - 1));
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-serif font-bold flex items-center gap-1 transition-all ${
                      endWallPhotoIndex === 0
                        ? 'opacity-30 border-zinc-700 text-zinc-500 cursor-not-allowed'
                        : 'border-[#d4af37]/60 text-[#ffd988] hover:bg-white/10 cursor-pointer'
                    }`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Khung trước</span>
                  </button>
                  <button
                    disabled={endWallPhotoIndex === 2}
                    onClick={() => {
                      developmentAudio.playClick();
                      setEndWallPhotoIndex((prev) => Math.min(2, (prev || 0) + 1));
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-serif font-bold flex items-center gap-1 transition-all ${
                      endWallPhotoIndex === 2
                        ? 'opacity-30 border-zinc-700 text-zinc-500 cursor-not-allowed'
                        : 'border-[#d4af37]/60 text-[#ffd988] hover:bg-white/10 cursor-pointer'
                    }`}
                  >
                    <span>Khung kế tiếp</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  {onOpenCmd && (
                    <button
                      onClick={() => {
                        setEndWallPhotoIndex(null);
                        onOpenCmd();
                      }}
                      className="ml-2 px-3 py-1.5 rounded-xl bg-[#d4af37]/20 hover:bg-[#d4af37]/30 border border-[#d4af37] text-xs font-mono font-bold text-[#ffd988] transition-all cursor-pointer"
                    >
                      Tải ảnh lên qua CMD →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL: Central Right Honors & Awards (Prime Minister, Ministry/Province, Three Labor Orders) */}
      {honorsAwardKey !== null && (() => {
        const awards = devData.centralRightAwards;
        const currentAward = awards[honorsAwardKey];
        const isLabor = honorsAwardKey === 'threeLaborOrders';
        const isMinistry = honorsAwardKey === 'governmentMinistryProvinceAward';
        const isPrimeMinister = honorsAwardKey === 'primeMinisterAward';

        const positionLabel = isLabor
          ? 'BÊN PHẢI PHẦN TRUNG TÂM'
          : isMinistry
          ? 'Ở GIỮA PHẦN TRUNG TÂM'
          : 'BÊN TRÁI PHẦN TRUNG TÂM';

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#142238] border-2 border-[#d4af37] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-left text-[#f3ebdd] relative">
              <button
                onClick={() => setHonorsAwardKey(null)}
                className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#ffd988] text-xs font-mono font-bold tracking-wider">
                  ✦ TRUNG TÂM BÊN PHẢI • {positionLabel} ✦
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                  {currentAward.titleVi}
                </h2>
                <div className="text-sm text-[#ffd988] font-serif italic">
                  {currentAward.captionVi}
                </div>
              </div>

              {/* 3 Awards Navigation Tabs: Left, Center, Right matching user specification */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 rounded-2xl bg-black/40 border border-[#d4af37]/30">
                <button
                  onClick={() => {
                    developmentAudio.playClick();
                    setHonorsAwardKey('primeMinisterAward');
                  }}
                  className={`p-2.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer flex flex-col items-center text-center gap-1 ${
                    isPrimeMinister
                      ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20'
                      : 'bg-transparent text-zinc-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="font-mono text-[10px] uppercase tracking-wider opacity-80">
                    Bên trái trung tâm
                  </span>
                  <span>Bằng khen TT Chính phủ</span>
                </button>
                <button
                  onClick={() => {
                    developmentAudio.playClick();
                    setHonorsAwardKey('governmentMinistryProvinceAward');
                  }}
                  className={`p-2.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer flex flex-col items-center text-center gap-1 ${
                    isMinistry
                      ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20'
                      : 'bg-transparent text-zinc-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="font-mono text-[10px] uppercase tracking-wider opacity-80">
                    Ở giữa trung tâm
                  </span>
                  <span>Phần thưởng Tỉnh, Bộ, CP</span>
                </button>
                <button
                  onClick={() => {
                    developmentAudio.playClick();
                    setHonorsAwardKey('threeLaborOrders');
                  }}
                  className={`p-2.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer flex flex-col items-center text-center gap-1 ${
                    isLabor
                      ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20'
                      : 'bg-transparent text-zinc-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="font-mono text-[10px] uppercase tracking-wider opacity-80">
                    Bên phải trung tâm
                  </span>
                  <span>3 Huân chương Lao động</span>
                </button>
              </div>

              {/* Single Archival Photo if uploaded - strictly 1 photo only, zero fake placeholders */}
              {currentAward.customUrl && (
                <div className="p-3 sm:p-4 rounded-2xl bg-black/60 border border-[#d4af37]/50 flex flex-col items-center justify-center space-y-2">
                  <img
                    src={currentAward.customUrl}
                    alt={currentAward.titleVi}
                    className="w-full max-h-[320px] object-contain rounded-xl border border-[#d4af37]/30 shadow-xl"
                  />
                  {currentAward.captionVi && (
                    <span className="text-[11px] font-serif text-[#ffd988] italic text-center">
                      {currentAward.captionVi}
                    </span>
                  )}
                </div>
              )}

              {/* Official Lead Narrative (Lời dẫn trang trọng) */}
              <div className="p-5 rounded-2xl bg-black/40 border border-[#d4af37]/30 text-sm leading-relaxed text-zinc-200 space-y-2.5 font-serif">
                <h3 className="font-bold text-sm text-[#ffd988] font-sans flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#ffd988]" />
                  Lời Dẫn Khái Quát Danh Hiệu Vinh Quang
                </h3>
                <p className="leading-relaxed whitespace-pre-line text-zinc-100">
                  {currentAward.leadNarrativeVi}
                </p>
              </div>

              {/* Bottom Notice for CMD sync */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-zinc-800">
                <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>
                    Toàn bộ lời dẫn và 3 vị trí hình ảnh đã được lưu vào hệ thống quản trị CMD (Phân khu 05).
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (onOpenCmd) {
                      setHonorsAwardKey(null);
                      onOpenCmd();
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#d4af37]/20 hover:bg-[#d4af37]/30 border border-[#d4af37] text-xs font-mono font-bold text-[#ffd988] transition-all cursor-pointer"
                >
                  Mở CMD Quản Lý Nội Dung →
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL 1: Individual Milestone Detail Modal */}
      {activeModalExhibit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl bg-[#142238] border-2 border-[#b8924b] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 text-left text-[#f3ebdd] relative">
            <button
              onClick={() => setActiveModalExhibit(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#b8924b]/20 border border-[#b8924b]/40 text-[#ffd988] text-[11px] font-mono">
                MỐC LỊCH SỬ {activeModalExhibit.year || ''}
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
                {activeModalExhibit.titleVi}
              </h2>
            </div>

            <div className="p-4 rounded-xl bg-black/30 border border-zinc-800 text-sm leading-relaxed text-zinc-200 space-y-3 font-serif">
              <p>{activeModalExhibit.dataPayload?.descriptionVi || activeModalExhibit.subtitleVi}</p>
              {activeModalExhibit.dataPayload?.significanceVi && (
                <div className="pt-2 border-t border-zinc-700/50 text-xs text-[#ffd988] italic">
                  <strong>Ý nghĩa lịch sử:</strong> {activeModalExhibit.dataPayload.significanceVi}
                </div>
              )}
            </div>

            {activeModalExhibit.dataPayload?.sourceNote && (
              <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2 bg-[#0e1726] p-2.5 rounded-lg border border-zinc-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  <strong>Nguồn đối chiếu:</strong> {activeModalExhibit.dataPayload.sourceNote}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 1B: Statue of Duc Thanh Tran Hung Dao */}
      {statueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#142238] border-2 border-[#d4af37] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-left text-[#f3ebdd] relative">
            <button
              onClick={() => setStatueModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#ffd988] text-xs font-mono font-bold tracking-wider">
                ✦ MỐC SON KỶ NIỆM 40 NĂM • KHÁNH THÀNH 28/08/2006 ✦
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                TƯỢNG ĐÀI ĐỨC THÁNH TRẦN • HƯNG ĐẠO ĐẠI VƯƠNG TRẦN QUỐC TUẤN
              </h2>
              <div className="text-sm text-[#ffd988] font-serif italic">
                Linh hồn, khí phách và niềm tự hào của các thế hệ thầy và trò Trường THPT A Trần Hưng Đạo
              </div>
            </div>

            {/* Sacred Quotes Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-black/50 border border-[#d4af37]/40 space-y-1.5">
                <span className="text-[11px] font-mono text-[#ffd988] font-bold block uppercase">
                  Ý CHÍ QUẬT CƯỜNG TRƯỚC HỌA XÂM LĂNG
                </span>
                <p className="font-serif italic font-semibold text-sm text-white">
                  &laquo; Bệ hạ chém đầu tôi trước rồi hãy hàng! &raquo;
                </p>
                <span className="text-[11px] text-zinc-400 block">
                  (Lời thề son sắt dâng vua Trần Thánh Tông trong cuộc kháng chiến chống Nguyên Mông)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-black/50 border border-[#d4af37]/40 space-y-1.5">
                <span className="text-[11px] font-mono text-[#ffd988] font-bold block uppercase">
                  KẾ SÁCH GIỮ NƯỚC SÂU RỄ BỀN GỐC
                </span>
                <p className="font-serif italic font-semibold text-sm text-white">
                  &laquo; Khoan thư sức dân để làm kế sâu rễ bền gốc, đó là thượng sách giữ nước. &raquo;
                </p>
                <span className="text-[11px] text-zinc-400 block">
                  (Lời di chúc đại kế trị quốc an dân dâng vua Trần Anh Tông)
                </span>
              </div>
            </div>

            {/* Historical and Sculptural Significance */}
            <div className="p-5 rounded-2xl bg-black/40 border border-zinc-800 text-sm leading-relaxed text-zinc-200 space-y-3 font-serif">
              <h3 className="font-bold text-base text-[#ffd988] font-sans flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ffd988]" />
                Ý Nghĩa Lịch Sử & Nghệ Thuật Điêu Khắc Tượng Đài
              </h3>
              <p>
                Nhân dịp kỷ niệm 40 năm thành lập trường (1966–2006) và đón nhận Bằng khen của Thủ tướng Chính phủ, vào ngày <strong>28/08/2006</strong>, tượng đồng Hưng Đạo Đại vương uy nghiêm chính thức được khánh thành trang trọng tại vị trí trung tâm khuôn viên nhà trường.
              </p>
              <p>
                Tác phẩm được đúc bằng <strong>đồng nguyên khối</strong> theo chuẩn mực điêu khắc tượng đài anh hùng dân tộc:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-zinc-300 pl-2">
                <li>
                  <strong>Tư thế đứng vững như bàn thạch:</strong> Chân đi chiến hài thời Trần, thân khoác chiến bào lộng gió trên sóng nước Bạch Đằng, toát lên phong thái thống lĩnh ba quân đánh tan ba lần xâm lược của đạo quân Nguyên Mông hung hãn nhất thế giới thời bấy giờ.
                </li>
                <li>
                  <strong>Tay phải nâng cuộn Hịch Tướng Sĩ:</strong> Bản hùng văn thiên cổ hiệu triệu tướng sĩ và toàn thể bách tính, kết tinh trí tuệ kiệt xuất, lòng yêu nước nồng nàn và ý chí tự cường bất khuất.
                </li>
                <li>
                  <strong>Tay trái tì chuôi Thượng Phương Bảo Kiếm:</strong> Biểu trưng cho uy quyền tối cao của Quốc công Tiết chế, kỷ cương thép và tinh thần sẵn sàng quyết chiến bảo vệ giang sơn bờ cõi.
                </li>
                <li>
                  <strong>Khôi giáp và Hộ tâm kính mạ vàng:</strong> Tấm gương hộ tâm chạm khắc vân mây và rồng thời Trần, hòa cùng chòm râu dài quyền uy phong thái bậc Thánh nhân bách chiến bách thắng.
                </li>
              </ul>
            </div>

            {/* Bottom Actions & Registry Verification */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-zinc-800">
              <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Nguồn: Biên bản khánh thành tượng đài 28/08/2006 & Kỷ yếu 40 năm</span>
              </div>
              <button
                onClick={() => {
                  setStatueModalOpen(false);
                  setMasterTimelineModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-[#d4af37]/20 hover:bg-[#d4af37]/30 border border-[#d4af37] text-xs font-serif font-bold text-[#ffd988] transition-all cursor-pointer"
              >
                Khám phá Trục thời gian 3 thời kỳ (1974–2026) →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1C: Archival Portrait & Inscriptions of Duc Thanh Tran */}
      {portraitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#142238] border-2 border-[#d4af37] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 text-left text-[#f3ebdd] relative">
            <button
              onClick={() => setPortraitModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#ffd988] text-xs font-mono font-bold tracking-wider">
                ✦ ẢNH TƯ LIỆU TRUYỀN THỐNG NHÀ TRƯỜNG ✦
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
                ẢNH TƯ LIỆU HƯNG ĐẠO ĐẠI VƯƠNG & BIA TƯỢNG ĐỒNG
              </h2>
              <div className="text-xs text-[#ffd988] font-serif italic">
                Quốc công Tiết chế Hưng Đạo Đại Vương Trần Quốc Tuấn (1228 – 1300)
              </div>
            </div>

            {/* Portrait Mat Card */}
            <div className="p-5 rounded-2xl bg-black/50 border border-[#d4af37]/40 space-y-3 font-serif text-sm leading-relaxed text-zinc-200">
              <div className="flex items-center gap-3 pb-2 border-b border-zinc-800">
                <span className="text-2xl">🏛️</span>
                <div>
                  <h4 className="font-bold text-white text-sm">Vị Tướng Kiệt Xuất Của Dân Tộc</h4>
                  <p className="text-xs text-zinc-400">Thiên tài quân sự bách chiến bách thắng thời nhà Trần</p>
                </div>
              </div>

              <p>
                Hưng Đạo Đại Vương Trần Quốc Tuấn là vị anh hùng dân tộc vĩ đại, linh hồn của ba lần kháng chiến đánh tan giặc Nguyên Mông xâm lược (1258, 1285, 1288). Ông để lại cho hậu thế áng thiên cổ hùng văn <em>Hịch Tướng Sĩ</em>, cùng trước tác binh thư bất hủ <em>Binh thư yếu lược</em> và <em>Vạn Kiếp tông bí truyền thư</em>.
              </p>

              <div className="p-3.5 rounded-xl bg-[#142238] border border-[#d4af37]/30 space-y-1">
                <strong className="text-xs text-[#ffd988] font-mono uppercase block">Lời răn dạy muôn đời:</strong>
                <p className="italic text-xs text-zinc-200">
                  &laquo; Chim sẻ, chim cắt muốn bay cao phải có lông cánh; kẻ làm tướng muốn thắng giặc phải được lòng dân. &raquo;
                </p>
              </div>

              <p className="text-xs text-zinc-300">
                Tại Trường THPT A Trần Hưng Đạo, hình ảnh và tư tưởng của Đức Thánh Trần luôn là điểm tựa tâm linh và đạo đức vững chắc, nhắc nhở thầy trò gìn giữ chữ &quot;Đức&quot;, rèn luyện chữ &quot;Tài&quot; để xứng đáng với ngôi trường mang tên Người.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-[11px] font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Nguồn: Tư liệu lưu trữ truyền thống Trường THPT A Trần Hưng Đạo</span>
              </div>
              <button
                onClick={() => {
                  setPortraitModalOpen(false);
                  setStatueModalOpen(true);
                }}
                className="text-xs text-[#ffd988] hover:underline font-serif font-bold"
              >
                Xem chi tiết Tượng đài 2006 →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1D: State Orders & Medals Gallery */}
      {medalsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#142238] border-2 border-[#d4af37] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-left text-[#f3ebdd] relative">
            <button
              onClick={() => setMedalsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#ffd988] text-xs font-mono font-bold tracking-wider">
                ✦ BẢNG VÀNG DANH DỰ • PHẦN THƯỞNG CAO QUÝ (1974–2026) ✦
              </div>
              <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
                {devData.importantMedals.groupTitle}
              </h2>
              <div className="text-xs text-zinc-300 font-serif leading-relaxed">
                {devData.importantMedals.overviewVi}
              </div>
            </div>

            {/* Medals List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {devData.importantMedals.medals.map((med) => (
                <div
                  key={med.id}
                  className="p-4 rounded-2xl bg-black/40 border border-[#d4af37]/40 hover:border-[#ffd988] transition-all space-y-2 relative group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🎖️</span>
                      <div>
                        <h3 className="font-serif font-bold text-sm text-white group-hover:text-[#ffd988] transition-colors">
                          {med.nameVi}
                        </h3>
                        <span className="text-[10px] font-mono text-[#ffd988] block">
                          Năm trao tặng: {med.year} • {med.orderLevel}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs font-serif text-zinc-300 leading-relaxed">
                    {med.descriptionVi}
                  </div>

                  <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
                    <span>Cơ quan trao tặng: <strong>{med.conferringBody}</strong></span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-[#0e1726] border border-zinc-800 text-xs font-mono text-zinc-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                Toàn bộ hồ sơ khen thưởng được đối chiếu xác thực theo Biên niên sử & Lưu trữ Khen thưởng Trường THPT A Trần Hưng Đạo.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1E: Infrastructure & Growth Overview */}
      {growthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#142238] border-2 border-[#b8924b] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-left text-[#f3ebdd] relative">
            <button
              onClick={() => setGrowthModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b8924b]/20 border border-[#b8924b]/40 text-[#ffd988] text-xs font-mono font-bold tracking-wider">
                ✦ TỔNG QUAN KIẾN THIẾT & ĐỔI MỚI (1966–2026) ✦
              </div>
              <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
                HÀNH TRÌNH 60 NĂM ĐỔI MỚI CƠ SỞ VẬT CHẤT & TRƯỜNG LỚP
              </h2>
              <div className="text-sm text-[#ffd988] font-serif italic">
                Từ mái trường tranh tre sơ tán đến ngôi trường đạt chuẩn quốc gia khang trang, hiện đại
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-zinc-800 text-sm leading-relaxed text-zinc-200 space-y-3 font-serif">
              <p>
                Khởi đầu từ <strong>tháng 6/1966</strong> tại đình Lang Xá (xã Mỹ Hưng, huyện Mỹ Lộc) với những lớp học tranh tre, vách đất, hầm hào trú ẩn dưới làn bom đạn khốc liệt của chiến tranh phá hoại miền Bắc, Trường THPT A Trần Hưng Đạo đã trải qua <strong>5 lần di chuyển địa điểm gian nan</strong> nhưng ngọn lửa dạy tốt, học tốt chưa từng bao giờ tắt.
              </p>
              <p>
                Đến <strong>tháng 10/1974</strong>, trường chính thức quy về một mối tại địa chỉ hiện nay (số 75/203 đường Trần Thái Tông, phường Lộc Vượng, thành phố Nam Định). Tại mảnh đất địa linh nhân kiệt này, trường đã bước vào kỷ nguyên kiến thiết kiên cố:
              </p>
              <ul className="list-disc list-inside space-y-2 text-xs text-zinc-300 pl-2">
                <li>
                  <strong>Giai đoạn 1974–1997:</strong> Dỡ bỏ các lớp học tạm bợ, xây dựng các dãy nhà học 2 tầng, 3 tầng đầu tiên; chính thức mang tên vị Anh hùng dân tộc Trần Hưng Đạo (1982).
                </li>
                <li>
                  <strong>Giai đoạn 1997–2016:</strong> Nâng cấp phòng thực hành tin học, hóa sinh, sân giáo dục thể chất; khánh thành tượng đài đồng Hưng Đạo Đại vương (2006); được công nhận Trường Chuẩn Quốc gia (2009).
                </li>
                <li>
                  <strong>Giai đoạn 2016–2026:</strong> Hoàn thành chuyển đổi số toàn diện; khánh thành và đưa vào sử dụng <strong>Tòa nhà 4 tầng với 33 phòng học kiên cố hiện đại</strong> (năm học 2024–2025); 100% phòng học trang bị màn hình tương tác thông minh, sẵn sàng cho kỷ nguyên phát triển số.
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-zinc-800">
              <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Nguồn: Kỷ yếu 60 năm & Biên niên sử cơ sở vật chất nhà trường</span>
              </div>
              <button
                onClick={() => {
                  setGrowthModalOpen(false);
                  teleportToArea('era3');
                }}
                className="px-4 py-2 rounded-xl bg-[#b8924b]/20 hover:bg-[#b8924b]/30 border border-[#b8924b] text-xs font-serif font-bold text-[#ffd988] transition-all cursor-pointer"
              >
                Khám phá Mô hình Nhà 4 tầng (2024–2025) →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Master Timeline Overview */}
      {masterTimelineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#142238] border-2 border-[#b8924b] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-left text-[#f3ebdd] relative">
            <button
              onClick={() => setMasterTimelineModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-mono text-[#ffd988] uppercase tracking-wider block">
                TRỤC THỜI GIAN ĐIÊU KHẮC (MASTER TIMELINE)
              </span>
              <h2 className="text-2xl font-serif font-bold text-white">
                HÀNH TRÌNH 3 THỜI KỲ PHÁT TRIỂN (1974–2026)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Era 1 */}
              <div className="p-4 rounded-2xl bg-black/40 border border-[#b8924b]/40 space-y-2">
                <span className="text-[11px] font-mono text-[#ffd988] font-bold block">
                  THỜI KỲ 1 (1974–1997)
                </span>
                <h3 className="font-serif font-bold text-base text-white">
                  Ổn Định & Khẳng Định Vị Thế
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Chuyển về Lộc Vượng, chính thức mang tên Trường THPT Trần Hưng Đạo (1982), đón nhận Huân chương Lao động hạng Ba (1991) và hạng Nhì (1996).
                </p>
              </div>

              {/* Era 2 */}
              <div className="p-4 rounded-2xl bg-black/40 border border-[#b8924b]/40 space-y-2">
                <span className="text-[11px] font-mono text-[#ffd988] font-bold block">
                  THỜI KỲ 2 (1997–2016)
                </span>
                <h3 className="font-serif font-bold text-base text-white">
                  Bứt Phá & Trưởng Thành
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Huân chương Lao động hạng Nhất (2000), Tượng đài 2006, Top 37 trường THPT toàn quốc (2007), Chuẩn Quốc gia (2009) và Huân chương Độc lập (2011).
                </p>
              </div>

              {/* Era 3 */}
              <div className="p-4 rounded-2xl bg-black/40 border border-[#b8924b]/40 space-y-2">
                <span className="text-[11px] font-mono text-[#ffd988] font-bold block">
                  THỜI KỲ 3 (2016–2026)
                </span>
                <h3 className="font-serif font-bold text-base text-white">
                  Kiến Tạo Tương Lai & Đổi Mới
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Tòa nhà 4 tầng 33 phòng (2024), tên gọi THPT A Trần Hưng Đạo (7/2025), Cờ thi đua Chính phủ và Đại lễ Kỷ niệm 60 năm thành lập trường (2026).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Statistics Comparison Modal */}
      {statsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#142238] border-2 border-[#b8924b] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 text-left text-[#f3ebdd] relative">
            <button
              onClick={() => setStatsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
              {devData.statistics.titleVi}
            </h2>

            <div className="space-y-3">
              {devData.statistics.snapshots.map((snap, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-black/30 border border-zinc-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-[#ffd988]">{snap.year}</span>
                    <span className="text-xs font-mono text-zinc-400">
                      {snap.classesCount} LỚP • {snap.studentsCount} HỌC SINH
                    </span>
                  </div>
                  <div className="font-serif font-semibold text-white text-sm">{snap.title}</div>
                  <ul className="text-xs text-zinc-300 space-y-0.5 list-disc list-inside">
                    {snap.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                  <div className="text-[10px] font-mono text-zinc-500 pt-1">
                    Nguồn: {snap.sourceNote}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Leadership Heritage Modal */}
      {leadershipModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#142238] border-2 border-[#b8924b] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 text-left text-[#f3ebdd] relative">
            <button
              onClick={() => setLeadershipModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-mono text-[#ffd988] uppercase tracking-wider block">
                DANH BỘ LÃNH ĐẠO NHÀ TRƯỜNG
              </span>
              <h2 className="text-2xl font-serif font-bold text-white">
                {devData.leadershipHeritage.titleVi}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {devData.leadershipHeritage.principals.map((ldr) => (
                <div key={ldr.order} className="p-3.5 rounded-xl bg-black/40 border border-[#b8924b]/30 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#ffd988] font-bold">#{ldr.order}</span>
                    <span className="text-zinc-400">{ldr.period}</span>
                  </div>
                  <div className="font-serif font-bold text-white text-sm">{ldr.name}</div>
                  <div className="text-[11px] text-[#d9bd79]">{ldr.role}</div>
                  <div className="text-[11px] text-zinc-300 leading-relaxed pt-1">{ldr.noteVi}</div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-[#0e1726] border border-zinc-800 text-xs text-zinc-400 font-mono">
              <strong>Ghi chú lịch sử:</strong> {devData.leadershipHeritage.historicalAssignmentNote}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Digital Transformation Modal */}
      {digitalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#142238] border-2 border-[#b8924b] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 text-left text-[#f3ebdd] relative">
            <button
              onClick={() => setDigitalModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
              {devData.digitalTransformation.titleVi}
            </h2>

            <div className="space-y-3 text-xs sm:text-sm text-zinc-300">
              <div className="p-3 rounded-xl bg-black/30 border border-zinc-800">
                <strong className="text-[#ffd988] block mb-1">Quản lý giáo án & Sổ điểm điện tử:</strong>
                <p>{devData.digitalTransformation.onlineLessonPlanning}</p>
              </div>

              <div className="p-3 rounded-xl bg-black/30 border border-zinc-800">
                <strong className="text-[#ffd988] block mb-1">Bồi dưỡng trực tuyến LMS:</strong>
                <p>{devData.digitalTransformation.lmsTraining}</p>
              </div>

              <div className="p-3 rounded-xl bg-black/30 border border-zinc-800">
                <strong className="text-[#ffd988] block mb-1">Nghiên cứu bài học chuyên môn:</strong>
                <p>{devData.digitalTransformation.professionalStudy}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: Values and Motto Modal */}
      {valuesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl bg-[#142238] border-2 border-[#b8924b] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-4 text-left text-[#f3ebdd] relative">
            <button
              onClick={() => setValuesModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-mono text-[#ffd988] uppercase tracking-wider block">
              PHƯƠNG CHÂM TRUYỀN THỐNG
            </span>
            <h2 className="text-2xl font-serif font-bold text-white">
              &quot;{devData.valuesAndMotto.motto}&quot;
            </h2>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {devData.valuesAndMotto.coreValues.map((val, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-black/40 border border-[#b8924b]/40 text-xs font-serif font-bold text-[#ffd988] text-center">
                  ✦ {val}
                </div>
              ))}
            </div>

            <p className="text-xs text-zinc-300 font-serif leading-relaxed pt-2">
              {devData.valuesAndMotto.explanationVi}
            </p>
          </div>
        </div>
      )}

      {/* MODAL 7: Current School Organization Modal */}
      {orgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#142238] border-2 border-[#b8924b] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 text-left text-[#f3ebdd] relative">
            <button
              onClick={() => setOrgModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-mono text-[#ffd988] uppercase tracking-wider block">
                CƠ CẤU TỔ CHỨC HIỆN NAY (2025–2026)
              </span>
              <h2 className="text-2xl font-serif font-bold text-white">
                {devData.currentOrganization.titleVi}
              </h2>
            </div>

            {/* Principal & Vice Principals */}
            <div className="p-4 rounded-2xl bg-black/40 border border-[#b8924b]/40 space-y-3">
              <div className="flex items-center gap-2 text-[#ffd988] font-mono text-xs uppercase tracking-wider font-bold">
                <Users className="w-4 h-4" />
                <span>BAN GIÁM HIỆU NHÀ TRƯỜNG</span>
              </div>
              <div className="p-3 rounded-xl bg-[#142238] border border-[#b8924b]/30">
                <div className="text-base font-serif font-bold text-white">
                  {devData.currentOrganization.principal}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {devData.currentOrganization.vicePrincipals.map((vp, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#142238]/80 border border-zinc-700/60 text-sm font-serif text-zinc-200">
                    {vp}
                  </div>
                ))}
              </div>
            </div>

            {/* 7 Departments */}
            <div className="space-y-2.5">
              <span className="text-xs font-mono text-[#ffd988] uppercase tracking-wider block font-bold">
                CÁC TỔ CHUYÊN MÔN VÀ HÀNH CHÍNH (7 TỔ)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {devData.currentOrganization.departments.map((dept, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-black/40 border border-zinc-800 space-y-1 hover:border-[#b8924b]/40 transition-colors">
                    <div className="font-serif font-bold text-white text-sm">{dept.name}</div>
                    <div className="text-xs text-[#ffd988] font-medium">{dept.leader}</div>
                    <div className="text-[11px] text-zinc-400 font-mono">{dept.noteVi}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0e1726] border border-zinc-800 text-[11px] text-zinc-400 font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Nguồn: Danh bạ tổ chức và nhân sự Trường THPT A Trần Hưng Đạo năm học 2025–2026</span>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE MOVEMENT ON-SCREEN CONTROLS */}
      <div className="md:hidden absolute bottom-20 right-4 z-20 pointer-events-auto flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-[#142238]/80 border border-[#b8924b]/40 backdrop-blur-md">
        <button
          onPointerDown={() => { keysDown.current['w'] = true; }}
          onPointerUp={() => { keysDown.current['w'] = false; }}
          className="w-10 h-10 rounded-xl bg-black/40 border border-zinc-700 flex items-center justify-center text-[#ffd988] active:bg-[#b8924b]/30"
          title="Tiến lên"
        >
          ▲
        </button>
        <div className="flex items-center gap-1.5">
          <button
            onPointerDown={() => { keysDown.current['a'] = true; }}
            onPointerUp={() => { keysDown.current['a'] = false; }}
            className="w-10 h-10 rounded-xl bg-black/40 border border-zinc-700 flex items-center justify-center text-[#ffd988] active:bg-[#b8924b]/30"
            title="Sang trái"
          >
            ◀
          </button>
          <button
            onPointerDown={() => { keysDown.current['s'] = true; }}
            onPointerUp={() => { keysDown.current['s'] = false; }}
            className="w-10 h-10 rounded-xl bg-black/40 border border-zinc-700 flex items-center justify-center text-[#ffd988] active:bg-[#b8924b]/30"
            title="Lùi lại"
          >
            ▼
          </button>
          <button
            onPointerDown={() => { keysDown.current['d'] = true; }}
            onPointerUp={() => { keysDown.current['d'] = false; }}
            className="w-10 h-10 rounded-xl bg-black/40 border border-zinc-700 flex items-center justify-center text-[#ffd988] active:bg-[#b8924b]/30"
            title="Sang phải"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};
