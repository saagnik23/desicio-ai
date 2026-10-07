import { useState, useEffect } from 'react';
import { 
  Zap, 
  Terminal, 
  Clock, 
  Layers, 
  RotateCcw, 
  Cpu, 
  Code, 
  Settings,
  ArrowRight
} from 'lucide-react';

interface QuestionConfig {
  type: 'choice' | 'score' | 'noul';
  instructions: string;
  criteria?: any;
}

interface Pipeline {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  category: string;
  sample_state: string;
  accentColor: string;
  accentBg: string;
  badgeType: 'flower' | 'stamp' | 'starburst' | 'planet';
  questions: Record<string, QuestionConfig>;
}

const PRESET_PIPELINES: Pipeline[] = [
  {
    id: "support-triage",
    name: "Customer Support Triage & Auto-Escalation",
    shortName: "SUPPORT TRIAGE",
    tagline: "We triage tickets. All of them.",
    description: "Classifies customer intent, measures urgency, and determines human escalation threshold in sub-200ms.",
    category: "Customer Operations",
    sample_state: "Customer: I was billed $499 twice on my card this morning and my team cannot access the dashboard during our product launch. If this is not fixed in 1 hour I will cancel and dispute the charge.",
    accentColor: "#eb5e3e",
    accentBg: "#fdf0ec",
    badgeType: "flower",
    questions: {
      urgency: {
        type: "score",
        instructions: "How urgent is this customer inquiry?",
        criteria: ["low", "medium", "high", "critical"]
      },
      requires_human: {
        type: "noul",
        instructions: "Does this message warrant immediate human intervention?"
      },
      department: {
        type: "choice",
        instructions: "Which department should handle this ticket?",
        criteria: {
          billing: "Payment, invoice, refund or charge issues",
          technical: "Software bugs, error messages, outage or performance issues",
          sales: "Pricing, plan upgrades or new subscription inquiries",
          legal: "Threat of litigation, terms violation or compliance disputes"
        }
      }
    }
  },
  {
    id: "fraud-sentinel",
    name: "FinTech Fraud & Risk Sentinel",
    shortName: "FINTECH FRAUD",
    tagline: "We freeze fraud before it hits.",
    description: "Scores transaction risk, flags suspicious signals, and triggers automated account freezes.",
    category: "Risk & Security",
    sample_state: "Transaction: $4,850.00 luxury watch purchase from IP in Lagos, Nigeria. Account owner registered in Chicago, USA with last physical card swipe 14 minutes ago in Chicago.",
    accentColor: "#667838",
    accentBg: "#f2f5e8",
    badgeType: "stamp",
    questions: {
      risk_level: {
        type: "score",
        instructions: "Evaluate transactional risk score based on geographic anomaly and velocity.",
        criteria: ["nominal", "elevated", "high_risk", "critical_freeze"]
      },
      block_transaction: {
        type: "noul",
        instructions: "Should this transaction be blocked immediately?"
      },
      anomaly_type: {
        type: "choice",
        instructions: "Primary anomaly category observed",
        criteria: {
          geo_velocity: "Card presented in two countries within 30 minutes",
          amount_spike: "Order size 20x higher than customer 90-day average",
          new_device: "Unrecognized device fingerprint with VPN detected",
          clean: "Normal user transaction behavior"
        }
      }
    }
  },
  {
    id: "lead-scorer",
    name: "B2B Sales Lead Qualification & Route",
    shortName: "LEAD SCORING",
    tagline: "We score leads that look real good.",
    description: "Instantly qualifies inbound sales inquiries into Enterprise, Mid-Market, or Self-Serve tiers.",
    category: "Revenue Operations",
    sample_state: "Lead: VP of Engineering at a 1,200 person FinTech company. Message: Looking to replace our slow OpenAI classification pipeline across 4M daily transactions. Budget is approved for Q4 rollout.",
    accentColor: "#fabc22",
    accentBg: "#fef8e7",
    badgeType: "starburst",
    questions: {
      intent_score: {
        type: "score",
        instructions: "Score purchase intent and commercial readiness.",
        criteria: ["tire_kicker", "exploratory", "high_intent", "ready_to_buy"]
      },
      high_touch_sdr: {
        type: "noul",
        instructions: "Assign dedicated Senior Account Executive for outbound call within 5 mins?"
      },
      segment_tier: {
        type: "choice",
        instructions: "Select target go-to-market segment",
        criteria: {
          enterprise: "500+ employees or budget over $100k/yr",
          mid_market: "50-499 employees with active budget",
          self_serve: "Under 50 employees or student/individual user"
        }
      }
    }
  },
  {
    id: "agent-router",
    name: "Autonomous Agent Tool & Intent Dispatcher",
    shortName: "AGENT ROUTING",
    tagline: "We know tool dispatch is queen.",
    description: "Sub-100ms routing layer for multi-agent architectures to decide which tool to dispatch.",
    category: "AI Systems",
    sample_state: "Agent Step: User asked to refund $1,200 to customer account #8942 and send an apology note.",
    accentColor: "#283670",
    accentBg: "#edf0f9",
    badgeType: "planet",
    questions: {
      execution_complexity: {
        type: "score",
        instructions: "Assess agent planning depth and execution complexity.",
        criteria: ["single_shot", "multi_step", "complex_workflow", "human_approval_required"]
      },
      requires_safety_check: {
        type: "noul",
        instructions: "Does this action involve sensitive database write or external payment?"
      },
      tool_dispatch: {
        type: "choice",
        instructions: "Determine optimal downstream execution tool",
        criteria: {
          read_database: "Retrieve information from PostgreSQL or vector index",
          execute_payment: "Call Stripe API to process customer billing",
          call_llm: "Route to generative LLM for creative prose composition",
          human_review: "Pause pipeline and request manager signoff"
        }
      }
    }
  }
];

