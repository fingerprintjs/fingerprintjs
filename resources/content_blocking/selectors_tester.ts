import { getBlockedSelectors } from '../../src/sources/dom_blockers'

const display = document.createElement('textarea')
display.readOnly = true
display.style.boxSizing = 'border-box'
display.style.width = '100%'
display.style.height = '75vh'
display.value = 'Please wait...'

const copyButton = document.createElement('button')
copyButton.textContent = 'Copy'
copyButton.addEventListener('click', (event) => {
  event.preventDefault()
  display.focus()
  display.select()
  document.execCommand('copy')
})

const downloadButton = document.createElement('button')
downloadButton.textContent = 'Save to file'
downloadButton.addEventListener('click', (event) => {
  event.preventDefault()
  const downloader = document.createElement('a')
  downloader.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(display.value)}`)
  downloader.setAttribute('download', '')
  downloader.style.display = 'none'
  document.body.appendChild(downloader)
  downloader.click()
  document.body.removeChild(downloader)
})

document.body.append(display, copyButton, document.createTextNode(' '), downloadButton)

// Wait a bit to draw the initial UI
setTimeout(async () => {
  try {
    const selectors: string[] = [
      /* selectors */
    ]
    const blockedSelectors = await getBlockedSelectors(selectors)

    display.value = ''
    for (const selector of Object.keys(blockedSelectors)) {
      if (blockedSelectors[selector]) {
        display.value += `${selector}\n`
      }
    }
  } catch (error) {
    display.value = `${error}${error instanceof Error ? `\n${error.stack}` : ''}`
  }
}, 10)
