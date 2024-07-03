declare module 'quick-opgg-scraper' {
    export enum Region {
        NORTH_AMERICA = 'na',
        MIDDLE_EAST = 'me',
        EUROPE_WEST = 'euw',
        EUROPE_NORDICEAST = 'eune',
        OCEANIA = 'oce',
        KOREA = 'kr',
        JAPAN = 'jp',
        BRAZIL = 'br',
        LATIN_AMERICA_SOUTH = 'las',
        LATIN_AMERICA_NORTH = 'lan',
        RUSSIA = 'ru',
        TURKIYE = 'tr',
        SINGAPORE = 'sg',
        PHILIPPINES = 'ph',
        TAIWAN = 'tw',
        VIETNAM = 'vn',
        THAILAND = 'th'
    }

    export interface RankedData {
        rank: string | null;
        lp: string | null;
        wins: string | null;
        losses: string | null;
        winrate: string | null;
        ladderRank?: string | null;
    }

    export interface PlayerData {
        riotId: string;
        name: string;
        tag: string;
        region: Region;
        level: string;
        ranked: {
            soloQueue: RankedData;
            flexQueue: RankedData;
        };
        icon: {
            url: string;
            id: string;
        };
        mostPlayedChampions: string[];
    }

    export interface CacheSettings {
        enabled: boolean;
        ttl: number;
    }

    export function getPlayerData(riotId: string, region: Region, forceRefresh?: boolean): Promise<PlayerData | { error: string }>;
    export function configureCacheSettings(settings: Partial<CacheSettings>): void;
    export function clearCache(): void;
}