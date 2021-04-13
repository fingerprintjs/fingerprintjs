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

document.body.appendChild(display)
document.body.appendChild(copyButton)

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
    display.value = `${error}\n${error.stack}`
  }
}, 10)
