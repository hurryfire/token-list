"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenListContainer = exports.TokenListProvider = exports.StaticTokenListResolutionStrategy = exports.SolanaTokenListResolutionStrategy = exports.Strategy = exports.CDNTokenListResolutionStrategy = exports.GitHubTokenListResolutionStrategy = exports.CLUSTER_SLUGS = exports.ENV = void 0;
const cross_fetch_1 = require("cross-fetch");
const solana_tokenlist_json_1 = __importDefault(require("./../tokens/solana.tokenlist.json"));
var ENV;
(function (ENV) {
    ENV[ENV["MainnetBeta"] = 101] = "MainnetBeta";
    ENV[ENV["Testnet"] = 102] = "Testnet";
    ENV[ENV["Devnet"] = 103] = "Devnet";
})(ENV = exports.ENV || (exports.ENV = {}));
exports.CLUSTER_SLUGS = {
    'mainnet-beta': ENV.MainnetBeta,
    testnet: ENV.Testnet,
    devnet: ENV.Devnet,
};
class GitHubTokenListResolutionStrategy {
    constructor() {
        this.repositories = [
            'https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json',
        ];
        this.resolve = () => {
            return queryJsonFiles(this.repositories);
        };
    }
}
exports.GitHubTokenListResolutionStrategy = GitHubTokenListResolutionStrategy;
class CDNTokenListResolutionStrategy {
    constructor() {
        this.repositories = [
            'https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/src/tokens/solana.tokenlist.json',
        ];
        this.resolve = () => {
            return queryJsonFiles(this.repositories);
        };
    }
}
exports.CDNTokenListResolutionStrategy = CDNTokenListResolutionStrategy;
const queryJsonFiles = async (files) => {
    const responses = (await Promise.all(files.map(async (repo) => {
        try {
            const response = await cross_fetch_1.fetch(repo);
            const json = (await response.json());
            return json;
        }
        catch (_a) {
            console.info(`@solana/token-registry: falling back to static repository.`);
            return solana_tokenlist_json_1.default;
        }
    })));
    return responses
        .map((tokenlist) => tokenlist.tokens)
        .reduce((acc, arr) => acc.concat(arr), []);
};
var Strategy;
(function (Strategy) {
    Strategy["GitHub"] = "GitHub";
    Strategy["Static"] = "Static";
    Strategy["Solana"] = "Solana";
    Strategy["CDN"] = "CDN";
})(Strategy = exports.Strategy || (exports.Strategy = {}));
class SolanaTokenListResolutionStrategy {
    constructor() {
        this.resolve = () => {
            throw new Error(`Not Implemented Yet.`);
        };
    }
}
exports.SolanaTokenListResolutionStrategy = SolanaTokenListResolutionStrategy;
class StaticTokenListResolutionStrategy {
    constructor() {
        this.resolve = () => {
            return solana_tokenlist_json_1.default.tokens;
        };
    }
}
exports.StaticTokenListResolutionStrategy = StaticTokenListResolutionStrategy;
class TokenListProvider {
    constructor() {
        this.resolve = async (strategy = Strategy.CDN) => {
            return new TokenListContainer(await TokenListProvider.strategies[strategy].resolve());
        };
    }
}
exports.TokenListProvider = TokenListProvider;
TokenListProvider.strategies = {
    [Strategy.GitHub]: new GitHubTokenListResolutionStrategy(),
    [Strategy.Static]: new StaticTokenListResolutionStrategy(),
    [Strategy.Solana]: new SolanaTokenListResolutionStrategy(),
    [Strategy.CDN]: new CDNTokenListResolutionStrategy(),
};
class TokenListContainer {
    constructor(tokenList) {
        this.tokenList = tokenList;
        this.filterByTag = (tag) => {
            return new TokenListContainer(this.tokenList.filter((item) => (item.tags || []).includes(tag)));
        };
        this.filterByChainId = (chainId) => {
            return new TokenListContainer(this.tokenList.filter((item) => item.chainId === chainId));
        };
        this.excludeByChainId = (chainId) => {
            return new TokenListContainer(this.tokenList.filter((item) => item.chainId !== chainId));
        };
        this.excludeByTag = (tag) => {
            return new TokenListContainer(this.tokenList.filter((item) => !(item.tags || []).includes(tag)));
        };
        this.filterByClusterSlug = (slug) => {
            if (slug in exports.CLUSTER_SLUGS) {
                return this.filterByChainId(exports.CLUSTER_SLUGS[slug]);
            }
            throw new Error(`Unknown slug: ${slug}, please use one of ${Object.keys(exports.CLUSTER_SLUGS)}`);
        };
        this.getList = () => {
            return this.tokenList;
        };
    }
}
exports.TokenListContainer = TokenListContainer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW5saXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi90b2tlbmxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNkNBQW9DO0FBRXBDLDhGQUEwRDtBQUUxRCxJQUFZLEdBSVg7QUFKRCxXQUFZLEdBQUc7SUFDYiw2Q0FBaUIsQ0FBQTtJQUNqQixxQ0FBYSxDQUFBO0lBQ2IsbUNBQVksQ0FBQTtBQUNkLENBQUMsRUFKVyxHQUFHLEdBQUgsV0FBRyxLQUFILFdBQUcsUUFJZDtBQStDWSxRQUFBLGFBQWEsR0FBMEI7SUFDbEQsY0FBYyxFQUFFLEdBQUcsQ0FBQyxXQUFXO0lBQy9CLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTztJQUNwQixNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU07Q0FDbkIsQ0FBQztBQUVGLE1BQWEsaUNBQWlDO0lBQTlDO1FBQ0UsaUJBQVksR0FBRztZQUNiLGdHQUFnRztTQUNqRyxDQUFDO1FBRUYsWUFBTyxHQUFHLEdBQUcsRUFBRTtZQUNiLE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUM7SUFDSixDQUFDO0NBQUE7QUFSRCw4RUFRQztBQUVELE1BQWEsOEJBQThCO0lBQTNDO1FBQ0UsaUJBQVksR0FBRztZQUNiLDBGQUEwRjtTQUMzRixDQUFDO1FBRUYsWUFBTyxHQUFHLEdBQUcsRUFBRTtZQUNiLE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUM7SUFDSixDQUFDO0NBQUE7QUFSRCx3RUFRQztBQUVELE1BQU0sY0FBYyxHQUFHLEtBQUssRUFBRSxLQUFlLEVBQUUsRUFBRTtJQUMvQyxNQUFNLFNBQVMsR0FBZ0IsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQy9DLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO1FBQ3ZCLElB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