import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { lobbyConfig, GatewayInfo } from './config/lobbyConfig';
import { createLobbyMaterials } from './materials/LobbyMaterials';
import {
  buildGrandLobbyArchitecture,
  LobbySceneElements,
  GatewayMeshObject,
} from './components/LobbyArchitecture';
import { lobbyAudio } from './audio/LobbyAudio';
import {
  Volume2,
  VolumeX,
  Compass,
  ArrowLeft,
  ChevronRight,
  Info,
  Map as MapIcon,
  MessageSquare,
  X,
  LayoutGrid,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Award,
  Shield,
  UploadCloud,
} from 'lucide-react';
import { useEditorialItem } from '../../services/dynamicContentService';
import { useSchoolBranding } from '../../services/brandingService';
import { createOfficialEmblemTexture } from './textures/createOfficialEmblemTexture';

interface Props {
  onReturnToEntrance: () => void;
  onOpenCmd: () => void;
  onNavigateDestination?: (roomId: string) => void;
}

interface MuseumRoomEntry {
  id: string;
  code: string;
  nameVi: string;
  nameEn: string;
  subtitleVi: string;
  subtitleEn: string;
  status: 'active' | 'upcoming';
  categoryVi: string;
  categoryEn: string;
}

export const MainHallScene: React.FC<Props> = ({
  onReturnToEntrance,
  onOpenCmd,
  onNavigateDestination,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const [isMuted, setIsMuted] = useState(lobbyAudio.getMutedState());
  const [activeNearbyGateway, setActiveNearbyGateway] = useState<GatewayInfo | null>(null);
  const [isNearMap, setIsNearMap] = useState(false);
  const [isNearGuide, setIsNearGuide] = useState(false);
  const [isNearCenter, setIsNearCenter] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [emblemModalOpen, setEmblemModalOpen] = useState(false);
  const [greetingOpen, setGreetingOpen] = useState(false);
  const [roomMenuOpen, setRoomMenuOpen] = useState(false);
  const [selectedDestNotice, setSelectedDestNotice] = useState<string | null>(null);

  // Dynamic editorial content hook for Lobby
  const { data: dynamicLobby } = useEditorialItem('lobby.rotunda', {
    welcomeTitle: lobbyConfig.titleVi,
    welcomeMessage: lobbyConfig.audioGreeting.transcriptVi,
    motto: lobbyConfig.taglineVi,
  });

  // Dynamic branding hook for official school logo
  const { branding } = useSchoolBranding();

  // Real-time synchronization of the authentic school logo on the 3D central sphere
  useEffect(() => {
    if (materialsRef.current && branding?.logoUrl) {
      const tex = createOfficialEmblemTexture(branding.logoUrl, (updatedTex) => {
        if (materialsRef.current) {
          materialsRef.current.officialEmblem.map = updatedTex;
          materialsRef.current.officialEmblem.emissiveMap = updatedTex;
          materialsRef.current.officialEmblem.needsUpdate = true;
        }
      });
      materialsRef.current.officialEmblem.map = tex;
      materialsRef.current.officialEmblem.emissiveMap = tex;
      materialsRef.current.officialEmblem.needsUpdate = true;
    }
  }, [branding?.logoUrl]);

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const elementsRef = useRef<LobbySceneElements | null>(null);
  const materialsRef = useRef<ReturnType<typeof createLobbyMaterials> | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Player position & movement state
  const playerPos = useRef(new THREE.Vector3(...lobbyConfig.camera.initialPosition));
  const playerVel = useRef(new THREE.Vector3(0, 0, 0));
  const cameraRotation = useRef({ yaw: 0, pitch: 0 }); // Euler angles
  const keysDown = useRef<{ [key: string]: boolean }>({});
  const isPointerDown = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  // Registered Museum Rooms for Direct Navigation
  const registeredRooms: MuseumRoomEntry[] = [
    {
      id: 'history',
      code: 'KHU 1',
      nameVi: 'Lịch Sử Hình Thành (1966–1975)',
      nameEn: 'Founding History (1966–1975)',
      subtitleVi: 'Cội nguồn, sơ tán thời chiến & khối cầu hố đen di sản',
      subtitleEn: 'Wartime origins, evacuation & black hole heritage sphere',
      status: 'active',
      categoryVi: 'Không gian 3D hoàn thiện',
      categoryEn: 'Completed 3D Space',
    },
    {
      id: 'development',
      code: 'KHU 2',
      nameVi: 'Quá Trình Phát Triển (1974–2026)',
      nameEn: 'Development Journey (1974–2026)',
      subtitleVi: '3 thời kỳ phát triển, 9 đời Hiệu trưởng & đại lễ 60 năm',
      subtitleEn: '3 developmental eras, 9 principals & 60th diamond jubilee',
      status: 'active',
      categoryVi: 'Không gian 3D hoàn thiện',
      categoryEn: 'Completed 3D Space',
    },
    {
      id: 'timeline',
      code: 'TRỤC BIÊN NIÊN',
      nameVi: 'Dòng Thời Gian (1966–2026)',
      nameEn: 'Chronological Timeline (1966–2026)',
      subtitleVi: 'Biên niên sử tương tác 60 năm lịch sử hào hùng',
      subtitleEn: '60-year living interactive chronicle',
      status: 'active',
      categoryVi: 'Không gian 3D hoàn thiện',
      categoryEn: 'Completed 3D Space',
    },
    {
      id: 'achievements',
      code: 'KHU 3',
      nameVi: 'Bảng Vàng Thành Tích',
      nameEn: 'Hall of Achievements',
      subtitleVi: 'Huân chương Lao động, Bằng khen Thủ tướng & thành tích 2025–2026',
      subtitleEn: 'Labour Medals, Prime Minister Commendation & Academic Honors',
      status: 'active',
      categoryVi: 'Sẵn sàng tham quan',
      categoryEn: 'Open For Visit',
    },
    {
      id: 'memory',
      code: 'KHU 4',
      nameVi: 'Ký Ức & Tri Ân',
      nameEn: 'Memories & Gratitude',
      subtitleVi: 'Tri ân các thế hệ thầy cô giáo và cựu học sinh',
      subtitleEn: 'Tribute to generations of mentors and alumni',
      status: 'active',
      categoryVi: 'Không gian 3D hoàn thiện',
      categoryEn: 'Completed 3D Space',
    },
    {
      id: 'entrance',
      code: 'CỔNG CHÀO',
      nameVi: 'Cổng Chào 3D Di Sản',
      nameEn: '3D Heritage Entrance Gate',
      subtitleVi: 'Khu vực đón tiếp đầu tiên ngoài trời của bảo tàng số',
      subtitleEn: 'Outer grand ceremonial entrance portal',
      status: 'active',
      categoryVi: 'Không gian 3D hoàn thiện',
      categoryEn: 'Completed 3D Space',
    },
  ];

  // Toggle audio
  const toggleAudio = useCallback(() => {
    const muted = lobbyAudio.toggleMute();
    setIsMuted(muted);
  }, []);

  // Handle room destination click
  const handleSelectRoom = useCallback(
    (room: MuseumRoomEntry) => {
      lobbyAudio.playGatewayProximity();
      setRoomMenuOpen(false);

      if (room.status === 'active') {
        if (room.id === 'entrance') {
          onReturnToEntrance();
        } else if (onNavigateDestination) {
          onNavigateDestination(room.id);
        }
      } else {
        setSelectedDestNotice(
          lang === 'vi'
            ? `Điểm kết nối [${room.nameVi}] đang trong lộ trình số hóa dữ liệu tiếp theo của nhà trường.`
            : `[${room.nameEn}] is currently scheduled in the school's upcoming digitization phase.`
        );
      }
    },
    [lang, onNavigateDestination, onReturnToEntrance]
  );

  // Handle gateway trigger
  const handleGatewayEnter = useCallback(
    (gw: GatewayInfo) => {
      lobbyAudio.playGatewayProximity();
      if (gw.id === 'history' || gw.id === 'development' || gw.id === 'achievements' || gw.id === 'timeline' || gw.id === 'memory') {
        if (onNavigateDestination) {
          onNavigateDestination(gw.id);
        }
      } else {
        setSelectedDestNotice(
          lang === 'vi'
            ? `Đã kích hoạt điểm kết nối: ${gw.nameVi}. Phân khu này đang trong lộ trình số hóa dữ liệu tiếp theo của nhà trường.`
            : `Activated gateway: ${gw.nameEn}. This exhibition room is scheduled in the school's upcoming digitization phase.`
        );
      }
    },
    [lang, onNavigateDestination]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    lobbyAudio.ensureRunning();

    // 1. Scene setup — Warm royal architectural atmosphere with refined champagne warmth
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x261e16);
    scene.fog = new THREE.Fog(0x261e16, 36, 80);
    sceneRef.current = scene;

    // 2. Camera setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(lobbyConfig.camera.fov, width / height, 0.1, 100);
    camera.position.copy(playerPos.current);
    cameraRef.current = camera;

    // 3. WebGL Renderer with High-Fidelity PBR & Balanced Exposure (controlled highlights, golden warmth)
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
    renderer.toneMappingExposure = 1.12; // Preserves rich contrast, luminous gold accents and warm ivory stone

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Base Lighting Baseline: Warm Champagne Ivory Ambient (0xFFF6E8) + Rich Ground Bounce + Golden Key Light (0xFFF1D8)
    const ambientLight = new THREE.AmbientLight(0xfff6e8, 1.15);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xfff0d6, 0x4a3420, 0.95);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfff1d8, 1.30);
    dirLight.position.set(6, 14, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.0003;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xffe8c8, 0.65);
    fillLight.position.set(-8, 10, -8);
    scene.add(fillLight);

    // 5. Build Grand Lobby Architecture with Authentic Logo
    const materials = createLobbyMaterials(branding?.logoUrl);
    materialsRef.current = materials;
    const elements = buildGrandLobbyArchitecture(materials, lang);
    scene.add(elements.masterGroup);
    elementsRef.current = elements;

    // 6. Keyboard & Mouse Movement Listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      keysDown.current[e.code] = true;
      lobbyAudio.ensureRunning();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysDown.current[e.code] = false;
    };

    let pointerDownPos = { x: 0, y: 0 };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isPointerDown.current = true;
      lobbyAudio.ensureRunning();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      lastPointer.current = { x: clientX, y: clientY };
      pointerDownPos = { x: clientX, y: clientY };
    };

    const handleClick = (e: MouseEvent) => {
      const dx = Math.abs(e.clientX - pointerDownPos.x);
      const dy = Math.abs(e.clientY - pointerDownPos.y);
      if (dx > 6 || dy > 6) return; // Ignore drag movements

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
          if (
            cur === elements.emblemMesh ||
            cur === elements.frontMedallionMesh ||
            cur === elements.blackHoleSphere ||
            cur === elements.centerpieceGroup
          ) {
            lobbyAudio.playMapInspect();
            setEmblemModalOpen(true);
            return;
          }
          if (cur === elements.mapConsoleGroup) {
            lobbyAudio.playMapInspect();
            setMapModalOpen(true);
            return;
          }
          if (cur === elements.guideConsoleGroup || cur === elements.guidePanelMesh) {
            lobbyAudio.playMapInspect();
            setGuideModalOpen(true);
            return;
          }
          cur = cur.parent;
        }
      }
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isPointerDown.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - lastPointer.current.x;
      const deltaY = clientY - lastPointer.current.y;
      lastPointer.current = { x: clientX, y: clientY };

      // Update rotation
      cameraRotation.current.yaw -= deltaX * 0.0035;
      cameraRotation.current.pitch -= deltaY * 0.0035;
      // Clamp pitch
      cameraRotation.current.pitch = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, cameraRotation.current.pitch)
      );
    };

    const handlePointerUp = () => {
      isPointerDown.current = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('click', handleClick);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // 7. Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // 8. Render & Physics Loop
    const clock = new THREE.Clock();
    let lastProximityCheck = 0;

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      // 0. Slow, dignified ceremonial rotation of the grand Saturn accretion ring
      if (elements.saturnRingGroup) {
        elements.saturnRingGroup.rotation.z += delta * 0.014;
      }

      // 0B. Orbiting celestial star aura around the central sphere
      if (elements.centerpieceOrbitParticles) {
        elements.centerpieceOrbitParticles.rotation.y += delta * 0.022;
      }

      // 1. Slow, dignified ceremonial rotation of the 3 golden orbital rings encircling the heritage sphere
      // (The obsidian sphere and apex authentic emblem crown remain firmly stationary)
      if (elements.orbitalRingGroups && elements.orbitalRingGroups.length >= 3) {
        elements.orbitalRingGroups[0].rotation.y += delta * 0.035;
        elements.orbitalRingGroups[1].rotation.z += delta * 0.024;
        elements.orbitalRingGroups[2].rotation.y -= delta * 0.028;
      }

      // 2. Subtle natural flame illumination flicker, core pulse, and drifting embers on the 4 ceremonial golden torches
      if (elements.torches) {
        elements.torches.forEach((torch, i) => {
          torch.light.intensity = torch.baseIntensity + Math.sin(elapsedTime * 4.5 + i * 1.5) * 0.08;
          if (torch.flameMesh) {
            torch.flameMesh.rotation.y += delta * 0.35;
            const sY = 1.0 + Math.sin(elapsedTime * 5.0 + i) * 0.04;
            torch.flameMesh.scale.set(1.0, sY, 1.0);
          }
          if (torch.flameCoreMesh) {
            const coreScale = 1.0 + Math.cos(elapsedTime * 6.5 + i) * 0.06;
            torch.flameCoreMesh.scale.set(coreScale, coreScale, coreScale);
          }
          if (torch.emberPoints && torch.emberPositions) {
            const pos = torch.emberPositions;
            const count = pos.length / 3;
            for (let j = 0; j < count; j++) {
              pos[j * 3 + 1] += delta * 0.38;
              if (pos[j * 3 + 1] > 2.45) {
                pos[j * 3 + 1] = 1.68 + Math.random() * 0.12;
              }
            }
            torch.emberPoints.geometry.attributes.position.needsUpdate = true;
          }
        });
      }

      // Movement Vector based on keys
      const forward = new THREE.Vector3(
        -Math.sin(cameraRotation.current.yaw),
        0,
        -Math.cos(cameraRotation.current.yaw)
      );
      const right = new THREE.Vector3(
        Math.cos(cameraRotation.current.yaw),
        0,
        -Math.sin(cameraRotation.current.yaw)
      );

      const moveDir = new THREE.Vector3(0, 0, 0);
      if (keysDown.current['KeyW'] || keysDown.current['ArrowUp']) moveDir.add(forward);
      if (keysDown.current['KeyS'] || keysDown.current['ArrowDown']) moveDir.sub(forward);
      if (keysDown.current['KeyD'] || keysDown.current['ArrowRight']) moveDir.add(right);
      if (keysDown.current['KeyA'] || keysDown.current['ArrowLeft']) moveDir.sub(right);

      if (moveDir.lengthSq() > 0) {
        moveDir.normalize();
        playerVel.current.lerp(
          moveDir.multiplyScalar(lobbyConfig.camera.moveSpeed * delta),
          0.18
        );
      } else {
        playerVel.current.lerp(new THREE.Vector3(0, 0, 0), 0.15);
      }

      // Apply velocity to position
      playerPos.current.add(playerVel.current);

      // Collision Boundaries
      const boundX = lobbyConfig.dimensions.width / 2 - lobbyConfig.camera.collisionPadding;
      const boundZ = lobbyConfig.dimensions.length / 2 - lobbyConfig.camera.collisionPadding;
      playerPos.current.x = Math.max(-boundX, Math.min(boundX, playerPos.current.x));
      playerPos.current.z = Math.max(-boundZ, Math.min(boundZ, playerPos.current.z));
      playerPos.current.y = lobbyConfig.camera.height;

      // Centerpiece pedestal collision (refined 3.55m radius around circular podium)
      const distFromCenter = Math.sqrt(
        playerPos.current.x * playerPos.current.x + playerPos.current.z * playerPos.current.z
      );
      if (distFromCenter < 3.55) {
        const angle = Math.atan2(playerPos.current.z, playerPos.current.x);
        playerPos.current.x = Math.cos(angle) * 3.55;
        playerPos.current.z = Math.sin(angle) * 3.55;
      }

      // Update camera position
      camera.position.copy(playerPos.current);

      // Update camera rotation
      const euler = new THREE.Euler(
        cameraRotation.current.pitch,
        cameraRotation.current.yaw,
        0,
        'YXZ'
      );
      camera.quaternion.setFromEuler(euler);

      // Spatial Proximity Checks (throttled every 150ms)
      if (elapsedTime - lastProximityCheck > 0.15) {
        lastProximityCheck = elapsedTime;

        // Gateway proximity check
        let foundNearbyGw: GatewayInfo | null = null;
        elements.gateways.forEach((gwObj: GatewayMeshObject) => {
          const gwPos = new THREE.Vector3(...gwObj.info.position);
          const dist = playerPos.current.distanceTo(gwPos);
          if (dist < 4.8) {
            foundNearbyGw = gwObj.info;
            gwObj.light.intensity = 3.6; // Highlight gateway
          } else {
            gwObj.light.intensity = 2.0;
          }
        });
        setActiveNearbyGateway(foundNearbyGw);

        // Map Lectern proximity check (at x = 6.8, z = 10.5)
        const mapDist = playerPos.current.distanceTo(new THREE.Vector3(6.8, 0, 10.5));
        setIsNearMap(mapDist < 3.2);

        // Guide Lectern proximity check (at x = -6.8, z = 10.5)
        const guideDist = playerPos.current.distanceTo(new THREE.Vector3(-6.8, 0, 10.5));
        setIsNearGuide(guideDist < 3.2);

        // Centerpiece proximity check
        setIsNearCenter(distFromCenter < 5.2);
      }

      renderer.render(scene, camera);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
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
  }, [lang]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#241B13] select-none font-sans">
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        title="Kéo chuột để quan sát • Dùng phím WASD để bước đi trong Sảnh"
      />

      {/* TOP HUD: Official School Identity & Navigation Menu & Controls */}
      <div className="absolute top-0 left-0 right-0 p-5 sm:p-6 flex items-start justify-between pointer-events-none z-20">
        {/* Left: Authentic School Brand with Official Emblem */}
        <div
          onClick={() => {
            lobbyAudio.playMapInspect();
            setEmblemModalOpen(true);
          }}
          className="flex items-center gap-3.5 pointer-events-auto animate-in fade-in duration-700 cursor-pointer group"
          title="Nhấp để tìm hiểu ý nghĩa Huy hiệu / Biểu trưng trường THPT A Trần Hưng Đạo"
        >
          <div className="w-12 h-12 rounded-xl bg-[#141B30]/90 border border-[#D4AF62]/50 group-hover:border-[#D4AF62] p-1 flex items-center justify-center backdrop-blur-md shadow-xl flex-shrink-0 transition-transform group-hover:scale-105">
            {branding?.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt="Huy hiệu Trường THPT A Trần Hưng Đạo"
                className="w-full h-full object-contain filter drop-shadow"
              />
            ) : (
              <div className="w-full h-full rounded-lg bg-gradient-to-br from-[#1a233a] to-[#0c111e] flex flex-col items-center justify-center text-[#D4AF62] p-0.5">
                <Shield className="w-5 h-5 text-[#D4AF62]" />
                <span className="text-[7px] font-bold font-mono tracking-tighter text-[#F3ECDD]">THD</span>
              </div>
            )}
          </div>
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#141B30]/85 border border-[#D4AF62]/40 backdrop-blur-md">
              <Compass className="w-3 h-3 text-[#D4AF62]" />
              <span className="text-[10px] font-mono tracking-widest text-[#F3ECDD] uppercase">
                {lang === 'vi' ? lobbyConfig.titleVi : lobbyConfig.titleEn}
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-serif font-bold tracking-wide text-[#F3ECDD] group-hover:text-[#FFD988] transition-colors leading-tight">
              {lang === 'vi' ? lobbyConfig.schoolNameVi.normalize('NFC') : lobbyConfig.schoolNameEn}
            </h1>
            <div className="text-[11px] text-[#D4AF62] italic flex items-center gap-1.5 leading-snug">
              <span className="truncate max-w-[260px] sm:max-w-md">&quot;{lang === 'vi' ? lobbyConfig.taglineVi.normalize('NFC') : lobbyConfig.taglineEn}&quot;</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#D4AF62]/20 text-[#FFD988] font-mono not-italic opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                {lang === 'vi' ? 'Xem biểu trưng ✦' : 'Inspect emblem ✦'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Room Navigation Trigger, Visitor Guide, Audio Greeting, VI/EN Toggle & Sound Toggle */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* FUNCTIONAL ROOM-NAVIGATION MENU TRIGGER */}
          <button
            onClick={() => setRoomMenuOpen(!roomMenuOpen)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#141B30] to-[#1c2742] hover:from-[#1c2742] hover:to-[#253356] border border-[#D4AF62] text-[#F3ECDD] hover:text-[#FFD988] transition-all backdrop-blur-md text-xs cursor-pointer shadow-xl font-serif font-semibold"
            title="Mở danh mục các phòng triển lãm bảo tàng"
          >
            <LayoutGrid className="w-4 h-4 text-[#D4AF62]" />
            <span className="font-mono text-[11px] tracking-wider uppercase">
              {lang === 'vi' ? 'KHÁM PHÁ CÁC PHÒNG' : 'EXPLORE ROOMS'}
            </span>
          </button>

          {/* VISITOR GUIDE BUTTON */}
          <button
            onClick={() => {
              lobbyAudio.playMapInspect();
              setGuideModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#141B30]/80 hover:bg-[#141B30] border border-[#D4AF62]/60 hover:border-[#D4AF62] text-[#F3ECDD] hover:text-[#FFD988] transition-all backdrop-blur-md text-xs cursor-pointer shadow-lg"
            title="Cẩm nang & Hướng dẫn tham quan bảo tàng số"
          >
            <BookOpen className="w-4 h-4 text-[#D4AF62]" />
            <span className="text-[11px] font-mono hidden sm:inline">
              {lang === 'vi' ? 'HƯỚNG DẪN' : 'GUIDE'}
            </span>
          </button>

          {/* Audio Greeting Drawer Button */}
          <button
            onClick={() => setGreetingOpen(!greetingOpen)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#141B30]/80 hover:bg-[#141B30] border border-[#D4AF62]/40 text-[#F3ECDD] hover:text-[#D4AF62] transition-all backdrop-blur-md text-xs cursor-pointer shadow-lg"
            title="Lời chào đón của nhà trường"
          >
            <MessageSquare className="w-4 h-4 text-[#D4AF62]" />
            <span className="text-[11px] font-mono hidden md:inline">
              {lang === 'vi' ? 'LỜI CHÀO ĐÓN' : 'WELCOME AUDIO'}
            </span>
          </button>

          {/* Language Toggle */}
          <div className="flex items-center bg-[#141B30]/85 border border-[#D4AF62]/40 rounded-xl p-0.5 text-xs backdrop-blur-md">
            <button
              onClick={() => setLang('vi')}
              className={`px-2.5 py-1 rounded-lg font-mono font-medium transition-colors cursor-pointer ${
                lang === 'vi' ? 'bg-[#D4AF62] text-[#0B1020] font-bold' : 'text-zinc-400 hover:text-[#F3ECDD]'
              }`}
            >
              VI
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-lg font-mono font-medium transition-colors cursor-pointer ${
                lang === 'en' ? 'bg-[#D4AF62] text-[#0B1020] font-bold' : 'text-zinc-400 hover:text-[#F3ECDD]'
              }`}
            >
              EN
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleAudio}
            className="flex items-center gap-2 p-2 rounded-xl bg-[#141B30]/80 hover:bg-[#141B30] border border-[#D4AF62]/40 text-[#F3ECDD] hover:text-[#D4AF62] transition-all backdrop-blur-md text-xs cursor-pointer shadow-lg"
            title={isMuted ? 'Bật âm thanh không gian' : 'Tắt âm thanh'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-zinc-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#D4AF62]" />
            )}
          </button>
        </div>
      </div>

      {/* DROPDOWN OVERLAY: ROOM-NAVIGATION MENU */}
      {roomMenuOpen && (
        <div className="fixed top-20 right-6 z-40 w-full max-w-md bg-[#101728]/95 border-2 border-[#D4AF62] rounded-2xl shadow-2xl backdrop-blur-xl p-5 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#D4AF62]/30">
            <div className="flex items-center gap-2.5 text-[#D4AF62]">
              <LayoutGrid className="w-4 h-4" />
              <h3 className="font-serif font-bold text-sm text-[#F3ECDD] tracking-wider uppercase">
                {lang === 'vi' ? 'HỆ THỐNG PHÂN KHU BẢO TÀNG' : 'MUSEUM ROOMS DIRECTORY'}
              </h3>
            </div>
            <button
              onClick={() => setRoomMenuOpen(false)}
              className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-1">
            {registeredRooms.map((room) => {
              const isActive = room.status === 'active';
              return (
                <div
                  key={room.id}
                  onClick={() => handleSelectRoom(room)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-[#162138]/90 border-[#D4AF62]/50 hover:border-[#D4AF62] hover:bg-[#1c2a47]'
                      : 'bg-[#0e1424]/60 border-zinc-800 hover:border-zinc-700 opacity-80'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#0A0F1D] text-[#D4AF62] border border-[#D4AF62]/30">
                        {room.code}
                      </span>
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{lang === 'vi' ? 'Sẵn sàng tham quan' : 'Available'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-400/80 font-mono">
                          <Clock className="w-3 h-3" />
                          <span>{lang === 'vi' ? 'Đang số hóa' : 'In Digitization'}</span>
                        </span>
                      )}
                    </div>
                    <h4 className="font-serif font-bold text-sm text-[#F3ECDD] leading-snug">
                      {lang === 'vi' ? room.nameVi : room.nameEn}
                    </h4>
                    <p className="text-[11px] text-zinc-400 line-clamp-1">
                      {lang === 'vi' ? room.subtitleVi : room.subtitleEn}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      className={`p-2 rounded-lg text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#D4AF62] text-[#0A0F1D] hover:bg-[#FFD988]'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                      }`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-1 text-[11px] text-zinc-400 font-mono text-center border-t border-zinc-800">
            {lang === 'vi'
              ? '✦ Nhấp vào bất kỳ phân khu nào để chuyển phòng tức thì'
              : '✦ Click any room to navigate directly'}
          </div>
        </div>
      )}

      {/* SPATIAL PROXIMITY PROMPTS */}
      {/* 1. Gateway Approach Prompt */}
      {activeNearbyGateway && !roomMenuOpen && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 rounded-2xl bg-[#141B30]/95 border-2 border-[#D4AF62] shadow-2xl backdrop-blur-md text-center space-y-2 max-w-sm">
            <span className="text-[10px] font-mono tracking-widest text-[#D4AF62] uppercase px-2 py-0.5 bg-[#0B1020] rounded border border-[#D4AF62]/50">
              {activeNearbyGateway.code} • {lang === 'vi' ? 'CỬA VÀO PHÂN KHU' : 'EXHIBITION THRESHOLD'}
            </span>
            <h3 className="text-base font-serif font-bold text-[#F3ECDD]">
              {lang === 'vi' ? activeNearbyGateway.nameVi : activeNearbyGateway.nameEn}
            </h3>
            <p className="text-xs text-zinc-300">
              {lang === 'vi' ? activeNearbyGateway.subtitleVi : activeNearbyGateway.subtitleEn}
            </p>
            <button
              onClick={() => handleGatewayEnter(activeNearbyGateway)}
              className="mt-2 w-full py-2 px-4 rounded-xl text-xs font-bold text-[#0B1020] bg-gradient-to-r from-[#D4AF62] to-[#ffd988] hover:from-[#ffd988] hover:to-[#D4AF62] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <span>{lang === 'vi' ? 'TIẾN VÀO PHÂN KHU' : 'ENTER EXHIBITION'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Map Console Approach Prompt */}
      {isNearMap && !activeNearbyGateway && !roomMenuOpen && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 rounded-2xl bg-[#141B30]/95 border-2 border-[#D4AF62] shadow-2xl backdrop-blur-md text-center space-y-2 max-w-xs">
            <span className="text-[10px] font-mono text-[#D4AF62] uppercase">
              BỤC ĐIỀU KHIỂN ĐỊNH VỊ
            </span>
            <h3 className="text-sm font-bold text-[#F3ECDD]">
              {lang === 'vi' ? 'SƠ ĐỒ KHÔNG GIAN BẢO TÀNG' : 'ORBITAL MUSEUM MAP'}
            </h3>
            <button
              onClick={() => {
                lobbyAudio.playMapInspect();
                setMapModalOpen(true);
              }}
              className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-[#0B1020] bg-[#D4AF62] hover:bg-[#ffd988] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'MỞ BẢN ĐỒ CHI TIẾT' : 'OPEN DETAILED MAP'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 2b. Guide Console Approach Prompt */}
      {isNearGuide && !activeNearbyGateway && !isNearMap && !roomMenuOpen && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 rounded-2xl bg-[#141B30]/95 border-2 border-[#D4AF62] shadow-2xl backdrop-blur-md text-center space-y-2 max-w-xs">
            <span className="text-[10px] font-mono text-[#D4AF62] uppercase tracking-wider">
              {lang === 'vi' ? 'BỤC HƯỚNG DẪN THAM QUAN' : 'VISITOR INFORMATION KIOSK'}
            </span>
            <h3 className="text-sm font-bold font-serif text-[#F3ECDD]">
              {lang === 'vi' ? 'HƯỚNG DẪN & CẨM NANG BẢO TÀNG SỐ' : 'DIGITAL MUSEUM VISITOR GUIDE'}
            </h3>
            <button
              onClick={() => {
                lobbyAudio.playMapInspect();
                setGuideModalOpen(true);
              }}
              className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-[#0B1020] bg-gradient-to-r from-[#D4AF62] to-[#ffd988] hover:from-[#ffd988] hover:to-[#D4AF62] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#0B1020]" />
              <span>{lang === 'vi' ? 'XEM CẨM NANG HƯỚNG DẪN' : 'OPEN VISITOR GUIDE'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Centerpiece Proximity Prompt */}
      {isNearCenter && !activeNearbyGateway && !isNearMap && !isNearGuide && !roomMenuOpen && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 rounded-2xl bg-[#141B30]/95 border-2 border-[#D4AF62] shadow-2xl backdrop-blur-md text-center space-y-2 max-w-sm">
            <div className="flex items-center justify-center gap-2 text-[#D4AF62]">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase tracking-wider">
                {lang === 'vi' ? 'ĐÀI TƯỞNG NIỆM 60 NĂM & BIỂU TRƯNG TRƯỜNG' : '60-YEAR ANNIVERSARY MONUMENT & EMBLEM'}
              </span>
            </div>
            <h3 className="text-sm font-serif font-bold text-[#F3ECDD]">
              {lang === 'vi'
                ? 'BIỂU TRƯNG CHÍNH THỨC THPT A TRẦN HƯNG ĐẠO'
                : 'OFFICIAL EMBLEM — THPT A TRAN HUNG DAO'}
            </h3>
            <p className="text-[11px] text-zinc-300">
              {lang === 'vi'
                ? 'Biểu trưng di sản: Ngọn đuốc tri thức, tháp Phổ Minh nghìn năm & hào khí Đông A (1966–2026)'
                : 'Official school emblem representing 60 years of heritage (1966–2026)'}
            </p>
            <button
              onClick={() => {
                lobbyAudio.playMapInspect();
                setEmblemModalOpen(true);
              }}
              className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-[#0B1020] bg-gradient-to-r from-[#D4AF62] to-[#ffd988] hover:from-[#ffd988] hover:to-[#D4AF62] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Shield className="w-3.5 h-3.5 text-[#0B1020]" />
              <span>{lang === 'vi' ? 'KHÁM PHÁ Ý NGHĨA BIỂU TRƯNG' : 'EXPLORE EMBLEM MEANING'}</span>
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM HUD: Navigation instructions & Return to Entrance Gate */}
      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none z-20">
        {/* Left: Walking controls guide & Return to Entrance */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={onReturnToEntrance}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141B30]/85 hover:bg-[#141B30] border border-[#D4AF62]/40 text-[#F3ECDD] hover:text-[#D4AF62] transition-all backdrop-blur-md text-xs cursor-pointer shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono text-[11px]">
              {lang === 'vi' ? 'TRỞ VỀ CỔNG CHÀO 3D' : 'RETURN TO ENTRANCE'}
            </span>
          </button>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141B30]/70 border border-zinc-800 text-[11px] font-mono text-zinc-400 backdrop-blur-md">
            <span>WASD / Mũi tên: Di chuyển</span>
            <span>•</span>
            <span>Kéo chuột: Quan sát</span>
          </div>
        </div>

        {/* Right: Discreet CMD Admin Entry */}
        <div className="pointer-events-auto">
          <button
            onClick={onOpenCmd}
            className="text-[10px] font-mono text-zinc-600 hover:text-[#D4AF62] px-2 py-1 rounded hover:bg-[#141B30]/60 transition-colors cursor-pointer"
            title="Quản trị hệ thống (CMD)"
          >
            [ CMD ]
          </button>
        </div>
      </div>

      {/* MODAL: Audio Greeting Drawer */}
      {greetingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#141B30] border-2 border-[#D4AF62] rounded-2xl shadow-2xl p-6 space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#D4AF62]/30">
              <div className="flex items-center gap-2 text-[#D4AF62]">
                <MessageSquare className="w-4 h-4" />
                <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-[#F3ECDD]">
                  {lang === 'vi' ? 'LỜI CHÀO ĐÓN CỦA NHÀ TRƯỜNG' : 'OFFICIAL WELCOME MESSAGE'}
                </h3>
              </div>
              <button
                onClick={() => setGreetingOpen(false)}
                className="text-zinc-400 hover:text-[#F3ECDD] p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-[#F3ECDD]/90 leading-relaxed font-serif italic bg-[#0B1020]/60 p-4 rounded-xl border border-zinc-800">
              <p>
                &quot;
                {lang === 'vi'
                  ? dynamicLobby.welcomeMessage || lobbyConfig.audioGreeting.transcriptVi
                  : lobbyConfig.audioGreeting.transcriptEn}
                &quot;
              </p>
            </div>

            <div className="text-[11px] font-mono text-zinc-500 pt-1">
              {lang === 'vi'
                ? 'Hạ tầng âm thanh đã sẵn sàng kết nối bản ghi âm chính thức từ Ban Giám hiệu nhà trường.'
                : 'Audio greeting infrastructure is ready for the school principal board official recording.'}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Detailed Orbital Spatial Museum Map */}
      {mapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl bg-[#0B1020] border-2 border-[#D4AF62] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#D4AF62]/40">
              <div className="flex items-center gap-2 text-[#D4AF62]">
                <MapIcon className="w-5 h-5" />
                <h3 className="text-base font-serif font-bold tracking-wider text-[#F3ECDD] uppercase">
                  {lang === 'vi' ? 'SƠ ĐỒ KHÔNG GIAN BẢO TÀNG SỐ (ORBITAL MAP)' : 'DIGITAL MUSEUM ORBITAL MAP'}
                </h3>
              </div>
              <button
                onClick={() => setMapModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {lobbyConfig.gateways.map((gw) => (
                <div
                  key={gw.id}
                  onClick={() => {
                    setMapModalOpen(false);
                    handleGatewayEnter(gw);
                  }}
                  className="p-3.5 rounded-xl bg-[#141B30]/80 border border-[#D4AF62]/30 hover:border-[#D4AF62] hover:bg-[#141B30] transition-all cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#D4AF62] font-bold">
                      {gw.code}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">ID: {gw.id}</span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#F3ECDD]">
                    {lang === 'vi' ? gw.nameVi : gw.nameEn}
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    {lang === 'vi' ? gw.subtitleVi : gw.subtitleEn}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setMapModalOpen(false)}
                className="px-6 py-2 rounded-xl text-xs font-semibold text-[#0B1020] bg-[#D4AF62] hover:bg-[#ffd988] transition-colors cursor-pointer"
              >
                {lang === 'vi' ? 'ĐÓNG BẢN ĐỒ' : 'CLOSE MAP'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATION: Future destination notice */}
      {selectedDestNotice && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 rounded-2xl bg-[#141B30] border-2 border-[#D4AF62] shadow-2xl flex items-center gap-3 text-xs text-[#F3ECDD] max-w-md">
            <Info className="w-5 h-5 text-[#D4AF62] flex-shrink-0" />
            <p className="flex-1">{selectedDestNotice}</p>
            <button
              onClick={() => setSelectedDestNotice(null)}
              className="text-zinc-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Official School Emblem & Symbolism */}
      {emblemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-4xl bg-[#0B1020] border-2 border-[#D4AF62] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-left my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#D4AF62]/40">
              <div className="flex items-center gap-3 text-[#D4AF62]">
                <div className="p-2 rounded-xl bg-[#141B30] border border-[#D4AF62]/50">
                  <Shield className="w-6 h-6 text-[#D4AF62]" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold tracking-wide text-[#F3ECDD]">
                    {lang === 'vi'
                      ? 'Ý NGHĨA BIỂU TRƯNG & HUY HIỆU TRƯỜNG THPT A TRẦN HƯNG ĐẠO'
                      : 'OFFICIAL EMBLEM & SYMBOLISM — TRAN HUNG DAO HIGH SCHOOL'}
                  </h3>
                  <p className="text-xs text-[#D4AF62] font-mono">
                    {lang === 'vi'
                      ? 'Di sản nhận diện hình ảnh • Hào khí Đông A • 60 năm xây dựng và phát triển (1966 – 2026)'
                      : 'Official Visual Heritage • Dong A Spirit • 60th Anniversary Jubilee'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEmblemModalOpen(false)}
                className="text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Left Column: Large Vector Emblem Presentation */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-[#141B30] to-[#0d1322] border border-[#D4AF62]/50 text-center space-y-4">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 p-4 rounded-2xl bg-[#090d18] border-2 border-[#D4AF62]/60 shadow-[0_0_35px_rgba(212,175,98,0.25)] flex items-center justify-center">
                  {branding?.logoUrl ? (
                    <img
                      src={branding.logoUrl}
                      alt="Biểu trưng chính thức Trường THPT A Trần Hưng Đạo"
                      className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-[#141B30]/60 flex flex-col items-center justify-center text-center p-4 space-y-2">
                      <Shield className="w-12 h-12 text-[#D4AF62]/60" />
                      <div className="text-xs font-bold text-[#F3ECDD]">TRƯỜNG THPT A TRẦN HƯNG ĐẠO</div>
                      <div className="text-[10px] text-zinc-400">Chưa tải lên logo chính thức</div>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmblemModalOpen(false);
                    onOpenCmd();
                  }}
                  className="text-[11px] text-[#D4AF62] hover:text-[#FFD988] cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#141B30] border border-[#D4AF62]/40 hover:border-[#D4AF62] transition-colors"
                  title="Mở giao diện quản trị CMD để tải lên hoặc thay đổi logo chính thức"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Quản lý Logo trong CMD Admin</span>
                </button>
                <div className="space-y-1">
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono tracking-wider font-bold bg-[#D4AF62]/20 text-[#FFD988] border border-[#D4AF62]/40 uppercase">
                    BẢN VẼ CHUẨN MỰC CHÍNH THỨC
                  </span>
                  <h4 className="font-serif font-bold text-base text-[#F3ECDD]">
                    TRƯỜNG THPT A TRẦN HƯNG ĐẠO
                  </h4>
                  <p className="text-xs text-zinc-400 italic">
                    Ninh Bình — Vùng đất di sản và truyền thống hiếu học
                  </p>
                </div>
              </div>

              {/* Right Column: Detailed Breakdown of 7 Core Symbolic Elements */}
              <div className="md:col-span-7 space-y-3.5 max-h-[60vh] overflow-y-auto pr-2">
                <div className="p-3.5 rounded-xl bg-[#141B30]/80 border border-[#D4AF62]/30 space-y-1">
                  <div className="flex items-center gap-2 text-[#D4AF62] font-serif font-bold text-sm">
                    <Shield className="w-4 h-4 flex-shrink-0" />
                    <span>1. Khung Hình Thoi Kim Cương (Diamond Shield)</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Khung hình thoi vững chãi tựa viên kim cương, biểu thị tính kỷ cương, cấu trúc bền vững và ý chí kiên định của ngôi trường trọng điểm qua mọi giai đoạn lịch sử.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#141B30]/80 border border-[#D4AF62]/30 space-y-1">
                  <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-sm">
                    <Sparkles className="w-4 h-4 flex-shrink-0" />
                    <span>2. Ngọn Đuốc Đỏ Rực Sáng (Flaming Torch)</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Ngọn đuốc đỏ bừng cháy ở trung tâm huy hiệu tượng trưng cho ngọn lửa nhiệt huyết của tuổi trẻ, ánh sáng dẫn đường của tri thức khoa học và hào khí Đông A bất diệt.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#141B30]/80 border border-[#D4AF62]/30 space-y-1">
                  <div className="flex items-center gap-2 text-[#D4AF62] font-serif font-bold text-sm">
                    <Award className="w-4 h-4 flex-shrink-0" />
                    <span>3. Tháp Phổ Minh Cội Nguồn (Pho Minh Tower)</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Hình tượng ngọn tháp Phổ Minh nghìn năm tuổi – biểu trưng văn hóa linh thiêng của đất Nam Định, cội nguồn vương triều Trần rực rỡ võ công và văn hóa.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#141B30]/80 border border-[#D4AF62]/30 space-y-1">
                  <div className="flex items-center gap-2 text-sky-400 font-serif font-bold text-sm">
                    <BookOpen className="w-4 h-4 flex-shrink-0" />
                    <span>4. Trang Sách Trí Tuệ Mở Rộng (Open Knowledge Book)</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Hình ảnh cuốn sách mở nâng đỡ ngọn đuốc thể hiện sứ mệnh giáo dục cao cả, truyền thống hiếu học và sự nghiệp trồng người qua bao thế hệ thầy trò.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#141B30]/80 border border-[#D4AF62]/30 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-serif font-bold text-sm">
                    <ChevronRight className="w-4 h-4 flex-shrink-0" />
                    <span>5. Dải Bậc Thang Chevrons (Ascending Progression)</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Các dải bậc thang vươn lên từng nấc, đại diện cho những mốc son phát triển không ngừng và khát vọng vươn tới những đỉnh cao tri thức mới.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#141B30]/80 border border-[#D4AF62]/30 space-y-1">
                  <div className="flex items-center gap-2 text-yellow-300 font-serif font-bold text-sm">
                    <Sparkles className="w-4 h-4 flex-shrink-0" />
                    <span>6. Ngôi Sao Vàng Năm Cánh (Golden Star)</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Ngôi sao vàng tỏa sáng ở vị trí đỉnh cao tượng trưng cho lý tưởng cách mạng, khát vọng cống hiến cho Tổ quốc và niềm tự hào dân tộc.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#141B30]/80 border border-[#D4AF62]/30 space-y-1">
                  <div className="flex items-center gap-2 text-[#F3ECDD] font-serif font-bold text-sm">
                    <Compass className="w-4 h-4 flex-shrink-0 text-[#D4AF62]" />
                    <span>7. Danh Xưng Chuẩn Mực: &quot;TRƯỜNG THPT A TRẦN HƯNG ĐẠO&quot;</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Dòng chữ uốn lượn uy nghiêm theo hai cánh huy hiệu, cùng dải ruy-băng Ninh Bình ở chân đế, khẳng định vị thế và thương hiệu giáo dục xuất sắc của ngôi trường anh hùng trên vùng đất cố đô.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D4AF62]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-zinc-400 font-mono">
                ✦ Biểu trưng được ứng dụng đồng bộ trong toàn bộ không gian số hóa 3D của bảo tàng.
              </span>
              <button
                onClick={() => setEmblemModalOpen(false)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-[#0B1020] bg-gradient-to-r from-[#D4AF62] to-[#ffd988] hover:from-[#ffd988] hover:to-[#D4AF62] transition-all cursor-pointer shadow-lg"
              >
                {lang === 'vi' ? 'TIẾP TỤC KHÁM PHÁ SẢNH' : 'CONTINUE EXPLORING'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Visitor Tour Guide (Cẩm nang & Hướng dẫn tham quan) */}
      {guideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#0B1020] border-2 border-[#D4AF62] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-left my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#D4AF62]/40">
              <div className="flex items-center gap-3 text-[#D4AF62]">
                <div className="p-2 rounded-xl bg-[#141B30] border border-[#D4AF62]/50">
                  <BookOpen className="w-6 h-6 text-[#D4AF62]" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold tracking-wide text-[#F3ECDD]">
                    {lang === 'vi'
                      ? 'CẨM NANG & HƯỚNG DẪN THAM QUAN BẢO TÀNG SỐ 3D'
                      : '3D DIGITAL MUSEUM VISITOR GUIDE'}
                  </h3>
                  <p className="text-xs text-[#D4AF62] font-mono">
                    {lang === 'vi'
                      ? 'Kỷ niệm 60 năm thành lập Trường THPT A Trần Hưng Đạo (1966 – 2026)'
                      : '60th Anniversary Jubilee Exhibition (1966 – 2026)'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setGuideModalOpen(false)}
                className="text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 text-xs text-zinc-300 leading-relaxed">
              {/* Section 1: 3D Navigation Controls */}
              <div className="p-4 rounded-2xl bg-[#141B30]/80 border border-[#D4AF62]/30 space-y-2.5">
                <h4 className="font-serif font-bold text-sm text-[#FFD988] flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#D4AF62]" />
                  <span>1. Cách Thức Di Chuyển & Quan Sát Không Gian 3D</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#0B1020]/70 border border-zinc-800 space-y-1">
                    <span className="font-mono font-bold text-[#D4AF62]">BÀN PHÍM</span>
                    <p>Dùng phím <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-white font-mono">W</kbd> <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-white font-mono">A</kbd> <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-white font-mono">S</kbd> <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-white font-mono">D</kbd> hoặc 4 phím Mũi tên để bước đi tự do trong phòng.</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0B1020]/70 border border-zinc-800 space-y-1">
                    <span className="font-mono font-bold text-[#D4AF62]">CHUỘT / CẢM ỨNG</span>
                    <p>Nhấp giữ và kéo chuột (hoặc vuốt trên màn hình cảm ứng) để xoay góc nhìn 360 độ toàn cảnh.</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0B1020]/70 border border-zinc-800 space-y-1">
                    <span className="font-mono font-bold text-[#D4AF62]">TƯƠNG TÁC HIỆN VẬT</span>
                    <p>Đến gần các đài biểu tượng, bục hướng dẫn, hoặc cửa vòm và nhấp chuột để mở nội dung chi tiết.</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0B1020]/70 border border-zinc-800 space-y-1">
                    <span className="font-mono font-bold text-[#D4AF62]">CHUYỂN PHÒNG TỨC THÌ</span>
                    <p>Nhấp nút <strong className="text-white">KHÁM PHÁ CÁC PHÒNG</strong> ở góc trên bên phải để mở danh mục và dịch chuyển tức thì đến bất kỳ phòng nào.</p>
                  </div>
                </div>
              </div>

              {/* Section 2: Recommended Tour Itinerary */}
              <div className="p-4 rounded-2xl bg-[#141B30]/80 border border-[#D4AF62]/30 space-y-2.5">
                <h4 className="font-serif font-bold text-sm text-[#FFD988] flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#D4AF62]" />
                  <span>2. Lộ Trình Tham Quan Khuyến Nghị (Hành Trình 60 Năm Di Sản)</span>
                </h4>
                <ol className="space-y-2 list-decimal list-inside pl-1 text-zinc-300">
                  <li><strong className="text-[#F3ECDD]">Cổng Trường 3D:</strong> Điểm khởi đầu trang nghiêm với cổng trường thực tế ảo và biển hiệu ngôi trường Thành Nam.</li>
                  <li><strong className="text-[#F3ECDD]">Sảnh Danh Dự & Biểu Tượng Trung Tâm:</strong> Nơi đặt đài biểu tượng ngọn đuốc & huy hiệu chính thức, cùng bục bản đồ định vị và bục hướng dẫn.</li>
                  <li><strong className="text-[#F3ECDD]">Khu 1 (1966–1975) — Lịch Sử Hình Thành:</strong> Cội nguồn sơ tán thời chiến chống Mỹ, khối cầu hố đen di sản lưu giữ ký ức bom đạn.</li>
                  <li><strong className="text-[#F3ECDD]">Khu 2 (1974–2026) — Quá Trình Phát Triển:</strong> Tượng đài Quốc công Tiết chế Trần Hưng Đạo, 3 thời kỳ phát triển, 9 đời hiệu trưởng và quả cầu di sản vũ trụ.</li>
                  <li><strong className="text-[#F3ECDD]">Trục Biên Niên Sử (1966–2026):</strong> Dòng thời gian tương tác 60 năm lịch sử hào hùng.</li>
                  <li><strong className="text-[#F3ECDD]">Khu 3 — Bảng Vàng Thành Tích:</strong> Huân chương Lao động, Bằng khen của Thủ tướng và bảng vàng truyền thống.</li>
                  <li><strong className="text-[#F3ECDD]">Khu 4 — Ký Ức & Tri Ân:</strong> Lắng đọng tri ân các thế hệ người thầy và học trò qua 60 năm trường tồn.</li>
                </ol>
              </div>

              {/* Section 3: Audio & Dynamic Content Note */}
              <div className="p-4 rounded-2xl bg-[#141B30]/80 border border-[#D4AF62]/30 space-y-2">
                <h4 className="font-serif font-bold text-sm text-[#FFD988] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF62]" />
                  <span>3. Âm Thanh Không Gian & Quản Lý Nội Dung Động</span>
                </h4>
                <p>
                  Bảo tàng được tích hợp nhạc nền không gian trang trọng, tiếng bước chân và lời chào đón từ Ban Giám hiệu nhà trường. Quý khách có thể bật/tắt âm thanh bất kỳ lúc nào bằng biểu tượng loa ở góc trên bên phải. Toàn bộ tư liệu được quản lý động qua hệ thống CMD Admin.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D4AF62]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-zinc-400 font-mono">
                ✦ Chúc quý khách có một chuyến tham quan bảo tàng số ý nghĩa và trọn vẹn!
              </span>
              <button
                onClick={() => setGuideModalOpen(false)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-[#0B1020] bg-gradient-to-r from-[#D4AF62] to-[#ffd988] hover:from-[#ffd988] hover:to-[#D4AF62] transition-all cursor-pointer shadow-lg"
              >
                {lang === 'vi' ? 'BẮT ĐẦU THAM QUAN SẢNH' : 'START LOBBY TOUR'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
