interface LogoProps {
  className?: string
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-300 hover:scale-110 hover:rotate-3 ${className}`}
    >
      <rect width="32" height="32" rx="7" fill="url(#gradient)" />
      <text
        x="16"
        y="22"
        fontFamily="var(--font-kalam), 'Kalam', 'Comic Sans MS', cursive"
        fontSize="18"
        fontWeight="700"
        fill="white"
        textAnchor="middle"
        letterSpacing="0"
      >
        LD
      </text>
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1E40AF" />
        </linearGradient>
      </defs>
    </svg>
  )
}
