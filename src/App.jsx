import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import CreateCodingQuestion from "./pages/CreateCodingQuestion";
import TestViewPage from "./pages/TestViewPage";
import EditTest from "./pages/EditTest";

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "ADMIN") return <Navigate to="/dashboard" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return children;
  return <Navigate to={user?.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"} replace />;
}

function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <div className="grid h-screen place-items-center text-center p-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {user?.name}!</h2>
        <p className="text-gray-600 mb-1">{user?.email}</p>
        <p className="text-sm text-gray-400 mb-8">Role: {user?.role}</p>
        <button
          onClick={logout}
          className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold uppercase text-white hover:bg-gray-800"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/:testId/create/coding-question"
            element={
              <AdminRoute>
                <CreateCodingQuestion />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/:testId/edit/coding-question"
            element={
              <AdminRoute>
                <CreateCodingQuestion />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/:testId/view"
            element={
              <AdminRoute>
                <TestViewPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/:testId/edit"
            element={
              <AdminRoute>
                <EditTest/>
              </AdminRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
