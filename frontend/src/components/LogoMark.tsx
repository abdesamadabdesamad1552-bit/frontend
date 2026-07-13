type LogoMarkProps = {
  className?: string;
  title?: string;
};

/**
 * Naqa Beauty logo mark — a geometric eight-petal rosette (Arabic ornament),
 * matching the brand flower used on packaging and ad creatives.
 * Pure vector (crisp at any size) and colored via `currentColor`, so it renders
 * gold on light surfaces or white on the dark footer with no extra asset.
 */
export default function LogoMark({ className, title = "Naqa Beauty" }: LogoMarkProps) {
  // 4 axis-aligned petals + 4 diagonal petals, each a slender pointed leaf.
  const petal =
    "M24 4 C27.8 9.5 27.8 13.5 24 17 C20.2 13.5 20.2 9.5 24 4 Z";

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
    >
      <g fill="currentColor">
        {/* Outer petals — N, NE, E, SE, S, SW, W, NW */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <path key={angle} d={petal} transform={`rotate(${angle} 24 24)`} />
        ))}
      </g>
      {/* Inner ring + heart of the rosette */}
      <circle cx="24" cy="24" r="4" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="24" cy="24" r="1.7" fill="currentColor" />
    </svg>
  );
}
