// Writes app/css/fade.svg: a stepped, jittered grid fade, one SVG unit per grid square.
// The mask size and offset in app/css/blueprint.css follow width and height: width by height squares, shifted up by height / 2.

const reach = { x: 14, y: 7 }
const core = 0.3
const squareness = 3
const width = 2 * Math.ceil(reach.x * 1.3) + 1
const height = 2 * Math.ceil(reach.y * 1.3)

let seed = 28
const random = () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), seed | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 2 ** 32
}

const level = (x, y) => {
  const distance = (Math.abs((x + 0.5 - width / 2) / reach.x) ** squareness + Math.abs((y + 0.5 - height / 2) / reach.y) ** squareness) ** (1 / squareness)
  return Math.min(5, Math.max(0, Math.round((1 - distance) / (1 - core) * 5 + (random() - 0.5) * 2.4)))
}

const rows = Array.from({ length: height }, (_, y) => Array.from({ length: width }, (_, x) => level(x, y)))

const rects = rows.flatMap((row, y) => row.reduce((runs, step, x) => {
  const run = runs.at(-1)
  run?.step === step && run.x + run.width === x ? run.width++ : runs.push({ x, width: 1, step })
  return runs
}, []).filter(run => run.step).map(({ x, width, step }) =>
  `<rect x="${x}" y="${y}" width="${width}" height="1"${step < 5 ? ` fill-opacity="${step / 5}"` : ''}/>`))

await Bun.write(new URL('../app/css/fade.svg', import.meta.url), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" shape-rendering="crispEdges">${rects.join('')}</svg>\n`)
console.info(`fade.svg: ${width} by ${height} squares`)
