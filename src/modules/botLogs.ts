import fs from "fs"
import path from "path"


const file = path.join(__dirname, "../data/changelog.json");

if(!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([], null, 2));
};

function load() {
    let data = JSON.parse(fs.readFileSync(file, "utf8"));
    return data;
};

function save(data: any) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
};


export function addChange(version: string, details: string) {
    const data = load();
    
    data.push(
        { version: version, details: details }
    );

    save(data);
};

export function getChange() {
    const data = load();
    return data;
}