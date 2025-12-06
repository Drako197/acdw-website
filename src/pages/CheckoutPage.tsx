import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ArrowLeftIcon, TruckIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'

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
      newErrors.name = 'Name is required'
    }
    
    if (!shippingAddress.line1.trim()) {
      newErrors.line1 = 'Street address is required'
    }
    
    if (!shippingAddress.city.trim()) {
      newErrors.city = 'City is required'
    }
    
    if (!shippingAddress.state.trim()) {
      newErrors.state = 'State/Province is required'
    }
    
    if (!shippingAddress.zip.trim()) {
      newErrors.zip = 'ZIP/Postal code is required'
    }
    
    if (!shippingAddress.country.trim()) {
      newErrors.country = 'Country is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleProceedToPayment = async () => {
    if (!cart || !validateForm() || shippingCost === null) {
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600 mt-2">Enter your shipping information to continue</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping Form - Left Side */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-6">
                  <TruckIcon className="h-6 w-6 text-orange-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
                </div>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1 italic">{errors.name}</p>
                    )}
                  </div>

                  {/* Street Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.line1}
                      onChange={(e) => handleInputChange('line1', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.line1 ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="123 Main St"
                    />
                    {errors.line1 && (
                      <p className="text-red-500 text-sm mt-1 italic">{errors.line1}</p>
                    )}
                  </div>

                  {/* Apartment, Suite, etc. */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apartment, Suite, etc. (Optional)
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.line2}
                      onChange={(e) => handleInputChange('line2', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Apt 4B"
                    />
                  </div>

                  {/* City, State, ZIP */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Miami"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1 italic">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.state}
                        onChange={(e) => handleInputChange('state', e.target.value.toUpperCase())}
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.state ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="FL"
                        maxLength={2}
                      />
                      {errors.state && (
                        <p className="text-red-500 text-sm mt-1 italic">{errors.state}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.zip}
                        onChange={(e) => handleInputChange('zip', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.zip ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="33101"
                      />
                      {errors.zip && (
                        <p className="text-red-500 text-sm mt-1 italic">{errors.zip}</p>
                      )}
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <select
                      value={shippingAddress.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.country ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                    </select>
                    {errors.country && (
                      <p className="text-red-500 text-sm mt-1 italic">{errors.country}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary - Right Side */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <div className="flex items-center mb-6">
                  <ShoppingCartIcon className="h-6 w-6 text-orange-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
                </div>

                <div className="space-y-4">
                  {/* Product */}
                  <div className="flex justify-between text-gray-600">
                    <span>{cart.productName}</span>
                    <span>${cart.unitPrice.toFixed(2)}</span>
                  </div>

                  {/* Quantity */}
                  <div className="flex justify-between text-gray-600">
                    <span>Quantity</span>
                    <span>×{cart.quantity}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    {/* Subtotal */}
                    <div className="flex justify-between text-gray-900 font-medium mb-2">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>

                    {/* Shipping */}
                    <div className="flex justify-between text-gray-900 font-medium mb-4">
                      <span>Shipping</span>
                      <span>
                        {isCalculating ? (
                          <span className="text-sm text-gray-500">Calculating...</span>
                        ) : shippingCost !== null ? (
                          `$${shippingCost.toFixed(2)}`
                        ) : (
                          <span className="text-sm text-gray-500">Enter address</span>
                        )}
                      </span>
                    </div>

                    {/* Shipping Details */}
                    {shippingCost !== null && (
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                        <p className="text-sm text-blue-900 font-medium mb-1">
                          Standard Ground Shipping
                        </p>
                        <p className="text-xs text-blue-700">
                          Delivery: {shippingAddress.country === 'CA' ? '7-14' : '3-7'} business days
                        </p>
                      </div>
                    )}

                    {/* Total */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Proceed to Payment Button */}
                  <button
                    onClick={handleProceedToPayment}
                    disabled={isProcessing || shippingCost === null || Object.keys(errors).length > 0}
                    className={`w-full py-3 px-4 rounded-md font-semibold transition-colors ${
                      isProcessing || shippingCost === null
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-orange-600 text-white hover:bg-orange-700'
                    }`}
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </span>
                    ) : (
                      'Proceed to Payment'
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    You'll be redirected to Stripe for secure payment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

