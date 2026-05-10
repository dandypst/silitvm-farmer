import fs from 'fs';
import path from 'path';

const LOG_DIR = './logs';
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

const today = new Date().toISOString().split('T')[0];
const logFile = path.join(LOG_DIR, `run-${today}.log`);

export function log(msg, level = 'INFO') {
  const ts = new Date().toISOString();
  const line = `[${ts}] [${level}] ${msg}`;
  console.log(line);
  fs.appendFileSync(logFile, line + '\n');
}
