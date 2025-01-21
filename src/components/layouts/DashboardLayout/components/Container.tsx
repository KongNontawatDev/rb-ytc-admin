import React from "react";
import useUISettingStore from "../../UISetting/hooks/useUISettingStore";

interface ContainerProps {
  children: React.ReactNode;
}

export default function ContainerLayout({ children }:ContainerProps) {
  const uiSettingStore = useUISettingStore()
  const containerStyle: React.CSSProperties =
  uiSettingStore.content === "full"
      ? { width: "100%", maxWidth: "100%", padding: "0 16px" }
      : {
          maxWidth: "1200px", // Adjust as per design requirements
          margin: "0 auto",
          padding: "0 16px",
        };

  return <div style={{ ...containerStyle}}>{children}</div>;
};

