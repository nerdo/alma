export function next (sequence) {
  const { value } = sequence.next()
  return value
}
