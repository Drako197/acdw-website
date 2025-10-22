import { Link } from 'react-router-dom'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline'

export function Footer() {
  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container section">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <WrenchScrewdriverIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AC Drain Wiz</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Professional-grade AC drain line maintenance solutions that prevent costly water damage 
              and streamline HVAC service operations.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <EnvelopeIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>info@acdrainwiz.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <PhoneIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>1-800-AC-DRAIN</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPinIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>United States</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Products
            </h3>
            <ul className="space-y-3">
              <li><Link to="/products" className="text-gray-300 hover:text-white transition-colors">AC Drain Wiz 1.0</Link></li>
              <li><Link to="/products" className="text-gray-300 hover:text-white transition-colors">AC Drain Wiz Mini</Link></li>
              <li><Link to="/products" className="text-gray-300 hover:text-white transition-colors">AC Drain Wiz Sensor</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/products" className="text-gray-300 hover:text-white transition-colors">Products</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} AC Drain Wiz. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              ICC Code Compliant • Professional Grade • Made in USA
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
