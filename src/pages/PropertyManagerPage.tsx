import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheckIcon, 
  BuildingOfficeIcon, 
  ExclamationTriangleIcon,
  ChartBarIcon,
  BellIcon,
  WrenchScrewdriverIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

export function PropertyManagerPage() {
  const navigate = useNavigate();

  const handleRegisterAndDemo = () => {
    // Navigate to signup with property manager role, then redirect to demo request
    const redirectUrl = encodeURIComponent('/contact?type=demo-request');
    navigate(`/auth/signup?role=PROPERTY_MANAGER&redirect=${redirectUrl}`);
  };

  const handleContactSales = () => {
    navigate('/contact?type=sales');
  };

  return (
    <div className="property-manager-page">
      {/* Hero Section */}
      <div className="property-manager-hero-container">
        <div className="property-manager-hero-content">
          <div className="property-manager-hero-header">
            <h1 className="property-manager-hero-headline">
              Protect Your Portfolio from <span className="property-manager-hero-highlight">Costly AC Drain Line Failures</span>
            </h1>
            
            <p className="property-manager-hero-subheadline">
              Professional-grade solutions for multi-unit properties. Bulk installation and 24/7 remote monitoring to prevent water damage and reduce emergency maintenance calls.
            </p>

            <div className="property-manager-hero-badge-row">
              <span className="property-manager-hero-badge">Bulk Pricing Available</span>
              <span className="property-manager-hero-badge">24/7 Remote Monitoring</span>
            </div>

            <div className="property-manager-hero-ctas">
              <button 
                onClick={handleRegisterAndDemo}
                className="property-manager-hero-cta-primary"
              >
                Register & Request Demo
              </button>
              <button 
                onClick={handleContactSales}
                className="property-manager-hero-cta-secondary"
              >
                Contact Sales Team
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <div className="property-manager-problem-section">
        <div className="property-manager-problem-content">
          <h2 className="property-manager-problem-headline">The Hidden Cost of AC Drain Line Failures in Multi-Unit Properties</h2>
          <p className="property-manager-problem-subheadline">
            Water damage from AC drain line clogs can cost thousands per incident, create tenant complaints, increase insurance premiums, and lead to emergency maintenance calls that strain your budget and resources.
          </p>
          
          <div className="property-manager-problem-stats">
            <div className="property-manager-problem-stat">
              <ExclamationTriangleIcon className="property-manager-problem-stat-icon" />
              <div className="property-manager-problem-stat-content">
                <div className="property-manager-problem-stat-number">$5K-$20K</div>
                <div className="property-manager-problem-stat-label">Average water damage cost per incident</div>
              </div>
            </div>
            <div className="property-manager-problem-stat">
              <ClockIcon className="property-manager-problem-stat-icon" />
              <div className="property-manager-problem-stat-content">
                <div className="property-manager-problem-stat-number">48hrs</div>
                <div className="property-manager-problem-stat-label">Typical emergency response time</div>
              </div>
            </div>
            <div className="property-manager-problem-stat">
              <UserGroupIcon className="property-manager-problem-stat-icon" />
              <div className="property-manager-problem-stat-content">
                <div className="property-manager-problem-stat-number">85%</div>
                <div className="property-manager-problem-stat-label">Of property managers report drain line issues</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Solution Section */}
      <div className="property-manager-solution-section">
        <div className="property-manager-solution-content">
          <h2 className="property-manager-section-title">Complete Protection for Your Portfolio</h2>
          <p className="property-manager-section-subtitle">
            AC Drain Wiz Mini + Sensor provides proactive maintenance access and 24/7 remote monitoring to prevent costly failures before they happen.
          </p>

          <div className="property-manager-solution-grid">
            <div className="property-manager-solution-card">
              <div className="property-manager-solution-icon-wrapper">
                <WrenchScrewdriverIcon className="property-manager-solution-icon" />
              </div>
              <h3 className="property-manager-solution-card-title">ACDW Mini</h3>
              <p className="property-manager-solution-card-description">
                Proactive maintenance access for all units. Installs in 5 minutes or less per unit with professional support available.
              </p>
              <ul className="property-manager-solution-features">
                <li>Prevent clogs before they cause damage</li>
                <li>10X faster maintenance cleanouts</li>
                <li>Clear visual inspection window</li>
                <li>Bulk installation pricing</li>
              </ul>
            </div>

            <div className="property-manager-solution-card">
              <div className="property-manager-solution-icon-wrapper">
                <BellIcon className="property-manager-solution-icon" />
              </div>
              <h3 className="property-manager-solution-card-title">ACDW Sensor</h3>
              <p className="property-manager-solution-card-description">
                24/7 remote monitoring with instant alerts. Monitor all units from a centralized dashboard.
              </p>
              <ul className="property-manager-solution-features">
                <li>Real-time water level monitoring</li>
                <li>Email and SMS alerts before failures</li>
                <li>Centralized dashboard for all properties</li>
                <li>No moving parts, reliable operation</li>
              </ul>
            </div>

            <div className="property-manager-solution-card">
              <div className="property-manager-solution-icon-wrapper">
                <BuildingOfficeIcon className="property-manager-solution-icon" />
              </div>
              <h3 className="property-manager-solution-card-title">Complete System</h3>
              <p className="property-manager-solution-card-description">
                Mini + Sensor combination provides maximum protection with proactive maintenance and smart monitoring.
              </p>
              <ul className="property-manager-solution-features">
                <li>Proactive cleaning + smart alerts</li>
                <li>Reduce emergency calls by 85%</li>
                <li>Professional installation support</li>
                <li>Portfolio-wide monitoring</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="property-manager-benefits-section">
        <div className="property-manager-benefits-content">
          <h2 className="property-manager-section-title">Why Property Managers Choose AC Drain Wiz</h2>
          
          <div className="property-manager-benefits-grid">
            <div className="property-manager-benefit-item">
              <CurrencyDollarIcon className="property-manager-benefit-icon" />
              <h3 className="property-manager-benefit-title">Reduce Costs</h3>
              <p className="property-manager-benefit-description">
                Prevent $5K-$20K water damage claims per incident. Lower insurance premiums with proactive maintenance.
              </p>
            </div>

            <div className="property-manager-benefit-item">
              <ClockIcon className="property-manager-benefit-icon" />
              <h3 className="property-manager-benefit-title">Fewer Emergency Calls</h3>
              <p className="property-manager-benefit-description">
                Reduce emergency AC service calls by up to 85%. Proactive maintenance prevents reactive repairs.
              </p>
            </div>

            <div className="property-manager-benefit-item">
              <ChartBarIcon className="property-manager-benefit-icon" />
              <h3 className="property-manager-benefit-title">Centralized Monitoring</h3>
              <p className="property-manager-benefit-description">
                Monitor all units from one dashboard. Get alerts before problems become emergencies.
              </p>
            </div>

            <div className="property-manager-benefit-item">
              <UserGroupIcon className="property-manager-benefit-icon" />
              <h3 className="property-manager-benefit-title">Improve Tenant Satisfaction</h3>
              <p className="property-manager-benefit-description">
                Prevent AC failures and water damage that create tenant complaints and turnover.
              </p>
            </div>

            <div className="property-manager-benefit-item">
              <ShieldCheckIcon className="property-manager-benefit-icon" />
              <h3 className="property-manager-benefit-title">Reduce Liability</h3>
              <p className="property-manager-benefit-description">
                IMC code compliant solutions with documentation for insurance and legal protection.
              </p>
            </div>

            <div className="property-manager-benefit-item">
              <BuildingOfficeIcon className="property-manager-benefit-icon" />
              <h3 className="property-manager-benefit-title">Bulk Installation</h3>
              <p className="property-manager-benefit-description">
                Professional installation support for portfolio-wide deployments with bulk pricing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ROI Section */}
      <div className="property-manager-roi-section">
        <div className="property-manager-roi-content">
          <h2 className="property-manager-section-title">Proven ROI for Property Managers</h2>
          <div className="property-manager-roi-grid">
            <div className="property-manager-roi-card">
              <h3 className="property-manager-roi-card-title">Cost Per Unit</h3>
              <div className="property-manager-roi-card-value">$99.99+</div>
              <p className="property-manager-roi-card-description">
                One-time installation cost per unit (Mini). Sensor available for enhanced monitoring.
              </p>
            </div>
            <div className="property-manager-roi-card">
              <h3 className="property-manager-roi-card-title">Potential Savings</h3>
              <div className="property-manager-roi-card-value">$5K-$20K</div>
              <p className="property-manager-roi-card-description">
                Prevented water damage cost per incident. One prevented incident pays for 100+ units.
              </p>
            </div>
            <div className="property-manager-roi-card">
              <h3 className="property-manager-roi-card-title">Emergency Call Reduction</h3>
              <div className="property-manager-roi-card-value">85%</div>
              <p className="property-manager-roi-card-description">
                Average reduction in emergency AC service calls with proactive maintenance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="property-manager-how-it-works-section">
        <div className="property-manager-how-it-works-content">
          <h2 className="property-manager-section-title">How It Works for Property Managers</h2>
          <div className="property-manager-steps">
            <div className="property-manager-step">
              <div className="property-manager-step-number">1</div>
              <h3 className="property-manager-step-title">Contact Us</h3>
              <p className="property-manager-step-description">
                Register and request a demo. Our team will assess your portfolio and provide a customized installation plan.
              </p>
            </div>
            <div className="property-manager-step">
              <div className="property-manager-step-number">2</div>
              <h3 className="property-manager-step-title">Bulk Installation</h3>
              <p className="property-manager-step-description">
                Professional installation across your properties with bulk pricing. 5 minutes or less per unit.
              </p>
            </div>
            <div className="property-manager-step">
              <div className="property-manager-step-number">3</div>
              <h3 className="property-manager-step-title">Monitor & Maintain</h3>
              <p className="property-manager-step-description">
                Access centralized dashboard for remote monitoring. Receive alerts and schedule proactive maintenance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="property-manager-cta-section">
        <div className="property-manager-cta-content">
          <h2 className="property-manager-cta-title">Ready to Protect Your Portfolio?</h2>
          <p className="property-manager-cta-subtitle">
            Join property managers nationwide who trust AC Drain Wiz to prevent costly water damage and reduce emergency maintenance calls.
          </p>
          <div className="property-manager-cta-buttons">
            <button 
              onClick={handleRegisterAndDemo}
              className="property-manager-cta-button-primary"
            >
              Register & Request Demo
            </button>
            <button 
              onClick={handleContactSales}
              className="property-manager-cta-button-secondary"
            >
              Contact Sales Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

