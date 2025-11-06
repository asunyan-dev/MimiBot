import fs from "fs"
import path from "path"


const file = path.join(__dirname, "../data/logs.json");

if(!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify({}, null, 2));
};


function load() {
    let data = JSON.parse(fs.readFileSync(file, "utf8"));
    return data;
};


function save(data: any) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
};


function ensureGuild(data: any, guildId: string) {
    if(!data[guildId]) {
        data[guildId] = {
            memberEvents: { enabled: false, channelId: null },
            messageLogs: { enabled: false, channelId: null },
            joinLeave: { enabled: false, channelId: null },
            voiceLogs: { enabled: false, channelId: null }
        };
        save(data);
    };
};


export function enableLog(guildId: string, log: string, channelId: string) {
    const data = load();
    ensureGuild(data, guildId);
    data[guildId][log] = { enabled: true, channelId: channelId };
    save(data);
};

export function editLog(guildId: string, log: string, channelId: string) {
    const data = load();
    ensureGuild(data, guildId);
    data[guildId][log].channelId = channelId;
    save(data);
};

export function disableLog(guildId: string, log: string) {
    const data = load();
    ensureGuild(data, guildId);
    data[guildId][log] = { enabled: false, channelId: null };
    save(data);
};

export async function getLog(guildId: string, log: string): Promise<{ enabled: boolean, channelId: string | null }> {
    const data = load();
    ensureGuild(data, guildId);
    return data[guildId][log];
};

export async function getAll(guildId: string): Promise<{
    memberEvents: { enabled: boolean, channelId: string | null },
    messageLogs: { enabled: boolean, channelId: string | null },
    joinLeave: { enabled: boolean, channelId: string | null },
    voiceLogs: { enabled: boolean, channelId: string | null }
}> {
    const data = load();
    ensureGuild(data, guildId);
    return data[guildId];
}
