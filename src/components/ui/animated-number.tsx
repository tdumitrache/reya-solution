import { useEffect, useRef } from "react";
import {
  motion,
  useSpring,
  useTransform,
  useMotionValue,
  type MotionValue,
} from "framer-motion";
import { formatNumber } from "@/lib/utils";

interface AnimatedNumberPropsType {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

const AnimatedDigits = ({
  motionValue,
  decimals,
}: {
  motionValue: MotionValue<number>;
  decimals: number;
}) => {
  const display = useTransform(motionValue, (val) =>
    formatNumber(val, decimals)
  );

  return <motion.span>{display}</motion.span>;
};

export const AnimatedNumber = ({
  value,
  decimals = 2,
  prefix = "",
  suffix = "",
  duration = 0.5,
  className = "",
}: AnimatedNumberPropsType) => {
  const prevValueRef = useRef<number | null>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(value);
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 20,
    duration,
  });

  const showFlashOnChangingValue = () => {
    const prevValue = prevValueRef.current;
    const element = spanRef.current;

    motionValue.set(value);

    if (element && prevValue !== null && value !== prevValue) {
      const flashColor = value > prevValue ? "#4bff99" : "#ff6991";

      element.style.color = flashColor;

      const timeout = setTimeout(() => {
        element.style.color = "inherit";
      }, 300);

      prevValueRef.current = value;

      return () => clearTimeout(timeout);
    }

    prevValueRef.current = value;
  };

  useEffect(showFlashOnChangingValue, [value, motionValue]);

  return (
    <span
      ref={spanRef}
      className={className}
      style={{ transition: "color 0.3s ease-out" }}
    >
      {prefix}
      <AnimatedDigits motionValue={springValue} decimals={decimals} />
      {suffix}
    </span>
  );
};
