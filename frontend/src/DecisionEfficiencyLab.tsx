import React, { useState, useEffect, useRef } from 'react';
import './DecisionEfficiencyLab.css';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Info, 
  CheckCircle2, 
  TrendingUp, 
  Cpu, 
  Layers 
} from 'lucide-react';

export interface ModelBenchmarkData {
  id: string;
  displayName: string;
  provider: string;
  modelVersion: string;
  dataStatus: string;
  medianLatencyMs: number;
  p95LatencyMs: number;
  costPer1000CompletedTasksUsd: number;
  sampleSize: number;
  qualityMetricName: string;
  qualityMetricValue: string;
  workloadDescription: string;
  notes: string;
}

// Benchmark dataset (Section 8: explicit illustrative demonstration dataset)
export const DEMO_BENCHMARK_MODELS: ModelBenchmarkData[] = [
  {
    id: 'decision-engine',
    displayName: 'Decision engine — demo (Desicio.ai)',
    provider: 'Desicio.ai System 1',
    modelVersion: 'v1.0 (illustrative)',
    dataStatus: 'Illustrative demo',
    medianLatencyMs: 400,
    p95LatencyMs: 520,
    costPer1000CompletedTasksUsd: 0.40,
    sampleSize: 500,
    qualityMetricName: 'Calibrated Semantic Accuracy',
    qualityMetricValue: '99.2% (Schema validated)',
    workloadDescription: 'Single-turn typed decision with calibrated certainty',
    notes: 'Parallel non-autoregressive judgment over bounded JSON schema.'
  },
  {
    id: 'lightweight-model',
    displayName: 'Lightweight model — demo',
    provider: 'Small Language Model',
    modelVersion: 'slm-7b-instruct',
    dataStatus: 'Illustrative demo',
    medianLatencyMs: 1200,
    p95LatencyMs: 1850,
    costPer1000CompletedTasksUsd: 1.60,
    sampleSize: 500,
    qualityMetricName: 'Classification Accuracy',
    qualityMetricValue: '91.5%',
    workloadDescription: 'Concise few-shot text categorization prompt',
    notes: 'Quantized local/edge model running single inference thread.'
  },
  {
    id: 'small-text-model',
    displayName: 'Small text model — demo',
    provider: 'Cloud LLM Small',
    modelVersion: 'cloud-small-v2',
    dataStatus: 'Illustrative demo',
    medianLatencyMs: 2400,
    p95LatencyMs: 3600,
    costPer1000CompletedTasksUsd: 3.20,
    sampleSize: 500,
    qualityMetricName: 'Structured Extraction Rate',
    qualityMetricValue: '94.8%',
    workloadDescription: 'JSON mode extraction over customer message',
    notes: 'Hosted API with moderate token output generation.'
  },
  {
    id: 'reasoning-model',
    displayName: 'Reasoning model — demo',
    provider: 'Reasoning Frontier',
    modelVersion: 'r-thinker-v1',
    dataStatus: 'Illustrative demo',
    medianLatencyMs: 6000,
    p95LatencyMs: 9400,
    costPer1000CompletedTasksUsd: 18.00,
    sampleSize: 500,
    qualityMetricName: 'Multi-Step Veracity',
    qualityMetricValue: '97.8%',
    workloadDescription: 'Chain-of-thought verification prior to decision',
    notes: 'Generates internal hidden thinking tokens causing latency overhead.'
  },
  {
    id: 'general-text-model',
    displayName: 'General text model — demo (Baseline)',
    provider: 'General Frontier Chat',
    modelVersion: 'gpt-chat-standard',
    dataStatus: 'Illustrative demo',
    medianLatencyMs: 12000,
    p95LatencyMs: 16800,
    costPer1000CompletedTasksUsd: 12.00,
    sampleSize: 500,
    qualityMetricName: 'Open-ended Coherence',
    qualityMetricValue: '96.0%',
    workloadDescription: 'Standard conversational prompt with markdown formatting',
    notes: 'High latency due to verbose string generation and network streaming.'
  }
];

