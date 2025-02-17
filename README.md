# OpenAPI LLM Docs

Convert OpenAPI/Swagger specifications into LLM-friendly documentation format. This package provides both a standalone formatter and Express middleware for serving OpenAPI documentation in a format optimized for Large Language Models (LLMs).

## Installation

```bash
npm install openapi-llm-docs
```

## Usage

### Express Middleware

```typescript
import express from 'express';
import { createOpenAPILLMDocsMiddleware } from 'openapi-llm-docs';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

const app = express();

// Load your OpenAPI spec
const spec = yaml.load(fs.readFileSync('./openapi.yaml', 'utf8'));

// Add the middleware
app.use(createOpenAPILLMDocsMiddleware({
  spec,
  path: '/docs-llm',
  includeExamples: true,
  format: 'plain'
}));
```

### Standalone Formatter

```typescript
import { OpenAPILLMFormatter } from 'openapi-llm-docs';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

// Load your OpenAPI spec
const spec = yaml.load(fs.readFileSync('./openapi.yaml', 'utf8'));

// Create formatter instance
const formatter = new OpenAPILLMFormatter({
  includeExamples: true,
  includeDeprecated: false,
  format: 'plain'
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