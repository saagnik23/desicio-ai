-- =========================================================================
-- DESICIO.AI (Ultra-Fast System 1 Decision Engine) - Neon Postgres Schema
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Pipelines Table (predefined decision blueprints)
CREATE TABLE IF NOT EXISTS pipelines (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',
    questions JSONB NOT NULL,
    sample_state TEXT,
    created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL
);

-- 2. Decisions Table (audit log of every high-speed decision evaluation)
CREATE TABLE IF NOT EXISTS decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pipeline_id TEXT REFERENCES pipelines(id) ON DELETE SET NULL,
    state TEXT NOT NULL,
    questions JSONB NOT NULL,
    answers JSONB NOT NULL,
    latency_ms NUMERIC(10, 2) NOT NULL,
    tokens_used JSONB,
    model TEXT DEFAULT 'jev-latest',
    confidence_aggregate NUMERIC(5, 4),
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL
);

-- Indexes for ultra-fast queries & analytics
CREATE INDEX IF NOT EXISTS idx_decisions_created_at ON decisions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_decisions_pipeline_id ON decisions(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_decisions_latency ON decisions(latency_ms);

-- 3. Benchmarks Table
CREATE TABLE IF NOT EXISTS benchmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    engine_name TEXT NOT NULL,
    task_name TEXT NOT NULL,
    latency_ms NUMERIC(10, 2) NOT NULL,
    cost_per_100k_calls NUMERIC(10, 5) NOT NULL,
    schema_compliance_pct NUMERIC(5, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL
);

-- 4. Seed Core Enterprise Pipelines
INSERT INTO pipelines (id, name, description, category, questions, sample_state)
VALUES
(
    'support-triage',
    'Customer Support Triage & Auto-Escalation',
    'Classifies customer intent, measures urgency, and determines human escalation threshold in sub-200ms.',
    'Customer Operations',
    '{
        "urgency": {
            "type": "score",
            "instructions": "How urgent is this customer inquiry?",
            "criteria": ["low", "medium", "high", "critical"]
        },
        "requires_human": {
            "type": "noul",
            "instructions": "Does this message warrant immediate human intervention?"
        },
        "department": {
            "type": "choice",
            "instructions": "Which department should handle this ticket?",
            "criteria": {
                "billing": "Payment, invoice, refund or charge issues",
                "technical": "Software bugs, error messages, outage or performance issues",
                "sales": "Pricing, plan upgrades or new subscription inquiries",
                "legal": "Threat of litigation, terms violation or compliance disputes"
            }
        }
    }'::jsonb,
    'Customer: I was billed $499 twice on my card this morning and my team cannot access the dashboard during our product launch. If this is not fixed in 1 hour I will cancel and dispute the charge.'
),
(
    'fraud-sentinel',
    'FinTech Fraud & Risk Sentinel',
    'Scores transaction risk, flags suspicious signals, and triggers automated account freezes.',
    'Risk & Security',
    '{
        "risk_level": {
            "type": "score",
            "instructions": "Evaluate transactional risk score based on geographic anomaly and velocity.",
            "criteria": ["nominal", "elevated", "high_risk", "critical_freeze"]
        },
        "block_transaction": {
            "type": "noul",
            "instructions": "Should this transaction be blocked immediately?"
        },
        "anomaly_type": {
            "type": "choice",
            "instructions": "Primary anomaly category observed",
            "criteria": {
                "geo_velocity": "Card presented in two countries within 30 minutes",
                "amount_spike": "Order size 20x higher than customer 90-day average",
                "new_device": "Unrecognized device fingerprint with VPN detected",
                "clean": "Normal user transaction behavior"
            }
        }
    }'::jsonb,
    'Transaction: $4,850.00 luxury watch purchase from IP in Lagos, Nigeria. Account owner registered in Chicago, USA with last physical card swipe 14 minutes ago in Chicago.'
),
(
    'lead-scorer',
    'B2B Sales Lead Qualification & Route',
    'Instantly qualifies inbound sales inquiries into Enterprise, Mid-Market, or Self-Serve tiers.',
    'Revenue Operations',
    '{
        "intent_score": {
            "type": "score",
            "instructions": "Score purchase intent and commercial readiness.",
            "criteria": ["tire_kicker", "exploratory", "high_intent", "ready_to_buy"]
        },
        "high_touch_sdr": {
            "type": "noul",
            "instructions": "Assign dedicated Senior Account Executive for outbound call within 5 mins?"
        },
        "segment_tier": {
            "type": "choice",
            "instructions": "Select target go-to-market segment",
            "criteria": {
                "enterprise": "500+ employees or budget over $100k/yr",
                "mid_market": "50-499 employees with active budget",
                "self_serve": "Under 50 employees or student/individual user"
            }
        }
    }'::jsonb,
    'Lead: VP of Engineering at a 1,200 person FinTech company. Message: Looking to replace our slow OpenAI classification pipeline across 4M daily transactions. Budget is approved for Q4 rollout.'
),
(
    'agent-router',
    'Autonomous Agent Tool & Intent Dispatcher',
    'Sub-100ms routing layer for multi-agent architectures to decide which tool to dispatch.',
    'AI Systems',
    '{
        "execution_complexity": {
            "type": "score",
            "instructions": "Assess agent planning depth and execution complexity.",
            "criteria": ["single_shot", "multi_step", "complex_workflow", "human_approval_required"]
        },
        "requires_safety_check": {
            "type": "noul",
            "instructions": "Does this action involve sensitive database write or external payment?"
        },
        "tool_dispatch": {
            "type": "choice",
            "instructions": "Determine optimal downstream execution tool",
            "criteria": {
                "read_database": "Retrieve information from PostgreSQL or vector index",
                "execute_payment": "Call Stripe API to process customer billing",
                "call_llm": "Route to generative LLM for creative prose composition",
                "human_review": "Pause pipeline and request manager signoff"
            }
        }
    }'::jsonb,
    'Agent Step: User asked to refund $1,200 to customer account #8942 and send an apology note.'
)
ON CONFLICT (id) DO NOTHING;
