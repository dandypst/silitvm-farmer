import { ethers } from 'ethers';
import { CONFIG } from '../config.js';
import { getLiteForgeWallet } from '../utils/wallet.js';
import { randomAmount } from '../utils/delay.js';
import { log } from '../utils/logger.js';

const ZERO = '0x0000000000000000000000000000000000000000';

export async function runSwap() {
  log('Memulai aksi: Swap di LitDeX');

  const { address, abi } = CONFIG.contracts.litdexRouter;

  if (address === ZERO || abi.length === 0) {
    log('SKIP: kontrak LitDeX belum diisi di config.js', 'WARN');
    return;
  }

  const wallet = getLiteForgeWallet();
  const contract = new ethers.Contract(address, abi, wallet);
  const amount = randomAmount(0.0156, 0.0734, 4);
  const amountWei = ethers.parseEther(amount.toString());

  try {
    // ============================================
    // PERHATIAN: nama fungsi ini ASUMSI.
    // Router DEX biasa pakai pola Uniswap:
    //   - swapExactTokensForTokens(amountIn, amountOutMin, path[], to, deadline)
    //   - swapExactETHForTokens(...)
    // Sesuaikan setelah dapat ABI sebenarnya.
    // ============================================
    const deadline = Math.floor(Date.now() / 1000) + 600; // 10 menit
    const tx = await contract.swap(amountWei, 0n, deadline, {
      gasLimit: 500000n,
      value: amountWei, // kalau swap dari native token
    });
    log(`Swap tx: ${tx.hash} (${amount} zkLTC)`);
    const receipt = await tx.wait();
    log(`Swap confirmed di block ${receipt.blockNumber}`);
  } catch (err) {
    log(`Swap gagal: ${err.message}`, 'ERROR');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runSwap();
}
