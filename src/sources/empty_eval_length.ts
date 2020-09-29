export default function getEmptyEvalLength(): number {
  // todo: Check that `eval` doesn't prevent Terser from replacing identifiers
  return eval.toString().length
}
