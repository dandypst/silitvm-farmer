import { ethers } from 'ethers';
import { CONFIG } from '../config.js';
import { getLiteForgeWallet } from '../utils/wallet.js';
import { randomAmount } from '../utils/delay.js';
import { log } from '../utils/logger.js';

const ZERO = '0x0000000000000000000000000000000000000000';

export async function runBridge() {
  log('Memulai aksi: Bridge Multyra');

  const { address, abi } = CONFIG.contracts.multyraBridge;

  if (address === ZERO || abi.length === 0) {
    log('SKIP: kontrak Multyra belum diisi di config.js', 'WARN');
    return;
  }

  const wallet = getLiteForgeWallet();
  const contract = new ethers.Contract(address, abi, wallet);

  // Jumlah acak antara 0.0123 dan 0.0987 zkLTC (decimal natural)
  const amount = randomAmount(0.0123, 0.0987, 4);
  const amountWei = ethers.parseEther(amount.toString());

  try {
    // ============================================
    // PERHATIAN: nama fungsi 'bridge' ini ASUMSI.
    // Cek ABI sebenarnya. Kemungkinan nama lain:
    //   - deposit(uint256)
    //   - bridgeToEthereum(uint256, address)
    //   - send(uint256, ...)
    // Sesuaikan setelah dapat ABI dari explorer.
    // ============================================
    const tx = await contract.bridge(amountWei, {
      gasLimit: 300000n,
    });
    log(`Bridge tx terkirim: ${tx.hash} (${amount} zkLTC)`);
    const receipt = await tx.wait();
    log(`Bridge confirmed di block ${receipt.blockNumber}`);
  } catch (err) {
    log(`Bridge gagal: ${err.message}`, 'ERROR');
  }
}

// Jalankan langsung kalau dipanggil via `node actions/bridge.js`
if (import.meta.url === `file://${process.argv[1]}`) {
  runBridge();
}
