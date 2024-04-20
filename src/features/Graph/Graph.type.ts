export interface Node {
  id: string
  x: number
  y: number
}

export interface Edge {
  source: { id: string; x: number; y: number }
  target: { id: string; x: number; y: number }
}

export interface GenerateRandomGraphDataArgs {
  numNodes: number
  numEdges: number
  width: number
  height: number
}

export interface DrawGraphArgs {
  nodes: Node[]
  edges: Edge[]
  zoom: number
}
