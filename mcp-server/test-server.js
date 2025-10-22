#!/usr/bin/env node

// Simple test to verify MCP server functionality
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('Testing AC Drain Wiz MCP Server...')

// Test the server by sending a list_tools request
const serverPath = join(__dirname, 'dist/index.js')
const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'pipe']
})

// Send a list_tools request
const request = {
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/list',
  params: {}
}

server.stdin.write(JSON.stringify(request) + '\n')

let output = ''
server.stdout.on('data', (data) => {
  output += data.toString()
})

server.stderr.on('data', (data) => {
  console.error('Server error:', data.toString())
})

server.on('close', (code) => {
  console.log('Server exited with code:', code)
  try {
    const response = JSON.parse(output)
    if (response.result && response.result.tools) {
      console.log('✅ MCP Server is working!')
      console.log(`Found ${response.result.tools.length} tools:`)
      response.result.tools.forEach(tool => {
        console.log(`  - ${tool.name}: ${tool.description}`)
      })
    } else {
      console.log('❌ Unexpected response:', response)
    }
  } catch (error) {
    console.log('❌ Failed to parse response:', error.message)
    console.log('Raw output:', output)
  }
})

// Kill the server after 5 seconds
setTimeout(() => {
  server.kill()
}, 5000)
