import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo, updateUserInfo, sendOTP, verifyOTP, updatePassword } from "../api";
import { useCsrfToken } from "../utils/csrftoken.jsx";
import { 
  User, 
  Mail, 
  Edit2, 
  Check, 
  X, 
  Save, 
  RefreshCw,
  Shield, 
  UserCircle,
  AtSign,
  Send,
  CheckCircle2,
  AlertCircle,
  KeyRound
} from 'lucide-react';

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
  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: ""
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
        setOriginalUser(data);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    setUpdatedFields((prev) => ({
      ...prev,
      [name]: value !== originalUser[name],
    }));
    if (name === "email" && otpVerified) {
      setShowUpdateButton((prev) => ({ ...prev, email: true }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (field) => {
    setEditMode((prev) => ({
      ...prev,
      [field]: true,
    }));
    if (field === "email") {
      setOtpVerified(false);
      setOtpSent(false);
      setOtp("");
      setShowUpdateButton((prev) => ({ ...prev, email: false }));
    }
  };

  const handleSave = (field) => {
    setEditMode({ ...editMode, [field]: false });
    if (user[field] !== originalUser[field]) {
      setShowUpdateButton({ ...showUpdateButton, [field]: true });
    }
  };

  const handleCancel = (field) => {
    setUser({ ...user, [field]: originalUser[field] });
    setEditMode({ ...editMode, [field]: false });
    setUpdatedFields({ ...updatedFields, [field]: false });
    setShowUpdateButton({ ...showUpdateButton, [field]: false });
    if (field === "password") {
      setPasswords({
        current_password: "",
        new_password: ""
      });
    }
  };

  const handleUpdate = async (field) => {
    if (!user[field] || (field === "email" && !otpVerified)) return;

    try {
      await updateUserInfo(token, { [field]: user[field] });
      setFieldMessages({ ...fieldMessages, [field]: "Updated successfully!" });

      if (field === "email") {
        setOtpVerified(false);
        setOtpSent(false);
        setOtp("");
      }

      setOriginalUser({ ...originalUser, [field]: user[field] });
      setUpdatedFields({ ...updatedFields, [field]: false });
      setShowUpdateButton({ ...showUpdateButton, [field]: false });
    } catch (error) {
      setFieldMessages({ ...fieldMessages, [field]: "Failed to update." });
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwords.current_password || !passwords.new_password) {
      setError("Both current and new passwords are required");
      return;
    }

    try {
      // Send the passwords object directly to the updatePassword function
      await updatePassword(token, {
        current_password: passwords.current_password,
        new_password: passwords.new_password
      });
      setFieldMessages({ ...fieldMessages, password: "Password updated successfully!" });
      setEditMode({ ...editMode, password: false });
      setPasswords({
        current_password: "",
        new_password: ""
      });
      setError("");
    } catch (error) {
      setFieldMessages({ ...fieldMessages, password: "Failed to update password." });
      setError("Failed to update password. Please check your current password and try again.");
    }
  };

  const handleSendOTP = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/send_otp/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
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
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError("Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/verify_otp/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
          <div className="flex items-center space-x-4">
            <UserCircle className="w-16 h-16 text-white" />
            <div>
              <h2 className="text-3xl font-bold text-white">My Profile</h2>
              <p className="text-indigo-100 mt-1">Manage your account information</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-8 mt-6 flex items-center gap-2 text-red-500 bg-red-50 p-4 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="px-8 py-6 space-y-6">
          {/* Username (Non-Editable) */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <User className="w-4 h-4" />
              Username
            </label>
            <div className="p-4 bg-gray-50 rounded-lg text-gray-600 font-medium border border-gray-200">
              {user.username}
            </div>
          </div>

          {/* First Name & Last Name Fields */}
          {["first_name", "last_name"].map((field) => (
            <div key={field}>
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <User className="w-4 h-4" />
                {field.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    name={field}
                    value={user[field]}
                    onChange={handleChange}
                    disabled={!editMode[field]}
                    className={`w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900
                      ${editMode[field] ? 'border-indigo-300 bg-white' : 'border-gray-200 bg-gray-50'}`}
                  />
                </div>
                <div className="flex gap-2">
                  {!editMode[field] ? (
                    <button
                      type="button"
                      onClick={() => handleEdit(field)}
                      className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSave(field)}
                        className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancel(field)}
                        className="flex items-center gap-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </>
                  )}
                  {showUpdateButton[field] && (
                    <button
                      type="button"
                      onClick={() => handleUpdate(field)}
                      className="flex items-center gap-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Update</span>
                    </button>
                  )}
                </div>
              </div>
              {fieldMessages[field] && (
                <p className="flex items-center gap-1 text-green-600 text-sm mt-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {fieldMessages[field]}
                </p>
              )}
            </div>
          ))}

          {/* Email Field with OTP Verification */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <AtSign className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    disabled={!editMode.email}
                    className={`w-full pl-10 p-3 border border-gray-300 rounded-lg bg-white text-gray-900
                      ${editMode.email ? 'border-indigo-300 bg-white' : 'border-gray-200 bg-gray-50'}`}
                  />
                </div>
                <div className="flex gap-2">
                  {!editMode.email ? (
                    <button
                      type="button"
                      onClick={() => handleEdit("email")}
                      className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <>
                      {otpVerified && (
                        <button
                          type="button"
                          onClick={() => handleSave("email")}
                          className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleCancel("email")}
                        className="flex items-center gap-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                      {!otpVerified && (
                        <button
                          type="button"
                          onClick={handleSendOTP}
                          disabled={otpSent || loading}
                          className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                          <Send className="w-4 h-4" />
                          <span>{otpSent ? "OTP Sent" : "Send OTP"}</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {otpSent && !otpVerified && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Shield className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full pl-10 p-3 border border-indigo-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyOTP}
                    disabled={!otp || loading}
                    className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>Verify OTP</span>
                  </button>
                </div>
              )}

              {otpVerified && (
                <p className="flex items-center gap-1 text-green-600 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  OTP Verified Successfully!
                </p>
              )}

              {showUpdateButton.email && (
                <button
                  type="button"
                  onClick={() => handleUpdate("email")}
                  className="flex items-center gap-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Update Email</span>
                </button>
              )}
            </div>
          </div>

          {/* Password Fields */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <Shield className="w-4 h-4" />
              Password
            </label>
            <div className="space-y-3">
              {!editMode.password ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="p-4 bg-gray-50 rounded-lg text-gray-600 font-medium border border-gray-200">
                      ••••••••
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditMode({ ...editMode, password: true })}
                    className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <KeyRound className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="password"
                        name="current_password"
                        placeholder="Current Password"
                        value={passwords.current_password}
                        onChange={handlePasswordChange}
                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <Shield className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="password"
                        name="new_password"
                        placeholder="New Password"
                        value={passwords.new_password}
                        onChange={handlePasswordChange}
                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleUpdatePassword}
                      className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Update Password</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCancel("password")}
                      className="flex items-center gap-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </>
              )}
              {fieldMessages.password && (
                <p className="flex items-center gap-1 text-green-600 text-sm mt-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {fieldMessages.password}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

