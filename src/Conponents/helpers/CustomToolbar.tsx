import type React from "react"
import type { ToolbarProps, View } from "react-big-calendar"
export const CustomToolbar: React.FC<ToolbarProps> = (toolbar) => {
  const views = Array.isArray(toolbar.views) ? toolbar.views : []  

  console.log(views)
  return (
    <div className="flex flex-wrap gap-2 justify-between items-center mb-4 p-2">
      <span className="text-xl font-bold text-gray-800">
        {toolbar.label}
      </span>

      <div className="flex gap-2">
        {views.map((view: View) => (
          <button
            key={view}
            onClick={() => toolbar.onView(view)}
            className={`px-3 py-1 rounded-lg border text-sm ${
              toolbar.view === view
                ? "bg-slate-500 text-white border-slate-500"
                : "border-gray-200 hover:bg-gray-100"
            }`}
          >
            {view}
          </button>
        ))}
      </div>
    </div>
  )
}
