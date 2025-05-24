import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="site-footer">
            <div className="footer-main">
                <div className="footer-column">
                    <h3 className="footer-column__title">COMPANY</h3>
                    <ul className="footer-column__list">
                        <li><a href="#" className="footer-column__link">About Last.fm</a></li>
                        {/* ... остальные ссылки ... */}
                    </ul>
                </div>
                {/* ... остальные колонки ... */}
            </div>
            <div className="footer-bottom">
                {/* ... остальная часть футера ... */}
            </div>
        </footer>
    );
};
export default Footer;