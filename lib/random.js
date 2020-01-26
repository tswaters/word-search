// minstd_rand
export const random = s => {
  const rnd = () => ((2 ** 31 - 1) & (s = Math.imul(48271, s))) / 2 ** 31
  return (min, max) => Math.floor(rnd() * (max - min)) + min
}
