import React, { useState } from 'react';
import { Plus, Trash2, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { MediaUploader } from './MediaUploader';

interface Props {
  images: string[];
  onChange: (newImages: string[]) => void;
  label?: string;
}

export const ImageGalleryManager: React.FC<Props> = ({
  images,
  onChange,
  label = 'Thư viện ảnh tư liệu',
}) => {
  const [directUrl, setDirectUrl] = useState('');
  const [showUpload, setShowUpload] = useState(false);

  const handleAddDirect = () => {
    if (!directUrl.trim()) return;
    onChange([...images, directUrl.trim()]);
    setDirectUrl('');
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
          {label} ({images.length})
        </label>
        <button
          type="button"
          onClick={() => setShowUpload(!showUpload)}
          className="text-xs text-cyan-400 hover:text-cyan-300 underline"
        >
          {showUpload ? 'Thu gọn tải tệp' : '+ Tải ảnh lên Storage'}
        </button>
      </div>

      {showUpload && (
        <div className="p-3 bg-zinc-950/60 border border-zinc-800 rounded-lg">
          <MediaUploader
            accept="image/*"
            folder="gallery"
            label="Tải ảnh tư liệu lên Storage"
            onUploadComplete={(res) => {
              onChange([...images, res.downloadUrl]);
            }}
          />
        </div>
      )}

      {/* Manual URL input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <input
            type="url"
            value={directUrl}
            onChange={(e) => setDirectUrl(e.target.value)}
            placeholder="Hoặc dán URL ảnh trực tiếp (https://...)"
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-cyan-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddDirect();
              }
            }}
          />
        </div>
        <button
          type="button"
          onClick={handleAddDirect}
          className="px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg font-medium inline-flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm</span>
        </button>
      </div>

      {/* Gallery list */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {images.map((url, idx) => (
            <div
              key={idx}
              className="relative group rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 aspect-video flex items-center justify-center"
            >
              <img
                src={url}
                alt={`Tư liệu ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-1.5 bg-red-600 hover:bg-red-500 text-white rounded-md text-xs shadow-md transition-colors"
                  title="Xóa ảnh"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/80 rounded text-[10px] text-zinc-400 font-mono">
                #{idx + 1}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 border border-dashed border-zinc-800 rounded-lg text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
          <ImageIcon className="w-4 h-4" />
          <span>Chưa có ảnh tư liệu nào được đính kèm.</span>
        </div>
      )}
    </div>
  );
};
