/**
 * Shipping Cost Calculator
 * 
 * Calculates shipping costs using ShipStation API with fallback to zone-based rates.
 * Origin: ZIP 33486 (Boca Raton, Florida)
 */

const ORIGIN_ZIP = '33486';

// Product weight specifications (in pounds)
const PRODUCT_WEIGHTS = {
  'mini': 1.6,
  'sensor': 1.6,
  'bundle': 3.2,
};

// Zone-based fallback rates (if API fails)
const ZONE_RATES = {
  1: { // Zones 1-2: FL, GA, SC, AL
    single: 9.00,
    double: 11.00,
    triple: 13.00,
  },
  2: { // Zones 3-4: NC, TN, MS, LA, TX (parts)
    single: 11.00,
    double: 13.00,
    triple: 15.00,
  },
  3: { // Zones 5-6: Mid-Atlantic, Midwest
    single: 13.50,
    double: 15.50,
    triple: 17.50,
  },
  4: { // Zones 7-8: West Coast, Northeast
    single: 16.50,
    double: 18.50,
    triple: 20.50,
  },
  canada: { // Canada
    single: 20.00,
    double: 24.00,
    triple: 28.00,
  },
};

// Zone mapping by state
const STATE_ZONES = {
  // Zone 1-2 (Local/Regional)
  'FL': 1, 'GA': 1, 'SC': 1, 'AL': 1,
  
  // Zone 2 (Mid-range)
  'NC': 2, 'TN': 2, 'MS': 2, 'LA': 2, 'TX': 2, 'AR': 2, 'OK': 2,
  
  // Zone 3 (Long distance)
  'VA': 3, 'WV': 3, 'KY': 3, 'MO': 3, 'KS': 3, 'NE': 3, 'SD': 3, 'ND': 3,
  'IA': 3, 'IL': 3, 'IN': 3, 'OH': 3, 'MI': 3, 'WI': 3, 'MN': 3,
  
  // Zone 4 (Cross-country)
  'WA': 4, 'OR': 4, 'CA': 4, 'NV': 4, 'AZ': 4, 'UT': 4, 'ID': 4, 'MT': 4, 'WY': 4, 'CO': 4, 'NM': 4,
  'ME': 4, 'NH': 4, 'VT': 4, 'MA': 4, 'RI': 4, 'CT': 4, 'NY': 4, 'PA': 4, 'NJ': 4, 'DE': 4, 'MD': 4, 'DC': 4,
  'AK': 4, 'HI': 4,
};

/**
 * Calculate total weight for products
 */
function calculateWeight(products) {
  let totalWeight = 0;
  
  for (const [productType, quantity] of Object.entries(products)) {
    const weight = PRODUCT_WEIGHTS[productType] || 1.6; // Default to 1.6 lbs
    totalWeight += weight * quantity;
  }
  
  return totalWeight;
}

/**
 * Determine shipping zone from destination address
 */
function getShippingZone(address) {
  const { state, country } = address;
  
  // International (Canada only for now)
  if (country && country.toUpperCase() !== 'US' && country.toUpperCase() !== 'USA' && country.toUpperCase() !== 'UNITED STATES') {
    if (country.toUpperCase() === 'CA' || country.toUpperCase() === 'CANADA') {
      return 'canada';
    }
    // For other international, treat as Canada rate for now
    return 'canada';
  }
  
  // Domestic US
  const stateCode = state.toUpperCase().substring(0, 2);
  return STATE_ZONES[stateCode] || 3; // Default to zone 3 if unknown
}

/**
 * Calculate shipping cost using zone-based rates (fallback method)
 */
function calculateZoneBasedShipping(address, products) {
  const zone = getShippingZone(address);
  const totalWeight = calculateWeight(products);
  
  // Determine rate tier based on weight
  let rateTier = 'single'; // 0-2 lbs
  if (totalWeight > 4.5) {
    rateTier = 'triple'; // 4.5+ lbs
  } else if (totalWeight > 2.5) {
    rateTier = 'double'; // 2.5-4.5 lbs
  }
  
  const rates = ZONE_RATES[zone];
  if (!rates) {
    // Fallback to mid-range if zone not found
    return ZONE_RATES[3][rateTier];
  }
  
  return rates[rateTier];
}

