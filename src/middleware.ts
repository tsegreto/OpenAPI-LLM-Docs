// src/middleware.ts
import { Request, Response, NextFunction } from "express";
import { OpenAPIV3 } from "openapi-types";
import { OpenAPILLMFormatter, FormatterOptions } from "./formatter";

export interface MiddlewareOptions extends FormatterOptions {
	path?: string;
	spec: OpenAPIV3.Document | (() => OpenAPIV3.Document);
}

export function createOpenAPILLMDocsMiddleware(options: MiddlewareOptions) {
	const { path = "/docs-llm", spec, ...formatterOptions } = options;

	const formatter = new OpenAPILLMFormatter(formatterOptions);

	return (req: Request, res: Response, next: NextFunction) => {
		if (req.path !== path) {
			return next();
		}

		try {
			const openApiSpec = typeof spec === "function" ? spec() : spec;
			const formatted = formatter.format(openApiSpec);

			res.setHeader("Content-Type", "text/plain");
			res.send(formatted);
		} catch (error) {
			next(error);
		}
	};
}
