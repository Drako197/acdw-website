/**
 * Local Test Script for Shipping Calculator
 * 
 * Run this script locally to test shipping calculations:
 * node netlify/functions/test-shipping-calculator.js
 */

const { calculateShipping, calculateZoneBasedShipping, getShippingZone } = require('./utils/shipping-calculator.cjs');

// Test addresses
const testAddresses = [
  {
    name: 'Florida (Zone 1)',
    address: { city: 'Miami', state: 'FL', country: 'US', zip: '33101' },
    products: { mini: 1 },
  },
  {
    name: 'Georgia (Zone 1)',
    address: { city: 'Atlanta', state: 'GA', country: 'US', zip: '30301' },
    products: { sensor: 1 },
  },
  {
    name: 'Texas (Zone 2)',
    address: { city: 'Houston', state: 'TX', country: 'US', zip: '77001' },
    products: { mini: 2 },
  },
  {
    name: 'New York (Zone 4)',
    address: { city: 'New York', state: 'NY', country: 'US', zip: '10001' },
    products: { mini: 1, sensor: 1 },
  },
  {
    name: 'California (Zone 4)',
    address: { city: 'Los Angeles', state: 'CA', country: 'US', zip: '90001' },
    products: { mini: 3 },
  },
  {
    name: 'Canada',
    address: { city: 'Toronto', state: 'ON', country: 'CA', zip: 'M5H 2N2' },
    products: { mini: 1 },
  },
];

async function runTests() {
  console.log('🚚 Testing Shipping Calculator\n');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  for (const test of testAddresses) {
    console.log(`📍 ${test.name}`);
    console.log(`   Address: ${test.address.city}, ${test.address.state} ${test.address.zip}`);
    
    // Show products
    const productList = Object.entries(test.products)
      .map(([type, qty]) => `${qty}x ${type}`)
      .join(', ');
    console.log(`   Products: ${productList}`);
    
    // Calculate zone
    const zone = getShippingZone(test.address);
    console.log(`   Zone: ${zone}`);
    
    // Calculate zone-based shipping (fallback method)
    const zoneCost = calculateZoneBasedShipping(test.address, test.products);
    console.log(`   Zone-based cost: $${zoneCost.toFixed(2)}`);
    
    // Try API calculation (will fall back to zone if API not configured)
    try {
      const result = await calculateShipping(test.address, test.products);
      console.log(`   Calculated cost: $${result.cost.toFixed(2)}`);
      console.log(`   Method: ${result.method}`);
      console.log(`   Carrier: ${result.carrier}`);
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log('');
  }
  
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('✅ Tests complete!\n');
  
  // Check if ShipStation API is configured
  if (!process.env.SHIPSTATION_API_KEY || !process.env.SHIPSTATION_API_SECRET) {
    console.log('⚠️  ShipStation API not configured');
    console.log('   Using zone-based fallback rates (still accurate!)');
    console.log('   To enable API:\n');
    console.log('   1. Get your ShipStation API credentials from:');
    console.log('      https://ship1.shipstation.com/settings/api');
    console.log('   2. Add to .env or Netlify environment variables:');
    console.log('      SHIPSTATION_API_KEY=your_key_here');
    console.log('      SHIPSTATION_API_SECRET=your_secret_here\n');
  } else {
    console.log('✅ ShipStation API configured');
    console.log('   Using live API rates\n');
  }
}

// Run tests
runTests().catch(console.error);

