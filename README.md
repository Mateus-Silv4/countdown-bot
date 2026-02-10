# Contagem Regressiva Telegram

Sistema automatizado de contagem regressiva com lembretes pelo Telegram até 26/09/2026.

## Cronograma de Lembretes

| Período | Frequência | Notificação |
|---------|------------|-------------|
| Mais de 30 dias | Mensal | A cada novo mês |
| 8-30 dias | Semanal | Toda segunda-feira |
| 1-7 dias | Diário | Todos os dias às 10:30 |

## Tecnologias

- **Node.js** (Vercel Serverless Functions)
- **Telegram Bot API** (webhook)
- **Deploy**: Vercel

## Como Funciona

1. O bot responde ao comando `/diasrestantes` no Telegram
2. O webhook recebe atualizações e processa comandos
3. Lembretes são verificados automaticamente a cada requisição

## Comandos do Bot

- `/start` - Inicia o bot
- `/diasrestantes` - Mostra contagem regressiva completa
- Respostas automáticas para perguntas sobre "quantos dias faltam"

## Deploy na Vercel

### Configuração

1. Fork ou clone este repositório
2. Importe no Vercel: https://vercel.com/new
3. Configure as variáveis de ambiente:
   - `TELEGRAM_TOKEN` - Token do seu bot
   - `CHAT_ID` - ID do grupo (começa com -100)

### Configurar Webhook

```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://SEU-PROJETO.vercel.app/api/index"
```

### Verificar Webhook

```bash
curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"
```

## Estrutura do Projeto

```
├── api/
│   └── index.js        # Função principal do bot (Vercel)
├── package.json        # Dependências Node.js
└── vercel.json        # Configuração Vercel
```

## Variáveis de Ambiente

Configure no painel Vercel (Settings → Environment Variables):

| Variável | Valor |
|----------|-------|
| TELEGRAM_TOKEN | Token do bot do Telegram |
| CHAT_ID | ID do grupo (ex: -1003805251186) |

## Teste Local

```bash
npm install
npm run dev
```

## Data Alvo

**26/09/2026 às 10:30** (Fuso: America/Fortaleza)
