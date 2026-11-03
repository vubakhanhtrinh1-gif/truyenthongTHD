import React, { useState } from 'react';
import { AdminSidebar, AdminSection } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { OverviewView } from './OverviewView';
import { SiteSettingsView } from './SiteSettingsView';
import { SchoolBrandingView } from './SchoolBrandingView';
import { AdminManagementView } from './AdminManagementView';
import { ContentManagerView } from './content-manager/ContentManagerView';
import { GenericCrudSection } from './GenericCrudSection';
import {
  artifactRepository,
  timelineRepository,
  historyRepository,
  developmentRepository,
  achievementRepository,
  peopleRepository,
  memoryRepository,
  newsRepository,
  hotspotRepository,
  resourceRepository,
  sourceRepository,
  licenseRepository,
  creditRepository,
  roomRepository,
} from '../../repositories';
import {
  artifactColumns,
  artifactFields,
  timelineColumns,
  timelineFields,
  historyColumns,
  historyFields,
  developmentColumns,
  developmentFields,
  achievementColumns,
  achievementFields,
  peopleColumns,
  peopleFields,
  memoryColumns,
  memoryFields,
  newsColumns,
  newsFields,
  hotspotColumns,
  hotspotFields,
  resourceColumns,
  resourceFields,
  sourceColumns,
  sourceFields,
  licenseColumns,
  licenseFields,
  creditColumns,
  creditFields,
  roomColumns,
  roomFields,
} from './sectionsConfig';
import {
  Artifact,
  TimelineEvent,
  HistoryPeriod,
  DevelopmentMilestone,
  Achievement,
  Person,
  Memory,
  NewsEvent,
  Hotspot,
  DigitalResource,
  Source,
  License,
  Credit,
  Room,
} from '../../types';

interface Props {
  onBackToPublic?: () => void;
}

