import { useNavigate } from "react-router-dom";
import ChangePasswordForm from "../components/settings/ChangePasswordForm";

function ChangePasswordPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fef9f2] font-sans text-[#1d1c18]">
      <header className="fixed left-0 top-0 z-50 flex h-[80px] w-full items-center justify-between bg-[#3d0c02] px-6 text-white shadow-md">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/settings")}
            className="flex h-12 w-12 items-center justify-center rounded-full transition hover:bg-white/10"
            aria-label="Back to Settings"
          >
            <span className="text-[28px]">←</span>
          </button>

          <div className="flex flex-col">
            <h1 className="text-[24px] font-bold leading-tight text-white">
              Change Password
            </h1>
            <p className="text-[14px] font-bold text-white/70">
              Update your account password securely
            </p>
          </div>
        </div>
      </header>

      <main className="min-h-screen px-6 pb-6 pt-[100px]">
        <div className="mx-auto max-w-3xl py-10">
          <ChangePasswordForm />
        </div>
      </main>
    </div>
  );
}

export default ChangePasswordPage;