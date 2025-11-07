import fs from "fs"
import path from "path"


const file = path.join(__dirname, "../data/suggestions.json");

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
            channelId: null
        }
    };
};


export function enableSuggestions(guildId: string, channelId: string) {
    const data = load()
    ensureGuild(data, guildId);
    data[guildId] = {
        enabled: true,
        channelId: channelId
    };
    save(data);
};

export function editChannel(guildId: string, channelId: string) {
    const data = load()
    ensureGuild(data, guildId);
    data[guildId].channelId = channelId;
    save(data);
};


export function disableSuggestions(guildId: string) {
    const data = load();
    ensureGuild(data, guildId);
    delete data[guildId];
    save(data);
};

export async function getSuggest(guildId: string): Promise<{
    enabled: boolean,
    channelId: string | null
}> {
    const data = load();
    ensureGuild(data, guildId);
    return data[guildId];
}