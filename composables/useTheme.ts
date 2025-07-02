interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
  success: string
  warning: string
  error: string
  info: string
}

interface Theme {
  name: string
  colors: ThemeColors
}

const lightTheme: Theme = {
  name: 'light',
  colors: {
    primary: '#3B82F6',
    secondary: '#6B7280',
    accent: '#F59E0B',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  }
}

const darkTheme: Theme = {
  name: 'dark',
  colors: {
    primary: '#60A5FA',
    secondary: '#9CA3AF',
    accent: '#FBBF24',
    background: '#111827',
    surface: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    border: '#374151',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#60A5FA'
  }
}

const systemTheme: Theme = {
  name: 'system',
  colors: lightTheme.colors // Will be dynamically updated
}

export const useTheme = () => {
  const appStore = useAppStore()
  
  const currentTheme = computed(() => appStore.theme)
  const isDark = computed(() => {
    if (currentTheme.value === 'system') {
      return import.meta.client ? window.matchMedia('(prefers-color-scheme: dark)').matches : false
    }
    return currentTheme.value === 'dark'
  })

  const theme = computed(() => {
    if (currentTheme.value === 'system') {
      return isDark.value ? darkTheme : lightTheme
    }
    return currentTheme.value === 'dark' ? darkTheme : lightTheme
  })

  const colors = computed(() => theme.value.colors)

  // Set theme
  const setTheme = (themeName: 'light' | 'dark' | 'system') => {
    appStore.setTheme(themeName)
    applyTheme()
  }

  // Apply theme to DOM
  const applyTheme = () => {
    if (!import.meta.client) return

    const root = document.documentElement
    const currentColors = colors.value

    // Apply CSS custom properties
    root.style.setProperty('--color-primary', currentColors.primary)
    root.style.setProperty('--color-secondary', currentColors.secondary)
    root.style.setProperty('--color-accent', currentColors.accent)
    root.style.setProperty('--color-background', currentColors.background)
    root.style.setProperty('--color-surface', currentColors.surface)
    root.style.setProperty('--color-text', currentColors.text)
    root.style.setProperty('--color-text-secondary', currentColors.textSecondary)
    root.style.setProperty('--color-border', currentColors.border)
    root.style.setProperty('--color-success', currentColors.success)
    root.style.setProperty('--color-warning', currentColors.warning)
    root.style.setProperty('--color-error', currentColors.error)
    root.style.setProperty('--color-info', currentColors.info)

    // Update body class
    document.body.classList.toggle('dark', isDark.value)
    document.body.classList.toggle('light', !isDark.value)

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', currentColors.primary)
    }
  }

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = isDark.value ? 'light' : 'dark'
    setTheme(newTheme)
  }

  // Color utilities
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  }

  const adjustBrightness = (hex: string, percent: number): string => {
    const rgb = hexToRgb(hex)
    if (!rgb) return hex

    const adjust = (color: number) => {
      const adjusted = Math.round(color + (255 - color) * (percent / 100))
      return Math.max(0, Math.min(255, adjusted))
    }

    return rgbToHex(adjust(rgb.r), adjust(rgb.g), adjust(rgb.b))
  }

  const getContrastColor = (backgroundColor: string): string => {
    const rgb = hexToRgb(backgroundColor)
    if (!rgb) return '#000000'

    // Calculate luminance
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
    return luminance > 0.5 ? '#000000' : '#FFFFFF'
  }

  const generateColorVariants = (baseColor: string) => {
    return {
      50: adjustBrightness(baseColor, 95),
      100: adjustBrightness(baseColor, 90),
      200: adjustBrightness(baseColor, 80),
      300: adjustBrightness(baseColor, 60),
      400: adjustBrightness(baseColor, 40),
      500: baseColor,
      600: adjustBrightness(baseColor, -20),
      700: adjustBrightness(baseColor, -40),
      800: adjustBrightness(baseColor, -60),
      900: adjustBrightness(baseColor, -80)
    }
  }

  // Custom theme creation
  const createCustomTheme = (name: string, baseColors: Partial<ThemeColors>): Theme => {
    const defaultColors = lightTheme.colors
    return {
      name,
      colors: { ...defaultColors, ...baseColors }
    }
  }

  // Accessibility helpers
  const getReadableColor = (backgroundColor: string, lightColor = '#FFFFFF', darkColor = '#000000'): string => {
    const contrast1 = getColorContrast(backgroundColor, lightColor)
    const contrast2 = getColorContrast(backgroundColor, darkColor)
    
    return contrast1 > contrast2 ? lightColor : darkColor
  }

  const getColorContrast = (color1: string, color2: string): number => {
    const rgb1 = hexToRgb(color1)
    const rgb2 = hexToRgb(color2)
    
    if (!rgb1 || !rgb2) return 0

    const getLuminance = (rgb: { r: number; g: number; b: number }) => {
      const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
        c = c / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    const l1 = getLuminance(rgb1)
    const l2 = getLuminance(rgb2)
    
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)
    
    return (lighter + 0.05) / (darker + 0.05)
  }

  // System theme detection
  const watchSystemTheme = () => {
    if (!import.meta.client) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = () => {
      if (currentTheme.value === 'system') {
        applyTheme()
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }

  // Initialize theme on mount
  onMounted(() => {
    applyTheme()
    watchSystemTheme()
  })

  // Watch for theme changes
  watch([currentTheme, isDark], () => {
    applyTheme()
  })

  return {
    // State
    currentTheme: readonly(currentTheme),
    isDark: readonly(isDark),
    theme: readonly(theme),
    colors: readonly(colors),

    // Methods
    setTheme,
    toggleTheme,
    applyTheme,
    
    // Color utilities
    hexToRgb,
    rgbToHex,
    adjustBrightness,
    getContrastColor,
    generateColorVariants,
    createCustomTheme,
    
    // Accessibility
    getReadableColor,
    getColorContrast,
    
    // System theme
    watchSystemTheme,

    // Available themes
    themes: {
      light: lightTheme,
      dark: darkTheme,
      system: systemTheme
    }
  }
}
