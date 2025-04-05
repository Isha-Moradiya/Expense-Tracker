import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");
  const [email, setEmail] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification link.");
      toast.error("Invalid verification link.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/auth/verify-email?token=${token}`
        );

        setStatus("success");
        setMessage(data.message);
        toast.success(data.message);

        // Navigate to login page after short delay
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message || "Email verification failed."
        );
        toast.error(
          error.response?.data?.message || "Email verification failed."
        );

        // Extract email from response if available
        if (error.response?.data?.email) {
          setEmail(error.response.data.email);
        }
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
        {status === "loading" && (
          <>
            <div className="relative w-14 h-14 mx-auto">
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-blue-500 w-full h-full rounded-full flex items-center justify-center text-white text-xl font-bold">
                🔄
              </div>
            </div>
            <h2 className="text-xl font-semibold mt-4 text-gray-700">
              Verifying your email...
            </h2>
            <p className="text-sm text-gray-500 mt-2 animate-pulse">
              Please wait while we verify your email...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-green-500 text-4xl">✅</div>
            <h2 className="text-xl font-semibold mt-4 text-green-600">
              Email Verified!
            </h2>
            <p className="text-gray-500 mt-2">{message}</p>
            <p className="text-blue-500 mt-4">Redirecting to login...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-red-500 text-4xl">❌</div>
            <h2 className="text-xl font-semibold mt-4 text-red-600">
              Verification Failed!
            </h2>
            <p className="text-gray-500 mt-2">{message}</p>

            <button
              onClick={() => navigate("/resend-email", { state: { email } })}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
            >
              Resend Verification Email
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
