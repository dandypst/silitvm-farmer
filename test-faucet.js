// test-faucet.js
require('dotenv').config();
const { claimFaucet } = require('./faucet');

const testWallet = "0x1234567890123456789012345678901234567890"; // ganti dengan address testing

claimFaucet(testWallet, {
  faucetUrl: 'https://liteforge.hub.caldera.xyz/'
}).then(result => {
  console.log('Hasil claim:', result);
}).catch(console.error);
