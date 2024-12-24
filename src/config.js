export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png']

export const UI_CONSTANTS = {
  ANIMATIONS: {
    SPRING: {
      type: "spring",
      stiffness: 260,
      damping: 20
    },
    EASE: {
      type: "tween",
      ease: "easeInOut",
      duration: 0.3
    }
  },
  COLORS: {
    primary: {
      from: '#6366f1',
      to: '#8b5cf6'
    },
    background: {
      dark: '#1a1c2e',
      darker: '#0f1117'
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: 'rgba(255, 255, 255, 0.1)',
      hover: 'rgba(255, 255, 255, 0.08)'
    }
  }
}
