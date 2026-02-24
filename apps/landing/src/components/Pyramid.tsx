export default function Pyramid({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 400 360" className="w-full max-w-md mx-auto pyramid-glow" xmlns="http://www.w3.org/2000/svg">
        {/* Pyramid outer glow */}
        <defs>
          <linearGradient id="pyGrad1" x1="0%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#1a2744" />
            <stop offset="100%" stopColor="#00b4d8" />
          </linearGradient>
          <linearGradient id="pyGrad2" x1="100%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#1a2744" />
            <stop offset="100%" stopColor="#f0a500" />
          </linearGradient>
        </defs>

        {/* Left face */}
        <polygon points="200,30 60,330 200,280" fill="url(#pyGrad1)" opacity="0.7" />
        {/* Right face */}
        <polygon points="200,30 340,330 200,280" fill="url(#pyGrad2)" opacity="0.7" />

        {/* Section dividers */}
        <line x1="105" y1="180" x2="295" y2="180" stroke="#00b4d8" strokeWidth="1" opacity="0.5" />
        <line x1="80" y1="255" x2="320" y2="255" stroke="#00b4d8" strokeWidth="1" opacity="0.5" />

        {/* Pyramid outline */}
        <polygon
          points="200,30 60,330 340,330"
          fill="none"
          stroke="url(#pyGrad1)"
          strokeWidth="2"
          opacity="0.8"
        />

        {/* Top section - Be Respectful */}
        <text x="200" y="125" textAnchor="middle" fill="#f0a500" fontSize="13" fontWeight="700" fontFamily="Orbitron, sans-serif">
          BE RESPECTFUL
        </text>
        <text x="200" y="148" textAnchor="middle" fill="#8892a4" fontSize="10" fontFamily="Inter, sans-serif">
          For yourself &amp; others
        </text>

        {/* Middle section - Stay Positive */}
        <text x="200" y="225" textAnchor="middle" fill="#48cae4" fontSize="13" fontWeight="700" fontFamily="Orbitron, sans-serif">
          STAY POSITIVE
        </text>
        <text x="200" y="248" textAnchor="middle" fill="#8892a4" fontSize="10" fontFamily="Inter, sans-serif">
          How you show up matters
        </text>

        {/* Bottom section - Have Fun */}
        <text x="200" y="300" textAnchor="middle" fill="#00b4d8" fontSize="13" fontWeight="700" fontFamily="Orbitron, sans-serif">
          HAVE FUN
        </text>
        <text x="200" y="320" textAnchor="middle" fill="#8892a4" fontSize="10" fontFamily="Inter, sans-serif">
          Life is meant to be enjoyed
        </text>

        {/* Eye of providence / all-seeing eye at top */}
        <polygon points="200,50 190,72 210,72" fill="none" stroke="#f0a500" strokeWidth="1.5" opacity="0.6" />
        <circle cx="200" cy="64" r="4" fill="#f0a500" opacity="0.8" />
      </svg>
    </div>
  );
}
