import { neon } from '@neondatabase/serverless';

declare const process: any;

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_Rhm6BD3zbPat@ep-curly-field-b5qbxvgh.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const limit = parseInt(req.query.limit || "20", 10);

  try {
    const sql = neon(DATABASE_URL);
    const rows = await sql`
      SELECT id, pipeline_id, state, questions, answers, latency_ms, tokens_used, model, created_at 
      FROM decisions 
      ORDER BY created_at DESC 
      LIMIT ${limit};
    `;
    return res.status(200).json(rows);
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
}
