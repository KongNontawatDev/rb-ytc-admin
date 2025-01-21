import { ReactNode } from 'react';

export default function SettingLayout({children}:{children:ReactNode}) {
  return (
    <>
      <p>setting layout</p>
      {children}
    </>
  );
}