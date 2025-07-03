import RegisterForm from "../components/RegisterForm";


function Register() {
    return(
        <main className="flex flex-col items-center">
            <div className="mt-5 justify-center">
                <RegisterForm method="register" route="/api/auth/register/"/>
            </div>
        </main>
    ) 
    
}

export default Register;