# openapi-llm-docs

Convert OpenAPI specifications to LLM-friendly documentation format. This package converts OpenAPI/Swagger specifications into a clear, consistent format that's easy for Large Language Models (LLMs) to process and understand. This package provides both a standalone formatter and Express middleware for serving OpenAPI documentation in a format optimized for Large Language Models (LLMs).

## Installation

```bash
npm install openapi-llm-docs
```

## Usage

### Express Middleware

```typescript
import express from 'express';
import { createOpenAPILLMDocsMiddleware } from 'openapi-llm-docs';
import * as fs from 'fs';

const app = express();

// Load your OpenAPI spec
const spec = JSON.parse(fs.readFileSync('./openapi.json', 'utf8'));

// Add the middleware
app.use(createOpenAPILLMDocsMiddleware({
  spec,
  path: '/docs-llm',
  includeExamples: true,
  format: 'plain',
  requireDescription: true // Only include documented items
}));
```

### Standalone Formatter

```typescript
import { OpenAPILLMFormatter } from 'openapi-llm-docs';
import * as fs from 'fs';

// Load your OpenAPI spec
const spec = JSON.parse(fs.readFileSync('./openapi.json', 'utf8'));

// Create formatter instance
const formatter = new OpenAPILLMFormatter({
  includeExamples: true,
  includeDeprecated: false,
  format: 'plain',
  requireDescription: true // Only include documented items
});

// Format the spec
const formattedDocs = formatter.format(spec);
console.log(formattedDocs);
```

## Options

### Formatter Options

- `includeExamples` (boolean, default: true): Include example values in the output
- `includeDeprecated` (boolean, default: false): Include deprecated endpoints
- `format` ('plain' | 'markdown', default: 'plain'): Output format
- `requireDescription` (boolean, default: false): Only include endpoints, parameters, schemas, and properties that have descriptions. Useful for reducing token usage and ensuring complete documentation.

### Middleware Options

Includes all formatter options plus:
- `path` (string, default: '/docs-llm'): Route path for the documentation
- `spec` (OpenAPIV3.Document | () => OpenAPIV3.Document): OpenAPI specification object or function that returns it

## Output Format

The formatted output is structured as follows:

```
API Documentation

Title: Your API Title
Version: 1.0.0
Description: Your API Description

=== Endpoints ===

Endpoint: /users

Method: GET
Summary: Get all users
Description: Returns a list of all users
Parameters:
- page (query):
  Description: Page number
  Required: No
  Type: integer
  Example: 1

...

=== Schemas ===

Schema: User
Type: object
Properties:
- id:
  Type: string
  Description: User ID
  Required: Yes
  Example: "123e4567-e89b-12d3-a456-426614174000"
...
```

## License

MIT