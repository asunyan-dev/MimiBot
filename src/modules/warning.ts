import fs from "fs"
import path from "path"


const file = path.join(__dirname, "../data/warnings.json");

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
            enabled: false,
            users: {}
        };
        save(data);
    };
};


function ensureUser(data: any, guildId: string, userId: string) {
    if(!data[guildId].users[userId]) {
        data[guildId].users[userId] = [];
        save(data);
    }
};

// guild management.

export function enableWarn(guildId: string) {
    const data = load();
    ensureGuild(data, guildId);
    data[guildId].enabled = true;
    save(data);
};

export async function getWarningStatus(guildId: string): Promise<{enabled: boolean}> {
    const data = load();
    ensureGuild(data, guildId);
    return { enabled: data[guildId].enabled };
};

export function disableWarn(guildId: string) {
    const data = load();
    ensureGuild(data, guildId);
    data[guildId] = {
        enabled: false,
        users: {}
    };
    save(data);
};


// user management


export function addWarn(guildId: string, userId: string, modId: string, reason: string) {
    const data = load();
    ensureGuild(data, guildId);
    ensureUser(data, guildId, userId);
    const length = data[guildId].users[userId].length;
    data[guildId].users[userId].push(
        { id: length + 1, mod: modId, reason: reason }
    );
    save(data);
};


export async function getWarnings(guildId: string, userId: string): Promise<{id: number, mod: string, reason: string}[]> {
    const data = load();
    ensureGuild(data, guildId);
    ensureUser(data, guildId, userId);
    return data[guildId].users[userId];
};


export function clearWarnings(guildId: string, userId: string) {
    const data = load();
    ensureGuild(data, guildId);
    ensureUser(data, guildId, userId);

    data[guildId].users[userId] = [];
    save(data);
}
