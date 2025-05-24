import React from 'react';
import SearchBar from './SearchBar';

interface HeaderProps {
    onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
    return (
        <header className="site-header">
            <div className="header-top-bar"></div>
            <div className="header-main">
                <div className="header-main__left">
                    <a href="/" className="logo-link">
                        <span className="logo-text">Last.fm</span>
                    </a>
                </div>
                <div className="header-main__center">
                    <SearchBar onSearch={onSearch} />
                </div>
                <nav className="main-nav">
                    <ul className="main-nav__list">
                        <li className="main-nav__item"><a href="#" className="main-nav__link">Home</a></li>
                        <li className="main-nav__item"><a href="#" className="main-nav__link">Live</a></li>
                        <li className="main-nav__item"><a href="/" className="main-nav__link main-nav__link--active">Music</a></li>
                        <li className="main-nav__item"><a href="#" className="main-nav__link">Charts</a></li>
                        <li className="main-nav__item"><a href="#" className="main-nav__link">Events</a></li>
                        <li className="main-nav__item"><a href="#" className="main-nav__link">Features</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;