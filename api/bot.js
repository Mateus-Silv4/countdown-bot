const { Telegraf, Markup, session } = require('telegraf');

const CONFIG = {
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
  CHAT_ID: process.env.CHAT_ID,
  WEDDING_DATE: new Date('2026-09-26T10:30:00-03:00'),
  TIMEZONE: 'America/Fortaleza'
};

function getTimeRemaining() {
  const now = new Date();
  const wedding = new Date(CONFIG.WEDDING_DATE);
  const diff = wedding - now;
  
  if (diff <= 0) {
    return { expired: true, days: 0, hours: 0, minutes: 0, totalDays: 0 };
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return { expired: false, totalDays: days };
}

function buildQuickReplyMessage() {
  const info = getTimeRemaining();
  if (info.expired) return '🎉 O grande dia chegou!';
  return `💕 <b>Contagem do Amor</b>\n\n⏰ Faltam <b>${info.totalDays} dias</b> para o grande momento!\n\n📅 Data: 26/09/2026\n💍❤️ Mal podemos esperar! ❤️💍`;
}

// Lógica de Mensagens Automáticas
function getAutoReminderMessage() {
  const info = getTimeRemaining();
  if (info.expired) return null;

  const now = new Date(
  new Date().toLocaleString("en-US", { timeZone: "America/Fortaleza" })
  );

  const dayOfMonth = now.getDate();
  const dayOfWeek = now.getDay(); // 1 é Segunda-feira
  const days = info.totalDays;

  // 1. Mais de 30 dias: Mensal (Todo dia 01)
  if (days > 30 && dayOfMonth === 26) {
    return `📆 <b>Mais um mês se passou!</b>\n\nFaltam <b>${days} dias</b> para o nosso casamento. O tempo está voando! ✨`;
  }

  // 2. Entre 8 e 30 dias: Semanal (Toda Segunda-feira)
  if (days > 7 && days <= 30 && dayOfWeek === 1 && dayOfMonth !== 26) {
    return `📅 <b>Contagem Semanal!</b>\n\nEstamos na reta final! Apenas <b>${days} dias</b> restantes para o nosso "Sim". 💍`;
  }

  // 3. 1 a 7 dias: Diário
  if (days > 0 && days <= 7) {
    return `🔥 <b>CONTAGEM REGRESSIVA FINAL!</b>\n\nFaltam apenas <b>${days} dias</b>! Coração a mil! ❤️💍`;
  }

  return `💖 <b>Bom dia!</b>\n\nA nossa jornada continua: faltam <b>${days} dias</b> para o grande momento! ⏳💍`;
}

let bot = null;

function initBot() {
  if (bot) return bot;
  bot = new Telegraf(CONFIG.TELEGRAM_TOKEN);
  bot.start((ctx) => ctx.reply('Bot de Casamento Ativado! 💍'));
  
  bot.command('diasrestantes', async (ctx) => {
    const msg = buildQuickReplyMessage();
    const keyboard = Markup.inlineKeyboard([[Markup.button.callback('🔄 Atualizar', 'refresh')]]);
    await ctx.replyWithHTML(msg, keyboard);
  });

  bot.action('refresh', async (ctx) => {
    const msg = buildQuickReplyMessage();
    const keyboard = Markup.inlineKeyboard([[Markup.button.callback('🔄 Atualizar', 'refresh')]]);
    try {
      await ctx.editMessageText(msg, { parse_mode: 'HTML', reply_markup: keyboard });
    } catch (e) {}
  });

  return bot;
}

export default async function handler(req, res) {
  const botInstance = initBot();

  // Se for POST, é interação do usuário no Telegram
  if (req.method === 'POST') {
    await botInstance.handleUpdate(req.body);
    return res.status(200).send('OK');
  }

  // Se for GET, é o Cron da Vercel disparando
  if (req.method === 'GET') {
    const autoMsg = getAutoReminderMessage();
    
    if (autoMsg) {
      try {
        await botInstance.telegram.sendMessage(CONFIG.CHAT_ID, autoMsg, { parse_mode: 'HTML' });
        return res.status(200).json({ status: 'Mensagem enviada', type: 'Automatic' });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }
    
    return res.status(200).json({ status: 'Hoje não há lembretes agendados' });
  }

  res.status(405).send('Método não permitido');
}
