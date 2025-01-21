import {create} from "zustand"
import {persist, devtools} from "zustand/middleware"

export type UISettingStateType = {
  theme: "dark" | "light"
  layout: "vertical" | "horizontal"
  primaryColor: string
  sidebarColor: "light" | "dark"
  content: "full" | "centered"
  switchTheme: () => void
  setTheme: (value: "dark" | "light") => void
  setSidebarColor: (value: "light" | "dark") => void
  setLayout: (value: "vertical" | "horizontal") => void
  setPrimaryColor: (value: string) => void
  setContent: (value: "full" | "centered") => void
  reset: () => void
}

const initialState: UISettingStateType = {
  theme: "light",
  layout: "vertical",
  primaryColor: "#007bff",
  sidebarColor: "light",
  content:"full",
  switchTheme: () => {},
  setTheme: () => {},
  setSidebarColor: () => {},
  setLayout: () => {},
  setPrimaryColor: () => {},
  setContent:()=>{},
  reset: () => {},
}

const useUISettingStore = create<UISettingStateType>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        switchTheme() {
          set((state) => ({
            theme: state.theme === "light" ? "dark" : "light",
          }))
        },
        setTheme: (value) => set({theme: value}),
        setSidebarColor: (value) => set({sidebarColor: value}),
        setLayout: (value) => set({layout: value}),
        setPrimaryColor: (value) => set({primaryColor: value}),
        setContent: (value) => set({content: value}),
        reset: () => set(initialState),
      }),
      {name: "UISettingStore"}
    )
  )
)

export default useUISettingStore