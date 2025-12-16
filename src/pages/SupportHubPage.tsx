import { Link } from 'react-router-dom'
import { 
  WrenchScrewdriverIcon, 
  QuestionMarkCircleIcon, 
  ShieldCheckIcon, 
  EnvelopeIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  BookOpenIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

export function SupportHubPage() {
  return (
    <div className="support-hub-container">
      <div className="container py-16">
        {/* Header */}
        <div className="support-hub-header">
          <h1 className="support-hub-title">Support Center</h1>
          <p className="support-hub-subtitle">
            Find answers to common questions, installation guides, warranty information, and get the help you need.
          </p>
          
          {/* Search Bar */}
          <div className="support-hub-search">
            <div className="support-hub-search-wrapper">
              <MagnifyingGlassIcon className="support-hub-search-icon" />
              <input
                type="text"
                placeholder="Search for help..."
                className="support-hub-search-input"
              />
            </div>
          </div>
        </div>

        {/* Main Navigation Cards */}
        <div className="support-hub-cards">
          <Link 
            to="/support/installation-setup" 
            className="support-hub-card support-hub-card-primary"
          >
            <div className="support-hub-card-icon-wrapper">
              <WrenchScrewdriverIcon className="support-hub-card-icon" />
            </div>
            <h2 className="support-hub-card-title">Installation & Setup</h2>
            <p className="support-hub-card-description">
              Step-by-step guides, video tutorials, and installation scenarios for AC Drain Wiz products.
            </p>
            <div className="support-hub-card-link">
              <span>View Guides</span>
              <ArrowRightIcon className="support-hub-card-arrow" />
            </div>
          </Link>

          <Link 
            to="/support/product-support" 
            className="support-hub-card support-hub-card-primary"
          >
            <div className="support-hub-card-icon-wrapper">
              <QuestionMarkCircleIcon className="support-hub-card-icon" />
            </div>
            <h2 className="support-hub-card-title">Product Support</h2>
            <p className="support-hub-card-description">
              Troubleshooting guides, FAQs, and technical help for your AC Drain Wiz products.
            </p>
            <div className="support-hub-card-link">
              <span>Get Help</span>
              <ArrowRightIcon className="support-hub-card-arrow" />
            </div>
          </Link>

          <Link 
            to="/support/warranty-returns" 
            className="support-hub-card support-hub-card-primary"
          >
            <div className="support-hub-card-icon-wrapper">
              <ShieldCheckIcon className="support-hub-card-icon" />
            </div>
            <h2 className="support-hub-card-title">Warranty & Returns</h2>
            <p className="support-hub-card-description">
              Warranty coverage details, return policy, and how to file a claim.
            </p>
            <div className="support-hub-card-link">
              <span>Learn More</span>
              <ArrowRightIcon className="support-hub-card-arrow" />
            </div>
          </Link>

          <Link 
            to="/support/contact" 
            className="support-hub-card support-hub-card-primary"
          >
            <div className="support-hub-card-icon-wrapper">
              <EnvelopeIcon className="support-hub-card-icon" />
            </div>
            <h2 className="support-hub-card-title">Contact Support</h2>
            <p className="support-hub-card-description">
              Get in touch with our support team via phone, email, or support form.
            </p>
            <div className="support-hub-card-link">
              <span>Contact Us</span>
              <ArrowRightIcon className="support-hub-card-arrow" />
            </div>
          </Link>
        </div>

        {/* Quick Links Section */}
        <div className="support-hub-quick-links">
          <h2 className="support-hub-quick-links-title">Quick Links</h2>
          <div className="support-hub-quick-links-grid">
            <Link to="/sensor-setup" className="support-hub-quick-link">
              <DocumentTextIcon className="support-hub-quick-link-icon" />
              <span>Sensor Setup Guide</span>
            </Link>
            <Link to="/support/installation-scenarios" className="support-hub-quick-link">
              <BookOpenIcon className="support-hub-quick-link-icon" />
              <span>Installation Scenarios</span>
            </Link>
            <a 
              href="https://monitor.acdrainwiz.com/login" 
              target="_blank" 
              rel="noopener noreferrer"
              className="support-hub-quick-link"
            >
              <DocumentTextIcon className="support-hub-quick-link-icon" />
              <span>Sensor Monitoring Portal</span>
            </a>
            <Link to="/compliance" className="support-hub-quick-link">
              <DocumentTextIcon className="support-hub-quick-link-icon" />
              <span>Compliance Resources</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

