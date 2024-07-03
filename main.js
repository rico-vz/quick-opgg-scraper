/**
 * @file Quick OP.GG Scraper for League of Legends | main.js
 * @author Rico van Zelst <hey@rico.sh>
 * @license MIT
 */

const NodeCache = require("node-cache");
const axios = require("axios");
const cheerio = require("cheerio");

let cacheSettings = {
    enabled: true,
    stdTTL: 600,
}

let cache = new NodeCache({ stdTTL: cacheSettings.ttl });

/**
 * Configure cache settings
 * @param {Object} settings - Cache configuration settings
 * @param {boolean} settings.enabled - Enable or disable caching
 * @param {number} settings.ttl - Time to live for cache entries in seconds
 * @returns {void}
 * 
 * @example
 * configureCacheSettings({
 *   enabled: true,
 *   ttl: 300 // adjust cache TTL to 5 minutes
 * });
 */
function configureCacheSettings(settings) {
    cacheSettings = { ...cacheSettings, ...settings };
    if (cacheSettings.enabled) {
        cache = new NodeCache({ stdTTL: cacheSettings.ttl });
    } else {
        cache.flushAll(); // Clear existing cache if disabling
    }
    console.log(`[quick-opgg-scraper] Cache settings updated: ${JSON.stringify(cacheSettings)}`);
}

/**
 * Clear all cached data
 * @returns {void}
 */
function clearCache() {
    cache.flushAll();
    console.log('[quick-opgg-scraper] Cache cleared');
}

/**
 * Regions enum for server locations
 * @readonly
 * @enum {string}
 */
const Region = {
    NORTH_AMERICA: 'na',
    MIDDLE_EAST: 'me',
    EUROPE_WEST: 'euw',
    EUROPE_NORDICEAST: 'eune',
    OCEANIA: 'oce',
    KOREA: 'kr',
    JAPAN: 'jp',
    BRAZIL: 'br',
    LATIN_AMERICA_SOUTH: 'las',
    LATIN_AMERICA_NORTH: 'lan',
    RUSSIA: 'ru',
    TURKIYE: 'tr',
    SINGAPORE: 'sg',
    PHILIPPINES: 'ph',
    TAIWAN: 'tw',
    VIETNAM: 'vn',
    THAILAND: 'th',
};

/**
 * Get player data from OP.GG
 * @param {string} riotId - The Riot ID of the summoner
 * @param {Region} region - The region of the player
 * @param {boolean} [forceRefresh=false] - Force a refresh of the cache
 * @returns {Promise<Object>} The player data object
 * @throws If the Riot ID is not formatted correctly, the region is invalid, or an error occurred while fetching data
 * 
 * @example
 * // Logs the player data for TheShackledOne#004 on EUW (Hans Sama)
 * getPlayerData('TheShackledOne#004', Region.EUROPE_WEST)
 *  .then((data) => {
 *   console.log(data);
 * })
 * .catch((error) => {
 *  console.error(error);
 * });
 */
async function getPlayerData(riotId, region, forceRefresh = false) {
    // Input Validation
    if (!riotId.includes('#')) {
        console.error('[quick-opgg-scraper] Riot ID is not formatted correctly. Please include the # symbol between the name and tag.');
        return { error: 'Riot ID is not formatted correctly. Please include the # symbol between the name and tag.' };
    }

    if (!Object.values(Region).includes(region)) {
        console.error(`[quick-opgg-scraper] Invalid region: ${region}`);
        return { error: `Invalid region: ${region}. Please use a valid Region enum value.` };
    }

    const cacheKey = `${riotId}-${region}`;

    // Check if cache is on or if force refresh is disabled
    if (cacheSettings.enabled && !forceRefresh) {
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            console.log(`[quick-opgg-scraper] Returning cached data for ${riotId} in ${region}`);
            return cachedData;
        }
    }

    try {
        const [riotName, riotTag] = riotId.split('#').map(encodeURIComponent);

        const url = `https://www.op.gg/summoners/${region}/${riotName}-${riotTag}`;

        console.log(`[quick-opgg-scraper] Fetching: ${url}`);

        const response = await axios.get(url);
        if (response.status !== 200) {
            console.error(`[quick-opgg-scraper] Failed to fetch data: OPGG returned HTTP status ${response.status}`);
            return { error: `Failed to fetch data: OPGG returned HTTP status ${response.status}` };
        }

        const $ = cheerio.load(response.data);

        if ($('.header__title').text() === 'This summoner is not registered at OP.GG. Please check spelling.') {
            console.error(`[quick-opgg-scraper] ${riotId} on server ${region} was not found on OP.GG:`);
            return {
                error: 'Player not found',
            };
        }

        const rankedData = {
            soloQueue: {
                rank: $('.content .info .tier').first()?.text() || null,
                lp: $('.content .info .lp').first()?.text() || null,
                wins: $('.content .win-lose-container .win-lose').first()?.text().split('W')[0]?.trim() || null,
                losses: $('.content .win-lose-container .win-lose').first()?.text().match(/\d+(?=L)/)?.[0]?.trim() || null,
                winrate: (parseInt($('.content .win-lose-container .ratio').first()?.text().match(/\d+/)?.[0]) || null) !== null ? (parseInt($('.content .win-lose-container .ratio').first()?.text().match(/\d+/)?.[0]) || null) + '%' : null,
                ladderRank: $('.header-profile-info .info > .team-and-rank .rank a .ranking').text()?.match(/\d+/g)?.join('') || null,
            },
            flexQueue: {
                rank: $('.content .info .tier').eq(1)?.text() || null,
                lp: $('.content .info .lp').eq(1)?.text() || null,
                wins: $('.content .win-lose-container .win-lose').eq(1)?.text().split('W')[0]?.trim() || null,
                losses: $('.content .win-lose-container .win-lose').eq(1)?.text().match(/\d+(?=L)/)?.[0]?.trim() || null,
                winrate: (parseInt($('.content .win-lose-container .ratio').eq(1)?.text().match(/\d+/)?.[0]) || null) !== null ? (parseInt($('.content .win-lose-container .ratio').eq(1)?.text().match(/\d+/)?.[0]) || null) + '%' : null,
            },
        };

        const iconData = {
            url: $('.profile-icon img').attr('src').split('?')[0],
            id: $('.profile-icon img').attr('src').match(/\d+/)[0],
        };

        const mostPlayedChampions = [];

        $('.champion-box .info .name').each((index, element) => {
            mostPlayedChampions.push($(element).text());
        });

        const playerData = {
            riotId: riotId,
            name: decodeURIComponent(riotName),
            tag: decodeURIComponent(riotTag),
            region: region,
            level: $('span.level:nth-child(1)').text(),
            ranked: rankedData,
            icon: iconData,
            mostPlayedChampions: mostPlayedChampions,
        };

        cache.set(cacheKey, playerData);

        return playerData;
    } catch (error) {
        console.error(`[quick-opgg-scraper] An error occurred while fetching player data: ${error.message}`);
        return { error: `An error occurred while fetching player data: ${error.message}` };
    }
}

module.exports = {
    configureCacheSettings,
    clearCache,
    Region,
    getPlayerData
};