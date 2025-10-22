import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { Product, ProductSchema, ProductCategory } from '../types/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export class ProductManager {
  private dataPath: string

  constructor() {
    this.dataPath = join(__dirname, '../data/products.json')
  }

  private loadProducts(): Product[] {
    try {
      const data = readFileSync(this.dataPath, 'utf-8')
      return JSON.parse(data).map((product: any) => ({
        ...product,
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.updatedAt)
      }))
    } catch (error) {
      console.error('Error loading products:', error)
      return []
    }
  }

  private saveProducts(products: Product[]): void {
    try {
      writeFileSync(this.dataPath, JSON.stringify(products, null, 2))
    } catch (error) {
      console.error('Error saving products:', error)
      throw new Error('Failed to save products')
    }
  }

  async listProducts(args: any) {
    const products = this.loadProducts()
    let filteredProducts = products

    // Apply filters
    if (args.category) {
      filteredProducts = filteredProducts.filter(p => p.category === args.category)
    }
    if (args.inStock !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.inStock === args.inStock)
    }

    const productList = filteredProducts.map(product => ({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      proPrice: product.proPrice,
      bulkPrice: product.bulkPrice,
      inStock: product.inStock,
      shortDescription: product.shortDescription
    }))

    return {
      content: [
        {
          type: 'text',
          text: `Found ${productList.length} products:\n\n${productList.map(p => 
            `**${p.name}** (${p.category})\n` +
            `- Price: $${p.price} (Retail) | $${p.proPrice || 'N/A'} (Pro) | $${p.bulkPrice || 'N/A'} (Bulk)\n` +
            `- Stock: ${p.inStock ? 'In Stock' : 'Out of Stock'}\n` +
            `- Description: ${p.shortDescription}\n`
          ).join('\n')}`
        }
      ]
    }
  }

  async getProduct(args: any) {
    const products = this.loadProducts()
    const product = products.find(p => p.id === args.productId)

    if (!product) {
      return {
        content: [
          {
            type: 'text',
            text: `Product with ID "${args.productId}" not found.`
          }
        ],
        isError: true
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: `**${product.name}**\n\n` +
            `**Category:** ${product.category}\n` +
            `**Description:** ${product.description}\n\n` +
            `**Pricing:**\n` +
            `- Retail: $${product.price}\n` +
            `- Pro: $${product.proPrice || 'N/A'}\n` +
            `- Bulk: $${product.bulkPrice || 'N/A'}\n\n` +
            `**Features:**\n${product.features.map(f => `- ${f}`).join('\n')}\n\n` +
            `**Specifications:**\n${Object.entries(product.specifications || {}).map(([key, value]) => 
              `- ${key}: ${value}`
            ).join('\n')}\n\n` +
            `**ICC Compliance:**\n${product.iccCompliance.map(code => `- ${code}`).join('\n')}\n\n` +
            `**Stock Status:** ${product.inStock ? 'In Stock' : 'Out of Stock'}\n` +
            `**Created:** ${product.createdAt.toISOString()}\n` +
            `**Updated:** ${product.updatedAt.toISOString()}`
        }
      ]
    }
  }

  async createProduct(args: any) {
    const products = this.loadProducts()
    
    // Generate ID and slug
    const id = args.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
    const slug = id

    // Check if product already exists
    if (products.find(p => p.id === id)) {
      return {
        content: [
          {
            type: 'text',
            text: `Product with ID "${id}" already exists.`
          }
        ],
        isError: true
      }
    }

    const newProduct: Product = {
      id,
      name: args.name,
      slug,
      description: args.description,
      shortDescription: args.shortDescription,
      price: args.price,
      proPrice: args.proPrice,
      bulkPrice: args.bulkPrice,
      image: `/images/products/${id}-main.jpg`,
      images: [`/images/products/${id}-main.jpg`],
      category: args.category as ProductCategory,
      features: args.features,
      specifications: args.specifications || {},
      iccCompliance: args.iccCompliance || [],
      inStock: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Validate the product
    try {
      ProductSchema.parse(newProduct)
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Invalid product data: ${error}`
          }
        ],
        isError: true
      }
    }

    products.push(newProduct)
    this.saveProducts(products)

    return {
      content: [
        {
          type: 'text',
          text: `Successfully created product "${newProduct.name}" with ID "${newProduct.id}".\n\n` +
            `**Next Steps:**\n` +
            `1. Add product images to /public/images/products/\n` +
            `2. Update website navigation if needed\n` +
            `3. Generate installation guide: generate_installation_guide\n` +
            `4. Create compliance documentation: generate_compliance_document`
        }
      ]
    }
  }

  async updatePricing(args: any) {
    const products = this.loadProducts()
    const productIndex = products.findIndex(p => p.id === args.productId)

    if (productIndex === -1) {
      return {
        content: [
          {
            type: 'text',
            text: `Product with ID "${args.productId}" not found.`
          }
        ],
        isError: true
      }
    }

    const product = products[productIndex]
    
    // Update pricing
    if (args.retailPrice !== undefined) product.price = args.retailPrice
    if (args.proPrice !== undefined) product.proPrice = args.proPrice
    if (args.bulkPrice !== undefined) product.bulkPrice = args.bulkPrice
    
    product.updatedAt = new Date()
    
    this.saveProducts(products)

    return {
      content: [
        {
          type: 'text',
          text: `Successfully updated pricing for "${product.name}":\n\n` +
            `- Retail: $${product.price}\n` +
            `- Pro: $${product.proPrice || 'N/A'}\n` +
            `- Bulk: $${product.bulkPrice || 'N/A'}\n\n` +
            `**Note:** You may need to update the website to reflect these changes.`
        }
      ]
    }
  }

  async generateComparison(args: any) {
    const products = this.loadProducts()
    let productsToCompare = products

    if (args.products && args.products.length > 0) {
      productsToCompare = products.filter(p => args.products.includes(p.id))
    }

    if (productsToCompare.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: 'No products found for comparison.'
          }
        ],
        isError: true
      }
    }

    const format = args.format || 'table'

    if (format === 'table') {
      const table = this.generateComparisonTable(productsToCompare)
      return {
        content: [
          {
            type: 'text',
            text: `# AC Drain Wiz Product Comparison\n\n${table}`
          }
        ]
      }
    } else if (format === 'markdown') {
      const markdown = this.generateComparisonMarkdown(productsToCompare)
      return {
        content: [
          {
            type: 'text',
            text: markdown
          }
        ]
      }
    } else if (format === 'html') {
      const html = this.generateComparisonHTML(productsToCompare)
      return {
        content: [
          {
            type: 'text',
            text: html
          }
        ]
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: 'Invalid format specified. Use: table, markdown, or html'
        }
      ],
      isError: true
    }
  }

  private generateComparisonTable(products: Product[]): string {
    const headers = ['Feature', ...products.map(p => p.name)]
    const rows = [
      ['Price (Retail)', ...products.map(p => `$${p.price}`)],
      ['Price (Pro)', ...products.map(p => `$${p.proPrice || 'N/A'}`)],
      ['Price (Bulk)', ...products.map(p => `$${p.bulkPrice || 'N/A'}`)],
      ['Category', ...products.map(p => p.category)],
      ['Stock Status', ...products.map(p => p.inStock ? 'In Stock' : 'Out of Stock')],
      ['Key Features', ...products.map(p => p.features.slice(0, 2).join(', '))]
    ]

    const maxWidths = headers.map((_, i) => 
      Math.max(...rows.map(row => row[i]?.length || 0), headers[i].length)
    )

    const formatRow = (row: string[]) => 
      row.map((cell, i) => cell.padEnd(maxWidths[i])).join(' | ')

    const separator = maxWidths.map(width => '-'.repeat(width)).join('-|-')

    return [
      formatRow(headers),
      separator,
      ...rows.map(formatRow)
    ].join('\n')
  }

  private generateComparisonMarkdown(products: Product[]): string {
    let markdown = '# AC Drain Wiz Product Comparison\n\n'

    products.forEach(product => {
      markdown += `## ${product.name}\n\n`
      markdown += `**Category:** ${product.category}\n\n`
      markdown += `**Pricing:**\n`
      markdown += `- Retail: $${product.price}\n`
      markdown += `- Pro: $${product.proPrice || 'N/A'}\n`
      markdown += `- Bulk: $${product.bulkPrice || 'N/A'}\n\n`
      markdown += `**Description:** ${product.shortDescription}\n\n`
      markdown += `**Key Features:**\n`
      product.features.forEach(feature => {
        markdown += `- ${feature}\n`
      })
      markdown += `\n**Stock Status:** ${product.inStock ? 'In Stock' : 'Out of Stock'}\n\n`
      markdown += '---\n\n'
    })

    return markdown
  }

  private generateComparisonHTML(products: Product[]): string {
    let html = `
      <div class="product-comparison">
        <h1>AC Drain Wiz Product Comparison</h1>
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Feature</th>
              ${products.map(p => `<th>${p.name}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Price (Retail)</td>
              ${products.map(p => `<td>$${p.price}</td>`).join('')}
            </tr>
            <tr>
              <td>Price (Pro)</td>
              ${products.map(p => `<td>$${p.proPrice || 'N/A'}</td>`).join('')}
            </tr>
            <tr>
              <td>Price (Bulk)</td>
              ${products.map(p => `<td>$${p.bulkPrice || 'N/A'}</td>`).join('')}
            </tr>
            <tr>
              <td>Category</td>
              ${products.map(p => `<td>${p.category}</td>`).join('')}
            </tr>
            <tr>
              <td>Stock Status</td>
              ${products.map(p => `<td>${p.inStock ? 'In Stock' : 'Out of Stock'}</td>`).join('')}
            </tr>
          </tbody>
        </table>
      </div>
    `

    return html
  }
}
