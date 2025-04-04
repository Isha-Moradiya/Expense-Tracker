import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Store/auth";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { storeTokenInLocalStorage } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        formData
      );

      toast.success(
        res.data.message || "Registration successful! Please verify your email."
      );
      setFormData({ name: "", email: "", password: "" });

      // Store token if needed
      storeTokenInLocalStorage(res.data.token);

      // Check if email verification is required
      if (res.data.needsVerification) {
        toast.info("Please verify your email before logging in.");
      } else {
        // If already verified, navigate to login
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);

      // If email already exists, suggest resending verification
      if (errorMessage.includes("Email Already Exists")) {
        toast.info("Check your email for verification or resend verification.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-5xl mb-11 font-bold text-center text-gray-700">
        Expense<span className="text-cyan-600">Tracker</span>
      </h1>
      <div className="bg-white p-5 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mt-2">
          Register
        </h2>
        <p className="text-center text-gray-500 mt-2">Join us today!</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-600 font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium">Password</label>
            <input
              type="password"
              name="password"
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-600 text-white py-3 rounded-lg font-medium mt-4 hover:bg-cyan-700 transition duration-200"
            disabled={loading}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?
          <Link
            to="/login"
            className="text-cyan-600 font-medium hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
