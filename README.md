# one-united-ts

[![GitHub License](https://img.shields.io/github/license/JmPotato/one-united-ts)](https://github.com/JmPotato/one-united-ts/blob/main/LICENSE)
[![Deno Test](https://github.com/JmPotato/one-united-ts/actions/workflows/deno-test.yml/badge.svg)](https://github.com/JmPotato/one-united-ts/actions/workflows/deno-test.yml)

A TypeScript implementation of [one-united](https://github.com/JmPotato/one-united), providing a robust API gateway for Large Language Models (LLMs). This version enhances the original Rust implementation with improved deployment capabilities while maintaining core functionality.

## ✨ Key Features

* 🚀 **Seamless Deployment**: Zero-configuration deployment to Deno Deploy
* 🔄 **OpenAI API Compatible**: Direct replacement for existing OpenAI API clients
* ⚖️ **Intelligent Load Balancing**: Dynamic routing based on provider latency
* 🌐 **Multi-Provider Integration**: Single unified interface for multiple LLM providers

## 🚀 Deno Deploy

Refer to [Deno Deploy](https://docs.deno.com/deploy/manual) for detailed deployment steps.

## 💻 Local Development

1. Install Deno:
```bash
curl -fsSL https://deno.land/install.sh | sh  # macOS/Linux
irm https://deno.land/install.ps1 | iex      # Windows (PowerShell)
```

2. Clone the repository:
```bash
git clone https://github.com/JmPotato/one-united-ts.git
cd one-united-ts
```

3. Set up environment variables:
```bash
# Create a .env file
echo "ONE_API_KEY=your_secret_key" > .env
```

4. Start the development server:
```bash
deno task dev
```

The server will start at `http://0.0.0.0:5299` by default.

## 🔧 Configuration

Configure your LLM providers and routing rules using either YAML or JSON format (`config.yaml` or `config.json`). Example configuration:

```yaml
providers:
  - name: OpenAI
    identifier: openai-platform
    endpoint: https://api.openai.com
    path: /v1/chat/completions
    api_key: $YOUR_OPENAI_API_KEY
    models:
      - gpt-4o
  - name: GitHub Models
    identifier: github-models
    endpoint: https://models.inference.ai.azure.com
    path: /chat/completions
    api_key: $YOUR_GITHUB_API_KEY
    models:
      - gpt-4o

rules:
  - model: gpt-4o
    providers:
      - identifier: openai-platform
        models:
          - gpt-4o
      - identifier: github-models
        models:
          - gpt-4o
```

### Applying Configuration

Upload your configuration:

```bash
curl -X POST https://your-deployment-url/config \
  -H "Content-Type: application/yaml" \
  -H "Authorization: Bearer $ONE_API_KEY" \
  --data-binary @config.yaml
```

Verify the configuration:

```bash
curl -s https://your-deployment-url/config \
  -H "Accept: application/yaml" \
  -H "Authorization: Bearer $ONE_API_KEY"
```

**Note**: Ensure proper `Content-Type` headers and use `--data-binary` for YAML files to preserve formatting.

## 🔑 API Reference

Use the API similarly to OpenAI's API:

```bash
curl https://your-deployment-url/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ONE_API_KEY" \
  -d '{
    "stream": true,
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Say this is a test!"}],
    "temperature": 0.7
  }'
```

### Available Endpoints

| Endpoint               | Method | Description                                |
| ---------------------- | ------ | ------------------------------------------ |
| `/config`              | GET    | Retrieve current configuration             |
| `/config`              | POST   | Update configuration                       |
| `/stats`               | GET    | Get routing statistics and config hash     |
| `/v1/models`           | GET    | List available models                      |
| `/v1/chat/completions` | POST   | OpenAI-compatible chat completion endpoint |

### Provider Selection Override

Override default routing using the `model@@provider` syntax:

```json
{
  "model": "openai/gpt-4@@openrouter",  // Use openai/gpt-4 specifically from openrouter
  "messages": [...]
}
```

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.
