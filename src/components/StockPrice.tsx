import React from 'react';
import { Stock } from '../types/Stock';

interface Props {
  stock: Stock;
}

export const StockPrice: React.FC<Props> = ({ stock }) => {
  return (
    <div className="stock-price-item">
      <div className="stock-name">{stock.name}</div>
      <div className="stock-details">
        {stock.isLoading ? (
          <span className="loading">Loading...</span>
        ) : stock.error ? (
          <span className="error">{stock.error}</span>
        ) : (
          <span className="price">{stock.price || 'Not checked'}</span>
        )}
      </div>
    </div>
  );
};