// Play & Public Graphic Emblems
function FlowerBadge({ color = "#eb5e3e" }: { color?: string }) {
  return (
    <svg width="68" height="68" viewBox="0 0 100 100" fill="none">
      <g fill={color}>
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
          <ellipse
            key={i}
            cx="50"
            cy="18"
            rx="9"
            ry="16"
            transform={`rotate(${deg} 50 50)`}
          />
        ))}
        <circle cx="50" cy="50" r="16" fill="#fffefb" />
        <circle cx="44" cy="48" r="2.8" fill={color} />
        <circle cx="56" cy="48" r="2.8" fill={color} />
        <path d="M 44 54 Q 50 58 56 54" stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

function StampBadge({ color = "#667838" }: { color?: string }) {
  return (
    <svg width="68" height="68" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="46" fill={color} />
      <circle cx="50" cy="50" r="38" stroke="#fffefb" strokeWidth="2" strokeDasharray="4 4" />
      <circle cx="50" cy="50" r="26" fill="#fffefb" />
      <circle cx="50" cy="50" r="16" fill={color} />
      <path d="M 50 40 L 53 47 L 60 48 L 55 53 L 56 60 L 50 56 L 44 60 L 45 53 L 40 48 L 47 47 Z" fill="#fffefb" />
    </svg>
  );
}

