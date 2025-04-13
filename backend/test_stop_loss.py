import os
import json
from dotenv import load_dotenv
from storage import save_orders, load_orders
from stop_loss_manager import register_stop_loss_logic, stop_loss_orders
from mock_price_feed import simulate_price_movement


load_dotenv()
assert os.getenv("MOCK_MODE", "false").lower() == "true", "MOCK_MODE must be enabled in .env"

def run_test():
    save_orders([])
    print("\n📝 TEST 1: Registering stop loss for ETH at $1900")
    register_stop_loss_logic("ETH", 1900.0, 0.5)
    orders = load_orders()
    print(f"Current orders: {json.dumps(orders, indent=2)}")
    print("\n📈 TEST 2: Simulating price drop to trigger stop loss")
    simulate_price_movement("ETH", 2000.0, 1850.0, 15)
    orders = load_orders()
    print(f"Updated orders: {json.dumps(orders, indent=2)}")
    assert orders[0]["triggered"] == True, "Stop loss wasn't triggered!"
    print("\n📝 TEST 3: Testing multiple orders with different thresholds")
    save_orders([])
    register_stop_loss_logic("BTC", 50000.0, 0.1)
    register_stop_loss_logic("BTC", 45000.0, 0.2)
    register_stop_loss_logic("BTC", 42000.0, 0.3)
    simulate_price_movement("BTC", 55000.0, 41000.0, 20)
    orders = load_orders()
    print(f"Final orders: {json.dumps(orders, indent=2)}")
    assert orders[0]["triggered"] == False, "First order shouldn't be triggered!"
    assert orders[1]["triggered"] == True, "Second order should be triggered!"
    assert orders[2]["triggered"] == True, "Third order should be triggered!"
    print("\n✅ All tests passed!")

if __name__ == "__main__":
    run_test() 