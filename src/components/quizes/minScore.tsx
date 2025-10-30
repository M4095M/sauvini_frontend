export default function MinScore() {
  return (
    <div className="px-3 py-4 flex gap-3 bg-primary-50  border-2 border-primary-400 rounded-3xl">
      {/* icon */}
      <div className="text-primary-400 bg-white rounded-full flex justify-center items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
        >
          <path
            d="M18.4002 24.0002L22.1335 27.7335L29.6002 20.2669M40.8002 24.0002C40.8002 33.2786 33.2786 40.8002 24.0002 40.8002C14.7218 40.8002 7.2002 33.2786 7.2002 24.0002C7.2002 14.7218 14.7218 7.2002 24.0002 7.2002C33.2786 7.2002 40.8002 14.7218 40.8002 24.0002Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {/* info */}
      <div className="flex flex-col">
        <span className="text-2xl text-primary-400 font-medium">12/16</span>
        <span className="text-sm text-neutral-400 font-normal">Minimum score</span>
      </div>
    </div>
  );
}
