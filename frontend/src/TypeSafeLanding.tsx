import React, { useState, useEffect, useRef } from 'react';
import './TypeSafeLanding.css';
import { Play, ArrowDown, ChevronRight, Zap } from 'lucide-react';
import { DecisionEfficiencyLab } from './DecisionEfficiencyLab';

interface TypeSafeLandingProps {
  onTryPlayground: () => void;
  onWatchVideo: () => void;
  onViewBenchmarks?: () => void;
}

export const TypeSafeLanding: React.FC<TypeSafeLandingProps> = ({
  onTryPlayground,
  onWatchVideo,
  onViewBenchmarks
}) => {
  // Cursor following video button state - strictly constrained to headline text
  const textHeroRef = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHoveringText, setIsHoveringText] = useState<boolean>(false);

  // Live retro clock state
  const [timeStr, setTimeStr] = useState<string>('00:00:00');
  const [dateStr, setDateStr] = useState<string>('Thursday, Oct 8, 2026');

  // Glider animation step
  const [gliderStep, setGliderStep] = useState<number>(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0]);
      setDateStr(now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const gliderInterval = setInterval(() => {
      setGliderStep(prev => (prev + 1) % 4);
    }, 800);
    return () => clearInterval(gliderInterval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!textHeroRef.current) return;
    const rect = textHeroRef.current.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;
    // Strict bounding box padding so button never touches borders or overflows
    const clampedX = Math.max(135, Math.min(rect.width - 135, rawX));
    const clampedY = Math.max(35, Math.min(rect.height - 35, rawY));
    setCursorPos({ x: clampedX, y: clampedY });
  };

  // Glider cell configurations for Conway Game of Life 3x3 glider
  const gliderPatterns = [
    [0, 1, 0, 0, 0, 1, 1, 1, 1],
    [0, 0, 1, 1, 0, 1, 0, 1, 1],
    [1, 0, 1, 0, 1, 1, 0, 1, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 1]
  ];

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '48px', position: 'relative' }}>
      
      {/* 1. TOP RETRO NEWS BANNERS */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        paddingTop: '8px'
      }}>
        {/* Banner 1: No More Waitlist */}
        <div className="retro-news-banner">
          <div style={{
            background: '#1c1917',
            color: '#faf7ea',
            fontSize: '0.74rem',
            padding: '3px 6px',
            marginBottom: '6px',
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 700
          }}>
            <span>Sept 27, 2026 ▪ Desicio News</span>
            <span>OS 1.1</span>
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '8px', color: '#1c1917' }}>
            NO MORE WAITLIST<br />
            Desicio.ai is now open to everyone
          </div>
          <button
            onClick={onTryPlayground}
            style={{
              background: '#1c1917',
              color: '#ffffff',
              border: '1px solid #1c1917',
              padding: '6px 14px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              fontWeight: 700
            }}
          >
            Launch Playground
          </button>
        </div>

        {/* Banner 2: System One Launch Announcement */}
        <div className="retro-news-banner">
          <div style={{
            background: '#1c1917',
            color: '#faf7ea',
            fontSize: '0.74rem',
            padding: '3px 6px',
            marginBottom: '6px',
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 700
          }}>
            <span>Sept 15, 2026 ▪ Desicio News</span>
            <span>SYSTEM 1</span>
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '8px', color: '#1c1917' }}>
            🎉 Desicio announces System One<br />
            Deterministic Inference Engine
          </div>
          <button
            onClick={onWatchVideo}
            style={{
              background: '#ffffff',
              color: '#1c1917',
              border: '1.5px solid #1c1917',
              padding: '6px 14px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              fontWeight: 700
            }}
          >
            Watch Video Demo ▶
          </button>
        </div>
      </div>

      {/* 2. SUBTITLE INTRO */}
      <div style={{ textAlign: 'center', margin: '4px 0 0 0' }}>
        <p style={{
          fontFamily: "'Courier Prime', 'Space Mono', monospace",
          fontSize: '1.05rem',
          color: '#1c1917',
          fontWeight: 600,
          letterSpacing: '0.04em'
        }}>
          Introducing Desicio.ai .................................................... Intelligence beyond chat
        </p>
      </div>

      {/* 3. GIANT HERO TYPOGRAPHY WITH CURSOR-FOLLOWING LAUNCH BUTTON */}
      <div style={{ position: 'relative', width: '100%' }}>
        {/* Strictly isolated typography tracking canvas */}
        <div
          ref={textHeroRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHoveringText(true)}
          onMouseLeave={() => setIsHoveringText(false)}
          style={{
            position: 'relative',
            padding: '36px 16px 20px 16px',
            textAlign: 'center',
            cursor: 'default',
            overflow: 'hidden',
            borderRadius: '16px',
            background: 'radial-gradient(ellipse at center, rgba(247, 168, 196, 0.15) 0%, transparent 70%)'
          }}
        >
          {/* Floating / Cursor Tracking Button - Strictly constrained inside text, hidden when outside */}
          <button
            onClick={onWatchVideo}
            className="cursor-video-button"
            style={{
              left: `${cursorPos.x}px`,
              top: `${cursorPos.y}px`,
              opacity: isHoveringText ? 1 : 0,
              pointerEvents: isHoveringText ? 'auto' : 'none',
              visibility: isHoveringText ? 'visible' : 'hidden',
              transition: isHoveringText ? 'transform 0.05s ease-out, opacity 0.15s ease' : 'opacity 0.2s ease, visibility 0.2s ease'
            }}
            title="Click to watch full AI video demo"
          >
            <span>Watch Our Launch Video</span>
            <span style={{
              background: '#1c1917',
              color: '#ffffff',
              padding: '2px 5px',
              fontSize: '0.7rem',
              borderRadius: '2px'
            }}>
              ▶
            </span>
          </button>

          {/* Big Impact Headline exactly like TypeSafe.ai */}
          <h1 className="typesafe-giant-hero">
            The First<br />
            (Public) System<br />
            One Model; Desicio.ai<br />
            Gives AI The<br />
            Properties Of<br />
            Code
          </h1>
        </div>

        {/* Dedicated Action Hub - COMPLETELY OUTSIDE the text tracking canvas so zero overlap occurs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          marginTop: '24px',
          position: 'relative',
          zIndex: 30,
          flexWrap: 'wrap'
        }}>
          <button
            onClick={onTryPlayground}
            style={{
              background: '#1c1917',
              color: '#ffffff',
              border: '2px solid #1c1917',
              padding: '14px 32px',
              borderRadius: '8px',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.05rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              boxShadow: '4px 4px 0px #ec4899',
              transition: 'all 0.15s ease'
            }}
          >
            <Zap size={20} color="#facc15" />
            <span>TRY DESICIO.AI PLAYGROUND</span>
            <ChevronRight size={18} />
          </button>

          <button
            onClick={onWatchVideo}
            style={{
              background: '#ffffff',
              color: '#1c1917',
              border: '2px solid #1c1917',
              padding: '14px 28px',
              borderRadius: '8px',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.05rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              boxShadow: '4px 4px 0px #1c1917',
              transition: 'all 0.15s ease'
            }}
          >
            <Play size={18} fill="#ec4899" color="#ec4899" />
            <span>Watch 2-Min Demo Walkthrough</span>
          </button>
        </div>
      </div>

      {/* 4. THE ICONIC RETRO OS 1 MOVING GRAPH WIDGET (Matching Screenshot 1) */}
      <div style={{ position: 'relative', marginTop: '12px' }}>
        
        {/* Section title badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
          padding: '0 8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: '#1c1917',
              color: '#fff',
              padding: '3px 8px'
            }}>
              BENCHMARK.OS1
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: '#1c1917' }}>
              Real-Time Cost-Effectiveness & Speed Variance Simulation
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {onViewBenchmarks && (
              <button
                onClick={onViewBenchmarks}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  color: '#1c1917',
                  textDecoration: 'underline'
                }}
              >
                Speed Benchmarks →
              </button>
            )}
            <button
              onClick={onTryPlayground}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontWeight: 700,
                fontSize: '0.84rem',
                color: '#1c1917',
                textDecoration: 'underline',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>Skip to Live Playground</span>
              <ArrowDown size={14} />
            </button>
          </div>
        </div>

        {/* Halftone canvas frame */}
        <div className="retro-halftone-bg" style={{ minHeight: '560px', padding: '36px 24px', position: 'relative' }}>
          
          {/* Top-Right: Clock Tool 1.1 */}
          <div className="retro-os-window" style={{
            position: 'absolute',
            top: '20px',
            right: '24px',
            width: '180px',
            zIndex: 10
          }}>
            <div className="retro-os-titlebar">
              <span>Clock Tool 1.1</span>
              <span>✖</span>
            </div>
            <div style={{ padding: '8px 10px', fontSize: '0.78rem' }}>
              <div style={{ color: '#1c1917', fontWeight: 600 }}>{dateStr}</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, margin: '4px 0', letterSpacing: '0.05em' }}>
                {timeStr}
              </div>
              <div style={{ fontSize: '0.65rem', color: '#555', letterSpacing: '2px' }}>
                ▪ : ▪ * . : *
              </div>
            </div>
          </div>

          {/* Background Window 1: LM */}
          <div className="retro-os-window" style={{
            position: 'absolute',
            top: '40px',
            left: '32px',
            width: '120px',
            zIndex: 1
          }}>
            <div className="retro-os-titlebar">
              <span>LM</span>
            </div>
            <div style={{ padding: '8px', fontSize: '0.75rem' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>LM</div>
              <div style={{ color: '#555', fontSize: '0.7rem' }}>berts</div>
              <div style={{ color: '#777', fontSize: '0.65rem' }}>&lt;low intelligence</div>
              <div style={{ fontSize: '0.65rem', marginTop: '4px' }}>✤ gpt</div>
            </div>
          </div>

          {/* Background Window 2: LLM */}
          <div className="retro-os-window" style={{
            position: 'absolute',
            top: '90px',
            left: '110px',
            width: '120px',
            zIndex: 2
          }}>
            <div className="retro-os-titlebar">
              <span>LLM</span>
            </div>
            <div style={{ padding: '8px', fontSize: '0.75rem' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>LLM</div>
              <div style={{ color: '#555', fontSize: '0.7rem' }}>pre-train</div>
              <div style={{ fontSize: '0.65rem', marginTop: '4px' }}>✤ gpt</div>
            </div>
          </div>

          {/* Background Window 3: RLHF */}
          <div className="retro-os-window" style={{
            position: 'absolute',
            top: '24px',
            left: '30%',
            width: '180px',
            zIndex: 3
          }}>
            <div className="retro-os-titlebar">
              <span>RLHF</span>
            </div>
            <div style={{ padding: '8px', fontSize: '0.75rem' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>RLHF</div>
              <div style={{ color: '#555' }}>chat models</div>
              <div style={{ fontSize: '0.68rem', marginTop: '4px' }}>
                ✤ chat gpt ✤ claude ✤ instruct
              </div>
            </div>
          </div>

          {/* Background Window 4: RLVR */}
          <div className="retro-os-window" style={{
            position: 'absolute',
            top: '72px',
            right: '26%',
            width: '150px',
            zIndex: 4
          }}>
            <div className="retro-os-titlebar">
              <span>RLVR</span>
            </div>
            <div style={{ padding: '8px', fontSize: '0.75rem' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>RLVR</div>
              <div style={{ color: '#555', fontSize: '0.7rem' }}>reasoning models</div>
              <div style={{ fontSize: '0.7rem', marginTop: '4px' }}>
                ✤ o1 ✤ o3
              </div>
            </div>
          </div>

          {/* MAIN FOREGROUND BENCHMARK WINDOW (RLCD / Desicio.ai) */}
          <div className="retro-os-window" style={{
            maxWidth: '560px',
            margin: '64px auto 0 auto',
            width: '100%',
            zIndex: 20,
            position: 'relative',
            background: '#ececec'
          }}>
            {/* Window Header */}
            <div style={{
              display: 'flex',
              borderBottom: '2px solid #1c1917',
              background: '#dfdfdf'
            }}>
              {/* Left Cube / Logo */}
              <div style={{
                padding: '10px 14px',
                borderRight: '2px solid #1c1917',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#ececec'
              }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  border: '1.5px solid #1c1917',
                  background: 'repeating-conic-gradient(#1c1917 0% 25%, #faf7ea 0% 50%) 50% / 4px 4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '4px'
                }}>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    background: '#1c1917',
                    border: '1px solid #fff'
                  }} />
                </div>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#1c1917',
                  letterSpacing: '0.04em'
                }}>
                  Desicio.ai
                </span>
              </div>

              {/* Right RLCD Title */}
              <div style={{ padding: '10px 14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{
                  fontSize: '1.35rem',
                  fontWeight: 900,
                  letterSpacing: '0.05em',
                  color: '#1c1917'
                }}>
                  RLCD
                </div>
                <div style={{
                  fontSize: '0.78rem',
                  color: '#333',
                  fontWeight: 600,
                  lineHeight: 1.3
                }}>
                  reinforcement learning for calibrated decisions
                </div>
              </div>
            </div>

            {/* Benchmark Trackers Section (With moving black boxes!) */}
            <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Row 1: Desicio.ai (Top Performance) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.85rem' }}>
                <span style={{
                  background: '#1c1917',
                  color: '#ffffff',
                  padding: '2px 8px',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  minWidth: '135px'
                }}>
                  Desicio.ai
                </span>
                <span style={{ fontWeight: 800, minWidth: '55px', color: '#1c1917' }}>193.6x</span>
                
                {/* Track with moving box - Desicio.ai moves fast to symbolize sub-200ms System 1 throughput */}
                <div style={{
                  flex: 1,
                  height: '2px',
                  background: '#1c1917',
                  position: 'relative',
                  margin: '0 8px'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '12%',
                    width: '14px',
                    height: '14px',
                    background: '#1c1917',
                    animation: 'sliderGlideDesicioFast 0.85s ease-in-out infinite'
                  }} title="Desicio.ai ultra-fast System 1 inference slider" />
                </div>
                
                <span style={{ fontWeight: 700, minWidth: '60px', textAlign: 'right', color: '#1c1917' }}>$0.39</span>
              </div>

              {/* Row 2: Claude Haiku 4.5 (Slow) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.85rem' }}>
                <span style={{
                  background: '#1c1917',
                  color: '#ffffff',
                  padding: '2px 8px',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  minWidth: '135px'
                }}>
                  Claude Haiku 4.5
                </span>
                <span style={{ fontWeight: 700, minWidth: '55px', color: '#333' }}>6.2x</span>
                
                {/* Track with moving box */}
                <div style={{
                  flex: 1,
                  height: '2px',
                  background: '#1c1917',
                  position: 'relative',
                  margin: '0 8px'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-6px',
                    left: '32%',
                    width: '14px',
                    height: '14px',
                    background: '#1c1917',
                    animation: 'sliderGlide2 4.2s ease-in-out infinite'
                  }} title="Claude Haiku cost-effectiveness slider" />
                </div>
                
                <span style={{ fontWeight: 700, minWidth: '60px', textAlign: 'right', color: '#1c1917' }}>$19.49</span>
              </div>

              {/* Row 3: Claude Sonnet 4 (Renamed from Opus 5 - Slow) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.85rem' }}>
                <span style={{
                  background: '#1c1917',
                  color: '#ffffff',
                  padding: '2px 8px',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  minWidth: '135px'
                }}>
                  Claude Sonnet 4
                </span>
                <span style={{ fontWeight: 700, minWidth: '55px', color: '#333' }}>2.1x</span>
                
                {/* Track with moving box */}
                <div style={{
                  flex: 1,
                  height: '2px',
                  background: '#1c1917',
                  position: 'relative',
                  margin: '0 8px'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '18%',
                    width: '14px',
                    height: '14px',
                    background: '#1c1917',
                    animation: 'sliderGlide3 5.4s ease-in-out infinite'
                  }} title="Claude Sonnet 4 cost-effectiveness slider" />
                </div>
                
                <span style={{ fontWeight: 700, minWidth: '60px', textAlign: 'right', color: '#1c1917' }}>$176.05</span>
              </div>

              {/* Row 4: Claude Sonnet 5 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.85rem' }}>
                <span style={{
                  background: '#1c1917',
                  color: '#ffffff',
                  padding: '2px 8px',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  minWidth: '135px'
                }}>
                  Claude Sonnet 5
                </span>
                <span style={{ fontWeight: 700, minWidth: '55px', color: '#333' }}>1.0x</span>
                
                {/* Track with moving box */}
                <div style={{
                  flex: 1,
                  height: '2px',
                  background: '#1c1917',
                  position: 'relative',
                  margin: '0 8px'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-6px',
                    left: '52%',
                    width: '14px',
                    height: '14px',
                    background: '#1c1917',
                    animation: 'sliderGlide4 6.2s ease-in-out infinite'
                  }} title="Claude Sonnet cost-effectiveness slider" />
                </div>
                
                <span style={{ fontWeight: 700, minWidth: '60px', textAlign: 'right', color: '#1c1917' }}>$117.38</span>
              </div>

              {/* Row 5: GPT-5.6-Luna (Slow) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.85rem' }}>
                <span style={{
                  background: '#1c1917',
                  color: '#ffffff',
                  padding: '2px 8px',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  minWidth: '135px'
                }}>
                  Gpt-5.6-Luna
                </span>
                <span style={{ fontWeight: 700, minWidth: '55px', color: '#333' }}>6.0x</span>
                
                {/* Track with moving box */}
                <div style={{
                  flex: 1,
                  height: '2px',
                  background: '#1c1917',
                  position: 'relative',
                  margin: '0 8px'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-6px',
                    left: '38%',
                    width: '14px',
                    height: '14px',
                    background: '#1c1917',
                    animation: 'sliderGlide5 4.8s ease-in-out infinite'
                  }} title="GPT 5.6 Luna cost-effectiveness slider" />
                </div>
                
                <span style={{ fontWeight: 700, minWidth: '60px', textAlign: 'right', color: '#1c1917' }}>$3.31</span>
              </div>

            </div>

            {/* Bottom Stipple Pattern */}
            <div className="retro-stipple-grid" />
          </div>

          {/* Bottom-Right: Glider 1.1 Tool (Conway's Game of Life) */}
          <div className="retro-os-window" style={{
            position: 'absolute',
            bottom: '24px',
            right: '24px',
            width: '130px',
            zIndex: 10
          }}>
            <div className="retro-os-titlebar">
              <span>Glider 1.1</span>
            </div>
            <div style={{ padding: '8px', textAlign: 'center' }}>
              {/* 3x3 Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 14px)',
                gridGap: '3px',
                justifyContent: 'center',
                margin: '4px auto 6px auto'
              }}>
                {gliderPatterns[gliderStep].map((val, idx) => (
                  <div key={idx} style={{
                    width: '14px',
                    height: '14px',
                    background: val === 1 ? '#1c1917' : '#dedede',
                    border: '1px solid #1c1917',
                    borderRadius: val === 1 ? '50%' : '0'
                  }} />
                ))}
              </div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#333' }}>
                Game of Life
              </div>
            </div>
          </div>

          {/* Bottom-Left: Copyright & Version Window */}
          <div className="retro-os-window" style={{
            position: 'absolute',
            bottom: '24px',
            left: '24px',
            width: '240px',
            zIndex: 10
          }}>
            <div className="retro-os-titlebar">
              <span>Desicio.ai</span>
            </div>
            <div style={{ padding: '8px 10px', fontSize: '0.74rem', color: '#333', lineHeight: 1.4 }}>
              <div style={{ fontWeight: 700, color: '#1c1917' }}>Version 0.01</div>
              <div>©2026. All rights reserved.</div>
              <div style={{ color: '#555', marginTop: '2px' }}>System 1 Calibration Layer.</div>
            </div>
          </div>

        </div>
      </div>

      {/* 4.5. DECISION EFFICIENCY LAB (INTERACTIVE BENCHMARK & COST SUITE) */}
      <DecisionEfficiencyLab />

      {/* 5. SEAMLESS BRIDGE TO LIVE PLAYGROUND */}
      <div style={{
        marginTop: '8px',
        padding: '24px',
        background: '#ffffff',
        border: '2px solid var(--border-dark)',
        borderRadius: '12px',
        boxShadow: '4px 4px 0px var(--border-dark)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Zap size={22} color="var(--accent-coral)" />
            <span>Interactive System 1 Playground & Evaluation Suite</span>
          </div>
          <p style={{
            fontSize: '0.94rem',
            color: 'var(--text-muted)',
            marginTop: '4px'
          }}>
            Select pre-configured enterprise pipelines, edit state in real-time, test sub-200ms inference, and view live Neon audit logs below.
          </p>
        </div>

        <button
          onClick={onTryPlayground}
          style={{
            background: 'var(--text-main)',
            color: '#fffefb',
            border: '2px solid var(--text-main)',
            padding: '12px 24px',
            borderRadius: '24px',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '0.92rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '3px 3px 0px var(--accent-coral)'
          }}
        >
          <span>EXPLORE EVALUATION ENGINE</span>
          <ArrowDown size={16} />
        </button>
      </div>

    </div>
  );
};