/**
 * Calculate shipping cost using ShipStation API
 */
async function calculateShipStationShipping(address, products) {
  const SHIPSTATION_API_KEY = process.env.SHIPSTATION_API_KEY;
  const SHIPSTATION_API_SECRET = process.env.SHIPSTATION_API_SECRET;
  
  if (!SHIPSTATION_API_KEY || !SHIPSTATION_API_SECRET) {
    console.warn('ShipStation API credentials not configured, using fallback rates');
    return null;
  }
  
  try {
    const totalWeight = calculateWeight(products);
    
    // ShipStation API endpoint for rate quotes
    const response = await fetch('https://ssapi.shipstation.com/shipments/getrates', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${SHIPSTATION_API_KEY}:${SHIPSTATION_API_SECRET}`).toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        carrierCode: 'ups', // or 'fedex'
        serviceCode: null, // Let ShipStation choose best ground service
        packageCode: 'package',
        fromPostalCode: ORIGIN_ZIP,
        toState: address.state,
        toCountry: address.country || 'US',
        toPostalCode: address.postal_code || address.zip,
        toCity: address.city,
        weight: {
          value: totalWeight,
          units: 'pounds',
        },
        dimensions: {
          units: 'inches',
          length: 8,
          width: 7,
          height: 3,
        },
        confirmation: 'none',
        residential: true,
      }),
    });
    
    if (!response.ok) {
      console.error('ShipStation API error:', response.status, response.statusText);
      return null;
    }
    
    const data = await response.json();
    
    // Find the cheapest ground service rate
    const groundRates = data.filter(rate => 
      rate.serviceCode.toLowerCase().includes('ground') ||
      rate.serviceName.toLowerCase().includes('ground')
    );
    
    if (groundRates.length > 0) {
      // Return the cheapest ground rate
      const cheapestRate = groundRates.reduce((min, rate) => 
        rate.shipmentCost < min.shipmentCost ? rate : min
      );
      return cheapestRate.shipmentCost;
    }
    
    // If no ground rates, return the cheapest rate overall
    if (data.length > 0) {
      const cheapestRate = data.reduce((min, rate) => 
        rate.shipmentCost < min.shipmentCost ? rate : min
      );
      return cheapestRate.shipmentCost;
    }
    
    return null;
  } catch (error) {
    console.error('Error calculating ShipStation shipping:', error);
    return null;
  }
}

/**
 * Main shipping calculation function
 * Tries API first, falls back to zone-based rates
 */
async function calculateShipping(address, products) {
  try {
    // Try ShipStation API first
    const apiCost = await calculateShipStationShipping(address, products);
    
    if (apiCost !== null) {
      console.log('Using ShipStation API rate:', apiCost);
      return {
        cost: Math.round(apiCost * 100) / 100, // Round to 2 decimals
        method: 'api',
        carrier: 'ups_ground',
      };
    }
    
    // Fallback to zone-based rates
    console.log('Using zone-based fallback rates');
    const zoneCost = calculateZoneBasedShipping(address, products);
    
    return {
      cost: zoneCost,
      method: 'zone',
      carrier: 'ups_ground',
    };
  } catch (error) {
    console.error('Error calculating shipping:', error);
    
    // Ultimate fallback
    const zoneCost = calculateZoneBasedShipping(address, products);
    return {
      cost: zoneCost,
      method: 'fallback',
      carrier: 'ups_ground',
    };
  }
}

/**
 * Parse products from cart items
 */
function parseProducts(items) {
  const products = {};
  
  for (const item of items) {
    const productType = item.product_type || 'mini'; // Default to mini
    products[productType] = (products[productType] || 0) + (item.quantity || 1);
  }
  
  return products;
}

module.exports = {
  calculateShipping,
  parseProducts,
  calculateWeight,
  getShippingZone,
  calculateZoneBasedShipping,
};

