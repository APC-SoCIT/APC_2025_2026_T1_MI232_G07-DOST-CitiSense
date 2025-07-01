import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useState } from "react";

const Form = ({ route, method }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    setisLoading(true)
    e.preventDefault();
    // try {
    //     const res = await api.post(route,{username: username, password: password} )

    //     if (res.status >= 200 && res.status < 300) {
    //         if (method === "login") {
    //             navigate("/home")
    //         } else {
    //             navigate("/login")
    //         }
    //     }
    // } catch (error) {
    //     console.log(error)
    // } finally {
    //     setisLoading(false)
    // }
    try {
        if (method === "login") {
            const res = await api.post("api/auth/login/", {username: username, password: password})
            
            if (res.status >= 200 && res.status < 300) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                navigate("/home")
            } 
        } else if (method === "register") {
            const res = await api.post("api/auth/register", {username: username, password: password})
            
            if (res.status >= 200 && res.status < 300) {
                navigate("/login")
                }   
            }
        } catch (error) {
            console.log("Failed to verify credentials", error);
            alert("Failed to verify credentials", error)
        } finally {
            setisLoading(false)
        }
   
  };
  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{name}</h1>
      <input
        className="form-input"
        type="text"
        value={username}
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="form-input"
        type="password"
        value={password}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="form-button" type="submit" disabled={isLoading}>
        {name}
      </button>
    </form>
  );
};

export default Form;