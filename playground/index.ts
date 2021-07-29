import 'promise-polyfill/src/polyfill'
import * as FingerprintJS from '../src'
import { errorToObject } from '../src/utils/misc'

type Text = string | { html: string }

async function getVisitorData() {
  const fp = await FingerprintJS.load({ debug: true })
  return await fp.get()
}

async function startPlayground() {
  const output = document.querySelector('.output')
  if (!output) {
    throw new Error("The output element isn't found in the HTML code")
  }

  const startTime = Date.now()

  try {
    const { visitorId, confidence, components } = await getVisitorData()
    const totalTime = Date.now() - startTime
    output.innerHTML = ''
    addOutputSection({ output, header: 'Visitor identifier:', content: visitorId, size: 'giant' })
    addOutputSection({ output, header: 'Time took to get the identifier:', content: `${totalTime}ms`, size: 'big' })
    addOutputSection({
      output,
      header: 'Confidence score:',
      content: String(confidence.score),
      comment: confidence.comment && {
        html: confidence.comment.replace(
          /(upgrade\s+to\s+)?pro(\s+version)?(:\s+(https?:\/\/\S+))?/gi,
          '<a href="$4" target="_blank">$&</a>',
        ),
      },
      size: 'big',
    })
    addOutputSection({ output, header: 'User agent:', content: navigator.userAgent })
    addOutputSection({
      output,
      header: 'Entropy components:',
      content: FingerprintJS.componentsToDebugString(components),
    })

    initializeDebugButtons(`Visitor identifier: \`${visitorId}\`
Time took to get the identifier: ${totalTime}ms
Confidence: ${JSON.stringify(confidence)}
User agent: \`${navigator.userAgent}\`
Entropy components:
\`\`\`
${FingerprintJS.componentsToDebugString(components)}
\`\`\``)
  } catch (error) {
    const totalTime = Date.now() - startTime
    const errorData = errorToObject(error)
    output.innerHTML = ''
    addOutputSection({ output, header: 'Unexpected error:', content: JSON.stringify(errorData, null, 2) })
    addOutputSection({ output, header: 'Time passed before the error:', content: `${totalTime}ms`, size: 'big' })
    addOutputSection({ output, header: 'User agent:', content: navigator.userAgent })

    initializeDebugButtons(`Unexpected error:\n
\`\`\`
${JSON.stringify(errorData, null, 2)}
\`\`\`
Time passed before the error: ${totalTime}ms
User agent: \`${navigator.userAgent}\``)
    throw error
  }
}

function addOutputSection({
  output,
  header,
  content,
  comment,
  size,
}: {
  output: Node
  header: Text
  content: Text
  comment?: Text
  size?: 'big' | 'giant'
}) {
  const headerElement = document.createElement('div')
  headerElement.appendChild(textToDOM(header))
  headerElement.classList.add('heading')
  output.appendChild(headerElement)

  const contentElement = document.createElement('pre')
  contentElement.appendChild(textToDOM(content))
  if (size) {
    contentElement.classList.add(size)
  }
  output.appendChild(contentElement)

  if (comment) {
    const commentElement = document.createElement('div')
    commentElement.appendChild(textToDOM(comment))
    commentElement.classList.add('comment')
    output.appendChild(commentElement)
  }
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

function textToDOM(text: Text): Node {
  if (typeof text === 'string') {
    return document.createTextNode(text)
  }
  const container = document.createElement('div')
  container.innerHTML = text.html
  const fragment = document.createDocumentFragment()
  while (container.firstChild) {
    fragment.appendChild(container.firstChild)
  }
  return fragment
}

startPlayground()
