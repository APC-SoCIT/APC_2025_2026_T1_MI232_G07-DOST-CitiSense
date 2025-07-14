import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useState } from "react";

const LoginForm = ({ route, method }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setisLoading(true);
    e.preventDefault();

    try{
      const res = await api.post(route, {username, password})  
      localStorage.setItem(ACCESS_TOKEN, res.data.access)
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
      navigate("/")
    } catch (error) {
        alert(error.response.data.detail)
        console.log(error)
    } finally {
        setisLoading(false)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container bg-sky-50 shadow-lg">
      <h1 className="text-lg mb-30">Login Form</h1>
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
      <button className="form-button bg-sky-500" type="submit" disabled={isLoading}>
        Login
      </button>
    </form>
  );
};

export default LoginForm;