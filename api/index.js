// Bot de Contagem Regressiva - Versão JavaScript/Node.js
const { Telegraf, Markup, session } = require('telegraf');
const cron = require('node-cron');

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
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { expired: false, days, hours, minutes, totalDays: days };
}

function formatCountdown(info) {
  if (info.expired) return 'O grande dia chegou! 🎉';
  
  const parts = [];
  if (info.days > 0) parts.push(info.days + ' dia' + (info.days > 1 ? 's' : ''));
  if (info.hours > 0) parts.push(info.hours + ' hora' + (info.hours > 1 ? 's' : ''));
  if (info.minutes > 0 || parts.length === 0) {
    parts.push(info.minutes + ' minuto' + (info.minutes !== 1 ? 's' : ''));
  }
  return parts.join(', ');
}

function buildQuickReplyMessage() {
  const info = getTimeRemaining();
  const countdown = formatCountdown(info);
  
  return `💕 <b>Contagem do Amor</b>\n\n⏰ <b>${countdown}</b> para o grande momento!\n\n📅 Data: 26/09/2026 às 10:30 (Fortaleza)\n📆 Dias totais: ${info.totalDays} \n\n💍❤️ Mal podemos esperar! ❤️💍`;
}

function buildCountdownMessage(phase) {
  const info = getTimeRemaining();
  const countdown = formatCountdown(info);
  
  const titles = {
    monthly: '📆 Mais um mês se passou!',
    weekly: '📅 Contagem Semanal!',
    daily: '🔥 CONTAGEM REGRESSIVA!'
  };
  
  return '\n' + (titles[phase] || titles.daily) + '\n\n⏰ <b>' + countdown + '</b> para o grande momento!\n\n📅 Data: 26/09/2026 às 10:30 (Fortaleza)\n📊 Dias totais: ' + info.totalDays + '\n\n💍❤️ Mal podemos esperar! ❤️💍';
}

const MONTHLY_MESSAGES = [
  '📆 <b>Mais um mês se passou!</b>\n\n⏰ Para o grande momento restam <b>{days} dias</b>\n\n🎯 Continue a contagem!',
  '🗓️ <b>Um novo mês chegou!</b>\n\n✨ Faltam exatamente <b>{days} dias</b> para o grande evento!\n\n💪 Já imaginou o que vem por aí?',
  '📅 <b>Marcamos mais uma passagem de mês!</b>\n\n⏳ O grande momento está a <b>{days} dias</b> de distância!\n\n🔥 Continue animado!'
];

function buildMonthlyMessage() {
  const info = getTimeRemaining();
  const month = new Date().getMonth() + 1;
  const msg = MONTHLY_MESSAGES[month % MONTHLY_MESSAGES.length].replace('{days}', info.totalDays);
  return msg + '\n\n📅 Data: 26/09/2026 às 10:30 (Fortaleza)\n💍❤️ Mal podemos esperar! ❤️💍';
}

let bot = null;
let lastReminderType = null;
let lastReminderDate = null;

function initBot() {
  if (bot) return bot;
  bot = new Telegraf(CONFIG.TELEGRAM_TOKEN);
  bot.use(session());
  
  bot.start((ctx) => {
    ctx.replyWithHTML('🎀 <b>Bem-vindo ao Bot de Contagem!</b>\n\n💒 Data do casamento: 26/09/2026\n\n💍 Use /diasrestantes para ver quanto tempo falta!\n⏰ Horário de Fortaleza');
  });
  
  bot.command('diasrestantes', async (ctx) => {
    const msg = buildQuickReplyMessage();
    const keyboard = Markup.inlineKeyboard([[Markup.button.callback('🔄 Atualizar', 'refresh')]]);
    await ctx.replyWithHTML(msg, keyboard);
  });
  
  bot.action('refresh', async (ctx) => {
    const msg = buildQuickReplyMessage();
    const keyboard = Markup.inlineKeyboard([[Markup.button.callback('🔄 Atualizar', 'refresh')]]);
    await ctx.editMessageText(msg, { parse_mode: 'HTML', reply_markup: keyboard });
  });
  
  bot.on('text', async (ctx) => {
    const text = ctx.message.text.toLowerCase();
    if (text.includes('quantos dias') || text.includes('faltam')) {
      await ctx.replyWithHTML(buildQuickReplyMessage());
    }
  });
  
  return bot;
}

async function sendReminder(type) {
  if (!bot) return;
  
  const msgs = {
    monthly: buildMonthlyMessage(),
    weekly: buildCountdownMessage('weekly'),
    daily: buildCountdownMessage('daily')
  };
  
  try {
    await bot.telegram.sendMessage(CONFIG.CHAT_ID, msgs[type], { parse_mode: 'HTML' });
    lastReminderType = type;
    lastReminderDate = new Date();
    console.log('✅ Lembrete ' + type + ' enviado!');
  } catch (error) {
    console.error('❌ Erro ao enviar ' + type + ':', error.message);
  }
}

function setupCron() {
  cron.schedule('* * * * *', () => {
    const now = new Date();
    const info = getTimeRemaining();
    const days = info.totalDays;
    
    console.log('[' + now.toISOString() + '] Verificação: ' + days + ' dias restantes');
    
    let shouldSend = false;
    let type = null;
    
    if (days > 60 && now.getDate() === 1 && (!lastReminderDate || lastReminderDate.getMonth() !== now.getMonth())) {
      type = 'monthly'; shouldSend = true;
    } else if (days > 30 && days <= 60 && now.getDate() === 1 && (!lastReminderDate || lastReminderDate.getMonth() !== now.getMonth())) {
      type = 'monthly'; shouldSend = true;
    } else if (days > 7 && days <= 30 && now.getDay() === 1 && (!lastReminderDate || (now - lastReminderDate) > 6 * 24 * 60 * 60 * 1000)) {
      type = 'weekly'; shouldSend = true;
    } else if (days > 0 && days <= 7 && (!lastReminderDate || (now - lastReminderDate) > 23 * 60 * 60 * 1000)) {
      type = 'daily'; shouldSend = true;
    }
    
    if (shouldSend && type) sendReminder(type);
  });
  
  cron.schedule('0 9 * * *', () => {
    console.log('📅 Lembrete das 09:00');
    sendReminder('daily');
  });
}

const vercelHandler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const botInstance = initBot();
      await botInstance.handleUpdate(req.body);
      res.status(200).json({ ok: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(200).json({ ok: false, error: error.message });
    }
  } else {
    const info = getTimeRemaining();
    res.status(200).json({ ok: true, daysRemaining: info.totalDays, countdown: formatCountdown(info), timestamp: new Date().toISOString() });
  }
};

module.exports = { vercelHandler, getTimeRemaining, formatCountdown, buildQuickReplyMessage, buildCountdownMessage, buildMonthlyMessage, initBot };

if (require.main === module) {
  console.log('='.repeat(50));
  console.log('🎀 BOT DE CONTAGEM - MODO LOCAL');
  console.log('='.repeat(50));
  console.log('📅 Casamento: ' + CONFIG.WEDDING_DATE);
  console.log('📍 Chat: ' + CONFIG.CHAT_ID);
  console.log('='.repeat(50));
  
  const botInstance = initBot();
  botInstance.launch();
  console.log('✅ Bot iniciado!');
  console.log('💡 Envie /diasrestantes no Telegram');
  setupCron();
}
