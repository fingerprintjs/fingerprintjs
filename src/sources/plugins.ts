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
  if (!navigator.plugins) {
    return undefined
  }

  const plugins: PluginData[] = []

  for (const plugin of navigator.plugins) {
    if (!plugin) {
      continue
    }

    const mimeTypes: PluginMimeTypeData[] = []
    for (const mimeType of plugin) {
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
