import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "./components/Loader";
import ThemeSettings from "./components/ThemeSettings";

function AdminPage() {
  const [tab, setTab] = useState("content");
  const [lessons, setLessons] = useState([]);
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [newLesson, setNewLesson] = useState({ title: "", description: "", level: "A1" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Fetch lessons and users
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        if (tab === "content") {
          const response = await fetch("/api/admin/lessons");
          const data = await response.json();
          // Ensure data is an array
          setLessons(Array.isArray(data) ? data : []);
        }

        if (tab === "users") {
          const response = await fetch("/api/admin/users");
          const data = await response.json();
          // Ensure data is an array
          setUsers(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tab]);

  const addLesson = async (e) => {
    e.preventDefault();
    if (!newLesson.title) return;

    setLoading(true);
    setError("");

    try {
      await fetch("/api/admin/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLesson),
      });

      // Reset form and refresh lessons
      setNewLesson({ title: "", description: "", level: "A1" });

      // Fetch updated lessons
      const response = await fetch("/api/admin/lessons");
      const data = await response.json();
      // Ensure data is an array
      setLessons(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to add lesson. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteLesson = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;

    setLoading(true);
    setError("");

    try {
      await fetch(`/api/admin/lessons/${id}`, {
        method: "DELETE",
      });

      // Fetch updated lessons
      const response = await fetch("/api/admin/lessons");
      const data = await response.json();
      // Ensure data is an array
      setLessons(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to delete lesson. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const promoteUser = async (id) => {
    setLoading(true);
    setError("");

    try {
      await fetch(`/api/admin/users/${id}/promote`, {
        method: "PUT",
      });

      // Fetch updated users
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      // Ensure data is an array
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to promote user. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const demoteUser = async (id) => {
    setLoading(true);
    setError("");

    try {
      await fetch(`/api/admin/users/${id}/demote`, {
        method: "PUT",
      });

      // Fetch updated users
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      // Ensure data is an array
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to demote user. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setLoading(true);
    setError("");

    try {
      await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      // Fetch updated users
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      // Ensure data is an array
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to delete user. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData(e.target);
      const settings = Object.fromEntries(formData);

      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      alert("Settings updated successfully!");
    } catch (err) {
      setError("Failed to update settings. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b mb-6">
          <button
            onClick={() => setTab("content")}
            className={`pb-2 px-1 font-medium text-sm ${tab === "content" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Lessons
          </button>
          <button
            onClick={() => setTab("quizzes")}
            className={`pb-2 px-1 font-medium text-sm ${tab === "quizzes" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Quizzes
          </button>
          <button
            onClick={() => setTab("users")}
            className={`pb-2 px-1 font-medium text-sm ${tab === "users" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Users
          </button>
          <button
            onClick={() => setTab("theme")}
            className={`pb-2 px-1 font-medium text-sm ${tab === "theme" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Theme
          </button>
          <button
            onClick={() => setTab("settings")}
            className={`pb-2 px-1 font-medium text-sm ${tab === "settings" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            System Settings
          </button>
        </div>

        {/* Content Management */}
        {tab === "content" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Lesson</h2>
            <form onSubmit={addLesson} className="mb-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Lesson Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={newLesson.title}
                    onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    placeholder="Lesson Title"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                    Level
                  </label>
                  <select
                    id="level"
                    value={newLesson.level}
                    onChange={(e) => setNewLesson({...newLesson, level: e.target.value})}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  >
                    <option value="A1">A1 - Beginner</option>
                    <option value="A2">A2 - Elementary</option>
                    <option value="B1">B1 - Intermediate</option>
                    <option value="B2">B2 - Upper Intermediate</option>
                    <option value="C1">C1 - Advanced</option>
                    <option value="C2">C2 - Proficiency</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={newLesson.description}
                  onChange={(e) => setNewLesson({...newLesson, description: e.target.value})}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  placeholder="Lesson Description"
                />
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Lesson
                </button>
              </div>
            </form>

            <h2 className="text-xl font-semibold mb-4">Existing Lessons</h2>
            {lessons.length === 0 ? (
              <p className="text-gray-500">No lessons found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Level
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {lessons.map((lesson) => (
                      <tr key={lesson.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lesson.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {lesson.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lesson.level}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => deleteLesson(lesson.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Quizzes Management */}
        {tab === "quizzes" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Quizzes Management</h2>
            <div className="mb-6">
              <h3 className="font-medium mb-2">Add New Quiz</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <input
                    type="text"
                    placeholder="Quiz Title"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  />
                </div>
                <div>
                  <select className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border">
                    <option value="">Select Lesson</option>
                    {lessons.map(lesson => (
                      <option key={lesson.id} value={lesson.id}>
                        {lesson.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Add Quiz
                </button>
              </div>
            </div>

            <h3 className="font-medium mb-2">Existing Quizzes</h3>
            {quizzes.length === 0 ? (
              <p className="text-gray-500">No quizzes found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lesson
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {quizzes.map((quiz) => (
                      <tr key={quiz.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {quiz.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {quiz.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lessons.find(l => l.id === quiz.lessonId)?.title || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* User Management */}
        {tab === "users" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
            {users.length === 0 ? (
              <p className="text-gray-500">No users found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                            {user.isAdmin ? "Admin" : "User"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {!user.isAdmin && (
                            <button
                              onClick={() => promoteUser(user.id)}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              Promote
                            </button>
                          )}
                          {user.isAdmin && (
                            <button
                              onClick={() => demoteUser(user.id)}
                              className="text-yellow-600 hover:text-yellow-900 mr-3"
                            >
                              Demote
                            </button>
                          )}
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Theme Settings */}
        {tab === "theme" && (
          <ThemeSettings />
        )}

        {/* System Settings */}
        {tab === "settings" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">System Settings</h2>
            <form onSubmit={updateSettings} className="space-y-6">
              <div>
                <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  id="siteName"
                  name="siteName"
                  defaultValue="English Station"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                />
              </div>
              <div>
                <label htmlFor="supportEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  id="supportEmail"
                  name="supportEmail"
                  defaultValue="support@englishstation.com"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    id="maintenanceMode"
                    name="maintenanceMode"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 block text-sm text-gray-700">
                    Maintenance Mode
                  </span>
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowRegistration"
                    name="allowRegistration"
                    defaultChecked
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 block text-sm text-gray-700">
                    Allow User Registration
                  </span>
                </label>
              </div>
              <div>
                <label htmlFor="defaultLanguage" className="block text-sm font-medium text-gray-700 mb-1">
                  Default Language
                </label>
                <select
                  id="defaultLanguage"
                  name="defaultLanguage"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div>
                <label htmlFor="defaultLevel" className="block text-sm font-medium text-gray-700 mb-1">
                  Default Level
                </label>
                <select
                  id="defaultLevel"
                  name="defaultLevel"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                >
                  <option value="A1">A1 - Beginner</option>
                  <option value="A2">A2 - Elementary</option>
                  <option value="B1">B1 - Intermediate</option>
                  <option value="B2">B2 - Upper Intermediate</option>
                  <option value="C1">C1 - Advanced</option>
                  <option value="C2">C2 - Proficiency</option>
                </select>
              </div>
              <div>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
