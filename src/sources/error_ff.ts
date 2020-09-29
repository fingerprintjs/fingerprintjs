export default function getErrorFF(): boolean {
  try {
    throw 'a'
  } catch (e) {
    try {
      e.toSource()
      return true
    } catch (e2) {
      return false
    }
  }
}
