import { Link } from 'react-router-dom';
import './SectionCards.css';

export default function SectionCards() {
  const sections = [
    {
      id: 'producto',
      title: 'Producto',
      description: 'Coherencia y velocidad en producto',
      icon: '📦',
      path: '/producto',
    },
    {
      id: 'desarrollo',
      title: 'Desarrollo',
      description: 'Reducción del esfuerzo técnico',
      icon: '🧑‍💻',
      path: '/desarrollo',
    },
    {
      id: 'adopcion',
      title: 'Adopción',
      description: 'Uso real por los equipos',
      icon: '👥',
      path: '/adopcion',
    },
    {
      id: 'eficiencia',
      title: 'Eficiencia',
      description: 'Ahorro de tiempo y esfuerzo',
      icon: '⚙️',
      path: '/eficiencia',
    },
    {
      id: 'roi',
      title: 'ROI',
      description: 'Retorno de inversión detallado',
      icon: '💰',
      path: '/roi',
    },
    {
      id: 'kpis',
      title: 'KPIs',
      description: 'Indicadores clave de desempeño',
      icon: '📊',
      path: '/kpis',
    },
    {
      id: 'okrs',
      title: 'OKRs',
      description: 'Objetivos y resultados clave',
      icon: '🎯',
      path: '/okrs',
    },
  ];

  return (
    <div className="section-cards">
      {sections.map((section) => (
        <Link key={section.id} to={section.path} className="section-card">
          <div className="section-card-icon">{section.icon}</div>
          <div className="section-card-content">
            <h3 className="section-card-title">{section.title}</h3>
            <p className="section-card-description">{section.description}</p>
          </div>
          <div className="section-card-arrow">→</div>
        </Link>
      ))}
    </div>
  );
}

