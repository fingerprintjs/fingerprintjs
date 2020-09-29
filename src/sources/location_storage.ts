// https://bugzilla.mozilla.org/show_bug.cgi?id=781447
export default function getLocalStorage(): boolean {
  try {
    return !!window.localStorage
  } catch (e) {
    /* SecurityError when referencing it means it exists */
    return true
  }
}
