import type { components } from "../../../../api/backend-openapi";

export type ObservationCreateDTO = components["schemas"]["ObservationCreate"];
export type ObservationReadDTO = components["schemas"]["ObservationRead"];
export type ObservationStatusDTO = components["schemas"]["ObservationStatus"];

export interface ObservationRequestorDTO {
	email: string;
	username: string;
	user_id: string;
	auth_provider?: string;
}

export interface observationBodyDTO {
	observation: ObservationCreateDTO;
	requestor?: ObservationRequestorDTO;
}

export type observationSubmissionDTO = ObservationReadDTO;
