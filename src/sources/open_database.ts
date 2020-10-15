export default function getOpenDatabase(): boolean {
  return !!window.openDatabase
}
