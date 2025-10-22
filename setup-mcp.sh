#!/bin/bash

# AC Drain Wiz MCP Server Setup Script
echo "🚀 Setting up AC Drain Wiz MCP Server..."

# Get the current directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MCP_SERVER_PATH="$PROJECT_DIR/mcp-server/dist/index.js"

echo "📁 Project directory: $PROJECT_DIR"
echo "🔧 MCP server path: $MCP_SERVER_PATH"

# Check if the MCP server is built
if [ ! -f "$MCP_SERVER_PATH" ]; then
    echo "❌ MCP server not built. Building now..."
    cd "$PROJECT_DIR/mcp-server"
    npm run build
    cd "$PROJECT_DIR"
fi

echo "✅ MCP server is ready!"

# Create Claude Desktop config if it doesn't exist
CLAUDE_CONFIG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
if [ ! -f "$CLAUDE_CONFIG" ]; then
    echo "📝 Creating Claude Desktop configuration..."
    mkdir -p "$(dirname "$CLAUDE_CONFIG")"
    cat > "$CLAUDE_CONFIG" << EOF
{
  "mcpServers": {
    "acdw-mcp-server": {
      "command": "node",
      "args": ["$MCP_SERVER_PATH"],
      "env": {}
    }
  }
}
EOF
    echo "✅ Claude Desktop configuration created!"
else
    echo "⚠️  Claude Desktop configuration already exists."
    echo "   You may need to manually add the MCP server configuration."
fi

echo ""
echo "🎉 Setup complete! Here's what you can do next:"
echo ""
echo "1. Restart your AI assistant (Claude Desktop, Cursor, etc.)"
echo "2. Test the connection with these commands:"
echo "   - 'List all AC Drain Wiz products'"
echo "   - 'Generate an installation guide for AC Drain Wiz 1.0'"
echo "   - 'Calculate pricing for 50 units for HVAC professionals'"
echo "   - 'Show me the analytics summary'"
echo ""
echo "3. If you're using a different AI assistant, check the configuration files:"
echo "   - Cursor: .cursor/settings.json"
echo "   - VS Code: .vscode/settings.json"
echo ""
echo "🔗 MCP server path: $MCP_SERVER_PATH"
echo "📖 Documentation: $PROJECT_DIR/mcp-server/README.md"
