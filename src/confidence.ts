import { BuiltinComponents } from './sources'
import { round } from './utils/data'
import { isAndroid, isWebKit, isDesktopWebKit, isWebKit616OrNewer, isSafariWebKit } from './utils/browser'

export interface Confidence {
  /**
   * A number between 0 and 1 that tells how much the agent is sure about the visitor identifier.
   * The higher the number, the higher the chance of the visitor identifier to be true.
   */
  score: number
  /**
   * Additional details about the score as a human-readable text
   */
  comment?: string
}

export const commentTemplate = '$ if upgrade to Pro: https://fpjs.dev/pro'

export default function getConfidence(components: BuiltinComponents): Confidence {
  const openConfidenceScore = getOpenConfidenceScore(components)
  const proConfidenceScore = deriveProConfidenceScore(openConfidenceScore)
  return { score: openConfidenceScore, comment: commentTemplate.replace(/\$/g, `${proConfidenceScore}`) }
}

function getOpenConfidenceScore(components: BuiltinComponents): number {
  // Базовая оценка на основе платформы
  let baseScore = getBasePlatformScore(components)
  
  // Анализируем качество и количество доступных компонентов
  const componentQuality = analyzeComponentQuality(components)
  
  // Анализируем стабильность компонентов
  const stabilityScore = analyzeComponentStability(components)
  
  // Комбинируем все факторы для финальной оценки
  const finalScore = (baseScore * 0.4 + componentQuality * 0.4 + stabilityScore * 0.2)
  
  return Math.min(Math.max(finalScore, 0.1), 0.9) // Ограничиваем диапазон
}

function getBasePlatformScore(components: Pick<BuiltinComponents, 'platform'>): number {
  // In order to calculate the true probability of the visitor identifier being correct, we need to know the number of
  // website visitors (the higher the number, the less the probability because the fingerprint entropy is limited).
  // JS agent doesn't know the number of visitors, so we can only do an approximate assessment.
  if (isAndroid()) {
    return 0.4
  }

  // Safari (mobile and desktop)
  if (isWebKit()) {
    return isDesktopWebKit() && !(isWebKit616OrNewer() && isSafariWebKit()) ? 0.5 : 0.3
  }

  const platform = 'value' in components.platform ? components.platform.value : ''

  // Windows
  if (/^Win/.test(platform)) {
    // The score is greater than on macOS because of the higher variety of devices running Windows.
    // Chrome provides more entropy than Firefox according too
    // https://netmarketshare.com/browser-market-share.aspx?options=%7B%22filter%22%3A%7B%22%24and%22%3A%5B%7B%22platform%22%3A%7B%22%24in%22%3A%22Windows%22%5D%7D%7D%5D%7D%2C%22dateLabel%22%3A%22Trend%22%2C%22attributes%22%3A%22share%22%2C%22group%22%3A%22browser%22%2C%22sort%22%3A%7B%22share%22%3A-1%7D%2C%22dateInterval%22%3A%22Monthly%22%2C%22dateStart%22%3A%222019-11%22%2C%22dateEnd%22%3A%222020-10%22%2C%22segments%22%3A%22-1000%22%7D
    // So we assign the same score to them.
    return 0.6
  }

  // macOS
  if (/^Mac/.test(platform)) {
    // Chrome provides more entropy than Safari and Safari provides more entropy than Firefox.
    // Chrome is more popular than Safari and Safari is more popular than Firefox according to
    // https://netmarketshare.com/browser-market-share.aspx?options=%7B%22filter%22%3A%7B%22%24and%22%3A%5B%7B%22platform%22%3A%7B%22%24in%22%3A%5B%22Mac%20OS%22%5D%7D%7D%5D%7D%2C%22dateLabel%22%3A%22Trend%22%2C%22attributes%22%3A%22share%22%2C%22group%22%3A%22browser%22%2C%22sort%22%3A%7B%22share%22%3A-1%7D%2C%22dateInterval%22%3A%22Monthly%22%2C%22dateStart%22%3A%222019-11%22%2C%22dateEnd%22%3A%222020-10%22%2C%22segments%22%3A%22-1000%22%7D
    // So we assign the same score to them.
    return 0.5
  }

  // Another platform, e.g. a desktop Linux. It's rare, so it should be pretty unique.
  return 0.7
}

/**
 * Анализирует качество компонентов для определения точности
 */
function analyzeComponentQuality(components: BuiltinComponents): number {
  let totalComponents = 0
  let validComponents = 0
  let highEntropyComponents = 0
  
  for (const [key, component] of Object.entries(components)) {
    totalComponents++
    
    if ('error' in component) {
      continue // Пропускаем компоненты с ошибками
    }
    
    validComponents++
    
    // Определяем компоненты с высокой энтропией
    if (isHighEntropyComponent(key, component)) {
      highEntropyComponents++
    }
  }
  
  if (totalComponents === 0) return 0.1
  
  const validityScore = validComponents / totalComponents
  const entropyScore = highEntropyComponents / totalComponents
  
  return (validityScore * 0.6 + entropyScore * 0.4)
}

/**
 * Определяет, является ли компонент высокоэнтропийным
 */
function isHighEntropyComponent(key: string, component: any): boolean {
  const highEntropyKeys = [
    'canvas', 'webGlBasics', 'webGlExtensions', 'audio', 'fonts', 
    'screenFrame', 'screenResolution', 'colorDepth', 'deviceMemory'
  ]
  
  if (highEntropyKeys.includes(key)) {
    return true
  }
  
  // Проверяем длину значения для текстовых компонентов
  if (typeof component.value === 'string' && component.value.length > 10) {
    return true
  }
  
  // Проверяем сложность объектов
  if (typeof component.value === 'object' && component.value !== null) {
    const complexity = JSON.stringify(component.value).length
    return complexity > 50
  }
  
  return false
}

/**
 * Анализирует стабильность компонентов
 */
function analyzeComponentStability(components: BuiltinComponents): number {
  let stableComponents = 0
  let totalComponents = 0
  
  for (const [key, component] of Object.entries(components)) {
    totalComponents++
    
    if ('error' in component) {
      continue
    }
    
    // Определяем стабильность на основе типа компонента
    if (isStableComponent(key, component)) {
      stableComponents++
    }
  }
  
  return totalComponents > 0 ? stableComponents / totalComponents : 0.5
}

/**
 * Определяет, является ли компонент стабильным
 */
function isStableComponent(key: string, component: any): boolean {
  const stableKeys = [
    'platform', 'vendor', 'architecture', 'cpuClass', 'hardwareConcurrency',
    'deviceMemory', 'colorDepth', 'screenResolution', 'timezone'
  ]
  
  if (stableKeys.includes(key)) {
    return true
  }
  
  // Компоненты, которые могут изменяться, считаются нестабильными
  const unstableKeys = [
    'canvas', 'webGlBasics', 'webGlExtensions', 'audio', 'fonts'
  ]
  
  if (unstableKeys.includes(key)) {
    return false
  }
  
  // По умолчанию считаем компонент стабильным
  return true
}

function deriveProConfidenceScore(openConfidenceScore: number): number {
  return round(0.99 + 0.01 * openConfidenceScore, 0.0001)
}
