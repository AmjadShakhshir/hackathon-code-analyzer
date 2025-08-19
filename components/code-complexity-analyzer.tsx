"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Plus } from "lucide-react"
import { DependencyGraph } from "./dependency-graph"
import { MetricsChart } from "./metrics-chart"
import { useCodeAnalysis } from "@/hooks/use-code-analysis"

interface FileData {
  id: string
  name: string
  code: string
}

export function CodeComplexityAnalyzer() {
  const [files, setFiles] = useState<FileData[]>([])
  const { analysis, analyzeFiles, isAnalyzing } = useCodeAnalysis()

  // Initialize with example files
  useEffect(() => {
    const exampleMain = `import { add, max } from './utils.js';

export function score(items) {
  let s = 0;
  for (const it of items) {
    if (it.crit && (it.value > 10 || it.flag)) {
      s += add(it.value, 1);
    } else if (it.value > 5) {
      s += it.value;
    } else {
      s += 1;
    }
  }
  return max(s, 0);
}

const risky = (n) => {
  while (n > 0) {
    try { n = n - 1 }
    catch (e) { n = 0 }
  }
  return n > 5 ? 5 : n;
};`

    const exampleUtils = `export const add = (a,b) => a + b;
export function max(a,b) {
  switch (true) {
    case a > b: return a;
    case b > a: return b;
    default: return a;
  }
}
module.exports = { legacy: function(x){ return x && x.y ? x.y : null } }`

    setFiles([
      { id: "1", name: "main.js", code: exampleMain },
      { id: "2", name: "utils.js", code: exampleUtils },
    ])
  }, [])

  const addFile = () => {
    const newFile: FileData = {
      id: Date.now().toString(),
      name: "untitled.js",
      code: "",
    }
    setFiles([...files, newFile])
  }

  const removeFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id))
  }

  const updateFile = (id: string, field: "name" | "code", value: string) => {
    setFiles(files.map((f) => (f.id === id ? { ...f, [field]: value } : f)))
  }

  const handleAnalyze = () => {
    analyzeFiles(files)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500/20 text-green-400 border-green-500/30"
    if (score >= 60) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    return "bg-red-500/20 text-red-400 border-red-500/30"
  }

  const getCCColor = (cc: number) => {
    if (cc >= 10) return "destructive"
    if (cc >= 5) return "secondary"
    return "default"
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">Code Complexity Analyzer — mock SonarQube</h1>
          <Badge variant="outline" className="bg-slate-800 border-slate-700 text-slate-300">
            Browser-only • JS/ESM
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-6 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Project Files */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-200">Project Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="border border-dashed border-slate-700 rounded-lg p-4 bg-slate-950">
                  <div className="flex items-center gap-3 mb-3">
                    <Input
                      value={file.name}
                      onChange={(e) => updateFile(file.id, "name", e.target.value)}
                      className="flex-1 max-w-48 bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-400"
                      placeholder="filename.js"
                    />
                    <span className="text-sm text-slate-400">JavaScript</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="ml-auto bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-100 hover:text-slate-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    value={file.code}
                    onChange={(e) => updateFile(file.id, "code", e.target.value)}
                    className="min-h-40 font-mono text-sm bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-400"
                    placeholder="Enter your JavaScript code here..."
                  />
                </div>
              ))}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={addFile}
                  className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-100 hover:text-slate-100"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add file
                </Button>
                <Button onClick={handleAnalyze} disabled={isAnalyzing} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {isAnalyzing ? "Analyzing..." : "Analyze"}
                </Button>
              </div>

              <p className="text-sm text-slate-300">
                Tip: You can paste multiple modules. Imports like{" "}
                <code className="font-mono bg-slate-800 px-1 py-0.5 rounded text-slate-200">import x from './utils.js'</code> or{" "}
                <code className="font-mono bg-slate-800 px-1 py-0.5 rounded text-slate-200">require('./utils')</code> get graphed.
              </p>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-200">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-center">
                  <div className="text-sm text-slate-300">Files</div>
                  <div className="text-xl font-bold mt-1 text-slate-100">{analysis?.stats.files || "–"}</div>
                </div>
                <div className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-center">
                  <div className="text-sm text-slate-300">Functions</div>
                  <div className="text-xl font-bold mt-1 text-slate-100">{analysis?.stats.totalFuncs || "–"}</div>
                </div>
                <div className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-center">
                  <div className="text-sm text-slate-300">Avg CC</div>
                  <div className="text-xl font-bold mt-1 text-slate-100">
                    {analysis?.stats.avgCC ? analysis.stats.avgCC.toFixed(1) : "–"}
                  </div>
                </div>
                <div className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-center">
                  <div className="text-sm text-slate-300">Max CC</div>
                  <div className="text-xl font-bold mt-1 text-slate-100">{analysis?.stats.maxCC || "–"}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge className={`${getScoreColor(analysis?.stats.score || 0)} border`}>
                  Score: {analysis?.stats.score || "–"}
                </Badge>
                <span className="text-sm text-slate-300">Mock maintainability score (0–100)</span>
              </div>

              {analysis?.errors && analysis.errors.length > 0 && (
                <div className="mt-4 space-y-1">
                  {analysis.errors.map((error, i) => (
                    <div key={i} className="text-sm text-red-300 bg-red-900/20 px-2 py-1 rounded">
                      {error}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Metrics Chart */}
        {analysis && analysis.functions.length > 0 && (
          <Card className="bg-slate-900 border-slate-800 mb-6">
            <CardHeader>
              <CardTitle className="text-slate-200">Metrics Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <MetricsChart functions={analysis.functions} />
            </CardContent>
          </Card>
        )}

        {/* Functions Table */}
        <Card className="bg-slate-900 border-slate-800 mb-6">
          <CardHeader>
            <CardTitle className="text-slate-200">Functions by Cyclomatic Complexity</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800">
                  <TableHead className="text-slate-300">Function</TableHead>
                  <TableHead className="text-slate-300">File</TableHead>
                  <TableHead className="text-slate-300">LOC</TableHead>
                  <TableHead className="text-slate-300">Params</TableHead>
                  <TableHead className="text-slate-300">CC</TableHead>
                  <TableHead className="text-slate-300">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analysis?.functions.slice(0, 50).map((fn, i) => (
                  <TableRow key={i} className="border-slate-800">
                    <TableCell className="font-mono text-slate-100">{fn.name}</TableCell>
                    <TableCell className="text-sm text-slate-300">{fn.file}</TableCell>
                    <TableCell className="text-slate-100">{fn.loc}</TableCell>
                    <TableCell className="text-slate-100">{fn.params}</TableCell>
                    <TableCell>
                      <Badge variant={getCCColor(fn.cc)}>{fn.cc}</Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">{fn.notes.join(", ")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dependency Graph */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-200">Dependency Graph</CardTitle>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                  <span className="text-slate-300">Project file</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                  <span className="text-slate-300">External module</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DependencyGraph
                edges={analysis?.edges || []}
                nodes={analysis?.parsed || []}
                extModules={analysis?.extModules || []}
              />
            </CardContent>
          </Card>

          {/* AST Preview */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-200">AST Preview</CardTitle>
              <p className="text-sm text-slate-300">Select a file to preview a trimmed AST (depth ≤ 3).</p>
            </CardHeader>
            <CardContent>
              <Select>
                <SelectTrigger className="bg-slate-950 border-slate-700 mb-4 text-slate-100">
                  <SelectValue placeholder="Select a file" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  {analysis?.parsed.map((file) => (
                    <SelectItem key={file.name} value={file.name} className="text-slate-100">
                      {file.name} {file.error && "(parse error)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <pre className="font-mono text-sm bg-slate-950 border border-slate-700 rounded p-3 max-h-80 overflow-auto text-slate-200">
                {analysis?.parsed[0] ? JSON.stringify(analysis.parsed[0].ast, null, 2) : "No files analyzed yet"}
              </pre>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="px-6 py-4 text-sm text-slate-300">
        Mock tool: metrics are approximate. For demo/teaching only.
      </footer>
    </div>
  )
}
