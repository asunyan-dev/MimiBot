import { REST, Routes } from "discord.js"
import fs from "fs"
import path from "path"
import "dotenv/config"

const token = process.env.TOKEN!
const clientId = process.env.CLIENT_ID!

const commands: any[] = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".ts"));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file)).default;
    commands.push(command.data.toJSON());
};

const rest = new REST({version: "10"}).setToken(token);

(async () => {
    try {
        console.log("🔃 Refreshing (/) commands...");

        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands }
        );

        console.log("🐈 Meow! (/) commands registered!");
    } catch (err) {
        console.error(err)
    }
})()