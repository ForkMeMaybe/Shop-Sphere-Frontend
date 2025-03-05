import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo, updateUserInfo, sendOTP, verifyOTP } from "../api";
import { useCsrfToken } from "../utils/csrftoken.jsx";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const token = localStorage.getItem("access_token");
  const csrfToken = useCsrfToken();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
  });

  const [originalUser, setOriginalUser] = useState({});
  const [editMode, setEditMode] = useState({});
  const [updatedFields, setUpdatedFields] = useState({});
  const [showUpdateButton, setShowUpdateButton] = useState({});
  const [fieldMessages, setFieldMessages] = useState({});
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUserInfo = async () => {
      if (!token) {
        console.warn("No token found, redirecting to login...");
        navigate("/login");
        return;
      }

      try {
        const data = await getUserInfo();
        setUser(data);
        setOriginalUser(data); // ✅ Store original data for restoring on cancel
      } catch (error) {
        console.error("Failed to load user info", error);
        if (error.message.includes("Failed to refresh token")) {
          console.warn("Logging out user...");
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          navigate("/login");
        }
      }
    };

    loadUserInfo();
  }, [token, navigate]);

  // ✅ Handle input change
  const handleChange = (e) => {
      const { name, value } = e.target;
      setUser({ ...user, [name]: value });

      // ✅ Check if the value is different from the original
      setUpdatedFields((prev) => ({
        ...prev,
        [name]: value !== originalUser[name],
      }));

      // ✅ Show Update button only for email after verification
      if (name === "email" && otpVerified) {
        setShowUpdateButton((prev) => ({ ...prev, email: true }));
      }
    };


  // ✅ Enable edit mode
  const handleEdit = (field) => {
      setEditMode((prev) => ({
        ...prev,
        [field]: true, // ✅ Always allow edit mode
      }));

      // ✅ If editing email, reset OTP verification state
      if (field === "email") {
        setOtpVerified(false);
        setOtpSent(false);
        setOtp("");
        setShowUpdateButton((prev) => ({ ...prev, email: false })); // Hide Update button until OTP is verified again
      }
    };

  // ✅ Save button: Switches back to read-only and enables Update button
  const handleSave = (field) => {
      setEditMode({ ...editMode, [field]: false });

      // ✅ Show the Update button only if the value has changed
      if (user[field] !== originalUser[field]) {
        setShowUpdateButton({ ...showUpdateButton, [field]: true });
      }
    };


  // ✅ Cancel button: Reverts to previous value
  const handleCancel = (field) => {
    setUser({ ...user, [field]: originalUser[field] });
    setEditMode({ ...editMode, [field]: false });
    setUpdatedFields({ ...updatedFields, [field]: false });

    // ✅ Hide the Update button if the value wasn't changed
    setShowUpdateButton({ ...showUpdateButton, [field]: false });
  };

  // ✅ PATCH request on Update button click
  const handleUpdate = async (field) => {
      if (!user[field] || (field === "email" && !otpVerified)) return;

      try {
        await updateUserInfo(token, { [field]: user[field] });
        setFieldMessages({ ...fieldMessages, [field]: "Updated successfully!" });

        // ✅ Reset email verification states after successful update
        if (field === "email") {
          setOtpVerified(false); // Require OTP again
          setOtpSent(false);
          setOtp("");
        }

        // ✅ Once updated, reset original data and hide Update button
        setOriginalUser({ ...originalUser, [field]: user[field] });
        setUpdatedFields({ ...updatedFields, [field]: false });
        setShowUpdateButton({ ...showUpdateButton, [field]: false });
      } catch (error) {
        setFieldMessages({ ...fieldMessages, [field]: "Failed to update." });
      }
    };

  // ✅ Send OTP for email verification
  const handleSendOTP = async () => {
    setLoading(true);
    setError("");

    console.log("Send OTP clicked for:", user.email); // ✅ Debug log

    try {
      const response = await fetch(`${API_BASE_URL}/send_otp/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken, // ✅ Send CSRF token
        },
        credentials: "include",
        body: JSON.stringify({ email: user.email }),
      });

      if (!response.ok) {
        throw new Error("Failed to send OTP");
      }

      setOtpSent(true);
      setOtp("");
      setFieldMessages({ ...fieldMessages, email: "OTP sent. Check your email!" });
      console.log("OTP sent successfully"); // ✅ Debug log
    } catch (err) {
      console.error("Error sending OTP:", err); // ✅ Check for any errors
      setError("Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP before updating email
  const handleVerifyOTP = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/verify_otp/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken, // ✅ Send CSRF token
        },
        credentials: "include",
        body: JSON.stringify({ email: user.email, otp }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to verify OTP");
      }

      setOtpVerified(true);
      setFieldMessages((prev) => ({ ...prev, email: "OTP Verified! ✅" }));
      setEditMode((prev) => ({ ...prev, email: true }));
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError("Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-lg bg-white shadow-lg rounded-lg p-6 mt-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">My Profile</h2>

      {error && <p className="text-center text-red-500 font-semibold">{error}</p>}

      <form className="space-y-6">
        {/* ✅ Username (Non-Editable) */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Username</label>
          <p className="p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed">
            {user.username}
          </p>
        </div>

        {["first_name", "last_name"].map((field) => (
          <div key={field}>
            <label className="block text-gray-700 font-semibold mb-1">
              {field.replace("_", " ").toUpperCase()}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                name={field}
                value={user[field]}
                onChange={handleChange}
                disabled={!editMode[field]}
                className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:ring focus:ring-blue-300"
              />
              {!editMode[field] ? (
                <button
                  type="button"
                  onClick={() => handleEdit(field)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleSave(field)}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCancel(field)}
                    className="bg-gray-400 text-white px-3 py-1 rounded-md hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </>
              )}
              {showUpdateButton[field] && (
                <button
                  type="button"
                  onClick={() => handleUpdate(field)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                >
                  Update
                </button>
              )}
            </div>
            {fieldMessages[field] && <p className="text-green-500 text-sm">{fieldMessages[field]}</p>}
          </div>
        ))}

        {/* ✅ Email Field with OTP Verification */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Email</label>
          <div className="flex items-center space-x-2">
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              disabled={!editMode.email}
              className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:ring focus:ring-blue-300"
            />
            {!editMode.email ? (
              <button
                type="button"
                onClick={() => handleEdit("email")}
                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
              >
                Edit
              </button>
            ) : (
              <>
                {/* ✅ Show Save button ONLY if OTP is verified */}
                {otpVerified && (
                  <button
                    type="button"
                    onClick={() => handleSave("email")}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                  >
                    Save
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleCancel("email")}
                  className="bg-gray-400 text-white px-3 py-1 rounded-md hover:bg-gray-500"
                >
                  Cancel
                </button>
                {!otpVerified && (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={otpSent}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 disabled:opacity-50"
                  >
                    {otpSent ? "OTP Sent" : "Send OTP"}
                  </button>
                )}
              </>
            )}
          </div>

          {/* ✅ Show OTP input and Verify button only when OTP is sent */}
          {otpSent && !otpVerified && (
            <div className="flex items-center space-x-2 mt-2">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:ring focus:ring-blue-300"
              />
              <button
                type="button"
                onClick={handleVerifyOTP}
                disabled={!otp}
                className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 disabled:opacity-50"
              >
                Verify OTP
              </button>
            </div>
          )}

          {/* ✅ Show success message if OTP is verified */}
          {otpVerified && <p className="text-green-500 text-sm mt-2">OTP Verified! ✅</p>}

          {/* ✅ Show Update button after Save is clicked */}
          {showUpdateButton.email && (
            <button
              type="button"
              onClick={() => handleUpdate("email")}
              className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 mt-2"
            >
              Update
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Profile;


