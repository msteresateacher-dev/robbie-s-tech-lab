import React from 'react';
import { LanguageProvider } from './contexts/LanguageContext';

export default function Layout({ children }) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
}