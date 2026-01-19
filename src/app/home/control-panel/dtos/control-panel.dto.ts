export interface observationBodyDTO {
  "observation": {
    "observation_name": String,
    "center_frequency": Number,
    "rf_gain"?: Number,
    "if_gain"?: Number,
    "bb_gain"?: Number,
    "dec"?: Number,
    "ra"?: Number,
    "bins": Number,
    "channels": Number,
    "bandwidth": String,
    "integration_time": Number,
    "observation_type": String,
    "output_filename": String,
    "receive_csv": Boolean,
  },
  "requestor": {
    "email": String,
    "user_id": String,
    "username": String
  }
}