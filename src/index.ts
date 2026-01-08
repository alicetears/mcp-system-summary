import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"

// TypeScript types for the instruction JSON structure
type SummaryField = {
	name: string
	description: string
	required: boolean
	prompt_template: string
	example_format?: string
}

type SystemSummaryInstructions = {
	goal: string
	fields_to_generate: SummaryField[]
	required_fields_for_user_question: string[]
	output_file: {
		name: string
		format: string
		location: string
	}
	file_format: {
		type: string
		specifications: {
			headings: string[]
			tables: string[]
			bullet_points: string[]
		}
	}
	prompt_templates: {
		[fieldName: string]: string
	}
	notes_for_cursor: {
		codebase_inspection: string[]
		generation_process: string[]
		output_requirements: string[]
	}
}

// Configuration schema
export const configSchema = z.object({
	outputDirectory: z
		.string()
		.optional()
		.describe("Directory path for saving codebase_summary.md. Defaults to workspace root."),
	includeGitHistory: z
		.boolean()
		.default(true)
		.describe("Whether to analyze git history for recent changes. Defaults to true."),
	debug: z.boolean().default(false).describe("Enable debug logging"),
})

// Complete instruction JSON object
function createSystemSummaryInstructions(
	outputDirectory?: string,
): SystemSummaryInstructions {
	const outputPath = outputDirectory || "workspace root"

	return {
		goal: "Generate a complete, accurate, and readable system summary for Node.js/TypeScript codebases. The summary must be comprehensive enough for users, developers, and management to understand the codebase structure, status, and key information.",
		fields_to_generate: [
			{
				name: "overview",
				description:
					"High-level description of the system or codebase, including its purpose, main functionality, and architectural approach.",
				required: true,
				prompt_template:
					"Analyze the codebase structure, package.json, and main entry points to provide a comprehensive overview. Include: (1) What the system does, (2) Primary technologies and frameworks used, (3) High-level architecture pattern (if discernible), (4) Main use cases or target audience.",
				example_format:
					"# Overview\n\nThis system is a [type of application] built with [technologies]. It provides [main functionality] for [target audience]. The architecture follows [pattern]...",
			},
			{
				name: "status_summary",
				description:
					"Detailed status of each module, including description, last updated timestamp, changed files, and current state.",
				required: true,
				prompt_template:
					"For each major module, directory, or component identified in the codebase, provide: (1) Module/directory name, (2) Brief description of its purpose, (3) Last updated timestamp (from git history if available, or file modification dates), (4) List of recently changed files (if git history is enabled), (5) Current status (active, deprecated, in development, etc.). Format as a table with columns: Module, Description, Last Updated, Changed Files, Status.",
				example_format:
					"## Status Summary\n\n| Module | Description | Last Updated | Changed Files | Status |\n|--------|-------------|--------------|---------------|--------|\n| src/   | Main source | 2024-01-15   | index.ts      | Active |",
			},
			{
				name: "flow_summary",
				description:
					"Main system flow and interactions between modules, including entry points, data flow, and key processes.",
				required: true,
				prompt_template:
					"Analyze the codebase to identify: (1) Main entry points (e.g., index.ts, main.js, app entry), (2) Key modules and their relationships, (3) Data flow between components, (4) Main execution paths or workflows, (5) External dependencies and how they're used. Use text descriptions and optionally ASCII diagrams or flow descriptions.",
				example_format:
					"## Flow Summary\n\n### Entry Point\n- Application starts at `src/index.ts`\n\n### Main Flow\n1. [Step 1]\n2. [Step 2]\n...",
			},
			{
				name: "todo_list",
				description:
					"Pending tasks, features, improvements, or TODO comments found in the codebase.",
				required: false,
				prompt_template:
					"Search the codebase for: (1) TODO comments, (2) FIXME comments, (3) XXX comments, (4) Incomplete features or functions, (5) Known issues mentioned in code or documentation. Format as a prioritized list with categories if applicable.",
				example_format:
					"## TODO List\n\n### High Priority\n- [ ] Task 1\n- [ ] Task 2\n\n### Medium Priority\n- [ ] Task 3",
			},
			{
				name: "key_notes",
				description:
					"Important dependencies, warnings, observations, configuration requirements, or special considerations.",
				required: true,
				prompt_template:
					"Identify and document: (1) Critical dependencies from package.json, (2) Environment variables or configuration requirements, (3) Build or deployment requirements, (4) Known limitations or warnings, (5) Special setup instructions, (6) Security considerations, (7) Performance notes. Format as bullet points with clear categories.",
				example_format:
					"## Key Notes\n\n### Dependencies\n- Requires Node.js >= 18\n- Key library: express@^4.18.0\n\n### Configuration\n- Set NODE_ENV environment variable\n...",
			},
		],
		required_fields_for_user_question: [
			"overview",
			"status_summary",
			"flow_summary",
			"key_notes",
		],
		output_file: {
			name: "codebase_summary.md",
			format: "Markdown",
			location: outputPath,
		},
		file_format: {
			type: "Markdown",
			specifications: {
				headings: [
					"Use # for main title",
					"Use ## for major sections",
					"Use ### for subsections",
					"Use #### for sub-subsections",
				],
				tables: [
					"Use Markdown table syntax with pipes (|)",
					"Include header row with column names",
					"Align columns appropriately",
					"Use tables for status_summary and structured data",
				],
				bullet_points: [
					"Use - for unordered lists",
					"Use 1. for ordered lists",
					"Nest lists with proper indentation (2 spaces)",
					"Use bold (**text**) for emphasis on key terms",
				],
			},
		},
		prompt_templates: {
			overview:
				"Based on your codebase inspection, generate a comprehensive overview section. Include: system purpose, main technologies, architecture pattern, and primary use cases. Write in clear, professional language suitable for both technical and non-technical readers.",
			status_summary:
				"Generate a status summary table. For each module/directory you identified during inspection, include: name, description, last updated (from git history or file dates), changed files (if git history enabled), and status. Ensure all major components are represented.",
			flow_summary:
				"Describe the main system flow based on your codebase analysis. Start with entry points, then trace through key modules and their interactions. Include data flow, execution paths, and external dependency usage. Use clear, sequential descriptions.",
			todo_list:
				"Compile all TODO, FIXME, and XXX comments found in the codebase. Also identify incomplete features or known issues. Organize by priority if possible. If no TODOs are found, state that clearly.",
			key_notes:
				"Document critical information: dependencies (especially version requirements), configuration needs, build/deployment requirements, warnings, limitations, security considerations, and performance notes. Organize into clear categories with bullet points.",
		},
		notes_for_cursor: {
			codebase_inspection: [
				"BEFORE generating the summary, you MUST perform a comprehensive codebase inspection:",
				"1. Read package.json to identify dependencies, scripts, and project metadata",
				"2. Scan directory structure to identify all modules, files, and directories",
				"3. Identify key functions, classes, and exports in main files",
				"4. Check git history for recent changes (if includeGitHistory is enabled)",
				"5. Look for configuration files (tsconfig.json, .env files, etc.)",
				"6. Identify entry points (index.ts, main.js, app entry files)",
				"7. Search for TODO/FIXME/XXX comments throughout the codebase",
				"8. Build an internal structured representation of the codebase",
				"DO NOT output the summary until you have completed the inspection phase.",
			],
			generation_process: [
				"After inspection, generate the summary following this process:",
				"1. Start with the overview section using the prompt template",
				"2. Generate status_summary with a table format",
				"3. Create flow_summary describing system flow and interactions",
				"4. Compile todo_list from codebase comments and incomplete features",
				"5. Document key_notes with dependencies, warnings, and requirements",
				"6. Ensure all required fields are included and complete",
				"7. Format according to Markdown specifications provided",
				"8. Save the file as codebase_summary.md in the specified location",
			],
			output_requirements: [
				"The output must be:",
				"- Readable by users, developers, and management",
				"- Complete and accurate based on actual codebase inspection",
				"- Well-formatted with proper Markdown syntax",
				"- Include all required fields (overview, status_summary, flow_summary, key_notes)",
				"- Include optional fields (todo_list) if applicable",
				"- Saved to the file path specified in output_file.location",
				"- Use clear, professional language throughout",
			],
		},
	}
}

