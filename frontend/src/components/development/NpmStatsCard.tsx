import { useEffect, useMemo, useState } from 'react';
import Tooltip from '../Tooltip';
import './NpmStatsCard.css';

export interface NpmStats {
  packageName: string;
  downloadsWeekly: number;
  downloadsMonthly: number;
  downloadsTrend: number; // % cambio vs período anterior
  latestVersion: string;
  versionsInUse: string[];
  dependentRepos: number;
  dependentTeams: string[];
}

interface NpmStatsCardProps {
  inferred?: Partial<NpmStats>;
}

const LS_KEY = 'ds_npm_stats_v1';

export default function NpmStatsCard({ inferred }: NpmStatsCardProps) {
  const [editing, setEditing] = useState(false);
  const [stats, setStats] = useState<NpmStats>(() => ({
    packageName: '@acme/design-system',
    downloadsWeekly: 2800,
    downloadsMonthly: 11200,
    downloadsTrend: 8,
    latestVersion: '3.4.1',
    versionsInUse: ['3.4.1', '3.3.0', '3.2.5'],
    dependentRepos: 19,
    dependentTeams: ['Web', 'Marketing', 'Admin'],
    ...inferred,
  }));

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setStats(prev => ({ ...prev, ...JSON.parse(raw) }));
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // aplicar inferred cuando cambie
    if (inferred) setStats(prev => ({ ...prev, ...inferred }));
  }, [inferred]);

  const trendLabel = stats.downloadsTrend >= 0 ? `+${stats.downloadsTrend}%` : `${stats.downloadsTrend}%`;

  const versionsText = useMemo(() => stats.versionsInUse.join(', '), [stats.versionsInUse]);
  const teamsText = useMemo(() => stats.dependentTeams.join(', '), [stats.dependentTeams]);

  const handleSave = () => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(stats));
    } catch {
      // ignore
    }
    setEditing(false);
  };

  return (
    <div className="npm-card">
      <div className="npm-header">
        <div>
          <h3 className="npm-title">
            Estadísticas npm
            <Tooltip content="Estimación/entrada manual. Si se conecta la API de npm, se podrá sincronizar automáticamente.">
              <button className="info-button-small" aria-label="Info">ℹ️</button>
            </Tooltip>
          </h3>
          <div className="npm-subtitle">{stats.packageName}</div>
        </div>
        <button className="npm-edit-btn" onClick={() => (editing ? handleSave() : setEditing(true))}>
          {editing ? '💾 Guardar' : '✏️ Editar'}
        </button>
      </div>

      <div className="npm-grid">
        <div className="npm-metric">
          <div className="npm-label">Descargas semanales</div>
          <div className="npm-value">{stats.downloadsWeekly.toLocaleString('es-ES')}</div>
        </div>
        <div className="npm-metric">
          <div className="npm-label">Descargas mensuales</div>
          <div className="npm-value">{stats.downloadsMonthly.toLocaleString('es-ES')}</div>
          <div className={`npm-trend ${stats.downloadsTrend >= 0 ? 'up' : 'down'}`}>{trendLabel}</div>
        </div>
        <div className="npm-metric">
          <div className="npm-label">Última versión</div>
          <div className="npm-value">{stats.latestVersion}</div>
        </div>
        <div className="npm-metric">
          <div className="npm-label">Repos dependientes</div>
          <div className="npm-value">{stats.dependentRepos}</div>
        </div>
      </div>

      <div className="npm-details">
        <div className="npm-detail-row">
          <span className="npm-detail-label">Versiones en uso</span>
          {editing ? (
            <input
              className="npm-input"
              value={versionsText}
              onChange={(e) => setStats(s => ({ ...s, versionsInUse: e.target.value.split(',').map(v => v.trim()).filter(Boolean) }))}
            />
          ) : (
            <span className="npm-detail-value">{versionsText}</span>
          )}
        </div>
        <div className="npm-detail-row">
          <span className="npm-detail-label">Equipos</span>
          {editing ? (
            <input
              className="npm-input"
              value={teamsText}
              onChange={(e) => setStats(s => ({ ...s, dependentTeams: e.target.value.split(',').map(v => v.trim()).filter(Boolean) }))}
            />
          ) : (
            <span className="npm-detail-value">{teamsText}</span>
          )}
        </div>
      </div>

      {editing && (
        <div className="npm-edit-grid">
          <label className="npm-edit-item">
            <span>Descargas semanales</span>
            <input className="npm-input" type="number" value={stats.downloadsWeekly} onChange={(e) => setStats(s => ({ ...s, downloadsWeekly: Number(e.target.value) }))} />
          </label>
          <label className="npm-edit-item">
            <span>Descargas mensuales</span>
            <input className="npm-input" type="number" value={stats.downloadsMonthly} onChange={(e) => setStats(s => ({ ...s, downloadsMonthly: Number(e.target.value) }))} />
          </label>
          <label className="npm-edit-item">
            <span>Tendencia %</span>
            <input className="npm-input" type="number" value={stats.downloadsTrend} onChange={(e) => setStats(s => ({ ...s, downloadsTrend: Number(e.target.value) }))} />
          </label>
          <label className="npm-edit-item">
            <span>Última versión</span>
            <input className="npm-input" value={stats.latestVersion} onChange={(e) => setStats(s => ({ ...s, latestVersion: e.target.value }))} />
          </label>
          <label className="npm-edit-item">
            <span>Repos dependientes</span>
            <input className="npm-input" type="number" value={stats.dependentRepos} onChange={(e) => setStats(s => ({ ...s, dependentRepos: Number(e.target.value) }))} />
          </label>
          <label className="npm-edit-item">
            <span>Paquete</span>
            <input className="npm-input" value={stats.packageName} onChange={(e) => setStats(s => ({ ...s, packageName: e.target.value }))} />
          </label>
        </div>
      )}
    </div>
  );
}



