// New: Centralized configuration for Framer Motion transitions
export const animationConfig = {
  spring: {
    type: "spring",
    duration: 0.8,
    damping: 10, // New: Default damping for spring
    stiffness: 100, // New: Default stiffness for spring
    restDelta: 0.001, // New: Default restDelta for spring
  },
  // Add other transition types if needed, e.g., tween
  // tween: {
  // type: "tween",
  // duration: 0.5,
  // ease: "easeInOut",
  // }
};

// New: Re-export the base transition from animationConfig for consistency
export const transition = animationConfig.spring;

// New: Refactor animations into a single 'variants' object for better organization
// This also makes it easier to use with Framer Motion's `custom` prop for dynamic values
// Example Usage: <motion.div variants={animationVariants.slide('left')} initial="initial" animate="animate" exit="exit" />

export const animationVariants = {
  slide: (direction) => ({
    initial: {
      x: direction === "left"? -100 : direction === "right"? 100 : 0,
      y: direction === "up"? 100 : direction === "down"? -100 : 0,
      opacity: 0,
      transition: {...transition, delay: 0.5 },
    },
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {...transition, delay: 0 },
    },
    exit: {
      x: direction === "left"? -100 : direction === "right"? 100 : 0,
      y: direction === "up"? 100 : direction === "down"? -100 : 0,
      opacity: 0, // Ensure opacity goes to 0 on exit
      transition: {...transition, delay: 0 },
    },
  }),

  fade: {
    initial: {
      opacity: 0,
      transition: {...transition, delay: 0.5 },
    },
    animate: {
      opacity: 1,
      transition: {...transition, delay: 0 },
    },
    exit: {
      opacity: 0,
      transition: {...transition, delay: 0 },
    },
  },

  headText: { // Renamed from headTextAnimation to follow consistent naming
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: {
      type: "spring", // Can override individual transition properties
      damping: 5,
      stiffness: 40,
      restDelta: 0.001,
      duration: 0.3, // Duration here refers to "tween" duration, for spring it's more about damping/stiffness
    },
  },

  headContent: { // Renamed from headContentAnimation
    initial: { y: 100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: {
      type: "spring",
      damping: 7,
      stiffness: 30,
      restDelta: 0.001,
      duration: 0.6,
      delay: 0.2,
      delayChildren: 0.2,
    },
  },

  headContainer: { // Renamed from headContainerAnimation
    initial: { x: -100, opacity: 0, transition: {...transition, delay: 0.5 } },
    animate: { x: 0, opacity: 1, transition: {...transition, delay: 0 } },
    exit: { x: -100, opacity: 0, transition: {...transition, delay: 0 } },
  },
};

// Original exports for backward compatibility (can be removed if switching to animationVariants.xyz)
export const slideAnimation = animationVariants.slide;
export const fadeAnimation = animationVariants.fade;
export const headTextAnimation = animationVariants.headText;
export const headContentAnimation = animationVariants.headContent;
export const headContainerAnimation = animationVariants.headContainer;