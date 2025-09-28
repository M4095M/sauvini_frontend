export type OTPInputProps = {
  t: (key: string) => string;
  isRTL: boolean;
  onClick: () => void
  resendOTP: () => void
}