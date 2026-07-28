import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Use Motion Values for better performance (bypasses React render cycle for position)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Add spring physics for a "lagging" follow effect
  const springConfig = { damping: 25, stiffness: 200 };
  const mainX = useSpring(cursorX, springConfig);
  const mainY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // Check if the element under cursor is a button, link, or input
      const target = e.target;
      const isClickable = 
        window.getComputedStyle(target).cursor === 'pointer' || 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON';
      
      setIsHovered(isClickable);
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  return (
    <>
      {/* 1. Main Outer Ring (The "Trailing" Effect) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border border-primary/30 bg-primary/5 backdrop-blur-[2px]"
        style={{
          translateX: mainX,
          translateY: mainY,
          x: "-50%",
          y: "-50%",
        }}
        animate={{
          width: isHovered ? 80 : 40,
          height: isHovered ? 80 : 40,
          backgroundColor: isHovered ? "rgba(166, 38, 72, 0.15)" : "rgba(166, 38, 72, 0.05)",
        }}
      />

      {/* 2. Central Dot (The "Precision" Point) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-2 h-2 bg-primary rounded-full shadow-[0_0_15px_rgba(166,38,72,0.8)]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovered ? 0 : 1,
        }}
      />

      {/* 3. Ambient Large Glow (The "Aura") */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full"
        style={{
          x: mainX,
          y: mainY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </>
  );
};

export default CustomCursor;