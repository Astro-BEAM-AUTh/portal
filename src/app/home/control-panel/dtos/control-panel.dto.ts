export interface observationBodyDTO {
  "observation": {
    "observation_name": string,
    "center_frequency": number,
    "rf_gain": number, //optional later
    "if_gain": number, //optional later
    "bb_gain": number, //optional later
    "dec": number, //optional later
    "ra": number, //optional later
    "bins": number,
    "channels": number,
    "bandwidth": string,
    "integration_time": number,
    "observation_type": string,
    "output_filename": string,
    "receive_csv": boolean,
  },
  "requestor": {
    "email": string,
    "user_id": string,
    "username": string
  }
}

export interface observationFormDTO{
      name: String,
      observationType: String,
      cFreq: String | Number,
      bandwidth: String | Number,
      channels: Number | String,
      bins: Number | String
      rfGain: Number | String,
      ifGain: Number | String,
      bbGain: Number | String,
      ra: Number | String,
      dec: Number | String,
      duration: Number | String,
      csvBool: Boolean | String,
}

export interface observationSubmissionDTO extends observationFormDTO{
      status: "Finished" | "Pending" | "Rejected" |"Failed"
}