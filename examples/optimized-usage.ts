/**
 * Пример использования оптимизированных функций FingerprintJS
 */

import { 
  load, 
  clearHashCache, 
  getHashCacheStats,
  parallelWithLimit,
  benchmark,
  measureTime,
  profileMemory
} from '@fingerprintjs/fingerprintjs'

async function demonstrateOptimizations() {
  console.log('🚀 Демонстрация оптимизаций FingerprintJS\n')

  // 1. Загрузка с оптимизированными настройками
  console.log('1. Загрузка агента с оптимизациями...')
  const agent = await load({
    enableCache: true,        // Включить кэширование
    cacheTTL: 300000,         // TTL кэша 5 минут
    delayFallback: 25,        // Уменьшенная задержка
    debug: false              // Отключить отладку для производительности
  })

  // 2. Первый вызов - медленный, но создает кэш
  console.log('\n2. Первый вызов (создание кэша)...')
  const firstResult = await measureTime('First call', async () => {
    return await agent.get()
  })
  
  console.log(`Visitor ID: ${firstResult.visitorId}`)
  console.log(`Confidence: ${firstResult.confidence.score}`)

  // 3. Второй вызов - быстрый благодаря кэшу
  console.log('\n3. Второй вызов (использование кэша)...')
  const secondResult = await measureTime('Second call (cached)', async () => {
    return await agent.get()
  })

  // 4. Статистика кэша
  console.log('\n4. Статистика кэша хешей...')
  const cacheStats = getHashCacheStats()
  console.log(`Hash cache: ${cacheStats.size}/${cacheStats.maxSize} entries`)

  // 5. Демонстрация параллельной обработки
  console.log('\n5. Демонстрация параллельной обработки...')
  const items = Array.from({ length: 10 }, (_, i) => `Item ${i}`)
  
  const parallelResults = await measureTime('Parallel processing', async () => {
    return await parallelWithLimit(
      items,
      async (item) => {
        // Имитируем асинхронную обработку
        await new Promise(resolve => setTimeout(resolve, Math.random() * 100))
        return `${item} processed`
      },
      3 // Максимум 3 одновременных операции
    )
  })
  
  console.log(`Processed ${parallelResults.length} items in parallel`)

  // 6. Бенчмарк производительности
  console.log('\n6. Бенчмарк производительности...')
  const benchmarkResult = await benchmark('Fingerprint generation', async () => {
    return await agent.get()
  }, { 
    iterations: 10,
    memoryTracking: true 
  })
  
  console.log(`Benchmark results:`)
  console.log(`  Average time: ${benchmarkResult.averageTime.toFixed(3)}ms`)
  console.log(`  Min time: ${benchmarkResult.minTime.toFixed(3)}ms`)
  console.log(`  Max time: ${benchmarkResult.maxTime.toFixed(3)}ms`)
  console.log(`  Iterations: ${benchmarkResult.iterations}`)
  if (benchmarkResult.memoryUsage) {
    console.log(`  Memory usage: ${(benchmarkResult.memoryUsage / 1024 / 1024).toFixed(2)}MB`)
  }

  // 7. Профилирование памяти
  console.log('\n7. Профилирование памяти...')
  await profileMemory('Memory profiling', async () => {
    // Создаем несколько отпечатков для анализа памяти
    for (let i = 0; i < 5; i++) {
      await agent.get()
    }
  })

  // 8. Очистка кэша
  console.log('\n8. Очистка кэша...')
  clearHashCache()
  console.log('Hash cache cleared')
  
  const finalCacheStats = getHashCacheStats()
  console.log(`Final cache size: ${finalCacheStats.size}`)

  console.log('\n✅ Демонстрация завершена!')
  
  return {
    firstResult,
    secondResult,
    cacheStats,
    parallelResults,
    benchmarkResult
  }
}

// Функция для сравнения производительности
async function comparePerformance() {
  console.log('\n📊 Сравнение производительности...\n')

  // Тест без кэша
  const agentWithoutCache = await load({
    enableCache: false,
    delayFallback: 50
  })

  const withoutCacheResult = await benchmark('Without cache', async () => {
    return await agentWithoutCache.get()
  }, { iterations: 5 })

  // Тест с кэшем
  const agentWithCache = await load({
    enableCache: true,
    cacheTTL: 300000,
    delayFallback: 25
  })

  const withCacheResult = await benchmark('With cache', async () => {
    return await agentWithCache.get()
  }, { iterations: 5 })

  // Сравнение результатов
  console.log('Performance comparison:')
  console.log(`Without cache: ${withoutCacheResult.averageTime.toFixed(3)}ms average`)
  console.log(`With cache:    ${withCacheResult.averageTime.toFixed(3)}ms average`)
  
  const improvement = ((withoutCacheResult.averageTime - withCacheResult.averageTime) / withoutCacheResult.averageTime * 100)
  console.log(`Improvement:   ${improvement.toFixed(1)}% faster with cache`)
}

// Функция для демонстрации обработки ошибок
async function demonstrateErrorHandling() {
  console.log('\n🛡️ Демонстрация обработки ошибок...\n')

  try {
    // Создаем агент с неверными настройками для демонстрации
    const agent = await load({
      delayFallback: -1, // Неверное значение
      enableCache: true
    })

    const result = await agent.get()
    console.log('Unexpected success:', result.visitorId)
  } catch (error) {
    console.log('Error handled gracefully:', error.message)
  }
}

// Главная функция
async function main() {
  try {
    await demonstrateOptimizations()
    await comparePerformance()
    await demonstrateErrorHandling()
  } catch (error) {
    console.error('❌ Ошибка в демонстрации:', error)
  }
}

// Экспорт для использования в других модулях
export {
  demonstrateOptimizations,
  comparePerformance,
  demonstrateErrorHandling,
  main
}

// Запуск, если файл выполняется напрямую
if (typeof window !== 'undefined') {
  // В браузере
  window.addEventListener('load', () => {
    main().catch(console.error)
  })
} else if (typeof module !== 'undefined' && module.exports) {
  // В Node.js
  module.exports = { main }
}