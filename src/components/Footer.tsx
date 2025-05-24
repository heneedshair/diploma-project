import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="site-footer">
            <div className="footer-container">
                <div className="footer-main">
                    <div className="footer-column">
                        <h3 className="footer-column__title">COMPANY</h3>
                        <ul className="footer-column__list">
                            <li><a href="#" className="footer-column__link">About Last.fm</a></li>
                            <li><a href="#" className="footer-column__link">Contact Us</a></li>
                            <li><a href="#" className="footer-column__link">Jobs</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3 className="footer-column__title">HELP</h3>
                        <ul className="footer-column__list">
                            <li><a href="#" className="footer-column__link">Track My Music</a></li>
                            <li><a href="#" className="footer-column__link">Community Support</a></li>
                            <li><a href="#" className="footer-column__link">Community Guidelines</a></li>
                            <li><a href="#" className="footer-column__link">Help</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3 className="footer-column__title">GOODIES</h3>
                        <ul className="footer-column__list">
                            <li><a href="#" className="footer-column__link">Download Scrobbler</a></li>
                            <li><a href="#" className="footer-column__link">Developer API</a></li>
                            <li><a href="#" className="footer-column__link">Free Music Downloads</a></li>
                            <li><a href="#" className="footer-column__link">Merchandise</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3 className="footer-column__title">ACCOUNT</h3>
                        <ul className="footer-column__list">
                            <li><a href="#" className="footer-column__link">Join</a></li>
                            <li><a href="#" className="footer-column__link">Log In</a></li>
                            <li><a href="#" className="footer-column__link">Subscribe</a></li>
                            <li><a href="#" className="footer-column__link">Settings</a></li>
                            <li><a href="#" className="footer-column__link">Last.fm Pro</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3 className="footer-column__title">FOLLOW US</h3>
                        <ul className="footer-column__list">
                            <li><a href="#" className="footer-column__link">Facebook</a></li>
                            <li><a href="#" className="footer-column__link">Twitter</a></li>
                            <li><a href="#" className="footer-column__link">Instagram</a></li>
                            <li><a href="#" className="footer-column__link">YouTube</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div className="footer-bottom__left">
                        <span className="language-label">English</span>
                        <a href="#" className="language-link">Deutsch</a>
                        <a href="#" className="language-link">Русский</a>
                        <a href="#" className="language-link">日本語</a>
                    </div>
                    <div className="footer-bottom__right">
                        <span className="time-info">Time zone: <span className="time-zone-value">Europe/Moscow</span></span>
                        <p className="copyright">&copy; Last.fm Ltd. 2025</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
export default Footer;