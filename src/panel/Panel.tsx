import React from 'react';
import { StockPriceList } from '../components/StockPriceList';
import './Panel.css';

export const Panel: React.FC = () => {
  return (
    <div className="panel">
      <h1>Stock Price Checker</h1>
      <StockPriceList />
    </div>
  );
};