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
	ReferenceFrame: ["TOPO", "LSRK", "BARY", "HELIO", "GEO"],
	Bandwidth: [
		1.5, 1.75, 2.5, 2.75, 3, 3.84, 5.5, 6, 7, 8.75, 10, 12, 14, 20, 28,
	],
	CentralFrequency: [1420, 1670, 22000],
} as const;

export const OBSERVATION_TYPE_VALUES = OPENAPI_ENUMS.ObservationType;
export const OBSERVATION_STATUS_VALUES = OPENAPI_ENUMS.ObservationStatus;

export const REFERENCE_FRAME_VALUES = OPENAPI_ENUMS.ReferenceFrame;
export const BANDWIDTH_VALUES = OPENAPI_ENUMS.Bandwidth;
export const CENTRAL_FREQUENCY_VALUES = OPENAPI_ENUMS.CentralFrequency;

export const OBSERVATION_CREATE_DEFAULTS = {
	bandwidth: 1.5,
	center_frequency: 1420,
	velocity_frame: "LSRK",
	observation_type: "TARGET_OBSERVATION",
	fft_size: 1024,
	receive_csv: false,
	perform_data_analysis: true,
} as const;
