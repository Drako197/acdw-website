import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheckIcon, 
  WrenchScrewdriverIcon, 
  HomeIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BeakerIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  WrenchIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

export function HomeownerHomePage() {
  const navigate = useNavigate();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <div className="homeowner-page">
      {/* Hero Section - Card-Based Design */}
      <div className="homeowner-hero-container-cards">
        <div className="homeowner-hero-content-cards">
          {/* Hero Headline and Subheadline */}
          <div className="homeowner-hero-header">
            <h1 className="homeowner-hero-headline-cards">
              Stop AC Water Damage <span className="homeowner-hero-highlight">Before It Starts</span>
            </h1>
            
            <p className="homeowner-hero-subheadline-cards">
              Professional-grade protection. Homeowner-friendly installation. No plumber needed.
            </p>
          </div>
          
          {/* Feature Cards Grid */}
          <div className="homeowner-hero-cards-grid">
            {/* Card 1: Easy DIY Installation (Wide) */}
            <div className="homeowner-hero-card homeowner-hero-card-wide homeowner-hero-card-1">
              <div className="homeowner-hero-card-image-placeholder">
                {/* Placeholder for installation image */}
                <span className="homeowner-hero-card-placeholder-text">Installation Image</span>
              </div>
              
              <div className="homeowner-hero-card-content">
                <div className="homeowner-hero-card-badge">DIY Installation</div>
                <h3 className="homeowner-hero-card-title">Install in 30 Minutes</h3>
                <p className="homeowner-hero-card-description">
                  No plumber needed. Simple step-by-step guide included.
                </p>
                
                <button 
                  onClick={() => setIsVideoModalOpen(true)}
                  className="homeowner-hero-card-cta"
                >
                  View Installation Video
                </button>
              </div>
            </div>
            
            {/* Card 2: Clear Inspection Window (Tall) */}
            <div className="homeowner-hero-card homeowner-hero-card-tall homeowner-hero-card-2">
              <div className="homeowner-hero-card-image-placeholder homeowner-hero-card-image-tall">
                {/* Placeholder for inspection window image */}
                <span className="homeowner-hero-card-placeholder-text">Inspection Window Image</span>
              </div>
              
              <div className="homeowner-hero-card-content">
                <div className="homeowner-hero-card-badge">Visual Monitoring</div>
                <h3 className="homeowner-hero-card-title">Clear Inspection Window</h3>
                <p className="homeowner-hero-card-description">
                  See water flowing freely. Know your system is working.
                </p>
              </div>
            </div>
            
            {/* Card 3: Cost Savings (Wide) */}
            <div className="homeowner-hero-card homeowner-hero-card-wide homeowner-hero-card-3">
              <div className="homeowner-hero-card-image-placeholder">
                {/* Placeholder for water damage prevention image */}
                <span className="homeowner-hero-card-placeholder-text">Cost Savings Image</span>
              </div>
              
              <div className="homeowner-hero-card-content">
                <div className="homeowner-hero-card-badge">Prevent Damage</div>
                <h3 className="homeowner-hero-card-title">Save Thousands in Repairs</h3>
                <p className="homeowner-hero-card-description">
                  Protect your home from $2,000-10,000+ in water damage costs.
                </p>
                
                <button 
                  onClick={() => navigate('/products?product=mini')}
                  className="homeowner-hero-card-cta homeowner-hero-card-cta-primary"
                >
                  Buy Now - $49.99
                </button>
              </div>
            </div>
          </div>
          
          {/* Trust Badges Below Cards */}
          <div className="homeowner-hero-trust-badges-cards">
            <div className="homeowner-trust-badge-card">
              <CheckCircleIcon className="homeowner-trust-icon-card" />
              <span className="homeowner-trust-text-card">30-Day Money Back</span>
            </div>
            <div className="homeowner-trust-badge-card">
              <CheckCircleIcon className="homeowner-trust-icon-card" />
              <span className="homeowner-trust-text-card">Free Shipping</span>
            </div>
            <div className="homeowner-trust-badge-card">
              <CheckCircleIcon className="homeowner-trust-icon-card" />
              <span className="homeowner-trust-text-card">Made in USA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <div className="homeowner-problem-section">
        <div className="homeowner-problem-background">
          {/* Water damage image background */}
        </div>
        
        <div className="homeowner-problem-overlay"></div>
        
        <div className="homeowner-problem-content">
          <h2 className="homeowner-problem-headline">The $10,000 Problem Hiding in Your AC</h2>
          <p className="homeowner-problem-subheadline">
            Most homeowners don't know they're at risk until it's too late
          </p>
          
          <div className="homeowner-problem-stats">
            <div className="homeowner-stat">
              <div className="homeowner-stat-icon-wrapper">
                <ExclamationTriangleIcon className="homeowner-stat-icon" />
              </div>
              <div className="homeowner-stat-number">$2,386</div>
              <div className="homeowner-stat-label">Average water damage repair cost</div>
            </div>
            
            <div className="homeowner-stat">
              <div className="homeowner-stat-icon-wrapper">
                <BeakerIcon className="homeowner-stat-icon" />
              </div>
              <div className="homeowner-stat-number">$3,000+</div>
              <div className="homeowner-stat-label">Mold remediation can add thousands more</div>
            </div>
            
            <div className="homeowner-stat">
              <div className="homeowner-stat-icon-wrapper">
                <BuildingOfficeIcon className="homeowner-stat-icon" />
              </div>
              <div className="homeowner-stat-number">1 in 3</div>
              <div className="homeowner-stat-label">Homes with AC experience drain clogs</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="homeowner-how-it-works-container">
        <div className="homeowner-how-it-works-header">
          <h2 className="homeowner-how-it-works-title">Install Protection in 3 Easy Steps</h2>
          <p className="homeowner-how-it-works-subtitle">
            No plumber needed. No special tools required. Just 30 minutes to peace of mind.
          </p>
        </div>
        
        <div className="homeowner-how-it-works-steps">
          <div className="homeowner-step">
            <div className="homeowner-step-icon">
              <WrenchScrewdriverIcon className="homeowner-icon" />
            </div>
            <div className="homeowner-step-number">Step 1</div>
            <h3 className="homeowner-step-title">Install in 30 Minutes</h3>
            <p className="homeowner-step-description">
              Simple DIY installation. Cut your existing drain line and attach with included fittings. Detailed instructions and video guide included.
            </p>
          </div>
          
          <div className="homeowner-step">
            <div className="homeowner-step-icon">
              <ShieldCheckIcon className="homeowner-icon" />
            </div>
            <div className="homeowner-step-number">Step 2</div>
            <h3 className="homeowner-step-title">Automatic Protection</h3>
            <p className="homeowner-step-description">
              AC Drain Wiz automatically prevents clogs and buildup. Patented technology ensures 24/7 protection without any maintenance required.
            </p>
          </div>
          
          <div className="homeowner-step">
            <div className="homeowner-step-icon">
              <HomeIcon className="homeowner-icon" />
            </div>
            <div className="homeowner-step-number">Step 3</div>
            <h3 className="homeowner-step-title">Peace of Mind</h3>
            <p className="homeowner-step-description">
              Sleep better knowing your home is protected from water damage. Saves thousands in potential repairs and eliminates AC breakdowns from clogged drains.
            </p>
          </div>
        </div>
        
        <div className="homeowner-how-it-works-cta">
          <button 
            onClick={() => setIsVideoModalOpen(true)}
            className="homeowner-cta-watch-video"
          >
            Watch Full Installation Video
          </button>
        </div>
      </div>

      {/* Product Showcase */}
      <div className="homeowner-product-showcase-container">
        <h2 className="homeowner-product-showcase-title">AC Drain Wiz Mini</h2>
        <p className="homeowner-product-showcase-subtitle">
          Universal fit for most residential AC systems. Professional protection at a homeowner-friendly price.
        </p>
        
        <div className="homeowner-product-card">
          <div className="homeowner-product-image">
            <img src="/images/ac-drain-wiz-logo.png" alt="AC Drain Wiz Mini" />
          </div>
          
          <div className="homeowner-product-details">
            <div className="homeowner-product-features">
              <div className="homeowner-feature">
                <CheckCircleIcon className="homeowner-feature-icon" />
                <span className="homeowner-feature-text">Universal fit for most residential AC systems</span>
              </div>
              <div className="homeowner-feature">
                <CheckCircleIcon className="homeowner-feature-icon" />
                <span className="homeowner-feature-text">Patented anti-clog technology</span>
              </div>
              <div className="homeowner-feature">
                <CheckCircleIcon className="homeowner-feature-icon" />
                <span className="homeowner-feature-text">No maintenance required for 5+ years</span>
              </div>
              <div className="homeowner-feature">
                <CheckCircleIcon className="homeowner-feature-icon" />
                <span className="homeowner-feature-text">Chemical-free operation</span>
              </div>
              <div className="homeowner-feature">
                <CheckCircleIcon className="homeowner-feature-icon" />
                <span className="homeowner-feature-text">Includes all installation hardware</span>
              </div>
            </div>
            
            <div className="homeowner-product-pricing">
              <div className="homeowner-price-main">
                <span className="homeowner-price-amount">$49.99</span>
                <span className="homeowner-price-label">One-time purchase</span>
              </div>
              <div className="homeowner-price-comparison">
                Professional installation costs $200-400
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/products?product=mini&action=buy')}
              className="homeowner-product-cta"
            >
              Add to Cart
            </button>
            
            <div className="homeowner-product-guarantee">
              <ShieldCheckIcon className="homeowner-guarantee-icon" />
              <div className="homeowner-guarantee-text">
                <strong>100% Money-Back Guarantee</strong>
                <span>If you're not satisfied within 30 days, we'll refund your purchase</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="homeowner-benefits-container">
        <h2 className="homeowner-benefits-title">Why Homeowners Choose AC Drain Wiz</h2>
        
        <div className="homeowner-benefits-grid">
          <div className="homeowner-benefit-card">
            <div className="homeowner-benefit-icon-wrapper">
              <CurrencyDollarIcon className="homeowner-benefit-icon" />
            </div>
            <h3 className="homeowner-benefit-title">Save Thousands</h3>
            <p className="homeowner-benefit-description">
              One $49.99 installation can prevent $2,000-10,000+ in water damage repairs, mold remediation, and ceiling/wall replacement.
            </p>
          </div>
          
          <div className="homeowner-benefit-card">
            <div className="homeowner-benefit-icon-wrapper">
              <WrenchIcon className="homeowner-benefit-icon" />
            </div>
            <h3 className="homeowner-benefit-title">DIY-Friendly</h3>
            <p className="homeowner-benefit-description">
              No plumber needed! Simple 30-minute installation with basic tools. Step-by-step instructions and video guide included with every unit.
            </p>
          </div>
          
          <div className="homeowner-benefit-card">
            <div className="homeowner-benefit-icon-wrapper">
              <LockClosedIcon className="homeowner-benefit-icon" />
            </div>
            <h3 className="homeowner-benefit-title">Set and Forget</h3>
            <p className="homeowner-benefit-description">
              Install once and forget it. No maintenance, no chemicals, no filters to replace. Works automatically 24/7 for 5+ years.
            </p>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="homeowner-testimonials-container">
        <h2 className="homeowner-testimonials-title">What Homeowners Say</h2>
        <p className="homeowner-testimonials-subtitle">Join 10,000+ protected homes across America</p>
        
        <div className="homeowner-testimonials-grid">
          <div className="homeowner-testimonial-card">
            <div className="homeowner-testimonial-stars">★★★★★</div>
            <p className="homeowner-testimonial-text">
              "After $8,000 in water damage from a clogged AC drain, I installed the AC Drain Wiz. Installation took me 45 minutes and I've had zero issues in 2 years. Best $50 I ever spent!"
            </p>
            <div className="homeowner-testimonial-author">
              <strong>Michael Rodriguez</strong>
              <span>Homeowner in Florida</span>
            </div>
          </div>
          
          <div className="homeowner-testimonial-card">
            <div className="homeowner-testimonial-stars">★★★★★</div>
            <p className="homeowner-testimonial-text">
              "Installation was incredibly easy. I'm not handy at all, but the instructions were clear and the video helped. My husband was impressed! No more algae buildup in our drain line."
            </p>
            <div className="homeowner-testimonial-author">
              <strong>Sarah Thompson</strong>
              <span>Homeowner in Texas</span>
            </div>
          </div>
          
          <div className="homeowner-testimonial-card">
            <div className="homeowner-testimonial-stars">★★★★★</div>
            <p className="homeowner-testimonial-text">
              "My HVAC tech recommended this after I had a callback. Said it would save me from expensive drain cleaning calls. He was right - 3 years and counting with no issues. Wish I'd known about this sooner!"
            </p>
            <div className="homeowner-testimonial-author">
              <strong>David Wilson</strong>
              <span>Homeowner in Arizona</span>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="homeowner-faq-container">
        <h2 className="homeowner-faq-title">Frequently Asked Questions</h2>
        
        <div className="homeowner-faq-list">
          <details className="homeowner-faq-item">
            <summary className="homeowner-faq-question">
              Is the AC Drain Wiz Mini compatible with my AC system?
            </summary>
            <div className="homeowner-faq-answer">
              <p>
                The AC Drain Wiz Mini works with most residential AC systems that use 3/4" PVC drain lines. This covers over 95% of home air conditioning systems in North America. If you're unsure about compatibility, feel free to contact our support team with your AC model information.
              </p>
            </div>
          </details>
          
          <details className="homeowner-faq-item">
            <summary className="homeowner-faq-question">
              Do I really not need a plumber to install this?
            </summary>
            <div className="homeowner-faq-answer">
              <p>
                Correct! The AC Drain Wiz Mini is designed for DIY installation. You'll need basic tools like a hacksaw or PVC cutter to cut your existing drain line, but the included instructions and video guide make installation straightforward. Most homeowners complete installation in 30-45 minutes. If you prefer professional installation, many HVAC contractors offer installation services.
              </p>
            </div>
          </details>
          
          <details className="homeowner-faq-item">
            <summary className="homeowner-faq-question">
              How long does the AC Drain Wiz last?
            </summary>
            <div className="homeowner-faq-answer">
              <p>
                The AC Drain Wiz Mini is designed to provide maintenance-free protection for 5+ years. Many of our customers report excellent performance well beyond this timeframe. There are no filters to replace, no chemicals to add, and no maintenance required. It simply works automatically to prevent drain clogs.
              </p>
            </div>
          </details>
          
          <details className="homeowner-faq-item">
            <summary className="homeowner-faq-question">
              What if it doesn't work for my system?
            </summary>
            <div className="homeowner-faq-answer">
              <p>
                We offer a 30-day money-back guarantee. If you're not completely satisfied with the AC Drain Wiz Mini for any reason, simply contact our customer support team and we'll provide a full refund. We stand behind our product because we know it works, but we want you to feel confident in your purchase.
              </p>
            </div>
          </details>
          
          <details className="homeowner-faq-item">
            <summary className="homeowner-faq-question">
              Will this void my AC warranty?
            </summary>
            <div className="homeowner-faq-answer">
              <p>
                No! The AC Drain Wiz Mini is installed in your drain line, which is not part of your AC unit's sealed refrigeration system. Adding a drain line accessory does not affect your manufacturer's warranty. In fact, preventing water damage from clogged drains can help protect your entire HVAC investment.
              </p>
            </div>
          </details>
        </div>
      </div>

      {/* Final CTA */}
      <div className="homeowner-final-cta-container">
        <div className="homeowner-final-cta-content">
          <h2 className="homeowner-final-cta-title">Protect Your Home Today</h2>
          <p className="homeowner-final-cta-subtitle">
            One simple installation can save you thousands in potential water damage repairs
          </p>
          
          <div className="homeowner-final-cta-buttons">
            <button 
              onClick={() => navigate('/products?product=mini')}
              className="homeowner-final-cta-primary"
            >
              Shop Now - $49.99
            </button>
            <button 
              onClick={() => navigate('/contact')}
              className="homeowner-final-cta-secondary"
            >
              Contact Support
            </button>
          </div>
          
          <div className="homeowner-final-trust-badges">
            <span className="homeowner-final-badge">✓ 30-Day Money Back Guarantee</span>
            <span className="homeowner-final-badge">✓ Free Shipping</span>
            <span className="homeowner-final-badge">✓ Made in USA</span>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="video-modal-overlay" onClick={() => setIsVideoModalOpen(false)}>
          <div className="video-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={() => setIsVideoModalOpen(false)}>
              ×
            </button>
            <div className="video-modal-content">
              <iframe
                src="https://player.vimeo.com/video/904848822?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                className="video-modal-embed"
                title="AC Drain Wiz Installation Guide"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

