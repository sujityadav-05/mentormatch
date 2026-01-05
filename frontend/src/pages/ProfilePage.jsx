import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, LogOut, Edit2, Check, X, Star, Users, BookOpen } from "lucide-react";
import SpotlightCard from "../components/SpotlightCard";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { logout, authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    expertise: authUser?.expertise || [],
  });
  const [newExpertise, setNewExpertise] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddExpertise = () => {
    if (newExpertise.trim() && !formData.expertise.includes(newExpertise.trim())) {
      setFormData((prev) => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()],
      }));
      setNewExpertise("");
    }
  };

  const handleRemoveExpertise = (exp) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.filter((e) => e !== exp),
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.log("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: authUser?.fullName || "",
      bio: authUser?.bio || "",
      expertise: authUser?.expertise || [],
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="max-w-4xl mx-auto p-4">
        <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Profile</h1>
              <p className="text-gray-400 mt-1">Manage your profile information</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`btn btn-sm gap-2 ${isEditing ? "btn-warning" : "btn-primary"}`}
            >
              {isEditing ? (
                <>
                  <X size={16} />
                  Cancel
                </>
              ) : (
                <>
                  <Edit2 size={16} />
                  Edit Profile
                </>
              )}
            </button>
          </div>

          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-4 mb-8 pb-8 border-b border-gray-700">
            <div className="relative">
              <img
                src={selectedImg || authUser?.profilePic || "/avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-primary"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-primary hover:bg-primary-focus
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-gray-400">
              {isUpdatingProfile ? "Uploading..." : "Click camera to update photo"}
            </p>
          </div>

          {/* Role Badge */}
          <div className="mb-8 flex justify-center">
            <span
              className={`badge badge-lg ${
                authUser?.role === "mentor" ? "badge-primary" : "badge-secondary"
              }`}
            >
              {authUser?.role?.toUpperCase()}
            </span>
          </div>

          {/* Stats (for mentors) */}
          {authUser?.role === "mentor" && (
            <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b border-gray-700">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Star className="text-yellow-400" size={20} />
                </div>
                <p className="text-2xl font-bold">{authUser?.averageRating || "0"}</p>
                <p className="text-sm text-gray-400">Average Rating</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Users className="text-blue-400" size={20} />
                </div>
                <p className="text-2xl font-bold">{authUser?.totalRatings || "0"}</p>
                <p className="text-sm text-gray-400">Reviews</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <BookOpen className="text-green-400" size={20} />
                </div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-400">Mentees</p>
              </div>
            </div>
          )}

          {/* Form Content */}
          <div className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <User size={16} />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                />
              ) : (
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border border-gray-600">
                  {authUser?.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <Mail size={16} />
                Email Address
              </label>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border border-gray-600 text-gray-400">
                {authUser?.email}
              </p>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">Bio</label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell mentees about yourself..."
                  className="textarea textarea-bordered w-full h-24"
                  maxLength="500"
                />
              ) : (
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border border-gray-600 min-h-12">
                  {authUser?.bio || <span className="text-gray-400">No bio added yet</span>}
                </p>
              )}
              {isEditing && (
                <p className="text-xs text-gray-400">
                  {formData.bio.length}/500 characters
                </p>
              )}
            </div>

            {/* Expertise */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">Areas of Expertise</label>

              {isEditing ? (
                <div className="space-y-3">
                  {/* Add new expertise */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newExpertise}
                      onChange={(e) => setNewExpertise(e.target.value)}
                      placeholder="e.g., React, Node.js, Python..."
                      className="input input-bordered flex-1"
                      onKeyPress={(e) => e.key === "Enter" && handleAddExpertise()}
                    />
                    <button
                      onClick={handleAddExpertise}
                      className="btn btn-primary btn-sm"
                    >
                      Add
                    </button>
                  </div>

                  {/* Display expertise tags */}
                  <div className="flex flex-wrap gap-2">
                    {formData.expertise.map((exp) => (
                      <div
                        key={exp}
                        className="badge badge-primary gap-2 px-3 py-2"
                      >
                        {exp}
                        <button
                          onClick={() => handleRemoveExpertise(exp)}
                          className="hover:text-error"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {authUser?.expertise && authUser.expertise.length > 0 ? (
                    authUser.expertise.map((exp) => (
                      <span key={exp} className="badge badge-primary badge-lg">
                        {exp}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-400">No expertise added yet</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-700">
            {isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="btn btn-outline btn-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isUpdatingProfile}
                  className="btn btn-primary btn-sm gap-2"
                >
                  {isUpdatingProfile ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}

            <button
              className="btn btn-outline btn-sm gap-2 ml-auto"
              onClick={logout}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
};

export default ProfilePage;
