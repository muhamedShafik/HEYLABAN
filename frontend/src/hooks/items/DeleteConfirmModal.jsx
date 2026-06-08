// src/components/settings/items/DeleteConfirmModal.jsx
function DeleteConfirmModal({
  open,
  title = "Delete",
  message = "Are you sure?",
  confirmLabel = "Delete",
  loading,
  onClose,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#3a0a01]/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#ded9d3] bg-[#fef9f2] shadow-2xl">
        <div className="p-6">
          <h3 className="text-xl font-extrabold text-[#3d0c02]">{title}</h3>
          <p className="mt-2 text-sm text-[#54433f]">{message}</p>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="h-12 flex-1 rounded-xl border border-[#ded9d3] bg-white font-bold text-[#3d0c02]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className={`h-12 flex-1 rounded-xl font-bold text-white ${
                loading ? "cursor-not-allowed bg-gray-400" : "bg-red-600"
              }`}
            >
              {loading ? "Deleting..." : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;