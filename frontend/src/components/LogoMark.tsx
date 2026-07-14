type LogoMarkProps = {
  className?: string;
  title?: string;
};

/**
 * Naqa Beauty logo mark — a minimal 5-petal lotus silhouette.
 * Pure flat vector (crisp at any size, reads cleanly even as a small app
 * icon) colored via `currentColor` so it can be recolored per surface.
 */
export default function LogoMark({ className, title = "Naqa Beauty" }: LogoMarkProps) {
  return (
    <svg
      viewBox="15 40 170 115"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
    >
      <g fill="currentColor">
        <path d="M100 150 C100 150 84 100 100 46 C116 100 100 150 100 150 Z" />
        <path d="M100 150 C100 150 58 118 46 66 C96 78 108 128 100 150 Z" />
        <path d="M100 150 C100 150 142 118 154 66 C104 78 92 128 100 150 Z" />
        <path d="M100 150 C100 150 46 140 20 100 C72 96 104 126 100 150 Z" />
        <path d="M100 150 C100 150 154 140 180 100 C128 96 96 126 100 150 Z" />
      </g>
    </svg>
  );
}
