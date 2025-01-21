import {create} from "zustand"
import {persist, devtools} from "zustand/middleware"

export type LayoutStateType = {

  sidebarCollapse: boolean
  sidebarCollapseWidth: number
  setSidebarCollapse: (value: boolean) => void
  setSidebarCollapseWidth: (value: number) => void

  sidebarActive: string[]
  setSidebarActive: (key: string[]) => void
}

const useLayoutStore = create<LayoutStateType>()(
  devtools(
    persist(
      (set) => ({
        sidebarActive: ["sub1"],
        sidebarCollapse: false,
        sidebarCollapseWidth: 1,
        
        setSidebarCollapse(value) {
          set(() => ({
            sidebarCollapse: value,
          }))
        },
        setSidebarCollapseWidth(value) {
          set(() => ({
            sidebarCollapseWidth: value,
          }))
        },
        setSidebarActive(key) {
          set(() => ({
            sidebarActive: key,
          }))
        },

      }),
      {name: "LayoutStore"}
    )
  )
)

export default useLayoutStore