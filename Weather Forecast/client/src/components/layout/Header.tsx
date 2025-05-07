import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { MoonStar, Sun, Home, Menu, X } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

const Header = () => {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll event to change header style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Toggle theme between light and dark
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and site name */}
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center gap-2 font-bold text-xl text-primary">
                <Sun className="h-6 w-6" />
                <span>WeatherApp</span>
              </a>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/">
              <a className={`px-3 py-2 rounded-md text-sm font-medium ${
                location === '/' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}>
                Home
              </a>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
            </Button>
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-2 pb-4">
            <div className="flex flex-col gap-2">
              <Link href="/">
                <a
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location === '/' 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </div>
                </a>
              </Link>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {
                  toggleTheme();
                  setIsMenuOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </div>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
