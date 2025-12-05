import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, TruckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export function ShippingPolicyPage() {
  const navigate = useNavigate()

  return (
    <div className="legal-page-container">
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="legal-page-back-button"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Back
            </button>
          </div>

          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <TruckIcon className="h-16 w-16 text-orange-600" />
            </div>
            <h1 className="heading-1 mb-4">Shipping Policy</h1>
            <p className="text-large text-gray-600 mb-2">
              Delivery information and shipping terms
            </p>
            <p className="text-sm text-gray-500">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Important Notice */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-12">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-6 w-6 text-orange-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-900 mb-2">⚠️ This is a Temporary Policy</h3>
                <p className="text-sm text-orange-800">
                  This shipping policy is a template based on your current shipping configuration. 
                  Please review all sections and update with your actual shipping methods, costs, and delivery timeframes before going live.
                </p>
              </div>
            </div>
          </div>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-gray-700 leading-relaxed">
              This Shipping Policy outlines our shipping methods, delivery timeframes, costs, and terms. 
              Please review this information carefully before placing an order.
            </p>
            <p className="text-gray-700 leading-relaxed">
              All orders are processed and shipped from our fulfillment center. We strive to ship orders quickly 
              and deliver them safely to your door.
            </p>
          </div>

          {/* Section 1: Processing Time */}
          <div id="processing-time" className="mb-12">
            <h2 className="legal-section-title">1. Order Processing</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                Orders are typically processed within <strong>1-2 business days</strong> after payment confirmation.
              </p>
              <p className="text-gray-700">
                <strong>Note:</strong> Processing times may be longer during peak seasons, holidays, or promotional periods. 
                You will receive an email confirmation with tracking information once your order ships.
              </p>
              <p className="text-gray-700 mt-4">
                <strong>Business Days:</strong> We process orders Monday through Friday, excluding federal holidays.
              </p>
            </div>
          </div>

          {/* Section 2: Shipping Methods */}
          <div id="shipping-methods" className="mb-12">
            <h2 className="legal-section-title">2. Shipping Methods & Delivery Timeframes</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">We offer the following shipping options:</p>
              
              {/* US Shipping */}
              <div className="bg-gray-50 rounded-lg p-6 mb-4">
                <h3 className="font-semibold text-gray-900 mb-3">Standard Shipping (United States)</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Cost:</strong> $15.00</li>
                  <li><strong>Delivery Time:</strong> 5-7 business days</li>
                  <li><strong>Carrier:</strong> UPS or FedEx</li>
                  <li><strong>Tracking:</strong> Included - tracking number provided via email</li>
                </ul>
              </div>

              {/* Canada Shipping */}
              <div className="bg-gray-50 rounded-lg p-6 mb-4">
                <h3 className="font-semibold text-gray-900 mb-3">Standard Shipping (Canada)</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Cost:</strong> $20.00</li>
                  <li><strong>Delivery Time:</strong> 7-14 business days</li>
                  <li><strong>Carrier:</strong> UPS or FedEx</li>
                  <li><strong>Tracking:</strong> Included - tracking number provided via email</li>
                  <li><strong>Customs & Duties:</strong> Additional fees may apply and are the responsibility of the customer</li>
                </ul>
              </div>

              {/* Free Shipping */}
              <div className="bg-orange-50 rounded-lg p-6 mb-4">
                <h3 className="font-semibold text-orange-900 mb-3">Free Shipping</h3>
                <p className="text-gray-700 mb-2">
                  Free standard shipping is available for orders over <strong>$50.00</strong> (before tax).
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Note:</strong> Free shipping applies to standard shipping only. Express shipping options (if available) 
                  may have different thresholds or may not be eligible for free shipping.
                </p>
              </div>

              {/* Express Shipping (if applicable) */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Express Shipping (Optional)</h3>
                <p className="text-gray-700">
                  <strong>Note:</strong> If you plan to offer express shipping, add details here:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-2">
                  <li>Cost: [TO BE DETERMINED]</li>
                  <li>Delivery Time: [TO BE DETERMINED - e.g., 2-3 business days]</li>
                  <li>Availability: [TO BE DETERMINED - e.g., Continental US only]</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: Shipping Costs */}
          <div id="shipping-costs" className="mb-12">
            <h2 className="legal-section-title">3. Shipping Costs</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">Shipping costs are calculated based on:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Destination (United States, Canada, International)</li>
                <li>Shipping method selected (Standard, Express, etc.)</li>
                <li>Order weight and dimensions</li>
                <li>Free shipping eligibility (orders over $50)</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Shipping costs are displayed during checkout before you complete your purchase. 
                You can review shipping options and costs before finalizing your order.
              </p>
            </div>
          </div>

          {/* Section 4: Shipping Destinations */}
          <div id="shipping-destinations" className="mb-12">
            <h2 className="legal-section-title">4. Shipping Destinations</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">We currently ship to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>United States:</strong> All 50 states, including Alaska and Hawaii</li>
                <li><strong>Canada:</strong> All provinces and territories</li>
                <li><strong>International:</strong> [TO BE DETERMINED - Specify if you ship internationally]</li>
              </ul>
              <p className="text-gray-700 mt-4">
                <strong>Note:</strong> Some remote locations may have extended delivery times or additional shipping fees. 
                Contact us at <a href="mailto:support@acdrainwiz.com" className="text-orange-600 hover:text-orange-700">support@acdrainwiz.com</a> if you have questions about shipping to your location.
              </p>
            </div>
          </div>

          {/* Section 5: Tracking Information */}
          <div id="tracking" className="mb-12">
            <h2 className="legal-section-title">5. Order Tracking</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                Once your order ships, you will receive an email with:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Tracking number</li>
                <li>Carrier information</li>
                <li>Link to track your package</li>
                <li>Estimated delivery date</li>
              </ul>
              <p className="text-gray-700 mt-4">
                You can also track your order by logging into your account and viewing your order history.
              </p>
            </div>
          </div>

          {/* Section 6: Delivery Issues */}
          <div id="delivery-issues" className="mb-12">
            <h2 className="legal-section-title">6. Delivery Issues</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                If you experience any of the following delivery issues, please contact us immediately:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Delayed Delivery:</strong> If your order hasn't arrived within the estimated delivery timeframe</li>
                <li><strong>Lost Package:</strong> If tracking shows delivered but you haven't received it</li>
                <li><strong>Damaged Package:</strong> If your order arrives damaged</li>
                <li><strong>Wrong Address:</strong> If you need to update your shipping address</li>
                <li><strong>Missing Items:</strong> If your order is incomplete</li>
              </ul>
              <p className="text-gray-700 mt-4">
                <strong>Contact Us:</strong>
              </p>
              <ul className="list-none space-y-2 text-gray-700">
                <li>Email: <a href="mailto:support@acdrainwiz.com" className="text-orange-600 hover:text-orange-700">support@acdrainwiz.com</a></li>
                <li>Phone: <strong>(561) 654-5237</strong></li>
                <li>Please include your order number and tracking information</li>
              </ul>
            </div>
          </div>

          {/* Section 7: International Shipping */}
          <div id="international-shipping" className="mb-12">
            <h2 className="legal-section-title">7. International Shipping (If Applicable)</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                <strong>Note:</strong> Update this section if you ship internationally beyond US and Canada.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Customs duties and taxes are the responsibility of the customer</li>
                <li>Delivery times may vary significantly</li>
                <li>Some products may not be available for international shipping</li>
                <li>Additional shipping fees may apply</li>
                <li>International returns may have different terms (see Return Policy)</li>
              </ul>
            </div>
          </div>

          {/* Section 8: Address Accuracy */}
          <div id="address-accuracy" className="mb-12">
            <h2 className="legal-section-title">8. Shipping Address Accuracy</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                Please ensure your shipping address is correct at checkout. We are not responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Orders shipped to incorrect addresses provided by the customer</li>
                <li>Delays or failed deliveries due to incorrect address information</li>
                <li>Additional shipping costs for address corrections or re-shipments</li>
              </ul>
              <p className="text-gray-700 mt-4">
                If you need to change your shipping address after placing an order, contact us immediately. 
                We can only modify addresses before the order ships.
              </p>
            </div>
          </div>

          {/* Section 9: Contact Information */}
          <div id="contact" className="mb-12">
            <h2 className="legal-section-title">9. Questions About Shipping?</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                If you have questions about our shipping policy, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>Email:</strong>{' '}
                    <a href="mailto:support@acdrainwiz.com" className="text-orange-600 hover:text-orange-700">
                      support@acdrainwiz.com
                    </a>
                  </li>
                  <li>
                    <strong>Phone:</strong> (561) 654-5237
                  </li>
                  <li>
                    <strong>Business Hours:</strong> [TO BE DETERMINED - Add your business hours]
                  </li>
                  <li>
                    <strong>Website:</strong>{' '}
                    <a href="https://www.acdrainwiz.com" className="text-orange-600 hover:text-orange-700">
                      www.acdrainwiz.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 10: Policy Updates */}
          <div id="policy-updates" className="mb-12">
            <h2 className="legal-section-title">10. Policy Updates</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700">
                We reserve the right to update this Shipping Policy at any time. 
                Changes will be posted on this page with an updated "Last Updated" date. 
                Shipping terms for orders placed before policy updates will be honored as stated at the time of purchase.
              </p>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="border-t pt-8 mt-12">
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#processing-time" className="text-orange-600 hover:text-orange-700 text-sm">
                Processing Time
              </a>
              <a href="#shipping-methods" className="text-orange-600 hover:text-orange-700 text-sm">
                Shipping Methods
              </a>
              <a href="#shipping-costs" className="text-orange-600 hover:text-orange-700 text-sm">
                Shipping Costs
              </a>
              <a href="#tracking" className="text-orange-600 hover:text-orange-700 text-sm">
                Tracking
              </a>
              <a href="#contact" className="text-orange-600 hover:text-orange-700 text-sm">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

