// faucet/flare-solverr.js
// Menggunakan FlareSolverr (Docker) - paling tahan terhadap update Cloudflare

const axios = require('axios');

class FlareSolverrClient {
  constructor(baseUrl = 'http://localhost:8191/v1') {
    this.baseUrl = baseUrl;
    this.timeout = 120000; // 120 detik untuk menyelesaikan challenge
  }

  async get(url, maxTimeout = 60000) {
    try {
      const response = await axios.post(this.baseUrl, {
        cmd: 'request.get',
        url: url,
        maxTimeout: maxTimeout,
        cookies: [], // opsional, bisa simpan cookies dari session sebelumnya
      }, {
        timeout: this.timeout,
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.status === 'ok') {
        return {
          success: true,
          html: response.data.solution.response,
          cookies: response.data.solution.cookies,
          userAgent: response.data.solution.userAgent,
          status: response.data.solution.status
        };
      } else {
        throw new Error(`FlareSolverr error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('[FlareSolverr] Request gagal:', error.message);
      return { success: false, error: error.message };
    }
  }

  async post(url, postData, maxTimeout = 60000) {
    try {
      const response = await axios.post(this.baseUrl, {
        cmd: 'request.post',
        url: url,
        postData: postData,
        maxTimeout: maxTimeout,
      }, {
        timeout: this.timeout,
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.status === 'ok') {
        return {
          success: true,
          html: response.data.solution.response,
          cookies: response.data.solution.cookies,
          status: response.data.solution.status
        };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('[FlareSolverr] POST gagal:', error.message);
      return { success: false, error: error.message };
    }
  }
}

// Fungsi khusus untuk claim faucet di liteforge
async function claimViaFlareSolverr(walletAddress, config) {
  const {
    faucetUrl = 'https://liteforge.hub.caldera.xyz/',
    submitButtonSelector = 'button[type="submit"]', // sesuaikan jika perlu
    walletInputSelector = '#wallet-address'        // sesuaikan dengan inspect element
  } = config;

  const client = new FlareSolverrClient();
  
  // Langkah 1: Dapatkan halaman faucet (otomatis solve Cloudflare)
  console.log('[Faucet] Mengakses halaman faucet...');
  const pageResult = await client.get(faucetUrl, 90000);
  if (!pageResult.success) {
    throw new Error('Gagal melewati Cloudflare: ' + pageResult.error);
  }
  
  // Langkah 2: Ekstrak CSRF token jika ada (opsional, sesuaikan dengan parsing HTML)
  // Karena kita tidak bisa DOM parsing dengan mudah di sini, kita akan gunakan regex sederhana
  // Atau alternatif: kita bisa gunakan FlareSolverr dengan session cookie untuk POST langsung
  // Tapi karena kebanyakan faucet pakai form sederhana, kita lakukan POST dengan data.
  
  // Asumsikan faucet menerima POST ke endpoint /claim dengan field 'address'
  const claimEndpoint = `${faucetUrl}claim`; // sesuaikan
  const postData = `address=${encodeURIComponent(walletAddress)}`;
  
  console.log('[Faucet] Mengirim claim...');
  const claimResult = await client.post(claimEndpoint, postData, 60000);
  
  if (claimResult.success && claimResult.status === 200) {
    console.log('[Faucet] Claim berhasil!');
    return { success: true, response: claimResult.html };
  } else {
    console.error('[Faucet] Claim gagal:', claimResult.error);
    return { success: false, error: claimResult.error };
  }
}

module.exports = { FlareSolverrClient, claimViaFlareSolverr };
