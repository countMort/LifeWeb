import { useCallback, useEffect, useRef, useState } from "react"
import { Edge, Node } from "./Graph.type"
import { WebWorker } from "./Graph.utils"
import GraphWorker from "./Graph.worker"

import "./Graph.css"
import { canvasHeight, canvasWidth } from "./Graph.params"

const GraphCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [zoom, setZoom] = useState(1) // Initial zoom level
  const [worker, setWorker] = useState<Worker>()
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [graphStats, setGraphStats] = useState({ nodes: 0, edges: 0 })
  const isLoading = isDrawing || isGenerating

  useEffect(() => {
    const newWorker = new WebWorker(GraphWorker)
    newWorker.addEventListener("message", (event) => {
      if (event.data.action === "generateData") {
        setIsGenerating(false)
        const { nodes, edges } = event.data.payload
        setNodes(nodes)
        setEdges(edges)
      } else if (event.data.action === "graphStats") {
        setGraphStats(event.data.payload)
      } else if (event.data.action === "drawGraph") {
        setIsDrawing(false)
      }
    })
    setWorker(newWorker)
    return () => {
      newWorker?.terminate()
    }
  }, [])

  useEffect(() => {
    if (canvasRef.current && worker) {
      const offScreen = canvasRef.current.transferControlToOffscreen()
      worker.postMessage(
        {
          action: "saveCanvas",
          payload: {
            canvas: offScreen,
          },
        },
        [offScreen]
      )
    }
  }, [canvasRef, worker])

  const generateGraph = () => {
    setIsGenerating(true)
    worker?.postMessage({
      action: "generateData",
      payload: { width: canvasWidth(), height: canvasHeight() },
    })
  }

  const zoomIn = () => {
    setZoom(zoom * 1.2) // Adjust zoom factor as needed
  }

  const zoomOut = () => {
    setZoom(zoom / 1.2) // Adjust zoom factor as needed
  }

  const drawGraph = useCallback(() => {
    setIsDrawing(true)
    worker?.postMessage({
      action: "drawGraph",
      payload: { nodes, edges, zoom },
    })
  }, [nodes, edges, zoom, worker])

  useEffect(() => {
    drawGraph()
  }, [drawGraph])

  return (
    <div>
      <div className="button-container">
        <button onClick={generateGraph} disabled={isLoading}>
          Generate Graph
        </button>
        <button onClick={zoomIn} disabled={isLoading}>
          Zoom In
        </button>
        <button onClick={zoomOut} disabled={isLoading}>
          Zoom Out
        </button>
      </div>
      <div className="stats-container">
        {isDrawing ? "Drawing..." : ""}{" "}
        {isGenerating
          ? `Generating ${graphStats.nodes} Nodes & ${graphStats.edges} Edges`
          : ""}
      </div>
      <canvas ref={canvasRef} width={canvasWidth()} height={canvasHeight()} />
    </div>
  )
}

export default GraphCanvas
