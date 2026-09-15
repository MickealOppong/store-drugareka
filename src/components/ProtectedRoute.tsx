import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children}:{children:any}) {

    const location = useLocation();

    const token = localStorage.getItem("tk");

    if (!token) {

        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    return children;
}