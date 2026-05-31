// AUTO-GENERATED FILE. DO NOT EDIT.
// Generated from http://localhost:8000/openapi.json

export const OPENAPI_ENUMS = {
	ObservationType: [
		"HOT_CALIBRATION",
		"COLD_CALIBRATION",
		"TARGET_OBSERVATION",
	],
	ObservationStatus: [
		"PENDING",
		"IN_PROGRESS",
		"COMPLETED",
		"FAILED",
		"CANCELLED",
	],
} as const;

export const OBSERVATION_TYPE_VALUES = OPENAPI_ENUMS.ObservationType;
export const OBSERVATION_STATUS_VALUES = OPENAPI_ENUMS.ObservationStatus;

export const OBSERVATION_CREATE_DEFAULTS = {
	observation_type: "TARGET_OBSERVATION",
} as const;
