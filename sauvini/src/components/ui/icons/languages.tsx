import Image from "next/image";
import EN_SVG from "./en.svg";
import AR_SVG from "./ar.svg";

export function EN() {
  return <Image src={EN_SVG} alt={"English"} className="rounded-full" />;
}

export function AR() {
  return <Image src={AR_SVG} alt={"Arabic"} className="rounded-full" />;
}
