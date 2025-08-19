# Code Complexity Analyzer MVP

A web-based Code Complexity Analyzer built with Next.js that analyzes JavaScript files for cyclomatic complexity and dependencies.

## Features

- ✅ Single JavaScript file upload interface
- ✅ AST parsing using Esprima
- ✅ Cyclomatic complexity calculation per function
- ✅ Module dependency extraction (import/require statements)
- ✅ **Interactive graphical metrics visualization**
- ✅ **Comprehensive charts with multiple views**
- ✅ Visual dependency graph
- ✅ JSON API endpoint for programmatic access
- ✅ Dark theme with proper text contrast

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the analyzer.

## API Endpoint

POST `/api/analyze` with JSON body:
```json
{
  "code": "function example() { return 'hello'; }",
  "filename": "example.js"
}
```

Returns:
```json
{
  "functions": [
    { "name": "example", "cyclomaticComplexity": 1 }
  ],
  "dependencies": []
}
```

## Technology Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Esprima** - JavaScript AST parsing
- **Lucide React** - Icons

## Recent Updates

- ✅ **Added comprehensive metrics visualization with Recharts**
- ✅ **Interactive charts showing CC vs LOC correlation**
- ✅ **Complexity distribution pie chart**  
- ✅ **Toggle between different chart views**
- ✅ **Enhanced tooltips with detailed function information**
- ✅ Fixed text contrast issues on dark backgrounds
- ✅ Enhanced readability with proper color hierarchy
- ✅ Improved form input visibility
- ✅ Better error message presentation

## Graphical Features

The **Metrics Visualization** section includes:

- **Function Overview Chart**: Combined bar and line chart showing Cyclomatic Complexity vs Lines of Code
- **Complexity Distribution**: Pie chart categorizing functions by complexity levels
- **Interactive Tooltips**: Hover over data points for detailed function information
- **View Toggle**: Switch between overview and distribution views
- **Summary Statistics**: Key metrics displayed as cards (Total CC, LOC, Avg Params, High CC count)