export const DecisionEfficiencyLab: React.FC = () => {
  // Baseline selection for relative speed calculation (Section 6)
  const [baselineId, setBaselineId] = useState<string>('general-text-model');
  const baselineModel = DEMO_BENCHMARK_MODELS.find(m => m.id === baselineId) || DEMO_BENCHMARK_MODELS[4];

  // Animation controller (Section 7)
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [animProgress, setAnimProgress] = useState<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const animStartTimeRef = useRef<number | null>(null);

  // Methodology collapsible state (Section 12)
  const [showMethodology, setShowMethodology] = useState<boolean>(false);

  // Workload cost calculator state (Section 9)
  const [calcTaskCount, setCalcTaskCount] = useState<number>(10000);
  const [calcSelectedId, setCalcSelectedId] = useState<string>('decision-engine');
  const [calcBaselineId, setCalcBaselineId] = useState<string>('general-text-model');

  // Animation timing loop: Normalized to longest model (12000ms -> 12s, or normalized visually)
  const MAX_RUN_TIME = 10000; // 10 seconds total run time

  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const step = (timestamp: number) => {
      if (!animStartTimeRef.current) animStartTimeRef.current = timestamp;
      const elapsed = timestamp - animStartTimeRef.current;
      const prog = Math.min(1, elapsed / MAX_RUN_TIME);
      setAnimProgress(prog);

      if (prog < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setIsPlaying(false);
      }
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  const handleReplay = () => {
    animStartTimeRef.current = null;
    setAnimProgress(0);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    if (animProgress >= 1) {
      handleReplay();
    } else {
      setIsPlaying(!isPlaying);
      if (!isPlaying) {
        animStartTimeRef.current = performance.now() - (animProgress * MAX_RUN_TIME);
      }
    }
  };

  // Calculator calculations (Section 9)
  const calcSelectedModel = DEMO_BENCHMARK_MODELS.find(m => m.id === calcSelectedId) || DEMO_BENCHMARK_MODELS[0];
  const calcBaseModel = DEMO_BENCHMARK_MODELS.find(m => m.id === calcBaselineId) || DEMO_BENCHMARK_MODELS[4];

  const estimatedCost = (calcTaskCount / 1000) * calcSelectedModel.costPer1000CompletedTasksUsd;
  const baselineCost = (calcTaskCount / 1000) * calcBaseModel.costPer1000CompletedTasksUsd;
  const costDiff = baselineCost - estimatedCost;
  const pctSavings = baselineCost > 0 ? (costDiff / baselineCost) * 100 : 0;

  return (
    <section className="lab-section-root" id="efficiency-lab">
      
      {/* 3A. INTRODUCTORY HEADING & STAT BANNER */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <span className="lab-badge lab-badge-illustrative">Illustrative Demo</span>
          <span className="lab-badge">Decision Efficiency Lab 1.0</span>
          <span className="lab-badge lab-badge-accent">Calibrated Sub-200ms Inference</span>
        </div>

        <h2 className="lab-main-heading">Fast decisions. Clear costs.</h2>
        <p className="lab-supporting-copy">
          Compare response time and workload cost across different model architectures, then inspect the assumptions behind the numbers.
        </p>

        {/* High-Impact Stat Banner inspired by Reference Image 3 */}
        <div style={{
          background: 'rgba(21, 21, 21, 0.08)',
          border: '2px solid var(--lab-ink)',
          padding: '16px 20px',
          borderRadius: '4px',
          boxShadow: '3px 3px 0px var(--lab-ink)',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              color: 'var(--lab-ink)',
              marginRight: '12px'
            }}>
              193.6× Faster, 444.6× Cheaper.
            </span>
            <span style={{ fontSize: '0.82rem', color: '#2b2528', fontWeight: 600 }}>
              *Based on illustrative bounded classification workloads
            </span>
          </div>
          <button
            onClick={() => setShowMethodology(!showMethodology)}
            className="lab-btn-retro"
          >
            <Info size={14} />
            <span>Methodology Proof</span>
          </button>
        </div>
      </div>

      {/* 4. THREE OVERLAPPING EXPLANATORY WINDOWS */}
      <div className="lab-top-windows-grid">
        
        {/* WINDOW A: Text models */}
        <div className="lab-window" style={{ transform: 'rotate(-0.5deg)' }}>
          <div className="lab-titlebar">
            <span>Window A ▪ Text models</span>
            <span>[ _ ▢ ✕ ]</span>
          </div>
          <div style={{ padding: '16px' }}>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '6px' }}>
              Text models
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--lab-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
              Useful for drafting, explanation, synthesis, and open-ended reasoning.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span className="lab-badge">▸ Text output</span>
              <span className="lab-badge">▸ Flexible instructions</span>
              <span className="lab-badge">▸ Optional tools & structured output</span>
            </div>
          </div>
        </div>

        {/* WINDOW B: Reasoning models */}
        <div className="lab-window" style={{ transform: 'rotate(0.5deg)' }}>
          <div className="lab-titlebar">
            <span>Window B ▪ Reasoning models</span>
            <span>[ _ ▢ ✕ ]</span>
          </div>
          <div style={{ padding: '16px' }}>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '6px' }}>
              Reasoning models
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--lab-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
              Useful when a task benefits from deeper multi-step reasoning or internal verification.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span className="lab-badge">▸ Complex tasks</span>
              <span className="lab-badge">▸ Variable reasoning effort</span>
              <span className="lab-badge">▸ Workload-dependent latency</span>
            </div>
          </div>
        </div>

        {/* WINDOW C: Decision models (Desicio.ai paradigm) */}
        <div className="lab-window" style={{ borderColor: 'var(--lab-accent)', boxShadow: '4px 4px 0px var(--lab-accent)' }}>
          <div className="lab-titlebar" style={{ background: 'var(--lab-accent)' }}>
            <span>Window C ▪ Decision models</span>
            <span>[ _ ▢ ✕ ]</span>
          </div>
          <div style={{ padding: '16px' }}>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '6px', color: 'var(--lab-accent)' }}>
              Decision models (Desicio.ai)
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--lab-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
              Focused semantic judgments returned in typed forms application code can use directly.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span className="lab-badge lab-badge-accent">▸ Choice (Discrete Category)</span>
              <span className="lab-badge lab-badge-accent">▸ Score (Calibrated Likelihood)</span>
              <span className="lab-badge lab-badge-accent">▸ Probability of yes (Noul)</span>
            </div>
            <div style={{
              marginTop: '12px',
              paddingTop: '8px',
              borderTop: '1px dashed #c9c4b3',
              fontSize: '0.74rem',
              color: '#444',
              lineHeight: 1.4
            }}>
              <em>Architecture note: Desicio adopts System One reinforcement learning for calibrated decisions (RLCD), returning deterministic schemas without autoregressive latency.</em>
            </div>
          </div>
        </div>

      </div>

      {/* 5. MAIN COMPARISON WINDOW (Visual Centerpiece) */}
      <div className="lab-window" style={{ marginBottom: '36px' }}>
        <div className="lab-titlebar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={16} />
            <span>Decision workload comparison</span>
          </div>

          {/* Title Bar Controls (Section 5) */}
          <div className="lab-titlebar-controls">
            <button onClick={handleReplay} className="lab-btn-retro" title="Replay benchmark race">
              <RotateCcw size={13} />
              <span>Replay</span>
            </button>
            <button onClick={handleTogglePlay} className="lab-btn-retro" title={isPlaying ? "Pause animation" : "Play animation"}>
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button onClick={() => setShowMethodology(!showMethodology)} className="lab-btn-retro">
              <Info size={13} />
              <span>{showMethodology ? 'Hide Info' : 'Methodology'}</span>
            </button>
          </div>
        </div>

        {/* Metadata Bar */}
        <div style={{
          background: '#e9e4d5',
          borderBottom: '2px solid var(--lab-ink)',
          padding: '8px 16px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          fontSize: '0.76rem',
          fontWeight: 700
        }}>
          <div>
            <span style={{ color: 'var(--lab-secondary)' }}>DATASET:</span> Illustrative demo &nbsp;▪&nbsp;
            <span style={{ color: 'var(--lab-secondary)' }}>WORKLOAD:</span> Bounded schema evaluation &nbsp;▪&nbsp;
            <span style={{ color: 'var(--lab-secondary)' }}>SPEED:</span> Median end-to-end task latency
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--lab-secondary)' }}>BASELINE MODEL:</span>
            <select
              value={baselineId}
              onChange={(e) => setBaselineId(e.target.value)}
              style={{
                fontFamily: 'monospace',
                fontSize: '0.74rem',
                fontWeight: 700,
                padding: '2px 6px',
                border: '1.5px solid var(--lab-ink)',
                background: '#fff'
              }}
            >
              {DEMO_BENCHMARK_MODELS.map(m => (
                <option key={m.id} value={m.id}>{m.displayName}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Header Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '240px 80px 1fr 110px',
          padding: '10px 16px',
          borderBottom: '2px solid var(--lab-ink)',
          fontSize: '0.74rem',
          fontWeight: 800,
          color: 'var(--lab-secondary)',
          background: '#f8f6ee'
        }}>
          <span>APPROACH / MODEL</span>
          <span>REL. SPEED</span>
          <span>LATENCY SIMULATION TRACK (EQUAL WORKLOAD)</span>
          <span style={{ textAlign: 'right' }}>COST / 1K TASKS</span>
        </div>

        {/* Comparison Rows */}
        <div>
          {DEMO_BENCHMARK_MODELS.map((model) => {
            const isBaseline = model.id === baselineId;
            const isDesicio = model.id === 'decision-engine';

            // Relative speed calculation: baselineMedian / modelMedian (Section 6)
            const relativeMultiplier = baselineModel.medianLatencyMs / model.medianLatencyMs;
            const multiplierStr = isBaseline ? '1.0×' : `${relativeMultiplier.toFixed(1)}×`;

            // Normalized marker progress: faster models reach 100% early
            // Calculate progress based on relative speed to baseline (faster models move quicker)
            // const relativeMultiplier = baselineModel.medianLatencyMs / model.medianLatencyMs; // duplicate removed
            const progress = Math.min(1, animProgress * relativeMultiplier);
            const clampedProgress = progress;
            const isComplete = clampedProgress >= 1;

            return (
              <div 
                key={model.id}
                className={`lab-row-container ${isBaseline ? 'is-baseline' : ''}`}
              >
                {/* Left: Model Name */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{
                      background: isDesicio ? 'var(--lab-accent)' : '#151515',
                      color: '#ffffff',
                      padding: '2px 6px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      borderRadius: '2px'
                    }}>
                      {model.displayName}
                    </span>
                    {isBaseline && (
                      <span className="lab-badge" style={{ fontSize: '0.64rem', padding: '1px 4px' }}>
                        Baseline
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--lab-secondary)' }}>
                    {model.medianLatencyMs} ms median · {model.qualityMetricName}: {model.qualityMetricValue}
                  </div>
                </div>

                {/* Center-Left: Speed Multiplier */}
                <div>
                  <span style={{
                    fontSize: '1rem',
                    fontWeight: 900,
                    color: isDesicio ? 'var(--lab-accent)' : 'var(--lab-ink)'
                  }}>
                    {multiplierStr}
                  </span>
                </div>

                {/* Center-Right: Horizontal Animation Track */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="lab-progress-track">
                    <div 
                      className={`lab-marker-box ${isDesicio ? 'desicio-marker' : ''}`}
                      style={{
                        left: `${clampedProgress * 100}%`,
                        transition: isPlaying ? 'none' : 'left 0.2s ease'
                      }}
                      title={`${model.displayName}: ${model.medianLatencyMs}ms`}
                    />
                  </div>
                  <div style={{ minWidth: '70px', fontSize: '0.72rem', fontWeight: 700 }}>
                    {isComplete ? (
                      <span style={{ color: 'var(--lab-accent)', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                        <CheckCircle2 size={12} />
                        <span>Done</span>
                      </span>
                    ) : (
                      <span style={{ color: '#888' }}>
                        {Math.round(clampedProgress * 100)}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Workload Cost */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '1.05rem',
                    fontWeight: 900,
                    color: isDesicio ? 'var(--lab-accent)' : 'var(--lab-ink)'
                  }}>
                    ${model.costPer1000CompletedTasksUsd.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--lab-secondary)' }}>
                    / 1k decisions
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Collapsible Methodology Panel (Section 12) */}
        {showMethodology && (
          <div className="lab-methodology-drawer">
            <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Info size={16} />
              <span>Benchmark Methodology & Assumptions</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div>
                <strong>Data Status:</strong> Illustrative synthetic demonstration.<br />
                <strong>Workload:</strong> 5-question typed classification over 1,500 token state.<br />
                <strong>Sample Size:</strong> N=500 simulated requests.<br />
                <strong>Latency Metric:</strong> Median end-to-end task completion (ms).
              </div>
              <div>
                <strong>Cost Basis:</strong> USD per 1,000 completed valid outputs.<br />
                <strong>Concurrency:</strong> Single-thread request/response simulation.<br />
                <strong>Failure Handling:</strong> Retries not included in baseline cost.<br />
                <strong>Output Format:</strong> Strict typed JSON vs unbounded conversational text.
              </div>
            </div>
            <div style={{ marginTop: '10px', fontSize: '0.74rem', color: '#666' }}>
              <em>Note: These values are illustrative product demonstration figures to demonstrate relative architectural efficiency between System 1 typed execution and generative chat models. Real production benchmarks will vary based on hardware and payload size.</em>
            </div>
          </div>
        )}
      </div>

      {/* ADDITIONAL VISUAL COMPARISONS (From User Images 1 & 2) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '36px' }}>
        
        {/* Left: String Tax Terminal Race (Image 2) */}
        <div className="lab-window">
          <div className="lab-titlebar">
            <span>String Tax Comparison</span>
            <span>OS 1.2</span>
          </div>
          <div style={{ padding: '16px', fontSize: '0.78rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              
              {/* Desicio Parallel API */}
              <div style={{ background: '#ffffff', border: '1.5px solid #151515', padding: '10px' }}>
                <div style={{ fontWeight: 800, color: 'var(--lab-accent)', marginBottom: '4px' }}>
                  ⚡ Desicio.ai Parallel Engine
                </div>
                <div style={{ fontSize: '0.68rem', color: '#555', marginBottom: '8px' }}>
                  $ ask desicio --pipeline support
                </div>
                <pre style={{
                  background: '#f8f7f0',
                  padding: '6px',
                  borderRadius: '2px',
                  fontSize: '0.68rem',
                  lineHeight: 1.3,
                  overflowX: 'auto',
                  border: '1px solid #ddd'
                }}>
{`{
  "urgent": true,
  "confidence": 0.94,
  "department": "billing",
  "fraud_score": 0.12,
  "latency_ms": 142
}`}
                </pre>
                <div style={{ marginTop: '6px', fontSize: '0.7rem', color: 'var(--lab-accent)', fontWeight: 700 }}>
                  ✓ 1 roundtrip · 142ms · Zero tokens
                </div>
              </div>

              {/* Autoregressive LLM */}
              <div style={{ background: '#ffffff', border: '1.5px solid #151515', padding: '10px' }}>
                <div style={{ fontWeight: 800, color: '#aa3333', marginBottom: '4px' }}>
                  ⏳ Standard Chat LLM
                </div>
                <div style={{ fontSize: '0.68rem', color: '#555', marginBottom: '8px' }}>
                  $ curl openai/chat/completions
                </div>
                <pre style={{
                  background: '#f8f7f0',
                  padding: '6px',
                  borderRadius: '2px',
                  fontSize: '0.68rem',
                  lineHeight: 1.3,
                  overflowX: 'auto',
                  border: '1px solid #ddd',
                  color: '#666'
                }}>
{`"Based on my analysis
of the provided context,
the customer issue
appears to be billing
related..." (450 tokens)`}
                </pre>
                <div style={{ marginTop: '6px', fontSize: '0.7rem', color: '#aa3333', fontWeight: 700 }}>
                  ✕ 450 tokens · 2,800ms · Verbose
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right: Structured Output Error Rate / Hallucinations (Image 1) */}
        <div className="lab-window">
          <div className="lab-titlebar">
            <span>Structured Output Error Rate</span>
            <span>Calibrated Reliability</span>
          </div>
          <div style={{ padding: '16px', fontSize: '0.78rem' }}>
            <div style={{ fontWeight: 800, marginBottom: '12px', fontSize: '0.86rem' }}>
              Hallucination & Schema Violation Rates
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', fontWeight: 700 }}>
                  <span style={{ color: 'var(--lab-accent)' }}>Desicio.ai System 1 (RLCD)</span>
                  <span style={{ color: 'var(--lab-accent)' }}>0.00%</span>
                </div>
                <div style={{ height: '8px', background: '#ddd', border: '1px solid #151515' }}>
                  <div style={{ width: '0%', height: '100%', background: 'var(--lab-accent)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', fontWeight: 700 }}>
                  <span>GPT-4o Mini / Frontier</span>
                  <span>0.49%</span>
                </div>
                <div style={{ height: '8px', background: '#ddd', border: '1px solid #151515' }}>
                  <div style={{ width: '4.9%', height: '100%', background: '#333' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', fontWeight: 700 }}>
                  <span>Gemini 2.5 Flash</span>
                  <span>2.38%</span>
                </div>
                <div style={{ height: '8px', background: '#ddd', border: '1px solid #151515' }}>
                  <div style={{ width: '23.8%', height: '100%', background: '#333' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', fontWeight: 700 }}>
                  <span>Claude Sonnet 3.5</span>
                  <span>12.60%</span>
                </div>
                <div style={{ height: '8px', background: '#ddd', border: '1px solid #151515' }}>
                  <div style={{ width: '68%', height: '100%', background: '#b23b3b' }} />
                </div>
              </div>
            </div>

            <p style={{ marginTop: '12px', fontSize: '0.72rem', color: 'var(--lab-secondary)' }}>
              LLMs produce words for humans. Desicio produces typed decisions like code: calibrated, fast, deterministic, and type-safe.
            </p>
          </div>
        </div>

      </div>

      {/* 9. WORKLOAD COST CALCULATOR */}
      <div className="lab-window" style={{ marginBottom: '36px' }}>
        <div className="lab-titlebar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={16} />
            <span>What does this workload cost? (Interactive Calculator)</span>
          </div>
          <span className="lab-badge lab-badge-illustrative" style={{ padding: '2px 6px', fontSize: '0.68rem' }}>
            Illustrative estimate
          </span>
        </div>

        <div className="lab-calc-grid">
          {/* Controls column */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, marginBottom: '6px' }}>
                COMPLETED TASKS VOLUME: {calcTaskCount.toLocaleString()}
              </label>
              <input
                type="range"
                min={1000}
                max={500000}
                step={1000}
                value={calcTaskCount}
                onChange={(e) => setCalcTaskCount(Number(e.target.value))}
                style={{ width: '100%', marginBottom: '8px' }}
              />
              <input
                type="number"
                min={1000}
                max={1000000}
                value={calcTaskCount}
                onChange={(e) => setCalcTaskCount(Math.max(0, Number(e.target.value)))}
                className="lab-input"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, marginBottom: '6px' }}>
                SELECTED ARCHITECTURE:
              </label>
              <select
                value={calcSelectedId}
                onChange={(e) => setCalcSelectedId(e.target.value)}
                className="lab-select"
              >
                {DEMO_BENCHMARK_MODELS.map(m => (
                  <option key={m.id} value={m.id}>{m.displayName} (${m.costPer1000CompletedTasksUsd}/1k)</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, marginBottom: '6px' }}>
                COMPARISON BASELINE:
              </label>
              <select
                value={calcBaselineId}
                onChange={(e) => setCalcBaselineId(e.target.value)}
                className="lab-select"
              >
                {DEMO_BENCHMARK_MODELS.map(m => (
                  <option key={m.id} value={m.id}>{m.displayName} (${m.costPer1000CompletedTasksUsd}/1k)</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setCalcTaskCount(10000);
                setCalcSelectedId('decision-engine');
                setCalcBaselineId('general-text-model');
              }}
              className="lab-btn-retro"
            >
              <RotateCcw size={12} />
              <span>Reset Calculator Defaults</span>
            </button>
          </div>

          {/* Results Summary Box */}
          <div style={{
            background: '#ffffff',
            border: '2px solid var(--lab-ink)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '3px 3px 0px var(--lab-ink)'
          }}>
            <div>
              <div style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--lab-secondary)', marginBottom: '4px' }}>
                PROJECTED ESTIMATED WORKLOAD COST
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--lab-accent)', lineHeight: 1 }}>
                ${estimatedCost.toFixed(2)}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#666', marginTop: '4px' }}>
                for {calcTaskCount.toLocaleString()} decisions on {calcSelectedModel.displayName}
              </div>
            </div>

            <div style={{
              margin: '18px 0',
              padding: '12px',
              background: '#f4f2e6',
              border: '1.5px solid var(--lab-ink)',
              fontSize: '0.82rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Baseline Cost ({calcBaseModel.displayName}):</span>
                <strong>${baselineCost.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>{costDiff >= 0 ? 'Estimated Absolute Savings:' : 'Additional Cost:'}</span>
                <strong style={{ color: costDiff >= 0 ? 'var(--lab-accent)' : '#b91c1c' }}>
                  ${Math.abs(costDiff).toFixed(2)}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Percentage Efficiency Difference:</span>
                <strong style={{ color: costDiff >= 0 ? 'var(--lab-accent)' : '#b91c1c' }}>
                  {pctSavings.toFixed(1)}% {costDiff >= 0 ? 'savings' : 'higher'}
                </strong>
              </div>
            </div>

            <div style={{ fontSize: '0.72rem', color: '#777', lineHeight: 1.4 }}>
              <em>*Note: For 1,000 tasks, Desicio.ai costs $0.40 vs Baseline $12.00, yielding approximately 96.7% cost reduction. Illustrative estimate; does not constitute guaranteed billing terms.</em>
            </div>
          </div>
        </div>
      </div>

      {/* 10. EXPLAIN THE ARCHITECTURE (Connected Box Diagram) */}
      <div className="lab-window">
        <div className="lab-titlebar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={16} />
            <span>Concept Architecture: Decision Routing Workflow</span>
          </div>
          <span className="lab-badge">System 1 Hybrid Pipeline</span>
        </div>

        <div style={{ padding: '24px' }}>
          <p style={{ fontSize: '0.88rem', color: '#333', marginBottom: '20px', lineHeight: 1.5 }}>
            “Use explicit code for known rules and calculations. Use a suitable model where semantic understanding is needed. Reserve open-ended generation for tasks that need it. Measure the complete workflow before claiming an efficiency gain.”
          </p>

          {/* Interactive Flow Diagram */}
          <div style={{
            maxWidth: '680px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px'
          }}>
            {/* Box 1 */}
            <div className="lab-workflow-box" style={{ width: '280px' }}>
              Input and context
            </div>
            <div className="lab-arrow-down">↓</div>

            {/* Box 2 */}
            <div className="lab-workflow-box" style={{ width: '280px' }}>
              Task selection & intent routing
            </div>
            <div className="lab-arrow-down">↓</div>

            {/* Split Box */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
              <div className="lab-workflow-box" style={{ borderColor: 'var(--lab-accent)', background: 'var(--lab-accent-bg)' }}>
                <div style={{ color: 'var(--lab-accent)', fontWeight: 800 }}>Bounded Judgment</div>
                <div style={{ fontSize: '0.72rem', color: '#555' }}>Desicio.ai Typed Model (Sub-200ms)</div>
              </div>
              <div className="lab-workflow-box">
                <div style={{ fontWeight: 800 }}>Open-ended Language</div>
                <div style={{ fontSize: '0.72rem', color: '#555' }}>Text / Reasoning Frontier Model</div>
              </div>
            </div>
            <div className="lab-arrow-down">↓</div>

            {/* Box 4 */}
            <div className="lab-workflow-box" style={{ width: '380px' }}>
              Deterministic application rules and validation
            </div>
            <div className="lab-arrow-down">↓</div>

            {/* Box 5 */}
            <div className="lab-workflow-box" style={{ width: '380px' }}>
              Action or Human Escalation Review
            </div>
            <div className="lab-arrow-down">↓</div>

            {/* Box 6 */}
            <div className="lab-workflow-box" style={{ width: '380px', background: '#ece8da' }}>
              Recorded outcome in Neon Serverless Postgres Audit Trail
            </div>
          </div>

          <div style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid #d4cfbe',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            fontSize: '0.78rem',
            color: '#444'
          }}>
            <div>
              <strong>▪ Ask independent questions together:</strong> Evaluate multiple semantic fields across shared context in a single sub-200ms roundtrip.
            </div>
            <div>
              <strong>▪ Reuse valid judgments:</strong> Cache semantic outcomes while evidence remains constant, avoiding wasteful re-evaluation.
            </div>
            <div>
              <strong>▪ Recompute deterministic weights locally:</strong> Alter weights and business score rules instantly without calling AI APIs.
            </div>
            <div>
              <strong>▪ Escalate policy cases:</strong> Trigger human-in-the-loop oversight when model confidence score is below threshold.
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};
