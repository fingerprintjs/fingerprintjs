type PluginMimeTypeData = {
  type: string
  suffixes: string
}

type PluginData = {
  name: string
  description: string
  mimeTypes: PluginMimeTypeData[]
}

export default function getPlugins(): PluginData[] | undefined {
  const rawPlugins = navigator.plugins

  if (!rawPlugins) {
    return undefined
  }

  const plugins: PluginData[] = []

  // Safari 10 doesn't support iterating navigator.plugins with for...of
  for (let i = 0; i < rawPlugins.length; ++i) {
    const plugin = rawPlugins[i]
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
