// src/components/settings/items/ItemForm.jsx
import { useEffect, useMemo, useState } from "react";

const initialItemState = {
  categoryId: "",
  name: "",
  description: "",
  price: "",
  sortOrder: "",
};

const initialCategoryState = {
  name: "",
  sortOrder: "",
};

function ItemForm({
  categories,
  editingItem,
  itemLoading,
  categoryLoading,
  onSubmitItem,
  onCancelEdit,
  onCreateCategory,
}) {
  const [form, setForm] = useState(initialItemState);
  const [errors, setErrors] = useState({});
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryForm, setCategoryForm] = useState(initialCategoryState);
  const [categoryErrors, setCategoryErrors] = useState({});

  useEffect(() => {
    if (editingItem) {
      setForm({
        categoryId: editingItem.categoryId || "",
        name: editingItem.name || "",
        description: editingItem.description || "",
        price: String(editingItem.price ?? ""),
        sortOrder:
          editingItem.sortOrder === null || editingItem.sortOrder === undefined
            ? ""
            : String(editingItem.sortOrder),
      });
      setErrors({});
      return;
    }

    setForm((prev) => ({
      ...initialItemState,
      categoryId: prev.categoryId || categories[0]?.id || "",
    }));
    setErrors({});
  }, [editingItem, categories]);

  const categoryOptions = useMemo(
    () =>
      (categories || []).map((category) => ({
        id: category.id,
        name: category.name,
        isActive: category.isActive !== false,
      })),
    [categories]
  );

  const validateItem = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Item name is required.";
    } else if (form.name.trim().length > 255) {
      nextErrors.name = "Item name must be 255 characters or less.";
    }

    if (form.description && form.description.length > 1000) {
      nextErrors.description = "Description must be 1000 characters or less.";
    }

    if (form.price === "" || Number.isNaN(Number(form.price))) {
      nextErrors.price = "Price is required.";
    } else if (Number(form.price) < 0) {
      nextErrors.price = "Price must be 0 or more.";
    }

    if (form.sortOrder !== "" && Number.isNaN(Number(form.sortOrder))) {
      nextErrors.sortOrder = "Sort order must be a valid number.";
    }

    if (!form.categoryId) {
      nextErrors.categoryId = "Please select a category.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateCategory = () => {
    const nextErrors = {};

    if (!categoryForm.name.trim()) {
      nextErrors.name = "Category name is required.";
    } else if (categoryForm.name.trim().length > 255) {
      nextErrors.name = "Category name must be 255 characters or less.";
    }

    if (
      categoryForm.sortOrder !== "" &&
      Number.isNaN(Number(categoryForm.sortOrder))
    ) {
      nextErrors.sortOrder = "Sort order must be a valid number.";
    }

    setCategoryErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleItemSubmit = (e) => {
    e.preventDefault();
    if (!validateItem()) return;

    onSubmitItem({
  categoryId: form.categoryId || null,
  name: form.name.trim(),
  description: form.description.trim() || null,
  price: Number(form.price),
  sortOrder: form.sortOrder === "" ? 0 : Number(form.sortOrder),
});
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (!validateCategory()) return;

    onCreateCategory(
      {
        name: categoryForm.name.trim(),
        sortOrder:
          categoryForm.sortOrder === "" ? null : Number(categoryForm.sortOrder),
      },
      {
        onSuccess: (createdCategory) => {
          setCategoryForm(initialCategoryState);
          setCategoryErrors({});
          setShowCategoryForm(false);
          if (createdCategory?.id) {
            setForm((prev) => ({ ...prev, categoryId: createdCategory.id }));
          }
        },
      }
    );
  };

  return (
    <div className="rounded-2xl border border-[#ded9d3] bg-white p-5 shadow-sm">
      <div className="border-b border-[#ded9d3] pb-4">
        <h2 className="text-2xl font-extrabold text-[#3d0c02]">
          {editingItem ? "Edit Item" : "Add New Item"}
        </h2>
        <p className="mt-1 text-sm text-[#54433f]">
          Create products, update pricing, and manage category assignments.
        </p>
      </div>

      <form onSubmit={handleItemSubmit} className="mt-5 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-bold text-[#3d0c02]">
            Category
          </label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}
            className="h-11 w-full rounded-xl border border-[#ded9d3] bg-[#fef9f2] px-3 outline-none focus:border-[#E8A020]"
          >
            <option value="">Select category</option>
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}{category.isActive ? "" : " (Inactive)"}
              </option>
            ))}
          </select>
          {errors.categoryId ? (
            <p className="mt-1 text-xs font-bold text-red-600">{errors.categoryId}</p>
          ) : null}
        </div>

        <div className="flex items-center justify-between rounded-xl border border-dashed border-[#ded9d3] bg-[#f8f3ec]/50 p-3">
          <div>
            <p className="text-sm font-bold text-[#3d0c02]">Need a new category?</p>
            <p className="text-xs text-[#54433f]">Create it here without leaving this page.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCategoryForm((prev) => !prev)}
            className="rounded-lg bg-[#E8A020] px-3 py-2 text-xs font-bold text-white"
          >
            {showCategoryForm ? "Close" : "Create Category"}
          </button>
        </div>

        {showCategoryForm ? (
          <div className="space-y-3 rounded-xl border border-[#ded9d3] bg-[#f8f3ec]/40 p-4">
            <div>
              <label className="mb-1 block text-sm font-bold text-[#3d0c02]">
                Category Name
              </label>
              <input
                type="text"
                value={categoryForm.name}
                onChange={(e) =>
                  setCategoryForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Example: Cakes"
                className="h-11 w-full rounded-xl border border-[#ded9d3] bg-white px-3 outline-none focus:border-[#E8A020]"
              />
              {categoryErrors.name ? (
                <p className="mt-1 text-xs font-bold text-red-600">{categoryErrors.name}</p>
              ) : null}
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-[#3d0c02]">
                Sort Order
              </label>
              <input
                type="number"
                value={categoryForm.sortOrder}
                onChange={(e) =>
                  setCategoryForm((prev) => ({ ...prev, sortOrder: e.target.value }))
                }
                placeholder="0"
                className="h-11 w-full rounded-xl border border-[#ded9d3] bg-white px-3 outline-none focus:border-[#E8A020]"
              />
              {categoryErrors.sortOrder ? (
                <p className="mt-1 text-xs font-bold text-red-600">
                  {categoryErrors.sortOrder}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={handleCategorySubmit}
              disabled={categoryLoading}
              className={`h-11 w-full rounded-xl text-sm font-bold text-white ${
                categoryLoading ? "cursor-not-allowed bg-gray-400" : "bg-[#3d0c02]"
              }`}
            >
              {categoryLoading ? "Saving Category..." : "Save Category"}
            </button>
          </div>
        ) : null}

        <div>
          <label className="mb-1 block text-sm font-bold text-[#3d0c02]">
            Item Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Example: Belgian Truffle Cake"
            className="h-11 w-full rounded-xl border border-[#ded9d3] bg-[#fef9f2] px-3 outline-none focus:border-[#E8A020]"
          />
          {errors.name ? (
            <p className="mt-1 text-xs font-bold text-red-600">{errors.name}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold text-[#3d0c02]">
            Description
          </label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Optional product description"
            className="w-full rounded-xl border border-[#ded9d3] bg-[#fef9f2] p-3 outline-none focus:border-[#E8A020]"
          />
          {errors.description ? (
            <p className="mt-1 text-xs font-bold text-red-600">{errors.description}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-bold text-[#3d0c02]">
              Price
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
              placeholder="0.00"
              className="h-11 w-full rounded-xl border border-[#ded9d3] bg-[#fef9f2] px-3 outline-none focus:border-[#E8A020]"
            />
            {errors.price ? (
              <p className="mt-1 text-xs font-bold text-red-600">{errors.price}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-[#3d0c02]">
              Sort Order
            </label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, sortOrder: e.target.value }))
              }
              placeholder="0"
              className="h-11 w-full rounded-xl border border-[#ded9d3] bg-[#fef9f2] px-3 outline-none focus:border-[#E8A020]"
            />
            {errors.sortOrder ? (
              <p className="mt-1 text-xs font-bold text-red-600">{errors.sortOrder}</p>
            ) : null}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={itemLoading}
            className={`h-12 flex-1 rounded-xl text-sm font-extrabold text-white shadow-lg ${
              itemLoading ? "cursor-not-allowed bg-gray-400" : "bg-[#3d0c02]"
            }`}
          >
            {itemLoading
              ? editingItem
                ? "Updating..."
                : "Saving..."
              : editingItem
              ? "Update Item"
              : "Save Item"}
          </button>

          {editingItem ? (
            <button
              type="button"
              onClick={onCancelEdit}
              className="h-12 rounded-xl border border-[#ded9d3] bg-white px-5 text-sm font-bold text-[#3d0c02]"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}

export default ItemForm;