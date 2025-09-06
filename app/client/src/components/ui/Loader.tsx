import { ClipLoader, FadeLoader, PulseLoader } from "react-spinners";

import { type ColorNameType } from "@client/styles/colors.js";

type SizeOption = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const sizeMap: Record<SizeOption, number> = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
};

const barSizeMap: Record<
  SizeOption,
  { height: number; width: number; radius: number }
> = {
  xs: { height: 4, width: 2, radius: 1 },
  sm: { height: 6, width: 3, radius: 2 },
  md: { height: 10, width: 4, radius: 2 },
  lg: { height: 14, width: 5, radius: 3 },
  xl: { height: 18, width: 6, radius: 4 },
  "2xl": { height: 22, width: 7, radius: 5 },
};

type BaseLoaderProps = {
  color?: ColorNameType;
  size?: SizeOption | number; // semantic or numeric
};

type FadeLoaderProps = {
  variant: "fade";
  height?: number;
  width?: number;
  radius?: number;
} & BaseLoaderProps;

type DefaultLoaderProps = {
  variant: "pulse" | "clip";
} & BaseLoaderProps;

type LoaderProps = DefaultLoaderProps | FadeLoaderProps;

function Loader(props: LoaderProps) {
  const { variant, color = "primary" } = props;

  if (variant === "fade") {
    // Semantic size → fallback to barSizeMap
    const sizeKey = typeof props.size === "string" ? props.size : "md";
    const defaults = barSizeMap[sizeKey as SizeOption];

    return (
      <FadeLoader
        color={`var(--color-${color})`}
        height={props.height ?? defaults.height}
        width={props.width ?? defaults.width}
        radius={props.radius ?? defaults.radius}
      />
    );
  }

  // For pulse/clip loaders
  const size =
    typeof props.size === "string"
      ? sizeMap[props.size as SizeOption]
      : (props.size ?? sizeMap.md);

  return variant === "pulse" ? (
    <PulseLoader color={color} size={size} />
  ) : (
    <ClipLoader color={color} size={size} />
  );
}

export default Loader;
