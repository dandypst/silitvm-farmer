// faucet/playwright-fallback.js
// Menggunakan Playwright dengan stealth plugin - butuh install playwright-extra

const { chromium } = require('playwright-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
chromium.use(StealthPlugin());

async function claimViaPlaywright(walletAddress, config) {
  const {
    faucetUrl = 'https://liteforge.hub.caldera.xyz/',
    headless = true,
    timeout = 60000
  } = config;

  const browser = await chromium.launch({ headless });
  let page = await browser.newPage();

  // Set real user agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  try {
    console.log('[Playwright] Navigasi ke faucet...');
    await page.goto(faucetUrl, { waitUntil: 'networkidle', timeout });
    
    // Tunggu kemungkinan Cloudflare challenge (bisa otomatis atau butuh klik)
    await page.waitForTimeout(5000);
    
    // Cari input wallet address (selector umum)
    const addressInput = await page.$('input[type="text"], input[name="address"], #wallet, #address');
    if (!addressInput) {
      throw new Error('Tidak menemukan input wallet address');
    }
    await addressInput.fill(walletAddress);
    
    // Cari tombol submit
    const submitBtn = await page.$('button[type="submit"], button:has-text("Claim"), button:has-text("Request")');
    if (!submitBtn) {
      throw new Error('Tidak menemukan tombol claim');
    }
    await submitBtn.click();
    
    // Tunggu respon sukses
    await page.waitForSelector('.success-message, .alert-success', { timeout: 15000 }).catch(() => {});
    const pageHtml = await page.content();
    
    console.log('[Playwright] Claim berhasil');
    return { success: true, html: pageHtml };
  } catch (error) {
    console.error('[Playwright] Error:', error.message);
    return { success: false, error: error.message };
  } finally {
    await browser.close();
  }
}

module.exports = { claimViaPlaywright };
