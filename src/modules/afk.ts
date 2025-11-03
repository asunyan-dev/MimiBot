import fs from "fs"
import path from "path"

const file = path.join(__dirname, "../data/afk.json");

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


function ensureUser(data: any, userId: string) {
    if(!data[userId]) {
        data[userId] = null
    }
}

export function getAfk(userId: string) {
    const data = load();
    ensureUser(data, userId);
    return data[userId];
};

export function setAfk(userId: string, message: string) {
    const data = load();
    data[userId] = message;
    save(data);
};

export function removeAfk(userId: string) {
    const data = load();
    delete data[userId];
    save(data);
}