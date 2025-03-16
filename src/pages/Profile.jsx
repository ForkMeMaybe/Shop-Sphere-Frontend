import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo, updateUserInfo, sendOTP, verifyOTP, updatePassword, registerCustomer, getCustomerInfo } from "../api";
import { fetchAddress, addAddress, updateAddress } from "../api";
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
  KeyRound,
  Eye,
  EyeOff,
  Phone,
  Calendar,
  Medal, 
  MapPin, 
  Home, 
  Building, 
  Globe, 
  Flag, 
  FileText
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
  const [customer, setCustomer] = useState({
    phone: "",
    birth_date: "",
    membership: "B" // Default to Bronze
  });
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({ street: "", city: "", state: "", country: "", postal_code: "", address_type: "H", is_default: false });
  const [editAddressId, setEditAddressId] = useState(null);
  const [originalCustomer, setOriginalCustomer] = useState({});
  const [customerEditMode, setCustomerEditMode] = useState(false);
  const [customerMessage, setCustomerMessage] = useState("");

  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current_password: false,
    new_password: false
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
        const userData = await getUserInfo();
        setUser(userData);
        setOriginalUser(userData);
        const customerData = await getCustomerInfo();
        setCustomer(customerData);
        setOriginalCustomer(customerData);
        const addressData = await fetchAddress();
        setAddresses(addressData);

        // Fetch customer info
        try {
          const customerData = await getCustomerInfo();
          setCustomer(customerData);
          setOriginalCustomer(customerData);
        } catch (error) {
          console.warn("No customer profile found", error);
        }
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

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleAddAddress = async () => {
    try {
      const response = await addAddress(newAddress);
      setAddresses([...addresses, response]);
      setNewAddress({ street: "", city: "", state: "", country: "", postal_code: "", address_type: "H", is_default: false });
    } catch (error) {
      setError("Failed to add address");
    }
  };

  const handleEditAddress = (address) => {
    setEditAddressId(address.id);
    setNewAddress(address);
  };

  const handleUpdateAddress = async () => {
    try {
      const response = await updateAddress(editAddressId, newAddress);
      setAddresses(addresses.map((addr) => (addr.id === editAddressId ? response : addr)));
      setEditAddressId(null);
      setNewAddress({ street: "", city: "", state: "", country: "", postal_code: "", address_type: "H", is_default: false });
    } catch (error) {
      setError("Failed to update address");
    }
  };

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

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
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
      setShowPasswords({
        current_password: false,
        new_password: false
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
      setShowPasswords({
        current_password: false,
        new_password: false
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

  // New customer handlers
  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCustomerEdit = () => {
    setCustomerEditMode(true);
  };

  const handleCustomerCancel = () => {
    setCustomer(originalCustomer);
    setCustomerEditMode(false);
    setCustomerMessage("");
  };

  const handleCustomerSave = async () => {
    try {
      await registerCustomer(token, customer);
      setOriginalCustomer(customer);
      setCustomerEditMode(false);
      setCustomerMessage("Customer profile updated successfully!");
    } catch (error) {
      setError("Failed to update customer profile");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
                        type={showPasswords.current_password ? "text" : "password"}
                        name="current_password"
                        placeholder="Current Password"
                        value={passwords.current_password}
                        onChange={handlePasswordChange}
                        className="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current_password')}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current_password ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <Shield className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type={showPasswords.new_password ? "text" : "password"}
                        name="new_password"
                        placeholder="New Password"
                        value={passwords.new_password}
                        onChange={handlePasswordChange}
                        className="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new_password')}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new_password ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
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

          {/* Customer Information Section */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Medal className="w-5 h-5 text-indigo-600" />
              Customer Information
            </h3>

            <div className="space-y-4">
              {customerMessage && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg">
                  <CheckCircle2 className="w-5 h-5" />
                  <p>{customerMessage}</p>
                </div>
              )}

              <div className="space-y-4">
                {/* Phone Number */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={customer.phone}
                      onChange={handleCustomerChange}
                      disabled={!customerEditMode}
                      className={`w-full pl-10 p-3 border rounded-lg text-gray-900 ${
                        customerEditMode 
                          ? 'border-indigo-300 bg-white' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                {/* Birth Date */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      name="birth_date"
                      value={customer.birth_date}
                      onChange={handleCustomerChange}
                      disabled={!customerEditMode}
                      className={`w-full pl-10 p-3 border rounded-lg text-gray-900 ${
                        customerEditMode 
                          ? 'border-indigo-300 bg-white' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                </div>

                {/* Membership */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Membership</label>
                  <div className="relative">
                    <Medal className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <select
                      name="membership"
                      value={customer.membership}
                      onChange={handleCustomerChange}
                      disabled={!customerEditMode}
                      className={`w-full pl-10 p-3 border rounded-lg appearance-none text-gray-900 ${
                        customerEditMode 
                          ? 'border-indigo-300 bg-white' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <option value="B">Bronze</option>
                      <option value="S">Silver</option>
                      <option value="G">Gold</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  {!customerEditMode ? (
                    <button
                      type="button"
                      onClick={handleCustomerEdit}
                      className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit Customer Info</span>
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleCustomerSave}
                        className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCustomerCancel}
                        className="flex items-center gap-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </>
                  )}
                </div>
                  <div className="px-8 py-6 space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-indigo-600" /> Address Information
                      </h3>
                      {addresses.map((address) => (
                          <div key={address.id} className="p-4 border rounded-lg bg-gray-50">
                          <p className="text-gray-700 font-medium"><Home className="w-4 h-4 inline" /> {address.street}, {address.city}, {address.state}, {address.country} - {address.postal_code}</p>
                          <p className="text-sm text-gray-500">{address.address_type === "H" ? "Home" : "Work"}</p>
                          <button
                          onClick={() => handleEditAddress(address)}
                          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >Edit</button>
                          </div>
                      ))}

                      <h3 className="text-lg font-semibold text-gray-900">Add / Edit Address</h3>
                      <div className="space-y-2">
                      <input type="text" name="street" placeholder="Street" value={newAddress.street} onChange={handleAddressChange} className="w-full p-2 border rounded text-gray-900" />
                      <input type="text" name="city" placeholder="City" value={newAddress.city} onChange={handleAddressChange} className="w-full p-2 border rounded text-gray-900" />
                      <input type="text" name="state" placeholder="State" value={newAddress.state} onChange={handleAddressChange} className="w-full p-2 border rounded text-gray-900" />
                      <input type="text" name="country" placeholder="Country" value={newAddress.country} onChange={handleAddressChange} className="w-full p-2 border rounded text-gray-900" />
                      <input type="text" name="postal_code" placeholder="Postal Code" value={newAddress.postal_code} onChange={handleAddressChange} className="w-full p-2 border rounded text-gray-900" />
                      <select name="address_type" value={newAddress.address_type} onChange={handleAddressChange} className="w-full p-2 border rounded text-gray-900">
                      <option value="H">Home</option>
                      <option value="W">Work</option>
                      </select>
                      <button onClick={editAddressId ? handleUpdateAddress : handleAddAddress} className="w-full p-2 mt-2 bg-green-600 text-white rounded hover:bg-green-700">
                      {editAddressId ? "Update Address" : "Add Address"}
                      </button>
                      </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

























// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { 
//   getUserInfo, 
//   updateUserInfo, 
//   sendOTP, 
//   verifyOTP, 
//   updatePassword, 
//   registerCustomer, 
//   getCustomerInfo,
//   fetchAddress,
//   addAddress,
//   updateAddress 
// } from "../api";
// import { useCsrfToken } from "../utils/csrftoken.jsx";
// import { 
//   User, 
//   Mail, 
//   Edit2, 
//   Check, 
//   X, 
//   Save, 
//   RefreshCw,
//   Shield, 
//   UserCircle,
//   AtSign,
//   Send,
//   CheckCircle2,
//   AlertCircle,
//   KeyRound,
//   Eye,
//   EyeOff,
//   Phone,
//   Calendar,
//   Medal,
//   MapPin,
//   Home,
//   Building,
//   Globe,
//   Plus,
//   Flag,
//   FileText,
//   Star
// } from 'lucide-react';
//
// const API_BASE_URL = import.meta.env.VITE_API_URL;
//
// const Profile = () => {
//   // [All state and handlers remain exactly the same]
//
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Profile Header Card */}
//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
//           <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-12">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-6">
//                 <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
//                   <UserCircle className="w-20 h-20 text-white" />
//                 </div>
//                 <div>
//                   <h2 className="text-4xl font-bold text-white mb-2">{user.first_name || 'My'} Profile</h2>
//                   <p className="text-indigo-100 text-lg">Manage your account settings and preferences</p>
//                 </div>
//               </div>
//               {customer.membership && (
//                 <div className="bg-white/10 px-6 py-4 rounded-xl backdrop-blur-sm">
//                   <div className="flex items-center gap-2">
//                     <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
//                     <span className="text-white font-semibold text-lg">
//                       {customer.membership === 'G' ? 'Gold' : customer.membership === 'S' ? 'Silver' : 'Bronze'} Member
//                     </span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//
//           {error && (
//             <div className="mx-8 -mt-6 flex items-center gap-2 text-red-500 bg-red-50 p-4 rounded-xl border border-red-100 transform -translate-y-4 shadow-sm">
//               <AlertCircle className="w-5 h-5" />
//               <p className="font-medium">{error}</p>
//             </div>
//           )}
//
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
//             {/* Left Column - Basic Info */}
//             <div className="space-y-6">
//               <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
//                 <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                   <User className="w-5 h-5 text-indigo-600" />
//                   Basic Information
//                 </h3>
//                 
//                 {/* Username */}
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-600 mb-2">Username</label>
//                   <div className="p-4 bg-white rounded-lg text-gray-700 font-medium border border-gray-200 shadow-sm">
//                     {user.username}
//                   </div>
//                 </div>
//
//                 {/* First Name & Last Name Fields */}
//                 {["first_name", "last_name"].map((field) => (
//                   <div key={field} className="mb-4">
//                     <label className="block text-sm font-medium text-gray-600 mb-2">
//                       {field.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
//                     </label>
//                     <div className="flex items-center gap-2">
//                       <div className="flex-1 relative">
//                         <input
//                           type="text"
//                           name={field}
//                           value={user[field]}
//                           onChange={handleChange}
//                           disabled={!editMode[field]}
//                           className={`w-full p-3 border rounded-lg bg-white text-gray-900 shadow-sm
//                             ${editMode[field] ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-gray-200'}`}
//                         />
//                       </div>
//                       <div className="flex gap-2">
//                         {!editMode[field] ? (
//                           <button
//                             type="button"
//                             onClick={() => handleEdit(field)}
//                             className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-sm"
//                           >
//                             <Edit2 className="w-4 h-4" />
//                             <span>Edit</span>
//                           </button>
//                         ) : (
//                           <>
//                             <button
//                               type="button"
//                               onClick={() => handleSave(field)}
//                               className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-sm"
//                             >
//                               <Save className="w-4 h-4" />
//                               <span>Save</span>
//                             </button>
//                             <button
//                               type="button"
//                               onClick={() => handleCancel(field)}
//                               className="flex items-center gap-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all transform hover:scale-105 shadow-sm"
//                             >
//                               <X className="w-4 h-4" />
//                               <span>Cancel</span>
//                             </button>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                     {fieldMessages[field] && (
//                       <p className="flex items-center gap-1 text-green-600 text-sm mt-2">
//                         <CheckCircle2 className="w-4 h-4" />
//                         {fieldMessages[field]}
//                       </p>
//                     )}
//                   </div>
//                 ))}
//               </div>
//
//               {/* Security Section */}
//               <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
//                 <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                   <Shield className="w-5 h-5 text-indigo-600" />
//                   Security
//                 </h3>
//
//                 {/* Email Field */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-600 mb-2">Email Address</label>
//                   <div className="space-y-3">
//                     <div className="flex items-center gap-2">
//                       <div className="flex-1 relative">
//                         <AtSign className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
//                         <input
//                           type="email"
//                           name="email"
//                           value={user.email}
//                           onChange={handleChange}
//                           disabled={!editMode.email}
//                           className={`w-full pl-10 p-3 border rounded-lg bg-white text-gray-900 shadow-sm
//                             ${editMode.email ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-gray-200'}`}
//                         />
//                       </div>
//                       <div className="flex gap-2">
//                         {!editMode.email ? (
//                           <button
//                             type="button"
//                             onClick={() => handleEdit("email")}
//                             className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-sm"
//                           >
//                             <Edit2 className="w-4 h-4" />
//                             <span>Edit</span>
//                           </button>
//                         ) : (
//                           <>
//                             {otpVerified && (
//                               <button
//                                 type="button"
//                                 onClick={() => handleSave("email")}
//                                 className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-sm"
//                               >
//                                 <Save className="w-4 h-4" />
//                                 <span>Save</span>
//                               </button>
//                             )}
//                             <button
//                               type="button"
//                               onClick={() => handleCancel("email")}
//                               className="flex items-center gap-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all transform hover:scale-105 shadow-sm"
//                             >
//                               <X className="w-4 h-4" />
//                               <span>Cancel</span>
//                             </button>
//                             {!otpVerified && (
//                               <button
//                                 type="button"
//                                 onClick={handleSendOTP}
//                                 disabled={otpSent || loading}
//                                 className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-sm disabled:opacity-50"
//                               >
//                                 <Send className="w-4 h-4" />
//                                 <span>{otpSent ? "OTP Sent" : "Send OTP"}</span>
//                               </button>
//                             )}
//                           </>
//                         )}
//                       </div>
//                     </div>
//
//                     {otpSent && !otpVerified && (
//                       <div className="flex items-center gap-2">
//                         <div className="flex-1 relative">
//                           <Shield className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
//                           <input
//                             type="text"
//                             placeholder="Enter OTP"
//                             value={otp}
//                             onChange={(e) => setOtp(e.target.value)}
//                             className="w-full pl-10 p-3 border border-indigo-300 rounded-lg bg-white text-gray-900 ring-2 ring-indigo-100 shadow-sm"
//                           />
//                         </div>
//                         <button
//                           type="button"
//                           onClick={handleVerifyOTP}
//                           disabled={!otp || loading}
//                           className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-sm disabled:opacity-50"
//                         >
//                           <Check className="w-4 h-4" />
//                           <span>Verify</span>
//                         </button>
//                       </div>
//                     )}
//
//                     {otpVerified && (
//                       <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-center gap-2 text-green-600">
//                         <CheckCircle2 className="w-5 h-5" />
//                         <p className="font-medium">OTP Verified Successfully!</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//
//                 {/* Password Field */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-2">Password</label>
//                   <div className="space-y-3">
//                     {!editMode.password ? (
//                       <div className="flex items-center gap-2">
//                         <div className="flex-1">
//                           <div className="p-4 bg-white rounded-lg text-gray-600 font-medium border border-gray-200 shadow-sm">
//                             ••••••••
//                           </div>
//                         </div>
//                         <button
//                           type="button"
//                           onClick={() => setEditMode({ ...editMode, password: true })}
//                           className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-sm"
//                         >
//                           <Edit2 className="w-4 h-4" />
//                           <span>Change</span>
//                         </button>
//                       </div>
//                     ) : (
//                       <>
//                         <div className="flex items-center gap-2">
//                           <div className="flex-1 relative">
//                             <KeyRound className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
//                             <input
//                               type={showPasswords.current_password ? "text" : "password"}
//                               name="current_password"
//                               placeholder="Current Password"
//                               value={passwords.current_password}
//                               onChange={handlePasswordChange}
//                               className="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-sm"
//                             />
//                             <button
//                               type="button"
//                               onClick={() => togglePasswordVisibility('current_password')}
//                               className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
//                             >
//                               {showPasswords.current_password ? (
//                                 <EyeOff className="w-4 h-4" />
//                               ) : (
//                                 <Eye className="w-4 h-4" />
//                               )}
//                             </button>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <div className="flex-1 relative">
//                             <Shield className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
//                             <input
//                               type={showPasswords.new_password ? "text" : "password"}
//                               name="new_password"
//                               placeholder="New Password"
//                               value={passwords.new_password}
//                               onChange={handlePasswordChange}
//                               className="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-sm"
//                             />
//                             <button
//                               type="button"
//                               onClick={() => togglePasswordVisibility('new_password')}
//                               className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
//                             >
//                               {showPasswords.new_password ? (
//                                 <EyeOff className="w-4 h-4" />
//                               ) : (
//                                 <Eye className="w-4 h-4" />
//                               )}
//                             </button>
//                           </div>
//                         </div>
//                         <div className="flex gap-2">
//                           <button
//                             type="button"
//                             onClick={handleUpdatePassword}
//                             className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-sm"
//                           >
//                             <Save className="w-4 h-4" />
//                             <span>Update Password</span>
//                           </button>
//                           <button
//                             type="button"
//                             onClick={() => handleCancel("password")}
//                             className="flex items-center gap-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all transform hover:scale-105 shadow-sm"
//                           >
//                             <X className="w-4 h-4" />
//                             <span>Cancel</span>
//                           </button>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//
//             {/* Right Column - Customer Info & Addresses */}
//             <div className="space-y-6">
//               {/* Customer Information */}
//               <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
//                 <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                   <Medal className="w-5 h-5 text-indigo-600" />
//                   Customer Information
//                 </h3>
//
//                 {customerMessage && (
//                   <div className="mb-4 flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg border border-green-100">
//                     <CheckCircle2 className="w-5 h-5" />
//                     <p className="font-medium">{customerMessage}</p>
//                   </div>
//                 )}
//
//                 <div className="space-y-4">
//                   {/* Phone Number */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-2">Phone Number</label>
//                     <div className="relative">
//                       <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                       <input
//                         type="tel"
//                         name="phone"
//                         value={customer.phone}
//                         onChange={handleCustomerChange}
//                         disabled={!customerEditMode}
//                         className={`w-full pl-10 p-3 border rounded-lg text-gray-900 shadow-sm ${
//                           customerEditMode 
//                             ? 'border-indigo-300 ring-2 ring-indigo-100' 
//                             : 'border-gray-200'
//                         }`}
//                         placeholder="Enter phone number"
//                       />
//                     </div>
//                   </div>
//
//                   {/* Birth Date */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-2">Birth Date</label>
//                     <div className="relative">
//                       <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                       <input
//                         type="date"
//                         name="birth_date"
//                         value={customer.birth_date}
//                         onChange={handleCustomerChange}
//                         disabled={!customerEditMode}
//                         className={`w-full pl-10 p-3 border rounded-lg text-gray-900 shadow-sm ${
//                           customerEditMode 
//                             ? 'border-indigo-300 ring-2 ring-indigo-100' 
//                             : 'border-gray-200'
//                         }`}
//                       />
//                     </div>
//                   </div>
//
//                   {/* Membership */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-2">Membership</label>
//                     <div className="relative">
//                       <Medal className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                       <select
//                         name="membership"
//                         value={customer.membership}
//                         onChange={handleCustomerChange}
//                         disabled={!customerEditMode}
//                         className={`w-full pl-10 p-3 border rounded-lg appearance-none text-gray-900 shadow-sm ${
//                           customerEditMode 
//                             ? 'border-indigo-300 ring-2 ring-indigo-100' 
//                             : 'border-gray-200'
//                         }`}
//                       >
//                         <option value="B">Bronze</option>
//                         <option value="S">Silver</option>
//                         <option value="G">Gold</option>
//                       </select>
//                     </div>
//                   </div>
//
//                   <div className="flex gap-2 pt-2">
//                     {!customerEditMode ? (
//                       <button
//                         type="button"
//                         onClick={handleCustomerEdit}
//                         className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-sm"
//                       >
//                         <Edit2 className="w-4 h-4" />
//                         <span>Edit Customer Info</span>
//                       </button>
//                     ) : (
//                       <>
//                         <button
//                           type="button"
//                           onClick={handleCustomerSave}
//                           className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-sm"
//                         >
//                           <Save className="w-4 h-4" />
//                           <span>Save Changes</span>
//                         </button>
//                         <button
//                           type="button"
//                           onClick={handleCustomerCancel}
//                           className="flex items-center gap-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all transform hover:scale-105 shadow-sm"
//                         >
//                           <X className="w-4 h-4" />
//                           <span>Cancel</span>
//                         </button>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>
//
//               {/* Addresses */}
//               <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
//                     <MapPin className="w-5 h-5 text-indigo-600" />
//                     Addresses
//                   </h3>
//                   {!showAddressForm && (
//                     <button
//                       onClick={() => {
//                         setShowAddressForm(true);
//                         setEditingAddressId(null);
//                         setAddressFormData({
//                           street: "",
//                           city: "",
//                           state: "",
//                           country: "",
//                           postal_code: "",
//                           address_type: "H",
//                           is_default: false
//                         });
//                       }}
//                       className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-sm"
//                     >
//                       <Plus className="w-4 h-4" />
//                       <span>Add Address</span>
//                     </button>
//                   )}
//                 </div>
//
//                 {showAddressForm && (
//                   <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
//                     <h4 className="text-lg font-semibold text-gray-900 mb-4">
//                       {editingAddressId ? 'Edit Address' : 'Add New Address'}
//                     </h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-2">Street Address</label>
//                         <div className="relative">
//                           <Home className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                           <input
//                             type="text"
//                             name="street"
//                             value={addressFormData.street}
//                             onChange={handleAddressChange}
//                             className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
//                             placeholder="Enter street address"
//                           />
//                         </div>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-2">City</label>
//                         <div className="relative">
//                           <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                           <input
//                             type="text"
//                             name="city"
//                             value={addressFormData.city}
//                             onChange={handleAddressChange}
//                             className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
//                             placeholder="Enter city"
//                           />
//                         </div>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-2">State</label>
//                         <div className="relative">
//                           <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                           <input
//                             type="text"
//                             name="state"
//                             value={addressFormData.state}
//                             onChange={handleAddressChange}
//                             className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
//                             placeholder="Enter state"
//                           />
//                         </div>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-2">Country</label>
//                         <div className="relative">
//                           <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                           <input
//                             type="text"
//                             name="country"
//                             value={addressFormData.country}
//                             onChange={handleAddressChange}
//                             className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
//                             placeholder="Enter country"
//                           />
//                         </div>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-2">Postal Code</label>
//                         <div className="relative">
//                           <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                           <input
//                             type="text"
//                             name="postal_code"
//                             value={addressFormData.postal_code}
//                             onChange={handleAddressChange}
//                             className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
//                             placeholder="Enter postal code"
//                           />
//                         </div>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-2">Address Type</label>
//                         <div className="relative">
//                           <Home className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                           <select
//                             name="address_type"
//                             value={addressFormData.address_type}
//                             onChange={handleAddressChange}
//                             className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
//                           >
//                             <option value="H">Home</option>
//                             <option value="W">Work</option>
//                           </select>
//                         </div>
//                       </div>
//                     </div>
//
//                     <div className="flex gap-2 mt-6">
//                       <button
//                         onClick={handleAddressSubmit}
//                         className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-sm"
//                       >
//                         <Save className="w-4 h-4" />
//                         <span>{editingAddressId ? 'Update' : 'Save'} Address</span>
//                       </button>
//                       <button
//                         onClick={() => {
//                           setShowAddressForm(false);
//                           setEditingAddressId(null);
//                           setAddressFormData({
//                             street: "",
//                             city: "",
//                             state: "",
//                             country: "",
//                             postal_code: "",
//                             address_type: "H",
//                             is_default: false
//                           });
//                         }}
//                         className="flex items-center gap-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all transform hover:scale-105 shadow-sm"
//                       >
//                         <X className="w-4 h-4" />
//                         <span>Cancel</span>
//                       </button>
//                     </div>
//                   </div>
//                 )}
//
//                 {/* Address List */}
//                 <div className="space-y-4">
//                   {addresses.map((address) => (
//                     <div
//                       key={address.id}
//                       className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all transform hover:scale-[1.02]"
//                     >
//                       <div className="flex justify-between items-start">
//                         <div className="flex items-start gap-3">
//                           <div className={`p-2 rounded-lg ${
//                             address.address_type === "H" 
//                               ? "bg-indigo-100 text-indigo-600" 
//                               : "bg-purple-100 text-purple-600"
//                           }`}>
//                             <Home className="w-5 h-5" />
//                           </div>
//                           <div>
//                             <div className="flex items-center gap-2 mb-1">
//                               <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
//                                 address.address_type === "H"
//                                   ? "bg-indigo-100 text-indigo-700"
//                                   : "bg-purple-100 text-purple-700"
//                               }`}>
//                                 {address.address_type === "H" ? "Home" : "Work"}
//                               </span>
//                             </div>
//                             <p className="text-gray-900 font-medium">{address.street}</p>
//                             <p className="text-gray-600">
//                               {address.city}, {address.state} {address.postal_code}
//                             </p>
//                             <p className="text-gray-600">{address.country}</p>
//                           </div>
//                         </div>
//                         <button
//                           onClick={() => handleEditAddress(address)}
//                           className="text-indigo-600 hover:text-indigo-700 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
//                         >
//                           <Edit2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default Profile;
