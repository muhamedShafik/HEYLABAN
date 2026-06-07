// src/components/settings/items/CategorySection.jsx
function CategorySection({
  category,
  onEditCategory,
  onDeleteCategory,
  onToggleCategory,
  onEditItem,
  onDeleteItem,
  onToggleItem,
}) {
  const products = category.products || [];
  const isCategoryActive = category.isActive !== false;

  return (
    <div className="rounded-2xl border border-[#ded9d3] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-[#ded9d3] pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-extrabold text-[#3d0c02]">{category.name}</h3>
            {!isCategoryActive ? (
              <span className="rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-700">
                Inactive
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-[#54433f]">
            Sort Order: {category.sortOrder ?? 0} · {products.length} item(s)
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onEditCategory(category)}
            className="rounded-lg border border-[#ded9d3] bg-white px-3 py-2 text-xs font-bold text-[#3d0c02] hover:bg-[#f8f3ec]"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onToggleCategory(category)}
            className="rounded-lg border border-[#ded9d3] bg-white px-3 py-2 text-xs font-bold text-[#3d0c02] hover:bg-[#f8f3ec]"
          >
            {isCategoryActive ? "Disable" : "Enable"}
          </button>
          <button
            type="button"
            onClick={() => onDeleteCategory(category)}
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#ded9d3] bg-[#f8f3ec]/40 p-5 text-sm text-[#54433f]">
            No products in this category.
          </div>
        ) : (
          products.map((item) => {
            const isItemActive = item.isActive !== false;

            return (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-xl border border-[#ded9d3] bg-[#f8f3ec]/35 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-bold text-[#3d0c02]">{item.name}</p>
                    {!isItemActive ? (
                      <span className="rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-[11px] font-bold text-yellow-700">
                        Inactive
                      </span>
                    ) : null}
                  </div>

                  {item.description ? (
                    <p className="mt-1 text-sm text-[#54433f]">{item.description}</p>
                  ) : (
                    <p className="mt-1 text-sm text-[#54433f]/60">No description</p>
                  )}

                  <div className="mt-2 flex flex-wrap gap-3 text-xs font-bold text-[#54433f]">
                    <span>Price: ₹{Number(item.price || 0).toFixed(2)}</span>
                    <span>Sort: {item.sortOrder ?? 0}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onEditItem(item, category)}
                    className="rounded-lg border border-[#ded9d3] bg-white px-3 py-2 text-xs font-bold text-[#3d0c02] hover:bg-[#f8f3ec]"
                  >
                    Edit
                  </button>
                  <button
  type="button"
  onClick={() => onToggleItem(item)}
  className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
    isItemActive
      ? "border border-yellow-300 bg-yellow-50 text-yellow-800 hover:bg-yellow-100"
      : "border border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
  }`}
>
  {isItemActive ? "Disable" : "Enable"}
</button>
                  <button
                    type="button"
                    onClick={() => onDeleteItem(item)}
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default CategorySection;