/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * COSMIC HERITAGE – DẤU ẤN 60 NĂM
 * TRƯỜNG THPT A TRẦN HƯNG ĐẠO (1966–2026)
 * Spatial Experience: 3D Entrance Gate → 3D Grand Lobby (Sảnh Chính) + Password-Only CMD + Admin CMS
 */

import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EntranceScene } from './entrance/EntranceScene';
import { MainHallScene } from './scenes/lobby/MainHallScene';
import { HistoryScene } from './scenes/history/HistoryScene';
import { CmdLoginModal } from './components/auth/CmdLoginModal';
import { AdminLogin } from './components/auth/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DevelopmentScene } from './scenes/development/DevelopmentScene';
import { AchievementsScene } from './scenes/achievements/AchievementsScene';
import { TimelineScene } from './scenes/timeline/TimelineScene';
import { MemoryScene } from './scenes/memory/MemoryScene';
import { validateFirestoreConnection } from './services/firebase';
import { ShieldAlert, LogOut, Loader2, Sparkles, ArrowLeft } from 'lucide-react';

type AppView = 'entrance' | 'lobby' | 'history' | 'development' | 'achievements' | 'timeline' | 'memory' | 'cmd' | 'admin';

function AppContent() {
  const { user, isAdmin, loading, authStatus, logout } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const path = window.location.pathname;
    if (path === '/cmd' || path === '/admin/login') return 'cmd';
    if (path.startsWith('/admin')) return 'admin';
    if (path === '/entrance' || path === '/cong-chao') return 'entrance';
    if (path === '/lobby' || path === '/sanh-chinh') return 'lobby';
    if (path === '/development' || path === '/phat-trien') return 'development';
    if (path === '/achievements' || path === '/thanh-tich') return 'achievements';
    if (path === '/timeline' || path === '/dong-thoi-gian') return 'timeline';
    if (path === '/memory' || path === '/tri-an' || path === '/ky-uc') return 'memory';
    // Default immediately to the History Room (Khu 1: 1966–1975)
    return 'history';
  });

  const [cmdModalOpen, setCmdModalOpen] = useState(false);

  useEffect(() => {
    // Validate Firestore server connection on startup
    validateFirestoreConnection();
  }, []);

  // Listen to browser navigation popstate
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/cmd' || path === '/admin/login') setCurrentView('cmd');
      else if (path.startsWith('/admin')) setCurrentView('admin');
      else if (path === '/entrance' || path === '/cong-chao') setCurrentView('entrance');
      else if (path === '/lobby' || path === '/sanh-chinh') setCurrentView('lobby');
      else if (path === '/development' || path === '/phat-trien') setCurrentView('development');
      else if (path === '/achievements' || path === '/thanh-tich') setCurrentView('achievements');
      else if (path === '/timeline' || path === '/dong-thoi-gian') setCurrentView('timeline');
      else if (path === '/memory' || path === '/tri-an' || path === '/ky-uc') setCurrentView('memory');
      else setCurrentView('history');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (view: AppView) => {
    setCurrentView(view);
    const path =
      view === 'history'
        ? '/'
        : view === 'lobby'
        ? '/lobby'
        : view === 'entrance'
        ? '/entrance'
        : view === 'development'
        ? '/development'
        : view === 'achievements'
        ? '/achievements'
        : view === 'timeline'
        ? '/timeline'
        : view === 'memory'
        ? '/memory'
        : view === 'cmd'
        ? '/cmd'
        : '/admin';
    window.history.pushState(null, '', path);
  };

  // Automatically transition /cmd to /admin for authorized administrators
  useEffect(() => {
    if (currentView === 'cmd' && user && isAdmin) {
      setCurrentView('admin');
      window.history.replaceState(null, '', '/admin');
    }
  }, [currentView, user, isAdmin]);

  // 1. Initial Application Bootstrapping
  if (loading && authStatus === 'INITIALIZING') {
    return (
      <div className="min-h-screen bg-[#0B1020] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#C7A15A] to-[#ffd988] flex items-center justify-center shadow-xl shadow-[#C7A15A]/30 mb-4 animate-pulse">
          <Sparkles className="w-6 h-6 text-[#0B1020]" />
        </div>
        <div className="flex items-center gap-2 text-[#C7A15A] text-xs font-mono">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Đang kết nối không gian di sản 3D...</span>
        </div>
        <span className="text-[11px] text-zinc-500 font-mono mt-2">
          THPT A Trần Hưng Đạo (1966 – 2026)
        </span>
      </div>
    );
  }

  // 2. Standalone /cmd Route
  if (currentView === 'cmd') {
    if (user && isAdmin) {
      return <AdminDashboard onBackToPublic={() => navigateTo('lobby')} />;
    }
    return (
      <AdminLogin
        onBackToPublic={() => navigateTo('lobby')}
        onSuccess={() => navigateTo('admin')}
      />
    );
  }

  // 3. Protected /admin Route
  if (currentView === 'admin') {
    // If still resolving initial bootstrapping, show spinner
    if (loading && authStatus === 'INITIALIZING') {
      return (
        <div className="min-h-screen bg-[#0B1020] flex flex-col items-center justify-center p-4">
          <Loader2 className="w-6 h-6 animate-spin text-[#C7A15A] mb-2" />
          <span className="text-xs font-mono text-zinc-300">Đang xác thực quyền Quản trị viên...</span>
        </div>
      );
    }

    // Not authenticated -> show password-only CMD login
    if (!user) {
      return (
        <AdminLogin
          onBackToPublic={() => navigateTo('lobby')}
          onSuccess={() => navigateTo('admin')}
        />
      );
    }

    // Signed in, but NOT authorized as ADMIN in Firestore
    if (!isAdmin) {
      return (
        <div className="min-h-screen bg-[#0B1020] flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-2xl bg-zinc-900 border border-red-500/30 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-800 flex items-center justify-center mx-auto text-red-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-zinc-100">Truy cập bị từ chối (403 Forbidden)</h2>
            <p className="text-xs text-zinc-300">
              Tài khoản <strong className="text-zinc-100">{user.email}</strong> chưa được cấp quyền
              Quản trị viên (ADMIN) trên Cloud Firestore.
            </p>
            <div className="p-3 rounded-lg bg-zinc-950 text-left text-[11px] text-zinc-400 space-y-1 font-mono border border-zinc-800">
              <div>UID: {user.uid}</div>
              <div>STATUS: UNAUTHORIZED_VISITOR</div>
              <div>SECURITY: ZERO_TRUST_ENFORCED</div>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => navigateTo('lobby')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Về Sảnh chính 3D</span>
              </button>
              <button
                onClick={async () => {
                  await logout();
                  navigateTo('entrance');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/50 border border-red-800 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Fully Authorized Administrator -> Render Full CMS Dashboard
    return <AdminDashboard onBackToPublic={() => navigateTo('lobby')} />;
  }

  // 4. Main Hall (Sảnh Chính) Experience
  if (currentView === 'lobby') {
    return (
      <>
        <MainHallScene
          onReturnToEntrance={() => navigateTo('entrance')}
          onOpenCmd={() => setCmdModalOpen(true)}
          onNavigateDestination={(roomId) => {
            if (roomId === 'history') {
              navigateTo('history');
            } else if (roomId === 'development') {
              navigateTo('development');
            } else if (roomId === 'achievements') {
              navigateTo('achievements');
            } else if (roomId === 'timeline') {
              navigateTo('timeline');
            } else if (roomId === 'memory') {
              navigateTo('memory');
            } else {
              console.log('User navigated towards room:', roomId);
            }
          }}
        />

        {/* Password-Only CMD Login Modal */}
        <CmdLoginModal
          isOpen={cmdModalOpen}
          onClose={() => setCmdModalOpen(false)}
          onSuccess={() => {
            setCmdModalOpen(false);
            navigateTo('admin');
          }}
        />
      </>
    );
  }

  // 5. 3D History Room (Phòng Lịch Sử Hình Thành 1966–1975)
  if (currentView === 'history') {
    return (
      <>
        <HistoryScene
          onReturnToLobby={() => navigateTo('lobby')}
          onOpenCmd={() => setCmdModalOpen(true)}
          onNavigateDestination={(roomId) => {
            if (roomId === 'development') {
              navigateTo('development');
            } else if (roomId === 'achievements') {
              navigateTo('achievements');
            } else if (roomId === 'timeline') {
              navigateTo('timeline');
            } else if (roomId === 'memory') {
              navigateTo('memory');
            }
          }}
        />

        {/* Password-Only CMD Login Modal */}
        <CmdLoginModal
          isOpen={cmdModalOpen}
          onClose={() => setCmdModalOpen(false)}
          onSuccess={() => {
            setCmdModalOpen(false);
            navigateTo('admin');
          }}
        />
      </>
    );
  }

  // 6. 3D Development Room (Khu 2: Quá Trình Phát Triển 1974–2026)
  if (currentView === 'development') {
    return (
      <>
        <DevelopmentScene
          onReturnToLobby={() => navigateTo('lobby')}
          onOpenCmd={() => setCmdModalOpen(true)}
          onNavigateDestination={(roomId) => {
            if (roomId === 'history') navigateTo('history');
            else if (roomId === 'achievements') navigateTo('achievements');
            else if (roomId === 'timeline') navigateTo('timeline');
            else if (roomId === 'memory') navigateTo('memory');
            else if (roomId === 'lobby') navigateTo('lobby');
          }}
        />

        {/* Password-Only CMD Login Modal */}
        <CmdLoginModal
          isOpen={cmdModalOpen}
          onClose={() => setCmdModalOpen(false)}
          onSuccess={() => {
            setCmdModalOpen(false);
            navigateTo('admin');
          }}
        />
      </>
    );
  }

  // 7. 3D Achievements Room (Khu 3: Bảng Vàng Thành Tích 1966–2026)
  if (currentView === 'achievements') {
    return (
      <>
        <AchievementsScene
          onReturnToLobby={() => navigateTo('lobby')}
          onOpenCmd={() => setCmdModalOpen(true)}
          onNavigateDestination={(roomId) => {
            if (roomId === 'history') navigateTo('history');
            else if (roomId === 'development') navigateTo('development');
            else if (roomId === 'timeline') navigateTo('timeline');
            else if (roomId === 'memory') navigateTo('memory');
            else if (roomId === 'lobby') navigateTo('lobby');
          }}
        />

        {/* Password-Only CMD Login Modal */}
        <CmdLoginModal
          isOpen={cmdModalOpen}
          onClose={() => setCmdModalOpen(false)}
          onSuccess={() => {
            setCmdModalOpen(false);
            navigateTo('admin');
          }}
        />
      </>
    );
  }

  // 8. 3D Chronological Timeline Room (Dòng Chảy 60 Năm 1966–2026)
  if (currentView === 'timeline') {
    return (
      <>
        <TimelineScene
          onReturnToLobby={() => navigateTo('lobby')}
          onOpenCmd={() => setCmdModalOpen(true)}
          onNavigateDestination={(roomId) => {
            if (roomId === 'history') navigateTo('history');
            else if (roomId === 'development') navigateTo('development');
            else if (roomId === 'achievements') navigateTo('achievements');
            else if (roomId === 'memory') navigateTo('memory');
            else if (roomId === 'lobby') navigateTo('lobby');
          }}
        />

        {/* Password-Only CMD Login Modal */}
        <CmdLoginModal
          isOpen={cmdModalOpen}
          onClose={() => setCmdModalOpen(false)}
          onSuccess={() => {
            setCmdModalOpen(false);
            navigateTo('admin');
          }}
        />
      </>
    );
  }

  // 9. 3D Gratitude & Memories Room (Phòng Tri Ân & Ký Ức)
  if (currentView === 'memory') {
    return (
      <>
        <MemoryScene
          onReturnToLobby={() => navigateTo('lobby')}
          onOpenCmd={() => setCmdModalOpen(true)}
          onNavigateDestination={(roomId) => {
            if (roomId === 'history') navigateTo('history');
            else if (roomId === 'development') navigateTo('development');
            else if (roomId === 'achievements') navigateTo('achievements');
            else if (roomId === 'timeline') navigateTo('timeline');
            else if (roomId === 'lobby') navigateTo('lobby');
          }}
        />

        {/* Password-Only CMD Login Modal */}
        <CmdLoginModal
          isOpen={cmdModalOpen}
          onClose={() => setCmdModalOpen(false)}
          onSuccess={() => {
            setCmdModalOpen(false);
            navigateTo('admin');
          }}
        />
      </>
    );
  }

  // 10. Default Entry: 3D Entrance Gate (Cổng Chào)
  return (
    <>
      <EntranceScene
        onOpenCmd={() => setCmdModalOpen(true)}
        onEnterMuseum={() => {
          navigateTo('lobby');
        }}
      />

      {/* Password-Only CMD Login Modal */}
      <CmdLoginModal
        isOpen={cmdModalOpen}
        onClose={() => setCmdModalOpen(false)}
        onSuccess={() => {
          setCmdModalOpen(false);
          navigateTo('admin');
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
