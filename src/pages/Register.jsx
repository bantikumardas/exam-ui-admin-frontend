import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { saveSession } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmShown, setConfirmShown] = useState(false);

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required.";
    else if (form.name.trim().length < 2) errs.name = "Name must be at least 2 characters.";

    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email.";

    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters.";

    if (!form.confirmPassword) errs.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match.";

    return errs;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (apiError) setApiError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setApiError("");
    try {
      const res = await authService.register(form.name.trim(), form.email, form.password);
      saveSession(res.data);
      navigate(res.data.role === "ADMIN" ? "/admin/dashboard" : "/dashboard");
    } catch (err) {
      setApiError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="grid text-center h-screen items-center p-8">
      <div>
        <h3 className="mb-2 text-3xl font-bold text-blue-gray-900">Create Account</h3>
        <p className="mb-16 text-gray-600 font-normal text-[18px]">
          Fill in the details below to register
        </p>

        {apiError && (
          <div className="mx-auto max-w-[24rem] mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 text-left">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-[24rem] text-left">
          <div className="mb-6">
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-900">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500 ${
                errors.name ? "border-red-400" : "border-blue-gray-200"
              }`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900">
              Your Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@mail.com"
              className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500 ${
                errors.email ? "border-red-400" : "border-blue-gray-200"
              }`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-900">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={passwordShown ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="********"
                className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500 ${
                  errors.password ? "border-red-400" : "border-blue-gray-200"
                }`}
              />
              <i
                onClick={() => setPasswordShown((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {passwordShown ? (
                  <EyeIcon className="h-5 w-5" />
                ) : (
                  <EyeSlashIcon className="h-5 w-5" />
                )}
              </i>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-900">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={confirmShown ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="********"
                className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500 ${
                  errors.confirmPassword ? "border-red-400" : "border-blue-gray-200"
                }`}
              />
              <i
                onClick={() => setConfirmShown((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {confirmShown ? (
                  <EyeIcon className="h-5 w-5" />
                ) : (
                  <EyeSlashIcon className="h-5 w-5" />
                )}
              </i>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-gray-900 py-3 text-sm font-semibold uppercase text-white hover:bg-gray-800 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>

          <p className="!mt-4 text-center text-sm font-normal text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-gray-900 underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
