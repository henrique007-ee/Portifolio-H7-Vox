import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Check, Link2, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

interface FileUploadBoxProps {
  label: string;
  sublabel?: string;
  currentUrl?: string;
  onUrlChange: (url: string) => void;
  aspect?: 'circle' | 'square' | 'video' | 'contain';
  placeholder?: string;
  accept?: string;
}

export const FileUploadBox: React.FC<FileUploadBoxProps> = ({
  label,
  sublabel,
  currentUrl,
  onUrlChange,
  aspect = 'circle',
  placeholder = 'Clique para selecionar arquivo do seu computador',
  accept = 'image/png,image/jpeg,image/webp,image/svg+xml,image/gif',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Por favor, selecione um arquivo de imagem válido (JPG, PNG, WEBP, SVG).');
      return;
    }

    // Limit to 15MB
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('A imagem selecionada é muito pesada (máx: 15MB).');
      return;
    }

    setIsUploading(true);
    setErrorMessage('');

    try {
      const res = await api.uploadFile(file);
      if (res && res.url) {
        onUrlChange(res.url);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao carregar o arquivo do computador.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-mono uppercase tracking-wider text-white/70">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] font-mono text-white/40 hover:text-[#08CC07] transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Link2 className="w-3 h-3" />
          <span>{showUrlInput ? 'Ocultar campo de link' : 'Ou colar link direto'}</span>
        </button>
      </div>

      {sublabel && (
        <p className="text-[11px] text-white/40 leading-relaxed">
          {sublabel}
        </p>
      )}

      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Dropzone / Preview */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 transition-all duration-200 p-4 ${
          isDragging
            ? 'border-[#08CC07] bg-[#08CC07]/10'
            : currentUrl
            ? 'border-white/10 bg-[#121212]'
            : 'border-dashed border-white/15 hover:border-[#08CC07]/50 bg-[#141414] hover:bg-[#181818]'
        }`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <RefreshCw className="w-8 h-8 text-[#08CC07] animate-spin mb-3" />
            <span className="text-xs font-semibold text-white">Carregando foto do computador...</span>
            <span className="text-[11px] text-white/40 mt-1">Processando arquivo e otimizando</span>
          </div>
        ) : currentUrl ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {/* Preview Thumbnail */}
              <div
                className={`overflow-hidden bg-black border border-white/20 shrink-0 ${
                  aspect === 'circle'
                    ? 'w-14 h-14 rounded-full'
                    : aspect === 'video'
                    ? 'w-24 h-14 rounded-lg'
                    : 'w-14 h-14 rounded-xl'
                }`}
              >
                <img
                  src={currentUrl}
                  alt="Prévia do arquivo"
                  className={`w-full h-full ${aspect === 'contain' ? 'object-contain p-1' : 'object-cover'}`}
                  onError={(e) => {
                    (e.target as HTMLElement).style.opacity = '0.3';
                  }}
                />
              </div>

              {/* Status and details */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <Check className="w-3.5 h-3.5 text-[#08CC07]" />
                  <span>Foto anexada com sucesso</span>
                </div>
                <p className="text-[11px] text-white/40 truncate max-w-[200px] sm:max-w-xs font-mono mt-0.5">
                  {currentUrl.startsWith('data:') ? 'Arquivo do computador (Base64)' : currentUrl}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Trocar do PC</span>
              </button>
              <button
                type="button"
                onClick={() => onUrlChange('')}
                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                title="Remover foto"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center py-5 text-center cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 group-hover:border-[#08CC07]/40 group-hover:bg-[#08CC07]/10 flex items-center justify-center mb-3 transition-colors">
              <Upload className="w-5 h-5 text-white/60 group-hover:text-[#08CC07] transition-colors" />
            </div>
            <span className="text-xs font-bold text-white group-hover:text-[#08CC07] transition-colors">
              Adicionar foto dos arquivos do meu PC
            </span>
            <p className="text-[11px] text-white/40 mt-1 max-w-sm">
              {placeholder} ou arraste e solte o arquivo aqui (JPG, PNG, WEBP)
            </p>
          </div>
        )}
      </div>

      {/* Alternative URL Input (when opened) */}
      {showUrlInput && (
        <div className="pt-1">
          <input
            type="url"
            value={currentUrl || ''}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="https://... (ou cole o link da foto aqui se preferir)"
            className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#08CC07]"
          />
        </div>
      )}

      {/* Error alert */}
      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
