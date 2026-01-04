import { useState } from 'react';
import { useApp, Period } from '../contexts/AppContext';
import './GlobalControls.css';

interface GlobalControlsProps {
  onRunAnalysis?: () => void;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
}

export default function GlobalControls({ onRunAnalysis, onExportPDF, onExportExcel }: GlobalControlsProps) {
  const { state, setSelectedProducts, setSelectedPeriod, setLastUpdated, products } = useApp();
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

  const isAllProducts = state.selectedProducts.length === 0;
  const selectedProductNames = isAllProducts
    ? ['Todos los productos']
    : state.selectedProducts
        .map(id => products.find(p => p.id === id)?.name)
        .filter(Boolean) as string[];

  const handleProductToggle = (productId: string) => {
    if (productId === 'all') {
      setSelectedProducts([]);
    } else {
      const newSelection = state.selectedProducts.includes(productId)
        ? state.selectedProducts.filter(id => id !== productId)
        : [...state.selectedProducts, productId];
      setSelectedProducts(newSelection);
    }
  };

  const handleRunAnalysis = () => {
    setLastUpdated(new Date());
    onRunAnalysis?.();
  };

  return (
    <div className="global-controls">
      {/* Product Selector */}
      <div className="control-group">
        <label className="control-label">Producto</label>
        <div className="dropdown-container">
          <button
            className="dropdown-trigger"
            onClick={() => setShowProductDropdown(!showProductDropdown)}
          >
            {isAllProducts ? 'Todos los productos' : `${selectedProductNames.length} seleccionados`}
            <span className="dropdown-arrow">▼</span>
          </button>
          {showProductDropdown && (
            <>
              <div className="dropdown-overlay" onClick={() => setShowProductDropdown(false)} />
              <div className="dropdown-menu">
                {products.map(product => {
                  const isSelected = product.id === 'all' ? isAllProducts : state.selectedProducts.includes(product.id);
                  return (
                    <label key={product.id} className="dropdown-item checkbox-item">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleProductToggle(product.id)}
                      />
                      <span>{product.name}</span>
                    </label>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Period Selector */}
      <div className="control-group">
        <label className="control-label">Período</label>
        <div className="dropdown-container">
          <button
            className="dropdown-trigger"
            onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
          >
            {state.selectedPeriod === 'all' ? 'Todo el período' : state.selectedPeriod.toUpperCase()}
            <span className="dropdown-arrow">▼</span>
          </button>
          {showPeriodDropdown && (
            <>
              <div className="dropdown-overlay" onClick={() => setShowPeriodDropdown(false)} />
              <div className="dropdown-menu">
                {(['all', 'Q1', 'Q2', 'Q3', 'Q4', '30d', '90d', 'custom'] as Period[]).map(period => (
                  <button
                    key={period}
                    className={`dropdown-item ${state.selectedPeriod === period ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedPeriod(period);
                      setShowPeriodDropdown(false);
                    }}
                  >
                    {period === 'all' ? 'Todo el período' : period.toUpperCase()}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Data Source Status */}
      <div className="control-group">
        <label className="control-label">Fuente de datos</label>
        <div className="data-source-status">
          <span className="status-indicator status-mixed">●</span>
          <span className="status-text">{state.dataSourceStatus}</span>
          {state.lastUpdated && (
            <span className="last-updated">
              {state.lastUpdated.toLocaleDateString('es-ES', { 
                day: '2-digit', 
                month: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="control-actions">
        <button className="action-button primary" onClick={handleRunAnalysis}>
          🔄 Ejecutar análisis
        </button>
        <div className="export-buttons">
          <button className="action-button secondary" onClick={onExportExcel}>
            📊 Excel
          </button>
          <button className="action-button secondary" onClick={onExportPDF}>
            📄 PDF
          </button>
        </div>
      </div>
    </div>
  );
}
