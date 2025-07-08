import { useEffect, useState } from "react";
import api from "../api";

function Home() {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const getUser = async () => {
        try{
            const res = await api.get("/api/auth/user")
            setUser(res.data.username)
        }catch (error) {
            alert(error)
        }
    }
    getUser();
}, []);


    return(
        <div>{user ?`Welcome ${user}` : "Loading..."}</div>
        
    ) 
}

export default Home;