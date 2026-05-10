// Jeda acak dalam milidetik
export function randomDelay(minMs, maxMs) {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Jumlah token acak dengan desimal "natural" (bukan angka bulat)
export function randomAmount(min, max, decimals = 4) {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
}

// Pilih satu item acak dari array
export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Kocok urutan array (Fisher-Yates) - biar urutan aksi tidak selalu sama
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
