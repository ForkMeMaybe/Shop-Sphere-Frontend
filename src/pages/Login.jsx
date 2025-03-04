import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Use login function from AuthContext

  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(credentials.username, credentials.password);
      navigate("/"); // ✅ Redirect to home after successful login
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Login</h2>

        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={credentials.username}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 text-gray-900 rounded-md focus:ring focus:ring-blue-300"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 text-gray-900 rounded-md focus:ring focus:ring-blue-300"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

