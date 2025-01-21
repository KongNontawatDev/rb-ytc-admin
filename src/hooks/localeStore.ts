import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18n from "../libs/i18n";
import i18next from "i18next";

export type Locale = "th" | "en";

interface LocaleState {
	locale: Locale | string;
	setLocale: (lang: Locale | string) => void;
}

export const useLocaleStore = create<LocaleState>()(
	persist(
		(set) => ({
			// Default locale is now Thai
			locale: "th",

			// Method to update locale
			setLocale: async (newLocale) => {
				// Update Zustand state
				set({ locale: newLocale });
				i18n.changeLanguage(newLocale);
        i18next.changeLanguage(newLocale);
			},
		}),
		{
			name: "useLocaleStore", // Key in localStorage
		}
	)
);
