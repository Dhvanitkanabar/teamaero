import React, { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, X, FileText, Image as ImageIcon, Film,
  Music, Archive, File, CheckCircle, AlertCircle
} from 'lucide-react';

// ── Validation config ──────────────────────────────────────────────────────
const DEFAULT_MAX_SIZE_MB = 10;
const DEFAULT_ACCEPT = {
  'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
  'application/pdf': ['.pdf'],
  'video/*': ['.mp4', '.webm', '.mov'],
  'audio/*': ['.mp3', '.wav', '.ogg'],
  'application/zip': ['.zip'],
  'text/plain': ['.txt'],
};

const getFileIcon = (type) => {
  if (type.startsWith('image/')) return { Icon: ImageIcon, color: 'text-sky-500 bg-sky-50 border-sky-200' };
  if (type.startsWith('video/')) return { Icon: Film, color: 'text-violet-500 bg-violet-50 border-violet-200' };
  if (type.startsWith('audio/')) return { Icon: Music, color: 'text-emerald-500 bg-emerald-50 border-emerald-200' };
  if (type === 'application/pdf') return { Icon: FileText, color: 'text-rose-500 bg-rose-50 border-rose-200' };
  if (type.includes('zip')) return { Icon: Archive, color: 'text-amber-500 bg-amber-50 border-amber-200' };
  return { Icon: File, color: 'text-slate-500 bg-slate-50 border-slate-200' };
};

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * FileUploadZone — drag-and-drop file uploader with preview and validation.
 *
 * Props:
 *   onFilesSelected(files)  — called when valid files are picked
 *   maxSizeMB               — max file size in MB (default: 10)
 *   multiple                — allow multiple files (default: false)
 *   accept                  — MIME types object (default: images + pdf + video)
 *   label                   — zone label text
 *   className               — extra wrapper classes
 */
const FileUploadZone = ({
  onFilesSelected,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  multiple = false,
  accept = DEFAULT_ACCEPT,
  label = 'Drop files here or click to browse',
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState([]);   // { file, url, error }
  const [dragError, setDragError] = useState('');
  const inputRef = useRef(null);

  const acceptedMimes = Object.keys(accept);

  const validateFile = (file) => {
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      return `File too large. Max size is ${maxSizeMB} MB (got ${sizeMB.toFixed(1)} MB).`;
    }
    const isAccepted = acceptedMimes.some((mime) => {
      if (mime.endsWith('/*')) {
        return file.type.startsWith(mime.replace('/*', '/'));
      }
      return file.type === mime;
    });
    if (!isAccepted) {
      return `File type "${file.type || 'unknown'}" is not supported.`;
    }
    return null;
  };

  const processFiles = useCallback(
    (rawFiles) => {
      const list = Array.from(rawFiles);
      const toProcess = multiple ? list : [list[0]];

      const newPreviews = toProcess.map((file) => {
        const error = validateFile(file);
        const url = !error && file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
        return { file, url, error, id: `${file.name}_${Date.now()}` };
      });

      setPreviews((prev) => (multiple ? [...prev, ...newPreviews] : newPreviews));

      const validFiles = newPreviews.filter((p) => !p.error).map((p) => p.file);
      if (validFiles.length > 0 && onFilesSelected) {
        onFilesSelected(multiple ? validFiles : validFiles[0]);
      }
    },
    [multiple, maxSizeMB, onFilesSelected]
  );

  // ── Drag events ────────────────────────────────────────────────────────
  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragError('');
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const { files } = e.dataTransfer;
    if (!files || files.length === 0) return;
    if (!multiple && files.length > 1) {
      setDragError('Only one file is allowed. Drop a single file.');
      return;
    }
    processFiles(files);
  };

  const onInputChange = (e) => {
    if (e.target.files?.length) processFiles(e.target.files);
    e.target.value = '';
  };

  const removePreview = (id) => {
    setPreviews((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      // Notify parent — only valid remaining files
      const validFiles = updated.filter((p) => !p.error).map((p) => p.file);
      if (onFilesSelected) {
        onFilesSelected(multiple ? validFiles : validFiles[0] || null);
      }
      return updated;
    });
  };

  const acceptAttr = Object.entries(accept)
    .flatMap(([mime, exts]) => [mime, ...exts])
    .join(',');

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label={label}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative group flex flex-col items-center justify-center gap-4 rounded-[24px] border-2 border-dashed p-10 cursor-pointer transition-all duration-300 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2
          ${isDragging
            ? 'border-sky-400 bg-sky-50/80 scale-[1.01]'
            : dragError
            ? 'border-rose-300 bg-rose-50/50'
            : 'border-slate-200 bg-slate-50/50 hover:border-sky-300 hover:bg-sky-50/30'
          }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptAttr}
          multiple={multiple}
          onChange={onInputChange}
          className="sr-only"
          aria-hidden="true"
        />

        {/* Upload icon */}
        <motion.div
          animate={{ y: isDragging ? -6 : 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-colors duration-300 ${
            isDragging
              ? 'bg-sky-500 border-sky-400 text-white'
              : 'bg-white border-slate-200 text-slate-400 group-hover:text-sky-500 group-hover:border-sky-100 shadow-sm'
          }`}
        >
          <Upload size={28} aria-hidden="true" />
        </motion.div>

        <div className="text-center space-y-1 pointer-events-none">
          <p className="text-sm font-bold text-slate-950">
            {isDragging ? 'Drop to upload' : label}
          </p>
          <p className="text-[11px] text-slate-400 font-medium">
            Max {maxSizeMB} MB · {Object.values(accept).flat().join(', ')}
          </p>
        </div>

        {/* Drag error */}
        <AnimatePresence>
          {dragError && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[11px] font-bold text-rose-500 flex items-center gap-2"
              role="alert"
            >
              <AlertCircle size={12} aria-hidden="true" /> {dragError}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* File Previews */}
      <AnimatePresence>
        {previews.map(({ file, url, error, id }) => {
          const { Icon, color } = getFileIcon(file.type);
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 16, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className={`relative flex items-center gap-4 p-4 rounded-2xl border ${
                error
                  ? 'bg-rose-50 border-rose-200'
                  : 'bg-white border-slate-100 shadow-sm'
              }`}
              role="listitem"
              aria-label={`${file.name}${error ? ' — error: ' + error : ''}`}
            >
              {/* Thumbnail or icon */}
              {url ? (
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 shrink-0">
                  <img src={url} alt={file.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${color}`}>
                  <Icon size={22} aria-hidden="true" />
                </div>
              )}

              {/* Meta */}
              <div className="flex-grow min-w-0">
                <p className="text-sm font-bold text-slate-950 truncate">{file.name}</p>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                  {formatBytes(file.size)}
                </p>
                {error ? (
                  <p className="text-[10px] font-bold text-rose-500 flex items-center gap-1 mt-1" role="alert">
                    <AlertCircle size={10} aria-hidden="true" /> {error}
                  </p>
                ) : (
                  <p className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 mt-1">
                    <CheckCircle size={10} aria-hidden="true" /> Ready to send
                  </p>
                )}
              </div>

              {/* Remove */}
              <button
                onClick={(e) => { e.stopPropagation(); removePreview(id); }}
                aria-label={`Remove ${file.name}`}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all shrink-0"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default FileUploadZone;
