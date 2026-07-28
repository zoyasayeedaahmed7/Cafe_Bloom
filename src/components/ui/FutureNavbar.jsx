import React, { useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { setupSvgRenderer } from "@left4code/svg-renderer";
import { cva } from "class-variance-authority";
import { useTheme } from "../../context/ThemeContext";

/** 🔥 SVG FRAME COMPONENT **/
const Frame = ({
  className,
  paths,
  enableBackdropBlur,
  enableViewBox,
  ...props
}) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current && svgRef.current.parentElement) {
      const instance = setupSvgRenderer({
        el: svgRef.current,
        paths,
        enableBackdropBlur,
        enableViewBox,
      });

      return () => instance.destroy();
    }
  }, [paths, enableViewBox, enableBackdropBlur]);

  return (
    <svg
      {...props}
      className={twMerge("absolute inset-0 size-full", className)}
      xmlns="http://www.w3.org/2000/svg"
      ref={svgRef}
    />
  );
};

/** 🎨 BUTTON VARIANTS & COLORS **/
// Fills are SVG attributes and cannot resolve CSS variables, so each theme
// needs literals. Day mode is far weaker — night mode's 22% burgundy reads as
// a solid pink slab on a pale page. `text` can stay a variable because it is
// applied as an inline style, where var() does resolve.
const COLORS = {
  night: {
    stroke1: "#a62648",
    fill1: "rgba(166, 38, 72, 0.22)",
    stroke2: "#a62648",
    fill2: "rgba(166, 38, 72, 0.1)",
    text: "var(--color-text-base)",
  },
  day: {
    stroke1: "rgba(138, 27, 58, 0.45)",
    fill1: "rgba(166, 38, 72, 0.06)",
    stroke2: "rgba(138, 27, 58, 0.35)",
    fill2: "rgba(166, 38, 72, 0.03)",
    text: "var(--color-text-base)",
  },
};

const buttonVariants = cva(
  "group font-bold mb-2 relative px-8 py-2 cursor-pointer transition-all outline-none [&>span]:relative [&>span]:flex [&>span]:items-center [&>span]:justify-center",
  {
    variants: {
      shape: {
        default: "",
        flat: "",
        simple: "ps-8 pe-6",
      },
    },
    defaultVariants: {
      shape: "default",
    },
  }
);

/** 🔥 FUTURE BUTTON COMPONENT **/
const FutureButton = ({
  className,
  children,
  shape = "default",
  enableBackdropBlur = false,
  enableViewBox = false,
  customPaths,
  textColor,
  ...props
}) => {
  const { isDay } = useTheme();
  const colors = isDay ? COLORS.day : COLORS.night;

  return (
    <button
      {...props}
      style={{ color: textColor || colors.text }}
      className={twMerge(buttonVariants({ shape, className }))}
    >
      <div className="absolute inset-0 -mb-2">
        {!customPaths && (shape === "default" || shape === "flat") && (
          <Frame
            enableBackdropBlur={enableBackdropBlur}
            enableViewBox={enableViewBox}
            paths={[
              {
                show: true,
                style: { strokeWidth: "1", stroke: colors.stroke1, fill: colors.fill1 },
                path: [
                  ["M", "17", "0"],
                  ["L", "100% - 7", "0"],
                  ["L", "100% + 0", "0% + 9.5"],
                  ["L", "100% - 18", "100% - 6"],
                  ["L", "4", "100% - 6"],
                  ["L", "0", "100% - 15"],
                  ["L", "17", "0"],
                ],
              },
              {
                show: true,
                style: { strokeWidth: "1", stroke: colors.stroke2, fill: colors.fill2 },
                path: [
                  ["M", "9", "100% - 6"],
                  ["L", "100% - 22", "100% - 6"],
                  ["L", "100% - 25", "100% + 0"],
                  ["L", "12", "100% + 0"],
                  ["L", "9", "100% - 6"],
                ],
              },
            ]}
          />
        )}
      </div>
      <span>{children}</span>
    </button>
  );
};

export { Frame, FutureButton };