import { isBrave } from '../utils/browser'

/**
 * Detects if the {@link https://metamask.io/ MetaMask} extension is installed
 */
export default function isMetaMaskInstalled(): boolean {
  return !!(typeof window.ethereum !== 'undefined' && !isBrave())
}
