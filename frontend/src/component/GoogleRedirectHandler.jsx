import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GOOGLE_ACCESS_TOKEN } from "../token";  
import { useAuthentication } from "../auth"; // 🔧 Make sure this hook exists and is imported

function RedirectGoogleAuth() {
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Redirecting Handler");
        const queryParams = new URLSearchParams(window.location.search);
        const accessToken = queryParams.get("access_token");

        console.log("Queryparams: ", window.location.search);

        if (accessToken) {
            console.log("Access token found: ", accessToken);
            localStorage.setItem(GOOGLE_ACCESS_TOKEN, accessToken);

            axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

            axios
                .get("http://localhost:8000/api/user/details/") // 🔧 Match your actual Django endpoint
                .then((response) => {
                    console.log("User data: ", response.data);
                    navigate("/dashboard");
                })
                .catch((error) => {
                    console.error("Error: ", error.response ? error.response.data : error.message);
                    navigate("/login");
                });
        } else {
            console.log("No token found in URL");
            navigate("/login");
        }
    }, [navigate]);

    return <div>Logging in...</div>;
}

export default RedirectGoogleAuth;
