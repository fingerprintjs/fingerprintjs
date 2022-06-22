import isMetaMaskInstalled from './metamask'

export const extensions = Object.freeze({
  MetaMask: isMetaMaskInstalled(),
})

export default function getExtensions(): typeof extensions {
  return extensions
}
