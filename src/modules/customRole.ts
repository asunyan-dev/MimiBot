import fs from "fs";
import path from "path";

const file = path.join(__dirname, "../data/customRole.json");

if (!fs.existsSync(file)) {
  fs.writeFileSync(file, JSON.stringify({}, null, 2));
}

function load() {
  let data = JSON.parse(fs.readFileSync(file, "utf8"));
  return data;
}

function save(data: any) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function ensureGuild(data: any, guildId: string) {
  if (!data[guildId]) {
    data[guildId] = {
      enabled: false,
      referenceRole: null,
      users: {},
    };
    save(data);
  }
}

function ensureUser(data: any, guildId: string, userId: string) {
  if (!data[guildId].users[userId]) {
    data[guildId].users[userId] = null;
    save(data);
  }
}

// Setting up Guild *

export function enableRoles(guildId: string, referenceRoleId: string) {
  const data = load();
  ensureGuild(data, guildId);
  data[guildId].enabled = true;
  data[guildId].referenceRole = referenceRoleId;
  save(data);
}

export function editReference(guildId: string, referenceRoleId: string) {
  const data = load();
  ensureGuild(data, guildId);
  data[guildId].referenceRole = referenceRoleId;
  save(data);
}

export function disableRoles(guildId: string) {
  const data = load();
  ensureGuild(data, guildId);
  data[guildId].enabled = false;
  data[guildId].referenceRole = null;
  data[guildId].users = {};
  save(data);
}

export function getStatus(guildId: string) {
  const data = load();
  ensureGuild(data, guildId);
  return data[guildId].enabled;
}

export async function getRoles(guildId: string): Promise<{}> {
  const data = load();
  ensureGuild(data, guildId);
  return data[guildId].users;
}

export async function getReference(guildId: string): Promise<string> {
  const data = load();
  ensureGuild(data, guildId);
  return data[guildId].referenceRole;
}

// Setting up user *

export function mkRole(guildId: string, userId: string, roleId: string) {
  const data = load();
  ensureGuild(data, guildId);
  ensureUser(data, guildId, userId);

  data[guildId].users[userId] = roleId;
  save(data);
}

export function removeRole(guildId: string, userId: string) {
  const data = load();
  ensureGuild(data, guildId);
  ensureUser(data, guildId, userId);

  data[guildId].users[userId] = null;
  save(data);
}

export function getRole(guildId: string, userId: string) {
  const data = load();
  ensureGuild(data, guildId);
  ensureUser(data, guildId, userId);

  return data[guildId].users[userId];
}
