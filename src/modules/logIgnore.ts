import fs from "fs"
import path from "path"


const file = path.join(__dirname, "../data/logIgnore.json");


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
            users: {},
            channels: {}
        };
        save(data);
    };
};


function ensureUser(data: any, guildId: string, userId: string) {
    if(!data[guildId].users[userId]) {
        data[guildId].users[userId] = false;
    };
};

function ensureChannel(data: any, guildId: string, channelId: string) {
    if(!data[guildId].channels[channelId]) {
        data[guildId].channels[channelId] = false;
    };
};


export function ignoreUser(guildId: string, userId: string) {
    const data = load();
    ensureGuild(data, guildId);
    ensureUser(data, guildId, userId);
    data[guildId].users[userId] = true;
    save(data);
};


export function unignoreUser(guildId: string, userId: string) {
    const data = load()
    ensureGuild(data, guildId);
    ensureUser(data, guildId, userId);
    delete data[guildId].users[userId];
    save(data);
};


export function ignoreChannel(guildId: string, channelId: string) {
    const data = load()
    ensureGuild(data, guildId);
    ensureChannel(data, guildId, channelId);
    data[guildId].channels[channelId] = true;
    save(data);
};

export function unignoreChannel(guildId: string, channelId: string) {
    const data = load()
    ensureGuild(data, guildId);
    ensureChannel(data, guildId, channelId);
    delete data[guildId].channels[channelId];
    save(data);
};

export async function getUser(guildId: string, userId: string): Promise<boolean> {
    const data = load();
    ensureGuild(data, guildId);
    ensureUser(data, guildId, userId);
    return data[guildId].users[userId];
};

export async function getChannel(guildId: string, channelId: string): Promise<boolean> {
    const data = load();
    ensureGuild(data, guildId);
    ensureChannel(data, guildId, channelId);
    return data[guildId].channels[channelId];
}

export async function getAllUsers(guildId: string): Promise<{}> {
    const data = load();
    ensureGuild(data, guildId);
    return data[guildId].users;
};

export async function getAllChannels(guildId: string): Promise<{}> {
    const data = load();
    ensureGuild(data, guildId);
    return data[guildId].channels;
}