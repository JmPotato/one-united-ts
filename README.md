# one-united-ts

[![GitHub License](https://img.shields.io/github/license/JmPotato/one-united-ts)](https://github.com/JmPotato/one-united-ts/blob/main/LICENSE)
[![Bun Test](https://github.com/JmPotato/one-united-ts/actions/workflows/bun-test.yml/badge.svg)](https://github.com/JmPotato/one-united-ts/actions/workflows/bun-test.yml)

A TypeScript implementation of [one-united](https://github.com/JmPotato/one-united), providing a robust API gateway for Large Language Models (LLMs). This version enhances the original Rust implementation with improved deployment capabilities while maintaining core functionality.

## ✨ Key Features

* 🚀 **Fast & Lightweight**: Powered by Bun runtime and Elysia framework
* 🔄 **OpenAI API Compatible**: Direct replacement for existing OpenAI API clients (Chat Completions & Responses API)
* ⚖️ **Intelligent Load Balancing**: Dynamic routing based on provider latency
* 🌐 **Multi-Provider Integration**: Single unified interface for multiple LLM providers

## 💻 Local Development

1. Install Bun:
```bash
curl -fsSL https://bun.sh/install | bash
```

2. Clone the repository:
```bash
git clone https://github.com/JmPotato/one-united-ts.git
cd one-united-ts
```

3. Install dependencies:
```bash
bun install
```

4. Set up environment variables:
```bash
# Create a .env file
echo "ONE_API_KEY=your_secret_key" > .env
```

5. Start the development server:
```bash
bun run dev
```

The server will start at `http://127.0.0.1:5299` by default.

## 🔧 Configuration

Configure your LLM providers and routing rules using either YAML or JSON format (`config.yaml` or `config.json`). Example configuration:

```yaml
providers:
  - name: OpenAI
    identifier: openai-platform
    endpoint: https://api.openai.com
    path: /v1/chat/completions        # Optional, defaults to /v1/chat/completions
    responses_path: /v1/responses     # Optional, defaults to /v1/responses
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
| `/v1/responses`        | POST   | OpenAI-compatible responses API endpoint   |

### Provider Selection Override

Override default routing using the `model@@provider` syntax:

```json
{
  "model": "openai/gpt-4@@openrouter",  // Use openai/gpt-4 specifically from openrouter
  "messages": [...]
}
```

## 🚀 Production Deployment (systemd)

1. Copy the project to the target directory:
```bash
sudo cp -r /path/to/one-united-ts /opt/one-united-ts
cd /opt/one-united-ts && bun install
```

2. Copy the service file and configure:
```bash
sudo cp one-united-ts.service /etc/systemd/system/
```

3. Set the API key (recommended: use systemd override):
```bash
sudo systemctl edit one-united-ts --force
```
Add the following content:
```ini
[Service]
Environment=ONE_API_KEY=your_actual_api_key
```

4. Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable one-united-ts
sudo systemctl start one-united-ts
```

5. Check status and logs:
```bash
sudo systemctl status one-united-ts
journalctl -u one-united-ts -f
```

**Note**: Adjust `WorkingDirectory` and bun path in `one-united-ts.service` according to your environment. The service uses `DynamicUser=yes` for automatic sandboxing.

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.
