import { useLocation, useNavigate } from 'react-router-dom'

const tabs = [
  {
    path: '/',
    label: 'Home',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    path: '/menu',
    label: 'Menu',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 11l19-9-9 19-2-8-8-2z" />
      </svg>
    ),
  },
  {
    path: '/add',
    label: 'add',
    isAdd: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
  },
  {
    path: '/hall-of-fame',
    label: 'Hall of Fame',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
]

export const TabBar = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div
      className="absolute bottom-0 left-0 right-0 h-20 bg-jin-ink/95 backdrop-blur border-t border-white/10 flex items-start justify-around pt-5 z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {tabs.map((tab) => {
        const isActive = pathname === tab.path

        if (tab.isAdd) {
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center -mt-3"
            >
              <div
                className={`w-13 h-13 rounded-2xl flex items-center justify-center
                ${isActive ? 'bg-jin-red-deep' : 'bg-jin-red'}`}
                style={{ width: 52, height: 52 }}
              >
                <svg
                  className="w-5 h-5 stroke-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth={2}
                  strokeLinecap="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
            </button>
          )
        }

        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className="flex flex-col items-center gap-1"
          >
            <div
              className={`w-5 h-5 ${isActive ? 'stroke-jin-red-vivid' : 'stroke-jin-muted'}`}
            >
              {tab.icon}
            </div>
            <span
              className={`text-[9px] uppercase tracking-widest
              ${isActive ? 'text-jin-red-vivid' : 'text-jin-muted'}`}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
