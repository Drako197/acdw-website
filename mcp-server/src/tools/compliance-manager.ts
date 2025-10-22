import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { ICCCode } from '../types/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export class ComplianceManager {
  private dataPath: string

  constructor() {
    this.dataPath = join(__dirname, '../data/icc-codes.json')
  }

  private loadICCCodes(): ICCCode[] {
    try {
      const data = readFileSync(this.dataPath, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Error loading ICC codes:', error)
      return []
    }
  }

  async getICCCodes(args: any) {
    const codes = this.loadICCCodes()
    let filteredCodes = codes

    // If productId is specified, filter codes applicable to that product
    if (args.productId) {
      // This would require loading products to match, but for now we'll return all codes
      // In a real implementation, you'd cross-reference with product data
    }

    const codeList = filteredCodes.map(code => ({
      code: code.code,
      title: code.title,
      description: code.description,
      applicableProducts: code.applicableProducts,
      complianceNotes: code.complianceNotes
    }))

    return {
      content: [
        {
          type: 'text',
          text: `# ICC Code Compliance for AC Drain Wiz Products\n\n` +
            `Found ${codeList.length} applicable ICC codes:\n\n` +
            codeList.map(code => 
              `## ${code.code} - ${code.title}\n\n` +
              `**Description:** ${code.description}\n\n` +
              `**Applicable Products:** ${code.applicableProducts.join(', ')}\n\n` +
              `**Compliance Notes:** ${code.complianceNotes}\n\n` +
              `---\n\n`
            ).join('')
        }
      ]
    }
  }

  async generateComplianceDocument(args: any) {
    const codes = this.loadICCCodes()
    const format = args.format || 'markdown'

    // Load product data to get product name
    const productManager = new (await import('./product-manager.js')).ProductManager()
    const productResult = await productManager.getProduct({ productId: args.productId })
    
    if (productResult.isError) {
      return productResult
    }

    const productName = args.productId.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())

    // Filter codes applicable to this product
    const applicableCodes = codes.filter(code => 
      code.applicableProducts.includes(args.productId.split('-')[1]?.toUpperCase() || '')
    )

    if (format === 'markdown') {
      const markdown = this.generateMarkdownComplianceDoc(productName, applicableCodes)
      return {
        content: [
          {
            type: 'text',
            text: markdown
          }
        ]
      }
    } else if (format === 'html') {
      const html = this.generateHTMLComplianceDoc(productName, applicableCodes)
      return {
        content: [
          {
            type: 'text',
            text: html
          }
        ]
      }
    } else if (format === 'pdf') {
      // For PDF generation, we'd typically use a library like puppeteer
      // For now, we'll return markdown that can be converted to PDF
      const markdown = this.generateMarkdownComplianceDoc(productName, applicableCodes)
      return {
        content: [
          {
            type: 'text',
            text: `# PDF Generation\n\n` +
              `PDF generation is not yet implemented. Here's the markdown version:\n\n` +
              markdown +
              `\n\n**To generate PDF:**\n` +
              `1. Copy the markdown content above\n` +
              `2. Use a markdown to PDF converter\n` +
              `3. Or implement PDF generation in the MCP server`
          }
        ]
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: 'Invalid format specified. Use: markdown, html, or pdf'
        }
      ],
      isError: true
    }
  }

  private generateMarkdownComplianceDoc(productName: string, codes: ICCCode[]): string {
    let markdown = `# ICC Code Compliance Documentation\n\n`
    markdown += `**Product:** ${productName}\n\n`
    markdown += `**Generated:** ${new Date().toISOString()}\n\n`
    markdown += `## Compliance Summary\n\n`
    markdown += `This document outlines the ICC (International Code Council) code compliance for the ${productName} product. ` +
      `The product is designed to meet or exceed the requirements of the following codes:\n\n`

    codes.forEach((code, index) => {
      markdown += `${index + 1}. ${code.code} - ${code.title}\n`
    })

    markdown += `\n## Detailed Compliance Information\n\n`

    codes.forEach(code => {
      markdown += `### ${code.code} - ${code.title}\n\n`
      markdown += `**Description:** ${code.description}\n\n`
      markdown += `**Compliance Statement:** ${code.complianceNotes}\n\n`
      if (code.referenceUrl) {
        markdown += `**Reference:** [${code.code} Documentation](${code.referenceUrl})\n\n`
      }
      markdown += `---\n\n`
    })

    markdown += `## Installation Guidelines\n\n`
    markdown += `When installing the ${productName}, ensure compliance with local building codes and the following guidelines:\n\n`
    markdown += `1. **Professional Installation Recommended:** While the product is designed for easy installation, ` +
      `professional installation ensures full code compliance.\n\n`
    markdown += `2. **Local Code Variations:** Always check with local building authorities for any additional ` +
      `requirements or variations from the ICC codes.\n\n`
    markdown += `3. **Permit Requirements:** Some jurisdictions may require permits for HVAC system modifications.\n\n`
    markdown += `4. **Inspection:** Consider scheduling an inspection to verify compliance with local codes.\n\n`

    markdown += `## Contact Information\n\n`
    markdown += `For questions about code compliance or installation guidelines, contact:\n\n`
    markdown += `- **Technical Support:** [Your support contact]\n`
    markdown += `- **Compliance Questions:** [Your compliance contact]\n`
    markdown += `- **Local Code Information:** Contact your local building department\n\n`

    markdown += `---\n\n`
    markdown += `*This document is provided for informational purposes. Always consult with local building ` +
      `authorities and qualified professionals for specific compliance requirements in your jurisdiction.*\n`

    return markdown
  }

  private generateHTMLComplianceDoc(productName: string, codes: ICCCode[]): string {
    let html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ICC Code Compliance - ${productName}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
          h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
          h2 { color: #1e40af; margin-top: 30px; }
          h3 { color: #1e3a8a; }
          .summary { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .code-section { margin: 20px 0; padding: 15px; border-left: 4px solid #3b82f6; }
          .contact-info { background: #f0f9ff; padding: 20px; border-radius: 8px; margin-top: 30px; }
          ul { padding-left: 20px; }
          li { margin: 5px 0; }
        </style>
      </head>
      <body>
        <h1>ICC Code Compliance Documentation</h1>
        
        <div class="summary">
          <p><strong>Product:</strong> ${productName}</p>
          <p><strong>Generated:</strong> ${new Date().toISOString()}</p>
        </div>

        <h2>Compliance Summary</h2>
        <p>This document outlines the ICC (International Code Council) code compliance for the ${productName} product. 
        The product is designed to meet or exceed the requirements of the following codes:</p>
        
        <ol>
    `

    codes.forEach(code => {
      html += `<li>${code.code} - ${code.title}</li>`
    })

    html += `
        </ol>

        <h2>Detailed Compliance Information</h2>
    `

    codes.forEach(code => {
      html += `
        <div class="code-section">
          <h3>${code.code} - ${code.title}</h3>
          <p><strong>Description:</strong> ${code.description}</p>
          <p><strong>Compliance Statement:</strong> ${code.complianceNotes}</p>
          ${code.referenceUrl ? `<p><strong>Reference:</strong> <a href="${code.referenceUrl}">${code.code} Documentation</a></p>` : ''}
        </div>
      `
    })

    html += `
        <h2>Installation Guidelines</h2>
        <p>When installing the ${productName}, ensure compliance with local building codes and the following guidelines:</p>
        
        <ol>
          <li><strong>Professional Installation Recommended:</strong> While the product is designed for easy installation, 
          professional installation ensures full code compliance.</li>
          <li><strong>Local Code Variations:</strong> Always check with local building authorities for any additional 
          requirements or variations from the ICC codes.</li>
          <li><strong>Permit Requirements:</strong> Some jurisdictions may require permits for HVAC system modifications.</li>
          <li><strong>Inspection:</strong> Consider scheduling an inspection to verify compliance with local codes.</li>
        </ol>

        <div class="contact-info">
          <h2>Contact Information</h2>
          <p>For questions about code compliance or installation guidelines, contact:</p>
          <ul>
            <li><strong>Technical Support:</strong> [Your support contact]</li>
            <li><strong>Compliance Questions:</strong> [Your compliance contact]</li>
            <li><strong>Local Code Information:</strong> Contact your local building department</li>
          </ul>
        </div>

        <hr>
        <p><em>This document is provided for informational purposes. Always consult with local building 
        authorities and qualified professionals for specific compliance requirements in your jurisdiction.</em></p>
      </body>
      </html>
    `

    return html
  }
}
