const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DEMO_DIR = path.join(ROOT_DIR, 'frontend', 'public', 'demo');
const SLIDES_DIR = path.join(DEMO_DIR, 'slides');
const AUDIO_DIR = path.join(DEMO_DIR, 'audio');
const CLIPS_DIR = path.join(DEMO_DIR, 'clips');
const OUTPUT_MP4 = path.join(ROOT_DIR, 'frontend', 'public', 'demo_walkthrough.mp4');

const CHROME_BIN = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const SCENES = [
  {
    id: 'scene1_intro',
    title: 'The Failure of Generative LLMs in Production',
    voiceText: 'Welcome to Desicio dot A I. In modern high-throughput software architectures, every millisecond counts. Yet engineering teams are stuck using slow generative LLMs that take thousands of milliseconds to stream text, hallucinate outputs, and risk production downtime.',
    subtitle: 'Desicio.ai — Moving from slow 2,000ms Generative LLMs to Sub-200ms System 1 Decisions',
    html: `
      <div class="header">
        <div class="logo">DESICIO<span>.AI</span></div>
        <div class="badge">SYSTEM 1 DECISION ENGINE</div>
      </div>
      <div class="content">
        <h1 class="main-title">The Failure of Generative LLMs in Production Software</h1>
        <p class="subtitle">Why streaming tokens is the wrong abstraction for mission-critical software decisions</p>
        
        <div class="grid-2">
          <div class="card alert">
            <div class="card-tag">Traditional Generative LLMs (GPT-4o / Claude)</div>
            <div class="card-item"><span>❌ 2,000ms+ Latency:</span> Forces user-facing UI spinners and breaks SLA budgets.</div>
            <div class="card-item"><span>❌ Hallucinated Strings:</span> Probabilistic token output breaks strict typed schema parsers.</div>
            <div class="card-item"><span>❌ Streaming Delay:</span> Can not trigger immediate synchronous transaction actions.</div>
            <div class="card-item"><span>❌ Opaque Decisions:</span> No calibrated probabilistic confidence distributions.</div>
          </div>

          <div class="card success">
            <div class="card-tag">Desicio.ai System 1 Architecture</div>
            <div class="card-item"><span>⚡ Sub-200ms Single Forward Pass:</span> Over 11x faster than streaming models.</div>
            <div class="card-item"><span>🛡️ Deterministic Type Safety:</span> Strict primitives: Score, Noul Gate, and Choice.</div>
            <div class="card-item"><span>🎯 100% Calibrated Probabilities:</span> Statistical confidence scores for every question.</div>
            <div class="card-item"><span>🚀 Instant Action Dispatch:</span> Auto-triggers PagerDuty, card freeze, or Stripe webhooks.</div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'scene2_philosophy',
    title: 'Cognitive Architecture & Production Pipelines',
    voiceText: 'Inspired by Daniel Kahneman\'s cognitive principles, Desicio implements System 1 fast machine cognition. Instead of generating wordy paragraphs, Desicio evaluates typed questions across four core mission-critical production pipelines.',
    subtitle: 'System 1 Fast Cognition: Sub-200ms Typed Inference across 4 Mission-Critical Pipelines',
    html: `
      <div class="header">
        <div class="logo">DESICIO<span>.AI</span></div>
        <div class="badge">SYSTEM 1 COGNITIVE PHILOSOPHY</div>
      </div>
      <div class="content">
        <h1 class="main-title">Fast Machine Intuition for High-Throughput Software</h1>
        <p class="subtitle">Kahneman System 1 cognition evaluated in a single forward pass without token streaming</p>

        <div class="grid-4">
          <div class="pipeline-card">
            <div class="p-icon" style="color: #eb5e3e;">🌸</div>
            <div class="p-title">SUPPORT TRIAGE</div>
            <div class="p-desc">Sub-200ms customer intent classification, urgency scoring, and automated PagerDuty human escalation.</div>
            <div class="p-tag">Customer Ops</div>
          </div>

          <div class="pipeline-card">
            <div class="p-icon" style="color: #667838;">🛡️</div>
            <div class="p-title">FINTECH FRAUD</div>
            <div class="p-desc">Scores transaction risk, flags geo-velocity anomalies, and triggers sub-second card freeze webhooks.</div>
            <div class="p-tag">Security & Risk</div>
          </div>

          <div class="pipeline-card">
            <div class="p-icon" style="color: #fabc22;">⭐</div>
            <div class="p-title">LEAD SCORING</div>
            <div class="p-desc">Instantly qualifies inbound sales leads into Enterprise, Mid-Market, or Self-Serve with dedicated AE routing.</div>
            <div class="p-tag">Revenue Ops</div>
          </div>

          <div class="pipeline-card">
            <div class="p-icon" style="color: #283670;">🪐</div>
            <div class="p-title">AGENT ROUTING</div>
            <div class="p-desc">Sub-100ms multi-agent dispatcher determining database reads, payment calls, or manager approval.</div>
            <div class="p-tag">AI Systems</div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'scene3_workflow',
    title: 'The 3-Step Deterministic Workflow',
    voiceText: 'Our architecture is built on a simple three-step deterministic workflow. Step one: Context Ingestion. We ingest unformatted customer messages, transaction logs, or agent traces without prompt tuning. Step two: 120 millisecond Neural Pass. All typed questions are evaluated concurrently. Step three: Deterministic Action. Zero hallucination. The schema instantly triggers webhooks, card freezes, or PagerDuty alerts.',
    subtitle: 'The 3-Step Pipeline: Ingest Context → 120ms Neural Pass → Deterministic System Action',
    html: `
      <div class="header">
        <div class="logo">DESICIO<span>.AI</span></div>
        <div class="badge">PRODUCTION WORKFLOW</div>
      </div>
      <div class="content">
        <h1 class="main-title">How Desicio System 1 Works in 3 Steps</h1>
        <p class="subtitle">From unstructured real-world context to deterministic code execution in under 200ms</p>

        <div class="steps-container">
          <div class="step-card">
            <div class="step-num">STEP 01</div>
            <div class="step-title">Context Ingestion</div>
            <div class="step-desc">Ingest raw unstructured state: customer tickets, fraud transaction payloads, agent step memory, or CRM inbound forms.</div>
            <div class="step-pill">Zero Prompt Tuning</div>
          </div>

          <div class="step-arrow">➔</div>

          <div class="step-card highlight">
            <div class="step-num">STEP 02</div>
            <div class="step-title">120ms Neural Pass</div>
            <div class="step-desc">Evaluates typed primitives (Score, Policy Gate, Choice) in a single neural forward pass without token streaming or hallucination.</div>
            <div class="step-pill active">Sub-200ms Inference</div>
          </div>

          <div class="step-arrow">➔</div>

          <div class="step-card">
            <div class="step-num">STEP 03</div>
            <div class="step-title">Deterministic Action</div>
            <div class="step-desc">Deterministic typed schema triggers instant downstream code: card freeze, PagerDuty alert, Slack dispatch, or tool execution.</div>
            <div class="step-pill">Zero Hallucination</div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'scene4_demo',
    title: 'Live Incident Demo: VIP Launch Crisis',
    voiceText: 'Here is Desicio in action during a live incident. A VIP customer was double-billed four hundred and ninety-nine dollars during a product launch. In one hundred and eighty milliseconds, our animated Lattice Loader completes evaluation. The animated speedometer dial flags Critical urgency with one hundred percent confidence, instantly paging engineering leadership.',
    subtitle: 'Live Demo: 180ms LatticeLoader Inference & Speedometer Dial Alerting PagerDuty',
    html: `
      <div class="header">
        <div class="logo">DESICIO<span>.AI</span></div>
        <div class="badge">LIVE PRODUCTION DEMONSTRATION</div>
      </div>
      <div class="content">
        <h1 class="main-title">Live VIP Triage Incident: Automated PagerDuty Escalation</h1>
        <p class="subtitle">Real-world scenario evaluated synchronously with animated speedometer dial and instant dispatch</p>

        <div class="demo-grid">
          <div class="demo-col">
            <div class="box-title">1. Context Payload Ingested</div>
            <div class="payload-box">
              "Customer: I was billed $499 twice on my card this morning and my team cannot access the dashboard during our product launch. If this is not fixed in 1 hour I will cancel and dispute the charge."
            </div>
            <div class="loader-box">
              <span class="matrix-dot"></span>
              <span class="matrix-dot active"></span>
              <span class="matrix-dot"></span>
              <span class="loader-label">React Bits LatticeLoader: Evaluated in 180ms</span>
            </div>
          </div>

          <div class="demo-col">
            <div class="box-title">2. Calibrated Decision Dial & Automated Dispatch</div>
            <div class="dial-container">
              <div class="dial-arc">
                <div class="dial-needle"></div>
              </div>
              <div class="dial-score">3.0 <span>/ 3.0</span></div>
              <div class="dial-conf">(100% Calibrated Confidence)</div>
              <div class="dial-badge">● CRITICAL / HIGH SEVERITY</div>
            </div>
            <div class="action-card">
              <div class="action-badge">⚡ AUTOMATED SYSTEM ACTION DISPATCHED (180 MS)</div>
              <div class="action-detail">Paged VP Engineering on PagerDuty • Zendesk Ticket Tagged #P1-BILLING</div>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'scene5_benchmarks',
    title: 'Speed Benchmarks & Neon Postgres Audit Trail',
    voiceText: 'Compared to OpenAI GPT-4o, Desicio is over eleven times faster, finishing in under two hundred milliseconds versus eighteen hundred milliseconds for generative models. Every single decision is cryptographically signed and stored in Neon Postgres with exact latency metrics for full compliance.',
    subtitle: 'Benchmarks: 11x Faster vs GPT-4o • Enterprise Audit Trail Saved to Neon Postgres',
    html: `
      <div class="header">
        <div class="logo">DESICIO<span>.AI</span></div>
        <div class="badge">PERFORMANCE & OBSERVABILITY</div>
      </div>
      <div class="content">
        <h1 class="main-title">11x Speedup vs GPT-4o & Neon Postgres Audit Trail</h1>
        <p class="subtitle">Sub-200ms real-time latency paired with enterprise-grade immutable audit trails</p>

        <div class="grid-2">
          <div class="card" style="padding: 24px;">
            <div class="card-tag">⚡ Latency Benchmark (Forward Pass vs Streaming)</div>
            <div class="bar-group">
              <div class="bar-label"><span>Desicio.ai (Jev System 1)</span> <strong>180ms (11x Faster)</strong></div>
              <div class="bar-outer"><div class="bar-fill" style="width: 12%; background: #5f822e;"></div></div>
            </div>
            <div class="bar-group">
              <div class="bar-label"><span>Claude 3.5 Sonnet (Schema Gen)</span> <strong>1,420ms (8.5x Slower)</strong></div>
              <div class="bar-outer"><div class="bar-fill" style="width: 76%; background: #d97706;"></div></div>
            </div>
            <div class="bar-group">
              <div class="bar-label"><span>OpenAI GPT-4o (Streaming)</span> <strong>1,850ms (11x Slower)</strong></div>
              <div class="bar-outer"><div class="bar-fill" style="width: 100%; background: #dc2626;"></div></div>
            </div>
          </div>

          <div class="card" style="padding: 24px;">
            <div class="card-tag">🗄️ Neon Postgres Immutable Audit Trail</div>
            <div class="log-table">
              <div class="log-row head"><span>DECISION ID</span><span>PIPELINE</span><span>LATENCY</span><span>STATUS</span></div>
              <div class="log-row"><code>dec_892</code><span>Customer Support Triage</span><span class="green">180ms</span><span class="badge-done">DISPATCHED</span></div>
              <div class="log-row"><code>dec_891</code><span>FinTech Fraud Sentinel</span><span class="green">168ms</span><span class="badge-done">CARD FROZEN</span></div>
              <div class="log-row"><code>dec_890</code><span>B2B Lead Qualification</span><span class="green">194ms</span><span class="badge-done">AE ASSIGNED</span></div>
            </div>
            <div class="audit-note">✓ Cryptographically signed with SHA-256 payload verification</div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'scene6_conclusion',
    title: 'Build on Desicio.ai Today',
    voiceText: 'Stop waiting for slow generative LLMs to make deterministic software decisions. Desicio dot A I delivers instant, type-safe, calibrated intelligence at the speed of software. Try the interactive live playground today.',
    subtitle: 'Desicio.ai — Instant Decisions at the Speed of Software. Live on Vercel.',
    html: `
      <div class="header">
        <div class="logo">DESICIO<span>.AI</span></div>
        <div class="badge">SYSTEM 1 DECISION ENGINE</div>
      </div>
      <div class="content hero-center">
        <div class="hero-emblem">⚡</div>
        <h1 class="main-title" style="font-size: 56px; margin-bottom: 12px;">Instant Decisions at the Speed of Software</h1>
        <p class="subtitle" style="font-size: 24px; max-width: 800px; margin: 0 auto 36px auto;">
          Eliminate LLM latency. Execute deterministic System 1 decisions in under 200 milliseconds.
        </p>

        <div class="metric-ribbon">
          <div class="m-pill">⚡ Sub-200ms Forward Pass</div>
          <div class="m-pill">🛡️ Zero Hallucination</div>
          <div class="m-pill">🗄️ Neon Postgres Audit Logs</div>
          <div class="m-pill">🎯 100% Calibrated Probabilities</div>
        </div>

        <div class="url-card">
          <div class="url-label">LIVE INTERACTIVE PLAYGROUND:</div>
          <div class="url-text">https://frontend-three-rust-50.vercel.app</div>
          <div class="url-sub">Open-Source Repository: github.com/saagnik23/desicio-ai</div>
        </div>
      </div>
    `
  }
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
  
  * { box-sizing: border-box; }
  body {
    margin: 0;
    width: 1920px;
    height: 1080px;
    background: #faf7ea;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #1c1917;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 60px 80px 40px 80px;
    overflow: hidden;
  }
  
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid #1c1917;
    padding-bottom: 24px;
  }
  .logo {
    font-size: 38px;
    font-weight: 800;
    letter-spacing: -0.03em;
  }
  .logo span { color: #eb5e3e; }
  .badge {
    background: #eef4e6;
    border: 2px solid #5f822e;
    color: #3f5621;
    font-size: 16px;
    font-weight: 800;
    padding: 8px 20px;
    border-radius: 30px;
    letter-spacing: 0.05em;
  }
  
  .content { flex: 1; padding-top: 36px; }
  .main-title {
    font-size: 46px;
    font-weight: 800;
    line-height: 1.15;
    margin: 0 0 10px 0;
    color: #1c1917;
    letter-spacing: -0.02em;
  }
  .subtitle {
    font-size: 20px;
    color: #57534e;
    margin: 0 0 36px 0;
  }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }

  .card {
    background: #ffffff;
    border: 2px solid #1c1917;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 6px 6px 0 #1c1917;
  }
  .card.alert { background: #fff5f2; border-color: #eb5e3e; }
  .card.success { background: #f4f8ed; border-color: #5f822e; }

  .card-tag {
    font-size: 16px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 20px;
    color: #1c1917;
  }
  .card-item {
    font-size: 18px;
    line-height: 1.6;
    margin-bottom: 14px;
    color: #292524;
  }
  .card-item span { font-weight: 700; color: #1c1917; }

  .pipeline-card {
    background: #ffffff;
    border: 2px solid #1c1917;
    border-radius: 14px;
    padding: 28px;
    box-shadow: 4px 4px 0 #1c1917;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .p-icon { font-size: 42px; margin-bottom: 12px; }
  .p-title { font-size: 20px; font-weight: 800; margin-bottom: 8px; }
  .p-desc { font-size: 15px; color: #57534e; line-height: 1.5; margin-bottom: 16px; flex: 1; }
  .p-tag {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    background: #f5f5f4;
    padding: 6px 12px;
    border-radius: 6px;
    align-self: flex-start;
  }

  .steps-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-top: 20px;
  }
  .step-card {
    flex: 1;
    background: #ffffff;
    border: 2px solid #1c1917;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 6px 6px 0 #1c1917;
    min-height: 280px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .step-card.highlight { background: #fdfae7; border-color: #fabc22; }
  .step-num { font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 700; color: #eb5e3e; }
  .step-title { font-size: 26px; font-weight: 800; margin: 8px 0 12px 0; }
  .step-desc { font-size: 16px; line-height: 1.55; color: #44403c; margin-bottom: 16px; }
  .step-pill {
    font-size: 13px;
    font-weight: 700;
    padding: 6px 14px;
    background: #f5f5f4;
    border-radius: 20px;
    align-self: flex-start;
  }
  .step-pill.active { background: #5f822e; color: #ffffff; }
  .step-arrow { font-size: 38px; font-weight: 800; color: #1c1917; }

  .demo-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 40px; }
  .demo-col { display: flex; flex-direction: column; gap: 20px; }
  .box-title { font-size: 18px; font-weight: 800; text-transform: uppercase; }
  .payload-box {
    background: #ffffff;
    border: 2px solid #1c1917;
    border-radius: 12px;
    padding: 24px;
    font-size: 18px;
    line-height: 1.6;
    box-shadow: 4px 4px 0 #1c1917;
  }
  .loader-box {
    background: #1c1917;
    color: #ffffff;
    border-radius: 10px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 16px;
    font-weight: 600;
  }
  .matrix-dot { width: 10px; height: 10px; border-radius: 50%; background: #555; }
  .matrix-dot.active { background: #22c55e; box-shadow: 0 0 10px #22c55e; }

  .dial-container {
    background: #ffffff;
    border: 2px solid #1c1917;
    border-radius: 16px;
    padding: 24px;
    text-align: center;
    box-shadow: 6px 6px 0 #1c1917;
  }
  .dial-arc {
    width: 220px;
    height: 110px;
    border-top-left-radius: 110px;
    border-top-right-radius: 110px;
    border: 18px solid #eb5e3e;
    border-bottom: 0;
    margin: 0 auto;
    position: relative;
  }
  .dial-needle {
    position: absolute;
    width: 4px;
    height: 70px;
    background: #1c1917;
    bottom: 0;
    left: 50%;
    transform-origin: bottom center;
    transform: rotate(65deg);
  }
  .dial-score { font-size: 42px; font-weight: 800; margin-top: 14px; }
  .dial-score span { font-size: 24px; color: #78716c; }
  .dial-conf { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #57534e; margin-bottom: 12px; }
  .dial-badge {
    background: #fdf0ec;
    border: 1.5px solid #eb5e3e;
    color: #c2410c;
    font-weight: 800;
    font-size: 14px;
    padding: 6px 14px;
    border-radius: 20px;
    display: inline-block;
  }
  .action-card {
    background: #eef8ea;
    border: 2px solid #5f822e;
    border-radius: 12px;
    padding: 20px;
  }
  .action-badge { font-size: 13px; font-weight: 800; color: #3f5621; margin-bottom: 6px; }
  .action-detail { font-size: 16px; font-weight: 700; color: #1c1917; }

  .bar-group { margin-bottom: 22px; }
  .bar-label { display: flex; justify-content: space-between; font-size: 15px; font-weight: 700; margin-bottom: 8px; }
  .bar-outer { width: 100%; height: 20px; background: #e7e5e4; border-radius: 10px; overflow: hidden; border: 1.5px solid #1c1917; }
  .bar-fill { height: 100%; border-radius: 8px; }

  .log-table { display: flex; flex-direction: column; gap: 8px; }
  .log-row { display: grid; grid-template-columns: 100px 1fr 90px 120px; font-size: 14px; padding: 10px 12px; background: #f5f5f4; border-radius: 8px; align-items: center; }
  .log-row.head { font-weight: 800; background: #e7e5e4; }
  .green { color: #5f822e; font-weight: 800; }
  .badge-done { background: #dcfce7; color: #166534; font-size: 11px; font-weight: 800; padding: 4px 8px; border-radius: 6px; text-align: center; }
  .audit-note { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #57534e; margin-top: 14px; }

  .hero-center { text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; }
  .hero-emblem { font-size: 64px; margin-bottom: 16px; }
  .metric-ribbon { display: flex; gap: 16px; margin-bottom: 36px; }
  .m-pill { background: #ffffff; border: 2px solid #1c1917; padding: 10px 20px; border-radius: 30px; font-weight: 800; font-size: 16px; box-shadow: 4px 4px 0 #1c1917; }
  .url-card {
    background: #ffffff;
    border: 3px solid #1c1917;
    border-radius: 16px;
    padding: 24px 48px;
    box-shadow: 8px 8px 0 #1c1917;
  }
  .url-label { font-size: 14px; font-weight: 800; letter-spacing: 0.05em; color: #eb5e3e; margin-bottom: 6px; }
  .url-text { font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 700; color: #1c1917; }
  .url-sub { font-size: 15px; color: #78716c; margin-top: 8px; font-weight: 600; }

  .subtitle-bar {
    background: #1c1917;
    color: #ffffff;
    padding: 16px 32px;
    border-radius: 12px;
    font-size: 20px;
    font-weight: 600;
    text-align: center;
    box-shadow: 0 4px 14px rgba(0,0,0,0.2);
  }
`;

async function main() {
  console.log('🚀 Starting Desicio.ai Video Demonstration Generator...');

  const clipFiles = [];

  for (let i = 0; i < SCENES.length; i++) {
    const scene = SCENES[i];
    console.log(`\n🎬 Processing Scene ${i + 1}/${SCENES.length}: ${scene.title}`);

    // 1. Generate Voice Audio via say
    const aiffPath = path.join(AUDIO_DIR, `${scene.id}.aiff`);
    const wavPath = path.join(AUDIO_DIR, `${scene.id}.wav`);
    console.log(`  🔊 Generating AI voice narration...`);
    execSync(`say -v Samantha -r 172 "${scene.voiceText.replace(/"/g, '\\"')}" -o "${aiffPath}"`);

    // Pad audio with 0.4s silence at beginning and end for smooth pacing
    execSync(`ffmpeg -y -i "${aiffPath}" -af "adelay=400|400,apad=pad_dur=0.6" -ar 44100 -ac 2 "${wavPath}" -loglevel error`);

    // Get exact audio duration
    const durationStr = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${wavPath}"`).toString().trim();
    const duration = parseFloat(durationStr);
    console.log(`  ⏱️ Duration: ${duration.toFixed(2)}s`);

    // 2. Generate HTML Slide
    const htmlPath = path.join(SLIDES_DIR, `${scene.id}.html`);
    const pngPath = path.join(SLIDES_DIR, `${scene.id}.png`);
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>${CSS}</style>
</head>
<body>
  ${scene.html}
  <div class="subtitle-bar">💬 ${scene.subtitle}</div>
</body>
</html>`;
    fs.writeFileSync(htmlPath, fullHtml);

    // 3. Render Slide PNG via Chrome Headless
    console.log(`  📸 Rendering 1080p slide PNG...`);
    execSync(`"${CHROME_BIN}" --headless --disable-gpu --window-size=1920,1080 --screenshot="${pngPath}" "file://${htmlPath}" 2>/dev/null`);

    // 4. Generate MP4 clip combining Slide PNG + Audio
    const clipPath = path.join(CLIPS_DIR, `${scene.id}.mp4`);
    console.log(`  🎞️ Encoding scene MP4 clip...`);
    execSync(`ffmpeg -y -loop 1 -framerate 30 -i "${pngPath}" -i "${wavPath}" -c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -t ${duration} -shortest "${clipPath}" -loglevel error`);

    clipFiles.push(clipPath);
  }

  // 5. Concatenate all clips into final video
  console.log(`\n📦 Assembling master video demonstration...`);
  const concatListPath = path.join(DEMO_DIR, 'concat_list.txt');
  const concatContent = clipFiles.map(f => `file '${f}'`).join('\n');
  fs.writeFileSync(concatListPath, concatContent);

  execSync(`ffmpeg -y -f concat -safe 0 -i "${concatListPath}" -c:v copy -c:a copy "${OUTPUT_MP4}" -loglevel error`);

  const stats = fs.statSync(OUTPUT_MP4);
  console.log(`\n🎉 Success! Master Video generated at:`);
  console.log(`   ${OUTPUT_MP4} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
}

main().catch(err => {
  console.error('❌ Error during video generation:', err);
  process.exit(1);
});
