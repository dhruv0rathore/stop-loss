# 🛑 Decentralized Stop-Loss Module – Backend

A backend system for a decentralized stop-loss trading module built using **FastAPI** and **Web3.py**, integrated with **Hyperliquid Testnet** for price feeds and **Arbitrum Sepolia** for on-chain state syncing.

---

## 🚀 Features

- Register stop-loss orders via REST API
- Subscribe to live price feeds using WebSockets
- Auto-execute market sell trades (mock or real)
- Persist state locally using JSON
- Sync triggered orders on-chain via smart contract
- Listen to `StopLossRegistered` on-chain events and reflect them in backend
- Basic unit tests to verify registration and trigger logic

---

## 🧱 Tech Stack

- **Python 3.10+**
- **FastAPI** (REST API)
- **Web3.py** (Blockchain interactions)
- **httpx** (HTTP client)
- **websockets** (Hyperliquid feed)
- **dotenv** (Environment config)
- **unittest** (Testing)

---

## 📁 Project Structure

### Frontend CDN Libraries

These are loaded via `<script>` tags in `index.html`:

- [Tailwind CSS](https://cdn.tailwindcss.com)
- [Ethers.js v5.7.2 (UMD build)](https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js)

Requirements - 
fastapi
uvicorn
websockets
httpx
pydantic
python-dotenv
web3
eth-account

## Stop Loss Module

A real-time cryptocurrency stop loss module that integrates with the Hyperliquid testnet for price feeds and smart contracts for automated trading.

## Features

- Real-time price tracking for ETH and BTC
- Interactive price charts
- MetaMask wallet integration
- Smart contract-based stop loss orders
- Backend price monitoring and execution

## Prerequisites

- Node.js 18+
- Python 3.8+
- MetaMask browser extension
- Git

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd stop-loss-module
```

2. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

4. Create a `.env` file in the root directory with your configuration:
```env
PRIVATE_KEY=your_private_key
WALLET_ADDRESS=your_wallet_address
ALCHEMY_API_KEY=your_alchemy_api_key
CONTRACT_ADDRESS=your_contract_address
```

5. Create a `.env` file in the frontend directory:
```env
VITE_CONTRACT_ADDRESS=your_contract_address
```

## Running the Application

1. Start the backend server:
```bash
cd backend
python api.py
```

2. In a new terminal, start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Connect your MetaMask wallet using the "Connect Wallet" button
2. Monitor real-time prices using the interactive charts
3. Set stop loss orders by:
   - Selecting the desired cryptocurrency (ETH or BTC)
   - Entering the stop loss price
   - Specifying the position size
   - Clicking "Set Stop Loss"

## Architecture

- Frontend:
  - React + TypeScript
  - Vite for build tooling
  - shadcn/ui for components
  - ethers.js for blockchain interaction
  - Recharts for price charts
  - WebSocket for real-time price updates

- Backend:
  - FastAPI for REST API
  - WebSocket client for Hyperliquid price feeds
  - Smart contract integration for order execution

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

