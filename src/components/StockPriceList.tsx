import React from 'react';
import { StockPrice } from './StockPrice';
import { useStockPrices } from '../hooks/useStockPrices';

export const StockPriceList: React.FC = () => {
  const { stocks, isChecking, checkPrices } = useStockPrices();

  return (
    <div className="stock-price-list">
      <button 
        onClick={checkPrices} 
        disabled={isChecking}
        className="check-prices-button"
      >
        {isChecking ? 'Checking Prices...' : 'Check Stock Prices'}
      </button>

      <div className="stock-list">
        {stocks.map(stock => (
          <StockPrice key={stock.symbol} stock={stock} />
        ))}
      </div>
    </div>
  );
};