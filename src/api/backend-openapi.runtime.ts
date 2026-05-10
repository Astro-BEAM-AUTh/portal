// AUTO-GENERATED FILE. DO NOT EDIT.
// Generated from http://localhost:8000/openapi.json

export const OPENAPI_ENUMS = {
  ObservationType: ["hot_calibration","cold_calibration","target_observation"],
  ObservationStatus: ["pending","in_progress","completed","failed","cancelled"],
} as const;

export const OBSERVATION_TYPE_VALUES = OPENAPI_ENUMS.ObservationType;
export const OBSERVATION_STATUS_VALUES = OPENAPI_ENUMS.ObservationStatus;

export const OBSERVATION_CREATE_DEFAULTS = {
  "observation_type": "target_observation"
} as const;
