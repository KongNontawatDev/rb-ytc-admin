import { Suspense } from "react";
import DashboardLayoutLoading from "../components/layouts/DashboardLayout/loading";
import { ComponentType } from "react";

export interface PageWrapperProps {
  component: ComponentType;
  LoadingComponent?: ComponentType;
}

export const PageWrapper = ({ 
  component: Component, 
  LoadingComponent = DashboardLayoutLoading 
}: PageWrapperProps) => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <Component />
    </Suspense>
  );
};