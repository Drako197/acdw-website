import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IMaskInput } from 'react-imask'
import Calendar from 'react-calendar'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  BuildingOfficeIcon, 
  QuestionMarkCircleIcon,
  ShoppingCartIcon,
  WrenchScrewdriverIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline'

type ContactFormType = 'general' | 'support' | 'sales' | 'installer' | 'demo'

// Character limit for message field
const MESSAGE_MAX_LENGTH = 2000

interface FormData {
  name: string
  email: string
  company: string
  phone: string
  customerType: string
  message: string
  referralSource: string
  consent: boolean
  // Support-specific
  product?: string
  issueType?: string
  priority?: string
  // Sales-specific
  role?: string
  annualVolume?: string
  interest?: string
  // Installer-specific
  location?: string
  preferredContact?: string
  productToInstall?: string
  // Demo-specific
  demoType?: string
  preferredDate?: string
  preferredTime?: string
}

const formTypeConfig: Record<ContactFormType, {
  title: string
  description: string
  icon: typeof EnvelopeIcon
  buttonText: string
}> = {
  general: {
    title: 'General Contact',
    description: 'Send us a message and we\'ll get back to you as soon as possible.',
    icon: EnvelopeIcon,
    buttonText: 'Send Message'
  },
  support: {
    title: 'Support Request',
    description: 'Need help with your product? Our support team is here to assist you.',
    icon: QuestionMarkCircleIcon,
    buttonText: 'Submit Support Request'
  },
  sales: {
    title: 'Sales Inquiry',
    description: 'Interested in bulk pricing or becoming a partner? Let\'s talk.',
    icon: ShoppingCartIcon,
    buttonText: 'Request Information'
  },
  installer: {
    title: 'Find an Installer',
    description: 'Looking for a certified installer in your area? We can help connect you.',
    icon: WrenchScrewdriverIcon,
    buttonText: 'Find Installer'
  },
  demo: {
    title: 'Request Demo',
    description: 'Schedule a demo to see AC Drain Wiz products in action.',
    icon: PresentationChartLineIcon,
    buttonText: 'Schedule Demo'
  }
}

