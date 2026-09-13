# QFS Explorer

Official block explorer for the QFS Network — explore transactions, wallets, tokens, contracts and network activity on the QFS blockchain (Polygon PoS, Chain ID 137).

![QFS Explorer](public/logo.svg)

## Features

- **Real-time overview** — latest blocks, live transactions, network activity charts, QFS supply and gas price
- **Token registry** — verified QFS ecosystem tokens (QFS, GCRM, AlArab, TRAEX, NESG) with prices, holders and supply share
- **Network status** — current network (QFS Polygon) plus the upcoming **QFS Reserve Network** with launch progress tracker (target: Apr 7, 2027)
- **Ecosystem shortcuts** — direct links to QFSPay, QFS DEX, QFS Card and QFS Wallet
- **Full exploration** — blocks, transactions, addresses, token transfers, contract verification and API
- **Wallet portfolio** — connect a wallet to view balances, portfolio value and watchlist

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) + TypeScript |
| UI | Tailwind CSS 4, shadcn/ui, lucide-react |
| Charts | Recharts |
| Runtime | Bun |

## Getting Started

```bash
# install dependencies
bun install

# run the development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

```bash
# production build
bun run build && bun run start

# lint
bun run lint
```

## Project Structure

```
src/
├── app/                 # App Router pages and layout
├── components/
│   └── explorer/        # Explorer UI (overview, views, details, chrome, bits)
├── lib/
│   ├── explorer.ts      # Chain data: tokens, blocks, transactions, portfolio
│   └── utils.ts         # Helpers
└── ...
```

## QFS Ecosystem

| Service | URL |
|---------|-----|
| QFSPay | [qfspay.org](https://qfspay.org) |
| QFS DEX | [dex.qfspay.org](https://dex.qfspay.org/) |
| QFS Card | [card.qfspay.org](https://card.qfspay.org) |
| QFS Wallet | [qfswallet.qfspay.org](https://qfswallet.qfspay.org/) |

## Verified Contracts

| Token | Contract |
|-------|----------|
| QFS | `0xb5787DA56A4eaF11864696d8B5C6671aDF3449E7` |
| GCRM | `0x11175910c6F02913782777840ac008F30720046f` |
| AlArab | `0xF5c068f28eBF91b22e52C2ecD230621879e914B8` |
| TRAEX | `0xf343cD6836FD14bE86aAE0a2a76c8b0e73E89dD0` |
| NESG | `0xE64ceD357672e70fA5cE1fCAEc52c8F690528bcC` |