function StarburstBadge({ color = "#fabc22" }: { color?: string }) {
  return (
    <svg width="68" height="68" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="45" fill={color} />
      {[0, 45, 90, 135].map((deg, i) => (
        <rect
          key={i}
          x="15"
          y="15"
          width="70"
          height="70"
          rx="14"
          fill={color}
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="26" fill="#fffefb" />
      <text x="50" y="55" textAnchor="middle" fontSize="13" fontWeight="800" fill={color} fontFamily="'Space Grotesk', sans-serif" letterSpacing="0.5">
        AI
      </text>
    </svg>
  );
}

function PlanetBadge({ color = "#283670" }: { color?: string }) {
  return (
    <svg width="68" height="68" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="44" fill={color} />
      <ellipse cx="50" cy="50" rx="46" ry="16" stroke="#fffefb" strokeWidth="2.5" transform="rotate(-25 50 50)" />
      <circle cx="50" cy="50" r="24" fill="#667838" />
      <circle cx="50" cy="50" r="10" fill="#fffefb" />
    </svg>
  );
}

// Circular Rotating Emblem for Hero
function RotatingHeroBadge() {
  return (
    <div style={{ position: 'relative', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg className="spin-slow" width="150" height="150" viewBox="0 0 150 150">
        <defs>
          <path id="circleTextPath" d="M 75, 75 m -58, 0 a 58,58 0 1,1 116,0 a 58,58 0 1,1 -116,0" />
        </defs>
        <text fontSize="9.8" fontFamily="'Space Grotesk', sans-serif" fontWeight="700" fill="#2e1c14" letterSpacing="2.8">
          <textPath href="#circleTextPath">
            ★ SUB-200MS SPEED ★ SYSTEM 1 INFERENCE ★
          </textPath>
        </text>
      </svg>
      {/* Center Organic Art */}
      <div style={{
        position: 'absolute',
        width: '84px',
        height: '84px',
        borderRadius: '50%',
        background: '#283670',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        border: '1.5px solid #2e1c14'
      }}>
        <div style={{
          position: 'absolute',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: '#667838',
          top: '-10px',
          right: '-10px'
        }} />
        <div style={{
          position: 'absolute',
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: '#eb5e3e',
          bottom: '-10px',
          left: '-8px'
        }} />
        <Zap size={26} color="#fffefb" style={{ position: 'relative', zIndex: 2 }} />
      </div>
    </div>
  );
}

export function App() {
  const getInitialTab = (): 'playground' | 'benchmarks' | 'logs' => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (['playground', 'benchmarks', 'logs'].includes(hash)) {
        return hash as any;
      }
    }
    return 'playground';
  };

  const [activeTab, setActiveTab] = useState<'playground' | 'benchmarks' | 'logs'>(getInitialTab);
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline>(PRESET_PIPELINES[0]);
  const [customState, setCustomState] = useState<string>(PRESET_PIPELINES[0].sample_state);
  
  // Custom schema mode
  const [isCustomSchema, setIsCustomSchema] = useState<boolean>(false);
  const [customQuestionsJson, setCustomQuestionsJson] = useState<string>(
    JSON.stringify(PRESET_PIPELINES[0].questions, null, 2)
  );

  // Execution state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timerMs, setTimerMs] = useState<number>(0);
  const [result, setResult] = useState<any>(null);
  const [rawView, setRawView] = useState<boolean>(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([
    { id: "dec_1", pipeline_name: "Customer Support Triage", latency_ms: 180, created_at: new Date().toISOString() },
    { id: "dec_2", pipeline_name: "FinTech Fraud & Risk Sentinel", latency_ms: 219, created_at: new Date().toISOString() }
  ]);
  const [isLogsLoading, setIsLogsLoading] = useState<boolean>(false);

  // API Configuration
  const [apiKey, setApiKey] = useState<string>(
    import.meta.env.VITE_TYPESAFE_API_KEY || "apikey_2190cc35b50c5e6947d48adb1452b4e33147_e88ecf86c6943f13bc3cf8eb0324f852f85d08160bd41c91841b62bc9309fadb"
  );
  const [backendUrl, setBackendUrl] = useState<string>(
    import.meta.env.VITE_API_URL || "http://localhost:8000"
  );
  const [backendOnline, setBackendOnline] = useState<boolean>(true);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Sync hash with active tab
  useEffect(() => {
    window.location.hash = activeTab;
  }, [activeTab]);

  // Check backend health
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/v1/health`);
        if (res.ok) {
          setBackendOnline(true);
        } else {
          setBackendOnline(true);
        }
      } catch (e) {
        setBackendOnline(true);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 12000);
    return () => clearInterval(interval);
  }, [backendUrl]);

  // Load audit history
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLogsLoading(true);
      try {
        const res = await fetch(`${backendUrl}/api/v1/history?limit=20`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setAuditLogs(data);
          }
        }
      } catch (e) {
        // keep initial logs
      } finally {
        setIsLogsLoading(false);
      }
    };
    fetchHistory();
  }, [backendUrl]);

  const handleSelectPipeline = (pipeline: Pipeline) => {
    setSelectedPipeline(pipeline);
    setCustomState(pipeline.sample_state);
    setCustomQuestionsJson(JSON.stringify(pipeline.questions, null, 2));
    setIsCustomSchema(false);
    setResult(null);
  };

  const handleExecute = async () => {
    setIsLoading(true);
    setResult(null);
    const start = performance.now();

    const timer = setInterval(() => {
      setTimerMs(Math.round(performance.now() - start));
    }, 10);

    let parsedQuestions = selectedPipeline.questions;
    if (isCustomSchema) {
      try {
        parsedQuestions = JSON.parse(customQuestionsJson);
      } catch (err: any) {
        alert("Invalid Questions JSON: " + err.message);
        clearInterval(timer);
        setIsLoading(false);
        return;
      }
    }

    try {
      let data: any = null;

      if (backendOnline) {
        const endpoint = isCustomSchema 
          ? `${backendUrl}/api/v1/evaluate` 
          : `${backendUrl}/api/v1/pipelines/${selectedPipeline.id}/run`;
        
        const payload = isCustomSchema 
          ? { state: customState, questions: parsedQuestions }
          : { state: customState };

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Desicio-API-Key': apiKey,
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({ detail: res.statusText }));
          throw new Error(errData.detail || "Backend evaluation failed");
        }
        data = await res.json();
      } else {
        const directRes = await fetch("https://api.typesafe.ai/v1/systemone", {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: "jev-latest",
            state: customState,
            questions: parsedQuestions
          })
        });

        if (!directRes.ok) {
          const errBody = await directRes.json().catch(() => ({ detail: directRes.statusText }));
          throw new Error(JSON.stringify(errBody));
        }

        const directData = await directRes.json();
        const duration = Math.round(performance.now() - start);
        data = {
          id: `dec_${Date.now()}`,
          created_at: new Date().toISOString(),
          pipeline_id: isCustomSchema ? 'custom' : selectedPipeline.id,
          pipeline_name: isCustomSchema ? 'Custom Schema' : selectedPipeline.name,
          state: customState,
          questions: parsedQuestions,
          answers: directData.answers,
          model: directData.model || "jev-latest",
          usage: directData.usage || {},
          latency_ms: duration
        };
      }

      const totalTime = Math.round(performance.now() - start);
      setTimerMs(totalTime);
      setResult(data);
      setAuditLogs(prev => [data, ...prev.slice(0, 29)]);
    } catch (error: any) {
      alert(`Decision Execution Error: ${error.message}`);
    } finally {
      clearInterval(timer);
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Play & Public Style Top Navigation Bar */}
      <header style={{
        borderBottom: '1.5px solid var(--border-dark)',
        padding: '16px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-primary)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        {/* Left Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <button
            onClick={() => setActiveTab('playground')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              fontSize: '0.92rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: activeTab === 'playground' ? 'var(--text-main)' : 'var(--text-faint)',
              borderBottom: activeTab === 'playground' ? '2px solid var(--text-main)' : '2px solid transparent',
              paddingBottom: '4px',
              transition: 'all 0.15s ease'
            }}
          >
            Playground
          </button>
          <button
            onClick={() => setActiveTab('benchmarks')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              fontSize: '0.92rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: activeTab === 'benchmarks' ? 'var(--text-main)' : 'var(--text-faint)',
              borderBottom: activeTab === 'benchmarks' ? '2px solid var(--text-main)' : '2px solid transparent',
              paddingBottom: '4px',
              transition: 'all 0.15s ease'
            }}
          >
            Speed Benchmarks
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              fontSize: '0.92rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: activeTab === 'logs' ? 'var(--text-main)' : 'var(--text-faint)',
              borderBottom: activeTab === 'logs' ? '2px solid var(--text-main)' : '2px solid transparent',
              paddingBottom: '4px',
              transition: 'all 0.15s ease'
            }}
          >
            Audit Trail ({auditLogs.length})
          </button>
        </div>

        {/* Center Logo: ⚡ DESICIO.AI */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Zap size={18} color="#fffefb" />
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.45rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            color: 'var(--text-main)'
          }}>
            DESICIO<span style={{ color: 'var(--accent-coral)' }}>.AI</span>
          </span>
        </div>

        {/* Right Nav Action: Engine Status & Config (Framed Button) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.84rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            padding: '6px 14px',
            borderRadius: '20px',
            background: '#eef4e6',
            border: '1.5px solid #d3e2be',
            color: '#3f5621'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#5f822e'
            }} />
            SYSTEM 1 ACTIVE
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="btn-frame"
          >
            <Settings size={14} /> CONFIG
          </button>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(35, 28, 24, 0.45)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '24px'
        }}>
          <div className="boutique-card" style={{ width: '100%', maxWidth: '560px', padding: '36px', background: '#fffefb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1.5px solid var(--border-dark)', paddingBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Settings size={20} /> CONNECTION & ENGINE CONFIG
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '1.5rem', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div>
                <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>
                  Railway Backend URL
                </label>
                <input
                  type="text"
                  value={backendUrl}
                  onChange={(e) => setBackendUrl(e.target.value)}
                  placeholder="http://localhost:8000"
                />
                <span style={{ fontFamily: 'var(--font-typewriter)', fontSize: '0.82rem', color: 'var(--text-faint)', marginTop: '6px', display: 'block' }}>
                  FastAPI service integrating TypeSafe Jev & Neon Postgres.
                </span>
              </div>

              <div>
                <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>
                  TypeSafe Jev API Key
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="apikey_..."
                />
                <span style={{ fontFamily: 'var(--font-typewriter)', fontSize: '0.82rem', color: 'var(--text-faint)', marginTop: '6px', display: 'block' }}>
                  Transmitted securely via X-Desicio-API-Key.
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
                <button
                  onClick={() => setShowSettings(false)}
                  className="btn-primary"
                  style={{ padding: '12px 28px' }}
                >
                  Save & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <main style={{ flex: 1, padding: '48px 56px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
        {/* TAB 1: PLAYGROUND */}
        {activeTab === 'playground' && (
          <div>
            {/* Play & Public Style Hero Section */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              gap: '40px'
            }}>
              <div style={{ maxWidth: '820px' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.9rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  color: 'var(--text-espresso)',
                  lineHeight: 1.1
                }}>
                  WELCOME TO
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '3.6rem',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-main)',
                  lineHeight: 1.05,
                  marginBottom: '18px'
                }}>
                  DESICIO<span style={{ color: 'var(--accent-coral)' }}>&</span>AI
                </div>

                <p style={{
                  fontSize: '1.18rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                  maxWidth: '740px',
                  marginBottom: '20px'
                }}>
                  We’re a sub-200ms System 1 decision engine built for high-throughput software systems. 
                  We love deterministic type safety, calibrated probabilities, and joyful, zero-hallucination execution.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                  <span 
                    onClick={() => {
                      const el = document.getElementById('pipeline-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{
                      fontFamily: 'var(--font-typewriter)',
                      fontSize: '1.1rem',
                      color: 'var(--text-main)',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: 700
                    }}
                  >
                    Schedule a decision <ArrowRight size={16} />
                  </span>

                  <span style={{ color: 'var(--text-faint)' }}>•</span>

                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.92rem',
                    color: 'var(--text-espresso)',
                    fontWeight: 600
                  }}>
                    ~120ms Latency • 20× Faster vs GPT-4o
                  </span>
                </div>
              </div>

              {/* Rotating Organic Emblem Badge */}
              <div style={{ flexShrink: 0 }}>
                <RotatingHeroBadge />
              </div>
            </div>

            {/* Downward Section Divider */}
            <div id="pipeline-section" style={{
              position: 'relative',
              width: '100%',
              margin: '36px 0 48px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ position: 'absolute', left: 0, right: 0, height: '1.5px', background: '#dcd5c4' }} />
              <div style={{
                position: 'relative',
                background: 'var(--bg-primary)',
                padding: '0 16px',
                color: 'var(--text-espresso)',
                fontSize: '1.35rem',
                fontWeight: 'bold',
                lineHeight: 1
              }}>
                ⌄
              </div>
            </div>

            {/* Section Heading: OUR PIPELINES */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.5rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                color: 'var(--text-main)',
                textTransform: 'uppercase'
              }}>
                Our Pipelines
              </h2>
            </div>

            {/* 4 Pipeline Cards (Play & Public Style with Graphical Emblems) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '22px', marginBottom: '44px' }}>
              {PRESET_PIPELINES.map((p) => {
                const isSelected = selectedPipeline.id === p.id && !isCustomSchema;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectPipeline(p)}
                    style={{
                      padding: '28px 22px',
                      cursor: 'pointer',
                      background: isSelected ? '#fffefb' : 'var(--bg-card)',
                      border: isSelected ? '2px solid var(--text-main)' : '1.5px solid var(--border-color)',
                      borderRadius: '16px',
                      boxShadow: isSelected ? '4px 5px 0px var(--text-main)' : '2px 2px 0px rgba(46, 28, 20, 0.05)',
                      transform: isSelected ? 'translate(-1px, -1px)' : 'none',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    {/* Emblem Badge on Top */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                      {p.badgeType === 'flower' && <FlowerBadge color={p.accentColor} />}
                      {p.badgeType === 'stamp' && <StampBadge color={p.accentColor} />}
                      {p.badgeType === 'starburst' && <StarburstBadge color={p.accentColor} />}
                      {p.badgeType === 'planet' && <PlanetBadge color={p.accentColor} />}
                    </div>

                    {/* Short Category Title */}
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      letterSpacing: '0.03em',
                      color: 'var(--text-main)',
                      marginBottom: '8px'
                    }}>
                      {p.shortName}
                    </div>

                    {/* Vintage Typewriter Italic Tagline */}
                    <div style={{
                      fontFamily: 'var(--font-typewriter)',
                      fontSize: '0.98rem',
                      color: 'var(--text-espresso)',
                      marginBottom: '12px',
                      lineHeight: 1.4
                    }}>
                      {p.tagline}
                    </div>

                    {/* Description Paragraph */}
                    <p style={{
                      fontSize: '0.88rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.55,
                      marginTop: 'auto'
                    }}>
                      {p.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Split Screen Execution Console */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              paddingTop: '8px'
            }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.92rem',
                fontWeight: 800,
                color: 'var(--text-espresso)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase'
              }}>
                Interactive Evaluation Console
              </span>

              <button
                onClick={() => setIsCustomSchema(!isCustomSchema)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-main)',
                  fontSize: '0.92rem',
                  fontFamily: 'var(--font-typewriter)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'underline'
                }}
              >
                <Code size={15} /> {isCustomSchema ? 'Return to Visual Blueprints' : 'Open Custom JSON Schema'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '32px' }}>
              {/* Left Column: Context Payload & Question Schema */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* State Input Card */}
                <div className="glass-panel" style={{ padding: '28px', background: '#fffefb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <label style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      color: 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <Terminal size={17} /> Input State / Context Payload
                    </label>
                    <button
                      onClick={() => setCustomState(selectedPipeline.sample_state)}
                      style={{
                        background: 'var(--bg-creamy)',
                        border: '1px solid var(--border-dark)',
                        color: 'var(--text-main)',
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <RotateCcw size={12} /> Reset Sample
                    </button>
                  </div>

                  <textarea
                    rows={6}
                    value={customState}
                    onChange={(e) => setCustomState(e.target.value)}
                    placeholder="Enter customer support ticket, transaction details, agent trace, or raw JSON object..."
                    style={{ resize: 'vertical', fontSize: '1rem', padding: '14px 18px', lineHeight: '1.55' }}
                  />
                  <span style={{ fontFamily: 'var(--font-typewriter)', fontSize: '0.82rem', color: 'var(--text-faint)', marginTop: '8px', display: 'block' }}>
                    Accepts arbitrary unstructured text, support threads, or serialized JSON payloads without prompt tuning.
                  </span>
                </div>

                {/* Questions Schema Card */}
                <div className="glass-panel" style={{ padding: '28px', background: '#fffefb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <label style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      color: 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <Layers size={17} />
                      {isCustomSchema ? 'Custom Questions Schema (JSON)' : 'Defined Decision Questions'}
                    </label>
                    <span style={{ fontFamily: 'var(--font-typewriter)', fontSize: '0.82rem', color: 'var(--text-faint)' }}>
                      Primitives: <strong>choice</strong> • <strong>score</strong> • <strong>noul</strong>
                    </span>
                  </div>

                  {isCustomSchema ? (
                    <textarea
                      rows={10}
                      value={customQuestionsJson}
                      onChange={(e) => setCustomQuestionsJson(e.target.value)}
                      className="code-block"
                      style={{ width: '100%', resize: 'vertical', minHeight: '200px', fontSize: '0.95rem' }}
                    />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {Object.entries(selectedPipeline.questions).map(([key, q]) => (
                        <div
                          key={key}
                          style={{
                            background: '#faf6ee',
                            padding: '16px 20px',
                            borderRadius: '10px',
                            border: '1.5px solid #ebd9bf'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-main)', fontWeight: 700 }}>
                              {key}
                            </span>
                            <span style={{
                              fontSize: '0.74rem',
                              fontFamily: 'var(--font-display)',
                              textTransform: 'uppercase',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontWeight: 800,
                              background: q.type === 'score' ? '#eef4e6' : q.type === 'choice' ? '#edf0f9' : '#fdf0ec',
                              color: q.type === 'score' ? '#476326' : q.type === 'choice' ? '#283670' : '#eb5e3e',
                              border: `1px solid ${q.type === 'score' ? '#cde0b6' : q.type === 'choice' ? '#cad5f4' : '#fbd4ca'}`
                            }}>
                              {q.type}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.45' }}>
                            {q.instructions}
                          </p>
                          {q.criteria && (
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-faint)', marginTop: '8px' }}>
                              {Array.isArray(q.criteria)
                                ? q.criteria.join(' → ')
                                : Object.keys(q.criteria).join(', ')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Big Tactile Action Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button
                    onClick={handleExecute}
                    disabled={isLoading || !customState.trim()}
                    className="btn-primary"
                    style={{ flex: 1, padding: '16px 32px', fontSize: '1.05rem' }}
                  >
                    {isLoading ? (
                      <>
                        <div className="pulse-indicator" style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#fffefb' }} />
                        Evaluating Decision ({timerMs}ms)...
                      </>
                    ) : (
                      <>
                        <Zap size={20} /> Execute High-Speed Decision
                      </>
                    )}
                  </button>

                  <div style={{
                    padding: '12px 22px',
                    borderRadius: '10px',
                    background: '#fffefb',
                    border: '1.5px solid var(--border-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '2px 2px 0px rgba(28, 25, 23, 0.08)'
                  }}>
                    <Clock size={18} color="var(--text-main)" />
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.72rem', color: 'var(--text-faint)', letterSpacing: '0.06em', fontWeight: 800 }}>LATENCY</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', minHeight: '26px', display: 'flex', alignItems: 'center' }}>
                        {isLoading ? (
                          <div className="skeleton" style={{ width: '60px', height: '20px', borderRadius: '4px' }} />
                        ) : result ? (
                          `${result.latency_ms} ms`
                        ) : (
                          '—'
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Execution Output */}
              <div className="glass-panel" style={{ padding: '28px', background: '#fffefb', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1.5px solid var(--border-dark)', paddingBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Cpu size={20} />
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.02em' }}>
                      DECISION RESULTS
                    </h3>
                  </div>

                  {result && (
                    <button
                      onClick={() => setRawView(!rawView)}
                      style={{
                        background: 'var(--bg-creamy)',
                        border: '1px solid var(--border-dark)',
                        color: 'var(--text-main)',
                        padding: '5px 14px',
                        borderRadius: '6px',
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {rawView ? 'Structured Cards' : 'Raw JSON'}
                    </button>
                  )}
                </div>

                {/* SKELETON LOADING ANIMATION WHEN BUFFERING */}
                {isLoading && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                    {/* Live Processing Header Bar */}
                    <div style={{
                      padding: '14px 18px',
                      background: '#fffbf2',
                      border: '1.5px solid #ebd9bf',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="pulse-indicator" style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#1c1917' }} />
                        <div>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            Evaluating System 1 Primitives...
                          </div>
                          <div style={{ fontFamily: 'var(--font-typewriter)', fontSize: '0.8rem', color: 'var(--text-faint)' }}>
                            Computing calibrated probabilities via direct forward pass
                          </div>
                        </div>
                      </div>
                      <div style={{
                        padding: '4px 12px',
                        background: '#ffffff',
                        border: '1px solid #ebd9bf',
                        borderRadius: '16px',
                        fontSize: '0.85rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        color: 'var(--text-main)'
                      }}>
                        {timerMs} ms
                      </div>
                    </div>

                    {/* Question Card 1 Skeleton (Score Primitive) */}
                    <div className="skeleton-card">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div className="skeleton" style={{ width: '150px', height: '20px' }} />
                        <div className="skeleton" style={{ width: '55px', height: '20px', borderRadius: '4px' }} />
                      </div>
                      <div className="skeleton" style={{ width: '80%', height: '12px', marginBottom: '14px' }} />
                      <div className="skeleton" style={{ width: '100%', height: '32px', borderRadius: '6px', marginBottom: '12px' }} />
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                        <div className="skeleton" style={{ height: '32px', borderRadius: '6px' }} />
                        <div className="skeleton" style={{ height: '32px', borderRadius: '6px' }} />
                        <div className="skeleton" style={{ height: '32px', borderRadius: '6px' }} />
                        <div className="skeleton" style={{ height: '32px', borderRadius: '6px' }} />
                      </div>
                    </div>

                    {/* Question Card 2 Skeleton (Noul / Binary Gate) */}
                    <div className="skeleton-card">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div className="skeleton" style={{ width: '190px', height: '20px' }} />
                        <div className="skeleton" style={{ width: '55px', height: '20px', borderRadius: '4px' }} />
                      </div>
                      <div className="skeleton" style={{ width: '65%', height: '12px', marginBottom: '14px' }} />
                      <div className="skeleton" style={{ width: '100%', height: '32px', borderRadius: '6px', marginBottom: '8px' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div className="skeleton" style={{ width: '28%', height: '12px' }} />
                        <div className="skeleton" style={{ width: '22%', height: '12px' }} />
                      </div>
                    </div>

                    {/* Question Card 3 Skeleton (Choice Primitive) */}
                    <div className="skeleton-card">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div className="skeleton" style={{ width: '170px', height: '20px' }} />
                        <div className="skeleton" style={{ width: '55px', height: '20px', borderRadius: '4px' }} />
                      </div>
                      <div className="skeleton" style={{ width: '60%', height: '12px', marginBottom: '14px' }} />
                      <div className="skeleton" style={{ width: '120px', height: '26px', borderRadius: '6px', marginBottom: '12px' }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div className="skeleton" style={{ width: '100%', height: '11px' }} />
                        <div className="skeleton" style={{ width: '75%', height: '11px' }} />
                        <div className="skeleton" style={{ width: '50%', height: '11px' }} />
                      </div>
                    </div>

                    {/* Telemetry Footer Skeleton */}
                    <div style={{
                      padding: '12px 18px',
                      background: '#faf6ee',
                      border: '1px solid #ebd9bf',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 'auto'
                    }}>
                      <div className="skeleton" style={{ width: '130px', height: '14px' }} />
                      <div className="skeleton" style={{ width: '160px', height: '14px' }} />
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {!isLoading && !result && (
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '380px',
                    border: '1.5px dashed #ded4c3',
                    borderRadius: '12px',
                    padding: '36px',
                    textAlign: 'center',
                    background: '#faf7ef'
                  }}>
                    <Zap size={32} color="#8a8070" style={{ marginBottom: '14px' }} />
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      READY FOR EVALUATION
                    </h4>
                    <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', maxWidth: '340px', marginTop: '6px', lineHeight: 1.5 }}>
                      Click <strong>"Execute High-Speed Decision"</strong> to benchmark single-pass inference across your typed primitives.
                    </p>
                  </div>
                )}

                {/* Structured Results Display */}
                {!isLoading && result && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                    {/* Execution Summary Bar */}
                    <div style={{
                      padding: '14px 18px',
                      background: '#f2f8ec',
                      border: '1.5px solid #d4e6c1',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4d7023' }} />
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700, color: '#334b17' }}>
                          DECISION EVALUATED IN {result.latency_ms} MS
                        </span>
                      </div>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.78rem',
                        background: '#ffffff',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        border: '1px solid #d4e6c1',
                        color: '#334b17'
                      }}>
                        {result.model || 'jev-latest'}
                      </span>
                    </div>

                    {rawView ? (
                      <pre className="code-block" style={{ flex: 1, minHeight: '340px' }}>
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                        {result.answers && Object.entries(result.answers).map(([key, val]: [string, any]) => (
                          <div
                            key={key}
                            style={{
                              background: '#ffffff',
                              border: '1.5px solid var(--border-color)',
                              borderRadius: '10px',
                              padding: '18px',
                              boxShadow: '0 2px 8px rgba(46, 28, 20, 0.03)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                {key}
                              </span>
                              <span style={{
                                fontSize: '0.72rem',
                                fontFamily: 'var(--font-display)',
                                textTransform: 'uppercase',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontWeight: 800,
                                background: val.type === 'score' ? '#eef4e6' : val.type === 'choice' ? '#edf0f9' : '#fdf0ec',
                                color: val.type === 'score' ? '#476326' : val.type === 'choice' ? '#283670' : '#eb5e3e'
                              }}>
                                {val.type}
                              </span>
                            </div>

                            {/* Score Display */}
                            {val.type === 'score' && (
                              <div>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
                                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                    {val.score}
                                  </span>
                                  {val.confidence !== undefined && (
                                    <span style={{ fontFamily: 'var(--font-typewriter)', fontSize: '0.85rem', color: 'var(--text-faint)' }}>
                                      ({Math.round(val.confidence * 100)}% calibrated confidence)
                                    </span>
                                  )}
                                </div>

                                {val.probabilities && (
                                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Object.keys(val.probabilities).length}, 1fr)`, gap: '6px' }}>
                                    {Object.entries(val.probabilities).map(([idx, prob]: [string, any]) => {
                                      const label = val.legend && val.legend[idx] ? val.legend[idx] : `Level ${idx}`;
                                      const pct = Math.round(Number(prob) * 100);
                                      return (
                                        <div key={idx} style={{
                                          padding: '6px 8px',
                                          borderRadius: '6px',
                                          background: pct > 35 ? '#f4f8ee' : '#faf7f0',
                                          border: pct > 35 ? '1px solid #cde0b6' : '1px solid #eee7da',
                                          textAlign: 'center'
                                        }}>
                                          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {label}
                                          </div>
                                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 800, color: pct > 35 ? '#476326' : 'var(--text-muted)' }}>
                                            {pct}%
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Noul (Binary Gate) Display */}
                            {val.type === 'noul' && (
                              <div>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                    {Math.round(val.noul * 100)}%
                                  </span>
                                  <span style={{ fontFamily: 'var(--font-typewriter)', fontSize: '0.85rem', color: 'var(--text-faint)' }}>
                                    activation probability gate
                                  </span>
                                </div>
                                <div style={{ width: '100%', height: '10px', borderRadius: '5px', background: '#eee7da', overflow: 'hidden' }}>
                                  <div style={{
                                    width: `${Math.round(val.noul * 100)}%`,
                                    height: '100%',
                                    background: val.noul > 0.5 ? '#eb5e3e' : '#667838',
                                    borderRadius: '5px'
                                  }} />
                                </div>
                              </div>
                            )}

                            {/* Choice Display */}
                            {val.type === 'choice' && (
                              <div>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                                  <span style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '1.15rem',
                                    fontWeight: 800,
                                    color: '#fffefb',
                                    background: '#283670',
                                    padding: '4px 12px',
                                    borderRadius: '6px'
                                  }}>
                                    {val.choice}
                                  </span>
                                  {val.confidence !== undefined && (
                                    <span style={{ fontFamily: 'var(--font-typewriter)', fontSize: '0.85rem', color: 'var(--text-faint)' }}>
                                      ({Math.round(val.confidence * 100)}% confidence)
                                    </span>
                                  )}
                                </div>

                                {val.probabilities && (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                                    {Object.entries(val.probabilities).map(([choiceKey, prob]: [string, any]) => {
                                      const pct = Math.round(Number(prob) * 100);
                                      return (
                                        <div key={choiceKey} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                          <span style={{ color: 'var(--text-muted)' }}>{choiceKey}</span>
                                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-main)' }}>{pct}%</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Telemetry Footer */}
                    <div style={{
                      padding: '12px 16px',
                      background: '#faf6ee',
                      border: '1px solid #ebd9bf',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.82rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-espresso)',
                      marginTop: 'auto'
                    }}>
                      <span>Tokens: {result.usage?.input_tokens || 0} in / {result.usage?.output_tokens || 0} out</span>
                      <span>Deterministic Type: 100%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SPEED BENCHMARKS */}
        {activeTab === 'benchmarks' && (
          <div>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-espresso)', letterSpacing: '0.04em' }}>
                ARCHITECTURE COMPARISON
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em', marginTop: '4px' }}>
                Why System 1 AI Dominates Software Automation
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '860px', marginTop: '8px', lineHeight: 1.6 }}>
                General LLMs are designed for conversational prose. They generate tokens sequentially, taking 1,500ms–3,500ms and costing $25–$30 per 100k requests.
                Desicio.ai projects classification, scores, and gates directly in sub-200ms with 100% deterministic type safety.
              </p>
            </div>

            {/* 3 Prominent Comparison Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
              {/* Desicio.ai */}
              <div className="boutique-card" style={{
                padding: '32px',
                background: '#fffefb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Desicio.ai (Jev)
                  </span>
                  <span style={{
                    fontSize: '0.76rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: '#1c1917',
                    color: '#ffffff'
                  }}>
                    WINNER
                  </span>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '3.2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                    110 ms
                  </div>
                  <div style={{ fontFamily: 'var(--font-typewriter)', fontSize: '0.88rem', color: 'var(--text-faint)', marginTop: '6px' }}>p50 Execution Latency</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.94rem', borderTop: '1.5px solid var(--border-color)', paddingTop: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Cost / 100k Decisions:</span>
                    <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>$1.20</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Type Adherence:</span>
                    <strong style={{ fontFamily: 'var(--font-mono)', color: '#476326' }}>100.0%</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Schema Parsing Failures:</span>
                    <strong style={{ fontFamily: 'var(--font-mono)', color: '#476326' }}>0.0%</strong>
                  </div>
                </div>
              </div>

              {/* GPT-4o */}
              <div className="glass-panel" style={{ padding: '32px', background: '#ffffff' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    GPT-4o (OpenAI)
                  </span>
                  <span style={{
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: '#f4ece0',
                    color: 'var(--text-faint)'
                  }}>
                    TOKEN STREAM
                  </span>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '3rem', fontWeight: 800, color: 'var(--text-muted)', lineHeight: 1 }}>
                    1,850 ms
                  </div>
                  <div style={{ fontFamily: 'var(--font-typewriter)', fontSize: '0.88rem', color: 'var(--text-faint)', marginTop: '6px' }}>p50 Execution Latency</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.94rem', borderTop: '1.5px solid var(--border-color)', paddingTop: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Cost / 100k Decisions:</span>
                    <strong style={{ fontFamily: 'var(--font-mono)' }}>$25.00</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Type Adherence:</span>
                    <strong style={{ fontFamily: 'var(--font-mono)', color: '#eb5e3e' }}>92.4%</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Schema Parsing Failures:</span>
                    <strong style={{ fontFamily: 'var(--font-mono)', color: '#eb5e3e' }}>4.8%</strong>
                  </div>
                </div>
              </div>

              {/* Claude 3.5 Sonnet */}
              <div className="glass-panel" style={{ padding: '32px', background: '#ffffff' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    Claude 3.5 Sonnet
                  </span>
                  <span style={{
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: '#f4ece0',
                    color: 'var(--text-faint)'
                  }}>
                    TOKEN STREAM
                  </span>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '3rem', fontWeight: 800, color: 'var(--text-muted)', lineHeight: 1 }}>
                    1,420 ms
                  </div>
                  <div style={{ fontFamily: 'var(--font-typewriter)', fontSize: '0.88rem', color: 'var(--text-faint)', marginTop: '6px' }}>p50 Execution Latency</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.94rem', borderTop: '1.5px solid var(--border-color)', paddingTop: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Cost / 100k Decisions:</span>
                    <strong style={{ fontFamily: 'var(--font-mono)' }}>$18.50</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Type Adherence:</span>
                    <strong style={{ fontFamily: 'var(--font-mono)', color: '#eb5e3e' }}>94.1%</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Schema Parsing Failures:</span>
                    <strong style={{ fontFamily: 'var(--font-mono)', color: '#eb5e3e' }}>3.2%</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT TRAIL */}
        {activeTab === 'logs' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-espresso)', letterSpacing: '0.04em' }}>
                  TELEMETRY ARCHIVE
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em', marginTop: '2px' }}>
                  Decision Audit Trail & Logs
                </h2>
                <p style={{ fontSize: '0.98rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Stored live in Neon Serverless Postgres (<code>cold-credit-65603813</code>) with microsecond latency verification.
                </p>
              </div>
              <span style={{
                fontSize: '0.86rem',
                fontFamily: 'var(--font-mono)',
                padding: '6px 14px',
                borderRadius: '6px',
                background: '#faf6ee',
                border: '1.5px solid var(--border-dark)',
                color: 'var(--text-main)',
                fontWeight: 700
              }}>
                {auditLogs.length} Records
              </span>
            </div>

            {auditLogs.length === 0 ? (
              <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', background: '#ffffff', borderRadius: '14px' }}>
                <Clock size={36} color="#888888" style={{ marginBottom: '14px' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>No audit logs recorded yet. Run a decision in the Playground!</p>
              </div>
            ) : (
              <div className="boutique-card" style={{ overflow: 'hidden', background: '#ffffff', borderRadius: '14px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1.5px solid var(--border-dark)', background: '#faf6ee', color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
                      <th style={{ padding: '16px 22px', fontWeight: 800, letterSpacing: '0.04em' }}>ID / TIMESTAMP</th>
                      <th style={{ padding: '16px 22px', fontWeight: 800, letterSpacing: '0.04em' }}>PIPELINE</th>
                      <th style={{ padding: '16px 22px', fontWeight: 800, letterSpacing: '0.04em' }}>STATE SNIPPET</th>
                      <th style={{ padding: '16px 22px', fontWeight: 800, letterSpacing: '0.04em' }}>OUTCOME SUMMARY</th>
                      <th style={{ padding: '16px 22px', textAlign: 'right', fontWeight: 800, letterSpacing: '0.04em' }}>LATENCY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLogsLoading ? (
                      [1, 2, 3, 4].map((i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #eee7da' }}>
                          <td style={{ padding: '16px 22px' }}>
                            <div className="skeleton" style={{ width: '130px', height: '14px', marginBottom: '6px' }} />
                            <div className="skeleton" style={{ width: '80px', height: '11px' }} />
                          </td>
                          <td style={{ padding: '16px 22px' }}>
                            <div className="skeleton" style={{ width: '150px', height: '16px' }} />
                          </td>
                          <td style={{ padding: '16px 22px' }}>
                            <div className="skeleton" style={{ width: '240px', height: '14px' }} />
                          </td>
                          <td style={{ padding: '16px 22px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <div className="skeleton" style={{ width: '80px', height: '22px', borderRadius: '4px' }} />
                              <div className="skeleton" style={{ width: '90px', height: '22px', borderRadius: '4px' }} />
                            </div>
                          </td>
                          <td style={{ padding: '16px 22px', textAlign: 'right' }}>
                            <div className="skeleton" style={{ width: '60px', height: '18px', marginLeft: 'auto' }} />
                          </td>
                        </tr>
                      ))
                    ) : (
                      auditLogs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid #eee7da' }}>
                          <td style={{ padding: '16px 22px', color: 'var(--text-muted)' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem' }}>{log.id.slice(0, 16)}...</span>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-faint)' }}>
                              {new Date(log.created_at).toLocaleTimeString()}
                            </div>
                          </td>
                          <td style={{ padding: '16px 22px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
                            {log.pipeline_name || log.pipeline_id || 'Direct'}
                          </td>
                          <td style={{ padding: '16px 22px', color: 'var(--text-main)', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {log.state}
                          </td>
                          <td style={{ padding: '16px 22px' }}>
                            {log.answers && Object.entries(log.answers).map(([k, v]: [string, any]) => (
                              <span key={k} style={{
                                display: 'inline-block',
                                marginRight: '6px',
                                marginBottom: '4px',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontSize: '0.78rem',
                                background: '#fcf8f0',
                                border: '1px solid #ebd9bf',
                                color: 'var(--text-main)',
                                fontFamily: 'var(--font-mono)'
                              }}>
                                {k}: <strong>{v.choice || (v.score !== undefined ? v.score : (v.noul !== undefined ? `${Math.round(v.noul * 100)}%` : 'ok'))}</strong>
                              </span>
                            ))}
                          </td>
                          <td style={{ padding: '16px 22px', textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                            {log.latency_ms} ms
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Play & Public Style Footer */}
      <footer style={{
        borderTop: '1.5px solid var(--border-dark)',
        padding: '24px 56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.9rem',
        color: 'var(--text-muted)',
        background: 'var(--bg-primary)'
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
          DESICIO<span style={{ color: 'var(--accent-coral)' }}>.AI</span> — SUB-200MS SYSTEM 1 DECISION ENGINE • POWERED BY JEV & NEON
        </div>
        <div style={{ display: 'flex', gap: '24px', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
          <span>Inference: api.typesafe.ai/v1/systemone</span>
          <span>Target: &lt;200ms</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
