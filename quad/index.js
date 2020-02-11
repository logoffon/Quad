//Set up the configuration files
process.env["NODE_CONFIG_DIR"] = "../config/";

const Eris = require('eris');
const config = require('config');
const i18n = require('i18n');
const log = require('log');
const handler = require('handler');
const modloader = require("./modloader");
const db = require("db");
const prefix = require("prefix");

const t = i18n.t;

(async () => {
    log(t("Welcome to {{BOT_NAME}}!", {"BOT_NAME": config.get("bot.name")}));
    
    await db.init();
    modloader.init();
    
    let bot = new Eris(config.get('discord.token'));
    bot.on("ready", () => {
        log(t("Locked and loaded!"));
    });
    bot.on("messageCreate", async (msg) => {
        if (msg.author.bot) return;
        
        let pf = await prefix(msg.channel.guild);
        if (msg.content.startsWith(pf)) {
            handler.process(pf, msg);
        }
    });
    bot.connect();
    
    handler.setBot(bot);
})();