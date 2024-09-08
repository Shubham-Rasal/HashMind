export default function CryptoLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#f8f8f8] animate-pulse transition-all ">
      <div className="relative w-64 h-64">
        {/* Binary-like background pattern */}

        {/* Crypto symbol */}
        <div className={``}>
          <svg
            className="absolute inset-0 animate-spin-slow"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Hashtag */}
            <path
              d="M30 20V80M50 20V80M20 40H80M20 60H80"
              stroke="black"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
