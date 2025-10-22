import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { CustomerTypeConfig } from '../types/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export class CustomerManager {
  private dataPath: string

  constructor() {
    this.dataPath = join(__dirname, '../data/customer-types.json')
  }

  private loadCustomerTypes(): CustomerTypeConfig[] {
    try {
      const data = readFileSync(this.dataPath, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Error loading customer types:', error)
      return []
    }
  }

  async getCustomerTypes(args: any) {
    const customerTypes = this.loadCustomerTypes()

    const typeList = customerTypes.map(type => ({
      type: type.type,
      title: type.title,
      description: type.description,
      features: type.features,
      cta: type.cta,
      pricing: type.pricing
    }))

    return {
      content: [
        {
          type: 'text',
          text: `# Customer Type Configurations\n\n` +
            `Found ${typeList.length} customer types:\n\n` +
            typeList.map(type => 
              `## ${type.title} (${type.type})\n\n` +
              `**Description:** ${type.description}\n\n` +
              `**Pricing Tier:** ${type.pricing}\n\n` +
              `**Call to Action:** ${type.cta}\n\n` +
              `**Key Features:**\n${type.features.map(f => `- ${f}`).join('\n')}\n\n` +
              `---\n\n`
            ).join('')
        }
      ]
    }
  }

  async calculatePricing(args: any) {
    const { productId, customerType, quantity } = args

    // Load product data (simplified - in real implementation, you'd load from product manager)
    const productManager = new (await import('./product-manager.js')).ProductManager()
    const productResult = await productManager.getProduct({ productId })
    
    if ('isError' in productResult && productResult.isError) {
      return productResult
    }

    // Extract pricing from product result
    const productText = productResult.content[0].text
    const productName = productText.match(/\*\*(.*?)\*\*/)?.[1] || productId
    
    let basePrice = 0
    let priceType = ''

    if (customerType === 'homeowner') {
      const retailMatch = productText.match(/- Retail: \$(\d+\.?\d*)/)
      basePrice = retailMatch ? parseFloat(retailMatch[1]) : 0
      priceType = 'Retail'
    } else if (customerType === 'hvac-professional') {
      const proMatch = productText.match(/- Pro: \$(\d+\.?\d*)/)
      basePrice = proMatch ? parseFloat(proMatch[1]) : 0
      priceType = 'Professional'
    } else if (customerType === 'city-official') {
      const bulkMatch = productText.match(/- Bulk: \$(\d+\.?\d*)/)
      basePrice = bulkMatch ? parseFloat(bulkMatch[1]) : 0
      priceType = 'Bulk'
    }

    if (basePrice === 0) {
      return {
        content: [
          {
            type: 'text',
            text: `No pricing available for ${customerType} customer type for product ${productName}.`
          }
        ],
        isError: true
      }
    }

    // Calculate pricing with quantity discounts
    const subtotal = basePrice * quantity
    let discount = 0
    let discountText = ''

    if (quantity >= 50) {
      discount = 0.15 // 15% discount for 50+ units
      discountText = '15% bulk discount (50+ units)'
    } else if (quantity >= 20) {
      discount = 0.10 // 10% discount for 20+ units
      discountText = '10% volume discount (20+ units)'
    } else if (quantity >= 10) {
      discount = 0.05 // 5% discount for 10+ units
      discountText = '5% volume discount (10+ units)'
    }

    const discountAmount = subtotal * discount
    const finalTotal = subtotal - discountAmount

    // Calculate shipping (simplified)
    let shipping = 0
    if (quantity <= 5) {
      shipping = 9.99
    } else if (quantity <= 20) {
      shipping = 19.99
    } else {
      shipping = 0 // Free shipping for large orders
    }

    const grandTotal = finalTotal + shipping

    return {
      content: [
        {
          type: 'text',
          text: `# Pricing Calculation for ${productName}\n\n` +
            `**Customer Type:** ${customerType}\n` +
            `**Quantity:** ${quantity} units\n` +
            `**Price Type:** ${priceType}\n\n` +
            `## Pricing Breakdown\n\n` +
            `- **Unit Price:** $${basePrice.toFixed(2)}\n` +
            `- **Subtotal:** $${subtotal.toFixed(2)}\n` +
            `${discount > 0 ? `- **Discount (${discountText}):** -$${discountAmount.toFixed(2)}\n` : ''}` +
            `- **Shipping:** ${shipping > 0 ? `$${shipping.toFixed(2)}` : 'FREE'}\n` +
            `- **Total:** $${grandTotal.toFixed(2)}\n\n` +
            `## Volume Discounts Available\n\n` +
            `- **10+ units:** 5% discount\n` +
            `- **20+ units:** 10% discount\n` +
            `- **50+ units:** 15% discount\n` +
            `- **100+ units:** Contact for custom pricing\n\n` +
            `## Next Steps\n\n` +
            `1. **Add to Cart:** Use this pricing to add items to your cart\n` +
            `2. **Contact Sales:** For orders over 100 units, contact our sales team\n` +
            `3. **Professional Account:** HVAC professionals can access additional discounts\n\n` +
            `**Note:** Pricing is subject to change. Contact us for the most current rates.`
        }
      ]
    }
  }
}
