import * as FPJS from '../src'

async function getVisitorId() {
  const fp = await FPJS.load()
  const result = await fp.get({ debug: true })
  return result.visitorId
}

(async () => {
  const display = document.querySelector('.visitorId')!
  try {
    const visitorId = await getVisitorId()
    display.textContent = visitorId
    display.classList.remove('loading')
  } catch (error) {
    display.textContent = 'Unexpected error'
    throw error
  }
})()
