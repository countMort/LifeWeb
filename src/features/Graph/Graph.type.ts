export interface Node {
  id: string
  x: number
  y: number
}

export interface Edge {
  source: { id: string; x: number; y: number }
  target: { id: string; x: number; y: number }
}
