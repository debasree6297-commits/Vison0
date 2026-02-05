import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_SMOOTH = [0.4, 0, 0.2, 1] as const;

interface ScrollRevealProps {
  children?: React.ReactNode; 
  key?: React.Key;
  direction?: 'up' | 'left' | 'right' | 'down' | 'none';
  distance?: number;
  delay?: number;
  duration?: number;
  scale?: number;
}

const ScrollReveal = ({ 
  children, 
  direction = 'up', 
  distance = 40, 
  delay = 0, 
  duration = 0.6, 
  scale = 1
}: ScrollRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3, once: true });

  const getInitialPos = () => {
    switch(direction) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: -distance };
      case 'right': return { x: distance };
      default: return {};
    }
  };

  const variants = {
    hidden: { opacity: 0, ...getInitialPos(), scale },
    visible: { 
      opacity: 1, 
      x: 0, 
      y: 0, 
      scale: 1,
      transition: { duration, ease: EASE_OUT, delay }
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className="h-full accelerated"
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
