import { Navigate } from "react-router-dom"

import { ReactNode } from "react";

interface ProtectedRouteProps {
    user: any;
    children: ReactNode;
}

const protectedRoute = ({ user, children }: ProtectedRouteProps) => {
    if(!user){
        return <Navigate to="/signin" replace/> 
    }
    return children;//else return the children i.e the component that is wrapped inside the protectedRoute
}
export default protectedRoute;