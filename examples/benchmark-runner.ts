#!/usr/bin/env ts-node

/**
 * Runner для бенчмарков FingerprintJS
 * Запуск: yarn benchmark
 */

import { runAllBenchmarks } from '../src/utils/benchmark'

async function main() {
  console.log('🚀 Запуск бенчмарков FingerprintJS...\n')
  
  try {
    await runAllBenchmarks()
    console.log('\n✅ Все бенчмарки завершены успешно!')
  } catch (error) {
    console.error('\n❌ Ошибка при выполнении бенчмарков:', error)
    process.exit(1)
  }
}

// Запуск, если файл выполняется напрямую
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
}