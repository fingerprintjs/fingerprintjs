export default function getCpuClass(): string | undefined {
  isSourceLoaded.x = true
  return navigator.cpuClass
}

/**
 * A little dirty hack to check whether an entropy source is loaded in the tests.
 * The value is exported only for tests.
 */
export const isSourceLoaded = {
  x: false,
}
