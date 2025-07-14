import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useState } from "react";

const RegisterForm = ({ route, method }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setisLoading(true);
    e.preventDefault();

    try{
      const res = await api.post(route, {email, username, password1, password2})
      navigate("/login")
    } catch (error) {
        alert(error)
        // add a way to show the user error in the frontend and backend, next time
        console.log(error)
    } finally {
        setisLoading(false)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container bg-sky-50 shadow-lg">
      <h1 className="text-lg mb-30">Register Form</h1>
      <input
        className="form-input"
        type="text"
        value={username}
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="form-input"
        type="email"
        value={email}
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="form-input"
        type="password"
        value={password1}
        placeholder="Password"
        onChange={(e) => setPassword1(e.target.value)}
      />
      <input
        className="form-input"
        type="password"
        value={password2}
        placeholder="Password"
        onChange={(e) => setPassword2(e.target.value)}
      />
      <button className="form-button bg-sky-500" type="submit" disabled={isLoading}>
        Register
      </button>
    </form>
  );
};

export default RegisterForm;