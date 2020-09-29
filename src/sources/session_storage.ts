export default function getSessionStorage(): boolean {
  try {
    return !!window.sessionStorage
  } catch (error) {
    /* SecurityError when referencing it means it exists */
    return true
  }
}
