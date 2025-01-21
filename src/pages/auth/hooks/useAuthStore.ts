import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { Admin } from "../../admin/types";


export type AuthStoreType = Partial<Admin>

export type AuthStateType = {
	email?: string;
	password?: string;
	setRemember: (email: string, password: string) => void;

	admin: AuthStoreType;
	setAdmin: (value:AuthStoreType) => void;

	resetAuth: () => void;
}

const useAuthStore = create<AuthStateType>()(
	devtools(
		persist(
			(set) => ({
				admin:{},
				setAdmin(value: AuthStoreType) {
					set(() => ({ admin: value }));
				},
				resetAuth() {
					set(() => ({
						admin: {},
					}))
				},
				setRemember(email, password) {
					set(() => ({
						email,
						password,
					}))
				},
			}),
			{ name: "authStore" }
		)
	)
);

export default useAuthStore;
