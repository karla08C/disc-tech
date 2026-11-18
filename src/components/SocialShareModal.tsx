import React, { useRef, useState, useMemo } from 'react';
import html2canvas from 'html2canvas';
import {
  Share2,
  Download,
  Copy,
  Check,
  X,
  Linkedin,
  Twitter,
  ExternalLink,
  Link2,
  MessageCircle,
  Award,
  TrendingUp,
  Image as ImageIcon,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { DiscLetter, DiscPercentages } from '../types/disc';
import { PROFILES, DUAL_PROFILES, PLENO_DEV_BENCHMARK } from '../data/discData';
import { buildShareUrl, generateSocialPostText, SharedProfileData } from '../utils/shareUtils';
import { calculateCareerMatches } from '../utils/discCalculator';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  dominant: DiscLetter;
  secondary: DiscLetter;
  dualCode: string;
  pct: DiscPercentages;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  name,
  dominant,
  secondary,
  dualCode,
  pct,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloadingImg, setDownloadingImg] = useState(false);
  const [copyingImg, setCopyingImg] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedTextType, setCopiedTextType] = useState<'linkedin' | 'twitter' | null>(null);
  const [activeTab, setActiveTab] = useState<'card' | 'social'>('card');

  const profile = PROFILES[dominant];
  const dual = DUAL_PROFILES[dualCode] || DUAL_PROFILES[`${dominant}${secondary}`];
  const careerMatches = useMemo(() => calculateCareerMatches(pct), [pct]);
  const topCareer = careerMatches[0];

  const shareData: SharedProfileData = useMemo(() => ({
    name: name || 'Profissional Tech',
    dominant,
    secondary,
    dualCode,
    pct,
  }), [name, dominant, secondary, dualCode, pct]);

  const shareUrl = useMemo(() => buildShareUrl(shareData), [shareData]);

  // Adherence to Pleno Dev Benchmark
  const adherence = useMemo(() => {
    let diffSum = 0;
    (['D', 'I', 'S', 'C'] as DiscLetter[]).forEach((k) => {
      diffSum += Math.abs(pct[k] - PLENO_DEV_BENCHMARK[k]);
    });
    return Math.max(0, Math.round(100 - diffSum / 2));
  }, [pct]);

  if (!isOpen) return null;

  // Copy unique link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  // Copy social post copy
  const handleCopyPostText = async (platform: 'linkedin' | 'twitter') => {
    try {
      const text = generateSocialPostText(platform, shareData, shareUrl);
      await navigator.clipboard.writeText(text);
      setCopiedTextType(platform);
      setTimeout(() => setCopiedTextType(null), 2500);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  // Download High-Res Social Card PNG
  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    setDownloadingImg(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#07090e',
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const safeName = (name || 'dev').trim().replace(/[^a-zA-Z0-9_-]/g, '-');
      const filename = `disc-tech-card-${dominant}-${safeName}.png`;

      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to export card image:', err);
    } finally {
      setDownloadingImg(false);
    }
  };

  // Copy image directly to clipboard
  const handleCopyCardImage = async () => {
    if (!cardRef.current) return;
    setCopyingImg(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#07090e',
        scale: 2,
        useCORS: true,
        logging: false,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setCopyingImg(false);
          return;
        }
        try {
          if (navigator.clipboard && navigator.clipboard.write) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob }),
            ]);
            alert('Imagem copiada para a área de transferência! Cole direto no LinkedIn ou Twitter com Ctrl+V.');
          } else {
            handleDownloadCard();
          }
        } catch (clipErr) {
          console.warn('Clipboard write failed, downloading instead:', clipErr);
          handleDownloadCard();
        } finally {
          setCopyingImg(false);
        }
      }, 'image/png');
    } catch (err) {
      console.error('Failed to copy card image:', err);
      setCopyingImg(false);
    }
  };

  // Open LinkedIn share intent
  const handleShareLinkedIn = () => {
    const text = generateSocialPostText('linkedin', shareData, shareUrl);
    // Copy the text first so the user can easily paste it in LinkedIn
    navigator.clipboard.writeText(text).catch(() => {});
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedInUrl, '_blank', 'noopener,noreferrer,width=600,height=600');
  };

  // Open Twitter / X intent
  const handleShareTwitter = () => {
    const text = generateSocialPostText('twitter', shareData, shareUrl);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  // Open WhatsApp share
  const handleShareWhatsApp = () => {
    const text = generateSocialPostText('whatsapp', shareData, shareUrl);
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // Mini radar SVG math for the card preview
  const miniRadarSize = 150;
  const miniCenter = miniRadarSize / 2;
  const miniRadius = 52;
  const miniAxes = [
    { key: 'D', angle: -Math.PI / 2, val: pct.D, bench: PLENO_DEV_BENCHMARK.D, color: '#e11d48' },
    { key: 'I', angle: 0, val: pct.I, bench: PLENO_DEV_BENCHMARK.I, color: '#f59e0b' },
    { key: 'S', angle: Math.PI / 2, val: pct.S, bench: PLENO_DEV_BENCHMARK.S, color: '#10b981' },
    { key: 'C', angle: Math.PI, val: pct.C, bench: PLENO_DEV_BENCHMARK.C, color: '#0ea5e9' },
  ];

  const getMiniPt = (angle: number, value: number) => {
    const r = (Math.min(100, Math.max(0, value)) / 100) * miniRadius;
    return {
      x: miniCenter + r * Math.cos(angle),
      y: miniCenter + r * Math.sin(angle),
    };
  };

  const userMiniPts = miniAxes.map((a) => getMiniPt(a.angle, a.val));
  const userMiniPath = userMiniPts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z';

  const benchMiniPts = miniAxes.map((a) => getMiniPt(a.angle, a.bench));
  const benchMiniPath = benchMiniPts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Compartilhar Perfil DISC Tech
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Card Social & Link Único
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Divulgue suas fortalezas comportamentais no LinkedIn, Twitter ou com sua squad.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Card Preview Container */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-purple-400" />
                Prévia do Card Social (1200 x 630px)
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Otimizado para LinkedIn & Twitter
              </span>
            </div>

            {/* Visual Social Card (Ready for html2canvas capture) */}
            <div className="w-full overflow-x-auto pb-2">
              <div
                ref={cardRef}
                style={{ width: '680px', height: '356px' }}
                className="relative shrink-0 bg-[#07090e] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-2xl select-none"
              >
                {/* Background ambient accents */}
                <div
                  className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
                  style={{ backgroundColor: profile.color }}
                />
                <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full blur-3xl opacity-15 bg-purple-600 pointer-events-none" />

                {/* Card Top Bar */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-mono font-bold text-xs text-indigo-300">
                      DT
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-white tracking-wider uppercase font-mono">
                        DISC TECH • RELATÓRIO COMPORTAMENTAL
                      </div>
                      <div className="text-[9px] text-slate-400">
                        Engenharia de Software & Liderança Técnica
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      Aderência Dev Pleno: {adherence}%
                    </span>
                  </div>
                </div>

                {/* Card Middle Grid */}
                <div className="grid grid-cols-12 gap-4 items-center my-auto relative z-10">
                  {/* Left Column: Profile Info & Bars */}
                  <div className="col-span-7 space-y-2.5">
                    <div>
                      <div className="text-xs text-slate-400 font-mono">
                        Profissional: <strong className="text-slate-200">{name || 'Tech Member'}</strong>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-sm"
                          style={{ backgroundColor: `${profile.color}25`, color: profile.color }}
                        >
                          {dominant}
                        </span>
                        <h3 className="text-base font-bold text-white leading-tight">
                          {profile.title}
                        </h3>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {profile.tagline}
                      </p>
                    </div>

                    {/* DISC Percentage Bars */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                      {(['D', 'I', 'S', 'C'] as DiscLetter[]).map((letter) => {
                        const p = PROFILES[letter];
                        const val = pct[letter];
                        return (
                          <div key={letter} className="space-y-1">
                            <div className="flex justify-between items-center text-[10px] font-mono">
                              <span className="font-bold" style={{ color: p.color }}>
                                {letter} • {p.title.split(' ')[0]}
                              </span>
                              <span className="text-white font-bold">{val}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${val}%`, backgroundColor: p.color }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Mini Radar & Superpower */}
                  <div className="col-span-5 flex flex-col items-center justify-center border-l border-slate-800/80 pl-4 space-y-2">
                    {/* SVG Mini Radar */}
                    <div className="relative" style={{ width: miniRadarSize, height: miniRadarSize }}>
                      <svg width={miniRadarSize} height={miniRadarSize} viewBox={`0 0 ${miniRadarSize} ${miniRadarSize}`}>
                        {/* Concentric rings */}
                        {[0.5, 1.0].map((lvl) => (
                          <circle
                            key={lvl}
                            cx={miniCenter}
                            cy={miniCenter}
                            r={lvl * miniRadius}
                            fill="none"
                            stroke="#1e293b"
                            strokeWidth="1"
                            strokeDasharray={lvl === 1 ? 'none' : '2 2'}
                          />
                        ))}
                        {/* Axis lines */}
                        {miniAxes.map((a) => {
                          const edge = getMiniPt(a.angle, 100);
                          return (
                            <line
                              key={a.key}
                              x1={miniCenter}
                              y1={miniCenter}
                              x2={edge.x}
                              y2={edge.y}
                              stroke="#334155"
                              strokeWidth="1"
                            />
                          );
                        })}
                        {/* Pleno benchmark line */}
                        <path
                          d={benchMiniPath}
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="1.25"
                          strokeDasharray="3 3"
                          opacity="0.8"
                        />
                        {/* User filled polygon */}
                        <path
                          d={userMiniPath}
                          fill="rgba(99, 102, 241, 0.35)"
                          stroke="#818cf8"
                          strokeWidth="2"
                        />
                        {/* Vertex dots */}
                        {userMiniPts.map((pt, idx) => (
                          <circle
                            key={idx}
                            cx={pt.x}
                            cy={pt.y}
                            r={3}
                            fill={miniAxes[idx].color}
                            stroke="#07090e"
                            strokeWidth="1"
                          />
                        ))}
                      </svg>
                      <div className="absolute bottom-0 inset-x-0 text-center text-[9px] font-mono text-slate-400">
                        Radar vs. Dev Pleno
                      </div>
                    </div>

                    {topCareer && (
                      <div className="w-full text-center bg-slate-950/60 border border-slate-800/80 rounded-lg p-1.5">
                        <span className="text-[9px] uppercase font-mono text-slate-500 block">
                          Carreira Recomendada
                        </span>
                        <span className="text-[11px] font-bold text-white truncate block">
                          {topCareer.title} ({topCareer.matchScore}% Match)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 relative z-10 text-[9px] font-mono text-slate-400">
                  <span>Mapeado no DISC Tech 2.0</span>
                  <span className="text-slate-300">disc-tech.app • Análise de Perfil</span>
                </div>
              </div>
            </div>

            {/* Card Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <button
                type="button"
                onClick={handleDownloadCard}
                disabled={downloadingImg}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition cursor-pointer disabled:opacity-50"
              >
                {downloadingImg ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Gerando PNG...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Baixar Imagem do Card (PNG)
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCopyCardImage}
                disabled={copyingImg}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer disabled:opacity-50"
              >
                {copyingImg ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Copiando...
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar Imagem (Ctrl+V)
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Unique Link Section */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Link2 className="w-4 h-4 text-indigo-400" />
                Seu Link Único de Compartilhamento
              </span>
              <span className="text-[11px] text-emerald-400 font-mono">
                Permite a qualquer pessoa ver seu relatório interativo
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-indigo-500 select-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 border ${
                  copiedLink
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                }`}
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedLink ? 'Copiado!' : 'Copiar Link'}
              </button>
            </div>
          </div>

          {/* 1-Click Social Media Sharing Buttons */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-indigo-400" />
              Publicar nas Redes Sociais
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* LinkedIn Share */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">LinkedIn</h4>
                    <span className="text-[10px] text-slate-400">Post profissional completo</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <button
                    type="button"
                    onClick={handleShareLinkedIn}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0077b5] hover:bg-[#006097] text-white transition cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Abrir no LinkedIn
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyPostText('linkedin')}
                    className="w-full text-center text-[10px] text-slate-400 hover:text-slate-200 transition py-0.5"
                  >
                    {copiedTextType === 'linkedin' ? '✓ Texto copiado!' : 'Copiar texto para post'}
                  </button>
                </div>
              </div>

              {/* Twitter / X Share */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-200 flex items-center justify-center">
                    <Twitter className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Twitter / X</h4>
                    <span className="text-[10px] text-slate-400">Tweet com métricas & link</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <button
                    type="button"
                    onClick={handleShareTwitter}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer border border-slate-700"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Publicar no X
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyPostText('twitter')}
                    className="w-full text-center text-[10px] text-slate-400 hover:text-slate-200 transition py-0.5"
                  >
                    {copiedTextType === 'twitter' ? '✓ Tweet copiado!' : 'Copiar texto do tweet'}
                  </button>
                </div>
              </div>

              {/* WhatsApp Share */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">WhatsApp / Squad</h4>
                    <span className="text-[10px] text-slate-400">Envio direto para o time</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold transition cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
                    Enviar no WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyPostText('twitter')}
                    className="w-full text-center text-[10px] text-slate-400 hover:text-slate-200 transition py-0.5"
                  >
                    Copiar resumo formatado
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Dica: cole a imagem baixada diretamente na publicação do LinkedIn para maior engajamento.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
