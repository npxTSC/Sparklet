import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://sparklet.org/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default {
  // Define your API functions here
};
