export default function getProductSub(): string | undefined {
  return navigator.productSub as string | undefined // It's undefined in IE
}
