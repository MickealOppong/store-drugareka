import { Navigate, useLocation } from "react-router-dom";
import { CookieService } from "../util/util";

export default function ProtectedRoute({ children}:{children:any}) {

    const location = useLocation();

     const token = CookieService.get("tk") ?? "";

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