import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 8001;
app.use(
  cors({
    origin: ["https://agas-exam-app.netlify.app", "http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.json());

app.get("/", (req, res) => {
  const uptime = process.uptime();
  const uptimeStr =
    uptime < 60
      ? `${Math.floor(uptime)}s`
      : uptime < 3600
        ? `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`
        : `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`;

  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Backend Status</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #f0f4ff;
      --surface: #ffffff;
      --surface2: #f8faff;
      --border: #e2e8f8;
      --accent: #6366f1;
      --accent2: #8b5cf6;
      --accent3: #06b6d4;
      --green: #10b981;
      --text: #1e1b4b;
      --muted: #64748b;
      --soft: #a5b4fc;
    }

    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Inter', sans-serif;
      background: var(--bg);
      background-image:
        radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.07) 0%, transparent 55%),
        radial-gradient(ellipse at 60% 80%, rgba(6,182,212,0.06) 0%, transparent 50%);
      overflow: hidden;
      position: relative;
    }

    /* Floating orbs */
    body::before, body::after {
      content: '';
      position: fixed;
      border-radius: 50%;
      filter: blur(60px);
      pointer-events: none;
      animation: float 8s ease-in-out infinite;
    }
    body::before {
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%);
      top: -100px; left: -100px;
    }
    body::after {
      width: 300px; height: 300px;
      background: radial-gradient(circle, rgba(6,182,212,0.1), transparent 70%);
      bottom: -80px; right: -80px;
      animation-delay: -4s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-30px) scale(1.05); }
    }

    /* Grid dots background */
    .grid-bg {
      position: fixed;
      inset: 0;
      background-image: radial-gradient(circle, rgba(99,102,241,0.15) 1px, transparent 1px);
      background-size: 32px 32px;
      pointer-events: none;
      mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
    }

    .wrapper {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 520px;
      padding: 24px;
      animation: slideUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Main card */
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 24px;
      box-shadow:
        0 1px 3px rgba(99,102,241,0.06),
        0 8px 24px rgba(99,102,241,0.08),
        0 32px 64px rgba(99,102,241,0.06);
      overflow: hidden;
    }

    .card-header {
      padding: 32px 32px 24px;
      border-bottom: 1px solid var(--border);
      background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
      position: relative;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      background: rgba(16,185,129,0.1);
      border: 1px solid rgba(16,185,129,0.2);
      color: #059669;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      padding: 5px 12px;
      border-radius: 100px;
      margin-bottom: 20px;
    }

    .pulse-dot {
      width: 7px;
      height: 7px;
      background: var(--green);
      border-radius: 50%;
      position: relative;
    }
    .pulse-dot::after {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      background: var(--green);
      opacity: 0.3;
      animation: ripple 1.6s ease-out infinite;
    }
    @keyframes ripple {
      0%   { transform: scale(1); opacity: 0.4; }
      100% { transform: scale(2.5); opacity: 0; }
    }

    .title {
      font-size: 26px;
      font-weight: 700;
      color: var(--text);
      letter-spacing: -0.5px;
      line-height: 1.2;
    }
    .title span {
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      margin-top: 8px;
      font-size: 14px;
      color: var(--muted);
      font-weight: 400;
    }

    /* Stats grid */
    .stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1px;
      background: var(--border);
      border-bottom: 1px solid var(--border);
    }

    .stat {
      background: var(--surface);
      padding: 20px 24px;
      position: relative;
      overflow: hidden;
      transition: background 0.2s;
    }
    .stat:hover { background: var(--surface2); }

    .stat-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      margin-bottom: 12px;
    }

    .stat:nth-child(1) .stat-icon { background: rgba(99,102,241,0.1); }
    .stat:nth-child(2) .stat-icon { background: rgba(16,185,129,0.1); }
    .stat:nth-child(3) .stat-icon { background: rgba(139,92,246,0.1); }
    .stat:nth-child(4) .stat-icon { background: rgba(6,182,212,0.1); }

    .stat-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 18px;
      font-weight: 600;
      color: var(--text);
      letter-spacing: -0.5px;
    }
    .stat-label {
      font-size: 12px;
      color: var(--muted);
      margin-top: 3px;
      font-weight: 500;
    }

    /* Endpoint section */
    .card-body {
      padding: 24px 32px;
    }

    .section-title {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 12px;
    }

    .endpoints {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 24px;
    }

    .endpoint {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 12px;
      background: var(--surface2);
      border: 1px solid var(--border);
      animation: fadeIn 0.5s ease both;
    }
    .endpoint:nth-child(1) { animation-delay: 0.1s; }
    .endpoint:nth-child(2) { animation-delay: 0.2s; }
    .endpoint:nth-child(3) { animation-delay: 0.3s; }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateX(-12px); }
      to   { opacity: 1; transform: translateX(0); }
    }

    .method {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
      letter-spacing: 0.05em;
      min-width: 44px;
      text-align: center;
    }
    .method.get  { background: rgba(16,185,129,0.12); color: #059669; }
    .method.post { background: rgba(99,102,241,0.12); color: var(--accent); }

    .endpoint-path {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: var(--text);
      font-weight: 500;
      flex: 1;
    }

    .endpoint-desc {
      font-size: 12px;
      color: var(--muted);
    }

    /* Footer */
    .card-footer {
      padding: 16px 32px;
      background: var(--surface2);
      border-top: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .env-chip {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 500;
      padding: 4px 10px;
      border-radius: 6px;
      background: rgba(99,102,241,0.1);
      color: var(--accent);
      border: 1px solid rgba(99,102,241,0.2);
    }

    .timestamp {
      font-size: 12px;
      color: var(--muted);
    }

    /* Progress bar */
    .progress-bar {
      height: 3px;
      background: linear-gradient(90deg, var(--accent), var(--accent2), var(--accent3));
      background-size: 200% 100%;
      animation: shimmer 2.5s linear infinite;
    }
    @keyframes shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  </style>
</head>
<body>
  <div class="grid-bg"></div>
  <div class="wrapper">
    <div class="card">
      <div class="progress-bar"></div>
      <div class="card-header">
        <div class="badge">
          <span class="pulse-dot"></span>
          Active
        </div>
        <div class="title">Backend <span>is Running</span></div>
        <div class="subtitle">All systems are operating normally</div>
      </div>

      <div class="stats">
        <div class="stat">
          <div class="stat-icon">⚡</div>
          <div class="stat-value">Online</div>
          <div class="stat-label">Server Status</div>
        </div>
        <div class="stat">
          <div class="stat-icon">⏱</div>
          <div class="stat-value">${uptimeStr}</div>
          <div class="stat-label">Uptime</div>
        </div>
        <div class="stat">
          <div class="stat-icon">🔌</div>
          <div class="stat-value">:${process.env.PORT || 8001}</div>
          <div class="stat-label">Port</div>
        </div>
        <div class="stat">
          <div class="stat-icon">🛡</div>
          <div class="stat-value">JWT + DB</div>
          <div class="stat-label">Auth Stack</div>
        </div>
      </div>

      <div class="card-body">
        <div class="section-title">Endpoints</div>
        <div class="endpoints">
          <div class="endpoint">
            <span class="method get">GET</span>
            <span class="endpoint-path">/</span>
            <span class="endpoint-desc">Status page</span>
          </div>
          <div class="endpoint">
            <span class="method post">POST</span>
            <span class="endpoint-path">/api/auth/register</span>
            <span class="endpoint-desc">Register</span>
          </div>
          <div class="endpoint">
            <span class="method post">POST</span>
            <span class="endpoint-path">/api/auth/login</span>
            <span class="endpoint-desc">Login</span>
          </div>
        </div>
      </div>

      <div class="card-footer">
        <span class="env-chip">NODE ${process.version}</span>
        <span class="timestamp">${new Date().toLocaleString("en-US", { timeZone: "Asia/Baku" })}</span>
      </div>
    </div>
  </div>
</body>
</html>
`);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
