import { App, ConfigProvider, theme } from "antd";
import useUISettingStore from "../layouts/UISetting/hooks/useUISettingStore";
import localeTH from "antd/locale/th_TH";
import localeEN from "antd/locale/en_US";
import { ReactElement, useEffect } from "react";
import { useLocaleStore } from "../../hooks/localeStore";
import i18n from "../../libs/i18n";

export default function AntDesignProvider({ children }: { children: ReactElement }) {
	const uiSettingStore = useUISettingStore();
	const languageStore = useLocaleStore();
	useEffect(()=>{
		i18n.changeLanguage(languageStore.locale); 
	},[languageStore])
	return (
		<ConfigProvider
			theme={{
				token: {
					fontFamily: "Kanit",
					colorPrimary: uiSettingStore.primaryColor,
				},
				algorithm:
					uiSettingStore.theme === "dark"
						? theme.darkAlgorithm
						: theme.defaultAlgorithm,
			}}
			// renderEmpty={() => <EmptyData />}
			locale={languageStore.locale=="th"?localeTH:localeEN}
		>
			<App>{children}</App>
		</ConfigProvider>
	);
}
