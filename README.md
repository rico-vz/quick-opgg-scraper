# ⚡ Quick OP.GG Scraper

### **A fast OPGG Scraper for League of Legends stats**.

#### Quick OPGG Scraper (`quick-opgg-scraper`) is a OP.GG (League of Legends) stat scraper that doesn't rely on (headless-) browsers and instead uses [Axios](https://github.com/axios/axios) + [Cheerio](https://github.com/cheeriojs/cheerio)

---

## Features

- **Fast and Lightweight**: No need for heavy headless browsers.
- **Easy to Use**: Simple functions for fetching player stats.
- **Flexible**: Supports multiple regions.
- **Caching**: Supports caching using `node-cache`

## Installation

Install Quick OP.GG Scraper (`quick-opgg-scraper`) using npm:

```sh
npm install quick-opgg-scraper
```

Or using yarn:

```sh
yarn add quick-opgg-scraper
```

## Usage

Here's a quick example to get you started:

```js
const { getPlayerData, Region } = require("quick-opgg-scraper");

// Fetches the player data for 'TheShackledOne#004' on EUW
getPlayerData("TheShackledOne#004", Region.EUROPE_WEST)
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error(error);
  });
```

Which returns:

```js
{
  riotId: 'TheShackledOne#004',
  name: 'TheShackledOne',
  tag: '004',
  region: 'euw',
  level: '117',
  ranked: {
    soloQueue: {
      rank: 'challenger',
      lp: '1,618 LP',
      wins: '133',
      losses: '80',
      winrate: '62%',
      ladderRank: '10'
    },
    flexQueue: { rank: null, lp: null, wins: null, losses: null, winrate: null }
  },
  icon: {
    url: 'https://opgg-static.akamaized.net/meta/images/profile_icons/profileIcon1374.jpg',
    id: '1374'
  },
  mostPlayedChampions: [
    'Ashe',    'Jinx',
    'Lucian',  'Kalista',
    'Caitlyn', 'Varus',
    'Draven'
  ]
}
```

**Another example:**
```js
const opggScraper = require('quick-opgg-scraper');

opggScraper.getPlayerData('RAT KING#xpp', opggScraper.Region.EUROPE_WEST).then((data) => {
    console.log(data);
});
```

#### You can also adjust the cache settings:

```js
const { configureCacheSettings } = require("quick-opgg-scraper");

configureCacheSettings({
  enabled: true,
  ttl: 300, // adjust cache TTL to 5 minutes
});
```

## Supported Regions
The following regions are supported:

- North America (`Region.NORTH_AMERICA`)
- Europe West (`Region.EUROPE_WEST`)
- Europe Nordic & East (`Region.EUROPE_NORDICEAST`)
- Korea (`Region.KOREA`)
- Middle East (`Region.MIDDLE_EAST`)
- Oceania (`Region.OCEANIA`)
- Japan (`Region.JAPAN`)
- Brazil (`Region.BRAZIL`)
- Latin America South (`Region.LATIN_AMERICA_SOUTH`)
- Latin America North (`Region.LATIN_AMERICA_NORTH`)
- Russia (`Region.RUSSIA`)
- Türkiye (`Region.TURKIYE`)
- Singapore (`Region.SINGAPORE`)
- Philippines (`Region.PHILIPPINES`)
- Taiwan (`Region.TAIWAN`)
- Vietnam (`Region.VIETNAM`)
- Thailand (`Region.THAILAND`)

## Planned Features
- Top 100 Leaderboard Scraper
- Seperate functions to get specific data (e.g. `getPlayerName`, `getPlayerIconId`)
- Player Recently Played With Scraper
- Player Top Mastery Scraper

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License
This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details.

# Support
If you like this project, consider supporting me

- [Buy me a coffee](https://buymeacoffee.com/ricodev)
- [Sponsor me on GitHub](https://github.com/sponsors/rico-vz)

For any questions or support, contact me [here](https://rico.sh/contact/).

---
⭐ Star us on GitHub — it helps!

[![GitHub stars](https://img.shields.io/github/stars/rico-vz/quick-opgg-scraper?style=social)](https://github.com/rico-vz/quick-opgg-scraper) 

🤍 Consider checking out my website

<a href="https://rico.sh"><img src="https://img.shields.io/badge/%E2%AD%90-rico.sh-white?labelColor=rgb(246, 129, 2)&style=flat" alt="Rico van Zelst" /></a>
