import React from 'react';
import { Stock } from '../types/Stock';

interface Props {
  stock: Stock;
}

export const StockPrice: React.FC<Props> = ({ stock }) => {
  const isError = stock.price?.includes('Price not found');

  return (
    <div className="stock-price-item">
      <div className="stock-name">{stock.name}</div>
      <div className="stock-symbol">{stock.symbol}</div>
      <div className="stock-details">
        {stock.isLoading ? (
          <span className="loading">Fetching price...</span>
        ) : stock.error ? (
          <span className="error">{stock.error}</span>
        ) : (
          <span className="price" data-error={isError}>
            {stock.price || 'Not checked'}
          </span>
        )}
      </div>
    </div>
  );
};