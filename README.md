# Reya Portfolio Tracker

A real-time portfolio tracking application for Reya DEX that displays positions with live price updates via WebSocket.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+

### Installation

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

The app will be available at `http://localhost:5173`.

## Solution Overview

### Architecture

The application follows a clean separation of concerns:

```
src/
├── components/       # React components
├── hooks/            # Custom React hooks
├── services/         # API and WebSocket services
├── store.ts          # Zustand state management
├── types/            # TypeScript interfaces
└── lib/              # Utility functions
```

### Real-Time Price Updates

Real-time updates are handled via WebSocket connection to `wss://ws.reya.xyz`:

1. **Connection Management** (`services/websocket.ts`)

   - Subscribes to `/v2/prices` channel for live oracle prices
   - Implements ping/pong heartbeat to maintain connection
   - Auto-reconnects on connection loss (3s delay)
   - Gracefully handles manual disconnection

2. **Performance Optimization**

   - **Threshold-based updates**: Only updates the store when price deviates by ≥1 bip (0.01%) from the last stored price. This prevents excessive re-renders from micro-fluctuations.
   - **Conditional connection**: WebSocket only connects when a wallet is connected (no unnecessary connections on initial load)

3. **Visual Feedback** (`components/ui/animated-number.tsx`)
   - Numbers animate smoothly using Framer Motion springs
   - Color flash indicates direction: green for price increase, red for decrease
   - Connection status indicator shows Live/Connecting/Offline state

### State Management

State is managed with [Zustand](https://zustand-demo.pmnd.rs/), split into three focused stores:

| Store               | Purpose          | Persistence  |
| ------------------- | ---------------- | ------------ |
| `useWalletStore`    | Wallet address   | localStorage |
| `usePositionsStore` | User positions   | Memory       |
| `usePricesStore`    | Real-time prices | Memory       |

**Design decisions:**

- **Separate stores** for better separation of concerns and targeted subscriptions
- **Wallet persistence** via Zustand's `persist` middleware - survives page refresh
- **Positions & prices in memory** - fetched fresh on each session for data accuracy

### Data Flow

```
┌─────────────────┐
│  User connects  │
│     wallet      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Fetch positions │────▶│  Fetch prices   │
│   (REST API)    │     │   (REST API)    │
└────────┬────────┘     └────────┬────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│PositionsStore   │     │  PricesStore    │
└────────┬────────┘     └────────┬────────┘
         │                       ▲
         │              ┌────────┴────────┐
         │              │   WebSocket     │
         │              │ (real-time)     │
         │              └─────────────────┘
         ▼
┌─────────────────────────────────┐
│       PositionsTable            │
│  (sorted by value, animated)    │
└─────────────────────────────────┘
```

## Testing the Application

### Manual Testing

1. **Initial state**: Open the app - should show "Connect a wallet" message, WebSocket status "Offline"
2. **Connect wallet**: Enter an Ethereum address (e.g., `0xf626e9a2fddbf55b0b1a87c56128a7ba6723a85a`)
3. **Positions load**: Table populates with positions, WebSocket connects showing "Live"
4. **Real-time updates**: Watch position values and mark prices animate as prices change
5. **Persistence**: Refresh the page - wallet should remain connected
6. **Disconnect**: Clear localStorage or implement a disconnect button

### Example Wallet Addresses

```
0xf626e9a2fddbf55b0b1a87c56128a7ba6723a85a
```

## Deployment Strategy

### Build & Deploy

```bash
# Production build
bun run build

# Output in dist/ - deploy to any static host
```

### Hosting

- https://reya-solution.vercel.app/

## Tech Stack

- **React 19** with React Compiler
- **TypeScript** for type safety
- **Zustand** for state management
- **Framer Motion** for animations
- **Tailwind CSS 4** for styling
- **Radix UI** for accessible components
- **Vite 7** for bundling

## License

Private - Reya DEX coding challenge solution.
