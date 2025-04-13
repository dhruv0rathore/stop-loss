import { useEffect, useState } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

interface PricePoint {
  timestamp: number;
  price: number;
}

interface ChartData {
  time: string;
  price: number;
}

export function PriceChart({ market }: { market: 'ETH' }) {
  const { prices } = useWebSocket();
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // Update price history when new prices come in
  useEffect(() => {
    if (prices[market]) {
      setPriceHistory(prev => {
        const newHistory = [...prev, {
          timestamp: prices[market].timestamp,
          price: prices[market].price,
        }];
        // Keep last 100 points
        return newHistory.slice(-100);
      });
    }
  }, [prices, market]);

  // Transform price history into chart data
  useEffect(() => {
    const newChartData = priceHistory.map(point => ({
      time: format(point.timestamp, 'HH:mm:ss'),
      price: point.price,
    }));
    setChartData(newChartData);
  }, [priceHistory]);

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.1)"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            tick={{ fill: '#666', fontSize: 12 }}
            tickLine={{ stroke: '#666' }}
            axisLine={{ stroke: '#666' }}
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fill: '#666', fontSize: 12 }}
            tickLine={{ stroke: '#666' }}
            axisLine={{ stroke: '#666' }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1b23',
              border: '1px solid #333',
              borderRadius: '4px',
            }}
            labelStyle={{ color: '#666' }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#4fd1c5"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
