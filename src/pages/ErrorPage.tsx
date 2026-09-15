import { useRouteError } from "react-router-dom"

const ErrorPage = ()=>{
    const err = useRouteError() as Error
    console.log(err);
    
    return <div>Oops error</div>
}
export default ErrorPage