export default function getOsCpu(): string | undefined {
  return navigator.oscpu
}

export function osCpuSource(): () => string | undefined {
  const osCpu = getOsCpu()
  return () => osCpu
}
