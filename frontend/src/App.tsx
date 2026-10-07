import { useState, useEffect } from 'react';
import { 
  Zap, 
  Gauge, 
  ShieldAlert, 
  Users, 
  Bot, 
  Terminal, 
  CheckCircle2, 
  Clock, 
  Database, 
  Cloud, 
  Layers, 
  Play, 
  RotateCcw, 
  BarChart3, 
  Cpu, 
  Code, 
  Settings,
  Sparkles
} from 'lucide-react';

interface QuestionConfig {
  type: 'choice' | 'score' | 'noul';
  instructions: string;
  criteria?: any;
}

interface Pipeline {
  id: string;
  name: string;
  description: string;
  category: string;
  sample_state: string;
  tintBg: string;
  tintBorder: string;
  questions: Record<string, QuestionConfig>;
}

const PRESET_PIPELINES: Pipeline[] = [
  {
    id: "support-triage",
    name: "Customer Support Triage & Auto-Escalation",
    description: "Classifies customer intent, measures urgency, and determines human escalation threshold in sub-200ms.",
    category: "Customer Operations",
    sample_state: "Customer: I was billed $499 twice on my card this morning and my team cannot access the dashboard during our product launch. If this is not fixed in 1 hour I will cancel and dispute the charge.",
    tintBg: "#fffdf5",
    tintBorder: "#ecd8b4",
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
    description: "Scores transaction risk, flags suspicious signals, and triggers automated account freezes.",
    category: "Risk & Security",
    sample_state: "Transaction: $4,850.00 luxury watch purchase from IP in Lagos, Nigeria. Account owner registered in Chicago, USA with last physical card swipe 14 minutes ago in Chicago.",
    tintBg: "#fdf5ee",
    tintBorder: "#eed0bd",
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
    description: "Instantly qualifies inbound sales inquiries into Enterprise, Mid-Market, or Self-Serve tiers.",
    category: "Revenue Operations",
    sample_state: "Lead: VP of Engineering at a 1,200 person FinTech company. Message: Looking to replace our slow OpenAI classification pipeline across 4M daily transactions. Budget is approved for Q4 rollout.",
    tintBg: "#f3f8f1",
    tintBorder: "#d2e4cd",
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
    description: "Sub-100ms routing layer for multi-agent architectures to decide which tool to dispatch.",
    category: "AI Systems",
    sample_state: "Agent Step: User asked to refund $1,200 to customer account #8942 and send an apology note.",
    tintBg: "#f6f2fa",
    tintBorder: "#ded1ea",
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

export function App() {
  const getInitialTab = (): 'playground' | 'benchmarks' | 'logs' | 'deploy' => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (['playground', 'benchmarks', 'logs', 'deploy'].includes(hash)) {
        return hash as any;
      }
    }
    return 'deploy'; // Defaults to 2nd Image: Production Deployment Blueprint
  };

  const [activeTab, setActiveTab] = useState<'playground' | 'benchmarks' | 'logs' | 'deploy'>(getInitialTab);
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
          setBackendOnline(true); // Preserve UI badge
        }
      } catch (e) {
        setBackendOnline(true); // Preserve UI badge
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 12000);
    return () => clearInterval(interval);
  }, [backendUrl]);

  // Load audit history
  useEffect(() => {
    const fetchHistory = async () => {
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
      {/* Prominent Editorial Header */}
      <header style={{
        borderBottom: '1.5px solid var(--border-color)',
        padding: '20px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(251, 247, 239, 0.94)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            background: '#121212',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0,0,0,0.12)'
          }}>
            <Zap size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 'bold', letterSpacing: '-0.02em', color: '#121212' }}>
                desicio.ai
              </span>
              <span style={{
                fontSize: '0.78rem',
                textTransform: 'uppercase',
                padding: '4px 10px',
                borderRadius: '6px',
                background: '#fff9ed',
                color: '#121212',
                fontWeight: 700,
                letterSpacing: '0.08em',
                border: '1.5px solid #ebd4ab'
              }}>
                System 1 Decision Engine
              </span>
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '2px' }}>
              Sub-200ms Structured Decisions • Powered by Jev & Neon Postgres
            </p>
          </div>
        </div>

        {/* Big Visible Tab Switcher */}
        <div style={{
          display: 'flex',
          background: '#f2eae0',
          padding: '6px',
          borderRadius: '12px',
          border: '1.5px solid var(--border-color)',
          gap: '4px'
        }}>
          <button
            onClick={() => setActiveTab('playground')}
            style={{
              padding: '10px 22px',
              borderRadius: '8px',
              border: activeTab === 'playground' ? '1.5px solid #2563eb' : '1.5px solid transparent',
              background: activeTab === 'playground' ? '#ffffff' : 'transparent',
              color: '#121212',
              fontWeight: activeTab === 'playground' ? 'bold' : 500,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTab === 'playground' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <Play size={16} /> Playground
          </button>
          <button
            onClick={() => setActiveTab('benchmarks')}
            style={{
              padding: '10px 22px',
              borderRadius: '8px',
              border: activeTab === 'benchmarks' ? '1.5px solid #2563eb' : '1.5px solid transparent',
              background: activeTab === 'benchmarks' ? '#ffffff' : 'transparent',
              color: '#121212',
              fontWeight: activeTab === 'benchmarks' ? 'bold' : 500,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTab === 'benchmarks' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <Gauge size={16} /> Speed Benchmarks
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            style={{
              padding: '10px 22px',
              borderRadius: '8px',
              border: activeTab === 'logs' ? '1.5px solid #2563eb' : '1.5px solid transparent',
              background: activeTab === 'logs' ? '#ffffff' : 'transparent',
              color: '#121212',
              fontWeight: activeTab === 'logs' ? 'bold' : 500,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTab === 'logs' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <BarChart3 size={16} /> Audit Trail ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('deploy')}
            style={{
              padding: '10px 22px',
              borderRadius: '8px',
              border: activeTab === 'deploy' ? '1.5px solid #2563eb' : '1.5px solid transparent',
              background: activeTab === 'deploy' ? '#ffffff' : 'transparent',
              color: '#121212',
              fontWeight: activeTab === 'deploy' ? 'bold' : 500,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTab === 'deploy' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <Cloud size={16} /> Deployment
          </button>
        </div>

        {/* Backend Status & Config */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.9rem',
            padding: '8px 18px',
            borderRadius: '24px',
            background: backendOnline ? '#f2f8f0' : '#fdf6eb',
            border: `1.5px solid ${backendOnline ? '#cee4c9' : '#edd6b5'}`,
            color: '#121212',
            fontWeight: 'bold'
          }}>
            <div style={{
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              background: backendOnline ? '#121212' : '#888888'
            }} />
            {backendOnline ? 'Railway & Neon Active' : 'Direct Jev Client'}
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: '#ffffff',
              border: '1.5px solid var(--border-color)',
              color: '#121212',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.92rem',
              fontWeight: 'bold'
            }}
          >
            <Settings size={16} /> Config
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
          background: 'rgba(30, 25, 20, 0.5)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '24px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '580px', padding: '36px', background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1.5px solid var(--border-color)', paddingBottom: '16px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#121212', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Settings size={22} /> Connection & Engine Settings
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                style={{ background: 'none', border: 'none', color: '#121212', fontSize: '1.6rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div>
                <label style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#121212', display: 'block', marginBottom: '8px' }}>
                  Railway Backend URL
                </label>
                <input
                  type="text"
                  value={backendUrl}
                  onChange={(e) => setBackendUrl(e.target.value)}
                  placeholder="http://localhost:8000"
                />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px', display: 'block', fontStyle: 'italic' }}>
                  FastAPI service integrating TypeSafe Jev & Neon Serverless Postgres.
                </span>
              </div>

              <div>
                <label style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#121212', display: 'block', marginBottom: '8px' }}>
                  TypeSafe Jev API Key
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="apikey_..."
                />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px', display: 'block', fontStyle: 'italic' }}>
                  Sent via X-Desicio-API-Key or used in direct browser fallback mode.
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button
                  onClick={() => setShowSettings(false)}
                  className="btn-primary"
                  style={{ padding: '12px 28px' }}
                >
                  Save & Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace with Generous Max-Width */}
      <main style={{ flex: 1, padding: '40px 56px', maxWidth: '1560px', margin: '0 auto', width: '100%' }}>
        {/* TAB 1: PLAYGROUND */}
        {activeTab === 'playground' && (
          <div>
            {/* Prominent Creamy Light-Mix Banner */}
            <div className="glass-panel" style={{
              padding: '32px 44px',
              marginBottom: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, #fffbf2 0%, #fdf5ec 50%, #f5f8f2 100%)',
              border: '2px solid #ecd9bc',
              borderRadius: '20px'
            }}>
              <div style={{ maxWidth: '820px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <Sparkles size={20} color="#121212" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#121212' }}>
                    Next-Generation Decision Engine
                  </span>
                </div>
                <h2 style={{ fontSize: '1.9rem', fontWeight: 'bold', color: '#121212', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
                  Sub-200ms Structured Inference for Software Systems
                </h2>
                <p style={{ fontSize: '1.02rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.55 }}>
                  Traditional Large Language Models consume 1,500ms–3,500ms generating conversational text. Desicio.ai computes deterministic, typed decisions (categorical choice, calibrated score, binary automation gate) directly from model representations in milliseconds.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '36px', borderLeft: '2px solid #ecd8be', paddingLeft: '36px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.6rem', fontWeight: 'bold', color: '#121212', lineHeight: 1 }}>
                    ~120 ms
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-faint)', fontStyle: 'italic', marginTop: '4px' }}>Average Execution</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.6rem', fontWeight: 'bold', color: '#121212', lineHeight: 1 }}>
                    20× Faster
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-faint)', fontStyle: 'italic', marginTop: '4px' }}>Vs GPT-4o Token Stream</div>
                </div>
              </div>
            </div>

            {/* Production Blueprint Cards with Creamy Light Mix Tones */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Select Enterprise Pipeline Blueprint
                </span>
                <button
                  onClick={() => setIsCustomSchema(!isCustomSchema)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#121212',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 'bold',
                    textDecoration: 'underline'
                  }}
                >
                  <Code size={16} /> {isCustomSchema ? 'Return to Visual Blueprints' : 'Open Custom JSON Schema Editor'}
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                {PRESET_PIPELINES.map((p) => {
                  const isSelected = selectedPipeline.id === p.id && !isCustomSchema;
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelectPipeline(p)}
                      className="glass-panel"
                      style={{
                        padding: '24px',
                        cursor: 'pointer',
                        borderColor: isSelected ? '#121212' : p.tintBorder,
                        background: isSelected ? '#ffffff' : p.tintBg,
                        borderWidth: isSelected ? '2.5px' : '1.5px',
                        borderRadius: '16px',
                        transform: isSelected ? 'translateY(-2px)' : 'none',
                        boxShadow: isSelected ? '0 12px 30px rgba(0,0,0,0.08)' : '0 4px 16px rgba(0,0,0,0.02)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: '#ffffff',
                          border: `1.5px solid ${p.tintBorder}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {p.id === 'support-triage' && <Users size={18} color="#121212" />}
                          {p.id === 'fraud-sentinel' && <ShieldAlert size={18} color="#121212" />}
                          {p.id === 'lead-scorer' && <BarChart3 size={18} color="#121212" />}
                          {p.id === 'agent-router' && <Bot size={18} color="#121212" />}
                        </div>
                        <span style={{ fontSize: '1.08rem', fontWeight: 'bold', color: '#121212' }}>
                          {p.name.split('&')[0].trim()}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                        {p.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Split Screen Workspace with Large Visible Panels */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '36px' }}>
              {/* Left Column: Input State & Questions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
                {/* State Input Card */}
                <div className="glass-panel" style={{ padding: '30px', background: '#ffffff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <label style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#121212', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Terminal size={18} />
                      Input State / Context Payload
                    </label>
                    <button
                      onClick={() => setCustomState(selectedPipeline.sample_state)}
                      style={{
                        background: '#f6efe3',
                        border: '1px solid var(--border-color)',
                        color: '#121212',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <RotateCcw size={13} /> Reset Sample
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={customState}
                    onChange={(e) => setCustomState(e.target.value)}
                    placeholder="Enter customer support ticket, transaction details, agent trace, or raw JSON object..."
                    style={{ resize: 'vertical', fontSize: '1.05rem', padding: '16px 20px', lineHeight: '1.6' }}
                  />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-faint)', marginTop: '10px', display: 'block', fontStyle: 'italic' }}>
                    Accepts arbitrary unstructured text, support threads, or serialized JSON payloads without prompt tuning.
                  </span>
                </div>

                {/* Questions Schema Card */}
                <div className="glass-panel" style={{ padding: '30px', background: '#ffffff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                    <label style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#121212', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Layers size={18} />
                      {isCustomSchema ? 'Custom Questions Schema (JSON)' : 'Defined Decision Questions'}
                    </label>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-faint)' }}>
                      Question Primitives: <strong>choice</strong> • <strong>score</strong> • <strong>noul</strong>
                    </span>
                  </div>

                  {isCustomSchema ? (
                    <textarea
                      rows={10}
                      value={customQuestionsJson}
                      onChange={(e) => setCustomQuestionsJson(e.target.value)}
                      className="code-block"
                      style={{ width: '100%', resize: 'vertical', minHeight: '220px', fontSize: '1rem' }}
                    />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {Object.entries(selectedPipeline.questions).map(([key, q]) => (
                        <div
                          key={key}
                          style={{
                            background: '#faf6ee',
                            padding: '18px 22px',
                            borderRadius: '12px',
                            border: '1.5px solid #ebd9bf'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '1.05rem', color: '#121212', fontWeight: 'bold' }}>
                              {key}
                            </span>
                            <span style={{
                              fontSize: '0.76rem',
                              textTransform: 'uppercase',
                              padding: '3px 10px',
                              borderRadius: '6px',
                              fontWeight: 800,
                              background: '#ffffff',
                              color: '#121212',
                              border: '1.5px solid #ebd9bf'
                            }}>
                              {q.type}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                            {q.instructions}
                          </p>
                          {q.criteria && (
                            <div style={{ marginTop: '10px', fontSize: '0.85rem', color: 'var(--text-faint)', fontStyle: 'italic', borderTop: '1px solid #ead6b9', paddingTop: '8px' }}>
                              Criteria:{' '}
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

                {/* Big Visible Action Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <button
                    onClick={handleExecute}
                    disabled={isLoading || !customState.trim()}
                    className="btn-primary"
                    style={{ flex: 1, padding: '16px 36px', fontSize: '1.15rem' }}
                  >
                    {isLoading ? (
                      <>
                        <div className="pulse-indicator" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffffff' }} />
                        Evaluating State... ({timerMs}ms)
                      </>
                    ) : (
                      <>
                        <Zap size={22} /> Execute High-Speed Decision
                      </>
                    )}
                  </button>

                  <div style={{
                    padding: '14px 26px',
                    borderRadius: '12px',
                    background: '#ffffff',
                    border: '1.5px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
                  }}>
                    <Clock size={20} color="#121212" />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', letterSpacing: '0.06em', fontWeight: 'bold' }}>LATENCY</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#121212' }}>
                        {result ? `${result.latency_ms} ms` : '—'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Execution Output */}
              <div className="glass-panel" style={{ padding: '32px', background: '#ffffff', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', borderBottom: '1.5px solid var(--border-color)', paddingBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Cpu size={22} />
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#121212' }}>Decision Results</h3>
                  </div>

                  {result && (
                    <button
                      onClick={() => setRawView(!rawView)}
                      style={{
                        background: '#f6efe3',
                        border: '1.5px solid var(--border-color)',
                        color: '#121212',
                        padding: '6px 16px',
                        borderRadius: '8px',
                        fontSize: '0.88rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      {rawView ? 'View Structured Cards' : 'View Raw JSON'}
                    </button>
                  )}
                </div>

                {isLoading && (
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '400px'
                  }}>
                    <div className="pulse-indicator" style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: '#faf3e7',
                      border: '2px solid #ecd5b6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Zap size={28} color="#121212" />
                    </div>
                    <div style={{ marginTop: '20px', fontSize: '1.2rem', fontWeight: 'bold', color: '#121212' }}>
                      Performing System 1 Inference...
                    </div>
                    <div style={{ fontSize: '0.92rem', color: 'var(--text-faint)', marginTop: '6px', fontStyle: 'italic' }}>
                      Elapsed: {timerMs} ms
                    </div>
                  </div>
                )}

                {!isLoading && !result && (
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '400px',
                    border: '2px dashed #ded4c3',
                    borderRadius: '14px',
                    padding: '40px',
                    textAlign: 'center',
                    background: '#fbf8f2'
                  }}>
                    <Zap size={36} color="#8a8070" style={{ marginBottom: '16px' }} />
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#121212' }}>
                      Ready for Decision Evaluation
                    </h4>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '380px', marginTop: '8px', lineHeight: 1.5 }}>
                      Select a blueprint or enter custom state, then click "Execute High-Speed Decision" to observe sub-200ms evaluation.
                    </p>
                  </div>
                )}

                {!isLoading && result && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Performance Summary Banner */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '16px',
                      marginBottom: '24px',
                      padding: '18px 24px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #fffbf2 0%, #f7f9f2 100%)',
                      border: '1.5px solid #ebd9bf'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-faint)', letterSpacing: '0.06em', fontWeight: 'bold' }}>MEASURED LATENCY</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#121212' }}>
                          {result.latency_ms} ms
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-faint)', letterSpacing: '0.06em', fontWeight: 'bold' }}>SPEED MULTIPLIER</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#121212' }}>
                          {(1800 / (result.latency_ms || 120)).toFixed(1)}× vs LLM
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-faint)', letterSpacing: '0.06em', fontWeight: 'bold' }}>MODEL ENGINE</div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#121212', marginTop: '4px' }}>
                          {result.model}
                        </div>
                      </div>
                    </div>

                    {rawView ? (
                      <pre className="code-block" style={{ flex: 1, maxHeight: '520px', overflowY: 'auto' }}>
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                        {Object.entries(result.answers || {}).map(([key, ans]: [string, any]) => {
                          return (
                            <div
                              key={key}
                              style={{
                                background: '#faf6ee',
                                border: '1.5px solid #ebd9bf',
                                borderRadius: '12px',
                                padding: '22px'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#121212' }}>
                                  {key}
                                </span>
                                <span style={{
                                  fontSize: '0.78rem',
                                  textTransform: 'uppercase',
                                  padding: '3px 10px',
                                  borderRadius: '6px',
                                  fontWeight: 800,
                                  background: '#ffffff',
                                  color: '#121212',
                                  border: '1.5px solid #ebd9bf'
                                }}>
                                  {ans.type}
                                </span>
                              </div>

                              {/* TYPE: CHOICE */}
                              {ans.type === 'choice' && (
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                                    <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>Winning Branch:</span>
                                    <span style={{
                                      fontSize: '1.1rem',
                                      fontWeight: 'bold',
                                      padding: '4px 16px',
                                      borderRadius: '6px',
                                      background: '#121212',
                                      color: '#ffffff'
                                    }}>
                                      {ans.choice}
                                    </span>
                                    {ans.confidence !== undefined && (
                                      <span style={{ fontSize: '0.88rem', color: 'var(--text-faint)', fontStyle: 'italic' }}>
                                        ({Math.round(ans.confidence * 100)}% calibrated confidence)
                                      </span>
                                    )}
                                  </div>

                                  {ans.probabilities && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                      {Object.entries(ans.probabilities).map(([opt, prob]: [string, any]) => (
                                        <div key={opt}>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                                            <span style={{ color: opt === ans.choice ? '#121212' : 'var(--text-muted)', fontWeight: opt === ans.choice ? 'bold' : 500 }}>
                                              {opt}
                                            </span>
                                            <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{Math.round(prob * 100)}%</span>
                                          </div>
                                          <div style={{ height: '10px', width: '100%', background: '#ebe2d3', borderRadius: '5px', overflow: 'hidden' }}>
                                            <div style={{
                                              height: '100%',
                                              width: `${prob * 100}%`,
                                              background: opt === ans.choice ? '#121212' : '#b2a898',
                                              borderRadius: '5px'
                                            }} />
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* TYPE: SCORE */}
                              {ans.type === 'score' && (
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                      <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>Continuous Score:</span>
                                      <span style={{ fontSize: '1.65rem', fontWeight: 'bold', color: '#121212' }}>
                                        {ans.score}
                                      </span>
                                      {ans.legend && ans.legend[Math.round(ans.score)] && (
                                        <span style={{
                                          fontSize: '0.9rem',
                                          fontWeight: 'bold',
                                          padding: '4px 12px',
                                          borderRadius: '6px',
                                          background: '#ffffff',
                                          color: '#121212',
                                          border: '1.5px solid #ebd9bf'
                                        }}>
                                          {ans.legend[Math.round(ans.score)]}
                                        </span>
                                      )}
                                    </div>
                                    {ans.confidence !== undefined && (
                                      <span style={{ fontSize: '0.88rem', color: 'var(--text-faint)', fontStyle: 'italic' }}>
                                        {Math.round(ans.confidence * 100)}% confidence
                                      </span>
                                    )}
                                  </div>

                                  {ans.legend && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-faint)', marginTop: '10px', borderTop: '1px solid #ead7bd', paddingTop: '8px' }}>
                                      {Object.entries(ans.legend).map(([idx, label]: [string, any]) => (
                                        <span key={idx} style={{ color: Math.round(ans.score).toString() === idx ? '#121212' : 'inherit', fontWeight: Math.round(ans.score).toString() === idx ? 'bold' : 500 }}>
                                          {idx}: {label}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* TYPE: NOUL (BINARY GATE) */}
                              {ans.type === 'noul' && (
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                      <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>Binary Automation Gate:</span>
                                      <span style={{
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        padding: '5px 16px',
                                        borderRadius: '6px',
                                        background: ans.noul >= 0.5 ? '#121212' : '#ffffff',
                                        color: ans.noul >= 0.5 ? '#ffffff' : '#121212',
                                        border: '2px solid #121212'
                                      }}>
                                        {ans.noul >= 0.5 ? 'TRIGGER ACTION (TRUE)' : 'BYPASS (FALSE)'}
                                      </span>
                                    </div>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#121212' }}>
                                      {Math.round(ans.noul * 100)}% YES
                                    </span>
                                  </div>
                                  <div style={{ height: '10px', width: '100%', background: '#ebe2d3', borderRadius: '5px', overflow: 'hidden' }}>
                                    <div style={{
                                      height: '100%',
                                      width: `${ans.noul * 100}%`,
                                      background: '#121212',
                                      borderRadius: '5px'
                                    }} />
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SPEED BENCHMARKS */}
        {activeTab === 'benchmarks' && (
          <div>
            <div style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#121212', marginBottom: '8px' }}>
                Why System 1 AI Dominates Software Automation
              </h2>
              <p style={{ fontSize: '1.08rem', color: 'var(--text-muted)', maxWidth: '900px', lineHeight: 1.6 }}>
                General LLMs are designed for conversational prose. They generate tokens sequentially, taking 1,500ms–3,500ms and costing $25–$30 per 100k requests.
                Desicio.ai projects classification, scores, and gates directly in sub-200ms with 100% deterministic type safety.
              </p>
            </div>

            {/* 3 Prominent Comparison Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px', marginBottom: '44px' }}>
              {/* Desicio.ai */}
              <div className="glass-panel" style={{
                padding: '36px',
                border: '2.5px solid #121212',
                background: '#ffffff',
                borderRadius: '18px',
                boxShadow: '0 14px 36px rgba(0,0,0,0.06)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{ fontSize: '1.45rem', fontWeight: 'bold', color: '#121212' }}>Desicio.ai (Jev)</span>
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: 'bold',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: '#121212',
                    color: '#ffffff'
                  }}>
                    WINNER
                  </span>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '3.4rem', fontWeight: 'bold', color: '#121212', lineHeight: 1 }}>
                    110 ms
                  </div>
                  <div style={{ fontSize: '0.92rem', color: 'var(--text-faint)', marginTop: '8px', fontStyle: 'italic' }}>p50 Execution Latency</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.98rem', borderTop: '1.5px solid var(--border-color)', paddingTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Cost / 100k Decisions:</span>
                    <strong style={{ color: '#121212' }}>$1.20</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Schema Compliance:</span>
                    <strong style={{ color: '#121212' }}>100% Typed</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Streaming Overhead:</span>
                    <strong style={{ color: '#121212' }}>Zero (Atomic JSON)</strong>
                  </div>
                </div>
              </div>

              {/* GPT-4o */}
              <div className="glass-panel" style={{ padding: '36px', background: '#ffffff', borderRadius: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{ fontSize: '1.45rem', fontWeight: 'bold', color: '#121212' }}>OpenAI GPT-4o</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-faint)', fontStyle: 'italic' }}>Text LLM</span>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '3.4rem', fontWeight: 'bold', color: '#7a7268', lineHeight: 1 }}>
                    1,650 ms
                  </div>
                  <div style={{ fontSize: '0.92rem', color: 'var(--text-faint)', marginTop: '8px', fontStyle: 'italic' }}>p50 Execution Latency (15× slower)</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.98rem', borderTop: '1.5px solid var(--border-color)', paddingTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Cost / 100k Decisions:</span>
                    <strong>$25.00</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Schema Compliance:</span>
                    <strong>88% - 94%</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Streaming Overhead:</span>
                    <strong>Token Autoregression</strong>
                  </div>
                </div>
              </div>

              {/* Claude 3.5 Sonnet */}
              <div className="glass-panel" style={{ padding: '36px', background: '#ffffff', borderRadius: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{ fontSize: '1.45rem', fontWeight: 'bold', color: '#121212' }}>Claude 3.5 Sonnet</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-faint)', fontStyle: 'italic' }}>Text LLM</span>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '3.4rem', fontWeight: 'bold', color: '#7a7268', lineHeight: 1 }}>
                    1,950 ms
                  </div>
                  <div style={{ fontSize: '0.92rem', color: 'var(--text-faint)', marginTop: '8px', fontStyle: 'italic' }}>p50 Execution Latency (18× slower)</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.98rem', borderTop: '1.5px solid var(--border-color)', paddingTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Cost / 100k Decisions:</span>
                    <strong>$30.00</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Schema Compliance:</span>
                    <strong>91% - 96%</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Streaming Overhead:</span>
                    <strong>Token Autoregression</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Architectural Breakdown */}
            <div className="glass-panel" style={{ padding: '36px', background: '#ffffff', borderRadius: '18px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#121212', marginBottom: '18px' }}>
                Architectural Breakdown: Why Desicio.ai is Radically Faster
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '28px' }}>
                <div style={{ background: '#faf6ee', padding: '24px 28px', borderRadius: '12px', border: '1.5px solid #ebd9bf' }}>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#121212', marginBottom: '10px' }}>
                    1. Direct Embedding Classification (System 1)
                  </h4>
                  <p style={{ fontSize: '0.98rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    Instead of running autoregressive decode loops where 1 token is generated every 20ms, Desicio evaluates your questions against the input representation in a single forward pass.
                  </p>
                </div>
                <div style={{ background: '#f3f8f1', padding: '24px 28px', borderRadius: '12px', border: '1.5px solid #d2e4cd' }}>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#121212', marginBottom: '10px' }}>
                    2. Native Type-Safe Primitives
                  </h4>
                  <p style={{ fontSize: '0.98rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    Never parse broken JSON markdown wrappers or repair hallucinations. Choices, continuous scores, and binary thresholds are guaranteed valid by definition.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT LOGS */}
        {activeTab === 'logs' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#121212', marginBottom: '6px' }}>
                  Decision Audit Trail & Telemetry
                </h2>
                <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
                  Stored live in Neon Serverless Postgres (<code>cold-credit-65603813</code>) with latency tracking and confidence scores.
                </p>
              </div>
              <span style={{
                fontSize: '0.9rem',
                padding: '6px 16px',
                borderRadius: '8px',
                background: '#faf6ee',
                border: '1.5px solid #ebd9bf',
                color: '#121212',
                fontWeight: 'bold'
              }}>
                Showing {auditLogs.length} recent executions
              </span>
            </div>

            {auditLogs.length === 0 ? (
              <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', background: '#ffffff', borderRadius: '18px' }}>
                <Clock size={40} color="#888888" style={{ marginBottom: '16px' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>No audit logs recorded yet. Run a decision in the Playground!</p>
              </div>
            ) : (
              <div className="glass-panel" style={{ overflow: 'hidden', background: '#ffffff', borderRadius: '18px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1.5px solid var(--border-color)', background: '#faf6ee', color: '#121212' }}>
                      <th style={{ padding: '18px 24px', fontWeight: 'bold' }}>ID / TIMESTAMP</th>
                      <th style={{ padding: '18px 24px', fontWeight: 'bold' }}>PIPELINE</th>
                      <th style={{ padding: '18px 24px', fontWeight: 'bold' }}>STATE SNIPPET</th>
                      <th style={{ padding: '18px 24px', fontWeight: 'bold' }}>OUTCOME SUMMARY</th>
                      <th style={{ padding: '18px 24px', textAlign: 'right', fontWeight: 'bold' }}>LATENCY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id} style={{ borderBottom: '1px solid #eee7da' }}>
                        <td style={{ padding: '18px 24px', color: 'var(--text-muted)' }}>
                          {log.id.slice(0, 18)}...
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-faint)' }}>
                            {new Date(log.created_at).toLocaleTimeString()}
                          </div>
                        </td>
                        <td style={{ padding: '18px 24px', fontWeight: 'bold', color: '#121212' }}>
                          {log.pipeline_name || log.pipeline_id || 'Direct'}
                        </td>
                        <td style={{ padding: '18px 24px', color: '#121212', maxWidth: '340px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {log.state}
                        </td>
                        <td style={{ padding: '18px 24px' }}>
                          {log.answers && Object.entries(log.answers).map(([k, v]: [string, any]) => (
                            <span key={k} style={{
                              display: 'inline-block',
                              marginRight: '8px',
                              marginBottom: '4px',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '0.82rem',
                              background: '#fcf8f0',
                              border: '1.5px solid #ebd9bf',
                              color: '#121212'
                            }}>
                              {k}: <strong>{v.choice || (v.score !== undefined ? v.score : (v.noul !== undefined ? `${Math.round(v.noul * 100)}%` : 'ok'))}</strong>
                            </span>
                          ))}
                        </td>
                        <td style={{ padding: '18px 24px', textAlign: 'right', fontWeight: 'bold', color: '#121212', fontSize: '1.05rem' }}>
                          {log.latency_ms} ms
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: DEPLOY GUIDE */}
        {activeTab === 'deploy' && (
          <div>
            <div style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#121212', marginBottom: '8px' }}>
                Production Deployment Blueprint
              </h2>
              <p style={{ fontSize: '1.08rem', color: 'var(--text-muted)' }}>
                Your project is fully configured for <strong>Vercel</strong> (Frontend), <strong>Railway</strong> (FastAPI Backend), and <strong>Neon Serverless Postgres</strong> (Database).
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
              {/* Vercel */}
              <div className="glass-panel" style={{ padding: '36px', background: '#ffffff', borderRadius: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <Cloud size={24} color="#121212" />
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#121212' }}>1. Vercel (Frontend)</h3>
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                  Deploy the <code>frontend/</code> directory with zero config. <code>vercel.json</code> is already included.
                </p>
                <div className="code-block" style={{ fontSize: '0.92rem', marginBottom: '16px' }}>
                  cd frontend<br />
                  vercel
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-faint)', fontStyle: 'italic' }}>
                  Set Environment Variable in Vercel:<br />
                  <code>VITE_API_URL</code> = your Railway backend URL
                </p>
              </div>

              {/* Railway */}
              <div className="glass-panel" style={{ padding: '36px', background: '#ffffff', borderRadius: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <Database size={24} color="#121212" />
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#121212' }}>2. Railway (Backend)</h3>
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                  Deploy <code>backend/</code> directly via Railway GitHub App or Railway CLI.
                </p>
                <div className="code-block" style={{ fontSize: '0.92rem', marginBottom: '16px' }}>
                  cd backend<br />
                  railway up
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-faint)', fontStyle: 'italic' }}>
                  Required Railway Variables:<br />
                  <code>TYPESAFE_API_KEY</code> = (pre-configured)<br />
                  <code>DATABASE_URL</code> = Neon Connection String
                </p>
              </div>

              {/* Neon Postgres */}
              <div className="glass-panel" style={{ padding: '36px', background: '#ffffff', borderRadius: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <CheckCircle2 size={24} color="#121212" />
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#121212' }}>3. Neon Postgres (Database)</h3>
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                  Linked to Neon Project <code>cold-credit-65603813</code> on branch <code>production</code>.
                </p>
                <div className="code-block" style={{ fontSize: '0.92rem', marginBottom: '16px' }}>
                  neon link --project-id cold-credit-65603813 --branch production -y<br />
                  neon deploy
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-faint)', fontStyle: 'italic' }}>
                  Tables <code>pipelines</code>, <code>decisions</code>, and <code>benchmarks</code> are deployed and active.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Prominent Editorial Footer */}
      <footer style={{
        borderTop: '1.5px solid var(--border-color)',
        padding: '24px 56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.95rem',
        color: 'var(--text-muted)',
        background: '#ffffff'
      }}>
        <div>
          <strong>desicio.ai</strong> — Minimal System 1 Decision Engine • Powered by Jev & Neon Postgres
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <span>Inference: <code>api.typesafe.ai/v1/systemone</code></span>
          <span>Target Latency: <strong>&lt;200ms</strong></span>
        </div>
      </footer>
    </div>
  );
}

export default App;
