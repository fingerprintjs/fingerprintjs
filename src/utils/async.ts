export type MaybePromise<T> = Promise<T> | T

export function wait<T = void>(durationMs: number, resolveWith?: T): Promise<T> {
  return new Promise((resolve) => setTimeout(resolve, durationMs, resolveWith))
}

/**
 * Allows asynchronous actions and microtasks to happen.
 */
function releaseEventLoop(): Promise<void> {
  // Don't use setTimeout because Chrome throttles it in some cases causing very long agent execution:
  // https://stackoverflow.com/a/6032591/1118709
  // https://github.com/chromium/chromium/commit/0295dd09496330f3a9103ef7e543fa9b6050409b
  // Reusing a MessageChannel object gives no noticeable benefits
  return new Promise((resolve) => {
    const channel = new MessageChannel()
    channel.port1.onmessage = () => resolve()
    channel.port2.postMessage(null)
  })
}

/**
 * Улучшенная версия requestIdleCallback с fallback и оптимизациями
 */
export function requestIdleCallbackIfAvailable(
  delayFallback: number,
  deadlineFallback: number,
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(() => resolve(), { timeout: deadlineFallback })
    } else {
      // Используем setTimeout с приоритизацией
      setTimeout(resolve, delayFallback)
    }
  })
}

/**
 * Параллельное выполнение с ограничением количества одновременных операций
 */
export async function parallelWithLimit<T>(
  items: T[],
  processor: (item: T) => Promise<any>,
  concurrencyLimit: number = 4
): Promise<any[]> {
  const results: any[] = []
  const executing: Promise<any>[] = []
  
  for (const item of items) {
    const promise = processor(item).then(result => {
      const index = executing.indexOf(promise)
      if (index > -1) {
        executing.splice(index, 1)
      }
      return result
    })
    
    executing.push(promise)
    results.push(promise)
    
    if (executing.length >= concurrencyLimit) {
      await Promise.race(executing)
    }
  }
  
  return Promise.all(results)
}

/**
 * Кэширование промисов для избежания дублирования запросов
 */
export class PromiseCache<K, V> {
  private cache = new Map<K, Promise<V>>()
  private maxSize: number
  
  constructor(maxSize: number = 100) {
    this.maxSize = maxSize
  }
  
  async get(key: K, factory: () => Promise<V>): Promise<V> {
    if (this.cache.has(key)) {
      return this.cache.get(key)!
    }
    
    if (this.cache.size >= this.maxSize) {
      // Удаляем старые записи
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    
    const promise = factory()
    this.cache.set(key, promise)
    
    // Удаляем из кэша при ошибке
    promise.catch(() => {
      this.cache.delete(key)
    })
    
    return promise
  }
  
  clear(): void {
    this.cache.clear()
  }
  
  get size(): number {
    return this.cache.size
  }
}

/**
 * Оптимизированная функция ожидания с возможностью отмены
 */
export function waitWithTimeout(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new Error('Operation aborted'))
      return
    }
    
    const timeoutId = setTimeout(() => {
      if (signal?.aborted) {
        reject(new Error('Operation aborted'))
      } else {
        resolve()
      }
    }, ms)
    
    signal?.addEventListener('abort', () => {
      clearTimeout(timeoutId)
      reject(new Error('Operation aborted'))
    })
  })
}

/**
 * Выполнение функции с повторными попытками
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      if (attempt === maxRetries) {
        break
      }
      
      const delay = baseDelay * Math.pow(2, attempt)
      await waitWithTimeout(delay)
    }
  }
  
  throw lastError!
}

/**
 * Батчинг операций для улучшения производительности
 */
export class BatchProcessor<T, R> {
  private batch: T[] = []
  private processing = false
  private processor: (items: T[]) => Promise<R[]>
  private batchSize: number
  private batchTimeout: number
  
