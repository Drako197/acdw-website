/**
 * Browser-Based Payment Flow Test
 * 
 * Copy and paste this into your browser console on your deployed site
 * (after signing in as an HVAC Pro user)
 * 
 * This will test the payment flow functions directly
 */

async function testPaymentFlow() {
  console.log('🧪 Testing Payment Flow Functions\n');
  
  const baseUrl = window.location.origin;
  let passed = 0;
  let failed = 0;
  
  // Test 1: Price ID Lookup - HVAC Pro Tier 1
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Test 1: Price ID Lookup (HVAC Pro - Mini - Tier 1)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    const response = await fetch(`${baseUrl}/.netlify/functions/get-price-id`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product: 'mini',
        quantity: 10,
        role: 'hvac_pro'
      })
    });
    
    const data = await response.json();
    
    if (data.priceId) {
      console.log('✅ PASSED');
      console.log('  Price ID:', data.priceId);
      console.log('  Tier:', data.tier);
      console.log('  Unit Price: $' + data.unitPrice);
      passed++;
      
      // Test 2: Create Checkout Session
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Test 2: Create Checkout Session');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      try {
        const checkoutResponse = await fetch(`${baseUrl}/.netlify/functions/create-checkout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            priceId: data.priceId,
            quantity: 10,
            product: 'mini',
            userEmail: 'test@example.com',
            userId: 'test_user'
          })
        });
        
        const checkoutData = await checkoutResponse.json();
        
        if (checkoutData.url) {
          console.log('✅ PASSED');
          console.log('  Checkout URL:', checkoutData.url);
          console.log('  Session ID:', checkoutData.sessionId);
          console.log('\n  💡 To test Stripe Checkout, open this URL:');
          console.log('  ' + checkoutData.url);
          passed++;
        } else {
          console.log('❌ FAILED');
          console.log('  Error:', checkoutData.error);
          failed++;
        }
      } catch (error) {
        console.log('❌ FAILED');
        console.log('  Error:', error.message);
        failed++;
      }
      
    } else {
      console.log('❌ FAILED');
      console.log('  Error:', data.error || 'No Price ID returned');
      console.log('  Response:', data);
      failed++;
    }
  } catch (error) {
    console.log('❌ FAILED');
    console.log('  Error:', error.message);
    failed++;
  }
  
  // Test 3: Different Tiers
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Test 3: Testing Different Tiers');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const tierTests = [
    { quantity: 5, tier: 'tier_1', label: 'Tier 1 (5 units)' },
    { quantity: 50, tier: 'tier_2', label: 'Tier 2 (50 units)' },
    { quantity: 200, tier: 'tier_3', label: 'Tier 3 (200 units)' }
  ];
  
  for (const test of tierTests) {
    try {
      const response = await fetch(`${baseUrl}/.netlify/functions/get-price-id`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: 'mini',
          quantity: test.quantity,
          role: 'hvac_pro'
        })
      });
      
      const data = await response.json();
      
      if (data.priceId && data.tier === test.tier) {
        console.log(`✅ ${test.label}: PASSED (Tier: ${data.tier}, Price: $${data.unitPrice})`);
        passed++;
      } else {
        console.log(`❌ ${test.label}: FAILED`);
        console.log('  Expected tier:', test.tier);
        console.log('  Got tier:', data.tier);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.label}: FAILED - ${error.message}`);
      failed++;
    }
  }
  
  // Test 4: Edge Cases
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Test 4: Edge Cases');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Test invalid quantity
  try {
    const response = await fetch(`${baseUrl}/.netlify/functions/get-price-id`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product: 'mini',
        quantity: 0,
        role: 'hvac_pro'
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      console.log('✅ Invalid quantity (0): PASSED - Correctly rejected');
      passed++;
    } else {
      console.log('❌ Invalid quantity (0): FAILED - Should reject');
      failed++;
    }
  } catch (error) {
    console.log('❌ Invalid quantity test: FAILED -', error.message);
    failed++;
  }
  
  // Test quantity > 500
  try {
    const response = await fetch(`${baseUrl}/.netlify/functions/get-price-id`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product: 'mini',
        quantity: 600,
        role: 'hvac_pro'
      })
    });
    
    const data = await response.json();
    
    if (data.error || data.requiresContact) {
      console.log('✅ Quantity > 500: PASSED - Correctly requires contact');
      passed++;
    } else {
      console.log('❌ Quantity > 500: FAILED - Should require contact');
      failed++;
    }
  } catch (error) {
    console.log('❌ Quantity > 500 test: FAILED -', error.message);
    failed++;
  }
  
  // Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Test Summary');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('');
  
  if (failed === 0) {
    console.log('🎉 All tests passed!');
  } else {
    console.log('⚠️  Some tests failed. Please review the errors above.');
  }
  
  return { passed, failed };
}

// Run the tests
testPaymentFlow();

