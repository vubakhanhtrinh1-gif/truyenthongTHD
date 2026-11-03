/**
 * Zone 3: School Achievements Exhibition Scene (AchievementsScene)
 * Trường THPT A Trần Hưng Đạo (1966–2026)
 *
 * Implements:
 * - Real-time 3D Walkable Exhibition with First-Person & Orbit Touch Controls
 * - WALL A: School Awards and Honours in 3 distinct bays with zero column occlusion
 * - WALL B: Academic Achievements (Olympiad, STEM, Quality trends, 2026 Graduation Exam)
 * - NORTH WALL: Grand "ĐÀI VINH DANH" displaying published achievements & uploaded images
 * - Dedicated Button & Modal: "XEM TOÀN BỘ HUÂN CHƯƠNG, HUY CHƯƠNG VÀ KHEN THƯỞNG"
 *   Searchable, filterable catalogue supporting expandable dynamic records from CMD
 * - School Year Selector for Wall B academic results
 * - Compact, uncrowded top navigation with zero awkward wrapping
 * - Full CMD Admin integration with Cloud Firestore & Storage
 */

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import {
  buildAchievementsRoomArchitecture,
  InteractiveAchievementExhibit,
} from './components/AchievementsArchitecture';
import { createAchievementsMaterials } from './materials/AchievementsMaterials';
import {
  ZONE_3_ACHIEVEMENTS_CONTENT,
  Zone3AchievementsData,
  AwardItem,
  AcademicStatisticItem,
} from './config/achievementsContentData';
import { achievementsAudio } from './audio/AchievementsAudio';
import { useRoomEditorialMap } from '../../services/dynamicContentService';
import { achievementRepository } from '../../repositories';
import { Achievement } from '../../types';
import {
  Volume2,
  VolumeX,
  X,
  Sparkles,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  BookOpen,
  Headphones,
  Languages,
  Award as MedalIcon,
  Image as ImageIcon,
  Compass,
  Search,
  Filter,
  Calendar,
  ExternalLink,
  Crown,
  Trophy,
  UploadCloud,
} from 'lucide-react';

interface Props {
  onReturnToLobby: () => void;
  onOpenCmd?: () => void;
  onNavigateDestination?: (roomId: string) => void;
}

