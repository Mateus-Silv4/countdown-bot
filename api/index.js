const { Telegraf, Markup, session } = require('telegraf');

const CONFIG = {
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
  WEDDING_DATE: new Date('2026-09-26T10:30:00-03:00'),
};

function getTimeRemaining() {
  const now = new Date();
  const diff = CONFIG.WEDDING_DATE - now;
  
  if (diff <= 0) return { expired: true, totalDays: 0 };
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { expired: false, days, hours, minutes, totalDays: days };
}

function formatCountdown(info) {
  if (info.expired) return 'O grande dia chegou! 🎉';
  
  const parts = [];
  if (info.days > 0) parts.push(`${info.days} dia${info.days > 1 ? 's' : ''}`);
  if (info.hours > 0) parts.push(`${info.hours} hora${info.hours > 1 ? 's' : ''}`);
  if (info.minutes > 0 || parts.length === 0) {
    parts.push(`${info.minutes} minuto${info.minutes !== 1 ? 's' : ''}`);
  }
  return parts.join(', ');
}

function buildMessage() {
  const info = getTimeRemaining();
  const countdown = formatCountdown(info);
  
  // O uso de crases (backticks) garante que os emojis e quebras de linha funcionem 100%
  return `💕 <b>Contagem do Amor</b>

⏰ <b>${countdown}</b> para o grande momento!

📅 Data: 26/09/2026 às 10:30 (Fortaleza)
📆 Dias totais: ${info.totalDays}

💍❤️ Mal podemos esperar! ❤️💍`;
}

let bot = null;

function initBot() {
  if (bot) return bot;
  bot = new Telegraf(CONFIG.TELEGRAM_TOKEN);
  bot.use(session());
  
  // Comando inicial
  bot.start((ctx) => {
    ctx.replyWithHTML('🎀 <b>Bem-vindo ao Bot de Contagem!</b>\n\nUse /diasrestantes para ver quanto tempo falta!');
  });
  
  // Comando principal
  bot.command('diasrestantes', async (ctx) => {
    const keyboard = Markup.inlineKeyboard([[Markup.button.callback('🔄 Atualizar', 'refresh')]]);
    await ctx.replyWithHTML(buildMessage(), keyboard);
  });
  
  // Ação do botão atualizar
  bot.action('refresh', async (ctx) => {
    const keyboard = Markup.inlineKeyboard([[Markup.button.callback('🔄 Atualizar', 'refresh')]]);
    try {
      await ctx.editMessageText(buildMessage(), { 
        parse_mode: 'HTML', 
        reply_markup: keyboard.reply_markup 
      });
    } catch (e) {
      // Ignora erro se a mensagem não mudou (ex: clicar rápido demais)
      await ctx.answerCbQuery('Já está atualizado! ✨');
    }
  });
  
  // Resposta inteligente para texto
  bot.on('text', async (ctx) => {
    const text = ctx.message.text.toLowerCase();
    if (text.includes('quantos dias') || text.includes('faltam')) {
      await ctx.replyWithHTML(buildMessage());
    }
  });
  
  return bot;
}

// Export para Vercel
module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const botInstance = initBot();
      await botInstance.handleUpdate(req.body);
      res.status(200).send('OK');
    } catch (error) {
      console.error('Erro no processamento:', error);
      res.status(200).send('Erro interno, mas recebido.');
    }
  } else {
    res.status(200).send('Bot está online! 🚀');
  }
};