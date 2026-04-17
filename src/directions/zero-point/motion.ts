export const breath = {
  keyframes: [
    { opacity: 0.6, scale: 1 },
    { opacity: 0.9, scale: 1.015 },
    { opacity: 0.6, scale: 1 },
  ],
  options: {
    duration: 6,
    repeat: Infinity,
    ease: [0.4, 0, 0.6, 1] as [number, number, number, number],
  },
};
