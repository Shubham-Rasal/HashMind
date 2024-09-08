export default function CryptoLoader() {

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#f8f8f8] animate-pulse transition-all ">
      <div className="relative w-64 h-64">
        {/* Binary-like background pattern */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              {Array.from({ length: 8 }).map((_, j) => (
                <span key={j} className="text-xs">
                  {Math.random() > 0.5 ? '1' : '0'}
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* Rotating outer hexagon */}
        <svg
          className="absolute inset-0 animate-spin-slow"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50 0 L93.3 25 V75 L50 100 L6.7 75 V25 Z"
            stroke="black"
            strokeWidth="1"
          />
        </svg>

        {/* Pulsating inner hexagons */}
        <svg
          className="absolute inset-0"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="animate-pulse-fast"
            d="M50 20 L76.6 35 V65 L50 80 L23.4 65 V35 Z"
            fill="rgba(0, 0, 0, 0.1)"
          />
          <path
            className="animate-pulse-slow"
            d="M50 40 L65 50 V70 L50 80 L35 70 V50 Z"
            fill="rgba(0, 0, 0, 0.2)"
          />
        </svg>

        {/* Crypto symbol */}
        <svg
          className="absolute inset-0"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50 30 L65 38.5 V55.5 L50 64 L35 55.5 V38.5 Z"
            stroke="black"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M50 40 V54"
            stroke="black"
            strokeWidth="1"
          />
          <path
            d="M43 47 H57"
            stroke="black"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  )
}