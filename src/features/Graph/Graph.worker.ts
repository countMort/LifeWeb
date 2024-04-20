import { DrawGraphArgs, GenerateRandomGraphDataArgs } from "./Graph.type"

export default () => {
  let canvas: HTMLCanvasElement

  const generateRandomGraphData = ({
    numNodes,
    numEdges,
    width,
    height,
  }: GenerateRandomGraphDataArgs) => {
    // Generate random node data (replace with your desired node properties)
    const nodes = Array.from({ length: numNodes }, () => ({
      id: Math.random().toString(36).substring(2, 15),
      x: Math.random() * width,
      y: Math.random() * height,
    }))

    // Generate random edge data (replace with your desired edge properties)
    const edges = Array.from({ length: numEdges }, () => ({
      source: nodes[Math.floor(Math.random() * numNodes)],
      target: nodes[Math.floor(Math.random() * numNodes)],
    }))

    return { nodes, edges } // Return the generated graph data
  }

  const drawGraph = ({ nodes, edges, zoom }: DrawGraphArgs) => {
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = "blue"
    nodes.forEach((node) => {
      ctx.beginPath()
      ctx.arc(node.x * zoom, node.y * zoom, 3, 0, 2 * Math.PI)
      ctx.fill()
    })

    ctx.strokeStyle = "gray"
    edges.forEach((edge) => {
      ctx.beginPath()
      ctx.moveTo(edge.source.x * zoom, edge.source.y * zoom)
      ctx.lineTo(edge.target.x * zoom, edge.target.y * zoom)
      ctx.lineWidth = 0.5
      ctx.stroke()
    })
  }

  self.addEventListener("message", (event) => {
    const { action } = event.data
    if (action === "saveCanvas") {
      canvas = event.data.payload.canvas
    } else if (action === "generateData") {
      const numNodes =
        event.data.payload?.numNodes ||
        Math.floor(Math.random() * (100000 - 50000 + 1)) + 50000
      const numEdges =
        event.data.payload?.numEdges ||
        Math.floor(Math.random() * (300000 - 100000 + 1)) + 100000

      self.postMessage({
        action: "graphStats",
        payload: {
          nodes: numNodes,
          edges: numEdges,
        },
      })

      const { width, height } = event.data.payload

      const graphData = generateRandomGraphData({
        numNodes,
        numEdges,
        width,
        height,
      })
      self.postMessage({ action: "generateData", payload: graphData })
    } else if (action === "drawGraph") {
      const { nodes, edges, zoom } = event.data.payload
      drawGraph({ nodes, edges, zoom })
      self.postMessage({ action: "drawGraph" })
    }
  })
}
