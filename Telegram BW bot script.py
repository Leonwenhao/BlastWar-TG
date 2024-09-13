import os
from telegram import Update, WebAppInfo
from telegram.ext import Application, CommandHandler, ContextTypes

BOT_TOKEN = '7121294780:AAH-Hb0Y1cMndQO_3IiZ0FIBCdbb1D4vbPI'
WEBAPP_URL = 'https://leonwenhao.github.io/BlastWar-TG/'

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "Welcome to BlastWar! Click the button below to start playing.",
        reply_markup={
            "keyboard": [[{"text": "Play BlastWar", "web_app": {"url": WEBAPP_URL}}]],
            "resize_keyboard": True
        }
    )

def main():
    application = Application.builder().token(BOT_TOKEN).build()
    application.add_handler(CommandHandler("start", start))
    application.run_polling()

if __name__ == '__main__':
    main()