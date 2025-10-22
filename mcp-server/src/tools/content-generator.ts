import { ProductManager } from './product-manager.js'
import { CustomerManager } from './customer-manager.js'

export class ContentGenerator {
  private productManager: ProductManager
  private customerManager: CustomerManager

  constructor() {
    this.productManager = new ProductManager()
    this.customerManager = new CustomerManager()
  }

  async generateProductDescription(args: any) {
    const { productId, customerType, length = 'medium' } = args

    // Get product details
    const productResult = await this.productManager.getProduct({ productId })
    if ('isError' in productResult && productResult.isError) {
      return productResult
    }

    // Get customer type configuration
    const customerResult = await this.customerManager.getCustomerTypes({})
    if ('isError' in customerResult && customerResult.isError) {
      return customerResult
    }

    // Extract product info from the result
    const productText = productResult.content[0].text
    const productName = productText.match(/\*\*(.*?)\*\*/)?.[1] || productId
    const description = productText.match(/\*\*Description:\*\* (.*?)\n/)?.[1] || ''
    const features = productText.match(/\*\*Features:\*\*\n((?:- .*\n?)*)/)?.[1] || ''
    const pricing = productText.match(/\*\*Pricing:\*\*\n((?:- .*\n?)*)/)?.[1] || ''

    // Generate customer-specific description
    const descriptionText = this.generateCustomerSpecificDescription(
      productName,
      description,
      features,
      pricing,
      customerType,
      length
    )

    return {
      content: [
        {
          type: 'text',
          text: `# Product Description for ${customerType}\n\n` +
            `**Product:** ${productName}\n` +
            `**Target Audience:** ${customerType}\n` +
            `**Length:** ${length}\n\n` +
            `---\n\n` +
            descriptionText
        }
      ]
    }
  }

  private generateCustomerSpecificDescription(
    productName: string,
    description: string,
    features: string,
    pricing: string,
    customerType: string,
    length: string
  ): string {
    const featureList = features.split('\n').filter(f => f.trim()).map(f => f.replace('- ', '').trim())
    const pricingInfo = pricing.split('\n').filter(p => p.trim())

    let content = ''

    if (customerType === 'homeowner') {
      content = this.generateHomeownerDescription(productName, description, featureList, pricingInfo, length)
    } else if (customerType === 'hvac-professional') {
      content = this.generateHVACProfessionalDescription(productName, description, featureList, pricingInfo, length)
    } else if (customerType === 'city-official') {
      content = this.generateCityOfficialDescription(productName, description, featureList, pricingInfo, length)
    }

    return content
  }

  private generateHomeownerDescription(
    productName: string,
    description: string,
    features: string[],
    pricing: string[],
    length: string
  ): string {
    let content = `## Protect Your Home with ${productName}\n\n`
    
    if (length === 'short') {
      content += `${productName} prevents costly water damage from AC drain line clogs. ` +
        `Easy DIY installation in under 30 minutes with clear visual monitoring.\n\n`
    } else {
      content += `Don't let a clogged AC drain line cause thousands of dollars in water damage to your home. ` +
        `${productName} is the simple, effective solution that homeowners trust to protect their property.\n\n`
      
      content += `### Why Homeowners Choose ${productName}\n\n`
      content += `- **Prevent Water Damage:** Stop costly repairs before they happen\n`
      content += `- **Easy Installation:** No special tools required, installs in under 30 minutes\n`
      content += `- **Visual Monitoring:** Clear housing lets you see when maintenance is needed\n`
      content += `- **Peace of Mind:** Proactive protection for your home and family\n\n`
    }

    content += `### Key Benefits for Your Home\n\n`
    features.slice(0, length === 'short' ? 3 : 5).forEach(feature => {
      content += `- ${feature}\n`
    })

    if (length !== 'short') {
      content += `\n### Simple Installation Process\n\n`
      content += `1. **Locate your AC drain line** - Usually near your outdoor unit\n`
      content += `2. **Cut the line** - Make a clean cut where you want to install the device\n`
      content += `3. **Connect the ${productName}** - Simple push-fit connections, no tools needed\n`
      content += `4. **Test the system** - Run your AC and verify proper drainage\n\n`
    }

    const retailPrice = pricing.find(p => p.includes('Retail'))?.match(/\$(\d+\.?\d*)/)?.[1]
    if (retailPrice) {
      content += `### Affordable Protection\n\n`
      content += `At just $${retailPrice}, ${productName} costs less than most homeowners' insurance deductibles ` +
        `but provides year-round protection against water damage.\n\n`
    }

    content += `### Get Started Today\n\n`
    content += `Protect your home with ${productName}. Order now and enjoy peace of mind knowing your AC system ` +
      `is protected from costly drain line issues.\n\n`

    return content
  }

