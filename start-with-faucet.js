// start-with-faucet.js
require('dotenv').config();
const { ethers } = require('ethers');
const config = require('./config');
const { claimFaucet } = require('./faucet');
const { checkBalance, performFarmingCycle } = require('./index'); // asumsikan fungsi2 ada di index

async function ensureSufficientBalance(wallet, minBalanceWei) {
  const balance = await wallet.getBalance();
  if (balance.lt(minBalanceWei)) {
    console.log(`[Auto-Claim] Saldo rendah: ${ethers.utils.formatEther(balance)} zkLTC, mencoba claim...`);
    const result = await claimFaucet(wallet.address, config.faucet);
    if (result.success) {
      console.log('[Auto-Claim] Claim sukses, tunggu 30 detik untuk update saldo...');
      await new Promise(resolve => setTimeout(resolve, 30000));
      const newBalance = await wallet.getBalance();
      console.log(`[Auto-Claim] Saldo baru: ${ethers.utils.formatEther(newBalance)} zkLTC`);
      return newBalance.gte(minBalanceWei);
    } else {
      console.error('[Auto-Claim] Gagal claim faucet:', result.error);
      return false;
    }
  }
  return true;
}

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const minBalanceWei = ethers.utils.parseEther(String(config.faucet.minBalanceLTC));
  
  console.log('Memulai farmer dengan auto-faucet...');
  
  while (true) {
    try {
      const hasBalance = await ensureSufficientBalance(wallet, minBalanceWei);
      if (hasBalance) {
        await performFarmingCycle(wallet); // asumsikan fungsi ini ada
      } else {
        console.log('Saldo tidak mencukupi setelah claim, tunggu cooldown...');
        await new Promise(resolve => setTimeout(resolve, config.faucet.claimCooldownMinutes * 60 * 1000));
      }
    } catch (error) {
      console.error('Error di farming cycle:', error);
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  }
}

if (require.main === module) {
  main().catch(console.error);
}
