interface observation {
  "observation_name": string,
  "center_frequency": number,
  
  "bins": number,
  "channels": number,
  "bandwidth": string,
  "integration_time": number,
  "observation_type": string,
  "output_filename": string,
  "receive_csv": boolean,
  "preferred_email": string,
}

interface privilegedObservation extends observation {
  "rf_gain": number, //optional later
  "if_gain": number, //optional later
  "bb_gain": number, //optional later
  "dec": number, //optional later
  "ra": number, //optional later
}

export interface observationBodyDTO {
  "observation": observation,
  "requestor": {
    "email": string,
    "user_id": string,
    "username": string
  }
}

export interface privilegedObservationBodyDTO {
  "observation": privilegedObservation,
  "requestor": {
    "email": string,
    "user_id": string,
    "username": string
  }
}

export interface observationSubmissionDTO {
    "observation_name": string,
    "center_frequency": number,
    "bins": number,
    "channels": number,
    "bandwidth": string,
    "integration_time": number,
    "observation_type": string,
    "output_filename": string,
    "receive_csv": boolean,
    "email": string,
    "user_id": string,
    "username": string,
    "status": string,
    "message": string
}

export interface privilegedObservationSubmissionDTO extends observationSubmissionDTO {
  "rf_gain": number, //optional later
  "if_gain": number, //optional later
  "bb_gain": number, //optional later
  "dec": number, //optional later
  "ra": number, //optional later
}

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