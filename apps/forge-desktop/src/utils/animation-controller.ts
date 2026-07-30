export const AnimationController = {
  durations: {
    fast: '100ms',
    normal: '200ms',
    slow: '350ms',
  },
  curves: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    linear: 'linear',
  },
  springs: {
    default: 'spring(1, 80, 10, 0)',
    gentle: 'spring(1, 100, 15, 0)',
    bouncy: 'spring(0.8, 120, 12, 0)',
  },
  transitions: {
    default: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    sidebar: 'width 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    dockHeight: 'height 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    dockWidth: 'width 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};
export default AnimationController;
