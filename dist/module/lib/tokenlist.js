import { fetch } from 'cross-fetch';
import tokenlist from './../tokens/solana.tokenlist.json';
export var ENV;
(function (ENV) {
    ENV[ENV["MainnetBeta"] = 101] = "MainnetBeta";
    ENV[ENV["Testnet"] = 102] = "Testnet";
    ENV[ENV["Devnet"] = 103] = "Devnet";
})(ENV || (ENV = {}));
export const CLUSTER_SLUGS = {
    'mainnet-beta': ENV.MainnetBeta,
    testnet: ENV.Testnet,
    devnet: ENV.Devnet,
};
export class GitHubTokenListResolutionStrategy {
    repositories = [
        'https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json',
    ];
    resolve = () => {
        return queryJsonFiles(this.repositories);
    };
}
export class CDNTokenListResolutionStrategy {
    repositories = [
        'https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/src/tokens/solana.tokenlist.json',
    ];
    resolve = () => {
        return queryJsonFiles(this.repositories);
    };
}
const queryJsonFiles = async (files) => {
    const responses = (await Promise.all(files.map(async (repo) => {
        try {
            const response = await fetch(repo);
            const json = (await response.json());
            return json;
        }
        catch {
            console.info(`@solana/token-registry: falling back to static repository.`);
            return tokenlist;
        }
    })));
    return responses
        .map((tokenlist) => tokenlist.tokens)
        .reduce((acc, arr) => acc.concat(arr), []);
};
export var Strategy;
(function (Strategy) {
    Strategy["GitHub"] = "GitHub";
    Strategy["Static"] = "Static";
    Strategy["Solana"] = "Solana";
    Strategy["CDN"] = "CDN";
})(Strategy || (Strategy = {}));
export class SolanaTokenListResolutionStrategy {
    resolve = () => {
        throw new Error(`Not Implemented Yet.`);
    };
}
export class StaticTokenListResolutionStrategy {
    resolve = () => {
        return tokenlist.tokens;
    };
}
export class TokenListProvider {
    static strategies = {
        [Strategy.GitHub]: new GitHubTokenListResolutionStrategy(),
        [Strategy.Static]: new StaticTokenListResolutionStrategy(),
        [Strategy.Solana]: new SolanaTokenListResolutionStrategy(),
        [Strategy.CDN]: new CDNTokenListResolutionStrategy(),
    };
    resolve = async (strategy = Strategy.CDN) => {
        return new TokenListContainer(await TokenListProvider.strategies[strategy].resolve());
    };
}
export class TokenListContainer {
    tokenList;
    constructor(tokenList) {
        this.tokenList = tokenList;
    }
    filterByTag = (tag) => {
        return new TokenListContainer(this.tokenList.filter((item) => (item.tags || []).includes(tag)));
    };
    filterByChainId = (chainId) => {
        return new TokenListContainer(this.tokenList.filter((item) => item.chainId === chainId));
    };
    excludeByChainId = (chainId) => {
        return new TokenListContainer(this.tokenList.filter((item) => item.chainId !== chainId));
    };
    excludeByTag = (tag) => {
        return new TokenListContainer(this.tokenList.filter((item) => !(item.tags || []).includes(tag)));
    };
    filterByClusterSlug = (slug) => {
        if (slug in CLUSTER_SLUGS) {
            return this.filterByChainId(CLUSTER_SLUGS[slug]);
        }
        throw new Error(`Unknown slug: ${slug}, please use one of ${Object.keys(CLUSTER_SLUGS)}`);
    };
    getList = () => {
        return this.tokenList;
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW5saXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi90b2tlbmxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUVwQyxPQUFPLFNBQVMsTUFBTSxtQ0FBbUMsQ0FBQztBQUUxRCxNQUFNLENBQU4sSUFBWSxHQUlYO0FBSkQsV0FBWSxHQUFHO0lBQ2IsNkNBQWlCLENBQUE7SUFDakIscUNBQWEsQ0FBQTtJQUNiLG1DQUFZLENBQUE7QUFDZCxDQUFDLEVBSlcsR0FBRyxLQUFILEdBQUcsUUFJZDtBQStDRCxNQUFNLENBQUMsTUFBTSxhQUFhLEdBQTBCO0lBQ2xELGNBQWMsRUFBRSxHQUFHLENBQUMsV0FBVztJQUMvQixPQUFPLEVBQUUsR0FBRyxDQUFDLE9BQU87SUFDcEIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNO0NBQ25CLENBQUM7QUFFRixNQUFNLE9BQU8saUNBQWlDO0lBQzVDLFlBQVksR0FBRztRQUNiLGdHQUFnRztLQUNqRyxDQUFDO0lBRUYsT0FBTyxHQUFHLEdBQUcsRUFBRTtRQUNiLE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUMzQyxDQUFDLENBQUM7Q0FDSDtBQUVELE1BQU0sT0FBTyw4QkFBOEI7SUFDekMsWUFBWSxHQUFHO1FBQ2IsMEZBQTBGO0tBQzNGLENBQUM7SUFFRixPQUFPLEdBQUcsR0FBRyxFQUFFO1FBQ2IsT0FBTyxjQUFjLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzNDLENBQUMsQ0FBQztDQUNIO0FBRUQsTUFBTSxjQUFjLEdBQUcsS0FBSyxFQUFFLEtBQWUsRUFBRSxFQUFFO0lBQy9DLE1BQU0sU0FBUyxHQUFnQixDQUFDLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FDL0MsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7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