#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { z } from 'zod'
import { ProductManager } from './tools/product-manager.js'
import { ComplianceManager } from './tools/compliance-manager.js'
import { ContentGenerator } from './tools/content-generator.js'
import { CustomerManager } from './tools/customer-manager.js'
import { AnalyticsManager } from './tools/analytics-manager.js'

class ACDrainWizMCPServer {
  private server: Server
  private productManager: ProductManager
  private complianceManager: ComplianceManager
  private contentGenerator: ContentGenerator
  private customerManager: CustomerManager
  private analyticsManager: AnalyticsManager

  constructor() {
    this.server = new Server(
      {
        name: 'acdw-mcp-server',
        version: '1.0.0',
      }
    )

    // Initialize managers
    this.productManager = new ProductManager()
    this.complianceManager = new ComplianceManager()
    this.contentGenerator = new ContentGenerator()
    this.customerManager = new CustomerManager()
    this.analyticsManager = new AnalyticsManager()

    this.setupToolHandlers()
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          // Product Management Tools
          {
            name: 'list_products',
            description: 'List all AC Drain Wiz products with their details',
            inputSchema: {
              type: 'object',
              properties: {
                category: {
                  type: 'string',
                  enum: ['DRAIN_WIZ_1_0', 'DRAIN_WIZ_MINI', 'DRAIN_WIZ_SENSOR'],
                  description: 'Filter by product category (optional)'
                },
                inStock: {
                  type: 'boolean',
                  description: 'Filter by stock availability (optional)'
                }
              }
            }
          },
          {
            name: 'get_product',
            description: 'Get detailed information about a specific product',
            inputSchema: {
              type: 'object',
              properties: {
                productId: {
                  type: 'string',
                  description: 'The ID of the product to retrieve'
                }
              },
              required: ['productId']
            }
          },
          {
            name: 'create_product',
            description: 'Create a new AC Drain Wiz product',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                shortDescription: { type: 'string' },
                price: { type: 'number' },
                proPrice: { type: 'number' },
                bulkPrice: { type: 'number' },
                category: {
                  type: 'string',
                  enum: ['DRAIN_WIZ_1_0', 'DRAIN_WIZ_MINI', 'DRAIN_WIZ_SENSOR']
                },
                features: {
                  type: 'array',
                  items: { type: 'string' }
                },
                specifications: { type: 'object' },
                iccCompliance: {
                  type: 'array',
                  items: { type: 'string' }
                }
              },
              required: ['name', 'description', 'shortDescription', 'price', 'category', 'features']
            }
          },
          {
            name: 'update_product_pricing',
            description: 'Update pricing for a product across different customer types',
            inputSchema: {
              type: 'object',
              properties: {
                productId: { type: 'string' },
                retailPrice: { type: 'number' },
                proPrice: { type: 'number' },
                bulkPrice: { type: 'number' }
              },
              required: ['productId']
            }
          },
          {
            name: 'generate_product_comparison',
            description: 'Generate a comparison chart between AC Drain Wiz products',
            inputSchema: {
              type: 'object',
              properties: {
                products: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Product IDs to compare (optional, defaults to all)'
                },
                format: {
                  type: 'string',
                  enum: ['table', 'markdown', 'html'],
                  description: 'Output format for the comparison'
                }
              }
            }
          },
          // Compliance Tools
          {
            name: 'get_icc_codes',
            description: 'Get ICC code compliance information for AC Drain Wiz products',
            inputSchema: {
              type: 'object',
              properties: {
                productId: {
                  type: 'string',
                  description: 'Get codes for specific product (optional)'
                }
              }
            }
          },
          {
            name: 'generate_compliance_document',
            description: 'Generate ICC code compliance documentation for a product',
            inputSchema: {
              type: 'object',
              properties: {
                productId: { type: 'string' },
                format: {
                  type: 'string',
                  enum: ['pdf', 'markdown', 'html'],
                  description: 'Output format for the document'
                }
              },
              required: ['productId']
            }
          },
          // Content Generation Tools
          {
            name: 'generate_product_description',
            description: 'Generate customer-type-specific product descriptions',
            inputSchema: {
              type: 'object',
              properties: {
                productId: { type: 'string' },
                customerType: {
                  type: 'string',
                  enum: ['homeowner', 'hvac-professional', 'city-official']
                },
                length: {
                  type: 'string',
                  enum: ['short', 'medium', 'long'],
                  description: 'Length of the description'
                }
              },
              required: ['productId', 'customerType']
            }
          },
          {
            name: 'generate_installation_guide',
            description: 'Generate installation guide for a product',
            inputSchema: {
              type: 'object',
              properties: {
                productId: { type: 'string' },
                difficulty: {
                  type: 'string',
                  enum: ['easy', 'moderate', 'professional']
                },
                includeImages: { type: 'boolean' }
              },
              required: ['productId']
            }
          },
          // Customer Management Tools
          {
            name: 'get_customer_types',
            description: 'Get customer type configurations and pricing tiers',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          },
          {
            name: 'calculate_pricing',
            description: 'Calculate pricing for a product based on customer type and quantity',
            inputSchema: {
              type: 'object',
              properties: {
                productId: { type: 'string' },
                customerType: {
                  type: 'string',
                  enum: ['homeowner', 'hvac-professional', 'city-official']
                },
                quantity: { type: 'number' }
              },
              required: ['productId', 'customerType', 'quantity']
            }
          },
          // Analytics Tools
          {
            name: 'get_analytics_summary',
            description: 'Get website analytics summary and key metrics',
            inputSchema: {
              type: 'object',
              properties: {
                dateRange: {
                  type: 'string',
                  enum: ['7d', '30d', '90d', '1y'],
                  description: 'Date range for analytics data'
                }
              }
            }
          },
          {
            name: 'generate_sales_report',
            description: 'Generate sales report with product performance and customer insights',
            inputSchema: {
              type: 'object',
              properties: {
                dateRange: {
                  type: 'string',
                  enum: ['7d', '30d', '90d', '1y']
                },
                format: {
                  type: 'string',
                  enum: ['summary', 'detailed', 'csv']
                }
              }
            }
          }
        ]
      }
    })

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params

      try {
        switch (name) {
          // Product Management
          case 'list_products':
            return await this.productManager.listProducts(args)
          case 'get_product':
            return await this.productManager.getProduct(args)
          case 'create_product':
            return await this.productManager.createProduct(args)
          case 'update_product_pricing':
            return await this.productManager.updatePricing(args)
          case 'generate_product_comparison':
            return await this.productManager.generateComparison(args)

          // Compliance Management
          case 'get_icc_codes':
            return await this.complianceManager.getICCCodes(args)
          case 'generate_compliance_document':
            return await this.complianceManager.generateComplianceDocument(args)

          // Content Generation
          case 'generate_product_description':
            return await this.contentGenerator.generateProductDescription(args)
          case 'generate_installation_guide':
            return await this.contentGenerator.generateInstallationGuide(args)

          // Customer Management
          case 'get_customer_types':
            return await this.customerManager.getCustomerTypes(args)
          case 'calculate_pricing':
            return await this.customerManager.calculatePricing(args)

          // Analytics
          case 'get_analytics_summary':
            return await this.analyticsManager.getAnalyticsSummary(args)
          case 'generate_sales_report':
            return await this.analyticsManager.generateSalesReport(args)

          default:
            throw new Error(`Unknown tool: ${name}`)
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing tool ${name}: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        }
      }
    })
  }

  async run() {
    const transport = new StdioServerTransport()
    await this.server.connect(transport)
    console.error('AC Drain Wiz MCP Server running on stdio')
  }
}

const server = new ACDrainWizMCPServer()
server.run().catch(console.error)
