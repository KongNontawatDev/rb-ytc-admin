import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import AntDesignProvider from "./components/layouts/AntDesignProvider";
import i18n from "./libs/i18n";
import { I18nextProvider } from "react-i18next";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./libs/reactQuery";


export default function App() {

	return (
		<I18nextProvider i18n={i18n}>
			<QueryClientProvider client={queryClient}>
				<AntDesignProvider>
					<RouterProvider router={router} />
				</AntDesignProvider>
			</QueryClientProvider>
		</I18nextProvider>
	);
}
