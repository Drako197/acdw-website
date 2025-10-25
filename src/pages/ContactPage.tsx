import { useState } from 'react'
import { EnvelopeIcon, PhoneIcon, BuildingOfficeIcon, UserIcon } from '@heroicons/react/24/outline'

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    customerType: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    // Reset form
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      customerType: '',
      message: ''
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="heading-1 mb-6">Contact AC Drain Wiz</h1>
          <p className="text-large text-gray-600 max-w-3xl mx-auto">
            Get in touch with our team for product information, pricing, technical support, 
            or to schedule a demo. We're here to help with your AC drain line maintenance needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="heading-2 mb-6">Get in Touch</h2>
            
            {/* Leadership Contact */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Leadership</h3>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Alan Riddle</h4>
                  <p className="text-blue-600 mb-2">Founder & CEO</p>
                  <div className="space-y-2">
                    <a 
                      href="mailto:ariddle@acdrainwiz.com" 
                      className="flex items-center text-gray-600 hover:text-blue-600"
                    >
                      <EnvelopeIcon className="h-4 w-4 mr-2" />
                      <span className="text-sm">ariddle@acdrainwiz.com</span>
                    </a>
                    <a 
                      href="tel:+15616545237" 
                      className="flex items-center text-gray-600 hover:text-blue-600"
                    >
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      <span className="text-sm">(561) 654-5237</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Quick Contact Options</h3>
              <div className="grid grid-cols-1 gap-4">
                <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <UserIcon className="h-5 w-5 text-blue-600 mr-3" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">HVAC Contractors</div>
                    <div className="text-sm text-gray-600">Pricing, bulk orders, technical support</div>
                  </div>
                </button>
                <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <BuildingOfficeIcon className="h-5 w-5 text-blue-600 mr-3" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Distributors & Wholesalers</div>
                    <div className="text-sm text-gray-600">Partnership opportunities, bulk pricing</div>
                  </div>
                </button>
                <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <BuildingOfficeIcon className="h-5 w-5 text-blue-600 mr-3" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">City/Code Officials</div>
                    <div className="text-sm text-gray-600">Compliance information, demo requests</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="heading-2 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="input"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="input"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="customerType" className="block text-sm font-medium text-gray-700 mb-2">
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
                  <option value="distributor">Distributor/Wholesaler</option>
                  <option value="city-official">City/Code Official</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="input"
                  placeholder="Tell us about your needs, questions, or how we can help..."
                />
              </div>

              <button
                type="submit"
                className="w-full btn btn-primary btn-lg"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
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
