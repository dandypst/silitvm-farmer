// faucet/index.js
// Memilih metode otomatisasi terbaik yang tersedia

const { claimViaFlareSolverr } = require('./flare-solverr');
const { claimViaPlaywright } = require('./playwright-fallback');

async function claimFaucet(walletAddress, config = {}) {
  // Coba FlareSolverr dulu (jika server berjalan)
  try {
    console.log('[Faucet] Mencoba metode FlareSolverr...');
    const result = await claimViaFlareSolverr(walletAddress, config);
    if (result.success) return result;
  } catch (e) {
    console.log('[Faucet] FlareSolverr gagal:', e.message);
  }
  
  // Fallback ke Playwright
  console.log('[Faucet] Fallback ke Playwright...');
  return await claimViaPlaywright(walletAddress, config);
}

module.exports = { claimFaucet };
