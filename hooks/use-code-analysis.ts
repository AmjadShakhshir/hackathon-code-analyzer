"use client"

import { useState } from "react"

interface FileData {
  id: string
  name: string
  code: string
}

interface ParsedFile {
  name: string
  code: string
  ast: any
  error: string | null
}

interface FunctionInfo {
  file: string
  name: string
  loc: number
  params: number
  cc: number
  nesting: number
  notes: string[]
}

interface Edge {
  from: string
  to: string
}

interface AnalysisStats {
  files: number
  totalFuncs: number
  maxCC: number
  avgCC: number
  score: number
}

interface AnalysisResult {
  parsed: ParsedFile[]
  functions: FunctionInfo[]
  edges: Edge[]
  extModules: string[]
  stats: AnalysisStats
  errors: string[]
}

export function useCodeAnalysis() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeFiles = async (files: FileData[]) => {
    setIsAnalyzing(true)

    try {
      // Import esprima dynamically
      const esprima = await import("esprima")

      const parsed = files.map((file) => parseFile(file, esprima))
      const errors = parsed.filter((f) => f.error).map((f) => `❌ ${f.name}: ${f.error}`)
      const moduleIndex = new Map(parsed.map((f) => [norm(f.name), f]))

      const functions: FunctionInfo[] = []
      const edges: Edge[] = []
      const extModules = new Set<string>()

      for (const f of parsed) {
        if (!f.ast) continue

        // Extract functions
        walk(f.ast, (n: any, p: any) => {
          if (
            n.type === "FunctionDeclaration" ||
            n.type === "FunctionExpression" ||
            n.type === "ArrowFunctionExpression"
          ) {
            const name = functionName(n, p)
            const loc = linesOf(n)
            const params = (n.params || []).length
            const cc = computeCC(n)
            const nesting = computeMaxNesting(n)
            const notes: string[] = []
            if (cc >= 10) notes.push("High CC")
            else if (cc >= 5) notes.push("Medium CC")
            if (loc >= 60) notes.push("Long")
            if (nesting >= 4) notes.push("Deep Nesting")
            functions.push({ file: f.name, name, loc, params, cc, nesting, notes })
          }
        })

        // Extract dependencies
        const deps = extractDependencies(f.ast)
        const from = norm(f.name)
        for (const raw of deps) {
          if (!raw) continue
          const cleaned = norm(raw)
          const isLocal = cleaned.startsWith(".") || cleaned.includes("/")
          if (isLocal) {
            const target =
              moduleIndex.get(cleaned) ||
              moduleIndex.get(norm(cleaned + ".js")) ||
              moduleIndex.get(norm(cleaned + "/index.js"))
            if (target) edges.push({ from, to: norm(target.name) })
            else {
              edges.push({ from, to: cleaned })
              extModules.add(cleaned)
            }
          } else {
            edges.push({ from, to: cleaned })
            extModules.add(cleaned)
          }
        }
      }

      // Calculate stats
      const totalFuncs = functions.length
      const maxCC = totalFuncs ? Math.max(...functions.map((f) => f.cc)) : 0
      const avgCC = totalFuncs ? functions.reduce((a, b) => a + b.cc, 0) / totalFuncs : 0
      const longPct = totalFuncs ? (functions.filter((f) => f.loc > 40).length / totalFuncs) * 100 : 0
      const score = Math.max(0, Math.round(100 - avgCC * 6 - longPct * 0.4 - errors.length * 8))

      // Sort functions by complexity
      functions.sort((a, b) => b.cc - a.cc || b.loc - a.loc)

      setAnalysis({
        parsed,
        functions,
        edges,
        extModules: Array.from(extModules),
        stats: { files: parsed.length, totalFuncs, maxCC, avgCC, score },
        errors,
      })
    } catch (error) {
      console.error("Analysis failed:", error)
      setAnalysis({
        parsed: [],
        functions: [],
        edges: [],
        extModules: [],
        stats: { files: 0, totalFuncs: 0, maxCC: 0, avgCC: 0, score: 0 },
        errors: ["Analysis failed: " + String(error)],
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return { analysis, analyzeFiles, isAnalyzing }
}

// Helper functions (simplified versions of the original)
function parseFile(file: FileData, esprima: any): ParsedFile {
  try {
    const ast = esprima.parseModule(file.code, { range: true, loc: true, tolerant: true, comment: true })
    return { ...file, ast, error: null }
  } catch (e: any) {
    return { ...file, ast: null, error: String(e?.message || e) }
  }
}

function norm(p: string): string {
  return p
    .replace(/\.(m?js|cjs|jsx|ts|tsx)$/i, "")
    .replace(/^\.\//, "")
    .replace(/\\/g, "/")
}

function walk(node: any, enter: (node: any, parent: any) => void, parent: any = null) {
  if (!node || typeof node !== "object") return
  enter && enter(node, parent)
  for (const key in node) {
    if (!node.hasOwnProperty(key)) continue
    const val = node[key]
    if (val && typeof val === "object") {
      if (Array.isArray(val)) for (const c of val) walk(c, enter, node)
      else walk(val, enter, node)
    }
  }
}

function functionName(node: any, parent: any): string {
  if (node.type === "FunctionDeclaration" && node.id) return node.id.name
  if (node.type === "FunctionExpression" || node.type === "ArrowFunctionExpression") {
    if (parent && parent.type === "VariableDeclarator" && parent.id && parent.id.name) return parent.id.name
    if (parent && parent.type === "Property" && parent.key) return parent.key.name || (parent.key.value ?? "anonymous")
  }
  return "(anonymous)"
}

function linesOf(node: any): number {
  if (!node.loc) return 0
  return node.loc.end.line - node.loc.start.line + 1
}

const DECISION_NODES = new Set([
  "IfStatement",
  "ForStatement",
  "ForInStatement",
  "ForOfStatement",
  "WhileStatement",
  "DoWhileStatement",
  "SwitchCase",
  "CatchClause",
  "ConditionalExpression",
])

function computeCC(fnNode: any): number {
  let cc = 1 // baseline
  walk(
    fnNode.body || fnNode,
    (n: any) => {
      if (DECISION_NODES.has(n.type)) {
        if (n.type === "SwitchCase" && n.test === null) return // default doesn't add
        cc += 1
      }
      if (n.type === "LogicalExpression" && (n.operator === "&&" || n.operator === "||")) cc += 1
    },
    fnNode,
  )
  return cc
}

function computeMaxNesting(fnNode: any): number {
  let depth = 0,
    maxDepth = 0
  const incIf = new Set([
    "IfStatement",
    "ForStatement",
    "ForInStatement",
    "ForOfStatement",
    "WhileStatement",
    "DoWhileStatement",
    "SwitchStatement",
    "TryStatement",
  ])
  walk(
    fnNode.body || fnNode,
    (n: any) => {
      if (incIf.has(n.type)) {
        depth++
        maxDepth = Math.max(maxDepth, depth)
      }
    },
    fnNode,
  )
  return maxDepth
}

function extractDependencies(ast: any): string[] {
  const deps: string[] = []
  walk(ast, (n: any) => {
    if (n.type === "ImportDeclaration" && n.source && n.source.value) deps.push(n.source.value)
    if (
      n.type === "CallExpression" &&
      n.callee &&
      n.callee.name === "require" &&
      n.arguments &&
      n.arguments[0] &&
      n.arguments[0].value
    ) {
      deps.push(n.arguments[0].value)
    }
  })
  return deps
}
