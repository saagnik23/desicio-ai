export default function handler(req: any, res: any) {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    database: "neon_postgres",
    deployment: "vercel_serverless",
    engine: "jev-system-one"
  });
}
