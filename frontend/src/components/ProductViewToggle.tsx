import { useApp } from '../contexts/AppContext';
import './ProductViewToggle.css';

type ViewMode = 'aggregate' | 'split';

interface ProductViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function ProductViewToggle({ viewMode, onViewModeChange }: ProductViewToggleProps) {
  const { state, products } = useApp();
  
  const isAllProducts = state.selectedProducts.length === 0;
  const selectedCount = isAllProducts ? products.length - 1 : state.selectedProducts.length; // -1 porque "all" no cuenta

  return (
    <div className="product-view-toggle">
      <div className="view-toggle-buttons">
        <button
          className={`view-toggle-button ${viewMode === 'aggregate' ? 'active' : ''}`}
          onClick={() => onViewModeChange('aggregate')}
        >
          <span className="view-toggle-icon">📊</span>
          <span className="view-toggle-label">Agregado</span>
          {viewMode === 'aggregate' && isAllProducts && (
            <span className="view-toggle-badge">{products.length - 1}</span>
          )}
        </button>
        <button
          className={`view-toggle-button ${viewMode === 'split' ? 'active' : ''}`}
          onClick={() => onViewModeChange('split')}
        >
          <span className="view-toggle-icon">📋</span>
          <span className="view-toggle-label">Por Producto</span>
          {viewMode === 'split' && (
            <span className="view-toggle-badge">{selectedCount}</span>
          )}
        </button>
      </div>
      {viewMode === 'split' && (
        <div className="view-toggle-info">
          Mostrando {selectedCount} {selectedCount === 1 ? 'producto' : 'productos'} seleccionados
        </div>
      )}
    </div>
  );
}

