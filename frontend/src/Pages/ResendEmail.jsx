import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ResendEmail = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);

  const handleResendEmail = async (e) => {
    e.preventDefault();
    if (isCooldown) {
      toast.error("Please wait before requesting a new verification email.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/resend-email`,
        { email }
      );

      toast.success(data.message || "Verification email sent successfully!");

      // Set cooldown period (5 minutes)
      setIsCooldown(true);
      setTimeout(() => setIsCooldown(false), 5 * 60 * 1000); 
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to resend email. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-700">
          Resend Verification Email
        </h2>

        <form className="mt-4" onSubmit={handleResendEmail}>
          <div>
            <label className="block text-gray-600">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded mt-1 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || isCooldown}
            />
          </div>

          <div className="mt-4 text-center">
            <a
              href="#"
              onClick={handleResendEmail}
              className={`text-cyan-600 hover:underline text-sm ${
                loading || isCooldown ? "pointer-events-none text-gray-400" : ""
              }`}
            >
              {loading
                ? "Sending..."
                : isCooldown
                ? "Wait before retrying"
                : "Resend Verification Email"}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResendEmail;
