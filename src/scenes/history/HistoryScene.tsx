import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { historyRoomConfig, HistoryZone } from './config/historyRoomConfig';
import { createHistoryMaterials } from './materials/HistoryMaterials';
import {
  buildHistoryRoomArchitecture,
  HistorySceneElements,
  InteractiveExhibitItem,
} from './components/HistoryArchitecture';
import { ZONE_1_HISTORY_CONTENT, SIX_ZONES_SUMMARY } from './config/historyContentData';
import { useHistoryContent } from '../../services/historyContentService';
import { historyAudio } from './audio/HistoryAudio';
import {
  Volume2,
  VolumeX,
  Compass,
  ArrowLeft,
  BookOpen,
  Award,
  Users,
  MapPin,
  Clock,
  X,
  ChevronRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  FileText,
  Navigation,
  Layers,
  Flame,
  LayoutGrid,
  Copy,
  Check,
} from 'lucide-react';

interface Props {
  onReturnToLobby: () => void;
  onOpenCmd?: () => void;
  onNavigateDestination?: (roomId: string) => void;
}

export const HistoryScene: React.FC<Props> = ({
  onReturnToLobby,
  onOpenCmd,
  onNavigateDestination,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const [isMuted, setIsMuted] = useState(historyAudio.getMutedState());
  const [currentZone, setCurrentZone] = useState<HistoryZone>(historyRoomConfig.zones[0]);
  const [activeNearbyExhibit, setActiveNearbyExhibit] = useState<InteractiveExhibitItem | null>(null);
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [overviewModalOpen, setOverviewModalOpen] = useState(false);
  const [evacuationModalOpen, setEvacuationModalOpen] = useState(false);
  const [sixZonesModalOpen, setSixZonesModalOpen] = useState(false);
  const [martyrsModalOpen, setMartyrsModalOpen] = useState(false);
  const [fourSidesModalOpen, setFourSidesModalOpen] = useState(false);
  const [activeSideTab, setActiveSideTab] = useState<'all' | 'side_1' | 'side_2' | 'side_3' | 'side_4'>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const elementsRef = useRef<HistorySceneElements | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Camera & Player movement
  const playerPos = useRef(new THREE.Vector3(...historyRoomConfig.camera.initialPosition));
  const playerVel = useRef(new THREE.Vector3(0, 0, 0));
  const cameraRotation = useRef({ yaw: 0, pitch: 0 });
  const keysDown = useRef<{ [key: string]: boolean }>({});
  const isPointerDown = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  const toggleAudio = useCallback(() => {
    const muted = historyAudio.toggleMute();
    setIsMuted(muted);
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const teleportToSide = (side: 'side_1' | 'side_2' | 'side_3' | 'side_4') => {
    historyAudio.playClick();
    if (side === 'side_1') {
      // Phía Nam: Z = 14.78m, X = 0, camera nhìn về phía Nam (+Z)
      playerPos.current.set(0, 1.6, 11.8);
      cameraRotation.current = { yaw: 0, pitch: 0 };
    } else if (side === 'side_2') {
      // Phía Tây: X = -5.82m, Z = 1.2m, camera nhìn về phía Tây (-X)
      playerPos.current.set(-2.8, 1.6, 1.2);
      cameraRotation.current = { yaw: -Math.PI / 2, pitch: 0 };
    } else if (side === 'side_3') {
      // Phía Đông: X = +5.82m, Z = 1.2m, camera nhìn về phía Đông (+X)
      playerPos.current.set(2.8, 1.6, 1.2);
      cameraRotation.current = { yaw: Math.PI / 2, pitch: 0 };
    } else if (side === 'side_4') {
      // Phía Bắc: X = -3.1m, Z = -14.76m, camera nhìn về phía Bắc (-Z)
      playerPos.current.set(-3.1, 1.6, -11.8);
      cameraRotation.current = { yaw: Math.PI, pitch: 0 };
    }
    setFourSidesModalOpen(false);
  };

  const openExhibitModal = useCallback((exhibit: InteractiveExhibitItem) => {
    historyAudio.playExhibitInspect();
    if (exhibit.type === 'side_1_foundation') {
      setActiveSideTab('side_1');
      setFourSidesModalOpen(true);
    } else if (exhibit.type === 'side_2_birth') {
      setActiveSideTab('side_2');
      setFourSidesModalOpen(true);
    } else if (exhibit.type === 'side_3_wartime') {
      setActiveSideTab('side_3');
      setFourSidesModalOpen(true);
    } else if (exhibit.type === 'side_4_relocations') {
      setActiveSideTab('side_4');
      setFourSidesModalOpen(true);
    } else if (exhibit.type === 'wartime_map') {
      setEvacuationModalOpen(true);
    } else if (exhibit.type === 'martyrs_monument' || exhibit.id === 'martyrs_memorial_stele') {
      setMartyrsModalOpen(true);
    } else {
      setInspectModalOpen(true);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    historyAudio.ensureRunning();

    // 1. Scene setup - Luxurious Golden Exhibition with ~30% deep museum black contrast
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x221a12);
    scene.fog = new THREE.FogExp2(0x1a130c, 0.016);
    sceneRef.current = scene;

    // 2. Camera setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(historyRoomConfig.camera.fov, width / height, 0.1, 100);
    camera.position.copy(playerPos.current);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting & Environment - 30% Deeper Dark Museum Illumination
    const ambientLight = new THREE.AmbientLight(0xffeed6, 1.25);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffeed6, 0x362414, 0.9);
    scene.add(hemiLight);

    // Warm museum directional sunlight beam for subtle golden architectural depth
    const galleryKeyLight = new THREE.DirectionalLight(0xffeec6, 1.05);
    galleryKeyLight.position.set(4, 8, 4);
    galleryKeyLight.castShadow = true;
    galleryKeyLight.shadow.mapSize.width = 1024;
    galleryKeyLight.shadow.mapSize.height = 1024;
    scene.add(galleryKeyLight);

    // Warm ceiling recessed downlights along axis
    [-11, -7, -3, 1, 5, 9, 13].forEach((zPos) => {
      const ceilingPoint = new THREE.PointLight(0xffdfa8, 1.45, 13, 1.6);
      ceilingPoint.position.set(0, historyRoomConfig.dimensions.height - 0.35, zPos);
      scene.add(ceilingPoint);
    });

    // 5. Build Architecture
    const materials = createHistoryMaterials();
    const elements = buildHistoryRoomArchitecture(materials);
    elementsRef.current = elements;
    scene.add(elements.masterGroup);

    // 6. Window Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 7. Keyboard Input
    const handleKeyDown = (e: KeyboardEvent) => {
      keysDown.current[e.key.toLowerCase()] = true;
      if (e.key.toLowerCase() === 'e' || e.key === 'Enter') {
        if (activeNearbyExhibit) {
          openExhibitModal(activeNearbyExhibit);
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysDown.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 8. Mouse / Touch Look Controls
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isPointerDown.current = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      lastPointer.current = { x: clientX, y: clientY };
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isPointerDown.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - lastPointer.current.x;
      const deltaY = clientY - lastPointer.current.y;
      lastPointer.current = { x: clientX, y: clientY };

      const lookSpeed = 0.0028;
      cameraRotation.current.yaw -= deltaX * lookSpeed;
      cameraRotation.current.pitch = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, cameraRotation.current.pitch - deltaY * lookSpeed)
      );
    };

    const handlePointerUp = () => {
      isPointerDown.current = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handlePointerDown);
    dom.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    dom.addEventListener('touchstart', handlePointerDown, { passive: true });
    dom.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // 9. Main Animation Loop
    let lastTime = performance.now();
    const clock = new THREE.Clock();

    const animate = (time: number) => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;
      const elapsedTime = clock.getElapsedTime();

      // Dynamic rotation on 1966 Black Hole Monument golden accretion bands & celestial particles
      if (elements.monument1966Ring) {
        elements.monument1966Ring.rotation.z = elapsedTime * 0.28;
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
        elements.orbitParticles.rotation.y = elapsedTime * 0.03;
      }

      // Movement Physics
      const forward = new THREE.Vector3(-Math.sin(cameraRotation.current.yaw), 0, -Math.cos(cameraRotation.current.yaw));
      const right = new THREE.Vector3(Math.cos(cameraRotation.current.yaw), 0, -Math.sin(cameraRotation.current.yaw));

      const inputVector = new THREE.Vector3(0, 0, 0);
      if (keysDown.current['w'] || keysDown.current['arrowup']) inputVector.add(forward);
      if (keysDown.current['s'] || keysDown.current['arrowdown']) inputVector.sub(forward);
      if (keysDown.current['d'] || keysDown.current['arrowright']) inputVector.add(right);
      if (keysDown.current['a'] || keysDown.current['arrowleft']) inputVector.sub(right);

      if (inputVector.lengthSq() > 0) {
        inputVector.normalize().multiplyScalar(historyRoomConfig.camera.moveSpeed);
      }

      // Smooth velocity interpolation
      playerVel.current.lerp(inputVector, 0.15);
      playerPos.current.addScaledVector(playerVel.current, delta);

      // Boundaries & Collision Box
      const halfW = historyRoomConfig.dimensions.width / 2 - historyRoomConfig.camera.collisionPadding;
      const halfL = historyRoomConfig.dimensions.length / 2 - historyRoomConfig.camera.collisionPadding;
      playerPos.current.x = Math.max(-halfW, Math.min(halfW, playerPos.current.x));
      playerPos.current.z = Math.max(-halfL, Math.min(halfL, playerPos.current.z));
      playerPos.current.y = historyRoomConfig.camera.height;

      // Update camera matrix
      camera.position.copy(playerPos.current);
      const euler = new THREE.Euler(cameraRotation.current.pitch, cameraRotation.current.yaw, 0, 'YXZ');
      camera.quaternion.setFromEuler(euler);

      // Check current active zone
      const pz = playerPos.current.z;
      const px = playerPos.current.x;
      const matchedZone = historyRoomConfig.zones.find(
        (z) => pz >= z.bounds.minZ && pz <= z.bounds.maxZ && px >= z.bounds.minX && px <= z.bounds.maxX
      );
      if (matchedZone && matchedZone.id !== currentZone.id) {
        setCurrentZone(matchedZone);
        historyAudio.playZoneChime();
      }

      // Proximity check for nearest interactive exhibit
      let closest: InteractiveExhibitItem | null = null;
      let closestDist = 2.8; // interaction distance in meters
      for (const exhibit of elements.interactiveExhibits) {
        const dist = playerPos.current.distanceTo(new THREE.Vector3(...exhibit.position));
        if (dist < closestDist) {
          closest = exhibit;
          closestDist = dist;
        }
      }
      setActiveNearbyExhibit(closest);

      renderer.render(scene, camera);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      dom.removeEventListener('mousedown', handlePointerDown);
      dom.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      dom.removeEventListener('touchstart', handlePointerDown);
      dom.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const content = useHistoryContent();

  // Live dynamic update of mentor portrait textures when images are added via CMD Admin
  useEffect(() => {
    if (!elementsRef.current) return;
    const { mentor1Mesh, mentor2Mesh } = elementsRef.current;
    const leader1Img = (content.foundationPeople?.leaders?.[0] as any)?.imageUrl;
    const leader2Img = (content.foundationPeople?.leaders?.[1] as any)?.imageUrl;

    if (mentor1Mesh && leader1Img) {
      new THREE.TextureLoader().load(leader1Img, (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        (mentor1Mesh.material as THREE.MeshStandardMaterial).map = tex;
        (mentor1Mesh.material as THREE.MeshStandardMaterial).needsUpdate = true;
      });
    }

    if (mentor2Mesh && leader2Img) {
      new THREE.TextureLoader().load(leader2Img, (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        (mentor2Mesh.material as THREE.MeshStandardMaterial).map = tex;
        (mentor2Mesh.material as THREE.MeshStandardMaterial).needsUpdate = true;
      });
    }
  }, [content.foundationPeople]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#faf5ea] select-none text-[#241306]">
      {/* 3D Canvas Mount Point */}
      <div ref={containerRef} className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing" />

      {/* Top HUD Header */}
      <div className="absolute top-0 inset-x-0 z-20 p-4 sm:p-6 flex items-center justify-between pointer-events-none bg-gradient-to-b from-[#2a1708]/85 via-[#2a1708]/40 to-transparent">
        {/* Left: School Title & Period */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={onReturnToLobby}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#fffdf8]/90 hover:bg-white border-2 border-[#d4af37]/80 text-xs font-semibold text-[#3d230e] hover:text-[#1c0c03] backdrop-blur-md transition-all cursor-pointer shadow-lg shadow-amber-950/20"
          >
            <ArrowLeft className="w-4 h-4 text-[#b8860b]" />
            <span className="hidden sm:inline">Về Sảnh Chính</span>
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#d4af37]/30 text-[#ffe5a3] border border-[#d4af37]/70">
                {historyRoomConfig.periodLabel}
              </span>
              <h1 className="text-xs sm:text-sm font-bold tracking-wider text-amber-50 font-serif drop-shadow">
                {historyRoomConfig.titleVi}
              </h1>
            </div>
            <span className="text-[11px] text-[#ffd988] hidden sm:block font-serif italic">
              {content.overview.periodName}
            </span>
          </div>
        </div>

        {/* Right: Actions & Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto flex-wrap justify-end">
          <button
            onClick={() => {
              setActiveSideTab('all');
              setFourSidesModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f5d061] to-[#d4af37] text-xs font-bold text-[#241205] border-2 border-[#fff0b8] backdrop-blur-md transition-all cursor-pointer shadow-xl shadow-amber-950/30 hover:brightness-105"
            title="Bố cục 4 văn bản đặt 4 bên (Đông - Tây - Nam - Bắc)"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#241205]" />
            <span>4 Văn bản (4 Bên)</span>
          </button>

          <button
            onClick={() => setOverviewModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#fffdf8]/90 hover:bg-white border-2 border-[#d4af37]/70 text-xs font-semibold text-[#3d230e] backdrop-blur-md transition-all cursor-pointer shadow-lg shadow-amber-950/15"
            title="Xem toàn văn tư liệu chuẩn 1966–1975"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#b8860b]" />
            <span className="hidden sm:inline">Toàn văn (1.1–1.5)</span>
          </button>

          <button
            onClick={() => setMartyrsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 border-2 border-red-500/80 text-xs text-red-100 hover:text-white backdrop-blur-md transition-all cursor-pointer shadow-lg"
            title="Bia Tưởng niệm Thầy & Trò Nhập ngũ (1.5)"
          >
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">Liệt sĩ (1.5)</span>
          </button>

          <button
            onClick={() => setEvacuationModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#fffdf8]/90 hover:bg-white border-2 border-[#d4af37]/70 text-xs text-[#3d230e] hover:text-[#b8860b] backdrop-blur-md transition-all cursor-pointer shadow-lg"
            title="5 lần di chuyển & Sơ tán"
          >
            <Navigation className="w-3.5 h-3.5 text-[#b8860b]" />
            <span className="hidden md:inline">5 Lần di chuyển</span>
          </button>

          <button
            onClick={() => setSixZonesModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#fffdf8]/90 hover:bg-white border-2 border-[#d4af37]/70 text-xs text-[#3d230e] hover:text-[#b8860b] backdrop-blur-md transition-all cursor-pointer shadow-lg"
            title="Tổng hợp 6 Phân khu số"
          >
            <Layers className="w-3.5 h-3.5 text-[#b8860b]" />
            <span className="hidden sm:inline">6 Phân khu</span>
          </button>

          <button
            onClick={toggleAudio}
            className="p-1.5 sm:p-2 rounded-xl bg-[#fffdf8]/90 hover:bg-white border-2 border-[#d4af37]/70 text-[#3d230e] hover:text-[#b8860b] backdrop-blur-md transition-all cursor-pointer shadow-lg"
            title={isMuted ? 'Bật âm thanh không gian' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-zinc-500" /> : <Volume2 className="w-4 h-4 text-[#b8860b]" />}
          </button>

          {onOpenCmd && (
            <button
              onClick={onOpenCmd}
              className="px-2.5 py-1.5 rounded-xl bg-[#fffdf8]/90 hover:bg-white border border-[#d4af37]/70 text-xs font-mono text-[#8a5b1d] hover:text-[#5e380a] backdrop-blur-md transition-all cursor-pointer shadow-md"
              title="Quản trị CMD"
            >
              CMD
            </button>
          )}
        </div>
      </div>

      {/* 4 Sides Quick Navigation Dock (Floating Top-Center) - Luxurious Golden Gallery Ribbon */}
      <div className="absolute top-18 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
        <div className="flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-2xl bg-[#fffdf8]/95 border-2 border-[#d4af37] shadow-2xl shadow-amber-950/20 backdrop-blur-md">
          <span className="hidden lg:flex items-center gap-1 px-2.5 text-[11px] font-mono text-[#8f5a1a] font-bold uppercase">
            <Compass className="w-3.5 h-3.5 text-[#b8860b]" />
            4 BÊN:
          </span>

          <button
            onClick={() => teleportToSide('side_1')}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-xl text-[11px] font-medium bg-[#fef8ea] hover:bg-[#faeed3] text-[#542d0c] border border-[#d4af37]/60 hover:border-[#b8860b] transition-all cursor-pointer shadow-sm"
            title="Bay đến BÊN 1 (Phía Nam) • 1.1 Thông tin thành lập"
          >
            <span className="font-bold text-[#b8860b]">Nam</span>
            <span className="hidden sm:inline text-[#6d3e18]">• 1.1 Thành lập</span>
          </button>

          <button
            onClick={() => teleportToSide('side_2')}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-xl text-[11px] font-medium bg-[#eff6ff] hover:bg-[#dbeafe] text-[#1e3a8a] border border-[#93c5fd]/80 hover:border-blue-400 transition-all cursor-pointer shadow-sm"
            title="Bay đến BÊN 2 (Phía Tây) • 1.2 Trường ra đời năm 1966"
          >
            <span className="font-bold text-blue-700">Tây</span>
            <span className="hidden sm:inline text-blue-900">• 1.2 Ra đời 1966</span>
          </button>

          <button
            onClick={() => teleportToSide('side_3')}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-xl text-[11px] font-medium bg-[#fff7ed] hover:bg-[#ffedd5] text-[#7c2d12] border border-[#fdba74]/80 hover:border-orange-400 transition-all cursor-pointer shadow-sm"
            title="Bay đến BÊN 3 (Phía Đông) • 1.3 Dạy & học trong chiến tranh"
          >
            <span className="font-bold text-orange-700">Đông</span>
            <span className="hidden sm:inline text-orange-900">• 1.3 Thời chiến</span>
          </button>

          <button
            onClick={() => teleportToSide('side_4')}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-xl text-[11px] font-medium bg-[#f0fdf4] hover:bg-[#dcfce7] text-[#065f46] border border-[#86efac]/80 hover:border-emerald-400 transition-all cursor-pointer shadow-sm"
            title="Bay đến BÊN 4 (Phía Bắc) • 1.4 Năm lần di chuyển"
          >
            <span className="font-bold text-emerald-700">Bắc</span>
            <span className="hidden sm:inline text-emerald-900">• 1.4 5 lần dời</span>
          </button>

          <button
            onClick={() => {
              setActiveSideTab('all');
              setFourSidesModalOpen(true);
            }}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-xl text-[11px] font-bold bg-gradient-to-r from-[#d4af37] to-[#f5d061] text-[#241205] border border-[#ffd988] shadow-md transition-all cursor-pointer"
            title="Mở bảng bố cục 4 văn bản đồng thời"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#241205]" />
            <span className="hidden xs:inline">Bố cục 4 bên</span>
          </button>
        </div>
      </div>

      {/* Current Zone Breadcrumb Overlay (Bottom-Center) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center">
        <div className="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full bg-[#fffdf8]/95 border-2 border-[#d4af37]/70 text-[#2b1709] backdrop-blur-md shadow-2xl shadow-amber-950/20">
          <Compass className="w-3.5 h-3.5 text-[#b8860b] animate-pulse" />
          <span className="text-[11px] font-mono text-[#8f5a1a] uppercase font-bold tracking-wider">
            {currentZone.code}: {currentZone.nameVi}
          </span>
          <span className="text-[#c29b4e] text-[10px] hidden sm:inline">•</span>
          <span className="text-[11px] text-[#4a2b13] font-serif hidden sm:inline">{currentZone.subtitleVi}</span>
        </div>
        <p className="text-[10px] text-[#7d5029] mt-1 font-mono tracking-tight drop-shadow">
          Dùng phím W, A, S, D hoặc Mũi tên để di chuyển • Kéo chuột để xoay góc nhìn
        </p>
      </div>

      {/* Interactive Exhibit Trigger Prompt (Floating when close) */}
      {activeNearbyExhibit && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
          <div className="px-5 py-3 rounded-2xl bg-[#fffdf7]/98 border-2 border-[#d4af37] shadow-2xl shadow-amber-950/30 backdrop-blur-md text-center space-y-1.5 max-w-sm sm:max-w-md">
            <div className="flex items-center justify-center gap-1.5 text-[#8f5a1a] text-xs font-bold uppercase tracking-wider font-serif">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{activeNearbyExhibit.titleVi}</span>
            </div>
            <p className="text-[11px] text-[#543015]">{activeNearbyExhibit.subtitleVi}</p>
            <div className="pt-1 flex items-center justify-center gap-2">
              <button
                onClick={() => openExhibitModal(activeNearbyExhibit)}
                className="inline-flex items-center gap-1.5 px-4.5 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f5d061] to-[#d4af37] text-[#241205] text-xs font-bold shadow-md hover:brightness-105 transition-all cursor-pointer border border-[#ffe59e]"
              >
                <span>Xem tư liệu chi tiết (Phím E)</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#241205]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Exhibit Detailed Inspector */}
      {inspectModalOpen && activeNearbyExhibit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-[#fdfaf2] border-2 border-[#d4af37] rounded-3xl shadow-2xl shadow-amber-950/40 overflow-hidden p-6 space-y-4 max-h-[85vh] flex flex-col text-[#241205]">
            <div className="flex items-start justify-between pb-3 border-b border-[#e4cca0]">
              <div className="space-y-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#d4af37]/25 text-[#73430c] border border-[#d4af37]/60 uppercase font-bold">
                  {activeNearbyExhibit.type}
                </span>
                <h3 className="text-base font-bold text-[#2b160b] font-serif">
                  {activeNearbyExhibit.titleVi}
                </h3>
                <p className="text-xs text-[#704620]">{activeNearbyExhibit.subtitleVi}</p>
              </div>
              <button
                onClick={() => setInspectModalOpen(false)}
                className="p-1 rounded-lg text-[#7a502c] hover:text-[#26150a] hover:bg-[#faebd4] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-xs text-[#241205] leading-relaxed pr-1">
              {/* Exhibit Content Rendering based on type */}

              {/* SIDE 1: 1.1 Thông tin thành lập */}
              {(activeNearbyExhibit.type === 'side_1_foundation' || activeNearbyExhibit.id === 'side_1_foundation') && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-[#fffdf8] border-2 border-[#d4af37] space-y-3 shadow-md">
                    <div className="flex items-center justify-between pb-2 border-b border-[#e4cca0]">
                      <span className="font-bold text-[#4c260e] text-xs uppercase tracking-wide font-serif">
                        BÊN 1 (PHÍA NAM) • 1.1 THÔNG TIN THÀNH LẬP
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#faeed6] text-[#73430c] border border-[#d4af37]/60 font-bold">
                        CHỦ TRƯƠNG TỈNH NAM HÀ
                      </span>
                    </div>
                    <div className="divide-y divide-[#eee0c5] text-xs">
                      {content.section1_1_overview.items.map((it, idx) => (
                        <div key={idx} className="py-2 flex flex-col sm:flex-row sm:justify-between gap-1">
                          <span className="font-semibold text-[#542d0c] sm:w-1/3">{it.label}:</span>
                          <span className="text-[#24150b] sm:w-2/3 whitespace-pre-line font-medium">{it.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SIDE 2: 1.2 Trường ra đời năm 1966 */}
              {(activeNearbyExhibit.type === 'side_2_birth' || activeNearbyExhibit.id === 'side_2_birth') && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-[#fffdfb] border-2 border-blue-400 space-y-3 shadow-md">
                    <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                      <span className="font-bold text-blue-950 text-xs uppercase tracking-wide font-serif">
                        BÊN 2 (PHÍA TÂY) • 1.2 TRƯỜNG RA ĐỜI NĂM 1966
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300 font-bold">
                        MÙA THU 1966
                      </span>
                    </div>
                    <p className="text-[#1e293b] leading-relaxed text-xs whitespace-pre-line font-serif p-3 bg-white rounded-xl border border-blue-100 shadow-sm">
                      {content.section1_2_birth1966.content}
                    </p>
                  </div>
                </div>
              )}

              {/* SIDE 3: 1.3 Dạy và học trong chiến tranh */}
              {(activeNearbyExhibit.type === 'side_3_wartime' || activeNearbyExhibit.id === 'side_3_wartime') && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-[#fffdfa] border-2 border-orange-400 space-y-3 shadow-md">
                    <div className="flex items-center justify-between pb-2 border-b border-orange-200">
                      <span className="font-bold text-orange-950 text-xs uppercase tracking-wide font-serif">
                        BÊN 3 (PHÍA ĐÔNG) • 1.3 DẠY VÀ HỌC TRONG CHIẾN TRANH
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-100 text-orange-900 border border-orange-300 font-bold">
                        1966 – 1972
                      </span>
                    </div>
                    <p className="text-[#2b180d] text-xs leading-relaxed font-serif p-3 bg-white rounded-xl border border-orange-100 shadow-sm">
                      {content.section1_3_wartimeTeaching.description}
                    </p>
                    <ul className="space-y-2 text-xs text-[#24150b]">
                      {content.section1_3_wartimeTeaching.bulletPoints.map((bp, i) => (
                        <li key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-orange-200 shadow-sm">
                          <span className="text-orange-600 font-bold mt-0.5">•</span>
                          <span>{bp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* SIDE 4: 1.4 Năm lần di chuyển */}
              {(activeNearbyExhibit.type === 'side_4_relocations' || activeNearbyExhibit.id === 'side_4_relocations') && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-[#fdfefd] border-2 border-emerald-400 space-y-3 shadow-md">
                    <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                      <span className="font-bold text-emerald-950 text-xs uppercase tracking-wide font-serif">
                        BÊN 4 (PHÍA BẮC) • 1.4 NĂM LẦN DI CHUYỂN
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold">
                        1966 – 1974
                      </span>
                    </div>
                    <div className="space-y-2">
                      {content.section1_4_fiveRelocations.chronology.map((st) => (
                        <div key={st.step} className="p-3 rounded-xl bg-white border border-emerald-200 space-y-1 shadow-sm">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center">
                              {st.step}
                            </span>
                            <strong className="text-emerald-800 text-xs">{st.year}</strong>
                            <span className="text-[#24150b] text-xs font-medium">— {st.location}</span>
                          </div>
                          <p className="text-[#374151] text-xs pl-7 leading-relaxed">{st.details}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 rounded-xl bg-[#f0fdf4] border border-emerald-300 text-xs text-emerald-950 space-y-1 shadow-sm">
                      <strong className="text-emerald-900 block font-serif">Năm học 1974–1975 & Đỉnh cao phong trào:</strong>
                      <p>{content.section1_4_fiveRelocations.schoolYear1974_1975}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-emerald-200 text-[11px] text-[#4b5563] space-y-1 shadow-sm">
                      <strong className="text-[#24150b] block mb-1 font-serif">TỔNG KẾT 5 LẦN DI CHUYỂN:</strong>
                      {content.section1_4_fiveRelocations.summaryList.map((s, idx) => (
                        <div key={idx} className="text-[#374151]">{s}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeNearbyExhibit.id === 'foundation_1966_monument' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-[#fffdf8] border-2 border-[#d4af37] space-y-2 text-[#2b180d] shadow-md">
                    <strong className="text-[#4c260e] block font-bold text-xs font-serif">
                      1.1 Thông tin khởi nguồn thành lập:
                    </strong>
                    <ul className="list-disc list-inside space-y-1.5 text-xs text-[#3d230e]">
                      <li><strong>Thời điểm thành lập:</strong> {content.overview.decision}</li>
                      <li><strong>Khai giảng khóa đầu:</strong> {content.overview.openingCeremony}</li>
                      <li><strong>Nơi thành lập:</strong> {content.overview.foundingLocation}</li>
                      <li><strong>Quy mô ngày đầu:</strong> {content.overview.initialScale}</li>
                      <li><strong>Hiệu trưởng đầu tiên:</strong> {content.overview.firstLeadership.principal}</li>
                      <li><strong>Phó Hiệu trưởng đầu tiên:</strong> {content.overview.firstLeadership.vicePrincipal}</li>
                      <li><strong>Tên trường giai đoạn này:</strong> {content.overview.periodName}</li>
                    </ul>
                  </div>
                  <p className="whitespace-pre-line text-[#2b180d] p-3 rounded-xl bg-white border border-[#e4cca0] shadow-sm leading-relaxed">{content.introduction}</p>
                </div>
              )}

              {activeNearbyExhibit.id === 'context_document_charter' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-[#fffdf8] border-2 border-[#d4af37] space-y-2 shadow-md">
                    <span className="font-bold text-[#4c260e] block font-serif">Trường ra đời năm 1966:</span>
                    <p className="whitespace-pre-line text-[#2b180d] text-xs leading-relaxed">{content.introduction}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#fcf8ef] border border-[#d4af37]/60 font-mono text-[11px] text-[#73430c] space-y-1">
                    <div>Lưu trữ: Tỉnh Nam Hà (1966)</div>
                    <div>Tình trạng đối chiếu: ĐÃ XÁC MINH THEO TƯ LIỆU CHUẨN 60 NĂM</div>
                  </div>
                </div>
              )}

              {activeNearbyExhibit.zoneId === 'founding_people' && (
                <div className="space-y-3.5">
                  {/* Lời Giới Thiệu */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#fcf7ee] to-[#f4ebe0] border border-[#d4af37]/80 space-y-1.5 shadow-sm">
                    <span className="text-[10px] font-mono font-bold text-[#8c262e] uppercase tracking-wider block">
                      ✦ Lời giới thiệu • Ban Giám hiệu sáng lập (1966 – 1975)
                    </span>
                    <p className="text-[#3d230e] text-xs leading-relaxed">
                      Mùa thu năm 1966, giữa thời điểm ác liệt của cuộc chiến tranh phá hoại miền Bắc, Trường Cấp III Mỹ Lộc (tiền thân của THPT A Trần Hưng Đạo) được khai sinh tại thôn Lang Xá, xã Mỹ Tiến. Hai vị thầy tiền bối trong Ban Giám hiệu đầu tiên cùng tập thể 3 tổ chuyên môn tiên phong đã kiên cường bám trường bám lớp, vừa dạy học vừa chiến đấu, vượt qua 5 lần di dời gian khổ, đặt nền móng trường tồn cho 60 năm lịch sử tự hào.
                    </p>
                  </div>

                  {/* 2 Chân Dung Vị Thầy Tiền Bối */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-[#4c260e] text-xs font-serif flex items-center justify-between">
                      <span>Hai Vị Thầy Tiền Bối Đặt Nền Móng:</span>
                      <span className="text-[10px] font-mono font-normal text-[#8a5b1d] italic">Ảnh cập nhật qua CMD Admin</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {content.foundationPeople.leaders.slice(0, 2).map((leader, i) => {
                        const customImg = (leader as any).imageUrl;
                        return (
                          <div key={i} className="p-3 rounded-2xl bg-white border-2 border-[#e4cca0] space-y-2 shadow-sm flex flex-col justify-between hover:border-[#d4af37] transition-all">
                            <div className="flex gap-3 items-center">
                              {customImg ? (
                                <img
                                  src={customImg}
                                  alt={leader.name}
                                  className="w-16 h-20 object-cover rounded-xl border border-[#d4af37] shadow-sm flex-shrink-0"
                                />
                              ) : (
                                <div className="w-16 h-20 rounded-xl bg-gradient-to-b from-[#1b2336] to-[#0e1422] border-2 border-[#d4af37] flex flex-col items-center justify-center p-1 text-center flex-shrink-0 shadow-inner">
                                  <span className="text-amber-400 text-base">✦</span>
                                  <span className="text-[8px] text-[#ffd988] font-mono font-bold leading-tight mt-0.5 uppercase">Ảnh Lưu Trữ</span>
                                  <span className="text-[7.5px] text-[#a6b8db] font-sans leading-tight mt-0.5">Thêm qua CMD</span>
                                </div>
                              )}
                              <div className="space-y-0.5 min-w-0">
                                <span className="text-[9.5px] text-[#8a5b1d] font-mono font-bold block uppercase tracking-wide">
                                  {leader.role}
                                </span>
                                <strong className="text-[#2b180d] text-xs block font-serif truncate">
                                  {leader.name}
                                </strong>
                                {leader.note && (
                                  <p className="text-[10px] text-[#553018] leading-tight line-clamp-3">
                                    {leader.note}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3 Tổ Chuyên Môn & Giáo Viên Tiên Phong */}
                  <div className="p-3 rounded-xl bg-[#fcf8ef] border border-[#d4af37]/60 text-[#3d230e] text-[11px] leading-relaxed shadow-sm">
                    <strong className="text-[#2b180d] block mb-1 font-serif">Tập thể cán bộ giáo viên 3 tổ chuyên môn đầu tiên:</strong>
                    {content.foundationPeople.firstTeachers[0]?.note ||
                      'Thầy cô tỏa về từng xóm nhỏ để dạy học và quản lý học sinh; bám trường, bám lớp, vượt qua mưa bom bão đạn bảo vệ tương lai học trò.'}
                  </div>
                </div>
              )}

              {activeNearbyExhibit.id === 'artifacts_vitrine_case' && (
                <div className="space-y-2.5">
                  <p className="text-[#3d230e]">
                    Các hiện vật, chứng tích gốc thời kỳ chiến tranh (1966–1975) được ghi nhận trong lịch sử nhà trường:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {content.artifacts.map((art) => (
                      <div key={art.id} className="p-3 rounded-xl bg-white border border-[#e4cca0] space-y-1 shadow-sm">
                        <span className="text-[10px] text-[#8a5b1d] font-mono font-bold block">{art.type}</span>
                        <strong className="text-[#2b180d] text-[11px] block">{art.title}</strong>
                        <p className="text-[10px] text-[#553018]">{art.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(activeNearbyExhibit.id === 'martyrs_memorial_stele' || activeNearbyExhibit.type === 'martyrs_monument') && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-[#fff5f5] border-2 border-red-300 space-y-2 shadow-md">
                    <span className="font-bold text-red-950 block text-xs uppercase tracking-wide font-serif">
                      1.5 Thầy và trò lên đường nhập ngũ
                    </span>
                    <p className="text-red-950 leading-relaxed text-xs">
                      {content.section1_5_militaryEnlistment.content}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h5 className="font-bold text-red-900 text-[11px] uppercase tracking-wider font-serif">
                      Danh sách Liệt sĩ nhà trường:
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {content.section1_5_militaryEnlistment.martyrs.map((name, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-white border border-red-200 flex items-center gap-2 shadow-sm">
                          <span className="w-5 h-5 rounded-full bg-red-100 border border-red-300 text-red-700 font-bold flex items-center justify-center text-[10px]">
                            ★
                          </span>
                          <strong className="text-red-950 text-xs">Liệt sĩ {name}</strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#fef8ea] border border-[#d4af37]/60 font-mono text-[11px] text-[#542d0c]">
                    {content.section1_5_militaryEnlistment.note}
                  </div>
                </div>
              )}

              {activeNearbyExhibit.id === 'culmination_1975_monument' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-[#fffdf8] border-2 border-[#d4af37] space-y-2 shadow-md">
                    <strong className="text-[#4c260e] block text-xs font-serif">Năm học 1974–1975 & Mốc son 1975:</strong>
                    <p className="text-[#2b180d] text-xs leading-relaxed">
                      {content.fiveRelocations.schoolYear1974_1975}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#e4cca0] text-[11px] text-[#3d230e] space-y-1 shadow-sm">
                    <div><strong>Địa chỉ ổn định từ 10/1974:</strong> {content.overview.historicalAddress}</div>
                    <div><strong>Địa chỉ hiện nay:</strong> {content.overview.currentAddress}</div>
                  </div>
                </div>
              )}

              {activeNearbyExhibit.id === 'exit_to_development' && (
                <div className="space-y-3 text-center py-4">
                  <p className="text-[#3d230e]">
                    Bạn đang đứng trước cửa kết nối sang <strong>Phần 2: Quá Trình Phát Triển (1975 – Nay)</strong>.
                  </p>
                  <button
                    onClick={() => {
                      setInspectModalOpen(false);
                      if (onNavigateDestination) onNavigateDestination('development');
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f5d061] text-[#241205] text-xs font-bold hover:brightness-105 transition-colors cursor-pointer border border-[#ffd988] shadow-md"
                  >
                    <span>Tiến bước sang Không gian Phát triển</span>
                    <ChevronRight className="w-4 h-4 text-[#241205]" />
                  </button>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-[#e4cca0] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#7a502c] flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Trích xuất từ "Tư liệu chuẩn 60 năm THPT A Trần Hưng Đạo"</span>
              </span>
              <button
                onClick={() => setInspectModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f5d061] text-[#241205] text-xs font-bold hover:brightness-105 transition-colors cursor-pointer border border-[#ffd988] shadow-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Full Document Viewer (Tư liệu chuẩn 1966–1975) */}
      {overviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#fdfaf2] border-2 border-[#d4af37] rounded-3xl shadow-2xl shadow-amber-950/40 overflow-hidden p-6 space-y-4 max-h-[88vh] flex flex-col text-[#241205]">
            <div className="flex items-start justify-between pb-3 border-b border-[#e4cca0]">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#8f5a1a] font-bold uppercase">
                  TƯ LIỆU CHUẨN XÁC THỰC
                </span>
                <h3 className="text-base font-bold text-[#2a1508] font-serif">
                  KHU 1 — LỊCH SỬ HÌNH THÀNH (1966–1975)
                </h3>
                <p className="text-xs text-[#704620] font-serif italic">Trường THPT A Trần Hưng Đạo (1966–2026)</p>
              </div>
              <button
                onClick={() => setOverviewModalOpen(false)}
                className="p-1 rounded-lg text-[#7a502c] hover:text-[#26150a] hover:bg-[#faebd4] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-5 text-xs text-[#2b180d] leading-relaxed pr-2">
              {/* 1.1 Thông tin thành lập */}
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-[#e4cca0] pb-1">
                  <h4 className="font-bold text-[#4c260e] text-sm font-serif">
                    1.1 Thông tin thành lập
                  </h4>
                  <span className="text-[10px] font-mono text-[#8f5a1a] uppercase font-bold">Tư liệu chuẩn 60 năm</span>
                </div>
                <div className="overflow-hidden rounded-xl border border-[#e4cca0] bg-white shadow-sm">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="border-b border-[#e4cca0] bg-[#faeed6] text-[#4c260e]">
                        <th className="py-2.5 px-3 font-semibold w-1/3">Nội dung</th>
                        <th className="py-2.5 px-3 font-semibold">Thông tin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eee0c5] text-[#24150b]">
                      {content.section1_1_overview.items.map((it, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#fcf8ef]'}>
                          <td className="py-2 px-3 font-medium text-[#542d0c]">{it.label}</td>
                          <td className="py-2 px-3 text-[#24150b] font-semibold">{it.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 1.2 Trường ra đời năm 1966 */}
              <div className="space-y-2">
                <h4 className="font-bold text-[#4c260e] text-sm border-b border-[#e4cca0] pb-1 font-serif">
                  1.2 Trường ra đời năm 1966
                </h4>
                <p className="whitespace-pre-line text-[#2b180d] leading-relaxed font-serif p-3.5 rounded-xl bg-white border border-[#e4cca0] shadow-sm">
                  {content.introduction}
                </p>
              </div>

              {/* 1.3 Dạy và học trong chiến tranh */}
              <div className="space-y-2">
                <h4 className="font-bold text-[#4c260e] text-sm border-b border-[#e4cca0] pb-1 font-serif">
                  1.3 Dạy và học trong chiến tranh
                </h4>
                <p className="text-[#2b180d] p-3 rounded-xl bg-white border border-[#e4cca0] shadow-sm leading-relaxed">
                  {content.wartimeTeaching.description}
                </p>
                <ul className="space-y-1.5 pl-2">
                  {content.wartimeTeaching.bulletPoints.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] text-[#2b180d]">
                      <span className="text-[#b8860b] mt-0.5">✦</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 1.4 Năm lần di chuyển */}
              <div className="space-y-2">
                <h4 className="font-bold text-[#4c260e] text-sm border-b border-[#e4cca0] pb-1 font-serif">
                  1.4 Năm lần di chuyển
                </h4>
                <div className="p-3 rounded-xl bg-[#fef8ea] border border-[#d4af37]/60 text-[11px] text-[#45230d] space-y-1.5">
                  <strong className="text-[#6d2027] block font-mono">Lộ trình đối chiếu tóm tắt:</strong>
                  <p className="font-mono text-xs text-[#2b180d] font-bold">{content.fiveRelocations.route}</p>
                </div>
                <div className="space-y-2 pt-1">
                  {content.fiveRelocations.steps.map((st) => (
                    <div key={st.order} className="p-3 rounded-xl bg-white border border-[#e4cca0] flex items-start gap-3 shadow-sm">
                      <span className="w-6 h-6 rounded-full bg-[#d4af37] text-[#241205] font-bold flex items-center justify-center flex-shrink-0 text-xs">
                        {st.order}
                      </span>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <strong className="text-[#2b180d] text-xs font-serif">{st.location}</strong>
                          <span className="text-[10px] font-mono text-[#b8860b]">({st.period})</span>
                        </div>
                        <p className="text-[11px] text-[#553018]">{st.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-[#45230d] pt-1 font-serif">{content.fiveRelocations.schoolYear1974_1975}</p>
              </div>

              {/* 1.5 Thầy và trò lên đường nhập ngũ */}
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-[#e4cca0] pb-1">
                  <h4 className="font-bold text-[#8a1b24] text-sm font-serif">
                    1.5 Thầy và trò lên đường nhập ngũ
                  </h4>
                  <span className="text-[10px] font-mono text-red-600 uppercase font-bold">Tưởng niệm & Tri ân</span>
                </div>
                <p className="text-[#2b180d] leading-relaxed text-xs">
                  {content.section1_5_militaryEnlistment.content}
                </p>
                <div className="p-3.5 rounded-xl bg-[#fff5f5] border border-red-300 space-y-2.5 shadow-sm">
                  <div className="text-[11px] font-bold text-red-800">
                    Danh sách Liệt sĩ nhà trường:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {content.section1_5_militaryEnlistment.martyrs.map((name, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-lg bg-white border border-red-200 text-[11px] text-red-950 font-medium flex items-center gap-1.5 shadow-sm"
                      >
                        <span className="text-red-600 font-bold">★</span>
                        <span>{name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-1 text-[11px] text-red-900/90 italic font-mono">
                    {content.section1_5_militaryEnlistment.note}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#e4cca0] flex items-center justify-end">
              <button
                onClick={() => setOverviewModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f5d061] text-[#241205] text-xs font-bold hover:brightness-105 transition-colors cursor-pointer border border-[#ffd988] shadow-md"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: 5 Relocations Interactive Route Map */}
      {evacuationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-[#fdfaf2] border-2 border-[#d4af37] rounded-3xl shadow-2xl shadow-amber-950/40 overflow-hidden p-6 space-y-4 max-h-[85vh] flex flex-col text-[#241205]">
            <div className="flex items-start justify-between pb-3 border-b border-[#e4cca0]">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#8f5a1a] font-bold uppercase">
                  BẢN ĐỒ & LỘ TRÌNH LỊCH SỬ (1966–1974)
                </span>
                <h3 className="text-base font-bold text-[#2a1508] font-serif">
                  NĂM LẦN DI CHUYỂN TRONG CHIẾN TRANH
                </h3>
              </div>
              <button
                onClick={() => setEvacuationModalOpen(false)}
                className="p-1 rounded-lg text-[#7a502c] hover:text-[#26150a] hover:bg-[#faebd4] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs text-[#2b180d]">
              <div className="p-3.5 rounded-xl bg-white border border-[#e4cca0] leading-relaxed shadow-sm">
                {content.fiveRelocations.summary}
              </div>

              {/* Timeline Route Visualizer */}
              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#d4af37] before:via-[#d4af37]/60 before:to-[#d4af37]">
                {content.fiveRelocations.steps.map((step) => (
                  <div key={step.order} className="relative group">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-[#fdfaf2] border-2 border-[#d4af37] flex items-center justify-center text-[10px] font-bold text-[#b8860b]">
                      {step.order}
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-[#e4cca0] hover:border-[#d4af37] transition-colors space-y-1 shadow-sm">
                      <div className="flex items-center justify-between">
                        <strong className="text-xs text-[#2b180d] font-serif">{step.location}</strong>
                        <span className="text-[10px] font-mono text-[#73430c] px-2 py-0.5 rounded bg-[#faeed6] border border-[#d4af37]/40 font-bold">
                          {step.period}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#553018] leading-relaxed">{step.details}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-[#fef8ea] border border-[#d4af37]/60 text-[11px] text-[#45230d] space-y-1 shadow-sm">
                <div className="font-semibold text-[#6d2027] font-serif">Ổn định địa điểm tháng 10/1974:</div>
                <div className="text-[#2b180d]">{content.fiveRelocations.settlement1974}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#e4cca0] flex items-center justify-end">
              <button
                onClick={() => setEvacuationModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f5d061] text-[#241205] text-xs font-bold hover:brightness-105 transition-colors cursor-pointer border border-[#ffd988] shadow-md"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Dedicated Martyrs & Enlistment Tribute Modal (1.5) */}
      {martyrsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#fdfaf2] border-2 border-red-700 rounded-3xl shadow-2xl shadow-red-950/40 overflow-hidden p-6 space-y-4 max-h-[85vh] flex flex-col text-[#241205]">
            <div className="flex items-start justify-between pb-3 border-b border-red-200">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-red-700 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-red-600" />
                  <span>MỤC 1.5 • TƯỞNG NIỆM & TRI ÂN</span>
                </span>
                <h3 className="text-base font-bold text-red-950 font-serif">
                  1.5 THẦY VÀ TRÒ LÊN ĐƯỜNG NHẬP NGŨ
                </h3>
              </div>
              <button
                onClick={() => setMartyrsModalOpen(false)}
                className="p-1 rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs text-[#2b180d]">
              <div className="p-3.5 rounded-xl bg-[#fff5f5] border border-red-200 text-xs leading-relaxed text-red-950 font-semibold shadow-sm">
                {content.section1_5_militaryEnlistment.content}
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-bold text-red-800 uppercase tracking-wider">
                  Danh sách Liệt sĩ nhà trường:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {content.section1_5_militaryEnlistment.martyrs.map((name, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-white border border-red-200 flex items-center gap-3 hover:border-red-400 transition-colors shadow-sm"
                    >
                      <span className="w-7 h-7 rounded-full bg-red-100 border border-red-300 text-red-700 font-bold flex items-center justify-center text-xs">
                        ★
                      </span>
                      <div>
                        <strong className="text-red-950 text-xs block">Liệt sĩ {name}</strong>
                        <span className="text-[10px] text-zinc-600">Thầy giáo / Học sinh nhà trường</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#fef8ea] border border-[#d4af37]/60 text-[11px] text-[#542d0c] font-mono leading-relaxed shadow-sm">
                {content.section1_5_militaryEnlistment.note}
              </div>
            </div>

            <div className="pt-2 border-t border-red-200 flex items-center justify-end">
              <button
                onClick={() => setMartyrsModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-md"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: 6 Zones Summary of Digital Tradition Room */}
      {sixZonesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#fdfaf2] border-2 border-[#d4af37] rounded-3xl shadow-2xl shadow-amber-950/40 overflow-hidden p-6 space-y-4 max-h-[88vh] flex flex-col text-[#241205]">
            <div className="flex items-start justify-between pb-3 border-b border-[#e4cca0]">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#8f5a1a] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#b8860b]" />
                  <span>TỔNG HỢP NỘI DUNG 6 KHU</span>
                </span>
                <h3 className="text-base font-bold text-[#2a1508] font-serif">
                  PHÒNG TRUYỀN THỐNG SỐ — TRƯỜNG THPT A TRẦN HƯNG ĐẠO (1966–2026)
                </h3>
              </div>
              <button
                onClick={() => setSixZonesModalOpen(false)}
                className="p-1 rounded-lg text-[#7a502c] hover:text-[#26150a] hover:bg-[#faebd4] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {SIX_ZONES_SUMMARY.map((zone) => (
                <div
                  key={zone.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    zone.id === 'history'
                      ? 'bg-[#fef8ea] border-[#d4af37] shadow-md'
                      : 'bg-white border-[#e4cca0] hover:border-[#d4af37]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-[#faeed6] border border-[#d4af37]/60 text-[#73430c]">
                          {zone.code}
                        </span>
                        <h4 className="text-xs font-bold text-[#2b180d] font-serif">
                          {zone.titleVi}
                        </h4>
                      </div>
                      <p className="text-[11px] text-[#553018] leading-relaxed pt-0.5">
                        {zone.description}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f6ebd4] text-[#542d0c]">
                        {zone.timePeriod}
                      </span>
                      {zone.id === 'history' ? (
                        <span className="text-[10px] font-bold text-emerald-800 px-2 py-0.5 rounded bg-emerald-100 border border-emerald-300">
                          ✓ Đang tham quan
                        </span>
                      ) : (
                        <span className="text-[10px] text-zinc-500 px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200">
                          Không gian tiếp nối
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#e4cca0] flex items-center justify-between">
              <span className="text-[10px] text-[#704620] font-mono">
                Biên soạn đầy đủ từ "Tư liệu chuẩn về truyền thống 60 năm"
              </span>
              <button
                onClick={() => setSixZonesModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f5d061] text-[#241205] text-xs font-bold hover:brightness-105 transition-colors cursor-pointer border border-[#ffd988] shadow-md"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: 4 SIDES EXHIBITION VIEW (BỐ CỤC 4 VĂN BẢN ĐẶT 4 BÊN) - LUXURY GOLDEN GALLERY */}
      {fourSidesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-6xl bg-[#fdfaf2] border-2 border-[#d4af37] rounded-3xl shadow-2xl shadow-amber-950/40 overflow-hidden p-4 sm:p-6 space-y-4 max-h-[92vh] flex flex-col text-[#26150a]">
            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#e4cca0] gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#d4af37]/25 text-[#73430c] border border-[#d4af37]/60 uppercase">
                    KHU 1 — LỊCH SỬ HÌNH THÀNH (1966–1975) [id: history]
                  </span>
                  <span className="text-[10px] text-emerald-700 font-mono flex items-center gap-1 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Tư liệu chuẩn 100%
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#2a1508] font-serif">
                  BỐ CỤC 4 VĂN BẢN ĐẶT 4 BÊN TRONG KHÔNG GIAN TRIỂN LÃM HOÀNG GIA
                </h3>
                <p className="text-xs text-[#704620] font-serif italic">
                  Trường THPT A Trần Hưng Đạo (1966–2026) — 4 Hướng: Nam (Trước), Tây (Trái), Đông (Phải), Bắc (Sau)
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => setFourSidesModalOpen(false)}
                  className="p-1.5 rounded-xl text-[#7a502c] hover:text-[#26150a] hover:bg-[#faebd4] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs for 4 Sides */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#e4cca0] text-xs">
              <button
                onClick={() => setActiveSideTab('all')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeSideTab === 'all'
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#f5d061] text-[#241205] shadow-md border border-[#ffd988]'
                    : 'bg-[#fbf4e4] text-[#5e3817] hover:bg-[#f6ebd5] border border-[#d4af37]/40'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Bố cục 4 bên đồng thời (Quadrant)</span>
              </button>

              <button
                onClick={() => setActiveSideTab('side_1')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeSideTab === 'side_1'
                    ? 'bg-amber-500 text-[#241205] font-bold shadow-md'
                    : 'bg-amber-100/70 text-amber-900 hover:bg-amber-200/70 border border-amber-300'
                }`}
              >
                <span>🧭 Bên 1 (Phía Nam): 1.1 Thông tin thành lập</span>
              </button>

              <button
                onClick={() => setActiveSideTab('side_2')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeSideTab === 'side_2'
                    ? 'bg-blue-600 text-white font-bold shadow-md'
                    : 'bg-blue-100/70 text-blue-900 hover:bg-blue-200/70 border border-blue-300'
                }`}
              >
                <span>🧭 Bên 2 (Phía Tây): 1.2 Ra đời năm 1966</span>
              </button>

              <button
                onClick={() => setActiveSideTab('side_3')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeSideTab === 'side_3'
                    ? 'bg-orange-600 text-white font-bold shadow-md'
                    : 'bg-orange-100/70 text-orange-900 hover:bg-orange-200/70 border border-orange-300'
                }`}
              >
                <span>🧭 Bên 3 (Phía Đông): 1.3 Thời chiến</span>
              </button>

              <button
                onClick={() => setActiveSideTab('side_4')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeSideTab === 'side_4'
                    ? 'bg-emerald-600 text-white font-bold shadow-md'
                    : 'bg-emerald-100/70 text-emerald-900 hover:bg-emerald-200/70 border border-emerald-300'
                }`}
              >
                <span>🧭 Bên 4 (Phía Bắc): 1.4 Năm lần di chuyển</span>
              </button>
            </div>

            {/* Modal Body: Quadrant or Tab View */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* QUADRANT / ALL 4 SIDES VIEW */}
              {(activeSideTab === 'all' || activeSideTab === 'side_1') && (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#fffdf8] border-2 border-[#d4af37] space-y-3 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#e4cca0] gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#d4af37] text-[#241205] font-bold flex items-center justify-center text-xs">
                        1
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-[#45230d] font-serif">
                        BÊN 1 (PHÍA NAM • TRƯỚC): 1.1 THÔNG TIN THÀNH LẬP
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          copyToClipboard(
                            content.section1_1_overview.items
                              .map((it) => `${it.label}: ${it.value}`)
                              .join('\n'),
                            'side_1'
                          )
                        }
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#fcf5e5] hover:bg-[#f6ebd2] border border-[#d4af37]/60 text-[11px] text-[#45230d] transition-colors cursor-pointer"
                      >
                        {copiedKey === 'side_1' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => teleportToSide('side_1')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#f5d061] text-[#241205] border border-[#d4af37] text-[11px] font-bold shadow-sm transition-colors cursor-pointer"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Bay đến vị trí 3D</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-[#e4cca0] rounded-xl overflow-hidden bg-white">
                      <thead className="bg-[#faeed6] text-[#4c260e] border-b border-[#e4cca0] font-mono text-[11px]">
                        <tr>
                          <th className="py-2.5 px-3 w-1/3">Nội dung</th>
                          <th className="py-2.5 px-3 w-2/3">Thông tin</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eee0c5]">
                        {content.section1_1_overview.items.map((row, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-[#ffffff]' : 'bg-[#fcf8ef]'}>
                            <td className="py-2.5 px-3 font-semibold text-[#542d0c] align-top">
                              {row.label}
                            </td>
                            <td className="py-2.5 px-3 text-[#24150b] whitespace-pre-line leading-relaxed">
                              {row.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {(activeSideTab === 'all' || activeSideTab === 'side_2') && (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#fffdfb] border-2 border-blue-400 space-y-3 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-blue-200 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                        2
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-blue-950 font-serif">
                        BÊN 2 (PHÍA TÂY • TRÁI): 1.2 TRƯỜNG RA ĐỜI NĂM 1966
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(content.section1_2_birth1966.content, 'side_2')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f0f7ff] hover:bg-[#e0efff] border border-blue-300 text-[11px] text-blue-950 transition-colors cursor-pointer"
                      >
                        {copiedKey === 'side_2' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => teleportToSide('side_2')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 text-white border border-blue-500 text-[11px] font-bold shadow-sm transition-colors cursor-pointer"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Bay đến vị trí 3D</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs text-[#24150b] leading-relaxed font-serif text-justify">
                    <div className="p-3.5 rounded-xl bg-white border border-blue-100 space-y-2 shadow-sm">
                      <p className="whitespace-pre-line leading-relaxed text-[#1e293b]">
                        {content.section1_2_birth1966.content}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#eff6ff] border border-blue-300 text-blue-950 text-xs italic font-sans flex items-start gap-2">
                      <span className="text-base text-amber-500 font-bold">✦</span>
                      <span>
                        <strong>Triết lý không thành văn:</strong> "Hoàn cảnh nào việc học cũng không được gián đoạn."
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {(activeSideTab === 'all' || activeSideTab === 'side_3') && (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#fffdfa] border-2 border-orange-400 space-y-3 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-orange-200 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-orange-600 text-white font-bold flex items-center justify-center text-xs">
                        3
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-orange-950 font-serif">
                        BÊN 3 (PHÍA ĐÔNG • PHẢI): 1.3 DẠY VÀ HỌC TRONG CHIẾN TRANH
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          copyToClipboard(
                            `${content.section1_3_wartimeTeaching.description}\n\n` +
                              content.section1_3_wartimeTeaching.bulletPoints
                                .map((b) => `• ${b}`)
                                .join('\n'),
                            'side_3'
                          )
                        }
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#fff5ea] hover:bg-[#ffeada] border border-orange-300 text-[11px] text-orange-950 transition-colors cursor-pointer"
                      >
                        {copiedKey === 'side_3' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => teleportToSide('side_3')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-600 text-white border border-orange-500 text-[11px] font-bold shadow-sm transition-colors cursor-pointer"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Bay đến vị trí 3D</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs text-[#24150b]">
                    <p className="p-3 rounded-xl bg-white border border-orange-100 leading-relaxed font-serif text-[#29170e] shadow-sm">
                      {content.section1_3_wartimeTeaching.description}
                    </p>

                    <ul className="space-y-2">
                      {content.section1_3_wartimeTeaching.bulletPoints.map((point, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-orange-200 hover:border-orange-400 transition-colors shadow-sm"
                        >
                          <span className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                          <span className="leading-relaxed text-[#24150b]">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {(activeSideTab === 'all' || activeSideTab === 'side_4') && (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#fdfefd] border-2 border-emerald-400 space-y-3 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-emerald-200 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                        4
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-emerald-950 font-serif">
                        BÊN 4 (PHÍA BẮC • HẬU/SAU): 1.4 NĂM LẦN DI CHUYỂN
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          copyToClipboard(
                            content.section1_4_fiveRelocations.chronology
                              .map((c) => `${c.step}. ${c.year}: ${c.location} - ${c.details}`)
                              .join('\n') +
                              `\n\n${content.section1_4_fiveRelocations.schoolYear1974_1975}\n\n` +
                              content.section1_4_fiveRelocations.summaryList.join('\n'),
                            'side_4'
                          )
                        }
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f0fdf4] hover:bg-[#dcfce7] border border-emerald-300 text-[11px] text-emerald-950 transition-colors cursor-pointer"
                      >
                        {copiedKey === 'side_4' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => teleportToSide('side_4')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white border border-emerald-500 text-[11px] font-bold shadow-sm transition-colors cursor-pointer"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Bay đến vị trí 3D</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs text-[#24150b]">
                    <div className="space-y-2">
                      {content.section1_4_fiveRelocations.chronology.map((c) => (
                        <div
                          key={c.step}
                          className="p-3 rounded-xl bg-white border border-emerald-200 space-y-1 hover:border-emerald-400 transition-colors shadow-sm"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">
                              {c.step}
                            </span>
                            <strong className="text-emerald-800">{c.year}:</strong>
                            <span className="text-[#24150b] font-semibold">{c.location}</span>
                          </div>
                          <p className="text-[#374151] pl-7 leading-relaxed">{c.details}</p>
                        </div>
                      ))}
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#ecfdf5] border border-emerald-300 text-emerald-950 space-y-1.5 shadow-sm">
                      <strong className="text-emerald-900 block text-xs">
                        Năm học 1974–1975 & Dấu mốc ổn định trên đất vua Trần:
                      </strong>
                      <p className="leading-relaxed text-[#064e3b]">{content.section1_4_fiveRelocations.schoolYear1974_1975}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-emerald-200 space-y-1 font-mono text-[11px] text-[#4b5563] shadow-sm">
                      <strong className="text-[#111827] block font-sans">TỔNG KẾT 5 LẦN DI CHUYỂN:</strong>
                      <div className="space-y-0.5 text-[#374151]">
                        {content.section1_4_fiveRelocations.summaryList.map((item, idx) => (
                          <div key={idx}>{item}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-[#e4cca0] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs bg-[#fdfaf2]">
              <span className="text-[11px] text-[#704620] font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nội dung chuẩn hóa nguyên văn — Không thêm, không bớt, không bỏ sót</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOverviewModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#fcf5e6] hover:bg-[#f6ebd4] text-[#45230d] text-xs border border-[#d4af37]/60 font-semibold transition-colors cursor-pointer"
                >
                  Xem toàn văn (1.1 - 1.5)
                </button>
                <button
                  onClick={() => setFourSidesModalOpen(false)}
                  className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f5d061] text-[#241205] text-xs font-bold shadow-md hover:brightness-105 transition-colors cursor-pointer border border-[#ffd988]"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
