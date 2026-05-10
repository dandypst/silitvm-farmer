# LitVM Farmer

Skrip multi-dApp untuk berinteraksi dengan testnet LiteForge (LitVM) — Multyra Bridge, Ayni Labs Lending, dan LitDeX Swap.

> **Disclaimer**: Skrip ini adalah template/skeleton. Kontrak address dan ABI HARUS kamu isi sendiri setelah interaksi manual di tiap dApp. Tidak ada jaminan airdrop dari LitVM atau dApp manapun. Pakai dengan tanggung jawab sendiri.

## Persyaratan

- Node.js 20+ ([download di sini](https://nodejs.org))
- Wallet **baru** khusus farming (JANGAN pakai wallet utama)
- zkLTC dari faucet LiteForge

## Struktur

```
litvm-farmer/
├── .env.example          template config (di-commit)
├── .env                  config asli (JANGAN di-commit, sudah di .gitignore)
├── .gitignore
├── package.json
├── config.js             kontrak addresses + RPC
├── index.js              orchestrator utama
├── utils/
│   ├── wallet.js
│   ├── delay.js
│   └── logger.js
└── actions/
    ├── bridge.js         Multyra
    ├── lend.js           Ayni Labs
    └── swap.js           LitDeX
```

## Cara Pakai

### 1. Clone repo

```bash
git clone <url-repo-private-kamu>
cd litvm-farmer
```

### 2. Install dependency

```bash
npm install
```

### 3. Setup environment

```bash
cp .env.example .env
```

Edit `.env` dengan editor (Notepad / VSCode), isi:
- `PRIVATE_KEY` — dari wallet **baru** khusus farming
- `LITEFORGE_RPC` — verifikasi di [chainlist.org](https://chainlist.org) atau docs LitVM
- `LITEFORGE_CHAIN_ID` — sesuaikan

### 4. Isi kontrak addresses

Buka `config.js`. Bagian `contracts` masih placeholder (`0x000...0000`).

Cara mendapatkan kontrak address sebenarnya:

1. Buka tiap dApp di browser (Multyra, Ayni Labs, LitDeX)
2. Lakukan interaksi manual sekali (misal: bridge 0.01 zkLTC)
3. Buka explorer LiteForge, cari tx hash kamu
4. Salin address di field "To:" → itu kontrak yang dipanggil
5. Buka tab "Contract" di explorer (kalau verified) → salin ABI
6. Tempel ke `config.js`

### 5. Test per aksi dulu

Sebelum jalankan otomatis, test satu per satu:

```bash
npm run bridge
npm run lend
npm run swap
```

Kalau error, kemungkinan:
- Nama fungsi di kontrak beda (cek ABI lagi)
- Gas limit kurang
- Saldo zkLTC kurang
- Belum approve token (untuk swap/lend ERC20)

### 6. Jalankan orchestrator penuh

```bash
npm start
```

Skrip akan jalan dengan urutan acak, jeda acak antar aksi (2-15 menit), dan jeda 1-3 jam antar run. Default: 8 run per hari.

## Keamanan — Wajib Baca

- **Wallet farming harus terpisah dari wallet utama**. Kalau private key bocor, kerugian terbatas.
- `.env` tidak boleh di-commit. Sudah ada di `.gitignore`, tapi cek dulu sebelum `git push`.
- Repo GitHub harus **PRIVATE**, bukan public.
- Jangan jalankan skrip di komputer publik atau yang banyak orang akses.
- Periksa log di folder `logs/` setelah skrip jalan untuk pastikan tidak ada error tersembunyi.

## Pengaturan

Edit di `.env`:

| Variabel | Default | Keterangan |
|----------|---------|------------|
| `MIN_DELAY_SECONDS` | 120 | Jeda minimum antar aksi (detik) |
| `MAX_DELAY_SECONDS` | 900 | Jeda maksimum antar aksi (detik) |
| `DAILY_RUN_LIMIT` | 8 | Jumlah run per eksekusi |

## Catatan Sybil Detection

Tim airdrop modern memantau pola aktivitas. Skrip ini sudah mengacak:
- Urutan aksi (lewat `shuffle`)
- Jeda antar aksi
- Jumlah token (desimal natural, bukan bulat)

Tapi ini **bukan jaminan** lolos sybil filter. Untuk hasil lebih realistis:
- Variasikan waktu run (jangan jalankan jam yang sama tiap hari)
- Sesekali interaksi manual di dApp (bukan cuma bot)
- Jangan jalankan banyak wallet dari IP yang sama tanpa proxy berbeda

## Troubleshooting

**Error: "PRIVATE_KEY format tidak valid"**
→ Pastikan private key dimulai `0x` dan total 66 karakter (0x + 64 hex).

**Error: "could not detect network"**
→ RPC LiteForge salah atau down. Cek di chainlist.org.

**Error: "insufficient funds for gas"**
→ Wallet kekurangan zkLTC. Klaim dari faucet.

**Error: "execution reverted"**
→ Fungsi kontrak yang dipanggil tidak sesuai. Cek ABI lagi.

## Lisensi

MIT — pakai dengan risiko sendiri.
