import { ethers } from 'ethers';
import { CONFIG } from '../config.js';
import { getLiteForgeWallet } from '../utils/wallet.js';
import { randomAmount } from '../utils/delay.js';
import { log } from '../utils/logger.js';

const ZERO = '0x0000000000000000000000000000000000000000';

export async function runLend() {
  log('Memulai aksi: Lend di Ayni Labs');

  const { address, abi } = CONFIG.contracts.ayniLending;

  if (address === ZERO || abi.length === 0) {
    log('SKIP: kontrak Ayni belum diisi di config.js', 'WARN');
    return;
  }

  const wallet = getLiteForgeWallet();
  const contract = new ethers.Contract(address, abi, wallet);
  const amount = randomAmount(0.0234, 0.1543, 4);
  const amountWei = ethers.parseEther(amount.toString());

  try {
    // ============================================
    // PERHATIAN: nama fungsi ini ASUMSI.
    // Pola umum lending: supply, deposit, mint
    // Cek docs Ayni Labs atau ABI dari explorer.
    // ============================================
    const tx = await contract.supply(amountWei, {
      gasLimit: 400000n,
    });
    log(`Supply tx: ${tx.hash} (${amount} zkLTC)`);
    const receipt = await tx.wait();
    log(`Supply confirmed di block ${receipt.blockNumber}`);
  } catch (err) {
    log(`Lend gagal: ${err.message}`, 'ERROR');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runLend();
}
