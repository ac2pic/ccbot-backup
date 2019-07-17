import * as discord from 'discord.js';
import * as commando from 'discord.js-commando';

/**
 * Returns if a given channel is appropriate for NSFW information.
 */
export function nsfw(channel: discord.Channel): boolean {
    if (channel.type == "text") {
        const c2: discord.TextChannel = channel as discord.TextChannel;
        if (c2.guild.verified)
            return false;
        return c2.nsfw;
    } else if (channel.type == "dm") {
        return true;
    }
    return false;
};

/**
 * Returns if a given guild is considered a liability SFW-wise.
 */
export function nsfwGuild(client: commando.CommandoClient, guild: discord.Guild): boolean {
    if (client.provider.get('global', 'nsfw-' + guild.id, false))
        return true;
    const val = client.provider.get(guild, 'nsfw', false);
    return (val || false) && true;
}

export function channelAsTBF(channel: discord.Channel | undefined): (discord.Channel & discord.TextBasedChannelFields) | undefined {
    if (channel && ((channel as any).sendEmbed))
        return (channel as unknown) as (discord.Channel & discord.TextBasedChannelFields);
    return undefined;
}

/**
 * Use if you think a failed promise really doesn't matter.
 */
export function silence(n: Promise<any>) {
    n.catch(() => {});
}

/**
 * A random array element picker.
 */
export function randomArrayElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Retrieves and converts a role group to role IDs.
 */
export function convertRoleGroup(client: commando.CommandoClient, guild: discord.Guild, text: string): string[] {
    return convertRoles(client, guild, client.provider.get(guild, 'roles-group-' + text, []), true) as string[];
}

/**
 * Converts role names to role IDs.
 */
export function convertRoles(client: commando.CommandoClient, guild: discord.Guild, src: string[], permissive: boolean): string[] | null {
    const roleIDs: string[] = [];
    for (const v of src) {
        const vr = guild.roles.find((r: discord.Role): boolean => {
            return r.name == v;
        });
        if (vr) {
            roleIDs.push(vr.id);
        } else if (!permissive) {
            return null;
        }
    }
    return roleIDs;
}

/**
 * Gets inclusivity/exclusivity group involvement given a target and a role ID list.
 */
export function getInvolvement(client: commando.CommandoClient, guild: discord.Guild, groupType: string, involvedIDs: string[]): string[] {
    const involvement: string[] = [];
    const groups: string[] = client.provider.get(guild, 'roles-' + groupType, []);
    for (const v of groups) {
        const roles: string[] = convertRoleGroup(client, guild, v);
        for (const r of involvedIDs) {
            if (roles.includes(r)) {
                involvement.push(v);
                break;
            }
        }
    }
    return involvement;
}

/**
 * Checks if a user is at the local guild's bot-administrative level.
 */
export function localAdminCheck(t: commando.CommandMessage): boolean {
    if (t.client.owners.includes(t.author))
        return true;
    if (t.member)
        for (const roleID of convertRoleGroup(t.client, t.guild, 'admin'))
            if (t.member.roles.has(roleID))
                return true;
    return false;
}

export const mentionRegex = /^\<\@!?([0-9]*)\>$/g;

export function findCheaterByRef(t: commando.CommandMessage, ref: string): discord.User | null {
    const mention = mentionRegex.exec(ref);
    if (mention)
        return t.client.users.get(mention[1]) || null;

    const byId = t.client.users.get(ref);
    if (byId)
        return byId;

    if (t.guild) {
        const candidates: discord.GuildMember[] = t.guild.members.filterArray((v: discord.GuildMember): boolean => {
            return (v.user.username.includes(ref)) || (ref == (v.user.username + '#' + v.user.discriminator)) || (ref == v.user.id) || (ref == v.nickname);
        });
        if (candidates.length == 1)
            return candidates[0].user;
    } else {
        const candidates: discord.User[] = t.client.users.filterArray((v: discord.User): boolean => {
            return (ref == (v.username + '#' + v.discriminator)) || (ref == v.id);
        });
        if (candidates.length == 1)
            return candidates[0];
    }

    return null;
}
