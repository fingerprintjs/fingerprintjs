export default function isAdblockUsed(): boolean {
  const d = document

  if (!d.body?.appendChild) {
    return false
  }

  const ads = d.createElement('div')
  ads.innerHTML = '&nbsp;'
  ads.className = 'adsbox'

  try {
    d.body.appendChild(ads)
    const node = d.querySelector('.adsbox') as HTMLElement | null
    return !node || node.offsetHeight === 0
  } finally {
    ads.parentNode?.removeChild(ads)
  }
}
