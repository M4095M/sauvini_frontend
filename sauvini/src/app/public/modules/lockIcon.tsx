type LockIconProps = {
  className?: string;
};

export default function LockIcon({ className }: LockIconProps) {
  return (
    <div className={`${className} p-2 rounded-full`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.625 6.125V4.375C2.625 1.95875 4.58375 0 7 0C9.41625 0 11.375 1.95875 11.375 4.375V6.125C12.3415 6.125 13.125 6.9085 13.125 7.875V12.25C13.125 13.2165 12.3415 14 11.375 14H2.625C1.6585 14 0.875 13.2165 0.875 12.25V7.875C0.875 6.9085 1.6585 6.125 2.625 6.125ZM9.625 4.375V6.125H4.375V4.375C4.375 2.92525 5.55025 1.75 7 1.75C8.44975 1.75 9.625 2.92525 9.625 4.375Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
