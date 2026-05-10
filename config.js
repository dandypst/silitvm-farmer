import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
  rpc: {
    liteforge: process.env.LITEFORGE_RPC,
    sepolia: process.env.SEPOLIA_RPC,
  },
  chainId: {
    liteforge: parseInt(process.env.LITEFORGE_CHAIN_ID || '0'),
  },
  delays: {
    min: parseInt(process.env.MIN_DELAY_SECONDS || '120') * 1000,
    max: parseInt(process.env.MAX_DELAY_SECONDS || '900') * 1000,
  },
  dailyLimit: parseInt(process.env.DAILY_RUN_LIMIT || '8'),

  // ====================================================
  // ISI BAGIAN INI SETELAH KAMU INTERAKSI MANUAL DULU
  // Cara: setelah tx manual, buka explorer LiteForge,
  // klik tx kamu, salin address di field "to:" dan ABI
  // dari tab "Contract" (kalau verified).
  // ====================================================
  contracts: {
    multyraBridge: {
      address: '0x0000000000000000000000000000000000000000',
      abi: [],
    },
    ayniLending: {
      address: '0x0000000000000000000000000000000000000000',
      abi: [],
    },
    litdexRouter: {
      address: '0x0000000000000000000000000000000000000000',
      abi: [],
    },
    zkLTC: {
      address: '0x0000000000000000000000000000000000000000',
      abi: [
        'function balanceOf(address) view returns (uint256)',
        'function approve(address spender, uint256 amount) returns (bool)',
        'function allowance(address owner, address spender) view returns (uint256)',
        'function decimals() view returns (uint8)',
      ],
    },
  },
};
