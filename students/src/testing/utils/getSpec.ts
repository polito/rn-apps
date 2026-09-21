import fs from 'fs';
import { load } from 'js-yaml';
import path from 'path';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface SpecOperation {
  operationId?: string;
  responses?: Record<
    string,
    { content?: Record<string, { example?: unknown }> }
  >;
}

interface ParsedSpec {
  paths: Record<string, Partial<Record<HttpMethod, SpecOperation>>>;
  components?: { schemas?: Record<string, { example?: unknown }> };
}

const packageJsonPath =
  require.resolve('@polito/student-api-client/package.json');
const specPath = path.join(path.dirname(packageJsonPath), 'openapi.yaml');
const content = fs.readFileSync(specPath, 'utf8');
const spec = load(content) as ParsedSpec;

/**
 * Returns the 200 response body example from the official OpenAPI spec.
 *
 * @param apiPath API path ('/v2/courses')
 * @param [method='get'] HTTP Method - default 'get'
 */
export function specExample<T = unknown>(
  apiPath: string,
  method: HttpMethod = 'get',
): T {
  const example =
    spec.paths[apiPath]?.[method]?.responses?.['200']?.content?.[
      'application/json'
    ]?.example;

  if (example == null) {
    throw new Error(`No example found for ${method.toUpperCase()} ${apiPath}.`);
  }

  return example as T;
}

/**
 * Returns the schema example
 */
export function schemaExample<T = unknown>(schemaName: string): T {
  const example = spec.components?.schemas?.[schemaName]?.example;

  if (example == null) {
    throw new Error(`No example found for schema "${schemaName}".`);
  }

  return example as T;
}
