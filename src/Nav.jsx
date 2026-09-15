import { useState } from 'react';
import './Nav.css';

const LINKS = [
  { key: 'gallery', label: 'Galería' },
  { key: 'about', label: 'Sobre mi' },
  { key: 'shop', label: 'Tienda' },
];

const Nav = ({ active, onNavigate, hoverEffect = false }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      {hoverEffect && <div className={`nav-backdrop ${hovered ? 'visible' : ''}`}></div>}

      <nav
        className="site-nav"
        onMouseEnter={() => hoverEffect && setHovered(true)}
        onMouseLeave={() => hoverEffect && setHovered(false)}
      >
        <div className="logo-placeholder">LOGO</div>
        <ul className="nav-links">
          {LINKS.map(({ key, label }) => (
            <li key={key}>
              <a
                href={`#${key}`}
                className={active === key ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(key);
                }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Nav;
