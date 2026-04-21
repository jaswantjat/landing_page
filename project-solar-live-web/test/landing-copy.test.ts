import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const testDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(testDir, '..');

function read(relativePath: string): string {
  return fs.readFileSync(path.join(projectDir, relativePath), 'utf8');
}

test('landing page copy stays focused on one concrete outcome', () => {
  const template = read('src/components/LeadProposalTemplate.tsx');
  const form = read('src/components/LeadCaptureForm.tsx');
  const css = read('app/globals.css');
  const layout = read('app/layout.tsx');

  assert.match(template, /Vea si este tejado puede bajar su factura de verdad\./);
  assert.match(template, /Clientes que ya ahorran con eltex/);
  assert.match(template, /Historias verificadas de vecinos que ya han instalado placas solares con nosotros\./);
  assert.match(template, /q4P8JVUloww/);
  assert.match(template, /CTBCxUoVTxM/);
  assert.match(template, /Hemos reservado una ventana técnica para/);
  assert.match(template, /archivaremos los datos satelitales y la plaza para dejar sitio a un vecino en lista de espera/);
  assert.match(template, /En 7 minutos sabrá si este tejado compensa o no/);
  assert.match(template, /BRAND_COPY\.googleReviewsBadge/);
  assert.match(template, /BRAND_COPY\.googleReviewsFull/);
  assert.match(template, /BRAND_COPY\.googleReviewsVerified/);
  assert.match(template, /BRAND_COPY\.installationsHeadline/);
  assert.match(template, /BRAND_COPY\.installationsFull/);
  assert.match(template, /BRAND_COPY\.warrantyHeadline/);
  assert.match(template, /BRAND_COPY\.warrantyFull/);
  assert.match(form, /¿Qué quiere resolver primero\?/);
  assert.match(form, /Quiero mi estimación real/);
  assert.match(layout, /BRAND_THEME\.blue/);
  assert.match(layout, /BRAND_THEME\.yellow/);

  assert.doesNotMatch(template, /Informe de Independencia Energética 2026\./);
  assert.doesNotMatch(template, /plazas disponibles/);
  assert.doesNotMatch(template, /Nos transmitieron confianza desde el primer momento/);
  assert.doesNotMatch(template, /Jorge/);
  assert.doesNotMatch(form, /valor patrimonial de mi piso/);
  assert.doesNotMatch(template, /uploads\.onecompiler\.io/);
  assert.doesNotMatch(layout, /fonts\.googleapis\.com/);
  assert.match(css, /\.trust-in\s*\{[\s\S]*grid-template-columns:\s*1fr;/);
});