  private generateHVACProfessionalDescription(
    productName: string,
    description: string,
    features: string[],
    pricing: string[],
    length: string
  ): string {
    let content = `## Professional-Grade ${productName} for HVAC Contractors\n\n`
    
    if (length === 'short') {
      content += `${productName} streamlines service calls and reduces callbacks. ` +
        `Professional pricing available with bulk discounts.\n\n`
    } else {
      content += `Increase your service efficiency and customer satisfaction with ${productName}. ` +
        `This professional-grade solution helps HVAC contractors provide superior protection while ` +
        `reducing service calls and increasing profits.\n\n`
      
      content += `### Professional Benefits\n\n`
      content += `- **Faster Service Calls:** Quick installation means more jobs per day\n`
      content += `- **Reduced Callbacks:** Proactive maintenance prevents emergency calls\n`
      content += `- **Customer Satisfaction:** Offer superior protection that competitors don't\n`
      content += `- **Increased Profits:** Professional pricing with healthy margins\n\n`
    }

    content += `### Technical Specifications\n\n`
    features.forEach(feature => {
      content += `- ${feature}\n`
    })

    if (length !== 'short') {
      content += `\n### Installation Efficiency\n\n`
      content += `- **30-minute installation** - Standard service call time\n`
      content += `- **No special tools required** - Use standard HVAC tools\n`
      content += `- **Clear visual verification** - Easy to demonstrate to customers\n`
      content += `- **Professional appearance** - Enhances your service quality\n\n`
    }

    const proPrice = pricing.find(p => p.includes('Pro'))?.match(/\$(\d+\.?\d*)/)?.[1]
    const bulkPrice = pricing.find(p => p.includes('Bulk'))?.match(/\$(\d+\.?\d*)/)?.[1]
    
    if (proPrice || bulkPrice) {
      content += `### Professional Pricing\n\n`
      if (proPrice) content += `- **Professional Price:** $${proPrice}\n`
      if (bulkPrice) content += `- **Bulk Pricing:** $${bulkPrice} (10+ units)\n`
      content += `- **Healthy Margins:** Significant markup potential for retail sales\n\n`
    }

    content += `### Business Growth Opportunities\n\n`
    content += `- **Upsell on Service Calls:** Add value to every maintenance visit\n`
    content += `- **New Installation Add-On:** Include with new AC installations\n`
    content += `- **Preventive Maintenance Programs:** Offer ongoing protection services\n`
    content += `- **Customer Retention:** Build long-term relationships with superior service\n\n`

    return content
  }

