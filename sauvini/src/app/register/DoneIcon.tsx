import { IconProps } from "@/types/icon";

export default function DoneIcon({ className, width, height }: IconProps) {
  return (
    <div className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 186 186"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M93.0004 158.1C128.954 158.1 158.1 128.954 158.1 93C158.1 57.0463 128.954 27.9 93.0004 27.9C57.0467 27.9 27.9004 57.0463 27.9004 93C27.9004 128.954 57.0467 158.1 93.0004 158.1ZM123.167 82.4791C126.345 79.3012 126.345 74.1488 123.167 70.9709C119.989 67.7931 114.837 67.7931 111.659 70.9709L84.8629 97.7669L74.342 87.2459C71.1641 84.0681 66.0117 84.0681 62.8338 87.2459C59.6559 90.4238 59.6559 95.5762 62.8338 98.7541L79.1088 115.029C82.2867 118.207 87.4391 118.207 90.617 115.029L123.167 82.4791Z"
        />
      </svg>
    </div>
  );
}
