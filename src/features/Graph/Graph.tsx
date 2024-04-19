import { useCallback, useEffect, useRef, useState } from "react"
import { Edge, Node } from "./Graph.type"

const GraphCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [zoom, setZoom] = useState(1) // Initial zoom level

  const generateGraph = () => {
    // Generate random nodes and edges within specified ranges
    const numNodes = Math.floor(Math.random() * (1000000 - 500000 + 1)) + 500000
    const numEdges =
      Math.floor(Math.random() * (3000000 - 1000000 + 1)) + 1000000

    // Generate random node data (replace with your desired node properties)
    const newNodes = Array.from({ length: numNodes }, () => ({
      id: Math.random().toString(36).substring(2, 15),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    }))

    // Generate random edge data (replace with your desired edge properties)
    const newEdges = Array.from({ length: numEdges }, () => ({
      source: newNodes[Math.floor(Math.random() * numNodes)],
      target: newNodes[Math.floor(Math.random() * numNodes)],
    }))

    setNodes(newNodes)
    setEdges(newEdges)
  }

  const zoomIn = () => {
    setZoom(zoom * 1.2) // Adjust zoom factor as needed
  }

  const zoomOut = () => {
    setZoom(zoom / 1.2) // Adjust zoom factor as needed
  }

  const drawGraph = useCallback(() => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Draw nodes (replace with basic shapes)
    ctx.fillStyle = "blue"
    nodes.forEach((node) => {
      ctx.beginPath()
      ctx.arc(node.x * zoom, node.y * zoom, 5, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Draw edges (replace with basic lines)
    ctx.strokeStyle = "gray"
    edges.forEach((edge) => {
      ctx.beginPath()
      ctx.moveTo(edge.source.x * zoom, edge.source.y * zoom)
      ctx.lineTo(edge.target.x * zoom, edge.target.y * zoom)
      ctx.stroke()
    })
  }, [canvasRef, nodes, edges, zoom])

  useEffect(() => {
    drawGraph()
  }, [drawGraph])

  return (
    <div>
      <button onClick={generateGraph}>Generate Graph</button>
      <button onClick={zoomIn}>Zoom In</button>
      <button onClick={zoomOut}>Zoom Out</button>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  )
}

export default GraphCanvas
