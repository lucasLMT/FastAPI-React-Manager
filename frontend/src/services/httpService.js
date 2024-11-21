import axios from "axios";

const baseURL = "http://localhost:8000/";

async function get(sufix) {
    console.log(baseURL + sufix)
    return await axios.get(baseURL + sufix, {
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": getLocalToken()
        }
    });
}

async function post(sufix, json) {
    const token = getLocalToken();
    return await axios.post(baseURL + sufix, json, {
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
        }
    });
}

async function put(sufix, json) {
    const token = getLocalToken();
    return await axios.put(baseURL + sufix, json, {
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
        }
    });
}

async function http_delete(sufix) {
    const token = getLocalToken();
    return await axios.delete(baseURL + sufix, {
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
        }
    });
}

async function getToken(sufix, data) {
    return await axios.post(baseURL + sufix, data, {
        headers: {
            "Content-Type": "application/json"
        }
    });
}

async function createUser(sufix, data) {
    return await axios.post(baseURL + sufix, data, {
        headers: {
            "Content-Type": "application/json"
        }
    });
}

function getLocalToken() {
    return localStorage.getItem("token");
}

export default {
    get,
    post,
    put,
    http_delete,
    getToken,
    createUser
};
