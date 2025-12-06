import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

interface ShippingAddress {
  name: string
  line1: string
  line2: string
  city: string
  state: string
  zip: string
  country: string
}

interface CartItem {
  product: string
  productName: string
  quantity: number
  priceId: string
  unitPrice: number
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, isAuthenticated } = useAuth()
  
  // Cart state
  const [cart, setCart] = useState<CartItem | null>(null)
  
  // Shipping address state
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: user?.name || '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  })
  
  // Form state
  const [shippingCost, setShippingCost] = useState<number | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Parse cart data from URL params
  // SECURITY NOTE: These params come from get-price-id (server-side), but validate anyway
  useEffect(() => {
    const product = searchParams.get('product')
    const productName = searchParams.get('productName')
    const quantity = searchParams.get('quantity')
    const priceId = searchParams.get('priceId')
    const unitPrice = searchParams.get('unitPrice')
    
    if (!product || !quantity || !priceId || !unitPrice) {
      // Missing required params, redirect back
      navigate('/products')
      return
    }
    
    // Validate product type
    const validProducts = ['mini', 'sensor', 'bundle']
    if (!validProducts.includes(product)) {
      console.error('Invalid product type:', product)
      navigate('/products')
      return
    }
    
    // Validate quantity
    const qty = parseInt(quantity)
    if (isNaN(qty) || qty < 1 || qty > 500) {
      console.error('Invalid quantity:', quantity)
      navigate('/products')
      return
    }
    
    // Validate price ID format (should start with price_)
    if (!priceId.startsWith('price_')) {
      console.error('Invalid price ID format:', priceId)
      navigate('/products')
      return
    }
    
    // Validate unit price
    const price = parseFloat(unitPrice)
    if (isNaN(price) || price < 0 || price > 10000) {
      console.error('Invalid unit price:', unitPrice)
      navigate('/products')
      return
    }
    
    setCart({
      product: sanitizeInput(product),
      productName: sanitizeInput(productName || product.charAt(0).toUpperCase() + product.slice(1)),
      quantity: qty,
      priceId: sanitizeInput(priceId),
      unitPrice: price,
    })
  }, [searchParams, navigate])

  // Auto-calculate shipping when address is complete
  useEffect(() => {
    if (cart && shippingAddress.city && shippingAddress.state && shippingAddress.zip) {
      calculateShipping()
    }
  }, [shippingAddress.city, shippingAddress.state, shippingAddress.zip, cart])

  // Basic client-side sanitization to prevent XSS
  const sanitizeInput = (value: string): string => {
    return value
      .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
      .trim()
  }

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    // Sanitize input before storing
    const sanitizedValue = sanitizeInput(value)
    setShippingAddress(prev => ({ ...prev, [field]: sanitizedValue }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const calculateShipping = async () => {
    if (!cart) return
    
    setIsCalculating(true)
    
    try {
      // Call our shipping calculator
      const response = await fetch('/.netlify/functions/calculate-shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: {
            city: shippingAddress.city,
            state: shippingAddress.state,
            postal_code: shippingAddress.zip,
            country: shippingAddress.country,
          },
          products: {
            [cart.product]: cart.quantity,
          },
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setShippingCost(data.cost)
      } else {
        console.error('Shipping calculation failed')
        setShippingCost(null)
      }
    } catch (error) {
      console.error('Error calculating shipping:', error)
      setShippingCost(null)
    } finally {
      setIsCalculating(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}
    
    if (!shippingAddress.name.trim()) {
      newErrors.name = 'Please enter your full name'
    }
    
    if (!shippingAddress.line1.trim()) {
      newErrors.line1 = 'Please enter your street address'
    }
    
    if (!shippingAddress.city.trim()) {
      newErrors.city = 'Please enter your city'
    }
    
    if (!shippingAddress.state.trim()) {
      newErrors.state = 'Please enter your state'
    } else if (shippingAddress.country === 'US' && shippingAddress.state.length !== 2) {
      newErrors.state = 'Please enter 2-letter state code (e.g., FL)'
    }
    
    if (!shippingAddress.zip.trim()) {
      newErrors.zip = 'Please enter your ZIP code'
    } else if (shippingAddress.country === 'US' && !/^\d{5}(-\d{4})?$/.test(shippingAddress.zip)) {
      newErrors.zip = 'Please enter a valid ZIP code (e.g., 33101)'
    }
    
    if (!shippingAddress.country.trim()) {
      newErrors.country = 'Please select a country'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleProceedToPayment = async () => {
    if (!cart) {
      return
    }
    
    // Validate form first
    if (!validateForm()) {
      return
    }
    
    // Check if shipping is calculated
    if (shippingCost === null) {
      // Show error for fields that would trigger shipping calculation
      const newErrors: { [key: string]: string } = {}
      if (!shippingAddress.city.trim()) {
        newErrors.city = 'Please enter your city to calculate shipping'
      }
      if (!shippingAddress.state.trim()) {
        newErrors.state = 'Please enter your state to calculate shipping'
      }
      if (!shippingAddress.zip.trim()) {
        newErrors.zip = 'Please enter your ZIP to calculate shipping'
      }
      setErrors(prev => ({ ...prev, ...newErrors }))
      return
    }
    
    setIsProcessing(true)
    
    try {
      // Create Stripe checkout session with pre-calculated shipping
      const response = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: cart.priceId,
          quantity: cart.quantity,
          product: cart.product,
          userEmail: user?.email || '',
          userId: user?.id || '',
          isGuest: !isAuthenticated,
          shippingAddress: {
            ...shippingAddress,
            postal_code: shippingAddress.zip,
          },
          preCalculatedShippingCost: shippingCost,
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else {
        const errorData = await response.json()
        alert(`Checkout error: ${errorData.error}`)
        setIsProcessing(false)
      }
    } catch (error) {
      console.error('Error creating checkout:', error)
      alert('Failed to create checkout session. Please try again.')
      setIsProcessing(false)
    }
  }

  if (!cart) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    )
  }

  const subtotal = cart.unitPrice * cart.quantity
  const total = shippingCost !== null ? subtotal + shippingCost : subtotal

  return (
    <div className="stripe-checkout-page">
      <div className="stripe-checkout-container">
        {/* Logo/Header */}
        <div className="stripe-checkout-header">
          <button
            onClick={() => navigate(-1)}
            className="stripe-checkout-back-button"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </button>
          <div className="stripe-checkout-logo">
            <img src="/images/ac-drain-wiz-logo.png" alt="AC Drain Wiz" className="h-8" />
          </div>
        </div>

        <div className="stripe-checkout-layout">
          {/* Order Summary - Left Column (like Stripe) */}
          <div className="stripe-checkout-left">
            <div className="stripe-order-summary">
              <h2 className="stripe-order-title">Pay ACDW</h2>
              <div className="stripe-order-amount">${total.toFixed(2)}</div>
              
              <div className="stripe-order-items">
                {/* Product Line Item */}
                <div className="stripe-line-item">
                  <div className="stripe-line-item-details">
                    <div className="stripe-line-item-name">{cart.productName}</div>
                    <div className="stripe-line-item-description">
                      Compact AC drain line cleaning system for residential and commercial use
                    </div>
                    <div className="stripe-line-item-qty">Qty {cart.quantity}</div>
                  </div>
                  <div className="stripe-line-item-price">${(cart.unitPrice * cart.quantity).toFixed(2)}</div>
                </div>

                {/* Shipping Line Item */}
                {shippingCost !== null && (
                  <div className="stripe-line-item">
                    <div className="stripe-line-item-details">
                      <div className="stripe-line-item-name">Shipping & Handling</div>
                      <div className="stripe-line-item-description">
                        Standard Ground ({shippingAddress.country === 'CA' ? '7-14' : '3-7'} business days) to {shippingAddress.city ? `${shippingAddress.city}, ${shippingAddress.state}` : 'your location'}
                      </div>
                      <div className="stripe-line-item-qty">Qty 1</div>
                    </div>
                    <div className="stripe-line-item-price">${shippingCost.toFixed(2)}</div>
                  </div>
                )}
                
                {isCalculating && (
                  <div className="stripe-calculating">
                    <span className="text-sm text-gray-500">Calculating shipping...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Shipping Form - Right Column (like Stripe payment form) */}
          <div className="stripe-checkout-right">
            <div className="stripe-form-container">
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="stripe-form-label">Full Name</label>
                  <input
                    type="text"
                    value={shippingAddress.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`stripe-form-input ${errors.name ? 'stripe-form-input-error' : ''}`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="stripe-form-error">{errors.name}</p>
                  )}
                </div>

                {/* Street Address */}
                <div>
                  <label className="stripe-form-label">Address</label>
                  <input
                    type="text"
                    value={shippingAddress.line1}
                    onChange={(e) => handleInputChange('line1', e.target.value)}
                    className={`stripe-form-input ${errors.line1 ? 'stripe-form-input-error' : ''}`}
                    placeholder="123 Main St"
                  />
                  {errors.line1 && (
                    <p className="stripe-form-error">{errors.line1}</p>
                  )}
                </div>

                {/* Apartment, Suite, etc. */}
                <div>
                  <label className="stripe-form-label">Apartment, suite, etc. (Optional)</label>
                  <input
                    type="text"
                    value={shippingAddress.line2}
                    onChange={(e) => handleInputChange('line2', e.target.value)}
                    className="stripe-form-input"
                    placeholder="Apt 4B"
                  />
                </div>

                {/* City, State, ZIP in a row */}
                <div className="stripe-form-row">
                  <div className="stripe-form-col-2">
                    <label className="stripe-form-label">City</label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`stripe-form-input ${errors.city ? 'stripe-form-input-error' : ''}`}
                      placeholder="Miami"
                    />
                    {errors.city && (
                      <p className="stripe-form-error">{errors.city}</p>
                    )}
                  </div>

                  <div className="stripe-form-col-1">
                    <label className="stripe-form-label">State</label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) => handleInputChange('state', e.target.value.toUpperCase())}
                      className={`stripe-form-input ${errors.state ? 'stripe-form-input-error' : ''}`}
                      placeholder="FL"
                      maxLength={2}
                    />
                    {errors.state && (
                      <p className="stripe-form-error">{errors.state}</p>
                    )}
                  </div>

                  <div className="stripe-form-col-1">
                    <label className="stripe-form-label">ZIP</label>
                    <input
                      type="text"
                      value={shippingAddress.zip}
                      onChange={(e) => handleInputChange('zip', e.target.value)}
                      className={`stripe-form-input ${errors.zip ? 'stripe-form-input-error' : ''}`}
                      placeholder="33101"
                    />
                    {errors.zip && (
                      <p className="stripe-form-error">{errors.zip}</p>
                    )}
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="stripe-form-label">Country</label>
                  <select
                    value={shippingAddress.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className={`stripe-form-input ${errors.country ? 'stripe-form-input-error' : ''}`}
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                  </select>
                  {errors.country && (
                    <p className="stripe-form-error">{errors.country}</p>
                  )}
                </div>

                {/* Pay Button (matching Stripe's exact blue button) */}
                <button
                  onClick={handleProceedToPayment}
                  disabled={isProcessing}
                  className="stripe-pay-button"
                  type="button"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </span>
                  ) : (
                    'Pay'
                  )}
                </button>

                <p className="stripe-footer-text">
                  Powered by <strong>Stripe</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

