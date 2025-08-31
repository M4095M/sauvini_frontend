import { IconProps } from "@/types/icon";

export function IconAnswered({
  className,
  width = "12",
  height = "12",
}: IconProps) {
  return (
    <div className={`${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M4.60078 5.9998L5.53411 6.93314L7.40078 5.06647M10.2008 5.9998C10.2008 8.3194 8.32038 10.1998 6.00078 10.1998C3.68119 10.1998 1.80078 8.3194 1.80078 5.9998C1.80078 3.68021 3.68119 1.7998 6.00078 1.7998C8.32038 1.7998 10.2008 3.68021 10.2008 5.9998Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function IconNotAnswered({
  className,
  width = "12",
  height = "12",
}: IconProps) {
  return (
    <div className={`${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M6.00078 4.13314V5.9998L7.40078 7.3998M10.2008 5.9998C10.2008 8.3194 8.32038 10.1998 6.00078 10.1998C3.68119 10.1998 1.80078 8.3194 1.80078 5.9998C1.80078 3.68021 3.68119 1.7998 6.00078 1.7998C8.32038 1.7998 10.2008 3.68021 10.2008 5.9998Z"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
}

export function IconPublic({
  className,
  width = "12",
  height = "12",
}: IconProps) {
  return (
    <div className={`${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M7.32103 6C7.32103 6.72926 6.72985 7.32045 6.00058 7.32045C5.27132 7.32045 4.68013 6.72926 4.68013 6C4.68013 5.27073 5.27132 4.67955 6.00058 4.67955C6.72985 4.67955 7.32103 5.27073 7.32103 6Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.80078 5.99998C2.36165 4.21425 4.02995 2.91895 6.00078 2.91895C7.97162 2.91895 9.63992 4.21427 10.2008 6.00001C9.63991 7.78574 7.97161 9.08105 6.00079 9.08105C4.02995 9.08105 2.36164 7.78573 1.80078 5.99998Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function IconPrivate({
  className,
  width = "12",
  height = "12",
}: IconProps) {
  return (
    <div className={`${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M2.65436 4.57967C2.26917 5.03502 1.97523 5.57005 1.80078 6.15653C2.33961 7.96605 4.01602 9.28551 6.0006 9.28551C6.41478 9.28551 6.81554 9.22804 7.19533 9.12064M3.59228 3.74722C4.2834 3.29153 5.11121 3.02631 6.00097 3.02631C7.98555 3.02631 9.66195 4.34577 10.2008 6.15529C9.90372 7.15399 9.26017 8.00351 8.40952 8.56445M3.59228 3.74722L2.24545 2.40039M3.59228 3.74722L5.11579 5.27073M8.40952 8.56445L9.7565 9.91143M8.40952 8.56445L6.88616 7.0411M6.88616 7.0411C7.1127 6.81456 7.25281 6.5016 7.25281 6.15591C7.25281 5.46454 6.69235 4.90407 6.00097 4.90407C5.65529 4.90407 5.34233 5.04419 5.11579 5.27073M6.88616 7.0411L5.11579 5.27073"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}



// quiz
export function IconReady({
  className,
  width = "12",
  height = "12",
}: IconProps) {
  return (
    <div className={`${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M4.60078 6.00005L5.53411 6.93338L7.40078 5.06672M10.2008 6.00005C10.2008 8.31964 8.32038 10.2 6.00078 10.2C3.68119 10.2 1.80078 8.31964 1.80078 6.00005C1.80078 3.68045 3.68119 1.80005 6.00078 1.80005C8.32038 1.80005 10.2008 3.68045 10.2008 6.00005Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function IconMissingQuiz({
  className,
  width = "12",
  height = "12",
}: IconProps) {
  return (
    <div className={`${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={height}
        height={width}
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M6.00078 4.60005V6.35005M10.2008 6.00005C10.2008 8.31964 8.32038 10.2 6.00078 10.2C3.68119 10.2 1.80078 8.31964 1.80078 6.00005C1.80078 3.68045 3.68119 1.80005 6.00078 1.80005C8.32038 1.80005 10.2008 3.68045 10.2008 6.00005ZM6.00078 7.75005H6.00428V7.75355H6.00078V7.75005Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function IconUploading({
  className,
  width = "12",
  height = "12",
}: IconProps) {
  return (
    <div className={`${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={height}
        height={width}
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M6.00078 4.13338V6.00005L7.40078 7.40005M10.2008 6.00005C10.2008 8.31964 8.32038 10.2 6.00078 10.2C3.68119 10.2 1.80078 8.31964 1.80078 6.00005C1.80078 3.68045 3.68119 1.80005 6.00078 1.80005C8.32038 1.80005 10.2008 3.68045 10.2008 6.00005Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