  constructor(
    processor: (items: T[]) => Promise<R[]>,
    batchSize: number = 10,
    batchTimeout: number = 100
  ) {
    this.processor = processor
    this.batchSize = batchSize
    this.batchTimeout = batchTimeout
  }
  
  async add(item: T): Promise<R> {
    this.batch.push(item)
    
    if (this.batch.length >= this.batchSize) {
      return this.processBatch()
    }
    
    if (!this.processing) {
      this.scheduleProcessing()
    }
    
    // Возвращаем промис, который разрешится при обработке батча
    return new Promise((resolve, reject) => {
      const index = this.batch.length - 1
      this.batch[index] = { item, resolve, reject } as any
    })
  }
  
  private scheduleProcessing(): void {
    setTimeout(() => {
      if (this.batch.length > 0) {
        this.processBatch()
      }
    }, this.batchTimeout)
  }
  
  private async processBatch(): Promise<R[]> {
    if (this.processing || this.batch.length === 0) {
      return []
    }
    
    this.processing = true
    const currentBatch = [...this.batch]
    this.batch = []
    
    try {
      const results = await this.processor(currentBatch.map(b => 'item' in b ? b.item : b))
      
      // Разрешаем промисы для элементов в батче
      currentBatch.forEach((batchItem, index) => {
        if ('resolve' in batchItem) {
          batchItem.resolve(results[index])
        }
      })
      
      return results
    } catch (error) {
      // Отклоняем промисы при ошибке
      currentBatch.forEach(batchItem => {
        if ('reject' in batchItem) {
          batchItem.reject(error)
        }
      })
      throw error
    } finally {
      this.processing = false
      
      if (this.batch.length > 0) {
        this.scheduleProcessing()
      }
    }
  }
}

export function isPromise<T>(value: PromiseLike<T> | unknown): value is PromiseLike<T> {
  return !!value && typeof (value as PromiseLike<T>).then === 'function'
}

/**
 * Calls a maybe asynchronous function without creating microtasks when the function is synchronous.
 * Catches errors in both cases.
 *
 * If just you run a code like this:
 * ```
 * console.time('Action duration')
 * await action()
 * console.timeEnd('Action duration')
 * ```
 * The synchronous function time can be measured incorrectly because another microtask may run before the `await`
 * returns the control back to the code.
 */
export function awaitIfAsync<TResult, TError = unknown>(
  action: () => MaybePromise<TResult>,
  callback: (...args: [success: true, result: TResult] | [success: false, error: TError]) => unknown,
): void {
  try {
    const returnedValue = action()
    if (isPromise(returnedValue)) {
      returnedValue.then(
        (result) => callback(true, result),
        (error: TError) => callback(false, error),
      )
    } else {
      callback(true, returnedValue)
    }
  } catch (error) {
    callback(false, error as TError)
  }
}

/**
 * If you run many synchronous tasks without using this function, the JS main loop will be busy and asynchronous tasks
 * (e.g. completing a network request, rendering the page) won't be able to happen.
 * This function allows running many synchronous tasks such way that asynchronous tasks can run too in background.
 */
export async function mapWithBreaks<T, U>(
  items: readonly T[],
  callback: (item: T, index: number) => U,
  loopReleaseInterval = 16,
): Promise<U[]> {
  const results = Array<U>(items.length)
  let lastLoopReleaseTime = Date.now()

  for (let i = 0; i < items.length; ++i) {
    results[i] = callback(items[i], i)

    const now = Date.now()
    if (now >= lastLoopReleaseTime + loopReleaseInterval) {
      lastLoopReleaseTime = now
      await releaseEventLoop()
    }
  }

  return results
}

/**
 * Makes the given promise never emit an unhandled promise rejection console warning.
 * The promise will still pass errors to the next promises.
 * Returns the input promise for convenience.
 *
 * Otherwise, promise emits a console warning unless it has a `catch` listener.
 */
export function suppressUnhandledRejectionWarning<T extends PromiseLike<unknown>>(promise: T): T {
  promise.then(undefined, () => undefined)
  return promise
}
