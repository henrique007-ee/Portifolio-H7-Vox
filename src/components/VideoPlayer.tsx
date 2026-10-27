import React, { useState } from 'react';
import { Play, Volume2, VolumeX, ExternalLink, Instagram } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl?: string;
  thumbnail: string;
  title: string;
  aspectRatio?: '16:9' | '9:16';
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  videoType?: 'youtube' | 'vimeo' | 'direct' | 'instagram' | 'embed' | 'placeholder';
  instagramUrl?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  thumbnail,
  title,
  aspectRatio = '16:9',
  autoPlay = false,
  loop = true,
  muted: initialMuted = true,
  className = '',
  videoType,
  instagramUrl,
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [hasError, setHasError] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  // Helper to detect video source
  const getEmbedInfo = (url?: string): { 
    type: 'instagram' | 'youtube' | 'vimeo' | 'direct'; 
    src: string; 
    externalUrl?: string;
    code?: string;
  } | null => {
    if (!url && !instagramUrl) return null;
    const targetUrl = (url || instagramUrl || '').trim();

    // Instagram Reel / Post
    const igMatch = targetUrl.match(/instagram\.com\/(?:reel|p|tv)\/([A-Za-z0-9_-]+)/i);
    if (videoType === 'instagram' || igMatch) {
      const code = igMatch ? igMatch[1] : '';
      return {
        type: 'instagram',
        src: code ? `https://www.instagram.com/p/${code}/embed/` : targetUrl,
        externalUrl: code ? `https://www.instagram.com/reel/${code}/` : targetUrl,
        code,
      };
    }

    // YouTube (watch, shorts, youtu.be, embed)
    const ytMatch = targetUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch) {
      return {
        type: 'youtube',
        src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=1&rel=0&modestbranding=1`,
        externalUrl: `https://www.youtube.com/watch?v=${ytMatch[1]}`,
        code: ytMatch[1],
      };
    }

    // Vimeo
    const vimeoMatch = targetUrl.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/);
    if (vimeoMatch) {
      return {
        type: 'vimeo',
        src: `https://player.vimeo.com/video/${vimeoMatch[3]}?autoplay=${isPlaying ? 1 : 0}&muted=${isMuted ? 1 : 0}`,
        externalUrl: `https://vimeo.com/${vimeoMatch[3]}`,
        code: vimeoMatch[3],
      };
    }

    // Direct MP4 / WebM video file
    return {
      type: 'direct',
      src: targetUrl,
      externalUrl: targetUrl,
    };
  };

  const embedInfo = getEmbedInfo(videoUrl);
  const aspectClass = aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-video';

  // Instagram Embed Handling
  if (embedInfo?.type === 'instagram') {
    return (
      <div className={`relative ${aspectClass} w-full overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/10 flex flex-col justify-between ${className}`}>
        {!iframeError && embedInfo.src ? (
          <iframe
            src={embedInfo.src}
            title={title}
            allowTransparency
            allow="encrypted-media"
            className="w-full h-full border-0 rounded-2xl"
            onError={() => setIframeError(true)}
          />
        ) : (
          /* Fallback Poster with Instagram Action */
          <div className="relative w-full h-full overflow-hidden flex flex-col justify-between p-6">
            <img
              src={thumbnail || '/assets/logo_web.png'}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover filter brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#08CC07] bg-black/70 px-2.5 py-1 rounded border border-[#08CC07]/30 flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5" />
                <span>INSTAGRAM REEL</span>
              </span>
              <span className="text-[11px] font-mono text-white/50">{aspectRatio}</span>
            </div>

            <div className="relative z-10 text-center space-y-3">
              <h4 className="text-base font-bold text-white max-w-xs mx-auto drop-shadow-md">
                {title}
              </h4>
              <a
                href={embedInfo.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white font-bold text-xs shadow-lg hover:opacity-90 transition-opacity"
              >
                <Instagram className="w-4 h-4" />
                <span>Assistir no Instagram</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="relative z-10 text-center">
              <span className="text-[10px] font-mono text-white/40">H7.VOX • PRODUÇÃO AUDIOVISUAL</span>
            </div>
          </div>
        )}

        {/* Small floating Instagram badge */}
        <div className="absolute bottom-2 right-2 z-20">
          <a
            href={embedInfo.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Abrir no Instagram"
            className="p-2 rounded-lg bg-black/80 hover:bg-[#08CC07] text-white hover:text-[#080808] border border-white/20 transition-colors flex items-center gap-1 text-[11px] font-mono"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ver no Instagram</span>
          </a>
        </div>
      </div>
    );
  }

  if (!embedInfo || hasError) {
    return (
      <div className={`relative ${aspectClass} w-full overflow-hidden rounded-xl bg-[#121212] border border-white/10 group ${className}`}>
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#121212] to-[#1c1c1c]">
            <img src="/assets/logo_web.png" alt="H7.VOX" className="w-24 h-auto mb-3 opacity-80" />
            <span className="text-xs uppercase tracking-widest text-[#08CC07] font-mono mb-1">H7.VOX • AUDIOVISUAL</span>
            <p className="text-sm font-medium text-white/80 max-w-xs">{title}</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
          <span className="text-xs text-white/60 font-mono tracking-wider">PREVIEW VISUAL</span>
        </div>
      </div>
    );
  }

  if (embedInfo.type === 'youtube' || embedInfo.type === 'vimeo') {
    return (
      <div className={`relative ${aspectClass} w-full overflow-hidden rounded-xl bg-black border border-white/10 ${className}`}>
        <iframe
          src={embedInfo.src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    );
  }

  return (
    <div className={`relative ${aspectClass} w-full overflow-hidden rounded-xl bg-black border border-white/10 group ${className}`}>
      <video
        src={embedInfo.src}
        poster={thumbnail}
        autoPlay={isPlaying}
        loop={loop}
        muted={isMuted}
        playsInline
        className="w-full h-full object-cover"
        onError={() => setHasError(true)}
      />

      {/* Video controls overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 pointer-events-none">
        <div className="flex items-center justify-between text-xs font-mono text-white/80">
          <span className="bg-black/60 backdrop-blur-xs px-2 py-1 rounded text-[#08CC07] border border-[#08CC07]/30">
            {aspectRatio}
          </span>
          <span className="bg-black/60 backdrop-blur-xs px-2 py-1 rounded">
            H7.VOX REEL
          </span>
        </div>

        <div className="flex items-center justify-between pointer-events-auto">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#08CC07] text-[#080808] hover:scale-105 active:scale-95 transition-transform font-medium shadow-lg shadow-[#08CC07]/20"
          >
            <Play className={`w-4 h-4 ${isPlaying ? 'fill-current' : 'ml-0.5'}`} />
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#08CC07]" />}
          </button>
        </div>
      </div>
    </div>
  );
};
