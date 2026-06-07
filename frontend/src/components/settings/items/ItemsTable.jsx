// src/components/settings/items/ItemsTable.jsx
import CategorySection from "./CategorySection";

function ItemsTable({
  categories,
  searchQuery,
  onSearchChange,
  onEditCategory,
  onDeleteCategory,
  onToggleCategory,
  onEditItem,
  onDeleteItem,
  onToggleItem,
  showDisabledItems,
  onToggleShowDisabledItems,
}) {
  return (
    <div className="rounded-2xl border border-[#ded9d3] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-[#ded9d3] pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#3d0c02]">Current Inventory</h2>
          <p className="mt-1 text-sm text-[#54433f]">
            View categories, edit products, and control active status.
          </p>
        </div>

        <div className="w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search items..."
            className="h-11 w-full rounded-xl border border-[#ded9d3] bg-[#fef9f2] px-4 text-sm outline-none focus:border-[#E8A020]"
          />
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
 

  <button
    type="button"
    onClick={onToggleShowDisabledItems}
    className="rounded-xl border border-[#ded9d3] bg-white px-4 py-2 text-sm font-bold text-[#3d0c02]"
  >
    {showDisabledItems ? "Hide Disabled" : "Show Disabled"}
  </button>
</div>
      </div>

      <div className="mt-5 space-y-5">
        {categories.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#ded9d3] bg-[#f8f3ec]/40 p-8 text-center text-sm text-[#54433f]">
            No matching categories or items found.
          </div>
        ) : (
          categories.map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              onEditCategory={onEditCategory}
              onDeleteCategory={onDeleteCategory}
              onToggleCategory={onToggleCategory}
              onEditItem={onEditItem}
              onDeleteItem={onDeleteItem}
              onToggleItem={onToggleItem}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ItemsTable;