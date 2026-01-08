'use client';

interface TechPillsProps {
  technologies: string[];
  maxDisplay?: number;
}

export function TechPills({ technologies, maxDisplay = 3 }: TechPillsProps) {
  const displayTechs = technologies.slice(0, maxDisplay);
  const remaining = technologies.length - maxDisplay;

  return (
    <div className="tech-pills">
      {displayTechs.map((tech, index) => (
        <span key={index} className="tech-pill">
          {tech}
        </span>
      ))}
      {remaining > 0 && (
        <span
          className="tech-pill tech-pill-more"
          title={technologies.slice(maxDisplay).join(', ')}
        >
          +{remaining}
        </span>
      )}
    </div>
  );
}


