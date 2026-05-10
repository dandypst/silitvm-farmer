import { CONFIG } from './config.js';
import { randomDelay, shuffle } from './utils/delay.js';
import { log } from './utils/logger.js';
import { runBridge } from './actions/bridge.js';
import { runLend } from './actions/lend.js';
import { runSwap } from './actions/swap.js';

const ACTIONS = [
  { name: 'bridge', fn: runBridge, weight: 1 },
  { name: 'lend',   fn: runLend,   weight: 2 },
  { name: 'swap',   fn: runSwap,   weight: 2 },
];

async function singleRun() {
  // Bangun pool aksi sesuai weight, lalu kocok urutannya
  const pool = ACTIONS.flatMap(a => Array(a.weight).fill(a));
  const sequence = shuffle(pool);

  log(`Run dimulai. Urutan: ${sequence.map(a => a.name).join(' -> ')}`);

  for (const action of sequence) {
    try {
      await action.fn();
    } catch (err) {
      log(`${action.name} crash: ${err.message}`, 'ERROR');
    }
    await randomDelay(CONFIG.delays.min, CONFIG.delays.max);
  }

  log('Run selesai.');
}

async function main() {
  log('=== LitVM Farmer dimulai ===');
  log(`Daily limit: ${CONFIG.dailyLimit} run`);

  for (let i = 1; i <= CONFIG.dailyLimit; i++) {
    log(`--- Run ${i}/${CONFIG.dailyLimit} ---`);
    await singleRun();

    if (i < CONFIG.dailyLimit) {
      // Jeda lebih panjang antar run (1-3 jam dalam detik)
      const longDelaySec = Math.random() * (3 * 3600 - 1 * 3600) + 1 * 3600;
      log(`Tidur ${(longDelaySec / 60).toFixed(1)} menit sebelum run berikutnya...`);
      await new Promise(r => setTimeout(r, longDelaySec * 1000));
    }
  }

  log('=== Semua run hari ini selesai ===');
}

main().catch(err => {
  log(`FATAL: ${err.message}`, 'ERROR');
  process.exit(1);
});
