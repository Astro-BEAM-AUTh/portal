import type { components } from '../../../../api/backend-openapi';

export type ObservationCreateDTO = components['schemas']['ObservationCreate'];
export type ObservationReadDTO = components['schemas']['ObservationRead'];
export type UserCreateDTO = components['schemas']['UserCreate'];
export type ObservationStatusDTO = components['schemas']['ObservationStatus'];

export interface observationBodyDTO {
  observation: ObservationCreateDTO;
  requestor: UserCreateDTO;
}

export type privilegedObservationBodyDTO = observationBodyDTO;

export type observationSubmissionDTO = ObservationReadDTO;

export type privilegedObservationSubmissionDTO = ObservationReadDTO;

export interface observationFormDTO{
  name: String,
  observationType: String,
  cFreq: String | Number,
  bandwidth: String | Number,
  channels: Number | String,
  bins: Number | String,
  duration: Number | String,
  csvBool: Boolean | String,
  preferredEmail: String
}

export interface privilegedObservationFormDTO extends observationFormDTO {
  rfGain: Number | String,
  ifGain: Number | String,
  bbGain: Number | String,
  ra: Number | String,
  dec: Number | String,
}