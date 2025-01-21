import React from 'react';
import { StockPrice } from './StockPrice';
import { SymbolEditor } from './SymbolEditor';
import { useStockPrices } from '../hooks/useStockPrices';

export const StockPriceList: React.FC = () => {
  const { 
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
  } = useStockPrices();

  return (
    <div className="stock-price-list">
      <div className="button-group">
        <button 
          onClick={checkPrices} 
          disabled={isChecking || stocks.length === 0}
          className="check-prices-button"
        >
          {isChecking ? 'Checking Prices...' : 'Check Stock Prices'}
        </button>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="edit-button"
        >
          {isEditing ? 'Cancel' : 'Edit Symbols'}
        </button>
      </div>

      {globalError && (
        <div className="global-error">
          {globalError}
          <button 
            onClick={() => window.location.reload()} 
            className="retry-button"
          >
            Retry
          </button>
        </div>
      )}

      {isEditing ? (
        <SymbolEditor
          value={symbolText}
          onChange={setSymbolText}
          onSave={updateStocksFromSymbols}
          onCancel={() => setIsEditing(false)}
          onReset={resetToDefault}
        />
      ) : (
        <div className="stock-list">
          {stocks.map((stock) => (
            <StockPrice
              key={stock.symbol}
              stock={stock}
            />
          ))}
          {stocks.length === 0 && (
            <div className="empty-state">
              No stocks configured. Click "Edit Symbols" to add some.
            </div>
          )}
        </div>
      )}
    </div>
  );
};