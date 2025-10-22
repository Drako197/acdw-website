#!/usr/bin/env node

// Test script to verify MCP server connection
import { spawn } from 'child_process'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('🧪 Testing AC Drain Wiz MCP Server Connection...\n')

// Test different MCP tools
const tests = [
  {
    name: 'List Products',
    request: {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: 'list_products',
        arguments: {}
      }
    }
  },
  {
    name: 'Get Product Details',
    request: {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'get_product',
        arguments: { productId: 'drain-wiz-1-0' }
      }
    }
  },
  {
    name: 'Calculate Pricing',
    request: {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'calculate_pricing',
        arguments: {
          productId: 'drain-wiz-1-0',
          customerType: 'hvac-professional',
          quantity: 10
        }
      }
    }
  }
]

async function runTest(test) {
  return new Promise((resolve) => {
    const serverPath = join(__dirname, 'mcp-server/dist/index.js')
    const server = spawn('node', [serverPath], {
      stdio: ['pipe', 'pipe', 'pipe']
    })

    let output = ''
    let errorOutput = ''

    server.stdout.on('data', (data) => {
      output += data.toString()
    })

    server.stderr.on('data', (data) => {
      errorOutput += data.toString()
    })

    server.on('close', (code) => {
      try {
        const response = JSON.parse(output)
        if (response.result) {
          console.log(`✅ ${test.name}: SUCCESS`)
          if (response.result.content && response.result.content[0]) {
            const text = response.result.content[0].text
            const preview = text.length > 100 ? text.substring(0, 100) + '...' : text
            console.log(`   Preview: ${preview}`)
          }
        } else {
          console.log(`❌ ${test.name}: FAILED`)
          console.log(`   Error: ${response.error?.message || 'Unknown error'}`)
        }
      } catch (error) {
        console.log(`❌ ${test.name}: FAILED`)
        console.log(`   Parse Error: ${error.message}`)
        console.log(`   Raw Output: ${output}`)
      }
      resolve()
    })

    // Send the request
    server.stdin.write(JSON.stringify(test.request) + '\n')

    // Kill the server after 3 seconds
    setTimeout(() => {
      server.kill()
    }, 3000)
  })
}

async function runAllTests() {
  console.log('Running MCP server tests...\n')
  
  for (const test of tests) {
    await runTest(test)
    console.log('') // Add spacing between tests
  }
  
  console.log('🎉 Test complete!')
  console.log('\n📋 Next Steps:')
  console.log('1. Run: ./setup-mcp.sh')
  console.log('2. Restart your AI assistant')
  console.log('3. Try commands like:')
  console.log('   - "List all AC Drain Wiz products"')
  console.log('   - "Generate an installation guide for AC Drain Wiz 1.0"')
  console.log('   - "Calculate pricing for 50 units for HVAC professionals"')
}

runAllTests().catch(console.error)
