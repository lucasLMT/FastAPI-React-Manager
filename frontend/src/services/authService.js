import http from "./httpService";
import { jwtDecode } from "jwt-decode"

export async function userLogin(email, password) {
    const response = await http.getToken("user/token", {
        email: email,
        password: password
    }).catch(error => {
        console.log(error)
    });
    console.log(response.data.access_token);
    localStorage.setItem("token", response.data.access_token);
    const decoded = jwtDecode(response.data.access_token);
    console.log("userLogin "+ decoded)
    return decoded;
}

export async function createUser(email, password) {
    const response = await http.createUser("user/register", {
        email: email,
        password: password
    });
    localStorage.setItem("token", response.data.access_token);
    return response;
}

export function logout() {
    localStorage.removeItem("token");
}

export function getCurrentUser() {
    try {
        const token = localStorage.getItem("token");
        const decodedJwt = jwtDecode(token);
        return decodedJwt.exp * 1000 > Date.now() ? decodedJwt : null;
    } catch (ex) {
        return null;
    }
}
