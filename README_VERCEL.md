# 🎀 Bot de Contagem Regressiva -部署 no Vercel

## Hospedagem Gratuita na Vercel

### Passo 1: Preparar o código

1. Fork este repositório no GitHub
2. Acesse https://vercel.com
3. Clique em "Add New..." → "Project"
4. Importe seu repositório

### Passo 2: Configurar Variáveis de Ambiente

1. No painel da Vercel, vá em **Settings** → **Environment Variables**
2. Adicione as seguintes variáveis:

| Variável | Valor |
|----------|-------|
| `TELEGRAM_TOKEN` | Token do seu bot (@BotFather) |
| `CHAT_ID` | ID do grupo (ex: -1003805251186) |

### Passo 3: Configurar o Webhook do Telegram

No terminal, execute:

```bash
# Substitua pelo seu domínio Vercel
curl -F "url=https://seu-projeto.vercel.app/api/index" https://api.telegram.org/bot<SEU_TOKEN>/setWebhook
```

Exemplo:
```bash
curl -F "url=https://countdown-bot.vercel.app/api/index" https://api.telegram.org/bot8597586648:AAE4mFpC5w8_SQfshmmFXXXv34SaRISYohU/setWebhook
```

### Passo 4: Testar

1. Envie `/start` para o bot
2. Envie `/diasrestantes` no grupo

---

## 📋 Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `/start` | Iniciar o bot |
| `/diasrestantes` | Ver dias restantes |
| Qualquer texto com "quantos dias" ou "faltam" | Mostra a contagem |

---

## ⏰ Lembretes Automáticos

O sistema envia lembretes automaticamente:

| Período | Frequência |
|---------|------------|
| +2 meses | Mensal (todo dia 1º) |
| 1-2 meses | Mensal (todo dia 1º) |
| -2 meses | Semanal (segunda-feira) |
| -1 mês | Diário (às 09:00) |

---

## 🛠️ Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Executar localmente
npm run dev
```

---

## 📁 Estrutura de Arquivos

```
├── api/
│   └── index.js          # Bot e API principal
├── package.json          # Dependências
└── vercel.json          # Configuração do Vercel
```

---

## 🔧 Solução de Problemas

### Webhook não funciona?
1. Verifique se o token está correto
2. Confirme se o domínio está acessível (HTTPS)
3. Verifique os logs no painel da Vercel

### Bot não responde?
1. O bot precisa ser adicionado ao grupo
2. Dê permissões de administrador ao bot
3. Configure o webhook corretamente

---

## 💕 Sobre o Bot

Este bot foi criado para a contagem regressiva do casamento de **Mateus e Jamily**!
- Data: 26/09/2026 às 10:30 (Fortaleza)
- Fuso horário: America/Fortaleza (UTC-3)
