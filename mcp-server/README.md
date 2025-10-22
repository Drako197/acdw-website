# AC Drain Wiz MCP Server

A Model Context Protocol (MCP) server specifically designed for managing the AC Drain Wiz website and business operations.

## Features

This MCP server provides 13 powerful tools for managing your AC Drain Wiz business:

### Product Management
- **list_products** - List all AC Drain Wiz products with their details
- **get_product** - Get detailed information about a specific product
- **create_product** - Create a new AC Drain Wiz product
- **update_product_pricing** - Update pricing for a product across different customer types
- **generate_product_comparison** - Generate a comparison chart between AC Drain Wiz products

### Compliance Management
- **get_icc_codes** - Get ICC code compliance information for AC Drain Wiz products
- **generate_compliance_document** - Generate ICC code compliance documentation for a product

### Content Generation
- **generate_product_description** - Generate customer-type-specific product descriptions
- **generate_installation_guide** - Generate installation guide for a product

### Customer Management
- **get_customer_types** - Get customer type configurations and pricing tiers
- **calculate_pricing** - Calculate pricing for a product based on customer type and quantity

### Analytics
- **get_analytics_summary** - Get website analytics summary and key metrics
- **generate_sales_report** - Generate sales report with product performance and customer insights

## Installation

```bash
cd mcp-server
npm install
npm run build
```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Testing
```bash
node test-server.js
```

## Example Commands

Once connected to your AI assistant, you can use commands like:

- "List all products with their pricing"
- "Generate an installation guide for AC Drain Wiz 1.0"
- "Create ICC compliance documentation for the Mini model"
- "Calculate pricing for 50 units for HVAC professionals"
- "Generate a product comparison chart"
- "Show me the analytics summary for the last 30 days"

## Data Structure

The server includes pre-loaded data for:

- **3 AC Drain Wiz Products**: 1.0, Mini, and Sensor models
- **ICC Code Compliance**: IMC 307.2.1, 307.2.2, 307.2.3, 307.2.5, and IRC M1411
- **Customer Types**: Homeowner, HVAC Professional, City Official
- **Pricing Tiers**: Retail, Pro, Bulk, and Contact pricing

## Integration

This MCP server is designed to work with AI assistants that support the Model Context Protocol. It provides deep integration with your AC Drain Wiz business operations, allowing for:

- Automated content generation
- Product management
- Compliance documentation
- Customer segmentation
- Analytics and reporting

## File Structure

```
mcp-server/
├── src/
│   ├── index.ts              # Main server file
│   ├── types/index.ts        # TypeScript type definitions
│   ├── data/                 # JSON data files
│   │   ├── products.json
│   │   ├── icc-codes.json
│   │   └── customer-types.json
│   └── tools/                # Tool implementations
│       ├── product-manager.ts
│       ├── compliance-manager.ts
│       ├── content-generator.ts
│       ├── customer-manager.ts
│       └── analytics-manager.ts
├── dist/                     # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## Benefits

### For You (Prompt Engineer):
- **One-Command Operations**: "Add a new product with ICC compliance docs"
- **Automated Content Generation**: Generate product descriptions, installation guides, and compliance documentation
- **Business Intelligence**: Get analytics and sales reports with a single command
- **Streamlined Workflows**: Manage your entire product line and customer base efficiently

### For AI Assistant:
- **Project-Aware Capabilities**: Direct access to your product catalog, pricing, and customer data
- **Specialized Tools**: Built specifically for AC Drain Wiz business operations
- **Contextual Understanding**: Knows your business rules, pricing tiers, and compliance requirements
- **Workflow Automation**: Execute complex multi-step processes with a single command

## Next Steps

1. **Connect to your AI assistant** using the MCP protocol
2. **Test the tools** with sample commands
3. **Customize the data** in the JSON files to match your exact products and pricing
4. **Extend functionality** by adding new tools as needed

The server is now ready to transform your AI assistant into a powerful AC Drain Wiz business management tool!
