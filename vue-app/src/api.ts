import axios from "axios";

const USE_LOCAL_API = false; // process.env.NODE_ENV === "development";

const API_BASE_URL = USE_LOCAL_API
    ? "http://localhost:5001/api"
    : "https://sparklet.org/api";

const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default {
    // Define your API functions here
    async getUsers() {
        return await client.get("/");
    },
};
