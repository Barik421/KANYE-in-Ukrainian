import { Outlet, Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';

export function RootLayout() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="site-header__brand" to="/">
          KANYE in Ukrainian
        </Link>
        <nav className="site-header__nav" aria-label="Основна навігація">
          <Link to="/catalog">Каталог</Link>
          <Link to="/about">Про нас</Link>
          <Link to="/donate">Донат</Link>
          <Link to="/contact">Контакти</Link>
          <ThemeToggle />
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <span>KANYE in Ukrainian</span>
        <Link to="/catalog">Каталог</Link>
        <Link to="/about">Про нас</Link>
        <Link to="/donate">Донат</Link>
        <Link to="/contact">Контакти</Link>
        <Link to="/policy">Правова інформація</Link>
        <Link to="/contact">Запропонувати пісню</Link>
        <small>Неофіційний незалежний проєкт.</small>
      </footer>
    </div>
  );
}
