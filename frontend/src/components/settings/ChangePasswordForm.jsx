import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../services/authService";
import { useAuthStore } from "../../store/authStore";

const passwordRules = {
  minLength: 12,
  maxLength: 128,
  hasLowercase: /[a-z]/,
  hasUppercase: /[A-Z]/,
  hasNumber: /[0-9]/,
  hasSpecialChar: /[^A-Za-z0-9]/,
  hasNoWhitespace: /^\S+$/,
};

const EyeIcon = ({ open }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="h-5 w-5"
    aria-hidden="true"
  >
    {open ? (
      <>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="m3 3 18 18" />
        <path d="M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-.58" />
        <path d="M9.88 5.09A10.94 10.94 0 0 1 12 5c6.5 0 10 7 10 7a13.16 13.16 0 0 1-2.17 2.94" />
        <path d="M6.61 6.61C4.62 7.95 3.3 10 2 12c0 0 3.5 7 10 7 2.05 0 3.81-.7 5.29-1.72" />
      </>
    )}
  </svg>
);

function ChangePasswordForm() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (type = "success", title, message) => {
    setToast({
      id: Date.now(),
      type,
      title,
      message,
    });
  };

  const clearToast = () => setToast(null);

  const checklist = useMemo(() => {
    return {
      minLength: newPassword.length >= passwordRules.minLength,
      maxLength: newPassword.length <= passwordRules.maxLength,
      hasLowercase: passwordRules.hasLowercase.test(newPassword),
      hasUppercase: passwordRules.hasUppercase.test(newPassword),
      hasNumber: passwordRules.hasNumber.test(newPassword),
      hasSpecialChar: passwordRules.hasSpecialChar.test(newPassword),
      hasNoWhitespace: passwordRules.hasNoWhitespace.test(newPassword),
      differentFromOld: !!newPassword && !!oldPassword && newPassword !== oldPassword,
    };
  }, [newPassword, oldPassword]);

  const validateFieldLevel = () => {
    const errors = {};

    if (!oldPassword) {
      errors.oldPassword = "Old password is required";
      return errors;
    }

    if (oldPassword.length < 8) {
      errors.oldPassword = "Old password must be at least 8 characters";
      return errors;
    }

    if (!newPassword) {
      errors.newPassword = "New password is required";
      return errors;
    }

    if (newPassword.length < 8) {
      errors.newPassword = "New password must be at least 8 characters";
      return errors;
    }

    if (newPassword.length > 128) {
      errors.newPassword = "New password must not exceed 128 characters";
      return errors;
    }

    if (!passwordRules.hasLowercase.test(newPassword)) {
      errors.newPassword = "New password must include at least one lowercase letter";
      return errors;
    }

    if (!passwordRules.hasUppercase.test(newPassword)) {
      errors.newPassword = "New password must include at least one uppercase letter";
      return errors;
    }

    if (!passwordRules.hasNumber.test(newPassword)) {
      errors.newPassword = "New password must include at least one number";
      return errors;
    }

    if (!passwordRules.hasSpecialChar.test(newPassword)) {
      errors.newPassword = "New password must include at least one special character";
      return errors;
    }

    if (!passwordRules.hasNoWhitespace.test(newPassword)) {
      errors.newPassword = "New password must not contain spaces";
      return errors;
    }

    if (newPassword === oldPassword) {
      errors.newPassword = "New password must be different from the old password";
      return errors;
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password must match new password";
      return errors;
    }

    if (confirmPassword !== newPassword) {
      errors.confirmPassword = "Confirm password must match new password";
      return errors;
    }

    return errors;
  };

  const validateSingleField = (fieldName, value) => {
    if (fieldName === "oldPassword") {
      if (!value) return "Old password is required";
      if (value.length < 8) return "Old password must be at least 8 characters";
      return "";
    }

    if (fieldName === "newPassword") {
      if (!value) return "New password is required";
      if (value.length < 12) return "New password must be at least 12 characters";
      if (value.length > 128) return "New password must not exceed 128 characters";
      if (!passwordRules.hasLowercase.test(value)) return "New password must include at least one lowercase letter";
      if (!passwordRules.hasUppercase.test(value)) return "New password must include at least one uppercase letter";
      if (!passwordRules.hasNumber.test(value)) return "New password must include at least one number";
      if (!passwordRules.hasSpecialChar.test(value)) return "New password must include at least one special character";
      if (!passwordRules.hasNoWhitespace.test(value)) return "New password must not contain spaces";
      if (value === oldPassword) return "New password must be different from the old password";
      return "";
    }

    if (fieldName === "confirmPassword") {
      if (!value) return "Confirm password must match new password";
      if (value !== newPassword) return "Confirm password must match new password";
      return "";
    }

    return "";
  };

  const handleBlur = (fieldName) => {
    const value =
      fieldName === "oldPassword"
        ? oldPassword
        : fieldName === "newPassword"
        ? newPassword
        : confirmPassword;

    const message = validateSingleField(fieldName, value);
    setFieldErrors((prev) => ({
      ...prev,
      [fieldName]: message,
    }));
  };

  const handleChangeOldPassword = (event) => {
    const value = event.target.value;
    setOldPassword(value);

    setFieldErrors((prev) => ({
      ...prev,
      oldPassword: prev.oldPassword ? validateSingleField("oldPassword", value) : "",
      newPassword: prev.newPassword ? validateSingleField("newPassword", newPassword) : prev.newPassword,
    }));
  };

  const handleChangeNewPassword = (event) => {
    const value = event.target.value;
    setNewPassword(value);

    setFieldErrors((prev) => ({
      ...prev,
      newPassword: prev.newPassword ? validateSingleField("newPassword", value) : "",
      confirmPassword: confirmPassword
        ? validateSingleField("confirmPassword", confirmPassword)
        : prev.confirmPassword,
    }));
  };

  const handleChangeConfirmPassword = (event) => {
    const value = event.target.value;
    setConfirmPassword(value);

    setFieldErrors((prev) => ({
      ...prev,
      confirmPassword: prev.confirmPassword ? validateSingleField("confirmPassword", value) : "",
    }));
  };

  const isFormValid =
    oldPassword &&
    newPassword &&
    confirmPassword &&
    oldPassword.length >= 8 &&
    newPassword.length >= 12 &&
    newPassword.length <= 128 &&
    passwordRules.hasLowercase.test(newPassword) &&
    passwordRules.hasUppercase.test(newPassword) &&
    passwordRules.hasNumber.test(newPassword) &&
    passwordRules.hasSpecialChar.test(newPassword) &&
    passwordRules.hasNoWhitespace.test(newPassword) &&
    newPassword !== oldPassword &&
    confirmPassword === newPassword;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = validateFieldLevel();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setIsLoading(true);

      await changePassword({
        oldPassword,
        newPassword,
      });

      showToast("success", "Password changed successfully", "Password changed successfully");

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setFieldErrors({});

      setTimeout(async () => {
        if (typeof logout === "function") {
          await logout();
        }
        navigate("/login", { replace: true });
      }, 900);
    } catch (err) {
      const responseData = err?.response?.data;
      const message = responseData?.message;

      if (message === "Validation failed" && Array.isArray(responseData?.error)) {
        const nextErrors = {};
        responseData.error.forEach((item) => {
          if (item?.field) {
            nextErrors[item.field] = item.message;
          }
        });
        setFieldErrors((prev) => ({ ...prev, ...nextErrors }));
        showToast("error", "Validation failed", "Please check the highlighted fields.");
        return;
      }

      if (message === "Old password is incorrect") {
        setFieldErrors((prev) => ({
          ...prev,
          oldPassword: "Old password is incorrect",
        }));
        showToast("error", "Password change failed", "Old password is incorrect");
        return;
      }

      if (message === "Session expired. Please log in again.") {
        showToast("error", "Session expired", "Session expired. Please log in again.");
        setTimeout(async () => {
          if (typeof logout === "function") {
            await logout();
          }
          navigate("/login", { replace: true });
        }, 800);
        return;
      }

      if (
        message === "Access token required" ||
        message === "Invalid or expired access token"
      ) {
        showToast("error", "Authentication failed", message);
        setTimeout(async () => {
          if (typeof logout === "function") {
            await logout();
          }
          navigate("/login", { replace: true });
        }, 800);
        return;
      }

      if (message === "Too many password change attempts. Please try again later.") {
        showToast("error", "Too many attempts", message);
        return;
      }

      if (message === "Unauthorized") {
        showToast("error", "Unauthorized", message);
        return;
      }

      showToast(
        "error",
        "Password change failed",
        message || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const checklistItems = [
    { key: "minLength", label: "Minimum 12 characters", valid: checklist.minLength },
    { key: "maxLength", label: "Maximum 128 characters", valid: checklist.maxLength },
    { key: "hasLowercase", label: "At least 1 lowercase letter", valid: checklist.hasLowercase },
    { key: "hasUppercase", label: "At least 1 uppercase letter", valid: checklist.hasUppercase },
    { key: "hasNumber", label: "At least 1 number", valid: checklist.hasNumber },
    { key: "hasSpecialChar", label: "At least 1 special character", valid: checklist.hasSpecialChar },
    { key: "hasNoWhitespace", label: "No spaces", valid: checklist.hasNoWhitespace },
    { key: "differentFromOld", label: "Must be different from current password", valid: checklist.differentFromOld },
  ];

  return (
    <>
      <div className="rounded-[28px] border border-[#d9c1bc]/20 bg-[#f8f3ec] p-6 shadow-[0_18px_50px_rgba(61,12,2,0.10)] md:p-8">
        <div className="mx-auto max-w-[540px]">
          <div className="mb-8 text-center">
            <h3 className="text-[34px] font-bold leading-tight text-[#3a0a01]">
              Set New Password
            </h3>
            <p className="mx-auto mt-3 max-w-[360px] text-[14px] leading-6 text-[#54433f]/70">
              Please enter your new password below to secure your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="oldPassword"
                className="mb-2 block text-[13px] font-bold text-[#54433f]"
              >
                Old Password
              </label>
              <div className="flex h-12 items-center rounded-xl border border-[#d9c1bc] bg-[#fbf8f4] px-4 shadow-sm">
                <input
                  id="oldPassword"
                  type={showOld ? "text" : "password"}
                  value={oldPassword}
                  onChange={handleChangeOldPassword}
                  onBlur={() => handleBlur("oldPassword")}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="h-full flex-1 bg-transparent text-[14px] text-[#1d1c18] outline-none placeholder:text-[#8f817c]"
                />
                <button
                  type="button"
                  onClick={() => setShowOld((prev) => !prev)}
                  className="ml-3 text-[#6f5a54] transition hover:text-[#3d0c02]"
                  aria-label={showOld ? "Hide current password" : "Show current password"}
                >
                  <EyeIcon open={showOld} />
                </button>
              </div>
              {fieldErrors.oldPassword ? (
                <p className="mt-2 text-[12px] font-medium text-red-600">
                  {fieldErrors.oldPassword}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="mb-2 block text-[13px] font-bold text-[#54433f]"
              >
                New Password
              </label>
              <div className="flex h-12 items-center rounded-xl border border-[#d9c1bc] bg-[#fbf8f4] px-4 shadow-sm">
                <input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={handleChangeNewPassword}
                  onBlur={() => handleBlur("newPassword")}
                  placeholder="••••••••••••"
                  autoComplete="new-password"
                  className="h-full flex-1 bg-transparent text-[14px] text-[#1d1c18] outline-none placeholder:text-[#8f817c]"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((prev) => !prev)}
                  className="ml-3 text-[#6f5a54] transition hover:text-[#3d0c02]"
                  aria-label={showNew ? "Hide new password" : "Show new password"}
                >
                  <EyeIcon open={showNew} />
                </button>
              </div>
              {fieldErrors.newPassword ? (
                <p className="mt-2 text-[12px] font-medium text-red-600">
                  {fieldErrors.newPassword}
                </p>
              ) : null}

              <div className="mt-4 grid grid-cols-1 gap-2 rounded-2xl border border-[#d9c1bc]/40 bg-white/70 p-4 sm:grid-cols-2">
                {checklistItems.map((item) => (
                  <div
                    key={item.key}
                    className={`flex items-center gap-2 text-[12px] font-medium ${
                      item.valid ? "text-emerald-700" : "text-[#6b5a55]"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                        item.valid
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-[#efe7e1] text-[#8b7771]"
                      }`}
                    >
                      {item.valid ? "✓" : "✗"}
                    </span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-[13px] font-bold text-[#54433f]"
              >
                Confirm New Password
              </label>
              <div className="flex h-12 items-center rounded-xl border border-[#d9c1bc] bg-[#fbf8f4] px-4 shadow-sm">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={handleChangeConfirmPassword}
                  onBlur={() => handleBlur("confirmPassword")}
                  placeholder="••••••••••••"
                  autoComplete="new-password"
                  className="h-full flex-1 bg-transparent text-[14px] text-[#1d1c18] outline-none placeholder:text-[#8f817c]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="ml-3 text-[#6f5a54] transition hover:text-[#3d0c02]"
                  aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                >
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
              {fieldErrors.confirmPassword ? (
                <p className="mt-2 text-[12px] font-medium text-red-600">
                  {fieldErrors.confirmPassword}
                </p>
              ) : null}
            </div>

            <div className="rounded-2xl bg-[#fbf7f0] px-4 py-3 text-[12px] leading-5 text-[#54433f]/80">
              Use at least 8 characters with a mix of letters, numbers, and symbols to
              ensure maximum security for your store access.
            </div>

            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`mt-2 flex h-12 w-full items-center justify-center rounded-xl text-[16px] font-bold shadow-sm transition ${
                !isFormValid || isLoading
                  ? "cursor-not-allowed bg-[#e4d7c7] text-[#9d8d7b]"
                  : "bg-[#feb234] text-[#6d4700] hover:bg-[#f5aa1f]"
              }`}
            >
              {isLoading ? "Changing..." : "Update Password"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/pos")}
              className="block w-full pt-2 text-center text-[13px] font-medium text-[#3d0c02] transition hover:text-[#815500]"
            >
              Cancel and Return to Dashboard
            </button>
          </form>
        </div>
      </div>

      {toast ? (
        <div className="pointer-events-none fixed right-6 top-20 z-[200]">
          <div
            className={`pointer-events-auto min-w-[320px] max-w-[420px] rounded-2xl border px-4 py-4 shadow-2xl backdrop-blur-sm transition-all ${
              toast.type === "success"
                ? "border-emerald-200 bg-white text-[#3d0c02]"
                : "border-red-200 bg-white text-[#3d0c02]"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  toast.type === "success"
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {toast.type === "success" ? "✓" : "!"}
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-extrabold">{toast.title}</h4>
                <p className="mt-1 text-sm text-[#54433f]">{toast.message}</p>
              </div>

              <button
                type="button"
                onClick={clearToast}
                className="text-lg leading-none text-[#3d0c02]/50 hover:text-[#3d0c02]"
              >
                ×
              </button>
            </div>

            <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#f3eee8]">
              <div
                className={`h-full animate-[toastShrink_3s_linear_forwards] rounded-full ${
                  toast.type === "success" ? "bg-emerald-500" : "bg-red-500"
                }`}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default ChangePasswordForm;