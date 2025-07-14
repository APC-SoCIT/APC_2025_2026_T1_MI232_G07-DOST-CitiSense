import LoginForm from "../components/LoginForm";

function Login() {
    return(
        <main className="flex flex-col items-center">
            <div className="mt-5 justify-center">
                <LoginForm route="/api/auth/token/"/>
            </div>
        </main>
    ) 
    
}

export default Login;