export function ContactPage() {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Get form type from URL parameter
  const getFormTypeFromURL = (): ContactFormType => {
    const params = new URLSearchParams(location.search)
    const type = params.get('type')
    
    // Map URL types to form types
    switch (type) {
      case 'support':
        return 'support'
      case 'sales':
        return 'sales'
      case 'installer':
        return 'installer'
      case 'demo-request':
        return 'demo'
      case 'case-study':
        // Case study links go to general contact
        return 'general'
      default:
        return 'general'
    }
  }

  const [activeFormType, setActiveFormType] = useState<ContactFormType>(getFormTypeFromURL())
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    customerType: '',
    message: '',
    referralSource: '',
    consent: false
  })

  // Update form type when URL changes
  useEffect(() => {
    const newType = getFormTypeFromURL()
    setActiveFormType(newType)
  }, [location.search])

  // Update URL when tab changes (without reload)
  const handleTabChange = (type: ContactFormType) => {
    setActiveFormType(type)
    const typeMap: Record<ContactFormType, string> = {
      general: '',
      support: 'support',
      sales: 'sales',
      installer: 'installer',
      demo: 'demo-request'
    }
    const urlType = typeMap[type]
    navigate(`/contact${urlType ? `?type=${urlType}` : ''}`, { replace: true })
  }

  // Validation function
  const validateField = (name: string, value: string | boolean): string => {
    switch (name) {
      case 'name':
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
          return 'Please enter your name'
        }
        break
      case 'email':
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
          return 'Please enter your email address'
        } else if (typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address'
        }
        break
      case 'phone':
        if (typeof value === 'string' && value.length > 0 && value.replace(/\D/g, '').length < 10) {
          return 'Please enter a valid phone number'
        }
        break
      case 'company':
        if ((activeFormType === 'sales' || activeFormType === 'demo') && (!value || (typeof value === 'string' && value.trim().length === 0))) {
          return 'Please enter your company name'
        }
        break
      case 'message':
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
          return 'Please enter a message'
        }
        break
      case 'product':
        if (activeFormType === 'support' && (!value || (typeof value === 'string' && value.trim().length === 0))) {
          return 'Please select a product'
        }
        break
      case 'issueType':
        if (activeFormType === 'support' && (!value || (typeof value === 'string' && value.trim().length === 0))) {
          return 'Please select an issue type'
        }
        break
      case 'role':
        if (activeFormType === 'sales' && (!value || (typeof value === 'string' && value.trim().length === 0))) {
          return 'Please select your role'
        }
        break
      case 'interest':
        if (activeFormType === 'sales' && (!value || (typeof value === 'string' && value.trim().length === 0))) {
          return 'Please select an interest type'
        }
        break
      case 'location':
        if (activeFormType === 'installer' && (!value || (typeof value === 'string' && value.trim().length === 0))) {
          return 'Please enter your location'
        }
        break
      case 'productToInstall':
        if (activeFormType === 'installer' && (!value || (typeof value === 'string' && value.trim().length === 0))) {
          return 'Please select a product to be installed'
        }
        break
      case 'demoType':
        if (activeFormType === 'demo' && (!value || (typeof value === 'string' && value.trim().length === 0))) {
          return 'Please select a demo type'
        }
        break
      case 'consent':
        if (!value) {
          return 'Please accept the privacy policy to continue'
        }
        break
    }
    return ''
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    // Enforce character limit for message field
    if (name === 'message' && value.length > MESSAGE_MAX_LENGTH) {
      return
    }
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
      // Validate checkbox
      if (touchedFields[name]) {
        const error = validateField(name, checked)
        setFieldErrors(prev => ({
          ...prev,
          [name]: error
        }))
      }
    } else {
    setFormData(prev => ({
      ...prev,
      [name]: value
      }))
      // Clear error when user starts typing
      if (fieldErrors[name]) {
        setFieldErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[name]
          return newErrors
        })
      }
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setTouchedFields(prev => ({ ...prev, [name]: true }))
    
    // Validate on blur
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    const error = validateField(name, fieldValue)
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  const handleDateChange = (value: Date | Date[] | null) => {
    if (value && !Array.isArray(value)) {
      // Format date as YYYY-MM-DD for form submission
      const formattedDate = value.toISOString().split('T')[0]
      const event = {
        target: { name: 'preferredDate', value: formattedDate, type: 'text' }
      } as React.ChangeEvent<HTMLInputElement>
      handleInputChange(event)
      
      // Clear error when date is selected
      if (fieldErrors.preferredDate) {
        setFieldErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.preferredDate
          return newErrors
        })
      }
    } else {
      // Clear date if null
      const event = {
        target: { name: 'preferredDate', value: '', type: 'text' }
      } as React.ChangeEvent<HTMLInputElement>
      handleInputChange(event)
    }
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')
    
    // Validate all fields
    const errors: Record<string, string> = {}
    const fieldsToValidate = ['name', 'email', 'message', 'consent']
    
    // Add form-specific required fields
    if (activeFormType === 'sales' || activeFormType === 'demo') {
      fieldsToValidate.push('company')
    }
    if (activeFormType === 'support') {
      fieldsToValidate.push('product', 'issueType')
    }
    if (activeFormType === 'sales') {
      fieldsToValidate.push('role', 'interest')
    }
    if (activeFormType === 'installer') {
      fieldsToValidate.push('location', 'productToInstall')
    }
    if (activeFormType === 'demo') {
      fieldsToValidate.push('demoType')
    }
    
    // Validate each field
    fieldsToValidate.forEach(fieldName => {
      const value = formData[fieldName as keyof FormData]
      const error = validateField(fieldName, value as string | boolean)
      if (error) {
        errors[fieldName] = error
        setTouchedFields(prev => ({ ...prev, [fieldName]: true }))
      }
    })
    
    // If there are validation errors, stop submission
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setIsSubmitting(false)
      return
    }
    
    // Prepare form data for Netlify
    const form = e.target as HTMLFormElement
    const formName = `contact-${activeFormType}`
    const netlifyData = new FormData(form)
    
    // Add form-name for Netlify
    netlifyData.append('form-name', formName)
    
    // Check if we're in development mode (multiple checks for reliability)
    const isDevelopment = 
      import.meta.env.DEV || 
      import.meta.env.MODE === 'development' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.port === '5173'
    
    // In development, simulate submission without making network request
    if (isDevelopment) {
      console.log('📝 [DEV MODE] Form submission simulated:', {
        formName,
        formType: activeFormType,
        data: Object.fromEntries(netlifyData)
      })
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulate success
      setSubmitSuccess(true)
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        customerType: '',
        message: '',
        referralSource: '',
        consent: false,
        product: '',
        issueType: '',
        priority: '',
        role: '',
        annualVolume: '',
        interest: '',
        location: '',
        preferredContact: '',
        productToInstall: '',
        demoType: '',
        preferredDate: '',
        preferredTime: ''
      })
      // Reset errors
      setFieldErrors({})
      setTouchedFields({})
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000)
      setIsSubmitting(false)
      return
    }
    
    // Production: Submit to Netlify
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(netlifyData as any).toString()
      })
      
      if (response.ok) {
        setSubmitSuccess(true)
        // Reset form
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          customerType: '',
          message: '',
          referralSource: '',
          consent: false,
          product: '',
          issueType: '',
          priority: '',
          role: '',
          annualVolume: '',
          interest: '',
          location: '',
          preferredContact: '',
          productToInstall: '',
          demoType: '',
          preferredDate: '',
          preferredTime: ''
        })
        // Reset errors
        setFieldErrors({})
        setTouchedFields({})
        
        // Reset success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000)
      } else {
        setSubmitError('Something went wrong. Please try again or email us directly.')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const activeConfig = formTypeConfig[activeFormType]
  const ActiveIcon = activeConfig.icon

  return (
    <div className="contact-page-container">
      <div className="container py-16">
        {/* Header */}
        <div className="contact-page-header">
          <h1 className="heading-1 mb-6">Contact AC Drain Wiz</h1>
          <p className="text-large max-w-3xl mx-auto">
            Get in touch with our team for product information, pricing, technical support, 
            or to schedule a demo. We're here to help with your AC drain line maintenance needs.
          </p>
        </div>

        <div className="contact-content-wrapper">
          {/* Tabs */}
          <div className="contact-tabs-container">
            <h3 className="contact-tabs-subhead">Choose the contact form that best fits your inquiry</h3>
            <div className="contact-tabs-wrapper">
              {Object.entries(formTypeConfig).map(([type, config]) => {
                const Icon = config.icon
                const isActive = activeFormType === type
                return (
                  <button
                    key={type}
                    onClick={() => handleTabChange(type as ContactFormType)}
                    className={`contact-tab-button ${isActive ? 'contact-tab-button-active' : 'contact-tab-button-inactive'}`}
                  >
                    <Icon className="contact-tab-icon" />
                    <span>{config.title}</span>
                  </button>
                )
              })}
            </div>
                  </div>

          <div className="contact-layout-grid">
            {/* Form Section */}
            <div className="contact-form-section">
              <div className="contact-form-card">
                <div className="contact-form-header">
                  <div className="contact-form-icon-wrapper">
                    <ActiveIcon className="contact-form-icon" />
                  </div>
                  <div className="contact-form-title-section">
                    <h2 className="contact-form-title">{activeConfig.title}</h2>
                    <p className="contact-form-description">{activeConfig.description}</p>
            </div>
          </div>

                <form 
                  onSubmit={handleSubmit} 
                  className="contact-form-field"
                  name={`contact-${activeFormType}`}
                  data-netlify="true"
                  data-netlify-honeypot="bot-field"
                  noValidate
                >
                  {/* Hidden Fields for Netlify */}
                  <input type="hidden" name="form-name" value={`contact-${activeFormType}`} />
                  <input type="hidden" name="form-type" value={activeFormType} />
                  
                  {/* Honeypot field for spam protection (hidden from users) */}
                  <div style={{ display: 'none' }}>
                    <label>
                      Don't fill this out if you're human: <input name="bot-field" />
                    </label>
                  </div>
                  
                  {/* Common Fields */}
                  <div className="contact-form-grid">
                <div>
                      <label htmlFor="name" className="contact-form-label">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    className={`input ${fieldErrors.name ? 'input-error' : ''}`}
                    placeholder="Your full name"
                  />
                  {fieldErrors.name && (
                    <p className="field-error-message">{fieldErrors.name}</p>
                  )}
                </div>
                <div>
                      <label htmlFor="email" className="contact-form-label">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    className={`input ${fieldErrors.email ? 'input-error' : ''}`}
                    placeholder="your.email@example.com"
                  />
                  {fieldErrors.email && (
                    <p className="field-error-message">{fieldErrors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                      <label htmlFor="phone" className="contact-form-label">
                        Phone Number
                      </label>
                      <IMaskInput
                        mask="(000) 000-0000"
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onAccept={(value) => {
                          const event = {
                            target: { name: 'phone', value, type: 'tel' }
                          } as React.ChangeEvent<HTMLInputElement>
                          handleInputChange(event)
                        }}
                        onBlur={() => {
                          const event = {
                            target: { name: 'phone', value: formData.phone, type: 'tel' }
                          } as React.FocusEvent<HTMLInputElement>
                          handleBlur(event)
                        }}
                        className={`input ${fieldErrors.phone ? 'input-error' : ''}`}
                        placeholder="(555) 123-4567"
                        unmask={false}
                      />
                      {fieldErrors.phone && (
                        <p className="field-error-message">{fieldErrors.phone}</p>
                      )}
                    </div>
                    {activeFormType !== 'installer' && (
                      <div>
                        <label htmlFor="company" className="contact-form-label">
                          Company {activeFormType === 'sales' || activeFormType === 'demo' ? '*' : ''}
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                          onBlur={handleBlur}
                          required={activeFormType === 'sales' || activeFormType === 'demo'}
                          className={`input ${fieldErrors.company ? 'input-error' : ''}`}
                    placeholder="Your company name"
                  />
                        {fieldErrors.company && (
                          <p className="field-error-message">{fieldErrors.company}</p>
                        )}
                      </div>
                    )}
                </div>

                  {/* How did you hear about us - for general, sales, and demo */}
                  {(activeFormType === 'general' || activeFormType === 'sales' || activeFormType === 'demo') && (
                <div>
                      <label htmlFor="referralSource" className="contact-form-label">
                        How did you hear about us?
                  </label>
                      <select
                        id="referralSource"
                        name="referralSource"
                        value={formData.referralSource}
                    onChange={handleInputChange}
                    className="input"
                      >
                        <option value="">Select an option</option>
                        <option value="search-engine">Search Engine (Google, Bing, etc.)</option>
                        <option value="social-media">Social Media</option>
                        <option value="hvac-contractor">Referred by HVAC Contractor</option>
                        <option value="friend-family">Friend or Family</option>
                        <option value="trade-show">Trade Show or Event</option>
                        <option value="online-ad">Online Advertisement</option>
                        <option value="article-blog">Article or Blog Post</option>
                        <option value="other">Other</option>
                      </select>
                </div>
                  )}

                  {/* Form Type Specific Fields */}
                  {activeFormType === 'general' && (
                    <>
              <div>
                        <label htmlFor="customerType" className="contact-form-label">
                  Customer Type
                </label>
                <select
                  id="customerType"
                  name="customerType"
                  value={formData.customerType}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="">Select your customer type</option>
                  <option value="homeowner">Homeowner</option>
                  <option value="hvac-contractor">HVAC Contractor</option>
                          <option value="property-manager">Property Manager</option>
                  <option value="city-official">City/Code Official</option>
                  <option value="other">Other</option>
                </select>
              </div>
                    </>
                  )}

                  {activeFormType === 'support' && (
                    <>
                      <div className="contact-form-grid">
                        <div>
                          <label htmlFor="product" className="contact-form-label">
                            Product *
                          </label>
                          <select
                            id="product"
                            name="product"
                            value={formData.product || ''}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                            className={`input ${fieldErrors.product ? 'input-error' : ''}`}
                          >
                            <option value="">Select a product</option>
                            <option value="mini">AC Drain Wiz Mini</option>
                            <option value="sensor">AC Drain Wiz Sensor</option>
                            <option value="mini-sensor">Mini + Sensor Combo</option>
                            <option value="core-1.0">Core 1.0</option>
                            <option value="other">Other</option>
                          </select>
                          {fieldErrors.product && (
                            <p className="field-error-message">{fieldErrors.product}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="issueType" className="contact-form-label">
                            Issue Type *
                          </label>
                          <select
                            id="issueType"
                            name="issueType"
                            value={formData.issueType || ''}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                            className={`input ${fieldErrors.issueType ? 'input-error' : ''}`}
                          >
                            <option value="">Select issue type</option>
                            <option value="installation">Installation Help</option>
                            <option value="technical">Technical Issue</option>
                            <option value="warranty">Warranty Question</option>
                            <option value="parts">Replacement Parts</option>
                            <option value="other">Other</option>
                          </select>
                          {fieldErrors.issueType && (
                            <p className="field-error-message">{fieldErrors.issueType}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label htmlFor="priority" className="contact-form-label">
                          Priority
                        </label>
                        <select
                          id="priority"
                          name="priority"
                          value={formData.priority || ''}
                          onChange={handleInputChange}
                          className="input"
                        >
                          <option value="low">Low - General question</option>
                          <option value="medium">Medium - Need help soon</option>
                          <option value="high">High - Urgent issue</option>
                        </select>
                      </div>
                    </>
                  )}

                  {activeFormType === 'sales' && (
                    <>
                      <div className="contact-form-grid">
                        <div>
                          <label htmlFor="role" className="contact-form-label">
                            Your Role *
                          </label>
                          <select
                            id="role"
                            name="role"
                            value={formData.role || ''}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                            className={`input ${fieldErrors.role ? 'input-error' : ''}`}
                          >
                            <option value="">Select your role</option>
                            <option value="hvac-contractor">HVAC Contractor</option>
                            <option value="property-manager">Property Manager</option>
                            <option value="retailer">Retailer</option>
                            <option value="purchasing-manager">Purchasing Manager</option>
                            <option value="other">Other</option>
                          </select>
                          {fieldErrors.role && (
                            <p className="field-error-message">{fieldErrors.role}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="annualVolume" className="contact-form-label">
                            Annual Volume
                          </label>
                          <select
                            id="annualVolume"
                            name="annualVolume"
                            value={formData.annualVolume || ''}
                            onChange={handleInputChange}
                            className="input"
                          >
                            <option value="">Select volume range</option>
                            <option value="1-50">1-50 units/year</option>
                            <option value="51-200">51-200 units/year</option>
                            <option value="201-500">201-500 units/year</option>
                            <option value="500+">500+ units/year</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="interest" className="contact-form-label">
                          Interest Type *
                        </label>
                        <select
                          id="interest"
                          name="interest"
                          value={formData.interest || ''}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          required
                          className={`input ${fieldErrors.interest ? 'input-error' : ''}`}
                        >
                          <option value="">Select interest type</option>
                          <option value="bulk-pricing">Bulk Pricing</option>
                          <option value="partner-program">Partner Program</option>
                          <option value="portfolio-installation">Portfolio Installation</option>
                          <option value="custom-solution">Custom Solution</option>
                          <option value="other">Other</option>
                        </select>
                        {fieldErrors.interest && (
                          <p className="field-error-message">{fieldErrors.interest}</p>
                        )}
                      </div>
                    </>
                  )}

                  {activeFormType === 'installer' && (
                    <>
                      <div>
                        <label htmlFor="location" className="contact-form-label">
                          Location (ZIP or City) *
                        </label>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={formData.location || ''}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          required
                          className={`input ${fieldErrors.location ? 'input-error' : ''}`}
                          placeholder="ZIP code or city name"
                        />
                        {fieldErrors.location && (
                          <p className="field-error-message">{fieldErrors.location}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="productToInstall" className="contact-form-label">
                          Product to be installed *
                        </label>
                        <select
                          id="productToInstall"
                          name="productToInstall"
                          value={formData.productToInstall || ''}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          required
                          className={`input ${fieldErrors.productToInstall ? 'input-error' : ''}`}
                        >
                          <option value="">Select a product</option>
                          <option value="mini">ACDW Mini</option>
                          <option value="sensor">ACDW Sensor</option>
                          <option value="mini-sensor">ACDW Mini & Sensor Combo</option>
                        </select>
                        {fieldErrors.productToInstall && (
                          <p className="field-error-message">{fieldErrors.productToInstall}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="preferredContact" className="contact-form-label">
                          Preferred Contact Method
                        </label>
                        <select
                          id="preferredContact"
                          name="preferredContact"
                          value={formData.preferredContact || ''}
                          onChange={handleInputChange}
                          className="input"
                        >
                          <option value="">Select method</option>
                          <option value="email">Email</option>
                          <option value="phone">Phone</option>
                          <option value="either">Either</option>
                        </select>
                      </div>
                    </>
                  )}

                  {activeFormType === 'demo' && (
                    <>
                      <div className="contact-form-grid">
                        <div>
                          <label htmlFor="demoType" className="contact-form-label">
                            Demo Type *
                          </label>
                          <select
                            id="demoType"
                            name="demoType"
                            value={formData.demoType || ''}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                            className={`input ${fieldErrors.demoType ? 'input-error' : ''}`}
                          >
                            <option value="">Select demo type</option>
                            <option value="in-person">In-Person Demo</option>
                            <option value="virtual">Virtual Demo</option>
                            <option value="product-showcase">Product Showcase</option>
                            <option value="compliance-review">Compliance Review</option>
                          </select>
                          {fieldErrors.demoType && (
                            <p className="field-error-message">{fieldErrors.demoType}</p>
                          )}
                        </div>
                        <div>
                          <label className="contact-form-label">
                            Preferred Date
                          </label>
                          <div className="calendar-container">
                            <Calendar
                              onChange={handleDateChange}
                              value={formData.preferredDate ? new Date(formData.preferredDate) : null}
                              minDate={new Date()}
                              className="custom-calendar"
                            />
                          </div>
                          {fieldErrors.preferredDate && (
                            <p className="field-error-message">{fieldErrors.preferredDate}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label htmlFor="preferredTime" className="contact-form-label">
                          Preferred Time
                        </label>
                        <select
                          id="preferredTime"
                          name="preferredTime"
                          value={formData.preferredTime || ''}
                          onChange={handleInputChange}
                          className="input"
                        >
                          <option value="">Select time</option>
                          <option value="morning">Morning (9 AM - 12 PM)</option>
                          <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                          <option value="flexible">Flexible</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* Message Field */}
              <div>
                    <label htmlFor="message" className="contact-form-label">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                      rows={3}
                      maxLength={MESSAGE_MAX_LENGTH}
                  className={`input ${fieldErrors.message ? 'input-error' : ''}`}
                      placeholder={
                        activeFormType === 'support' ? 'Describe your issue or question...' :
                        activeFormType === 'sales' ? 'Tell us about your needs and how we can help...' :
                        activeFormType === 'installer' ? 'Any specific requirements or preferences...' :
                        activeFormType === 'demo' ? 'Additional details about your demo request...' :
                        'Tell us about your needs, questions, or how we can help...'
                      }
                    />
                    {fieldErrors.message && (
                      <p className="field-error-message">{fieldErrors.message}</p>
                    )}
                    <div className="contact-form-char-count">
                      <span className={`contact-form-char-count-text ${
                        formData.message.length > MESSAGE_MAX_LENGTH * 0.9 
                          ? 'contact-form-char-count-warning' 
                          : ''
                      }`}>
                        {formData.message.length} / {MESSAGE_MAX_LENGTH} characters
                      </span>
                    </div>
              </div>

                  {/* Privacy Consent */}
                  <div className="mt-6">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        required
                        className={`mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded ${fieldErrors.consent ? 'border-red-500' : ''}`}
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        I agree to the <button type="button" onClick={() => navigate('/privacy-policy')} className="text-primary-600 hover:text-primary-700 underline">Privacy Policy</button> and consent to AC Drain Wiz contacting me via email or phone regarding my inquiry. *
                      </span>
                    </label>
                    {fieldErrors.consent && (
                      <p className="field-error-message ml-6">{fieldErrors.consent}</p>
                    )}
                  </div>

                  {/* Success Message */}
                  {submitSuccess && (
                    <div className="rounded-md bg-green-50 p-4">
                      <div className="text-sm text-green-800">
                        <strong>Thank you!</strong> Your message has been sent successfully. We'll get back to you within 24 hours.
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {submitError && (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="text-sm text-red-700">{submitError}</div>
                    </div>
                  )}

              <button
                type="submit"
                    disabled={isSubmitting}
                    className="contact-form-submit-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                    {isSubmitting ? 'Sending...' : activeConfig.buttonText}
              </button>
            </form>
              </div>
            </div>

            {/* Contact Information Sidebar */}
            <div className="contact-sidebar">
              <div className="contact-sidebar-card">
                <h2 className="contact-sidebar-title">Get in Touch</h2>
                
                {/* Leadership Contact */}
                <div className="contact-leadership-section">
                  <h3 className="contact-leadership-title">Leadership</h3>
                  <div className="contact-leadership-content">
                    <div className="contact-leadership-avatar">
                      <BuildingOfficeIcon className="contact-leadership-icon" />
                    </div>
                    <div>
                      <h4 className="contact-leadership-name">Alan Riddle</h4>
                      <p className="contact-leadership-role">Founder & CEO</p>
                      <div className="contact-leadership-links">
                        <a 
                          href="mailto:ariddle@acdrainwiz.com" 
                          className="contact-leadership-link"
                        >
                          <EnvelopeIcon className="contact-leadership-link-icon" />
                          <span>ariddle@acdrainwiz.com</span>
                        </a>
                        <a 
                          href="tel:+15616545237" 
                          className="contact-leadership-link"
                        >
                          <PhoneIcon className="contact-leadership-link-icon" />
                          <span>(561) 654-5237</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Contact Info */}
                <div className="contact-quick-info-section">
                  <h3 className="contact-quick-info-title">Quick Contact</h3>
                  <div className="contact-quick-info-list">
                    <p><strong>Email:</strong> info@acdrainwiz.com</p>
                    <p><strong>Phone:</strong> 1-800-AC-DRAIN</p>
                    <p><strong>Hours:</strong> Mon-Fri, 8 AM - 5 PM EST</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8 max-w-6xl mx-auto">
          <h2 className="heading-2 mb-6 text-center">Why Choose AC Drain Wiz?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <EnvelopeIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Expert Support</h3>
              <p className="text-sm text-gray-600">Professional technical support and guidance from our experienced team</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BuildingOfficeIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Industry Expertise</h3>
              <p className="text-sm text-gray-600">Deep understanding of HVAC maintenance challenges and solutions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PhoneIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quick Response</h3>
              <p className="text-sm text-gray-600">Fast response times to help you get back to work quickly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
