// src/formatter.ts
import { OpenAPIV3 } from "openapi-types";

export interface FormatterOptions {
	includeExamples?: boolean;
	includeDeprecated?: boolean;
	format?: "plain" | "markdown";
}

export class OpenAPILLMFormatter {
	private options: FormatterOptions;

	constructor(options: FormatterOptions = {}) {
		this.options = {
			includeExamples: true,
			includeDeprecated: false,
			format: "plain",
			...options,
		};
	}

	private formatSchema(schema: any, name?: string): string {
		let output = "";

		if (name) {
			output += `Schema: ${name}\n`;
		}

		if (schema.type) {
			output += `Type: ${schema.type}\n`;
		}

		if (schema.description) {
			output += `Description: ${schema.description}\n`;
		}

		if (schema.properties) {
			output += "\nProperties:\n";
			Object.entries(schema.properties).forEach(([propName, prop]: [string, any]) => {
				output += `- ${propName}:\n`;
				output += `  Type: ${prop.type || "any"}\n`;
				if (prop.description) output += `  Description: ${prop.description}\n`;
				if (prop.required) output += `  Required: Yes\n`;
				if (this.options.includeExamples && prop.example) {
					output += `  Example: ${prop.example}\n`;
				}
			});
		}

		if (schema.enum) {
			output += `\nPossible Values: ${schema.enum.join(", ")}\n`;
		}

		return output + "\n";
	}

	private formatParameters(parameters: any[]): string {
		if (!parameters?.length) return "";

		let output = "Parameters:\n";
		parameters.forEach((param) => {
			output += `- ${param.name} (${param.in}):\n`;
			output += `  Description: ${param.description || "No description"}\n`;
			output += `  Required: ${param.required ? "Yes" : "No"}\n`;
			if (param.schema) {
				output += `  Type: ${param.schema.type}\n`;
				if (this.options.includeExamples && param.schema.example) {
					output += `  Example: ${param.schema.example}\n`;
				}
			}
		});
		return output + "\n";
	}

	private formatEndpoint(path: string, methods: any): string {
		let output = `Endpoint: ${path}\n\n`;

		Object.entries(methods).forEach(([method, details]: [string, any]) => {
			// Skip deprecated endpoints if not included
			if (!this.options.includeDeprecated && details.deprecated) {
				return;
			}

			output += `Method: ${method.toUpperCase()}\n`;
			if (details.summary) output += `Summary: ${details.summary}\n`;
			if (details.description) output += `Description: ${details.description}\n`;

			// Parameters
			if (details.parameters) {
				output += "\n" + this.formatParameters(details.parameters);
			}

			// Request Body
			if (details.requestBody) {
				output += "Request Body:\n";
				const content = details.requestBody.content["application/json"];
				if (content?.schema) {
					output += this.formatSchema(content.schema);
				}
			}

			// Responses
			output += "Responses:\n";
			Object.entries(details.responses).forEach(([code, response]: [string, any]) => {
				output += `- ${code}: ${(response as any).description}\n`;
				if ((response as any).content?.["application/json"]?.schema) {
					output += this.formatSchema((response as any).content["application/json"].schema);
				}
			});

			output += "---\n\n";
		});

		return output;
	}

	public format(spec: OpenAPIV3.Document): string {
		let output = "API Documentation\n\n";

		// API Info
		output += `Title: ${spec.info.title}\n`;
		output += `Version: ${spec.info.version}\n`;
		if (spec.info.description) {
			output += `\nDescription: ${spec.info.description}\n`;
		}
		output += "\n";

		// Endpoints
		output += "=== Endpoints ===\n\n";
		Object.entries(spec.paths).forEach(([path, methods]) => {
			output += this.formatEndpoint(path, methods);
		});

		// Schemas
		if (spec.components?.schemas) {
			output += "=== Schemas ===\n\n";
			Object.entries(spec.components.schemas).forEach(([name, schema]) => {
				output += this.formatSchema(schema, name);
			});
		}

		return output;
	}
}
