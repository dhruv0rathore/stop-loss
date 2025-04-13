import time
import random
from stop_loss_manager import check_prices, register_stop_loss_logic

def simulate_price_movement(market: str, starting_price: float, target_price: float, duration: int = 30):
    print(f"🤖 MOCK PRICE SIMULATOR for {market}")
    print(f"Starting price: ${starting_price}")
    print(f"Target price: ${target_price}")
    print(f"Duration: {duration} seconds")
    
    price_diff = target_price - starting_price
    steps = duration
    
    current_price = starting_price
    
    for i in range(steps):
        noise = random.uniform(-0.5, 0.5) * abs(price_diff) / steps
        step_change = (price_diff / steps) + noise
        
        current_price += step_change
        
        if (target_price > starting_price and current_price > target_price) or \
           (target_price < starting_price and current_price < target_price):
            current_price = target_price
        
        print(f"[MOCK] {market} Price: ${current_price:.2f}")
        
        check_prices(market, current_price)
        
        time.sleep(1)
    
    print(f"🏁 Simulation complete. Final price: ${current_price:.2f}")

if __name__ == "__main__":
    register_stop_loss_logic("ETH", 1900.0, 0.5)
    simulate_price_movement("ETH", 2000.0, 1800.0, 30) 