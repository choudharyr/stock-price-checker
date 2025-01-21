import React from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export const SymbolEditor: React.FC<Props> = ({ 
  value, 
  onChange, 
  onSave, 
  onCancel,
  onReset
}) => {
  return (
    <div className="symbol-editor">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter stock symbols, one per line (e.g., AAPL)"
        className="symbol-input"
        rows={10}
      />
      <div className="button-group">
        <button onClick={onSave} className="btn-primary">
          Save Symbols
        </button>
        <button onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button onClick={onReset} className="btn-danger">
          Reset to Default
        </button>
      </div>
    </div>
  );
};