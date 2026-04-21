import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  collectEnvVarNames,
  diffEnvVarNames,
  readEnvExample
} from '../../test-support/env-example.mjs';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(testDir, '..');

test('railway-web .env.example matches source env usage', async () => {
  const sourceVars = await collectEnvVarNames(path.join(projectDir, 'src'));
  const exampleVars = await readEnvExample(path.join(projectDir, '.env.example'));
  const undocumented = diffEnvVarNames(
    sourceVars,
    exampleVars,
    new Set(['RAILWAY_SERVICE_SOLAR_LEADS_BACKEND_URL'])
  );
  const unused = diffEnvVarNames(exampleVars, sourceVars);

  assert.deepEqual(undocumented, []);
  assert.deepEqual(unused, []);
});
