import axios from "axios";

const commonConfig = {
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
    Accept: "application/json",
  },
};

export default (baseURL) => {
  return axios.create({
    baseURL,
    ...commonConfig,
  });
};
