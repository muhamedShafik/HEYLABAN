import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
  };

  const handleLogin = async (event) => {
  event.preventDefault();
  setLoading(true);
  setError("");

  try {
    const user = await login(form.email, form.password);

    if (user.role === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/pos");
    }
  } catch (err) {
    const message =
      err.response?.data?.message || "Invalid email or password";
    setError(message);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-surface)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#ffddb2] opacity-30 blur-[90px] md:h-96 md:w-96" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#ffdbd2] opacity-30 blur-[90px] md:h-96 md:w-96" />

      <main className="relative z-10 w-full max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl">
        <div className="rounded-3xl bg-white px-5 py-8 shadow-[0_10px_30px_rgba(61,12,2,0.08)] sm:px-8 sm:py-10 md:px-12 md:py-12 lg:px-16 lg:py-14">
          <div className="mx-auto max-w-md">
            <div className="mb-6 text-center md:mb-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-secondary-container)] text-lg font-extrabold text-[var(--color-primary-container)] shadow-sm md:h-20 md:w-20">
                SS
              </div>

              <h1
                className="text-3xl font-extrabold tracking-tight text-[var(--color-primary-container)] sm:text-4xl md:text-5xl"
                style={{ fontFamily: "Hanken Grotesk, sans-serif" }}
              >
                Sugar & Spice POS
              </h1>
            </div>

            <div className="mb-6 text-center md:mb-8">
              <h2
                className="mb-2 text-2xl font-bold text-[var(--color-on-surface)] md:text-3xl"
                style={{ fontFamily: "Hanken Grotesk, sans-serif" }}
              >
                Staff Login
              </h2>

              <p className="mx-auto max-w-sm text-sm leading-6 text-[var(--color-on-surface-variant)] sm:text-base">
                Enter your credentials to access the terminal
              </p>
            </div>

            <form onSubmit={handleLogin} className="flex w-full flex-col gap-5 md:gap-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="px-1 text-sm font-bold text-[var(--color-on-surface-variant)]"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="staff@sugarandspice.com"
                  value={form.email}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl bg-[var(--color-surface-container)] px-4 text-sm text-[var(--color-on-surface)] outline-none focus:ring-2 focus:ring-[var(--color-primary-container)] md:h-13 md:text-base"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="px-1 text-sm font-bold text-[var(--color-on-surface-variant)]"
                >
                  Password
                </label>

                <div className="flex h-12 w-full items-center rounded-xl bg-[var(--color-surface-container)] px-4 md:h-13">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
                    value={form.password}
                    onChange={handleChange}
                    className="flex-1 bg-transparent text-sm text-[var(--color-on-surface)] outline-none md:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="tap-active ml-3 text-sm font-medium text-[var(--color-on-surface-variant)]"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

                           {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="tap-active mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-secondary-container)] px-4 text-sm font-bold text-[var(--color-primary-container)] shadow-sm disabled:opacity-60 md:h-13 md:text-base"
              >
                {loading ? "Authenticating..." : "Login ->"}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3 text-[11px] text-[var(--color-on-surface-variant)] opacity-70 sm:text-xs">
          <span>Terminal 01</span>
          <span className="h-1 w-1 rounded-full bg-[#c9b8b0]" />
          <span>v2.4.0</span>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
