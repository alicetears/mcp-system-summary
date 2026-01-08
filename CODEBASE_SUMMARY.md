# Codebase Summary: MCP System Summary Instructions

## Project Overview

**MCP System Summary Instructions** is an MCP (Model Context Protocol) server that provides structured instructions to Cursor for generating comprehensive system summaries for Node.js/TypeScript codebases.

### Core Purpose
- **Does NOT generate summaries directly** - Instead provides detailed JSON instructions for Cursor to follow
- Guides Cursor through codebase inspection and analysis
- Provides templates and structure for generating system documentation

## Project Structure

```
mcp-system-summary/
├── src/
│   └── index.ts          # Main MCP server implementation
├── package.json          # Dependencies and scripts
├── smithery.yaml         # Runtime configuration (TypeScript)
├── README.md             # User documentation
├── AGENTS.md             # Smithery SDK guide
├── CODEBASE_SUMMARY.md   # This file
└── .gitignore            # Git ignore rules
```

## Technology Stack

- **Runtime**: TypeScript (Node.js 20+)
- **Framework**: Smithery SDK for building MCP servers
- **Dependencies**:
  - `@modelcontextprotocol/sdk`: Core MCP SDK
  - `@smithery/sdk`: Smithery SDK for deployment
  - `zod`: Schema validation for configuration

## Core Components (MCP Components)

### 1. Tool: `generate-system-summary-instructions`
**Purpose**: Returns complete JSON instructions for generating system summaries

**Input Parameters**:
- `outputPath` (optional): Override the configured output directory for `codebase_summary.md`

**Output**: JSON object containing:
- `goal`: Purpose of summary generation
- `fields_to_generate`: List of fields to generate (overview, status_summary, flow_summary, todo_list, key_notes)
- `required_fields_for_user_question`: Required fields
- `output_file`: Output file information
- `file_format`: Markdown format specifications
- `prompt_templates`: Templates for each field
- `notes_for_cursor`: Instructions for Cursor

### 2. Resource: `system-summary-instructions`
**URI**: `instructions://system-summary`

**Purpose**: Provides read-only reference documentation for instruction structure

**Content**: Same JSON instructions as the tool returns, but as a resource for reading

### 3. Prompt: `system-summary-template`
**Purpose**: Provides reusable prompt template for generating system summaries

**Input Parameters**:
- `codebasePath` (optional): Path to codebase root
- `focusArea` (optional): Focus area (e.g., 'backend', 'frontend', 'api')

**Output**: Pre-formatted user message with instruction template

## Summary Fields

### 1. **overview** (required)
- High-level system description
- Primary technologies and frameworks
- Architecture pattern
- Use cases and target audience

### 2. **status_summary** (required)
- Status of each module
- Module descriptions
- Last updated timestamps (from git history)
- Recently changed files
- Current status (active, deprecated, in development)

**Format**: Markdown table

### 3. **flow_summary** (required)
- Main entry points
- Data flow between modules
- Execution paths
- External dependency usage

### 4. **todo_list** (optional)
- TODO/FIXME/XXX comments
- Incomplete features
- Known issues

### 5. **key_notes** (required)
- Critical dependencies
- Environment variables
- Configuration requirements
- Warnings and limitations
- Security considerations
- Performance notes

## Configuration Schema

```typescript
{
  outputDirectory?: string      // Path for saving file (default: workspace root)
  includeGitHistory?: boolean   // Analyze git history (default: true)
  debug?: boolean              // Enable debug logging (default: false)
}
```

## Workflow Process

### Step 1: Codebase Inspection
Before generating summary, Cursor must:
1. Read `package.json` to identify dependencies and metadata
2. Scan directory structure to identify all modules
3. Identify key functions, classes, and exports
4. Check git history (if enabled)
5. Find configuration files (tsconfig.json, .env, etc.)
6. Identify entry points (index.ts, main.js)
7. Search for TODO/FIXME comments
8. Build internal structured representation of codebase

### Step 2: Summary Generation
After inspection:
1. Generate overview section
2. Generate status_summary table
3. Generate flow_summary
4. Compile todo_list
5. Document key_notes
6. Verify all required fields are complete
7. Format according to Markdown specifications
8. Save as `codebase_summary.md`

## Output Format

- **File**: `codebase_summary.md`
- **Format**: Markdown
- **Structure**:
  - Use `#` for main title
  - Use `##` for major sections
  - Use `###` for subsections
  - Use Markdown tables for structured data
  - Use bullet points and lists
  - Use **bold** for key terms

## Scripts

```bash
npm run dev    # Start development server (port 8081)
npm run build  # Build for production
```

## Deployment

1. Push code to GitHub
2. Deploy via [smithery.ai/new](https://smithery.ai/new)
3. Smithery handles deployment and scaling automatically

## Architecture

### Server Type
- **Stateless Server**: Creates new instance for each call (default)
- No state maintained between calls

### Transport
- **HTTP Transport**: Uses HTTP/HTTPS for communication
- Hosted on Smithery infrastructure
- Accessible from anywhere via URL

### Configuration Management
- Configuration passed via URL parameters
- Each session has isolated configuration
- Supports multi-user scenarios

## Usage Examples

### Using the Tool
```typescript
// Cursor calls tool to get instructions
const instructions = await callTool('generate-system-summary-instructions', {
  outputPath: './docs'
})
```

### Reading the Resource
```typescript
// Read resource to see structure
const resource = await readResource('instructions://system-summary')
```

### Using the Prompt
```typescript
// Use prompt template
const prompt = await usePrompt('system-summary-template', {
  codebasePath: './src',
  focusArea: 'backend'
})
```

## Installing in Cursor

Add to `~/.cursor/mcp.json` (macOS/Linux) or `%APPDATA%\Cursor\mcp.json` (Windows):

```json
{
  "mcpServers": {
    "mcp-system-summary": {
      "type": "http",
      "url": "https://server.smithery.ai/AliceTears/mcp-system-summary",
      "headers": {}
    }
  }
}
```

Restart Cursor after adding the configuration.

## Key Observations

1. **Does not generate summaries directly**: This MCP provides instructions only, doesn't generate summaries itself
2. **Cursor does the generation**: Cursor must perform inspection and generation following instructions
3. **Git History**: Can enable/disable git history analysis
4. **Flexible Output**: Can specify output path
5. **Focus Areas**: Supports focusing on specific areas (backend, frontend, etc.)

## Dependencies

- `@modelcontextprotocol/sdk@^1.25.1`: MCP SDK
- `@smithery/sdk@^3.0.1`: Smithery SDK
- `zod@^4`: Schema validation
- `@smithery/cli@^2.2.1`: Development CLI (dev dependency)

## Key Files

- **src/index.ts**: Main file containing all logic
  - Defines configuration schema
  - Creates instructions JSON
  - Registers tools, resources, and prompts
- **smithery.yaml**: Specifies TypeScript runtime
- **package.json**: Manages dependencies and scripts

## Summary

MCP System Summary Instructions is a server that provides structured instructions to Cursor for generating comprehensive system documentation for Node.js/TypeScript codebases. It doesn't generate summaries itself, but provides detailed instructions that enable Cursor to perform the task efficiently.
