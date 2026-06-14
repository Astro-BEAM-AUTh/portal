import { writeFile } from 'node:fs/promises';

const sourceUrl = process.argv[2] || 'http://localhost:8000/openapi.json';
const outputFile = process.argv[3] || 'src/api/backend-openapi.runtime.ts';

async function main() {
  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch OpenAPI schema (${response.status} ${response.statusText}) from ${sourceUrl}`);
  }

  const spec = await response.json();
  const schemas = spec?.components?.schemas ?? {};

  const observationTypeEnum = schemas?.ObservationTypeEnum?.enum ?? [];
  const observationStatusEnum = schemas?.ObservationStatusEnum?.enum ?? [];
  const referenceFrameEnum = schemas?.ReferenceFrameEnum?.enum ?? [];
  const bandwidthEnum = schemas?.BandwidthEnum?.enum ?? [];
  const centralFrequencyEnum = schemas?.CentralFrequencyEnum?.enum ?? [];
  const observationCreateProperties = schemas?.ObservationCreate?.properties ?? {};

  const observationCreateDefaults = {};
  for (const [propertyName, definition] of Object.entries(observationCreateProperties)) {
    if (definition && typeof definition === 'object' && 'default' in definition) {
      observationCreateDefaults[propertyName] = definition.default;
    }
  }

  const fileText = `// AUTO-GENERATED FILE. DO NOT EDIT.\n// Generated from ${sourceUrl}\n\n` +
    `export const OPENAPI_ENUMS = {\n` +
    `  ObservationType: ${JSON.stringify(observationTypeEnum)},\n` +
    `  ObservationStatus: ${JSON.stringify(observationStatusEnum)},\n` +
    `  ReferenceFrame: ${JSON.stringify(referenceFrameEnum)},\n` +
    `  Bandwidth: ${JSON.stringify(bandwidthEnum)},\n` +
    `  CentralFrequency: ${JSON.stringify(centralFrequencyEnum)},\n` +
    `} as const;\n\n` +
    `export const OBSERVATION_TYPE_VALUES = OPENAPI_ENUMS.ObservationType;\n` +
    `export const OBSERVATION_STATUS_VALUES = OPENAPI_ENUMS.ObservationStatus;\n\n` +
    `export const REFERENCE_FRAME_VALUES = OPENAPI_ENUMS.ReferenceFrame;\n` +
    `export const BANDWIDTH_VALUES = OPENAPI_ENUMS.Bandwidth;\n` +
    `export const CENTRAL_FREQUENCY_VALUES = OPENAPI_ENUMS.CentralFrequency;\n\n` +
    `export const OBSERVATION_CREATE_DEFAULTS = ${JSON.stringify(observationCreateDefaults, null, 2)} as const;\n`;

  await writeFile(outputFile, fileText, 'utf8');
  console.log(`Generated ${outputFile} from ${sourceUrl}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
