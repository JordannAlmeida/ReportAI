export enum AnimationState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
  HOVER = 'hover',
  FOCUS = 'focus'
}

export type AnimationConfig = {
  duration: number;
  easing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  delay: number;
  iterations: number | 'infinite';
}

export const ANIMATION_PRESETS: Record<string, AnimationConfig> = {
  FAST: { duration: 200, easing: 'ease-out', delay: 0, iterations: 1 },
  NORMAL: { duration: 300, easing: 'ease-in-out', delay: 0, iterations: 1 },
  SLOW: { duration: 500, easing: 'ease', delay: 0, iterations: 1 },
  BOUNCE: { duration: 600, easing: 'ease-out', delay: 0, iterations: 1 },
  PULSE: { duration: 1000, easing: 'ease-in-out', delay: 0, iterations: 'infinite' },
  STAGGER: { duration: 300, easing: 'ease-out', delay: 100, iterations: 1 }
} as const;

export type UseAnimationReturn = {
  state: AnimationState;
  trigger: (animation: keyof typeof ANIMATION_PRESETS) => void;
  reset: () => void;
  isAnimating: boolean;
}

export type AnimationMetadata = {
  animationState?: AnimationState;
  animationDelay?: number;
  isHighlighted?: boolean;
}

export type AnimatedElement<T = {}> = T & AnimationMetadata;