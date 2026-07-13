type LogoMarkProps = {
  className?: string;
  title?: string;
};

/**
 * Naqa Beauty logo mark — a purity droplet cradled by a leaf inside a ring.
 * Pure vector (crisp at any size) and colored via `currentColor`, so it can
 * render gold on light surfaces or white on the dark footer with no extra asset.
 */
export default function LogoMark({ className, title = "Naqa Beauty" }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
    >
      {/* Outer ring */}
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
      {/* Purity droplet */}
      <path
        d="M24 9c6.5 8.2 10 13.4 10 18.4A10 10 0 0 1 24 37.4a10 10 0 0 1-10-10C14 22.4 17.5 17.2 24 9Z"
        fill="currentColor"
      />
      {/* Leaf highlight sweeping across the droplet */}
      <path
        d="M18.5 29.5c3.4-.2 7.6-2.3 10-6.6"
        stroke="#1a1a1a"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}
