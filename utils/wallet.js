import { ethers } from 'ethers';
import { CONFIG } from '../config.js';

function validatePrivateKey() {
  const pk = process.env.PRIVATE_KEY;
  if (!pk) {
    throw new Error('PRIVATE_KEY tidak ada di .env');
  }
  if (!pk.startsWith('0x') || pk.length !== 66) {
    throw new Error('PRIVATE_KEY format tidak valid (harus 0x + 64 karakter hex)');
  }
  return pk;
}

export function getLiteForgeWallet() {
  const pk = validatePrivateKey();
  if (!CONFIG.rpc.liteforge) {
    throw new Error('LITEFORGE_RPC kosong di .env');
  }
  const provider = new ethers.JsonRpcProvider(CONFIG.rpc.liteforge);
  return new ethers.Wallet(pk, provider);
}

export function getSepoliaWallet() {
  const pk = validatePrivateKey();
  if (!CONFIG.rpc.sepolia) {
    throw new Error('SEPOLIA_RPC kosong di .env');
  }
  const provider = new ethers.JsonRpcProvider(CONFIG.rpc.sepolia);
  return new ethers.Wallet(pk, provider);
}
