// src/components/Header.tsx
import React from 'react';
import SearchBar from './SearchBar'; // Мы создадим его позже

interface HeaderProps {
    onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
    return (
        <header className="site-header">
            <div className="header-top-bar"></div>
            <div className="header-main">
                <div className="header-main__left">
                    <a href="/" className="logo"> {/* Используйте Link из React Router если будет роутинг */}
                        <img src="https://s.prcdn.co/image/2021/5/18/lastfm_1.png" alt="Last.fm Logo" className="logo__img" />
                    </a>
                </div>
                <div className="header-main__center">
                    <SearchBar onSearch={onSearch} />
                </div>
                <nav className="main-nav">
                    <ul className="main-nav__list">
                        {/* Для ссылок лучше использовать Link из React Router, если он будет добавлен */}
                        <li className="main-nav__item"><a href="/" className="main-nav__link">Home</a></li>
                        <li className="main-nav__item"><a href="#" className="main-nav__link">Live</a></li>
                        <li className="main-nav__item"><a href="#" className="main-nav__link main-nav__link--active">Music</a></li>
                        <li className="main-nav__item"><a href="#" className="main-nav__link">Charts</a></li>
                        <li className="main-nav__item"><a href="#" className="main-nav__link">Events</a></li>
                        <li className="main-nav__item"><a href="#" className="main-nav__link">Features</a></li>
                    </ul>
                </nav>
                <div className="header-main__right">
                    <div className="user-profile">
                        <img src="https://via.placeholder.com/32" alt="User Profile" className="user-profile__img" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;