import FingerprintJS from '../src'

async function getVisitorId() {
  const fp = await FingerprintJS.load()
  const result = await fp.get({ debug: true })
  return result.visitorId
}

async function startPlayground() {
  const display = document.querySelector('.visitorId')
  if (!display) {
    throw new Error("The display element isn't found in the HTML code")
  }
  try {
    const visitorId = await getVisitorId()
    display.textContent = visitorId
    display.classList.remove('loading')
  } catch (error) {
    display.textContent = 'Unexpected error'
    throw error
  }
}

startPlayground()
