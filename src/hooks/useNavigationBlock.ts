import { useEffect } from "react";
import { useBlocker } from "react-router-dom";

export const useNavigationBlock = (isModify: boolean) => {
  // Block browser unload
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isModify) {
        event.preventDefault();
        event.returnValue = ""; // Required for Chrome
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isModify]);

  // Block route changes with login path exception
  const blocker = useBlocker(({  nextLocation }) => {
    // Allow navigation to login path without blocking
    if (nextLocation.pathname === '/auth/login') {
      return false;
    }
    return isModify;
  });

  useEffect(() => {
    if (blocker.state === "blocked" && blocker.location) {
      const confirmNavigation = window.confirm(
        "คุณยังไม่ได้บันทึกข้อมูล คุณแน่ใจหรือไม่ว่าต้องการออกจากหน้านี้?"
      );
      if (confirmNavigation) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker]);

  // Reset blocker state
  useEffect(() => {
    if (!isModify && blocker) {
      blocker.reset?.();
    }
  }, [isModify, blocker]);
};

