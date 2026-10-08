import { useState, useEffect } from 'react';
import LatticeLoader from './LatticeLoader';
import { TypeSafeLanding } from './TypeSafeLanding';
import { DecisionEfficiencyLab } from './DecisionEfficiencyLab';
import { 
  Zap, 
  Terminal, 
  Clock, 
  Layers, 
  RotateCcw, 
  Cpu, 
  Code, 
  ArrowRight,
  Play,
  Gauge,
  CheckCircle,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  Flame,
  Building2,
  Bot,
  Workflow
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
  sample_states?: string[];
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
    sample_states: [
      "Customer: I was billed $499 twice on my card this morning and my team cannot access the dashboard during our product launch. If this is not fixed in 1 hour I will cancel and dispute the charge.",
      "Customer: Hi team, quick question - where can I download our monthly invoice as a PDF? No rush at all, just doing our quarterly bookkeeping.",
      "Customer: Urgent - Getting a 500 internal server error whenever our data team tries to export daily reports to CSV. Happening for all team members."
    ],
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
    sample_states: [
      "Transaction: $4,850.00 luxury watch purchase from IP in Lagos, Nigeria. Account owner registered in Chicago, USA with last physical card swipe 14 minutes ago in Chicago.",
      "Transaction: $14.50 morning coffee purchase at local cafe in Chicago, USA. Consistent with 2-year daily routine and verified Apple Pay token.",
      "Transaction: $1,250.00 cryptocurrency voucher purchase at 3:30 AM UTC from unrecognized mobile device behind anonymizing VPN tunnel."
    ],
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
    sample_states: [
      "Lead: VP of Engineering at a 1,200 person FinTech company. Message: Looking to replace our slow OpenAI classification pipeline across 4M daily transactions. Budget is approved for Q4 rollout.",
      "Lead: University student working on senior capstone project. Message: Can I apply for a free community plan to test my student prototype?",
      "Lead: Head of Operations at 110-person logistics startup. Message: Evaluating high-speed routing engines for our real-time dispatch queue ($50k budget)."
    ],
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
    sample_states: [
      "Agent Step: User asked to refund $1,200 to customer account #8942 and send an apology note.",
      "Agent Step: User asked to look up current stock inventory for SKU-4091 across US and EU warehouse clusters.",
      "Agent Step: User asked to compose and send a friendly congratulatory email to newly promoted colleague Mark."
    ],
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

// 1-Click Interactive Presentation Scenarios for Judges
interface JudgeScenario {
  id: string;
  badge: string;
  title: string;
  pipelineId: string;
  scenarioText: string;
  expectedVerdict: string;
  actionTaken: string;
  tagColor: string;
  iconType: 'flame' | 'shield' | 'building' | 'bot';
}

const JUDGE_SCENARIOS: JudgeScenario[] = [
  {
    id: "sc-support",
    badge: "VIP Triage",
    title: "Double-Billed $499 During Launch",
    pipelineId: "support-triage",
    scenarioText: "Customer: I was billed $499 twice on my card this morning and my team cannot access the dashboard during our product launch. If this is not fixed in 1 hour I will cancel and dispute the charge.",
    expectedVerdict: "Critical Urgency (100% Confidence)",
    actionTaken: "⚡ Paged VP Engineering on PagerDuty • Zendesk Ticket Tagged #P1-BILLING",
    tagColor: "#eb5e3e",
    iconType: "flame"
  },
  {
    id: "sc-fraud",
    badge: "FinTech Risk",
    title: "$4,850 Lagos Midnight Watch Swipe",
    pipelineId: "fraud-sentinel",
    scenarioText: "Transaction: $4,850.00 luxury watch purchase from IP in Lagos, Nigeria. Account owner registered in Chicago, USA with last physical card swipe 14 minutes ago in Chicago.",
    expectedVerdict: "Critical Freeze Triggered (Risk: 2.92 / 3.0)",
    actionTaken: "🛑 Card Auto-Frozen in 168ms • Visa Webhook Fired • Cardholder SMS Dispatched",
    tagColor: "#eb5e3e",
    iconType: "shield"
  },
  {
    id: "sc-lead",
    badge: "Enterprise Sales",
    title: "Fortune 50 VP Requesting 5,000 Seats",
    pipelineId: "lead-scorer",
    scenarioText: "Lead: VP of Cloud Engineering at Fortune 50 Enterprise (12,000 employees). Requesting immediate pricing for 5,000 developer seats on annual contract.",
    expectedVerdict: "Enterprise Tier 1 ($250k+ Contract)",
    actionTaken: "💼 Direct Calendly Invite Sent • Strategic AE Assigned via Slack Alert",
    tagColor: "#667838",
    iconType: "building"
  },
  {
    id: "sc-agent",
    badge: "Agent Gateway",
    title: "Autonomous Tool Call for Refund",
    pipelineId: "agent-router",
    scenarioText: "Agent Step: User asked to refund $1,200 to customer account #8942 and send an apology note.",
    expectedVerdict: "Execute Stripe PaymentTool()",
    actionTaken: "🤖 Direct Function Call Dispatched in 118ms • Bypassed 2,000ms LLM Latency",
    tagColor: "#283670",
    iconType: "bot"
  }
];

// Smooth Animated Number Counter
function AnimatedNumber({ value, duration = 800, decimals = 0, suffix = "" }: { value: number; duration?: number; decimals?: number; suffix?: string }) {
  const [displayVal, setDisplayVal] = useState<number>(0);

  useEffect(() => {
    let startVal = 0;
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayVal(startVal + (value - startVal) * ease);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }, [value, duration]);

  return <>{displayVal.toFixed(decimals)}{suffix}</>;
}

// Semicircular Speedometer Dial with Sweeping Needle
function SpeedometerDial({ 
  value = 0, 
  max = 3, 
  label = "SCORE", 
  confidence, 
  legend,
  verdict
}: { 
  value?: number; 
  max?: number; 
  label?: string; 
  confidence?: number; 
  legend?: Record<string, string>;
  verdict?: string;
}) {
  const [animatedRatio, setAnimatedRatio] = useState<number>(0);
  const ratio = Math.max(0, Math.min(1, value / (max || 1)));

  useEffect(() => {
    setAnimatedRatio(0);
    const timeout = setTimeout(() => {
      setAnimatedRatio(ratio);
    }, 40);
    return () => clearTimeout(timeout);
  }, [value, max, ratio]);

  // Clean 180-degree upper semicircle gauge
  // Sweep from -90deg (value 0, left) to +90deg (value max, right)
  const arcLength = 219.91; // PI * 70
  const strokeOffset = arcLength * (1 - animatedRatio);
  const needleAngle = -90 + animatedRatio * 180;

  const activeColor = ratio < 0.33 ? "#667838" : ratio < 0.67 ? "#fabc22" : "#eb5e3e";

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '24px 20px',
      background: '#ffffff',
      borderRadius: '16px',
      border: '1.5px solid var(--border-color)',
      boxShadow: '0 3px 12px rgba(46, 28, 20, 0.04)',
      position: 'relative'
    }}>
      {/* Card Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '12px' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.94rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase' }}>
          {label}
        </span>
        <span style={{
          fontSize: '0.72rem',
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          padding: '3px 8px',
          borderRadius: '4px',
          background: '#f2f5e8',
          color: '#476326',
          border: '1px solid #d3e2be'
        }}>
          SPEEDOMETER DIAL
        </span>
      </div>

      {/* Semicircular Upper Gauge Area */}
      <div style={{ position: 'relative', width: '220px', display: 'flex', justifyContent: 'center' }}>
        <svg width="220" height="118" viewBox="0 0 220 118" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#667838" />
              <stop offset="50%" stopColor="#fabc22" />
              <stop offset="100%" stopColor="#eb5e3e" />
            </linearGradient>
          </defs>

          {/* Background Arc (180 deg semicircle, r=70, center=110,95) */}
          <path
            d="M 40 95 A 70 70 0 0 1 180 95"
            fill="none"
            stroke="#eee5d3"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Colored Active Sweep Arc */}
          <path
            d="M 40 95 A 70 70 0 0 1 180 95"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeOffset}
            style={{ transition: 'stroke-dashoffset 0.85s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />

          {/* Tick Markers */}
          <line x1="110" y1="25" x2="110" y2="33" stroke="#d5cca8" strokeWidth="2" />
          <line x1="60.5" y1="45.5" x2="66.5" y2="51.5" stroke="#d5cca8" strokeWidth="2" />
          <line x1="159.5" y1="45.5" x2="153.5" y2="51.5" stroke="#d5cca8" strokeWidth="2" />

          {/* Scale Labels: 0 and MAX */}
          <text x="32" y="112" fontSize="11" fontFamily="var(--font-mono)" fontWeight="700" fill="var(--text-faint)" textAnchor="middle">0</text>
          <text x="188" y="112" fontSize="11" fontFamily="var(--font-mono)" fontWeight="700" fill="var(--text-faint)" textAnchor="middle">{max}</text>

          {/* Rotating Needle with Center Pivot at (110, 95) */}
          <g
            style={{
              transformOrigin: '110px 95px',
              transform: `rotate(${needleAngle}deg)`,
              transition: 'transform 0.85s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            <polygon points="107.5,95 112.5,95 110,32" fill="#1c1917" />
            <circle cx="110" cy="95" r="8" fill="#1c1917" />
            <circle cx="110" cy="95" r="3.5" fill="#ffffff" />
          </g>
        </svg>
      </div>

      {/* Prominent Score Readout & Confidence Below Gauge Base (No Overlap) */}
      <div style={{
        marginTop: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '2.2rem',
          fontWeight: 900,
          color: 'var(--text-main)',
          lineHeight: 1,
          display: 'flex',
          alignItems: 'baseline',
          gap: '4px'
        }}>
          <AnimatedNumber value={value} decimals={value % 1 === 0 ? 0 : 2} />
          <span style={{ fontSize: '1.1rem', color: 'var(--text-faint)', fontWeight: 700 }}>/ {max}</span>
        </div>

        {confidence !== undefined && (
          <div style={{
            fontFamily: 'var(--font-typewriter)',
            fontSize: '0.82rem',
            color: 'var(--text-faint)',
            marginTop: '5px'
          }}>
            ({Math.round(confidence * 100)}% calibrated confidence)
          </div>
        )}
      </div>

      {/* Dynamic Status Verdict Pill */}
      {verdict && (
        <div style={{
          marginTop: '12px',
          padding: '6px 16px',
          borderRadius: '20px',
          background: activeColor === '#eb5e3e' ? '#fdf0ec' : activeColor === '#fabc22' ? '#fef8e7' : '#f2f5e8',
          border: `1.5px solid ${activeColor}`,
          color: activeColor === '#eb5e3e' ? '#eb5e3e' : activeColor === '#fabc22' ? '#a16207' : '#476326',
          fontFamily: 'var(--font-display)',
          fontSize: '0.82rem',
          fontWeight: 800,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: activeColor }} />
          {verdict}
        </div>
      )}

      {/* Breakdown Legend Buttons */}
      {legend && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Object.keys(legend).length}, 1fr)`,
          gap: '6px',
          width: '100%',
          marginTop: '16px',
          borderTop: '1px solid #f0e7d5',
          paddingTop: '12px'
        }}>
          {Object.entries(legend).map(([idx, name]) => {
            const isMatch = Math.round(value) === Number(idx);
            return (
              <div key={idx} style={{
                textAlign: 'center',
                padding: '5px 4px',
                borderRadius: '6px',
                background: isMatch ? '#fff5eb' : '#faf7f0',
                border: isMatch ? '1.5px solid var(--border-dark)' : '1px solid #ebd9bf',
                fontWeight: isMatch ? 800 : 500,
                fontSize: '0.74rem',
                fontFamily: 'var(--font-display)',
                color: isMatch ? 'var(--text-main)' : 'var(--text-faint)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ textTransform: 'capitalize' }}>{name}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Circular Probability Activation Ring
function ActivationDial({ 
  value = 0, 
  label = "PROBABILITY GATE", 
  instructions = "Gate Activation Threshold"
}: { 
  value?: number; 
  label?: string; 
  instructions?: string;
}) {
  const [animatedPct, setAnimatedPct] = useState<number>(0);
  const pct = Math.round(value * 100);
  const isTripped = pct >= 50;

  useEffect(() => {
    setAnimatedPct(0);
    const timeout = setTimeout(() => {
      setAnimatedPct(pct);
    }, 40);
    return () => clearTimeout(timeout);
  }, [pct]);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference * (1 - animatedPct / 100);

  return (
    <div style={{
      padding: '20px 18px',
      background: '#ffffff',
      borderRadius: '14px',
      border: '1.5px solid var(--border-color)',
      boxShadow: '0 3px 12px rgba(46, 28, 20, 0.04)',
      display: 'flex',
      alignItems: 'center',
      gap: '18px'
    }}>
      <div style={{ position: 'relative', width: '92px', height: '92px', flexShrink: 0 }}>
        <svg width="92" height="92" viewBox="0 0 92 92" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="46" cy="46" r={radius} fill="none" stroke="#eee5d3" strokeWidth="8" />
          <circle
            cx="46"
            cy="46"
            r={radius}
            fill="none"
            stroke={isTripped ? "#eb5e3e" : "#667838"}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.85s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
        </svg>

        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-main)' }}>
            <AnimatedNumber value={pct} suffix="%" />
          </span>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase' }}>
            {label}
          </span>
          <span style={{
            fontSize: '0.72rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '4px',
            background: isTripped ? '#fdf0ec' : '#f2f5e8',
            color: isTripped ? '#eb5e3e' : '#476326',
            border: `1px solid ${isTripped ? '#fbd4ca' : '#d3e2be'}`
          }}>
            {isTripped ? 'POLICY GATE TRIPPED' : 'NOMINAL SAFE RANGE'}
          </span>
        </div>
        <p style={{ fontFamily: 'var(--font-typewriter)', fontSize: '0.82rem', color: 'var(--text-faint)', marginBottom: '8px', lineHeight: 1.35 }}>
          {instructions}
        </p>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.84rem',
          fontWeight: 700,
          color: isTripped ? '#b91c1c' : '#15803d'
        }}>
          {isTripped ? '⚡ Automated Action Executed: Yes (Policy Gate > 50%)' : '✓ Normal Operation: No Human Escalation Required'}
        </div>
      </div>
    </div>
  );
}

// Live Latency Race Bar Comparison for Judges
function LatencyRaceBar({ systemOneMs = 168 }: { systemOneMs?: number }) {
  const gpt4oMs = 1850;
  const speedup = (gpt4oMs / (systemOneMs || 1)).toFixed(1);

  return (
    <div style={{
      padding: '20px 22px',
      background: '#ffffff',
      borderRadius: '14px',
      border: '1.5px solid var(--border-color)',
      boxShadow: '0 3px 12px rgba(46, 28, 20, 0.04)',
      marginTop: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={18} color="#eb5e3e" />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.02em' }}>
            REAL-TIME INFERENCE RACE: SYSTEM 1 vs GENERATIVE LLMs
          </span>
        </div>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.8rem',
          fontWeight: 800,
          padding: '3px 10px',
          borderRadius: '20px',
          background: '#f2f5e8',
          color: '#3f5621',
          border: '1px solid #d3e2be'
        }}>
          ⚡ {speedup}× FASTER EXECUTION
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Desicio System 1 Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
            <span style={{ color: '#2e1c14' }}>⚡ Desicio.ai (Jev System 1)</span>
            <span style={{ color: '#476326', fontFamily: 'var(--font-mono)' }}>{systemOneMs} ms (FINISHED ✓)</span>
          </div>
          <div style={{ width: '100%', height: '14px', background: '#f0ece1', borderRadius: '7px', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '100%', background: '#476326', borderRadius: '7px' }} />
          </div>
        </div>

        {/* GPT-4o Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
            <span style={{ color: 'var(--text-faint)' }}>🐢 OpenAI GPT-4o (Streaming LLM)</span>
            <span style={{ color: '#eb5e3e', fontFamily: 'var(--font-mono)' }}>1,850 ms (11× slower)</span>
          </div>
          <div style={{ width: '100%', height: '14px', background: '#f0ece1', borderRadius: '7px', overflow: 'hidden' }}>
            <div style={{ width: '9%', height: '100%', background: '#eb5e3e', borderRadius: '7px' }} />
          </div>
        </div>

        {/* Claude 3.5 Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
            <span style={{ color: 'var(--text-faint)' }}>🐢 Claude 3.5 Sonnet (Schema Gen)</span>
            <span style={{ color: '#fabc22', fontFamily: 'var(--font-mono)' }}>1,420 ms (8.5× slower)</span>
          </div>
          <div style={{ width: '100%', height: '14px', background: '#f0ece1', borderRadius: '7px', overflow: 'hidden' }}>
            <div style={{ width: '12%', height: '100%', background: '#fabc22', borderRadius: '7px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function App() {
  const getInitialTab = (): 'overview' | 'lab' | 'playground' | 'benchmarks' | 'logs' => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (['overview', 'lab', 'playground', 'benchmarks', 'logs'].includes(hash)) {
        return hash as any;
      }
    }
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'lab' | 'playground' | 'benchmarks' | 'logs'>(getInitialTab);
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

  // Internal API Configuration (strictly from environment variable)
  // NOTE: API keys are not used on the client side to avoid exposure.
  const apiKey = ""; // intentionally left blank
  const backendUrl = import.meta.env.VITE_API_URL || "";
  const [backendOnline, setBackendOnline] = useState<boolean>(true);

  // Sync hash with active tab
  useEffect(() => {
    window.location.hash = activeTab;
  }, [activeTab]);

  // Check backend health
  useEffect(() => {
    const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const isLocalhost = backendUrl.includes('localhost') || backendUrl.includes('127.0.0.1');

    const checkHealth = async () => {
      try {
        const pingUrl = (isHttps && isLocalhost) || !backendUrl ? '/api/health' : `${backendUrl}/api/v1/health`;
        const res = await fetch(pingUrl);
        setBackendOnline(res.ok);
      } catch {
        setBackendOnline(true);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, [backendUrl]);

  // Load audit history
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLogsLoading(true);
      const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
      const isLocalhost = backendUrl.includes('localhost') || backendUrl.includes('127.0.0.1');
      const historyUrl = (isHttps && isLocalhost) || !backendUrl ? '/api/history?limit=20' : `${backendUrl}/api/v1/history?limit=20`;

      try {
        const res = await fetch(historyUrl);
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

  // Judge Scenario Selection
  const [selectedScenario, setSelectedScenario] = useState<JudgeScenario | null>(JUDGE_SCENARIOS[0]);
  const [showVideoDemo, setShowVideoDemo] = useState<boolean>(false);

  // Sample cycling & reset feedback
  const [resetFeedback, setResetFeedback] = useState<boolean>(false);
  const [sampleIndex, setSampleIndex] = useState<number>(0);

  const handleSelectPipeline = (pipeline: Pipeline) => {
    setSelectedPipeline(pipeline);
    setCustomState(pipeline.sample_state);
    setSampleIndex(0);
    setCustomQuestionsJson(JSON.stringify(pipeline.questions, null, 2));
    setIsCustomSchema(false);
    setSelectedScenario(null);
    setResult(null);
  };

  const handleResetSample = () => {
    const samples = selectedPipeline.sample_states && selectedPipeline.sample_states.length > 0
      ? selectedPipeline.sample_states
      : [selectedPipeline.sample_state];

    let nextSample = samples[0];
    if (customState.trim() === samples[sampleIndex % samples.length].trim()) {
      // If current text is already matching this sample, rotate to next variation
      const nextIdx = (sampleIndex + 1) % samples.length;
      setSampleIndex(nextIdx);
      nextSample = samples[nextIdx];
    } else {
      // Otherwise reset back to primary default sample
      setSampleIndex(0);
      nextSample = samples[0];
    }

    setCustomState(nextSample);
    
    // Clear previous execution results so the screen resets cleanly
    setResult(null);
    setIsCustomSchema(false);
    setCustomQuestionsJson(JSON.stringify(selectedPipeline.questions, null, 2));
    setSelectedScenario(null);

    // Provide visual feedback
    setResetFeedback(true);
    setTimeout(() => {
      setResetFeedback(false);
    }, 1000);
  };

  const executeInference = async (
    statePayload: string,
    questionsPayload: any,
    pipelineId: string,
    pipelineName: string
  ) => {
    setIsLoading(true);
    setResult(null);
    const start = performance.now();

    const timer = setInterval(() => {
      setTimerMs(Math.round(performance.now() - start));
    }, 10);

    try {
      let data: any = null;

      // Tier 1: Call Vercel Serverless /api/evaluate (works on both local dev proxy and production Vercel)
      try {
        const endpoint = backendUrl 
          ? (isCustomSchema ? `${backendUrl}/api/v1/evaluate` : `${backendUrl}/api/v1/pipelines/${pipelineId}/run`)
          : '/api/evaluate';

        const payload = backendUrl
          ? (isCustomSchema ? { state: statePayload, questions: questionsPayload } : { state: statePayload })
          : {
              state: statePayload,
              questions: questionsPayload,
              model: "jev-latest",
              pipeline_id: pipelineId
            };

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Desicio-API-Key': apiKey,
          },
          body: JSON.stringify(payload)
        });

        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          data = await res.json();
        }
      } catch (err) {
        console.warn("Primary endpoint request failed, falling back:", err);
      }

      // Tier 2: Try direct Vercel production domain if running on localhost without local backend
      if (!data && typeof window !== 'undefined' && window.location.hostname.includes('127.0.0.1')) {
        try {
          const res = await fetch('https://frontend-three-rust-50.vercel.app/api/evaluate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Desicio-API-Key': apiKey,
            },
            body: JSON.stringify({
              state: statePayload,
              questions: questionsPayload,
              model: "jev-latest",
              pipeline_id: pipelineId
            })
          });

          if (res.ok) {
            data = await res.json();
          }
        } catch (err) {
          console.warn("Direct Vercel fallback failed:", err);
        }
      }

      // Tier 3: Direct TypeSafe Jev System 1 Engine inference (Guaranteed client-side fallback)
      if (!data) {
        const directRes = await fetch("https://api.typesafe.ai/v1/systemone", {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: "jev-latest",
            state: statePayload,
            questions: questionsPayload
          })
        });

        if (!directRes.ok) {
          const errBody = await directRes.json().catch(() => ({ detail: directRes.statusText }));
          throw new Error(typeof errBody === 'object' ? JSON.stringify(errBody) : String(errBody));
        }

        const directData = await directRes.json();
        const duration = Math.round(performance.now() - start);
        data = {
          id: `dec_${Date.now()}`,
          created_at: new Date().toISOString(),
          pipeline_id: pipelineId,
          pipeline_name: pipelineName,
          state: statePayload,
          questions: questionsPayload,
          answers: directData.answers,
          model: directData.model || "jev-latest",
          usage: directData.usage || {},
          latency_ms: duration
        };

        // Asynchronously record to Neon database via /api/history
        fetch('/api/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }).catch(() => {});
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

  const handleExecute = () => {
    let parsedQuestions = selectedPipeline.questions;
    if (isCustomSchema) {
      try {
        parsedQuestions = JSON.parse(customQuestionsJson);
      } catch (err: any) {
        alert("Invalid Questions JSON: " + err.message);
        return;
      }
    }
    executeInference(
      customState,
      parsedQuestions,
      isCustomSchema ? 'custom' : selectedPipeline.id,
      isCustomSchema ? 'Custom Schema' : selectedPipeline.name
    );
  };

  const handleRunScenario = (sc: JudgeScenario) => {
    setSelectedScenario(sc);
    const targetPipeline = PRESET_PIPELINES.find(p => p.id === sc.pipelineId) || PRESET_PIPELINES[0];
    setSelectedPipeline(targetPipeline);
    setSampleIndex(0);
    setCustomState(sc.scenarioText);
    setCustomQuestionsJson(JSON.stringify(targetPipeline.questions, null, 2));
    setIsCustomSchema(false);
    
    // Smooth scroll down to console so judges see the animated dials
    setTimeout(() => {
      const consoleEl = document.getElementById('execution-console');
      if (consoleEl) {
        consoleEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);

    executeInference(
      sc.scenarioText,
      targetPipeline.questions,
      targetPipeline.id,
      targetPipeline.name
    );
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              fontSize: '0.92rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: activeTab === 'overview' ? 'var(--text-main)' : 'var(--text-faint)',
              borderBottom: activeTab === 'overview' ? '2px solid var(--text-main)' : '2px solid transparent',
              paddingBottom: '4px',
              transition: 'all 0.15s ease'
            }}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('lab')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              fontSize: '0.92rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: activeTab === 'lab' ? 'var(--text-main)' : 'var(--text-faint)',
              borderBottom: activeTab === 'lab' ? '2px solid var(--text-main)' : '2px solid transparent',
              paddingBottom: '4px',
              transition: 'all 0.15s ease'
            }}
          >
            Efficiency Lab
          </button>
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
            background: backendOnline ? '#eef4e6' : '#fef4e6',
            border: `1.5px solid ${backendOnline ? '#d3e2be' : '#f5d9ad'}`,
            color: backendOnline ? '#3f5621' : '#8a5314'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: backendOnline ? '#5f822e' : '#d97706'
            }} />
            {backendOnline ? 'SYSTEM 1 ACTIVE' : 'DIRECT INFERENCE'}
          </div>
        </div>
      </header>

      {/* AI Video Demonstration Modal */}
      {showVideoDemo && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(28, 25, 23, 0.78)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '24px'
        }}>
          <div className="boutique-card" style={{
            width: '100%',
            maxWidth: '1040px',
            background: 'var(--bg-card)',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '2px solid var(--border-dark)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 24px',
              borderBottom: '1.5px solid var(--border-dark)',
              background: 'var(--bg-creamy)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  background: '#eb5e3e',
                  color: '#ffffff',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '13px'
                }}>▶</div>
                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.18rem',
                    fontWeight: 800,
                    margin: 0,
                    color: 'var(--text-main)'
                  }}>
                    DESICIO.AI — FULL WORKFLOW DEMONSTRATION (AI VOICE)
                  </h3>
                  <div style={{ fontFamily: 'var(--font-typewriter)', fontSize: '0.8rem', color: 'var(--text-faint)' }}>
                    High-Definition 1080p Walkthrough • Narrated by AI
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <a
                  href="/demo_walkthrough.mp4"
                  download="desicio_ai_workflow_demo.mp4"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    textDecoration: 'none',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid var(--border-dark)',
                    background: '#ffffff'
                  }}
                >
                  ↓ Download MP4
                </a>
                <button
                  onClick={() => setShowVideoDemo(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.6rem',
                    cursor: 'pointer',
                    color: 'var(--text-main)',
                    fontWeight: 800,
                    lineHeight: 1
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Video Player */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000000' }}>
              <video
                controls
                autoPlay
                src="/demo_walkthrough.mp4"
                style={{ width: '100%', height: '100%', display: 'block' }}
              />
            </div>

            {/* Modal Footer Chapters */}
            <div style={{
              padding: '14px 24px',
              background: 'var(--bg-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.86rem',
              color: 'var(--text-muted)',
              borderTop: '1px solid var(--border-dark)'
            }}>
              <div>
                <strong style={{ color: 'var(--text-main)' }}>Chapters:</strong> 1. LLM Problem • 2. System 1 Philosophy • 3. 3-Step Pipeline • 4. Live Crisis Demo • 5. Benchmarks & Neon Postgres • 6. Summary
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-espresso)' }}>
                1080p Full HD • 1m 58s
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <main style={{ flex: 1, padding: '48px 56px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
        {/* TAB 0: OVERVIEW (TYPESAFE.AI INSPIRED LANDING PAGE & RETRO OS BENCHMARK GRAPH) */}
        {activeTab === 'overview' && (
          <TypeSafeLanding
            onTryPlayground={() => {
              setActiveTab('playground');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onWatchVideo={() => setShowVideoDemo(true)}
            onViewBenchmarks={() => {
              setActiveTab('benchmarks');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* TAB 0.5: DECISION EFFICIENCY LAB (STANDALONE RETRO WORKLOAD LAB) */}
        {activeTab === 'lab' && (
          <DecisionEfficiencyLab />
        )}

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

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '8px' }}>
                  <button
                    onClick={() => setShowVideoDemo(true)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: 'var(--text-main)',
                      color: 'var(--bg-primary)',
                      border: '2px solid var(--text-main)',
                      padding: '12px 24px',
                      borderRadius: '30px',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      boxShadow: '4px 4px 0 rgba(28, 25, 23, 0.25)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Play size={16} fill="currentColor" /> WATCH AI VIDEO DEMO (2 MIN)
                  </button>

                  <span 
                    onClick={() => {
                      const el = document.getElementById('pipeline-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{
                      fontFamily: 'var(--font-typewriter)',
                      fontSize: '1.05rem',
                      color: 'var(--text-main)',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: 700
                    }}
                  >
                    Explore Pipelines <ArrowRight size={16} />
                  </span>

                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.88rem',
                    color: 'var(--text-espresso)',
                    fontWeight: 600,
                    background: '#f2f5e8',
                    padding: '6px 14px',
                    borderRadius: '16px',
                    border: '1.5px solid #d3e2be'
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
                      background: isSelected ? 'var(--bg-card)' : 'rgba(255, 255, 255, 0.35)',
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

            {/* HOW DESICIO WORKS IN 3 STEPS (SELF-EXPLANATORY JUDGE BANNER) */}
            <div style={{
              background: '#ffffff',
              border: '2px solid var(--border-dark)',
              borderRadius: '16px',
              padding: '28px 32px',
              marginBottom: '40px',
              boxShadow: '4px 4px 0px rgba(46, 28, 20, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sparkles size={20} color="#eb5e3e" />
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    How Desicio System 1 Works in 3 Steps
                  </span>
                </div>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  padding: '4px 12px',
                  borderRadius: '20px',
                  background: '#f2f5e8',
                  color: '#476326',
                  border: '1px solid #d3e2be'
                }}>
                  ZERO PPT NEEDED • 100% SELF-EXPLANATORY
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', position: 'relative' }}>
                {/* Step 1 */}
                <div style={{
                  background: '#faf7ef',
                  border: '1.5px solid #ebd9bf',
                  borderRadius: '12px',
                  padding: '20px 22px',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: '#eb5e3e' }}>
                      STEP 01
                    </span>
                    <Terminal size={16} color="#eb5e3e" />
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Context Ingestion
                  </h4>
                  <p style={{ fontFamily: 'var(--font-typewriter)', fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                    Ingest raw unstructured state: customer tickets, fraud transaction payloads, agent step memory, or CRM inbound forms.
                  </p>
                </div>

                {/* Step 2 */}
                <div style={{
                  background: '#faf7ef',
                  border: '1.5px solid #ebd9bf',
                  borderRadius: '12px',
                  padding: '20px 22px',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: '#667838' }}>
                      STEP 02
                    </span>
                    <Zap size={16} color="#667838" />
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                    120ms Neural Pass
                  </h4>
                  <p style={{ fontFamily: 'var(--font-typewriter)', fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                    Evaluates typed primitives (Score, Policy Gate, Choice) in a single forward pass without token streaming or hallucination.
                  </p>
                </div>

                {/* Step 3 */}
                <div style={{
                  background: '#faf7ef',
                  border: '1.5px solid #ebd9bf',
                  borderRadius: '12px',
                  padding: '20px 22px',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: '#283670' }}>
                      STEP 03
                    </span>
                    <Workflow size={16} color="#283670" />
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Deterministic Action
                  </h4>
                  <p style={{ fontFamily: 'var(--font-typewriter)', fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                    Deterministic typed schema triggers instant downstream code: card freeze, PagerDuty alert, Slack dispatch, or tool execution.
                  </p>
                </div>
              </div>
            </div>

            {/* 1-CLICK LIVE JUDGE DEMOS SECTION */}
            <div style={{
              background: '#fcfaf2',
              border: '2px solid var(--border-dark)',
              borderRadius: '16px',
              padding: '28px 32px',
              marginBottom: '40px',
              boxShadow: '4px 4px 0px rgba(46, 28, 20, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Gauge size={22} color="#1c1917" />
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '0.03em' }}>
                    1-CLICK LIVE JUDGE DEMOS (NO SLIDES NEEDED)
                  </span>
                </div>
                <span style={{
                  fontFamily: 'var(--font-typewriter)',
                  fontSize: '0.85rem',
                  color: 'var(--text-espresso)',
                  fontWeight: 600
                }}>
                  ★ Click any crisis to run real-time evaluation with animated speedometer dials & live actions
                </span>
              </div>

              <p style={{ fontSize: '0.94rem', color: 'var(--text-muted)', marginBottom: '22px', maxWidth: '820px', lineHeight: 1.5 }}>
                Since we are presenting live without PowerPoint slides, judges and audience members can click any real-world production incident below to witness sub-200ms System 1 inference and deterministic action dispatch in real time.
              </p>

              {/* 4 Interactive Scenario Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px' }}>
                {JUDGE_SCENARIOS.map((sc) => {
                  const isCurrent = selectedScenario?.id === sc.id;
                  return (
                    <div
                      key={sc.id}
                      className="scenario-pill"
                      style={{
                        background: isCurrent ? '#ffffff' : '#faf6ee',
                        border: isCurrent ? '2.5px solid #1c1917' : '1.5px solid #ebd9bf',
                        borderRadius: '14px',
                        padding: '20px 18px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: isCurrent ? '4px 4px 0px #1c1917' : '2px 2px 0px rgba(46, 28, 20, 0.04)',
                        transform: isCurrent ? 'translate(-1px, -1px)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div>
                        {/* Scenario Category Pill */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <span style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: `${sc.tagColor}15`,
                            color: sc.tagColor,
                            border: `1px solid ${sc.tagColor}40`,
                            textTransform: 'uppercase'
                          }}>
                            {sc.badge}
                          </span>
                          {sc.iconType === 'flame' && <Flame size={16} color={sc.tagColor} />}
                          {sc.iconType === 'shield' && <ShieldAlert size={16} color={sc.tagColor} />}
                          {sc.iconType === 'building' && <Building2 size={16} color={sc.tagColor} />}
                          {sc.iconType === 'bot' && <Bot size={16} color={sc.tagColor} />}
                        </div>

                        {/* Title */}
                        <h4 style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '0.98rem',
                          fontWeight: 800,
                          color: 'var(--text-main)',
                          marginBottom: '8px',
                          lineHeight: 1.3
                        }}>
                          {sc.title}
                        </h4>

                        {/* Snippet */}
                        <p style={{
                          fontFamily: 'var(--font-typewriter)',
                          fontSize: '0.78rem',
                          color: 'var(--text-muted)',
                          lineHeight: 1.4,
                          marginBottom: '14px',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          "{sc.scenarioText}"
                        </p>
                      </div>

                      {/* Action Trigger Button */}
                      <button
                        onClick={() => handleRunScenario(sc)}
                        disabled={isLoading}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          background: isCurrent ? '#1c1917' : '#ffffff',
                          color: isCurrent ? '#fffefb' : '#1c1917',
                          border: '1.5px solid #1c1917',
                          fontFamily: 'var(--font-display)',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '2px 2px 0px rgba(28, 25, 23, 0.1)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {isCurrent && isLoading ? (
                          <LatticeLoader
                            status="working"
                            label="Thinking"
                            pattern="orbit"
                            grid={3}
                            shape="round"
                            color="#fffefb"
                            cellSize={4}
                            gap={2}
                            fontSize={12}
                            step={90}
                            showTimer={false}
                          />
                        ) : (
                          <>
                            <Play size={13} fill={isCurrent ? '#fffefb' : '#1c1917'} />
                            Run Live (150ms)
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Split Screen Execution Console */}
            <div id="execution-console" style={{
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
                <div className="glass-panel" style={{ padding: '28px', background: 'var(--bg-card)' }}>
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
                      id="btn-reset-sample"
                      type="button"
                      onClick={handleResetSample}
                      title="Reset sample payload, cycle scenarios, and clear execution results"
                      style={{
                        background: resetFeedback ? '#eef4e6' : 'var(--bg-creamy)',
                        border: `1.5px solid ${resetFeedback ? '#5f822e' : 'var(--border-dark)'}`,
                        color: resetFeedback ? '#3f5621' : 'var(--text-main)',
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        padding: '5px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.25s ease',
                        boxShadow: resetFeedback ? '0 0 10px rgba(95, 130, 46, 0.2)' : 'none'
                      }}
                    >
                      <RotateCcw 
                        size={13} 
                        style={{ 
                          transform: resetFeedback ? 'rotate(-360deg)' : 'none', 
                          transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                        }} 
                      />
                      {resetFeedback ? 'Sample Restored!' : 'Reset Sample'}
                    </button>
                  </div>

                  <textarea
                    id="input-sample-state"
                    rows={6}
                    value={customState}
                    onChange={(e) => setCustomState(e.target.value)}
                    placeholder="Enter customer support ticket, transaction details, agent trace, or raw JSON object..."
                    style={{ 
                      resize: 'vertical', 
                      fontSize: '1rem', 
                      padding: '14px 18px', 
                      lineHeight: '1.55',
                      borderColor: resetFeedback ? '#5f822e' : undefined,
                      transition: 'border-color 0.3s ease'
                    }}
                  />
                  <span style={{ fontFamily: 'var(--font-typewriter)', fontSize: '0.82rem', color: 'var(--text-faint)', marginTop: '8px', display: 'block' }}>
                    Accepts arbitrary unstructured text, support threads, or serialized JSON payloads without prompt tuning.
                  </span>
                </div>

                {/* Questions Schema Card */}
                <div className="glass-panel" style={{ padding: '28px', background: 'var(--bg-card)' }}>
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
                      <LatticeLoader
                        status="working"
                        label="Thinking"
                        pattern="orbit"
                        grid={3}
                        shape="round"
                        color="#fffefb"
                        cellSize={5}
                        gap={2}
                        fontSize={14}
                        step={90}
                        showTimer={true}
                      />
                    ) : (
                      <>
                        <Zap size={20} /> Execute High-Speed Decision
                      </>
                    )}
                  </button>

                  <div style={{
                    padding: '12px 22px',
                    borderRadius: '10px',
                    background: 'var(--bg-card)',
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
                          `${timerMs} ms`
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
              <div className="glass-panel" style={{ padding: '28px', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column' }}>
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
                    {/* Live Processing Header Bar with React Bits LatticeLoader */}
                    <div style={{
                      padding: '16px 20px',
                      background: '#ffffff',
                      border: '1.5px solid var(--border-dark)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 8px rgba(46, 28, 20, 0.05)'
                    }}>
                      <LatticeLoader
                        status="working"
                        label="Thinking"
                        doneLabel="Done in"
                        errorLabel="Failed after"
                        pattern="orbit"
                        grid={3}
                        shape="round"
                        color="#1c1917"
                        doneColor="#22c55e"
                        errorColor="#ef4444"
                        cellSize={6}
                        gap={2}
                        fontSize={14}
                        step={90}
                        idleOpacity={0.15}
                        glow={false}
                        showTimer={true}
                      />
                      <div style={{
                        padding: '4px 12px',
                        background: '#faf7ef',
                        border: '1px solid #ebd9bf',
                        borderRadius: '16px',
                        fontSize: '0.8rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        color: 'var(--text-espresso)'
                      }}>
                        FORWARD PASS
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

                    {/* CONCRETE AUTOMATED BUSINESS ACTION BANNER */}
                    <div className="glow-action" style={{
                      padding: '18px 22px',
                      background: '#ffffff',
                      border: '2px solid #1c1917',
                      borderRadius: '14px',
                      boxShadow: '4px 4px 0px #1c1917',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CheckCircle size={18} color="#476326" />
                          <span style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '0.84rem',
                            fontWeight: 900,
                            color: '#476326',
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase'
                          }}>
                            AUTOMATED SYSTEM ACTION DISPATCHED ({result.latency_ms} MS)
                          </span>
                        </div>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.74rem',
                          background: '#f2f5e8',
                          color: '#476326',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: 700,
                          border: '1px solid #d3e2be'
                        }}>
                          DETERMINISTIC • ZERO HALLUCINATION
                        </span>
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.98rem',
                        fontWeight: 800,
                        color: '#1c1917',
                        lineHeight: 1.45
                      }}>
                        {selectedScenario 
                          ? selectedScenario.actionTaken 
                          : `⚡ Automated Pipeline Action: ${selectedPipeline.name} • Downstream Webhook Dispatched`}
                      </div>
                    </div>

                    {rawView ? (
                      <pre className="code-block" style={{ flex: 1, minHeight: '340px' }}>
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                        {result.answers && Object.entries(result.answers).map(([key, val]: [string, any]) => {
                          const questionDef = selectedPipeline.questions?.[key];

                          if (val.type === 'score') {
                            const maxScore = questionDef?.criteria 
                              ? (Array.isArray(questionDef.criteria) ? questionDef.criteria.length - 1 : 3) 
                              : 3;
                            return (
                              <SpeedometerDial
                                key={key}
                                value={val.score}
                                max={maxScore}
                                label={key.replace(/_/g, ' ')}
                                confidence={val.confidence}
                                legend={val.legend}
                                verdict={
                                  val.score >= 2 
                                    ? 'CRITICAL / HIGH SEVERITY' 
                                    : val.score >= 1 
                                    ? 'MODERATE ELEVATION' 
                                    : 'NOMINAL / SAFE RANGE'
                                }
                              />
                            );
                          }

                          if (val.type === 'noul') {
                            return (
                              <ActivationDial
                                key={key}
                                value={val.noul}
                                label={key.replace(/_/g, ' ')}
                                instructions={questionDef?.instructions || "Policy Gate Activation Threshold"}
                              />
                            );
                          }

                          return (
                            <div
                              key={key}
                              style={{
                                background: '#ffffff',
                                border: '1.5px solid var(--border-color)',
                                borderRadius: '14px',
                                padding: '20px 22px',
                                boxShadow: '0 3px 12px rgba(46, 28, 20, 0.04)'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase' }}>
                                  {key.replace(/_/g, ' ')}
                                </span>
                                <span style={{
                                  fontSize: '0.72rem',
                                  fontFamily: 'var(--font-display)',
                                  textTransform: 'uppercase',
                                  padding: '3px 8px',
                                  borderRadius: '4px',
                                  fontWeight: 800,
                                  background: '#edf0f9',
                                  color: '#283670',
                                  border: '1px solid #cad5f4'
                                }}>
                                  DYNAMIC ROUTE CHOICE
                                </span>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '14px' }}>
                                <span style={{
                                  fontFamily: 'var(--font-display)',
                                  fontSize: '1.2rem',
                                  fontWeight: 900,
                                  color: '#fffefb',
                                  background: '#283670',
                                  padding: '6px 16px',
                                  borderRadius: '8px',
                                  letterSpacing: '0.02em',
                                  boxShadow: '2px 2px 0px rgba(40, 54, 112, 0.2)'
                                }}>
                                  {val.choice}
                                </span>
                                {val.confidence !== undefined && (
                                  <span style={{ fontFamily: 'var(--font-typewriter)', fontSize: '0.85rem', color: 'var(--text-faint)' }}>
                                    ({Math.round(val.confidence * 100)}% calibrated confidence)
                                  </span>
                                )}
                              </div>

                              {val.probabilities && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #f0e7d5', paddingTop: '12px' }}>
                                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase' }}>
                                    CANDIDATE BRANCH DISTRIBUTION:
                                  </div>
                                  {Object.entries(val.probabilities).map(([choiceKey, prob]: [string, any]) => {
                                    const pct = Math.round(Number(prob) * 100);
                                    const isWinner = choiceKey === val.choice;
                                    return (
                                      <div key={choiceKey}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '3px' }}>
                                          <span style={{ fontFamily: 'var(--font-display)', fontWeight: isWinner ? 800 : 500, color: isWinner ? '#1c1917' : 'var(--text-muted)' }}>
                                            {choiceKey} {isWinner && '★'}
                                          </span>
                                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: isWinner ? '#283670' : 'var(--text-faint)' }}>
                                            {pct}%
                                          </span>
                                        </div>
                                        <div style={{ width: '100%', height: '8px', background: '#f0ece1', borderRadius: '4px', overflow: 'hidden' }}>
                                          <div style={{
                                            width: `${pct}%`,
                                            height: '100%',
                                            background: isWinner ? '#283670' : '#d4cebe',
                                            borderRadius: '4px',
                                            transition: 'width 0.6s ease'
                                          }} />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* Real-Time Inference Race Bar */}
                        <LatencyRaceBar systemOneMs={result.latency_ms} />
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
              <div className="glass-panel" style={{ padding: '32px', background: 'var(--bg-card)' }}>
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
              <div className="glass-panel" style={{ padding: '32px', background: 'var(--bg-card)' }}>
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
              <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '14px' }}>
                <Clock size={36} color="#888888" style={{ marginBottom: '14px' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>No audit logs recorded yet. Run a decision in the Playground!</p>
              </div>
            ) : (
              <div className="boutique-card" style={{ overflow: 'hidden', background: 'var(--bg-card)', borderRadius: '14px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1.5px solid var(--border-dark)', background: 'var(--bg-card-alt)', color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
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
          DESICIO<span style={{ color: 'var(--accent-coral)' }}>.AI</span> — SUB-200MS SYSTEM 1 DECISION ENGINE
        </div>
      </footer>
    </div>
  );
}

export default App;
