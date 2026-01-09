import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import './PageLayout.css';
import './DataSourcesPage.css';

interface DataSource {
  id: string;
  name: string;
  type: 'figma' | 'github' | 'jira' | 'file';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
  health?: {
    status: 'healthy' | 'warning' | 'error';
    message?: string;
    rateLimitRemaining?: number;
  };
}

export default function DataSourcesPage() {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: 'figma',
      name: 'Figma',
      type: 'figma',
      status: 'disconnected',
      health: {
        status: 'healthy',
      },
    },
    {
      id: 'github',
      name: 'GitHub',
      type: 'github',
      status: 'disconnected',
      health: {
        status: 'healthy',
      },
    },
    {
      id: 'jira',
      name: 'Jira',
      type: 'jira',
      status: 'disconnected',
      health: {
        status: 'healthy',
      },
    },
    {
      id: 'file',
      name: 'Archivos (CSV/JSON)',
      type: 'file',
      status: 'connected',
      lastSync: new Date(),
      health: {
        status: 'healthy',
      },
    },
  ]);

  const [uploadHistory] = useState([
    {
      id: '1',
      fileName: 'design-metrics-2024-01.csv',
      type: 'design',
      status: 'success',
      uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 días atrás
      records: 145,
    },
    {
      id: '2',
      fileName: 'dev-metrics-2024-01.json',
      type: 'development',
      status: 'success',
      uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 días atrás
      records: 89,
    },
    {
      id: '3',
      fileName: 'metrics-export.xlsx',
      type: 'design',
      status: 'error',
      uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 días atrás
      error: 'Formato no válido',
    },
  ]);

  const handleDownloadTemplate = (templateType: 'design' | 'development') => {
    if (templateType === 'design') {
      // Crear Excel para métricas de diseño
      const workbook = XLSX.utils.book_new();
      const worksheetData = [
        ['timestamp', 'totalComponents', 'usedComponents', 'detachedComponents', 'adoptionPercentage', 'accessibilityScore', 'accessibilityIssues'],
        ['2024-01-15T00:00:00.000Z', 150, 110, 5, 73.3, 90, 2],
        ['2024-02-15T00:00:00.000Z', 155, 115, 4, 74.2, 91, 1],
        ['', '', '', '', '', '', ''], // Fila vacía para que el usuario pueda agregar más datos
      ];
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      
      // Ajustar ancho de columnas
      worksheet['!cols'] = [
        { wch: 25 }, // timestamp
        { wch: 18 }, // totalComponents
        { wch: 18 }, // usedComponents
        { wch: 20 }, // detachedComponents
        { wch: 20 }, // adoptionPercentage
        { wch: 20 }, // accessibilityScore
        { wch: 25 }, // accessibilityIssues
      ];
      
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Métricas de Diseño');
      XLSX.writeFile(workbook, 'design-metrics-template.xlsx');
    } else {
      // Crear Excel para métricas de desarrollo
      const workbook = XLSX.utils.book_new();
      const worksheetData = [
        ['timestamp', 'dsPackageInstalls', 'reposUsingDS', 'customComponentsCount', 'uiRelatedIssues', 'resolvedIssues', 'organization'],
        ['2024-01-15T00:00:00.000Z', 1250, 18, 45, 12, 10, 'acme-corp'],
        ['2024-02-15T00:00:00.000Z', 1320, 19, 42, 10, 9, 'acme-corp'],
        ['', '', '', '', '', '', ''], // Fila vacía para que el usuario pueda agregar más datos
      ];
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      
      // Ajustar ancho de columnas
      worksheet['!cols'] = [
        { wch: 25 }, // timestamp
        { wch: 18 }, // dsPackageInstalls
        { wch: 15 }, // reposUsingDS
        { wch: 22 }, // customComponentsCount
        { wch: 18 }, // uiRelatedIssues
        { wch: 18 }, // resolvedIssues
        { wch: 15 }, // organization
      ];
      
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Métricas de Desarrollo');
      XLSX.writeFile(workbook, 'development-metrics-template.xlsx');
    }
  };

  const csvTemplates = [
    {
      name: 'Métricas de Diseño',
      description: 'Plantilla para métricas de Figma (componentes, adopción, desviaciones)',
      type: 'design' as const,
      fields: ['timestamp', 'totalComponents', 'usedComponents', 'detachedComponents', 'adoptionPercentage', 'accessibilityScore', 'accessibilityIssues'],
    },
    {
      name: 'Métricas de Desarrollo',
      description: 'Plantilla para métricas de GitHub (uso de componentes, issues, repos)',
      type: 'development' as const,
      fields: ['timestamp', 'dsPackageInstalls', 'reposUsingDS', 'customComponentsCount', 'uiRelatedIssues', 'resolvedIssues', 'organization'],
    },
  ];

  const handleConnect = (sourceId: string) => {
    // En producción, esto abriría un modal o redirigiría a OAuth
    console.log('Conectar:', sourceId);
    setDataSources(prev =>
      prev.map(source =>
        source.id === sourceId
          ? { ...source, status: 'connected' as const, lastSync: new Date() }
          : source
      )
    );
  };

  const handleDisconnect = (sourceId: string) => {
    setDataSources(prev =>
      prev.map(source =>
        source.id === sourceId ? { ...source, status: 'disconnected' as const, lastSync: undefined } : source
      )
    );
  };

  const handleSync = async (sourceId: string) => {
    // En producción, esto llamaría a la API para sincronizar
    console.log('Sincronizar:', sourceId);
    
    // Simular sincronización
    setDataSources(prev =>
      prev.map(source => {
        if (source.id === sourceId) {
          return {
            ...source,
            lastSync: new Date(),
            health: source.health ? {
              ...source.health,
              status: 'healthy' as const,
              message: 'Sincronización completada exitosamente',
            } : { status: 'healthy' as const }
          };
        }
        return source;
      })
    );

    // En producción: await api.syncDataSource(sourceId);
    // await onRefresh(); // Recargar datos después de sincronizar
  };

  const getStatusBadge = (status: DataSource['status']) => {
    switch (status) {
      case 'connected':
        return <span className="status-badge status-connected">Conectado</span>;
      case 'disconnected':
        return <span className="status-badge status-disconnected">Desconectado</span>;
      case 'error':
        return <span className="status-badge status-error">Error</span>;
    }
  };

  const getHealthIcon = (health?: DataSource['health']) => {
    if (!health) return null;
    switch (health.status) {
      case 'healthy':
        return <span className="health-icon health-healthy">✓</span>;
      case 'warning':
        return <span className="health-icon health-warning">⚠</span>;
      case 'error':
        return <span className="health-icon health-error">✗</span>;
    }
  };

  return (
    <div className="page-layout">
      <header className="page-header">
        <div className="header-nav">
          <Link to="/" className="back-link">← Resumen</Link>
          <nav className="page-nav">
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/producto" className="nav-link">Producto</Link>
            <Link to="/desarrollo" className="nav-link">Desarrollo</Link>
            <Link to="/kpis" className="nav-link">KPIs</Link>
            <Link to="/okrs" className="nav-link">OKRs</Link>
            <Link to="/roi" className="nav-link">ROI</Link>
            <Link to="/data-sources" className="nav-link active">Fuentes</Link>
          </nav>
        </div>
        <div className="page-header-main">
          <div>
            <h1>Fuentes de Datos</h1>
            <p className="page-subtitle">Gestiona las conexiones y configuración de fuentes de datos</p>
          </div>
        </div>
      </header>

      <main className="page-content data-sources-content">
        {/* Data Sources List */}
        <section className="data-sources-section">
          <h2 className="section-title">Conexiones</h2>
          <div className="data-sources-grid">
            {dataSources.map(source => (
              <div key={source.id} className="data-source-card">
                <div className="data-source-header">
                  <div className="data-source-info">
                    <h3 className="data-source-name">
                      {source.type === 'figma' && '🎨'}
                      {source.type === 'github' && '💻'}
                      {source.type === 'jira' && '📋'}
                      {source.type === 'file' && '📄'}
                      {' '}
                      {source.name}
                    </h3>
                    {getStatusBadge(source.status)}
                    {getHealthIcon(source.health)}
                  </div>
                  {source.health?.rateLimitRemaining && (
                    <div className="rate-limit-info">
                      <span className="rate-limit-label">Rate limit:</span>
                      <span className="rate-limit-value">{source.health.rateLimitRemaining} restantes</span>
                    </div>
                  )}
                </div>

                <div className="data-source-body">
                  {source.lastSync && (
                    <div className="data-source-meta">
                      <span className="meta-label">Última sincronización:</span>
                      <span className="meta-value">
                        {source.lastSync.toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  )}

                  {source.health?.message && (
                    <div className={`data-source-message ${source.health.status}`}>
                      {source.health.message}
                    </div>
                  )}
                </div>

                <div className="data-source-actions">
                  {source.status === 'connected' ? (
                    <>
                      <button
                        className="btn-secondary"
                        onClick={() => handleSync(source.id)}
                        disabled={source.type === 'file'}
                      >
                        🔄 Sincronizar
                      </button>
                      <button className="btn-danger" onClick={() => handleDisconnect(source.id)}>
                        Desconectar
                      </button>
                    </>
                  ) : (
                    <button className="btn-primary" onClick={() => handleConnect(source.id)}>
                      Conectar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Excel Templates */}
        <section className="data-sources-section">
          <h2 className="section-title">Plantillas Excel</h2>
          <p className="section-description">
            Descarga plantillas Excel para cargar métricas manualmente
          </p>
          <div className="templates-grid">
            {csvTemplates.map((template, index) => (
              <div key={index} className="template-card">
                <div className="template-header">
                  <h3 className="template-name">{template.name}</h3>
                  <button 
                    className="btn-download"
                    onClick={() => handleDownloadTemplate(template.type)}
                  >
                    ⬇️ Descargar Excel
                  </button>
                </div>
                <p className="template-description">{template.description}</p>
                <div className="template-fields">
                  <span className="fields-label">Campos:</span>
                  <div className="fields-list">
                    {template.fields.map((field, idx) => (
                      <span key={idx} className="field-tag">
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upload History */}
        <section className="data-sources-section">
          <h2 className="section-title">Historial de Cargas</h2>
          <div className="upload-history-container">
            <table className="upload-history-table">
              <thead>
                <tr>
                  <th>Archivo</th>
                  <th>Tipo</th>
                  <th>Fecha</th>
                  <th>Registros</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {uploadHistory.map(upload => (
                  <tr key={upload.id}>
                    <td className="file-name">{upload.fileName}</td>
                    <td>
                      <span className={`type-badge type-${upload.type}`}>
                        {upload.type === 'design' ? 'Diseño' : 'Desarrollo'}
                      </span>
                    </td>
                    <td className="upload-date">
                      {upload.uploadedAt.toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="upload-records">
                      {upload.status === 'success' ? upload.records : '-'}
                    </td>
                    <td>
                      {upload.status === 'success' ? (
                        <span className="status-badge status-success">✓ Éxito</span>
                      ) : (
                        <span className="status-badge status-error" title={upload.error}>
                          ✗ Error
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

