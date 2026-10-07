import { neon } from '@neondatabase/serverless';

declare const process: any;

const DEFAULT_TYPESAFE_KEY = process.env.TYPESAFE_API_KEY || "";
const DATABASE_URL = process.env.DATABASE_URL || "";

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ detail: "Method not allowed" });
  }

  const { state, questions, model = "jev-latest", pipeline_id = "custom" } = req.body || {};

  if (!state || !questions) {
    return res.status(400).json({ detail: "State and questions are required" });
  }

  const apiKey = req.headers['x-desicio-api-key'] || req.headers['authorization']?.replace('Bearer ', '') || DEFAULT_TYPESAFE_KEY;

  const t0 = performance.now();
  try {
    const jevRes = await fetch("https://api.typesafe.ai/v1/systemone", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ model, state, questions })
    });

    const latency_ms = Math.round(performance.now() - t0);

    if (!jevRes.ok) {
      const errText = await jevRes.text();
      return res.status(jevRes.status).send(errText);
    }

    const jevData = await jevRes.json();
    const decId = `dec_${Date.now()}`;
    const record = {
      id: decId,
      created_at: new Date().toISOString(),
      pipeline_id,
      state,
      questions,
      answers: jevData.answers,
      model: jevData.model || model,
      usage: jevData.usage || {},
      latency_ms
    };

    // Persist to Neon Postgres
    if (DATABASE_URL) {
      try {
        const sql = neon(DATABASE_URL);
        await sql`
          INSERT INTO decisions (id, pipeline_id, state, questions, answers, latency_ms, tokens_used, model, status)
          VALUES (
            gen_random_uuid(),
            ${pipeline_id},
            ${state},
            ${JSON.stringify(questions)},
            ${JSON.stringify(jevData.answers)},
            ${latency_ms},
            ${JSON.stringify(jevData.usage || {})},
            ${jevData.model || model},
            'completed'
          );
        `;
      } catch (dbErr) {
        console.error("Neon write warning:", dbErr);
      }
    }

    return res.status(200).json(record);
  } catch (error: any) {
    return res.status(500).json({ detail: error.message });
  }
}
