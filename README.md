# MCP System Summary Instructions

An MCP (Model Context Protocol) server that provides structured instructions to Cursor on how to generate comprehensive system summaries for Node.js/TypeScript codebases.

**Purpose**: This MCP does NOT generate summaries directly. Instead, it provides detailed JSON instructions that guide Cursor through the process of:
1. Inspecting and analyzing codebases
2. Collecting relevant information (modules, dependencies, git history)
3. Generating structured Markdown summaries with specific fields

Built with [Smithery SDK](https://smithery.ai/docs)

## Overview

This MCP server exposes three components that help Cursor understand how to generate system summaries:

- **Tool**: `generate-system-summary-instructions` - Returns complete JSON instructions
- **Prompt**: `system-summary-template` - Provides reusable prompt templates
- **Resource**: `system-summary-instructions` - Read-only reference documentation

## Prerequisites

- **Smithery API key**: Get yours at [smithery.ai/account/api-keys](https://smithery.ai/account/api-keys)
- Node.js 20 or higher

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Test the MCP components:
   - Call the `generate-system-summary-instructions` tool
   - Use the `system-summary-template` prompt
   - Access the `instructions://system-summary` resource

## Configuration

The server supports the following configuration options:

- `outputDirectory` (optional): Directory path for saving `codebase_summary.md`. Defaults to workspace root.
- `includeGitHistory` (optional, default: `true`): Whether to analyze git history for recent changes.
- `debug` (optional, default: `false`): Enable debug logging.

## MCP Components

### Tool: `generate-system-summary-instructions`

Returns complete JSON instructions for generating a system summary. Cursor should use these instructions to inspect the codebase and generate a comprehensive `codebase_summary.md` file.

**Input Parameters:**
- `outputPath` (optional): Override the configured output directory

**Output:**
JSON object containing:
- Goal and purpose
- Fields to generate (overview, status_summary, flow_summary, todo_list, key_notes)
- Required fields list
- Output file configuration
- Markdown format specifications
- Prompt templates for each field
- Notes for codebase inspection and generation process

### Prompt: `system-summary-template`

Provides a reusable prompt template for generating system summaries with optional focus areas.

**Input Parameters:**
- `codebasePath` (optional): Path to the codebase root
- `focusArea` (optional): Focus area (e.g., 'backend', 'frontend', 'api')

**Output:**
Pre-formatted user message with instruction template and optional focus instructions.

### Resource: `system-summary-instructions`

Read-only reference documentation for the system summary instruction structure.

**URI:** `instructions://system-summary`

**Content:**
Complete instruction JSON as reference documentation for understanding the format and requirements.

## Summary Fields

The instructions define the following summary fields:

1. **overview** (required): High-level system description, technologies, and architecture
2. **status_summary** (required): Module status, descriptions, last updated, changed files
3. **flow_summary** (required): Main system flow and module interactions
4. **todo_list** (optional): Pending tasks, features, and improvements
5. **key_notes** (required): Dependencies, warnings, configuration requirements

## Output Format

The generated summary is saved as `codebase_summary.md` in Markdown format with:
- Proper heading hierarchy (#, ##, ###)
- Tables for structured data
- Bullet points and lists
- Professional formatting suitable for users, developers, and management

## Development

Your code is organized as:
- `src/index.ts` - MCP server with tools, resources, and prompts
- `smithery.yaml` - Runtime specification

Edit `src/index.ts` to customize the instruction structure or add new components.

## Build

```bash
npm run build
```

Creates bundled server in `.smithery/`

## Deploy

Ready to deploy? Push your code to GitHub and deploy to Smithery:

1. Create a new repository at [github.com/new](https://github.com/new)

2. Initialize git and push to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

3. Deploy your server to Smithery at [smithery.ai/new](https://smithery.ai/new)

## How It Works

1. **Cursor calls the MCP**: When a user requests a system summary, Cursor can call the tool, use the prompt, or read the resource.

2. **Instructions are provided**: The MCP returns structured JSON instructions that specify:
   - What fields to generate
   - How to inspect the codebase
   - Prompt templates for each field
   - Output format requirements

3. **Cursor follows instructions**: Cursor performs codebase inspection, collects information, and generates the summary following the provided instructions.

4. **Summary is generated**: Cursor creates `codebase_summary.md` with all required fields in the specified format.

## Learn More

- [Smithery Docs](https://smithery.ai/docs)
- [MCP Protocol](https://modelcontextprotocol.io)
