import 'promise-polyfill/src/polyfill'
import * as FingerprintJS from '../src'
import { errorToObject } from '../src/utils/misc'

async function getVisitorData() {
  const fp = await FingerprintJS.load()
  return await fp.get({ debug: true })
}

async function startPlayground() {
  const output = document.querySelector('.output')
  if (!output) {
    throw new Error("The output element isn't found in the HTML code")
  }

  const startTime = Date.now()

  try {
    const { visitorId, components } = await getVisitorData()
    const totalTime = Date.now() - startTime
    output.innerHTML = ''
    addOutputSection(output, 'Visitor identifier:', visitorId, 'giant')
    addOutputSection(output, 'Time took to get the identifier:', `${totalTime}ms`, 'big')
    addOutputSection(output, 'User agent:', navigator.userAgent)
    addOutputSection(output, 'Entropy components:', FingerprintJS.componentsToDebugString(components))

    initializeDebugButtons(`Visitor identifier: \`${visitorId}\`
User agent: \`${navigator.userAgent}\`
Entropy components:
\`\`\`
${FingerprintJS.componentsToDebugString(components)}
\`\`\``)
  } catch (error) {
    const totalTime = Date.now() - startTime
    const errorData = errorToObject(error)
    output.innerHTML = ''
    addOutputSection(output, 'Unexpected error:', JSON.stringify(errorData, null, 2))
    addOutputSection(output, 'Time passed before the error:', `${totalTime}ms`, 'big')
    addOutputSection(output, 'User agent:', navigator.userAgent)

    initializeDebugButtons(`Unexpected error:\n
\`\`\`
${JSON.stringify(errorData, null, 2)}
\`\`\`
Time passed before the error: ${totalTime}ms
User agent: \`${navigator.userAgent}\``)
    throw error
  }
}

function addOutputSection(output: Node, header: string, content: string, size?: 'big' | 'giant') {
  const headerElement = document.createElement('div')
  headerElement.classList.add('heading')
  headerElement.textContent = header
  output.appendChild(headerElement)

  const contentElement = document.createElement('pre')
  if (size) {
    contentElement.classList.add(size)
  }
  contentElement.textContent = content
  output.appendChild(contentElement)
}

function initializeDebugButtons(debugText: string) {
  const copyButton = document.querySelector('#debugCopy')
  if (copyButton instanceof HTMLButtonElement) {
    copyButton.disabled = false
    copyButton.addEventListener('click', (event) => {
      event.preventDefault()
      copy(debugText)
    })
  }

  const shareButton = document.querySelector('#debugShare')
  if (shareButton instanceof HTMLButtonElement) {
    shareButton.disabled = false
    shareButton.addEventListener('click', (event) => {
      event.preventDefault()
      share(debugText)
    })
  }
}

function copy(text: string) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  try {
    document.execCommand('copy')
  } catch {
    // Do nothing in case of a copying error
  }
  document.body.removeChild(textarea)
}

async function share(text: string) {
  if (!navigator.share) {
    alert(`Sharing is unavailable.

Sharing is available in mobile browsers and only on HTTPS websites. ${
      location.protocol === 'https:'
        ? 'Use a mobile device or the Copy button instead.'
        : `Open https://${location.host}${location.pathname}${location.search} instead.`
    }`)
    return
  }
  try {
    await navigator.share({ text })
  } catch {
    // Do nothing in case of a share abort
  }
}

startPlayground()
