"use client"

import { useEffect, useRef } from "react"

interface Edge {
  from: string
  to: string
}

interface ParsedFile {
  name: string
  ast: any
  error: string | null
}

interface DependencyGraphProps {
  edges: Edge[]
  nodes: ParsedFile[]
  extModules: string[]
}

export function DependencyGraph({ edges, nodes, extModules }: DependencyGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !edges.length) return

    // Clear previous content
    const svg = svgRef.current
    svg.innerHTML = ""

    // Simple static visualization since D3 is complex to integrate
    const width = svg.clientWidth || 400
    const height = 420

    // Create a simple node-link diagram
    const allNodes = new Set<string>()
    edges.forEach((edge) => {
      allNodes.add(edge.from)
      allNodes.add(edge.to)
    })

    const nodeArray = Array.from(allNodes)
    const projectFiles = new Set(
      nodes.map((n) =>
        n.name
          .replace(/\.(m?js|cjs|jsx|ts|tsx)$/i, "")
          .replace(/^\.\//, "")
          .replace(/\\/g, "/"),
      ),
    )

    // Simple circular layout
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 3

    const nodePositions = new Map<string, { x: number; y: number }>()
    nodeArray.forEach((node, i) => {
      const angle = (i / nodeArray.length) * 2 * Math.PI
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius
      nodePositions.set(node, { x, y })
    })

    // Draw edges
    edges.forEach((edge) => {
      const fromPos = nodePositions.get(edge.from)
      const toPos = nodePositions.get(edge.to)
      if (fromPos && toPos) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
        line.setAttribute("x1", fromPos.x.toString())
        line.setAttribute("y1", fromPos.y.toString())
        line.setAttribute("x2", toPos.x.toString())
        line.setAttribute("y2", toPos.y.toString())
        line.setAttribute("stroke", "#3653a3")
        line.setAttribute("stroke-width", "1.2")
        line.setAttribute("stroke-opacity", "0.7")
        svg.appendChild(line)
      }
    })

    // Draw nodes
    nodeArray.forEach((node) => {
      const pos = nodePositions.get(node)
      if (!pos) return

      const isExternal = !projectFiles.has(
        node
          .replace(/\.(m?js|cjs|jsx|ts|tsx)$/i, "")
          .replace(/^\.\//, "")
          .replace(/\\/g, "/"),
      )

      // Node background
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect")
      rect.setAttribute("x", (pos.x - 45).toString())
      rect.setAttribute("y", (pos.y - 14).toString())
      rect.setAttribute("width", "90")
      rect.setAttribute("height", "28")
      rect.setAttribute("rx", "6")
      rect.setAttribute("ry", "6")
      rect.setAttribute("fill", isExternal ? "#134d3a" : "#1a2c6a")
      rect.setAttribute("stroke", isExternal ? "#2b8c6b" : "#2b3c7b")
      svg.appendChild(rect)

      // Node text
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text")
      text.setAttribute("x", pos.x.toString())
      text.setAttribute("y", pos.y.toString())
      text.setAttribute("text-anchor", "middle")
      text.setAttribute("dy", "0.35em")
      text.setAttribute("font-size", "11")
      text.setAttribute("fill", "#dbe6ff")
      text.textContent = node.length > 18 ? node.slice(0, 17) + "…" : node
      svg.appendChild(text)
    })
  }, [edges, nodes, extModules])

  return <svg ref={svgRef} width="100%" height="420" className="border border-slate-700 rounded bg-slate-950" />
}