export const AdminDashboard: React.FC<Props> = ({ onBackToPublic }) => {
  const [currentSection, setCurrentSection] = useState<AdminSection>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActiveSection = () => {
    switch (currentSection) {
      case 'overview':
        return <OverviewView onNavigate={(sec) => setCurrentSection(sec)} />;

      case 'content_manager':
        return <ContentManagerView />;

      case 'branding':
        return <SchoolBrandingView onNavigateToPublicLobby={onBackToPublic} />;

      case 'settings':
        return <SiteSettingsView />;

      case 'admins':
        return <AdminManagementView />;

      case 'rooms':
        return (
          <GenericCrudSection<Room>
            repository={roomRepository}
            title="Sảnh chào & 9 Khu vực Triển lãm (Canonical Rooms)"
            description="Các phân khu triển lãm cố định của Cosmic Heritage. Lưu ý: Không đổi ID để đảm bảo tương thích 3D tương lai."
            createButtonLabel="Thêm phân khu mới"
            columns={roomColumns}
            fields={roomFields}
            searchFilter={(item, term) =>
              item.nameVi.toLowerCase().includes(term) || item.id.toLowerCase().includes(term)
            }
          />
        );

      case 'artifacts':
        return (
          <GenericCrudSection<Artifact>
            repository={artifactRepository}
            title="Kho Hiện vật & Kỷ vật Lịch sử (Reference CRUD Module)"
            description="Quản lý huân huy chương, bằng khen, ảnh tư liệu quý và hiện vật trưng bày. Yêu cầu thẩm định nguồn gốc trước khi công khai."
            createButtonLabel="Thêm Hiện vật mới"
            columns={artifactColumns}
            fields={artifactFields}
            searchFilter={(item, term) =>
              item.titleVi.toLowerCase().includes(term) ||
              Boolean(item.descriptionVi && item.descriptionVi.toLowerCase().includes(term))
            }
          />
        );

      case 'timeline':
        return (
          <GenericCrudSection<TimelineEvent>
            repository={timelineRepository}
            title="Dòng Thời Gian 1966 – 2026 (Orbital Timeline)"
            description="Biên niên sử số hóa 60 năm thành lập trường với các mốc son lịch sử chuẩn xác."
            createButtonLabel="Thêm Mốc sự kiện"
            columns={timelineColumns}
            fields={timelineFields}
            searchFilter={(item, term) =>
              item.titleVi.toLowerCase().includes(term) || String(item.year).includes(term)
            }
          />
        );

      case 'history':
        return (
          <GenericCrudSection<HistoryPeriod>
            repository={historyRepository}
            title="Lịch Sử Hình Thành & Cội Nguồn"
            description="Các giai đoạn lịch sử lớn từ thời kỳ kháng chiến sơ tán đến hiện đại."
            createButtonLabel="Thêm Giai đoạn mới"
            columns={historyColumns}
            fields={historyFields}
            searchFilter={(item, term) =>
              item.titleVi.toLowerCase().includes(term) ||
              String(item.yearStart).includes(term) ||
              String(item.yearEnd).includes(term)
            }
          />
        );

      case 'development':
        return (
          <GenericCrudSection<DevelopmentMilestone>
            repository={developmentRepository}
            title="Quá Trình Phát Triển & Cơ Sở Vật Chất"
            description="Hành trình chuyển mình của trường qua các thời kỳ, mở rộng quy mô và trường lớp."
            createButtonLabel="Thêm Dấu mốc phát triển"
            columns={developmentColumns}
            fields={developmentFields}
            searchFilter={(item, term) =>
              item.titleVi.toLowerCase().includes(term) ||
              Boolean(item.period && item.period.toLowerCase().includes(term))
            }
          />
        );

      case 'achievements':
        return (
          <GenericCrudSection<Achievement>
            repository={achievementRepository}
            title="Bảng Vàng Thành Tích & Tự Hào"
            description="Huân chương cao quý, thành tích thi đua, cờ thi đua và các giải thưởng học sinh giỏi."
            createButtonLabel="Thêm Thành tích mới"
            columns={achievementColumns}
            fields={achievementFields}
            searchFilter={(item, term) =>
              item.titleVi.toLowerCase().includes(term) || String(item.year).includes(term)
            }
          />
        );

      case 'people':
        return (
          <GenericCrudSection<Person>
            repository={peopleRepository}
            title="Con Người & Các Thế Hệ Nhà Trường"
            description="Các thế hệ lãnh đạo, nhà giáo ưu tú, cán bộ công nhân viên và cựu học sinh tiêu biểu."
            createButtonLabel="Thêm Nhân vật / Thầy cô"
            columns={peopleColumns}
            fields={peopleFields}
            searchFilter={(item, term) =>
              item.name.toLowerCase().includes(term) || item.roleVi.toLowerCase().includes(term)
            }
          />
        );

      case 'memories':
        return (
          <GenericCrudSection<Memory>
            repository={memoryRepository}
            title="Ký Ức & Tri Ân (Memories)"
            description="Những bài viết, hồi ức xúc động và podcast tri ân được tuyển chọn bởi ban biên tập."
            createButtonLabel="Thêm Ký ức / Hồi ức"
            columns={memoryColumns}
            fields={memoryFields}
            searchFilter={(item, term) =>
              item.titleVi.toLowerCase().includes(term) || item.author.toLowerCase().includes(term)
            }
          />
        );

      case 'news':
        return (
          <GenericCrudSection<NewsEvent>
            repository={newsRepository}
            title="Tin Tức & Hoạt Động Kỷ Niệm 60 Năm"
            description="Tin bài, hoạt động hướng tới đại lễ kỷ niệm 60 năm ngày thành lập trường."
            createButtonLabel="Thêm Tin tức / Sự kiện"
            columns={newsColumns}
            fields={newsFields}
            searchFilter={(item, term) => item.titleVi.toLowerCase().includes(term)}
          />
        );

      case 'hotspots':
        return (
          <GenericCrudSection<Hotspot>
            repository={hotspotRepository}
            title="Điểm Tương Tác Nội Dung (Hotspot Content)"
            description="Định nghĩa nội dung thông tin gắn với các điểm khám phá trong không gian trưng bày."
            createButtonLabel="Thêm Hotspot mới"
            columns={hotspotColumns}
            fields={hotspotFields}
            searchFilter={(item, term) =>
              item.titleVi.toLowerCase().includes(term) || item.roomId.toLowerCase().includes(term)
            }
          />
        );

      case 'resources':
        return (
          <GenericCrudSection<DigitalResource>
            repository={resourceRepository}
            title="Kho Tài Nguyên Số & Tư Liệu Lưu Trữ"
            description="Video, podcast, sách số hóa, tài liệu lưu trữ phục vụ nghiên cứu và trải nghiệm."
            createButtonLabel="Thêm Tài nguyên số"
            columns={resourceColumns}
            fields={resourceFields}
            searchFilter={(item, term) => item.titleVi.toLowerCase().includes(term)}
          />
        );

      case 'sources':
        return (
          <GenericCrudSection<Source>
            repository={sourceRepository}
            title="Nguồn Tư Liệu Đối Chiếu & Thẩm Định (Authoritative Sources)"
            description="Cơ sở dữ liệu các tài liệu gốc, văn bản lưu trữ, kỷ yếu dùng để đối chiếu xác thực di sản."
            createButtonLabel="Thêm Nguồn tư liệu"
            columns={sourceColumns}
            fields={sourceFields}
            searchFilter={(item, term) =>
              item.title.toLowerCase().includes(term) ||
              Boolean(item.referenceCode && item.referenceCode.toLowerCase().includes(term))
            }
          />
        );

      case 'licenses':
        return (
          <GenericCrudSection<License>
            repository={licenseRepository}
            title="Bản Quyền & Công Bố Minh Bạch AI (License & AI Disclosure)"
            description="Theo dõi tình trạng bản quyền tài sản và công bố minh bạch các tư liệu có sự hỗ trợ của công nghệ AI."
            createButtonLabel="Thêm Hồ sơ Bản quyền / AI"
            columns={licenseColumns}
            fields={licenseFields}
            searchFilter={(item, term) =>
              item.assetName.toLowerCase().includes(term) || item.licenseType.toLowerCase().includes(term)
            }
          />
        );

      case 'credits':
        return (
          <GenericCrudSection<Credit>
            repository={creditRepository}
            title="Credits & Tri Ân Đóng Góp"
            description="Danh sách ban chỉ đạo, tổ thẩm định lịch sử, kỹ thuật số hóa và các cá nhân hỗ trợ dự án."
            createButtonLabel="Thêm Đóng góp / Credit"
            columns={creditColumns}
            fields={creditFields}
            searchFilter={(item, term) =>
              item.name.toLowerCase().includes(term) || item.role.toLowerCase().includes(term)
            }
          />
        );

      default:
        return <OverviewView onNavigate={(sec) => setCurrentSection(sec)} />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <AdminSidebar
        currentSection={currentSection}
        onSelectSection={(sec) => setCurrentSection(sec)}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="lg:pl-64 flex flex-col flex-1">
        <AdminHeader
          currentSection={currentSection}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onSelectSection={(sec) => setCurrentSection(sec)}
          onBackToPublic={onBackToPublic}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{renderActiveSection()}</main>
      </div>
    </div>
  );
};
