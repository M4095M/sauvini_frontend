"use client";

import { ButtonProps } from "@/types/button";
import { useEffect, useState } from "react";

export default function Button({
  state,
  size,
  icon_position,
  text,
  icon,
  disabled,
}: ButtonProps) {
  const [className, setClassName] = useState("");
  const [loading, setLoading] = useState(true);

  const setState = (state: string, size: string) => {
    switch (state) {
      case "filled":
        setClassName(
          (prev) =>
            `${prev}hover:bg-[#FFFFFF14] disabled: disabled: ${
              disabled
                ? "text-neutral-600 bg-neutral-200 cursor-not-allowed "
                : "bg-primary-300 text-neutral-100 cursor-pointer"
            }`
        );
        break;

      case "outlined":
        setClassName(
          (prev) =>
            `${prev} border-2 border-primary-500 text-primary-500 hover:bg-[#49454F14] ${
              disabled
                ? "text-neutral-600 bg-neutral-200 cursor-not-allowed "
                : "text-primary-500 cursor-pointer"
            }`
        );
        break;

      case "text":
        setClassName(
          (prev) =>
            `${prev} hover:bg-[#70B7FF14] ${
              disabled
                ? "text-neutral-600 bg-neutral-200 cursor-not-allowed "
                : "text-neutral-300 cursor-pointer"
            }`
        );
        break;

      case "elevated":
        setClassName(
          (prev) =>
            `${prev}  hover:bg-[#70B7FF14] ${
              disabled
                ? "text-neutral-600 bg-neutral-200 cursor-not-allowed "
                : "text-primary-300 bg-primary-100 cursor-pointer"
            } ${returnElevationForSize(size)}`
        );

      case "tonal":
        setClassName(
          (prev) =>
            `${prev}  hover:bg-[#70B7FF14] ${
              disabled
                ? "text-neutral-600 bg-neutral-200 cursor-not-allowed "
                : "text-primary-300 bg-primary-100 cursor-pointer"
            } `
        );

      default:
        break;
    }
  };

  const setSize = (size: string, icon_position: string) => {
    switch (size) {
      case "XL":
        setClassName(
          (prev) =>
            `${prev} gap-4 h-[136px] text-3xl ${
              icon_position === "icon-only"
                ? "aspect-square p-12"
                : "py-12 px-16"
            } `
        );
        break;

      case "L":
        setClassName(
          (prev) =>
            `${prev} gap-3 text-2xl ${
              icon_position === "icon-only" ? "aspect-square p-8" : "py-8 px-12"
            } `
        );
        break;

      case "M":
        setClassName(
          (prev) =>
            `${prev} gap-2 text-base ${
              icon_position === "icon-only"
                ? "aspect-square rounded-[50%] p-4"
                : "py-4 px-6"
            } `
        );
        break;

      case "S":
        setClassName(
          (prev) =>
            `${prev} gap-2 text-sm ${
              icon_position === "icon-only"
                ? "aspect-square p-2.5"
                : "py-2.5 px-4"
            } `
        );
        break;

      case "XS":
        setClassName(
          (prev) =>
            `${prev} gap-1 text-sm ${
              icon_position === "icon-only"
                ? "aspect-square p-1.5"
                : "py-1.5 px-3"
            } `
        );
        break;

      default:
        break;
    }
  };

  const setIconPosition = (icon_position: string) => {
    switch (icon_position) {
      case "left":
        break;

      case "right":
        setClassName((prev) => `${prev} flex-row-reverse`);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    setState(state, size);
    setSize(size, icon_position);
    setIconPosition(icon_position);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className=""></div>;
  }

  return (
    <button
      className={`rounded-full flex justify-center items-center${className}`}
    >
      <span>{icon}</span>
      <span>{text}</span>
    </button>
  );
}

function returnElevationForSize(size: string): string {
  switch (size) {
    case "XL":
      return "btn-elevation-3";

    case "L":
      return "btn-elevation-3";

    case "M":
      return "btn-elevation-2";

    case "S":
      return "btn-elevation-2";

    case "XS":
      return "btn-elevation-1";

    default:
      return "btn-elevation-1";
  }
}
