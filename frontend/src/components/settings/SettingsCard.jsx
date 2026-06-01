function SettingsCard({
  title,
  description,
  icon,
  tags = [],
  buttonLabel,
  onClick,
  buttonType = "tags",
}) {
  return (
    <div
      className="group flex h-full flex-col rounded-2xl border border-[#d9c1bc]/30 bg-white p-5 shadow-[0_4px_12px_rgba(61,12,2,0.08)] transition-colors hover:border-[#815500]"
    >
      <div className="mb-6 flex items-start justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#3d0c02]/10 text-[28px] text-[#3d0c02]">
          <span>{icon}</span>
        </div>

        <button
          type="button"
          onClick={onClick}
          className="text-xl text-[#86736e] transition-colors hover:text-[#815500]"
          aria-label={`Open ${title}`}
        >
          ›
        </button>
      </div>

      <h2 className="mb-2 text-[24px] font-bold leading-8 text-[#3d0c02]">
        {title}
      </h2>

      <p className="mb-8 flex-grow text-[16px] leading-6 text-[#54433f]">
        {description}
      </p>

      {buttonType === "button" ? (
        <button
          type="button"
          onClick={onClick}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#feb234] text-[14px] font-bold text-[#6d4700] shadow-sm transition hover:bg-[#feb234]/90"
        >
          <span>🛠️</span>
          {buttonLabel}
        </button>
      ) : (
        <div className="flex flex-wrap gap-2 border-t border-[#d9c1bc]/20 pt-4">
          {tags.map((tag, index) => (
            <div
              key={tag}
              className={`rounded-full px-3 py-1.5 text-[12px] font-bold ${
                index === 0 && title === "Business Reports"
                  ? "flex items-center gap-2 bg-[#ece7e1] text-[#54433f]"
                  : title === "Summary"
                  ? index === 0
                    ? "bg-[#feb234]/20 text-[#6d4700]"
                    : index === 1
                    ? "bg-[#3d0c02]/10 text-[#bf715c]"
                    : index === 2
                    ? "bg-[#ffdcc1] text-[#693c0e]"
                    : "bg-[#ffdad6] text-[#93000a]"
                  : "bg-[#f2ede6] text-[#54433f]"
              }`}
            >
              {index === 0 && title === "Business Reports" ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-[#815500]" />
                  <span>{tag}</span>
                </>
              ) : (
                tag
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SettingsCard;