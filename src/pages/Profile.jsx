import { useEffect, useState } from "react";
import api from "../services/api";
import Header from "../components/Header";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/me");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold mb-6">My Profile</h2>

        {loading ? (
          <p className="text-gray-500">Loading profile...</p>
        ) : (
          <div className="bg-white border rounded-lg shadow-sm p-8">
            
            <div className="flex items-center gap-6 mb-8">
              <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-semibold">
                {user.name?.[0] || "U"}
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-800">
                  {user.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Account information
                </p>
              </div>
            </div>

          
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-500">
                  Full Name
                </label>
                <p className="mt-1 font-medium text-gray-800">
                  {user.name}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-500">
                  Email Address
                </label>
                <p className="mt-1 font-medium text-gray-800">
                  {user.email}
                </p>
              </div>
            </div>

           
            <div className="mt-8 text-sm text-gray-400">
              This information is read-only.
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
