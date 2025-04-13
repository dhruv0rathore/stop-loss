from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from stop_loss_manager import register_stop_loss_logic
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StopLossRequest(BaseModel):
    market: str
    threshold: float
    size: float
    walletAddress: str
    transactionHash: str

@app.post("/api/stop-loss")
async def register_stop_loss(request: StopLossRequest):
    try:
        # Validate market
        if request.market not in ["ETH", "BTC"]:
            raise HTTPException(status_code=400, detail="Invalid market")

        # Register stop loss with the manager
        register_stop_loss_logic(
            market=request.market,
            threshold=request.threshold,
            size=request.size
        )

        return {
            "status": "success",
            "message": f"Stop loss registered for {request.market}",
            "data": {
                "market": request.market,
                "threshold": request.threshold,
                "size": request.size,
                "walletAddress": request.walletAddress,
                "transactionHash": request.transactionHash
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 