  private generateCityOfficialDescription(
    productName: string,
    description: string,
    features: string[],
    pricing: string[],
    length: string
  ): string {
    let content = `## ${productName} for Municipal Code Compliance\n\n`
    
    if (length === 'short') {
      content += `${productName} ensures ICC code compliance and prevents property damage. ` +
        `Contact us for municipal pricing and bulk solutions.\n\n`
    } else {
      content += `Protect your community's infrastructure and ensure code compliance with ${productName}. ` +
        `This innovative solution helps municipal officials maintain building standards while ` +
        `preventing costly water damage throughout your jurisdiction.\n\n`
      
      content += `### Municipal Benefits\n\n`
      content += `- **Code Compliance:** Meets ICC standards for condensate disposal\n`
      content += `- **Reduced Liability:** Fewer water damage claims and insurance issues\n`
      content += `- **Infrastructure Protection:** Prevents damage to public and private property\n`
      content += `- **Public Safety:** Proactive approach to building maintenance\n\n`
    }

    content += `### ICC Code Compliance\n\n`
    content += `${productName} is designed to support compliance with:\n\n`
    content += `- **IMC 307.2.1** - Condensate Drain Sizing\n`
    content += `- **IMC 307.2.2** - Drain Pipe Materials and Installation\n`
    content += `- **IMC 307.2.3** - Auxiliary Drain Pan Requirements\n`
    content += `- **IMC 307.2.5** - Auxiliary Drain Systems\n\n`

    if (length !== 'short') {
      content += `### Implementation Strategies\n\n`
      content += `- **New Construction:** Include in building permit requirements\n`
      content += `- **Existing Buildings:** Encourage retrofitting during renovations\n`
      content += `- **Code Enforcement:** Use as a compliance tool for inspections\n`
      content += `- **Public Education:** Inform residents about preventive measures\n\n`
    }

    content += `### Municipal Partnership Opportunities\n\n`
    content += `- **Bulk Pricing:** Special rates for municipal purchases\n`
    content += `- **Installation Programs:** Partner with local contractors\n`
    content += `- **Code Development:** Input on local building code updates\n`
    content += `- **Public Awareness:** Educational materials for residents\n\n`

    content += `### Request Information\n\n`
    content += `Contact us to discuss how ${productName} can help your municipality ` +
      `maintain code compliance and protect community infrastructure.\n\n`

    return content
  }

  async generateInstallationGuide(args: any) {
    const { productId, difficulty = 'moderate', includeImages = true } = args

    // Get product details
    const productResult = await this.productManager.getProduct({ productId })
    if ('isError' in productResult && productResult.isError) {
      return productResult
    }

    const productText = productResult.content[0].text
    const productName = productText.match(/\*\*(.*?)\*\*/)?.[1] || productId

    const guide = this.createInstallationGuide(productName, productId, difficulty, includeImages)

    return {
      content: [
        {
          type: 'text',
          text: guide
        }
      ]
    }
  }

  private createInstallationGuide(
    productName: string,
    productId: string,
    difficulty: string,
    includeImages: boolean
  ): string {
    let guide = `# ${productName} Installation Guide\n\n`
    
    guide += `**Product:** ${productName}\n`
    guide += `**Difficulty Level:** ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}\n`
    guide += `**Estimated Time:** ${this.getEstimatedTime(difficulty)}\n`
    guide += `**Tools Required:** ${this.getRequiredTools(difficulty)}\n\n`

    guide += `## Safety First\n\n`
    guide += `⚠️ **Important Safety Notes:**\n\n`
    guide += `- Turn off power to your AC unit before beginning installation\n`
    guide += `- Wear safety glasses and work gloves\n`
    guide += `- Ensure proper ventilation in the work area\n`
    guide += `- If you're not comfortable with this installation, contact a professional\n\n`

    guide += `## Pre-Installation Checklist\n\n`
    guide += `Before you begin, gather the following:\n\n`
    guide += `- ${productName} unit\n`
    guide += `- Measuring tape\n`
    guide += `- Marker or pencil\n`
    guide += `- Hacksaw or pipe cutter\n`
    guide += `- Sandpaper or file\n`
    guide += `- Level (optional but recommended)\n\n`

    if (includeImages) {
      guide += `## Installation Steps\n\n`
    } else {
      guide += `## Installation Steps\n\n`
    }

    const steps = this.getInstallationSteps(productId, difficulty)
    steps.forEach((step, index) => {
      guide += `### Step ${index + 1}: ${step.title}\n\n`
      guide += `${step.description}\n\n`
      if (step.warning) {
        guide += `⚠️ **Warning:** ${step.warning}\n\n`
      }
      if (includeImages && step.image) {
        guide += `![Step ${index + 1}](images/installation/${step.image})\n\n`
      }
    })

    guide += `## Testing and Verification\n\n`
    guide += `After installation, follow these steps to verify proper operation:\n\n`
    guide += `1. **Turn on your AC unit** and let it run for 10-15 minutes\n`
    guide += `2. **Check for leaks** around all connections\n`
    guide += `3. **Verify drainage** - water should flow freely through the system\n`
    guide += `4. **Monitor for 24 hours** to ensure no issues develop\n\n`

    guide += `## Troubleshooting\n\n`
    guide += `### Common Issues and Solutions\n\n`
    guide += `**Problem:** Water not draining properly\n`
    guide += `**Solution:** Check for kinks in the drain line and ensure proper slope\n\n`
    guide += `**Problem:** Leaks at connections\n`
    guide += `**Solution:** Tighten connections and check for proper seating\n\n`
    guide += `**Problem:** Unit not fitting properly\n`
    guide += `**Solution:** Verify measurements and ensure adequate clearance\n\n`

    guide += `## Maintenance\n\n`
    guide += `To keep your ${productName} working optimally:\n\n`
    guide += `- **Monthly:** Check for visible clogs or debris\n`
    guide += `- **Seasonally:** Clean the unit and check all connections\n`
    guide += `- **Annually:** Have a professional inspect the entire system\n\n`

    guide += `## Support\n\n`
    guide += `Need help with your installation?\n\n`
    guide += `- **Technical Support:** [Your support contact]\n`
    guide += `- **Professional Installation:** [Your contractor network]\n`
    guide += `- **Video Tutorials:** [Your video resources]\n\n`

    guide += `---\n\n`
    guide += `*This installation guide is provided for informational purposes. Always follow local building codes ` +
      `and consult with qualified professionals when in doubt.*\n`

    return guide
  }

