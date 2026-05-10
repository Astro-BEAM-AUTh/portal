import type { components } from '../../../../api/backend-openapi';

export type ObservationCreateDTO = components['schemas']['ObservationCreate'];
export type ObservationReadDTO = components['schemas']['ObservationRead'];
export type UserCreateDTO = components['schemas']['UserCreate'];
export type ObservationStatusDTO = components['schemas']['ObservationStatus'];

export interface observationBodyDTO {
  observation: ObservationCreateDTO;
  requestor: UserCreateDTO;
}

export type observationSubmissionDTO = ObservationReadDTO;