import { SERVER } from "../../common/env";
import Store from "../../common/Store";
import { bg } from "../helpers/main";

export const email = new Store(JSON.parse(localStorage.getItem("last-email") || "null"));
export const user = new Store(JSON.parse(localStorage.getItem("auth") || "null"));

email.subscribe(email => {
    if (email) {
        localStorage.setItem("last-email", JSON.stringify(email));
    } else {
        localStorage.removeItem("last-email");
    }
});

user.subscribe(user => {
    if (user) {
        localStorage.setItem("auth", JSON.stringify(user));
    } else {
        localStorage.removeItem("auth");
    }
});

export async function login({ email, password }) {
    let _error;
    let res;
    try {
        const response = await fetch(`${SERVER}s3_uploader/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });
        res = await response.json();
        user.set(res);
        bg.log(res);
    } catch (error) {
        console.log(error);
        _error = error;
        user.set(null);
    }
    if (!res || !res.token) {
        res = {
            error: true,
            message:
                (_error || {}).message ||
                "Error: please check your credentials",
        };
    }
    return res;
}

export function logout() {
    user.set(null);
}