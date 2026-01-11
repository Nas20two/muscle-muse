interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const sizeConfig = {
  sm: { icon: 40, text: "text-2xl" },
  md: { icon: 48, text: "text-3xl" },
  lg: { icon: 64, text: "text-4xl" },
};

export default function Logo({ size = "md", showText = true }: LogoProps) {
  const config = sizeConfig[size];
  
  return (
    <div className="flex items-center gap-3">
      <div 
        className="flex items-center justify-center"
        style={{ width: config.icon, height: config.icon }}
      >
        <svg 
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full drop-shadow-sm"
        >
          {/* Background Rounded Square */}
          <rect width="40" height="40" rx="10" fill="url(#energy-gradient)" />
          
          {/* The Pulse Bolt Line */}
          <path 
            d="M8 24H14L17 12L21 28L24 20C24 20 25 15 29 15C33 15 33 20 33 20L33 24M33 24L30 21M33 24L36 21" 
            stroke="white" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          
          <defs>
            <linearGradient id="energy-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="hsl(var(--primary))" />
              <stop offset="1" stopColor="hsl(24 95% 40%)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {showText && (
        <span className={`font-display ${config.text} font-bold tracking-tight text-foreground`}>
          MUSCLE<span className="text-primary">MUSE</span>
        </span>
      )}
    </div>
  );
}
