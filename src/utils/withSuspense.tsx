import React, { ComponentType, Suspense } from "react";

export function withSuspense<T extends object>(
  Component: ComponentType<T>,
  fallback: React.ReactNode
): ComponentType<T> {
  return function (props: T) {
    return (
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    );
  };
}
