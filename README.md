# Contagem Regressiva Telegram

Sistema automatizado de contagem regressiva com lembretes pelo Telegram até 26/09/2026.

## 📊 Cronograma de Lembretes

| Período | Frequência | Notificação |
|---------|------------|-------------|
| Mais de 2 meses | Mensal | A cada novo mês |
| 1-2 meses | Mensal | A cada novo mês |
| Menos de 2 meses | Semanal | A cada semana |
| Menos de 1 mês | Diário | Todos os dias |

## 🚀 Instalação e Configuração

### 1. Instalar dependências
```bash
pip install -r requirements.txt
```

### 2. Configurar Telegram

**Criar um bot:**
1. Fale com @BotFather no Telegram
2. Envie `/newbot`
3. Siga as instruções e copie o TOKEN

**Obter Chat ID:**
1. Adicione o bot ao seu grupo
2. Envie uma mensagem para o bot
3. Acesse: `https://api.telegram.org/bot<TOKEN>/getUpdates`
4. Copie o `id` do chat

### 3. Editar configurações

Edite `countdown/config.py`:
```python
TELEGRAM_TOKEN = "SEU_TOKEN_AQUI"
TELEGRAM_CHAT_ID = "SEU_CHAT_ID_AQUI"
```

### 4. Testar o sistema

```bash
# Ver status atual
python countdown/main.py --status

# Enviar notificação de teste
python countdown/main.py --notify
```

## ⚙️ Automação com Cron

### Configurar execução automática
```bash
python setup_cron.py
```

O sistema verificará automaticamente a cada 6 horas e enviará lembretes conforme necessário.

### Comandos úteis
```bash
crontab -l                  # Ver cron configurado
tail -f /tmp/countdown.log  # Ver logs de execução
```

## 📁 Estrutura do Projeto

```
countdown/
├── __init__.py        # Inicialização do módulo
├── config.py          # Configurações (TOKEN, CHAT_ID)
├── countdown.py       # Lógica de contagem regressiva
├── telegram_bot.py    # Integração com Telegram
└── main.py            # Script principal

requirements.txt       # Dependências Python
setup_cron.py         # Configuração do cron
install.py            # Instalador interativo
run_reminder.py       # Script manual de lembretes
```

## 💡 Uso Manual

```bash
# Verificar e enviar lembrete se necessário
python countdown/main.py --check

# Enviar notificação imediata
python countdown/main.py --notify

# Ver apenas status
python countdown/main.py --status

# Executar instalador interativo
python install.py
```

## 📅 Data Alvo

**26/09/2026 às 10:30**
