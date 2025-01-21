import { FormInstance } from "antd";
import { isEqual } from "lodash";
import { useEffect } from "react";
import { useBlocker } from "react-router-dom";

export interface FormData {
	[key: string]: any;
}

/**
 * ตรวจสอบว่าฟอร์มมีการเปลี่ยนแปลงหรือไม่
 * @param initialData - ข้อมูลเริ่มต้น
 * @param currentData - ข้อมูลปัจจุบัน
 * @returns true ถ้ามีการเปลี่ยนแปลง, false ถ้าไม่มี
 */
export const hasFormChanged = (
	initialData: FormData,
	currentData: FormData
): boolean => {
	const currentDataKeys = Object.keys(currentData);
	return !isEqual(
		currentData,
		currentDataKeys.reduce(
			(acc, key) => ({ ...acc, [key]: initialData[key] }),
			{}
		)
	);
};

type HasFormChangedFn = (
	oldData: Record<string, any>,
	currentValues: Record<string, any>
) => boolean;

export const createHandleFormChange =
	(
		form: FormInstance,
		oldData: Record<string, any> | null,
		setIsModified: (isModified: boolean) => void,
		hasFormChanged: HasFormChangedFn
	) =>
	() => {
		const currentValues = form.getFieldsValue();
		setIsModified(hasFormChanged(oldData || {}, currentValues));
	};

	interface NavigationBlockConfig {
		isModify: boolean;
		bypassPaths?: string[];
		confirmMessage?: string;
	}
	
	export const useNavigationBlockEnhanced = ({
		isModify,
		bypassPaths = ['/auth/login'],
		confirmMessage = "คุณยังไม่ได้บันทึกข้อมูล คุณแน่ใจหรือไม่ว่าต้องการออกจากหน้านี้?"
	}: NavigationBlockConfig) => {
	
		useEffect(() => {
			const handleBeforeUnload = (event: BeforeUnloadEvent) => {
				if (isModify) {
					event.preventDefault();
					event.returnValue = "";
				}
			};
			window.addEventListener("beforeunload", handleBeforeUnload);
			return () => {
				window.removeEventListener("beforeunload", handleBeforeUnload);
			};
		}, [isModify]);
	
		const blocker = useBlocker(({ nextLocation }) => {
			// Check if the next location is in the bypass paths
			if (bypassPaths.includes(nextLocation.pathname)) {
				return false;
			}
			return isModify;
		});
	
		useEffect(() => {
			if (blocker.state === "blocked" && blocker.location) {
				const confirmNavigation = window.confirm(confirmMessage);
				if (confirmNavigation) {
					blocker.proceed();
				} else {
					blocker.reset();
				}
			}
		}, [blocker, confirmMessage]);
	
		useEffect(() => {
			if (!isModify && blocker) {
				blocker.reset?.();
			}
		}, [isModify, blocker]);
	};