  private getEstimatedTime(difficulty: string): string {
    switch (difficulty) {
      case 'easy': return '15-30 minutes'
      case 'moderate': return '30-45 minutes'
      case 'professional': return '45-60 minutes'
      default: return '30-45 minutes'
    }
  }

  private getRequiredTools(difficulty: string): string {
    const baseTools = 'Measuring tape, marker, hacksaw or pipe cutter, sandpaper'
    switch (difficulty) {
      case 'easy': return baseTools
      case 'moderate': return `${baseTools}, level, pipe wrench`
      case 'professional': return `${baseTools}, level, pipe wrench, pipe threader, deburring tool`
      default: return baseTools
    }
  }

  private getInstallationSteps(productId: string, difficulty: string) {
    const baseSteps = [
      {
        title: 'Locate the Drain Line',
        description: 'Find your AC unit\'s condensate drain line. It\'s typically a PVC pipe that runs from your indoor unit to the outside or to a drain.',
        image: 'step1-locate-drain.jpg'
      },
      {
        title: 'Measure and Mark',
        description: 'Measure the length needed for the installation and mark the cut points on the drain line. Ensure you have adequate clearance for the unit.',
        image: 'step2-measure-mark.jpg'
      },
      {
        title: 'Cut the Drain Line',
        description: 'Using a hacksaw or pipe cutter, make clean cuts at your marked points. Ensure the cuts are straight and square.',
        warning: 'Be careful not to damage other components while cutting.',
        image: 'step3-cut-pipe.jpg'
      },
      {
        title: 'Prepare the Connections',
        description: 'Clean the cut ends of the pipe with sandpaper to remove any burrs or rough edges. This ensures a proper seal.',
        image: 'step4-prepare-connections.jpg'
      },
      {
        title: 'Install the Unit',
        description: 'Insert the unit into the drain line, ensuring proper alignment. The unit should fit snugly without forcing.',
        image: 'step5-install-unit.jpg'
      },
      {
        title: 'Secure Connections',
        description: 'Tighten all connections according to the manufacturer\'s specifications. Do not over-tighten as this can damage the fittings.',
        image: 'step6-secure-connections.jpg'
      }
    ]

    if (difficulty === 'professional') {
      baseSteps.push({
        title: 'Pressure Test',
        description: 'Perform a pressure test to ensure all connections are secure and there are no leaks.',
        image: 'step7-pressure-test.jpg'
      })
    }

    return baseSteps
  }
}
