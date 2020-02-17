// minstd_rand
export const random = s => {
  const rnd = () => ((2 ** 31 - 1) & (s = Math.imul(48271, s))) / 2 ** 31
  rnd() // first call is always junk
  return (min, max) => Math.floor(rnd() * (max - min + 1)) + min
}
