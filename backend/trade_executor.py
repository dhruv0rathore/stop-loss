# trade_executor.py

import os
import time
import httpx
from eth_account import Account
from eth_account.messages import encode_defunct
from dotenv import load_dotenv

load_dotenv()

API_URL = "https://api.hyperliquid-testnet.xyz"
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
WALLET_ADDRESS = os.getenv("WALLET_ADDRESS")
MOCK_MODE = os.getenv("MOCK_MODE", "false").lower() == "true"


def sign_message(msg_dict):
    """Sign a message using wallet's private key."""
    if MOCK_MODE:
        return "0xMOCK_SIGNATURE"
        
    message = encode_defunct(text=str(msg_dict))
    signed = Account.sign_message(message, private_key=PRIVATE_KEY)
    return signed.signature.hex()


def execute_trade(market: str, size: float) -> bool:
    if MOCK_MODE:
        print(f"🤖 [MOCK MODE] Executing trade: Sell {size} {market}")
        print(f"🤖 [MOCK MODE] Trade would cost approximately ${size * 1800:.2f} at current market price")
        print(f"🤖 [MOCK MODE] Simulating network delay...")
        time.sleep(1)
        print(f"🤖 [MOCK MODE] Trade executed successfully!")
        return True

    order_payload = {
        "coin": market,
        "isBuy": False,
        "sz": str(size),
        "limitPx": None,  # Market order
        "orderType": "market",
        "timestamp": int(time.time() * 1000),
    }

    signature = sign_message(order_payload)

    request = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "exchange",
        "params": [
            {
                "sender": WALLET_ADDRESS,
                "order": order_payload,
                "sig": signature
            }
        ]
    }

    try:
        headers = {"Content-Type": "application/json"}
        response = httpx.post(API_URL, json=request, headers=headers, timeout=10)
        response.raise_for_status()
        print(f"✅ Trade Executed: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Trade failed: {str(e)}")
        return False

def mark_triggered_onchain(order_id: int, market_price: float):
    if MOCK_MODE:
        print(f"🤖 [MOCK MODE] Marking order #{order_id} as triggered at price ${market_price:.2f}")
        print(f"🤖 [MOCK MODE] Simulating blockchain transaction...")
        time.sleep(2)
        print(f"🤖 [MOCK MODE] Transaction confirmed! Gas used: 0.00042 ETH")
        return True
        
    from web3 import Web3
    from dotenv import load_dotenv
    from pathlib import Path
    import json
    import os

    # Load .env from root
    env_path = Path(__file__).resolve().parent.parent / ".env"
    load_dotenv(dotenv_path=env_path)

    RPC_URL = f"https://arb-sepolia.g.alchemy.com/v2/{os.getenv('ALCHEMY_API_KEY')}"
    PRIVATE_KEY = os.getenv("PRIVATE_KEY")
    CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")

    from pathlib import Path
    abi_path = Path(__file__).resolve().parent / "abi.json"
    with open(abi_path) as f:
        abi = json.load(f)

    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    acct = w3.eth.account.from_key(PRIVATE_KEY)
    contract = w3.eth.contract(address=Web3.to_checksum_address(CONTRACT_ADDRESS), abi=abi)

    try:
        nonce = w3.eth.get_transaction_count(acct.address)
        txn = contract.functions.markTriggered(order_id, int(market_price)).build_transaction({
            'chainId': 421614,  # Arbitrum Sepolia chain ID
            'gas': 250000,
            'gasPrice': w3.eth.gas_price,
            'nonce': nonce,
        })

        signed_txn = w3.eth.account.sign_transaction(txn, private_key=PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)

        print(f"🔁 markTriggered() sent | TX Hash: {tx_hash.hex()}")
        return True

    except Exception as e:
        print(f"❌ Failed to call markTriggered(): {e}")
        return False
