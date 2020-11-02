import { isTrident } from '../utils/browser'

export interface PluginMimeTypeData {
  type: string
  suffixes: string
}

export interface PluginData {
  name: string
  description: string
  mimeTypes: PluginMimeTypeData[]
}

export default function getPlugins(): PluginData[] | undefined {
  if (isTrident()) {
    return []
  }
  if (!navigator.plugins) {
    return undefined
  }

  const plugins: PluginData[] = []

  // Safari 10 doesn't support iterating navigator.plugins with for...of
  for (let i = 0; i < navigator.plugins.length; ++i) {
    const plugin = navigator.plugins[i]
    if (!plugin) {
      continue
    }

    const mimeTypes: PluginMimeTypeData[] = []
    for (let j = 0; j < plugin.length; ++j) {
      const mimeType = plugin[j]
      mimeTypes.push({
        type: mimeType.type,
        suffixes: mimeType.suffixes,
      })
    }

    plugins.push({
      name: plugin.name,
      description: plugin.description,
      mimeTypes,
    })
  }

  return plugins
}
