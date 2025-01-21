import { useState, useCallback, useEffect } from 'react';
import { Stock } from '../types/Stock';

const DEFAULT_SYMBOLS = `EDBL
APPPL
AMZN
1234`;

export function useStockPrices() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [symbolText, setSymbolText] = useState('');
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Load saved stocks on mount
  useEffect(() => {
    chrome.storage.sync.get(['savedStocks', 'symbolText'], (result) => {
      setStocks(result.savedStocks || []);
      setSymbolText(result.symbolText || DEFAULT_SYMBOLS);
    });
  }, []);

  const saveStocks = useCallback((newStocks: Stock[]) => {
    chrome.storage.sync.set({ savedStocks: newStocks }, () => {
      setStocks(newStocks);
    });
  }, []);

  const saveSymbols = useCallback((text: string) => {
    chrome.storage.sync.set({ symbolText: text }, () => {
      setSymbolText(text);
    });
  }, []);

  const updateStocksFromSymbols = useCallback(async () => {
    if (isChecking) return;
    
    setGlobalError(null);
    
    const symbols = symbolText
      .split('\n')
      .map(s => s.trim())
      .filter(s => s);

    if (symbols.length === 0) {
      setGlobalError('Please enter at least one stock symbol');
      return;
    }

    const initialStocks = symbols.map(symbol => {
      const existingStock = stocks.find(s => s.symbol === symbol);
      return existingStock || { symbol, name: symbol };
    });

    setIsEditing(false);
    setIsChecking(true);

    try {
      const updatedStocks = [...initialStocks];
      
      for (let i = 0; i < updatedStocks.length; i++) {
        const stock = updatedStocks[i];
        stock.isLoading = true;
        stock.error = undefined;
        setStocks([...updatedStocks]);

        try {
          const { price, name } = await chrome.runtime.sendMessage({
            action: 'getStockData',
            url: `https://finance.yahoo.com/quote/${stock.symbol}/`,
            needsName: true
          });

          if (!price) {
            throw new Error(`No data found for ${stock.symbol}`);
          }

          stock.price = price;
          if (name) stock.name = name;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          setGlobalError(`Error fetching ${stock.symbol}: ${errorMessage}`);
          // Reset loading state for all stocks
          const resetStocks = updatedStocks.map(s => ({
            ...s,
            isLoading: false,
            error: s.symbol === stock.symbol ? errorMessage : s.error
          }));
          setStocks(resetStocks);
          setIsChecking(false);
          return;
        }

        stock.isLoading = false;
        setStocks([...updatedStocks]);
      }

      saveStocks(updatedStocks);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setGlobalError(`Unexpected error: ${errorMessage}`);
    } finally {
      setIsChecking(false);
    }
  }, [symbolText, stocks, isChecking, saveStocks]);

  const checkPrices = useCallback(async () => {
    if (isChecking || stocks.length === 0) return;
    
    setGlobalError(null);
    setIsChecking(true);

    try {
      const updatedStocks = [...stocks];
      for (let i = 0; i < updatedStocks.length; i++) {
        const stock = updatedStocks[i];
        stock.isLoading = true;
        stock.error = undefined;
        setStocks([...updatedStocks]);

        try {
          const { price, name } = await chrome.runtime.sendMessage({
            action: 'getStockData',
            url: `https://finance.yahoo.com/quote/${stock.symbol}/`,
            needsName: true
          });

          if (!price) {
            throw new Error(`No data found for ${stock.symbol}`);
          }

          stock.price = price;
          if (name) stock.name = name;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          setGlobalError(`Error fetching ${stock.symbol}: ${errorMessage}`);
          // Reset loading state for all stocks
          const resetStocks = updatedStocks.map(s => ({
            ...s,
            isLoading: false,
            error: s.symbol === stock.symbol ? errorMessage : s.error
          }));
          setStocks(resetStocks);
          setIsChecking(false);
          return;
        }

        stock.isLoading = false;
        setStocks([...updatedStocks]);
      }

      saveStocks(updatedStocks);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setGlobalError(`Unexpected error: ${errorMessage}`);
    } finally {
      setIsChecking(false);
    }
  }, [stocks, isChecking, saveStocks]);

  const resetToDefault = useCallback(() => {
    saveSymbols(DEFAULT_SYMBOLS);
    setSymbolText(DEFAULT_SYMBOLS);
    setStocks([]);
  }, [saveSymbols]);

  return { 
    stocks, 
    symbolText,
    isChecking, 
    isEditing,
    globalError,
    checkPrices,
    setIsEditing,
    setSymbolText,
    updateStocksFromSymbols,
    resetToDefault
  };
}