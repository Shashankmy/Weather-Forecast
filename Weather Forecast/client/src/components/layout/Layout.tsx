import { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <footer className="py-4 px-6 text-center text-sm text-gray-500 border-t border-gray-200 dark:border-gray-800">
        <p>
          Weather data provided by{' '}
          <a 
            href="https://openweathermap.org/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            OpenWeatherMap
          </a>
          {' | '}
          City data from{' '}
          <a 
            href="https://public.opendatasoft.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            OpenDataSoft
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Layout;
