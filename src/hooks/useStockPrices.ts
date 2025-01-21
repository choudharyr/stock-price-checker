import { useState, useCallback } from 'react';
import { Stock } from '../types/Stock';

const STOCKS: Stock[] = [
  { symbol: 'YM=F', name: 'E-mini Dow' },
  { symbol: 'CL=F', name: 'Crude Oil' },
  { symbol: 'RTY=F', name: 'Russell 2000' },
  { symbol: 'GC=F', name: 'Gold' }
];

export function useStockPrices() {
  const [stocks, setStocks] = useState<Stock[]>(STOCKS);
  const [isChecking, setIsChecking] = useState(false);

  const checkPrices = useCallback(async () => {
    if (isChecking) return;
    setIsChecking(true);

    try {
      for (let i = 0; i < stocks.length; i++) {
        // Update loading state for current stock
        setStocks(prev => prev.map((stock, idx) => ({
          ...stock,
          isLoading: idx === i,
          error: undefined
        })));

        try {
          const price = await chrome.runtime.sendMessage({
            action: 'checkPrice',
            url: `https://finance.yahoo.com/quote/${stocks[i].symbol}/`
          });

          setStocks(prev => prev.map((stock, idx) => 
            idx === i ? { ...stock, price, isLoading: false } : stock
          ));
        } catch (error) {
          setStocks(prev => prev.map((stock, idx) => 
            idx === i ? { 
              ...stock, 
              error: error instanceof Error ? error.message : 'Unknown error',
              isLoading: false 
            } : stock
          ));
        }
      }
    } finally {
      setIsChecking(false);
    }
  }, [stocks, isChecking]);

  return { stocks, isChecking, checkPrices };
}