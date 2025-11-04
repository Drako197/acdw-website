import { Link } from 'react-router-dom'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon
} from '@heroicons/react/24/outline'

export function Footer() {
  return (
    <footer className="footer-container" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="footer-heading-sr-only">
        Footer
      </h2>
      <div className="footer-content">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-company-section">
            <div className="footer-brand">
              <Link to="/" className="footer-logo-link">
                <img 
                  src="/images/ac-drain-wiz-logo.png" 
                  alt="AC Drain Wiz Logo" 
                  className="footer-logo-image"
                />
              </Link>
            </div>
            <p className="footer-description">
              Professional-grade AC drain line maintenance solutions that prevent costly water damage 
              and streamline HVAC service operations.
            </p>
            
            {/* Contact Info */}
            <div className="footer-contact-info">
              <div className="footer-contact-item">
                <EnvelopeIcon className="footer-contact-icon" />
                <span>info@acdrainwiz.com</span>
              </div>
              <div className="footer-contact-item">
                <PhoneIcon className="footer-contact-icon" />
                <span>1-800-AC-DRAIN</span>
              </div>
              <div className="footer-contact-item">
                <MapPinIcon className="footer-contact-icon" />
                <span>United States</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="footer-section">
            <h3 className="footer-section-title">
              Products
            </h3>
            <ul className="footer-link-list">
              <li><Link to="/products?product=mini" className="footer-link">AC Drain Wiz Mini</Link></li>
              <li><Link to="/products?product=sensor" className="footer-link">AC Drain Wiz Sensor</Link></li>
              <li><Link to="/products?product=mini&product=sensor" className="footer-link">Mini + Sensor</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-section">
            <h3 className="footer-section-title">
              Resources
            </h3>
            <ul className="footer-link-list">
              <li><Link to="/about" className="footer-link">About Us</Link></li>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
              <li><Link to="/products" className="footer-link">Products</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              &copy; {new Date().getFullYear()} AC Drain Wiz. All rights reserved.
            </p>
            <p className="footer-badges">
              ICC Code Compliant • Professional Grade • Made in USA
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