export function AchievementsScene({
  onReturnToLobby,
  onOpenCmd,
  onNavigateDestination,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const reqIdRef = useRef<number | null>(null);

  // Dynamic editorial updates from Cloud Firestore collection `editorial_contents`
  const { itemsMap: firestoreItems } = useRoomEditorialMap('achievements');

  // Dynamic achievements records from Cloud Firestore collection `achievements`
  const [firestoreAchievements, setFirestoreAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    let mounted = true;
    achievementRepository
      .getAll({ publishedOnly: true, orderByField: 'displayOrder', orderDirection: 'asc' })
      .then((records) => {
        if (mounted) setFirestoreAchievements(records);
      })
      .catch((e) => console.warn('Could not load dynamic achievements for catalogue:', e));
    return () => {
      mounted = false;
    };
  }, []);

  // Merge base content with Firestore editorial updates if available
  const content: Zone3AchievementsData = useMemo(() => {
    const base = JSON.parse(JSON.stringify(ZONE_3_ACHIEVEMENTS_CONTENT)) as Zone3AchievementsData;

    // Check Wall A awards
    base.wallA.laborMedals = base.wallA.laborMedals.map((item) => {
      const stored = firestoreItems.get(`achievements.${item.id}`) || firestoreItems.get(item.id);
      if (stored) {
        if (stored.textValues?.titleVi) item.titleVi = stored.textValues.titleVi;
        if (stored.textValues?.yearOrPeriod) item.yearOrPeriod = stored.textValues.yearOrPeriod;
        if (stored.textValues?.leadNarrativeVi) item.leadNarrativeVi = stored.textValues.leadNarrativeVi;
        if (stored.textValues?.captionVi) item.captionVi = stored.textValues.captionVi;
        if (stored.attachments && stored.attachments.length > 0) {
          const img = stored.attachments.find((a) => a.type === 'image');
          if (img) item.customUrl = img.downloadUrl;
        }
      }
      return item;
    });

    const pmStored =
      firestoreItems.get('achievements.prime_minister_2006') ||
      firestoreItems.get('achievements_prime_minister_2006');
    if (pmStored) {
      if (pmStored.textValues?.titleVi) base.wallA.primeMinisterCommendation.titleVi = pmStored.textValues.titleVi;
      if (pmStored.textValues?.yearOrPeriod) base.wallA.primeMinisterCommendation.yearOrPeriod = pmStored.textValues.yearOrPeriod;
      if (pmStored.textValues?.leadNarrativeVi) base.wallA.primeMinisterCommendation.leadNarrativeVi = pmStored.textValues.leadNarrativeVi;
      if (pmStored.textValues?.captionVi) base.wallA.primeMinisterCommendation.captionVi = pmStored.textValues.captionVi;
      if (pmStored.attachments && pmStored.attachments.length > 0) {
        const img = pmStored.attachments.find((a) => a.type === 'image');
        if (img) base.wallA.primeMinisterCommendation.customUrl = img.downloadUrl;
      }
    }

    base.wallA.otherHonors = base.wallA.otherHonors.map((item) => {
      const stored = firestoreItems.get(`achievements.${item.id}`) || firestoreItems.get(item.id);
      if (stored) {
        if (stored.textValues?.titleVi) item.titleVi = stored.textValues.titleVi;
        if (stored.textValues?.yearOrPeriod) item.yearOrPeriod = stored.textValues.yearOrPeriod;
        if (stored.textValues?.leadNarrativeVi) item.leadNarrativeVi = stored.textValues.leadNarrativeVi;
        if (stored.textValues?.captionVi) item.captionVi = stored.textValues.captionVi;
        if (stored.attachments && stored.attachments.length > 0) {
          const img = stored.attachments.find((a) => a.type === 'image');
          if (img) item.customUrl = img.downloadUrl;
        }
      }
      return item;
    });

    // Merge Wall B Section A (Dấu ấn Văn hóa — Văn nghệ)
    const cultStored =
      firestoreItems.get('achievements.cultural_artistic_heritage') ||
      firestoreItems.get('achievements_cultural_artistic_heritage');
    if (cultStored && base.wallB.culturalArtistic) {
      if (cultStored.textValues?.titleVi) base.wallB.culturalArtistic.titleVi = cultStored.textValues.titleVi;
      if (cultStored.textValues?.subtitleVi) base.wallB.culturalArtistic.subtitleVi = cultStored.textValues.subtitleVi;
      if (cultStored.textValues?.descriptionVi) base.wallB.culturalArtistic.leadNarrativeVi = cultStored.textValues.descriptionVi;
      if (cultStored.textValues?.highlight1975) base.wallB.culturalArtistic.featuredRecordVi = cultStored.textValues.highlight1975;
      if (cultStored.attachments && cultStored.attachments.length > 0) {
        const img = cultStored.attachments.find((a) => a.type === 'image');
        if (img) base.wallB.culturalArtistic.customUrl = img.downloadUrl;
      }
    }

    // Merge Wall B Section B (Dấu ấn Sân chơi Liên trường và Cấp ngành)
    const extStored =
      firestoreItems.get('achievements.external_competitions_records') ||
      firestoreItems.get('achievements_external_competitions_records');
    if (extStored && base.wallB.externalCompetitions) {
      if (extStored.textValues?.titleVi) base.wallB.externalCompetitions.titleVi = extStored.textValues.titleVi;
      if (extStored.textValues?.subtitleVi) base.wallB.externalCompetitions.subtitleVi = extStored.textValues.subtitleVi;
      if (extStored.textValues?.recordsSummary) base.wallB.externalCompetitions.leadNarrativeVi = extStored.textValues.recordsSummary;
    }

    return base;
  }, [firestoreItems]);

  // Combined flat list of all Wall A awards for modal navigation
  const allAwardsList: AwardItem[] = useMemo(() => {
    return [
      ...content.wallA.laborMedals,
      content.wallA.primeMinisterCommendation,
      ...content.wallA.otherHonors,
    ];
  }, [content]);

  // Expandable complete catalogue items (merging verified canonical awards + dynamic Firestore records)
  const fullCatalogueItems = useMemo(() => {
    const list: Array<{
      id: string;
      titleVi: string;
      titleEn?: string;
      category: string;
      categoryLabelVi: string;
      yearOrPeriod: string;
      authorityVi: string;
      descriptionVi: string;
      imageUrl?: string;
      sourceNoteVi?: string;
      isFeaturedInHonorWall?: boolean;
    }> = [];

    // Add Wall A awards
    allAwardsList.forEach((a) => {
      let catLabel = 'Huân chương Lao động';
      let catGroup = 'labor_medal';
      if (a.section === 'labor_medals') {
        catLabel = 'Huân chương Lao động';
        catGroup = 'labor_medal';
      } else if (a.section === 'prime_minister') {
        catLabel = 'Bằng khen Thủ tướng Chính phủ';
        catGroup = 'prime_minister';
      } else if (a.id === 'achievements_independence_order_3_2011') {
        catLabel = 'Huân chương Độc lập và các huân chương khác';
        catGroup = 'independence_medal';
      } else if (a.id === 'achievements_government_emulation_flag_2026') {
        catLabel = 'Cờ thi đua của Chính phủ';
        catGroup = 'government_flag';
      } else {
        catLabel = 'Khen thưởng của bộ, ngành và địa phương';
        catGroup = 'ministry_local';
      }

      list.push({
        id: a.id,
        titleVi: a.titleVi,
        titleEn: a.titleEn,
        category: catGroup,
        categoryLabelVi: catLabel,
        yearOrPeriod: a.yearOrPeriod,
        authorityVi: a.authorityVi,
        descriptionVi: a.leadNarrativeVi + (a.significanceVi ? ` • ${a.significanceVi}` : ''),
        imageUrl: a.customUrl,
        sourceNoteVi: a.sourceNoteVi,
        isFeaturedInHonorWall: true,
      });
    });

    // Add additional dynamic items from Firestore `achievements` collection if not already included
    firestoreAchievements.forEach((fa) => {
      if (!list.some((existing) => existing.id === fa.id || existing.titleVi === fa.titleVi)) {
        let catLabel = 'Khen thưởng khác';
        if (fa.category === 'labor_medal') catLabel = 'Huân chương Lao động';
        else if (fa.category === 'independence_medal') catLabel = 'Huân chương Độc lập và các huân chương khác';
        else if (fa.category === 'prime_minister') catLabel = 'Bằng khen Thủ tướng Chính phủ';
        else if (fa.category === 'ministry_local') catLabel = 'Khen thưởng bộ ngành & địa phương';
        else if (fa.category === 'academic_olympiad') catLabel = 'Thành tích học sinh giỏi và STEM';
        else if (fa.category === 'graduation_exam') catLabel = 'Thành tích tốt nghiệp THPT';

        list.push({
          id: fa.id,
          titleVi: fa.titleVi,
          titleEn: fa.titleEn,
          category: fa.category,
          categoryLabelVi: catLabel,
          yearOrPeriod: fa.date || String(fa.year),
          authorityVi: fa.authorityVi || 'Cơ quan có thẩm quyền',
          descriptionVi: fa.descriptionVi,
          imageUrl: fa.imageGallery && fa.imageGallery.length > 0 ? fa.imageGallery[0] : undefined,
          sourceNoteVi: fa.documentUrl || 'Hồ sơ lưu trữ nhà trường',
          isFeaturedInHonorWall: Boolean(fa.featuredInHonorWall),
        });
      }
    });

    return list;
  }, [allAwardsList, firestoreAchievements]);

  // Wall B statistics list
  const allStatsList: AcademicStatisticItem[] = useMemo(() => {
    return [
      content.wallB.olympiad,
      content.wallB.stemAndScience,
      content.wallB.educationalQuality,
      content.wallB.graduationExam,
    ];
  }, [content]);

  // UI States
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const [isMuted, setIsMuted] = useState(achievementsAudio.getMutedState());
  const [isNarrating, setIsNarrating] = useState(false);
  const [hoveredExhibit, setHoveredExhibit] = useState<InteractiveAchievementExhibit | null>(null);

  // Active Modals
  const [selectedAwardIndex, setSelectedAwardIndex] = useState<number | null>(null);
  const [selectedStatIndex, setSelectedStatIndex] = useState<number | null>(null);
  const [selectedStatYear, setSelectedStatYear] = useState<string>('2025–2026');
  const [isCatalogueOpen, setIsCatalogueOpen] = useState(false);
  const [isDaiVinhDanhOpen, setIsDaiVinhDanhOpen] = useState(false);
  const [orientationModalData, setOrientationModalData] = useState<{ titleVi: string; descVi: string } | null>(null);
  const [isCulturalModalOpen, setIsCulturalModalOpen] = useState(false);
  const [isExternalModalOpen, setIsExternalModalOpen] = useState(false);

  // Catalogue Filters
  const [catalogueSearch, setCatalogueSearch] = useState('');
  const [catalogueCategoryFilter, setCatalogueCategoryFilter] = useState<string>('all');

  // Camera & Player Position
  const playerPos = useRef(new THREE.Vector3(0, 1.6, 13.8));
  const targetPos = useRef(new THREE.Vector3(0, 1.6, 13.8));
  const cameraRotation = useRef({ yaw: 0, pitch: 0 });
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const keysDown = useRef<Record<string, boolean>>({});

  // Audio Toggles
  const toggleAudio = () => {
    const muted = achievementsAudio.toggleMute();
    setIsMuted(muted);
  };

  const toggleNarration = useCallback(() => {
    achievementsAudio.ensureRunning();
    if (isNarrating) {
      achievementsAudio.stopNarration();
      setIsNarrating(false);
    } else {
      achievementsAudio.playClick();
      const narrativeText =
        lang === 'vi'
          ? `Chào mừng bạn đến với Phân khu 3: Bảng vàng thành tích 60 năm Trường THPT A Trần Hưng Đạo. Vách A bên trái tôn vinh các danh hiệu và phần thưởng cao quý gồm ba Huân chương Lao động hạng Nhất, Nhì, Ba, Bằng khen Thủ tướng Chính phủ, Huân chương Độc lập hạng Ba và Cờ thi đua Chính phủ. Vách B bên phải là thành tựu học thuật bứt phá năm học 2025–2026 với 100% thí sinh đạt giải HSG tỉnh và điểm trung bình tốt nghiệp xếp thứ 8 toàn tỉnh. Phía cuối phòng là Đài Vinh Danh trang trọng tôn vinh các mốc son chói lọi. Bạn có thể nhấn vào biển tra cứu để xem toàn bộ danh mục danh hiệu qua các thời kỳ.`
          : `Welcome to Zone 3: The Hall of Achievements of Tran Hung Dao High School. Wall A presents the State honours and Labour Medals; Wall B exhibits the 2025–2026 academic excellence and graduation records. At the rear is the Grand Wall of Honour.`;

      achievementsAudio.startNarration(narrativeText, lang, () => setIsNarrating(false));
      setIsNarrating(true);
    }
  }, [isNarrating, lang]);

  // Quick Teleport Navigation
  const teleportToArea = (
    area: 'entry' | 'labor' | 'prime_minister' | 'other_honors' | 'olympiad' | 'graduation' | 'dai_vinh_danh' | 'cultural' | 'external'
  ) => {
    achievementsAudio.playTeleport();
    if (area === 'entry') {
      playerPos.current.set(0, 1.6, 13.8);
      cameraRotation.current = { yaw: 0, pitch: 0 };
    } else if (area === 'labor') {
      // Facing Wall A Labor medals (centered at Z = 6.0)
      playerPos.current.set(-4.2, 1.6, 6.0);
      cameraRotation.current = { yaw: -Math.PI / 2, pitch: 0.04 };
    } else if (area === 'prime_minister') {
      // Facing prominent Prime Minister's Commendation (Z = -2.0)
      playerPos.current.set(-4.2, 1.6, -2.0);
      cameraRotation.current = { yaw: -Math.PI / 2, pitch: 0.06 };
    } else if (area === 'other_honors') {
      // Facing other honours (Z = -8.0)
      playerPos.current.set(-4.2, 1.6, -8.0);
      cameraRotation.current = { yaw: -Math.PI / 2, pitch: 0.04 };
    } else if (area === 'olympiad') {
      // Facing Wall B Olympiad & STEM (Z = 8.0)
      playerPos.current.set(4.2, 1.6, 8.0);
      cameraRotation.current = { yaw: Math.PI / 2, pitch: 0.04 };
    } else if (area === 'graduation') {
      // Facing Wall B Quality trends & 2026 Graduation Exam (Z = -2.0)
      playerPos.current.set(4.2, 1.6, -2.0);
      cameraRotation.current = { yaw: Math.PI / 2, pitch: 0.04 };
    } else if (area === 'cultural') {
      // Facing Empty Wall Section A: Dấu ấn Văn hóa - Văn nghệ (Z = -6.0)
      playerPos.current.set(4.2, 1.6, -6.0);
      cameraRotation.current = { yaw: Math.PI / 2, pitch: 0.04 };
    } else if (area === 'external') {
      // Facing Empty Wall Section B: Dấu ấn Sân chơi ngoài trường (Z = -10.0)
      playerPos.current.set(4.2, 1.6, -10.0);
      cameraRotation.current = { yaw: Math.PI / 2, pitch: 0.04 };
    } else if (area === 'dai_vinh_danh') {
      // Facing Grand North Wall Đài Vinh Danh
      playerPos.current.set(0, 1.6, -10.5);
      cameraRotation.current = { yaw: 0, pitch: 0.05 };
    }
  };

  // Click Handler for 3D Exhibits
  const handleExhibitClick = useCallback(
    (exhibit: InteractiveAchievementExhibit) => {
      achievementsAudio.playBronzeBell();

      if (exhibit.category === 'catalogue_button') {
        setIsCatalogueOpen(true);
      } else if (exhibit.category === 'dai_vinh_danh') {
        setIsDaiVinhDanhOpen(true);
      } else if (exhibit.category === 'cultural_artistic') {
        setIsCulturalModalOpen(true);
      } else if (exhibit.category === 'external_competitions') {
        setIsExternalModalOpen(true);
      } else if (
        exhibit.category === 'award_labor' ||
        exhibit.category === 'award_prime_minister' ||
        exhibit.category === 'award_other'
      ) {
        const foundIdx = allAwardsList.findIndex((a) => a.id === exhibit.id);
        if (foundIdx !== -1) {
          setSelectedAwardIndex(foundIdx);
        } else {
          setSelectedAwardIndex(0);
        }
      } else if (exhibit.category === 'academic_stat') {
        const foundIdx = allStatsList.findIndex((s) => s.id === exhibit.id);
        if (foundIdx !== -1) {
          setSelectedStatIndex(foundIdx);
        } else {
          setSelectedStatIndex(0);
        }
      } else if (exhibit.category === 'orientation' || exhibit.category === 'central_dais') {
        setOrientationModalData({
          titleVi: exhibit.titleVi,
          descVi: exhibit.dataPayload?.descriptionVi || exhibit.dataPayload?.totalAwardsNoteVi || exhibit.subtitleVi,
        });
      }
    },
    [allAwardsList, allStatsList]
  );

  // 3D Scene Initialization
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    achievementsAudio.ensureRunning();

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x120e0a);
    scene.fog = new THREE.FogExp2(0x100c08, 0.016);
    sceneRef.current = scene;

    // 2. Camera Setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(62, width / height, 0.1, 100);
    camera.position.copy(playerPos.current);
    camera.lookAt(0, 1.6, 6.0);
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Build 3D Physical Architecture
    const materials = createAchievementsMaterials();
    const sceneElements = buildAchievementsRoomArchitecture(materials, content);
    scene.add(sceneElements.group);

    // 5. Raycasting for Mouse Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      if (isDragging.current) {
        const deltaX = e.clientX - lastMousePos.current.x;
        const deltaY = e.clientY - lastMousePos.current.y;
        lastMousePos.current = { x: e.clientX, y: e.clientY };

        cameraRotation.current.yaw -= deltaX * 0.003;
        cameraRotation.current.pitch = Math.max(
          -Math.PI / 3,
          Math.min(Math.PI / 3, cameraRotation.current.pitch - deltaY * 0.003)
        );
      }

      // Raycasting for interactive hover feedback
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = sceneElements.interactiveExhibits.map((ex) => ex.mesh);
      const intersects = raycaster.intersectObjects(meshes, true);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        const found = sceneElements.interactiveExhibits.find((ex) => {
          let cur: THREE.Object3D | null = hitMesh;
          while (cur) {
            if (cur === ex.mesh) return true;
            cur = cur.parent;
          }
          return false;
        });
        if (found) {
          container.style.cursor = 'pointer';
          setHoveredExhibit(found);
          return;
        }
      }
      container.style.cursor = 'grab';
      setHoveredExhibit(null);
    };

    const handlePointerDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      isDragging.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      container.style.cursor = 'grabbing';
    };

    const handlePointerUp = (e: MouseEvent) => {
      isDragging.current = false;
      container.style.cursor = 'grab';

      // Check if this was a click on an exhibit
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = sceneElements.interactiveExhibits.map((ex) => ex.mesh);
      const intersects = raycaster.intersectObjects(meshes, true);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        const found = sceneElements.interactiveExhibits.find((ex) => {
          let cur: THREE.Object3D | null = hitMesh;
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
    };

    // Keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      keysDown.current[e.code] = true;
      if (e.code === 'KeyE') {
        if (hoveredExhibit) {
          handleExhibitClick(hoveredExhibit);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysDown.current[e.code] = false;
    };

    window.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Touch controls for mobile viewing
    let touchStartX = 0;
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - touchStartX;
        const deltaY = e.touches[0].clientY - touchStartY;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;

        cameraRotation.current.yaw -= deltaX * 0.004;
        cameraRotation.current.pitch = Math.max(
          -Math.PI / 3,
          Math.min(Math.PI / 3, cameraRotation.current.pitch - deltaY * 0.004)
        );
      }
    };
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation & Render Loop
    let clock = new THREE.Clock();
    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);

      // Player Movement
      const moveSpeed = (keysDown.current['ShiftLeft'] || keysDown.current['ShiftRight'] ? 6.5 : 3.8) * delta;
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

      if (keysDown.current['KeyW'] || keysDown.current['ArrowUp']) {
        targetPos.current.addScaledVector(forward, moveSpeed);
      }
      if (keysDown.current['KeyS'] || keysDown.current['ArrowDown']) {
        targetPos.current.addScaledVector(forward, -moveSpeed);
      }
      if (keysDown.current['KeyA'] || keysDown.current['ArrowLeft']) {
        targetPos.current.addScaledVector(right, -moveSpeed);
      }
      if (keysDown.current['KeyD'] || keysDown.current['ArrowRight']) {
        targetPos.current.addScaledVector(right, moveSpeed);
      }

      // Boundary Collisions (Room: X in [-6.8, 6.8], Z in [-14.5, 14.5])
      targetPos.current.x = Math.max(-6.8, Math.min(6.8, targetPos.current.x));
      targetPos.current.z = Math.max(-14.5, Math.min(14.5, targetPos.current.z));

      // Smooth position interpolation
      playerPos.current.lerp(targetPos.current, 0.15);
      camera.position.copy(playerPos.current);

      // Camera view direction
      const lookDir = new THREE.Vector3(
        -Math.sin(cameraRotation.current.yaw) * Math.cos(cameraRotation.current.pitch),
        Math.sin(cameraRotation.current.pitch),
        -Math.cos(cameraRotation.current.yaw) * Math.cos(cameraRotation.current.pitch)
      );
      camera.lookAt(playerPos.current.clone().add(lookDir));

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      window.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [content, handleExhibitClick]);

  // Filtered Catalogue records
  const filteredCatalogue = useMemo(() => {
    return fullCatalogueItems.filter((item) => {
      const matchCat =
        catalogueCategoryFilter === 'all' ||
        item.category === catalogueCategoryFilter ||
        (catalogueCategoryFilter === 'labor' && item.category === 'labor_medal') ||
        (catalogueCategoryFilter === 'independence' && item.category === 'independence_medal') ||
        (catalogueCategoryFilter === 'prime_minister' && item.category === 'prime_minister') ||
        (catalogueCategoryFilter === 'ministry_local' && (item.category === 'ministry_local' || item.category === 'government_flag'));

      const q = catalogueSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.titleVi.toLowerCase().includes(q) ||
        item.yearOrPeriod.toLowerCase().includes(q) ||
        item.authorityVi.toLowerCase().includes(q) ||
        item.descriptionVi.toLowerCase().includes(q);

      return matchCat && matchSearch;
    });
  }, [fullCatalogueItems, catalogueSearch, catalogueCategoryFilter]);

  return (
    <div className="relative w-full h-screen overflow-hidden select-none bg-[#120e0a]">
      {/* 3D Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* ========================================================================= */}
      {/* COMPACT TOP NAVIGATION BAR: Streamlined, Zero Awkward Wrapping             */}
      {/* ========================================================================= */}
      <div className="absolute top-3 left-3 right-3 z-20 pointer-events-auto flex items-center justify-between gap-2.5">
        {/* Title Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0e1626]/95 border border-[#d4af37]/60 shadow-xl backdrop-blur-md flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#d4af37] to-[#ffd988] flex items-center justify-center text-[#140e09] font-bold shadow-sm shadow-[#d4af37]/40">
            <MedalIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[9px] font-mono text-[#ffd988] tracking-widest uppercase">
              KHU 3 • DI SẢN 60 NĂM
            </div>
            <h1 className="text-xs sm:text-sm font-serif font-bold text-white tracking-wide truncate max-w-[170px] sm:max-w-none">
              BẢNG VÀNG THÀNH TÍCH
            </h1>
          </div>
        </div>

        {/* Compact Quick Jump Tabs (Center) */}
        <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-[#0e1626]/90 border border-[#d4af37]/40 shadow-xl backdrop-blur-md">
          <button
            onClick={() => teleportToArea('entry')}
            className="px-2.5 py-1 text-xs rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            Cổng vào
          </button>
          <button
            onClick={() => teleportToArea('labor')}
            className="px-2.5 py-1 text-xs rounded-lg text-[#ffd988] font-bold hover:bg-[#d4af37]/20 transition-colors cursor-pointer"
          >
            🥇 HC Lao động
          </button>
          <button
            onClick={() => teleportToArea('prime_minister')}
            className="px-2.5 py-1 text-xs rounded-lg text-amber-300 font-bold hover:bg-white/10 transition-colors cursor-pointer"
          >
            🎖️ BK Thủ tướng
          </button>
          <button
            onClick={() => teleportToArea('other_honors')}
            className="px-2.5 py-1 text-xs rounded-lg text-amber-200 hover:bg-white/10 transition-colors cursor-pointer"
          >
            ⭐ Khen thưởng khác
          </button>
          <button
            onClick={() => teleportToArea('olympiad')}
            className="px-2.5 py-1 text-xs rounded-lg text-cyan-300 font-bold hover:bg-white/10 transition-colors cursor-pointer"
          >
            🏆 HSG & STEM
          </button>
          <button
            onClick={() => teleportToArea('graduation')}
            className="px-2.5 py-1 text-xs rounded-lg text-emerald-300 font-bold hover:bg-white/10 transition-colors cursor-pointer"
          >
            📊 Tốt nghiệp '26
          </button>
          <button
            onClick={() => teleportToArea('dai_vinh_danh')}
            className="px-2.5 py-1 text-xs rounded-lg text-amber-400 font-bold bg-[#d4af37]/20 border border-[#d4af37]/50 hover:bg-[#d4af37]/30 transition-colors cursor-pointer"
          >
            👑 Đài vinh danh
          </button>
        </div>

        {/* Actions & Catalogue Button */}
        <div className="flex items-center gap-1.5">
          {/* PROMINENT CATALOGUE BUTTON */}
          <button
            onClick={() => setIsCatalogueOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#ffd988] text-black font-serif font-bold text-xs shadow-lg shadow-[#d4af37]/25 hover:brightness-110 transition-all cursor-pointer border border-[#ffd988]"
            title="Xem toàn bộ huân chương, huy chương và khen thưởng"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xem toàn bộ danh hiệu ({fullCatalogueItems.length})</span>
            <span className="sm:hidden">Danh hiệu ({fullCatalogueItems.length})</span>
          </button>

          {/* Audio Tour */}
          <button
            onClick={toggleNarration}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border backdrop-blur-md transition-all cursor-pointer text-xs font-serif ${
              isNarrating
                ? 'bg-amber-500/30 border-amber-400 text-amber-300 animate-pulse'
                : 'bg-[#0e1626]/90 border-[#d4af37]/40 text-[#ffd988] hover:bg-white/10'
            }`}
            title="Thuyết minh âm thanh"
          >
            <Headphones className={`w-3.5 h-3.5 ${isNarrating ? 'text-amber-300' : 'text-[#ffd988]'}`} />
            <span className="hidden md:inline font-medium">
              {isNarrating ? 'Đang thuyết minh' : 'Thuyết minh'}
            </span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => {
              achievementsAudio.playClick();
              setLang(lang === 'vi' ? 'en' : 'vi');
            }}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-[#0e1626]/90 border border-[#d4af37]/40 text-[#ffd988] hover:bg-white/10 transition-colors cursor-pointer text-xs font-mono font-bold"
            title="Đổi ngôn ngữ"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'EN' : 'VI'}</span>
          </button>

          {/* Audio Mute */}
          <button
            onClick={toggleAudio}
            className="p-1.5 rounded-xl bg-[#0e1626]/90 border border-[#d4af37]/40 text-[#ffd988] hover:bg-white/10 transition-colors cursor-pointer"
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-zinc-500" /> : <Volume2 className="w-4 h-4 text-[#ffd988]" />}
          </button>
        </div>
      </div>

      {/* BOTTOM-LEFT: Navigation Back to Sảnh Chính / Other Rooms */}
      <div className="absolute bottom-5 left-5 z-20 pointer-events-auto flex items-center gap-2">
        <button
          onClick={onReturnToLobby}
          className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0e1626]/95 hover:bg-[#162238] border border-[#d4af37] text-[#f3ebdd] hover:text-white shadow-xl shadow-black/60 transition-all cursor-pointer backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4 text-[#ffd988] group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-serif font-bold uppercase tracking-wider">
            VỀ SẢNH CHÍNH
          </span>
        </button>

        {onNavigateDestination && (
          <>
            <button
              onClick={() => onNavigateDestination('development')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-950/85 hover:bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 hover:text-white backdrop-blur-md transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#ffd988]" />
              <span>Phòng Phát Triển</span>
            </button>
            <button
              onClick={() => onNavigateDestination('history')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-950/85 hover:bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 hover:text-white backdrop-blur-md transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#ffd988]" />
              <span>Phòng Lịch Sử</span>
            </button>
          </>
        )}
      </div>

      {/* BOTTOM-RIGHT: CMD Admin Access Button */}
      <div className="absolute bottom-5 right-5 z-20 pointer-events-auto">
        <button
          onClick={onOpenCmd}
          className="text-xs font-mono text-zinc-300 hover:text-[#ffd988] px-3 py-2 rounded-xl bg-[#0e1626]/90 hover:bg-[#162238] border border-zinc-700 hover:border-[#d4af37]/60 shadow-lg transition-colors cursor-pointer"
          title="Quản trị nội dung CMD"
        >
          [ CMD ADMIN ]
        </button>
      </div>

      {/* BOTTOM-CENTER: Interactive Hover Prompt */}
      {hoveredExhibit && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0e1626]/95 border-2 border-[#d4af37] text-[#ffd988] backdrop-blur-md shadow-2xl shadow-black/80 animate-bounce">
            <Sparkles className="w-4 h-4 text-[#ffd988]" />
            <span className="text-xs font-serif font-bold tracking-wide">
              Nhấp hoặc nhấn phím E: {hoveredExhibit.titleVi}
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: COMPLETE EXPANDABLE AWARD CATALOGUE MODAL                         */}
      {/* "XEM TOÀN BỘ HUÂN CHƯƠNG, HUY CHƯƠNG VÀ KHEN THƯỞNG"                     */}
      {/* ========================================================================= */}
      {isCatalogueOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#0e1626] border-2 border-[#d4af37] rounded-3xl shadow-2xl overflow-hidden text-left text-[#f3ebdd] relative">
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-[#d4af37]/30 bg-gradient-to-r from-[#142036] to-[#0a101d] flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#ffd988] text-[11px] font-mono font-bold tracking-wider">
                  ✦ DANH MỤC LƯU TRỮ ĐIỆN TỬ 1966–2026 ✦
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
                  XEM TOÀN BỘ HUÂN CHƯƠNG, HUY CHƯƠNG VÀ KHEN THƯỞNG
                </h2>
                <p className="text-xs text-zinc-300 font-sans">
                  Tra cứu toàn bộ danh hiệu cao quý của Đảng, Nhà nước, Bộ ngành và các thành tích giáo dục được kiểm chứng.
                </p>
              </div>
              <button
                onClick={() => setIsCatalogueOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 bg-black/40 border-b border-zinc-800 flex flex-col sm:flex-row items-center gap-3">
              {/* Search input */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={catalogueSearch}
                  onChange={(e) => setCatalogueSearch(e.target.value)}
                  placeholder="Tìm kiếm theo tên danh hiệu, năm, cơ quan trao tặng, từ khóa..."
                  className="w-full pl-10 pr-4 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Category selector */}
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <Filter className="w-4 h-4 text-zinc-400 hidden sm:block" />
                <select
                  value={catalogueCategoryFilter}
                  onChange={(e) => setCatalogueCategoryFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-200 focus:outline-none focus:border-[#d4af37] cursor-pointer"
                >
                  <option value="all">Tất cả danh mục ({fullCatalogueItems.length})</option>
                  <option value="labor">Huân chương Lao động</option>
                  <option value="prime_minister">Bằng khen của Thủ tướng Chính phủ</option>
                  <option value="independence">Huân chương Độc lập và các huân chương khác</option>
                  <option value="ministry_local">Khen thưởng bộ ngành & địa phương</option>
                </select>
              </div>
            </div>

            {/* Catalogue Grid */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCatalogue.length === 0 ? (
                <div className="col-span-full py-16 text-center text-zinc-400 font-serif space-y-2">
                  <p className="text-base text-zinc-300">Không tìm thấy danh hiệu phù hợp với từ khóa.</p>
                  <p className="text-xs text-zinc-500">Vui lòng thử tìm kiếm với từ khóa khác hoặc bỏ chọn bộ lọc.</p>
                </div>
              ) : (
                filteredCatalogue.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between p-4 rounded-2xl bg-zinc-900/80 border border-[#d4af37]/30 hover:border-[#d4af37] transition-all group"
                  >
                    <div className="space-y-3">
                      {/* Image Thumbnail or Deliberate Placeholder */}
                      <div className="w-full h-44 rounded-xl bg-black/60 border border-zinc-800 overflow-hidden flex items-center justify-center relative">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.titleVi}
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <div className="text-center p-3 space-y-1.5">
                            <ImageIcon className="w-8 h-8 text-[#d4af37]/60 mx-auto" />
                            <div className="text-[11px] font-mono text-[#ffd988]">
                              [ BẠN TRỰC TIẾP TẢI ẢNH LÊN TỪ CMD ]
                            </div>
                            <div className="text-[10px] text-zinc-500 font-sans">
                              Mã danh hiệu: {item.id}
                            </div>
                          </div>
                        )}

                        {item.isFeaturedInHonorWall && (
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold font-mono bg-[#d4af37] text-black shadow-md">
                            ĐÀI VINH DANH
                          </span>
                        )}
                      </div>

                      {/* Header info */}
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-[#ffd988] mb-1">
                          <span className="px-2 py-0.5 rounded bg-[#d4af37]/20 border border-[#d4af37]/40">
                            {item.yearOrPeriod}
                          </span>
                          <span className="text-zinc-400 truncate max-w-[130px]">{item.authorityVi}</span>
                        </div>
                        <h3 className="font-serif font-bold text-base text-white group-hover:text-[#ffd988] transition-colors line-clamp-2">
                          {item.titleVi}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-zinc-300 font-serif line-clamp-3 leading-relaxed">
                        {item.descriptionVi}
                      </p>
                    </div>

                    {/* Footer citation & Actions */}
                    <div className="pt-3 mt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <span className="truncate max-w-[180px]">
                        {item.sourceNoteVi ? `Nguồn: ${item.sourceNoteVi}` : 'Hồ sơ lưu trữ 60 năm'}
                      </span>
                      {onOpenCmd && (
                        <button
                          onClick={() => {
                            setIsCatalogueOpen(false);
                            onOpenCmd();
                          }}
                          className="text-[#ffd988] hover:underline cursor-pointer"
                        >
                          Tải ảnh (CMD) →
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-800 bg-[#0a101d] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400 font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Hiển thị {filteredCatalogue.length} / {fullCatalogueItems.length} danh hiệu đã công bố</span>
              </div>
              <div>
                <span>Quản trị viên có thể thêm danh hiệu mới qua mục <strong>Bảng Vàng Thành Tích</strong> trong CMD Admin</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ĐÀI VINH DANH (GRAND WALL OF HONOUR SHOWCASE)                     */}
      {/* ========================================================================= */}
      {isDaiVinhDanhOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0e1626] border-2 border-[#d4af37] rounded-3xl shadow-2xl overflow-hidden text-left text-[#f3ebdd] relative">
            {/* Header */}
            <div className="p-6 border-b border-[#d4af37]/30 bg-gradient-to-r from-[#1c1214] via-[#142036] to-[#0e1626] flex items-center justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#ffd988] text-[11px] font-mono font-bold tracking-wider">
                  👑 KHÔNG GIAN VINH DANH TRUNG TÂM PHÍA BẮC 👑
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                  ĐÀI VINH DANH • DANH HIỆU & THÀNH TỰU TIÊU BIỂU
                </h2>
                <p className="text-xs text-zinc-300 font-sans">
                  Biểu tượng ghi nhận các danh hiệu cao quý nhất của Đảng, Nhà nước và đỉnh cao chất lượng giáo dục qua 60 năm.
                </p>
              </div>
              <button
                onClick={() => setIsDaiVinhDanhOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Showcase Cards List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Labor Medals */}
                <div className="p-5 rounded-2xl bg-zinc-900/90 border border-[#d4af37]/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🥇</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#d4af37]/20 text-[#ffd988] border border-[#d4af37]/40">
                      1991 – 2000
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-white">
                    TRỌN BỘ 3 HUÂN CHƯƠNG LAO ĐỘNG
                  </h3>
                  <p className="text-xs text-zinc-300 font-serif leading-relaxed">
                    Nhà trường vinh dự đón nhận Huân chương Lao động hạng Ba (1991), Huân chương Lao động hạng Nhì (1996) và Huân chương Lao động hạng Nhất (2000) do Hội đồng Nhà nước và Chủ tịch nước trao tặng.
                  </p>
                </div>

                {/* 2. Prime Minister Commendation */}
                <div className="p-5 rounded-2xl bg-zinc-900/90 border border-[#d4af37]/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🎖️</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#d4af37]/20 text-[#ffd988] border border-[#d4af37]/40">
                      NĂM 2006
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-white">
                    BẰNG KHEN CỦA THỦ TƯỚNG CHÍNH PHỦ
                  </h3>
                  <p className="text-xs text-zinc-300 font-serif leading-relaxed">
                    Phần thưởng cao quý của Thủ tướng Chính phủ Nước Cộng hòa Xã hội Chủ nghĩa Việt Nam trao tặng nhân dịp đại lễ kỷ niệm 40 năm ngày thành lập trường (1966–2006).
                  </p>
                </div>

                {/* 3. Independence Medal */}
                <div className="p-5 rounded-2xl bg-zinc-900/90 border border-[#d4af37]/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">⭐</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#d4af37]/20 text-[#ffd988] border border-[#d4af37]/40">
                      NĂM 2011
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-white">
                    HUÂN CHƯƠNG ĐỘC LẬP HẠNG BA
                  </h3>
                  <p className="text-xs text-zinc-300 font-serif leading-relaxed">
                    Phần thưởng đặc biệt cao quý của Chủ tịch nước trao tặng năm 2011, đánh dấu cột mốc lịch sử 45 năm phát triển kiên cường và đóng góp to lớn cho sự nghiệp giáo dục cách mạng.
                  </p>
                </div>

                {/* 4. Government Flag */}
                <div className="p-5 rounded-2xl bg-zinc-900/90 border border-[#d4af37]/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🚩</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#d4af37]/20 text-[#ffd988] border border-[#d4af37]/40">
                      NĂM HỌC 2025–2026
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-white">
                    CỜ THI ĐUA CỦA CHÍNH PHỦ
                  </h3>
                  <p className="text-xs text-zinc-300 font-serif leading-relaxed">
                    Ghi nhận đơn vị xuất sắc dẫn đầu phong trào thi đua đổi mới, nâng cao chất lượng giáo dục và bứt phá toàn diện hướng tới mốc son 60 năm vẻ vang.
                  </p>
                </div>
              </div>

              {/* 5. 2025-2026 Academic Pinnacle Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-400/50 space-y-2">
                <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs font-bold">
                  <Trophy className="w-4 h-4 text-cyan-400" />
                  <span>ĐỈNH CAO THÀNH TỰU HỌC THUẬT & NGHIÊN CỨU KHOA HỌC (2025–2026)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-center">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-cyan-500/30">
                    <div className="text-xl font-bold font-serif text-cyan-300">39 / 39 (100%)</div>
                    <div className="text-[11px] text-zinc-300">Giải Học sinh Giỏi cấp Tỉnh</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-cyan-500/30">
                    <div className="text-xl font-bold font-serif text-[#ffd988]">Nhất Toàn Đoàn</div>
                    <div className="text-[11px] text-zinc-300">KHKT & STEM 3 năm liền</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-cyan-500/30">
                    <div className="text-xl font-bold font-serif text-emerald-300">Top 8 / 143</div>
                    <div className="text-[11px] text-zinc-300">Điểm TB tốt nghiệp toàn tỉnh</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-cyan-500/30">
                    <div className="text-xl font-bold font-serif text-amber-300">Top 2 Toàn Tỉnh</div>
                    <div className="text-[11px] text-zinc-300">Lịch sử (8.53) & Văn (8.23)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-zinc-800 bg-[#0a101d] flex items-center justify-between">
              <button
                onClick={() => {
                  setIsDaiVinhDanhOpen(false);
                  setIsCatalogueOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-[#d4af37] text-black font-serif font-bold text-xs hover:bg-[#ffe399] transition-colors cursor-pointer"
              >
                Mở Danh Mục Tra Cứu Toàn Bộ →
              </button>
              <button
                onClick={() => setIsDaiVinhDanhOpen(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-serif hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: INDIVIDUAL AWARD DETAIL MODAL (WALL A)                           */}
      {/* ========================================================================= */}
      {selectedAwardIndex !== null && (() => {
        const award = allAwardsList[selectedAwardIndex];
        const isPrime = award.section === 'prime_minister';
        const isLabor = award.section === 'labor_medals';
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#0e1626] border-2 border-[#d4af37] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-left text-[#f3ebdd] relative">
              <button
                onClick={() => setSelectedAwardIndex(null)}
                className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header Badges */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#ffd988] text-xs font-mono font-bold tracking-wider">
                  {isLabor
                    ? '✦ VÁCH A: HUÂN CHƯƠNG LAO ĐỘNG ✦'
                    : isPrime
                    ? '✦ VÁCH A: BẰNG KHEN CỦA THỦ TƯỚNG CHÍNH PHỦ ✦'
                    : '✦ VÁCH A: CÁC DANH HIỆU & KHEN THƯỞNG KHÁC ✦'}
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                  {award.titleVi.toUpperCase()}
                </h2>
                <div className="text-sm text-[#ffd988] font-mono">
                  Năm trao tặng: <strong>{award.yearOrPeriod}</strong> • Cơ quan ban hành:{' '}
                  <strong>{award.authorityVi}</strong>
                </div>
              </div>

              {/* Quick Switcher for Wall A awards */}
              <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-black/40 border border-[#d4af37]/30">
                {allAwardsList.map((a, idx) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      achievementsAudio.playClick();
                      setSelectedAwardIndex(idx);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-serif transition-all cursor-pointer flex items-center gap-1 ${
                      selectedAwardIndex === idx
                        ? 'bg-[#d4af37] text-black font-bold shadow-md shadow-[#d4af37]/20'
                        : 'bg-transparent text-zinc-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="font-mono text-[10px]">{a.yearOrPeriod}</span>
                    <span className="truncate max-w-[120px]">{a.titleVi}</span>
                  </button>
                ))}
              </div>

              {/* Image Preview or Deliberate Placeholder */}
              <div className="p-4 sm:p-6 rounded-2xl bg-black/60 border-2 border-[#d4af37]/50 shadow-inner flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
                {award.customUrl ? (
                  <img
                    src={award.customUrl}
                    alt={award.titleVi}
                    className="w-full max-h-[380px] object-contain rounded-xl border border-[#d4af37]/40 shadow-2xl"
                  />
                ) : (
                  <div className="w-full py-12 px-4 rounded-xl border border-dashed border-[#d4af37]/50 bg-gradient-to-b from-[#142036]/60 to-[#0e1626]/80 flex flex-col items-center justify-center space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#ffd988]">
                      <ImageIcon className="w-8 h-8 text-[#ffd988]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif font-bold text-base text-white">
                        Khung Trưng Bày Hình Ảnh Chứng Nhận Danh Hiệu
                      </h4>
                      <p className="text-xs text-[#ffd988] font-mono">
                        [ BẠN TRỰC TIẾP TẢI ẢNH LÊN TỪ CMD ]
                      </p>
                      <p className="text-[11px] text-zinc-400 max-w-md mx-auto font-sans">
                        Hệ thống đã kết nối sẵn Cloud Firestore & Storage cho danh hiệu này ({award.id}). Quản trị viên tải ảnh chụp thật qua mục Quản lý Nội dung hoặc Bảng vàng CMD.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Detailed Narrative */}
              <div className="p-5 rounded-2xl bg-black/40 border border-zinc-800 text-sm leading-relaxed text-zinc-200 space-y-3 font-serif">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-[#ffd988] font-sans flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#ffd988]" />
                    Ý Nghĩa Lịch Sử & Lời Dẫn
                  </h3>
                  <p>{award.leadNarrativeVi}</p>
                </div>
                {award.significanceVi && (
                  <div className="pt-2 border-t border-zinc-800/80 text-xs text-amber-200/90 italic">
                    ✦ {award.significanceVi}
                  </div>
                )}
                {award.sourceNoteVi && (
                  <div className="text-[11px] font-mono text-zinc-400">
                    Căn cứ tư liệu: {award.sourceNoteVi}
                  </div>
                )}
              </div>

              {/* Navigation & CMD Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-zinc-800">
                <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>
                    Mã CMD: <strong>achievements.{award.id}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={selectedAwardIndex === 0}
                    onClick={() => {
                      achievementsAudio.playClick();
                      setSelectedAwardIndex((prev) => Math.max(0, (prev || 0) - 1));
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-serif font-bold flex items-center gap-1 transition-all ${
                      selectedAwardIndex === 0
                        ? 'opacity-30 border-zinc-700 text-zinc-500 cursor-not-allowed'
                        : 'border-[#d4af37]/60 text-[#ffd988] hover:bg-white/10 cursor-pointer'
                    }`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Trước</span>
                  </button>
                  <button
                    disabled={selectedAwardIndex === allAwardsList.length - 1}
                    onClick={() => {
                      achievementsAudio.playClick();
                      setSelectedAwardIndex((prev) => Math.min(allAwardsList.length - 1, (prev || 0) + 1));
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-serif font-bold flex items-center gap-1 transition-all ${
                      selectedAwardIndex === allAwardsList.length - 1
                        ? 'opacity-30 border-zinc-700 text-zinc-500 cursor-not-allowed'
                        : 'border-[#d4af37]/60 text-[#ffd988] hover:bg-white/10 cursor-pointer'
                    }`}
                  >
                    <span>Kế tiếp</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  {onOpenCmd && (
                    <button
                      onClick={() => {
                        setSelectedAwardIndex(null);
                        onOpenCmd();
                      }}
                      className="ml-2 px-3 py-1.5 rounded-xl bg-[#d4af37]/20 hover:bg-[#d4af37]/30 border border-[#d4af37] text-xs font-mono font-bold text-[#ffd988] transition-all cursor-pointer"
                    >
                      Tải ảnh qua CMD →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* MODAL 4: ACADEMIC STATISTICS MODAL WITH SCHOOL YEAR SELECTOR (WALL B)      */}
      {/* ========================================================================= */}
      {selectedStatIndex !== null && (() => {
        const stat = allStatsList[selectedStatIndex];
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#0e1626] border-2 border-cyan-400 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-left text-[#f3ebdd] relative">
              <button
                onClick={() => setSelectedStatIndex(null)}
                className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-xs font-mono font-bold tracking-wider">
                  ✦ VÁCH B: THÀNH TÍCH GIÁO DỤC NĂM HỌC 2025–2026 ✦
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                  {stat.titleVi}
                </h2>
                <div className="text-sm text-cyan-200 font-mono">
                  Kỳ thi / Niên khóa: <strong>{stat.timeframeVi}</strong>
                </div>
              </div>

              {/* School Year Selector / Comparison Tabs */}
              <div className="flex items-center gap-2 p-2 rounded-2xl bg-black/40 border border-cyan-400/30">
                <Calendar className="w-4 h-4 text-cyan-400 ml-1" />
                <span className="text-xs font-mono text-zinc-300 font-bold">Xem theo niên khóa:</span>
                <div className="flex flex-wrap gap-1">
                  {['2025–2026', '2024–2025', '2023–2024', 'Lộ trình 2015–2026'].map((yr) => (
                    <button
                      key={yr}
                      onClick={() => {
                        achievementsAudio.playClick();
                        setSelectedStatYear(yr);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        selectedStatYear === yr
                          ? 'bg-cyan-500 text-black shadow-md'
                          : 'bg-zinc-800 text-zinc-300 hover:text-white'
                      }`}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Large Metric Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {stat.metrics.map((m, mIdx) => (
                  <div
                    key={mIdx}
                    className={`p-4 rounded-2xl border text-center space-y-1.5 ${
                      m.highlight
                        ? 'bg-[#d4af37]/20 border-[#ffd988] text-[#ffd988]'
                        : 'bg-black/50 border-cyan-500/40 text-cyan-200'
                    }`}
                  >
                    <div className="text-2xl sm:text-3xl font-bold font-serif">{m.value}</div>
                    <div className="text-xs font-bold text-white">{m.labelVi}</div>
                    {m.subtextVi && <div className="text-[10px] text-zinc-300 italic">{m.subtextVi}</div>}
                  </div>
                ))}
              </div>

              {/* Narrative and Highlights */}
              <div className="p-5 rounded-2xl bg-black/40 border border-zinc-800 text-sm leading-relaxed text-zinc-200 space-y-4 font-serif">
                <div className="space-y-1.5">
                  <h3 className="font-bold text-sm text-[#ffd988] font-sans flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#ffd988]" />
                    Đánh Giá & Phân Tích Thành Tích
                  </h3>
                  <p>{stat.leadNarrativeVi}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <h4 className="font-bold text-xs text-cyan-300 font-sans uppercase tracking-wider">
                    Các Chỉ Số & Điểm Nhấn Xác Thực ({selectedStatYear}):
                  </h4>
                  <ul className="space-y-1 text-xs text-zinc-300">
                    {stat.rankingHighlightsVi.map((hl, hlIdx) => (
                      <li key={hlIdx} className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold">✦</span>
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 text-[11px] font-mono text-zinc-400">
                  Căn cứ tư liệu: {stat.sourceNoteVi}
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Dữ liệu số liệu chuẩn hóa 60 năm</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={selectedStatIndex === 0}
                    onClick={() => {
                      achievementsAudio.playClick();
                      setSelectedStatIndex((prev) => Math.max(0, (prev || 0) - 1));
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-serif font-bold flex items-center gap-1 transition-all ${
                      selectedStatIndex === 0
                        ? 'opacity-30 border-zinc-700 text-zinc-500 cursor-not-allowed'
                        : 'border-cyan-400 text-cyan-300 hover:bg-white/10 cursor-pointer'
                    }`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Trước</span>
                  </button>
                  <button
                    disabled={selectedStatIndex === allStatsList.length - 1}
                    onClick={() => {
                      achievementsAudio.playClick();
                      setSelectedStatIndex((prev) => Math.min(allStatsList.length - 1, (prev || 0) + 1));
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-serif font-bold flex items-center gap-1 transition-all ${
                      selectedStatIndex === allStatsList.length - 1
                        ? 'opacity-30 border-zinc-700 text-zinc-500 cursor-not-allowed'
                        : 'border-cyan-400 text-cyan-300 hover:bg-white/10 cursor-pointer'
                    }`}
                  >
                    <span>Kế tiếp</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* MODAL 5: ORIENTATION & CENTRAL MEDALLION MODAL                            */}
      {/* ========================================================================= */}
      {orientationModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl bg-[#0e1626] border-2 border-[#d4af37] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 text-left text-[#f3ebdd] relative">
            <button
              onClick={() => setOrientationModalData(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#ffd988]">
              <Compass className="w-6 h-6 text-[#ffd988]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
              {orientationModalData.titleVi}
            </h2>
            <p className="text-sm font-serif leading-relaxed text-zinc-200">
              {orientationModalData.descVi}
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setOrientationModalData(null)}
                className="px-4 py-2 rounded-xl bg-[#d4af37] text-black font-bold text-xs cursor-pointer hover:bg-[#ffe399] transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: CULTURAL & ARTISTIC HERITAGE (EMPTY WALL SECTION A)              */}
      {/* ========================================================================= */}
      {isCulturalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#140e16] border-2 border-rose-500/80 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-left text-[#f3ebdd] relative">
            <button
              onClick={() => setIsCulturalModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/50 text-rose-300 text-xs font-mono font-bold tracking-wider">
                ✦ VÁCH B • PHÂN KHU VĂN NGHỆ & PHONG TRÀO ✦
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                {content.wallB.culturalArtistic.titleVi}
              </h2>
              <div className="text-xs text-rose-200/90 font-mono">
                {content.wallB.culturalArtistic.timeframeVi}
              </div>
            </div>

            {/* Documented 1974-1975 Highlight Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/70 to-zinc-900 border-2 border-rose-500/60 space-y-2">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-rose-400" />
                <span>MỐC SON XÁC THỰC LỊCH SỬ</span>
              </div>
              <p className="text-sm font-serif text-white leading-relaxed font-bold">
                {content.wallB.culturalArtistic.featuredRecordVi}
              </p>
            </div>

            {/* Photo / CMD Upload Placeholder Slot */}
            <div className="p-4 rounded-2xl bg-black/50 border border-zinc-800 space-y-3">
              <div className="text-xs font-mono font-bold text-zinc-300">TƯ LIỆU HÌNH ẢNH HOẠT ĐỘNG:</div>
              {content.wallB.culturalArtistic.customUrl ? (
                <div className="rounded-xl overflow-hidden border border-rose-400/40 max-h-56">
                  <img
                    src={content.wallB.culturalArtistic.customUrl}
                    alt="Hình ảnh phong trào văn hóa văn nghệ"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="p-6 rounded-xl border-2 border-dashed border-rose-500/40 bg-rose-950/20 flex flex-col items-center justify-center text-center space-y-2">
                  <UploadCloud className="w-8 h-8 text-rose-400/80 animate-pulse" />
                  <div className="text-xs font-serif text-zinc-300 font-bold">
                    Khung Trưng Bày Tư Liệu Ảnh (Chờ cập nhật tư liệu gốc)
                  </div>
                  <p className="text-[11px] text-zinc-400 max-w-md">
                    Không sử dụng ảnh mô phỏng. Quản trị viên có thể tải lên tư liệu ảnh lịch sử qua giao diện CMD Admin bất kỳ lúc nào.
                  </p>
                  {onOpenCmd && (
                    <button
                      onClick={() => {
                        setIsCulturalModalOpen(false);
                        onOpenCmd();
                      }}
                      className="mt-2 px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400 text-xs font-mono font-bold text-rose-200 transition-colors cursor-pointer"
                    >
                      Mở CMD Admin để tải ảnh →
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Narrative & Key Points */}
            <div className="p-4 rounded-2xl bg-black/40 border border-zinc-800 text-xs font-serif text-zinc-300 space-y-2.5 leading-relaxed">
              <p>{content.wallB.culturalArtistic.leadNarrativeVi}</p>
              <div className="pt-2 border-t border-zinc-800/80 space-y-1.5">
                <div className="font-bold text-rose-300 font-sans uppercase tracking-wider text-[11px]">
                  Các hoạt động văn hóa tiêu biểu:
                </div>
                {content.wallB.culturalArtistic.keyPointsVi.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✦</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 text-[10px] font-mono text-zinc-500">
                Nguồn: {content.wallB.culturalArtistic.sourceNoteVi}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
              <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Mã CMD: achievements.cultural_artistic_heritage</span>
              </div>
              <button
                onClick={() => setIsCulturalModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 7: EXTERNAL & SECTOR COMPETITIONS (EMPTY WALL SECTION B)             */}
      {/* ========================================================================= */}
      {isExternalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0a1120] border-2 border-indigo-400/80 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-left text-[#f3ebdd] relative">
            <button
              onClick={() => setIsExternalModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/50 text-indigo-300 text-xs font-mono font-bold tracking-wider">
                ✦ VÁCH B • SÂN CHƠI LIÊN TRƯỜNG & CẤP NGÀNH ✦
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                {content.wallB.externalCompetitions.titleVi}
              </h2>
              <p className="text-xs text-indigo-200/90 font-serif leading-relaxed">
                {content.wallB.externalCompetitions.leadNarrativeVi}
              </p>
            </div>

            {/* 4 Records Clean Text-Based Layout (No Image Requirement) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {content.wallB.externalCompetitions.records.map((rec) => (
                <div
                  key={rec.id}
                  className={`p-4 rounded-2xl border space-y-2 ${
                    rec.status === 'verified'
                      ? 'bg-zinc-900/90 border-indigo-500/40 text-zinc-200'
                      : 'bg-zinc-950/70 border-dashed border-zinc-700/80 text-zinc-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {rec.yearParticipated}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        rec.status === 'verified'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {rec.status === 'verified' ? '✓ ' + rec.resultOrAwardVi : '⏳ ' + rec.resultOrAwardVi}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-sm text-white leading-snug">
                    {rec.programNameVi}
                  </h3>

                  <div className="text-[11px] font-mono text-indigo-300">
                    Đơn vị tổ chức: <strong>{rec.organizerVi}</strong>
                  </div>

                  <p className="text-xs font-serif text-zinc-300 leading-relaxed">
                    {rec.shortDescriptionVi}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-zinc-800 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
              <span>Căn cứ: {content.wallB.externalCompetitions.sourceNoteVi}</span>
              <span className="text-zinc-500">Mã CMD: achievements.external_competitions_records</span>
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-zinc-800">
              <button
                onClick={() => setIsExternalModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