export default function createServer({
	config,
}: {
	config: z.infer<typeof configSchema>
}) {
	const server = new McpServer({
		name: "System Summary Instructions",
		version: "1.0.0",
	})

	// Tool: generate-system-summary-instructions
	server.registerTool(
		"generate-system-summary-instructions",
		{
			title: "Generate System Summary Instructions",
			description:
				"Returns complete JSON instructions for generating a system summary. Cursor should use these instructions to inspect the codebase and generate a comprehensive codebase_summary.md file.",
			inputSchema: {
				outputPath: z
					.string()
					.optional()
					.describe(
						"Optional path to override the configured output directory for codebase_summary.md",
					),
			},
		},
		async ({ outputPath }) => {
			const instructions = createSystemSummaryInstructions(
				outputPath || config.outputDirectory,
			)
			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(instructions, null, 2),
					},
				],
			}
		},
	)

	// Resource: system-summary-instructions
	server.registerResource(
		"system-summary-instructions",
		"instructions://system-summary",
		{
			title: "System Summary Instructions Reference",
			description:
				"Read-only reference documentation for the system summary instruction structure. Use this to understand the format and requirements for generating codebase summaries.",
		},
		async uri => {
			const instructions = createSystemSummaryInstructions(
				config.outputDirectory,
			)
			return {
				contents: [
					{
						uri: uri.href,
						text: JSON.stringify(instructions, null, 2),
						mimeType: "application/json",
					},
				],
			}
		},
	)

	// Prompt: system-summary-template
	server.registerPrompt(
		"system-summary-template",
		{
			title: "System Summary Template",
			description:
				"Provides a reusable prompt template for generating system summaries. Use this when the user wants to generate a summary with specific focus areas.",
			argsSchema: {
				codebasePath: z
					.string()
					.optional()
					.describe(
						"Optional path to the codebase root. If not provided, uses current workspace.",
					),
				focusArea: z
					.string()
					.optional()
					.describe(
						"Optional focus area for the summary (e.g., 'backend', 'frontend', 'api', 'database'). If provided, emphasize this area in the summary.",
					),
			},
		},
		async ({ codebasePath, focusArea }) => {
			const instructions = createSystemSummaryInstructions(
				config.outputDirectory,
			)
			let promptText = `Generate a comprehensive system summary for this codebase following these instructions:\n\n${JSON.stringify(instructions, null, 2)}\n\n`

			if (codebasePath) {
				promptText += `Codebase path: ${codebasePath}\n`
			}

			if (focusArea) {
				promptText += `Focus area: ${focusArea}\n\nPlease emphasize the ${focusArea} components in your summary.\n`
			}

			promptText +=
				"\nRemember to:\n1. First inspect the codebase thoroughly\n2. Collect all relevant information\n3. Then generate the summary following the instruction format\n4. Save the output as codebase_summary.md"

			return {
				messages: [
					{
						role: "user",
						content: {
							type: "text",
							text: promptText,
						},
					},
				],
			}
		},
	)

	return server.server
}
