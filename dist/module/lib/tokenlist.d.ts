export declare enum ENV {
    MainnetBeta = 101,
    Testnet = 102,
    Devnet = 103
}
export interface TokenList {
    readonly name: string;
    readonly logoURI: string;
    readonly tags: {
        [tag: string]: TagDetails;
    };
    readonly timestamp: string;
    readonly tokens: TokenInfo[];
}
export interface TagDetails {
    readonly name: string;
    readonly description: string;
}
export interface TokenExtensions {
    readonly website?: string;
    readonly bridgeContract?: string;
    readonly assetContract?: string;
    readonly address?: string;
    readonly explorer?: string;
    readonly twitter?: string;
    readonly github?: string;
    readonly medium?: string;
    readonly tgann?: string;
    readonly tggroup?: string;
    readonly discord?: string;
    readonly serumV3Usdt?: string;
    readonly serumV3Usdc?: string;
    readonly coingeckoId?: string;
    readonly imageUrl?: string;
    readonly description?: string;
}
export interface TokenInfo {
    readonly chainId: number;
    readonly address: string;
    readonly name: string;
    readonly decimals: number;
    readonly symbol: string;
    readonly logoURI?: string;
    readonly tags?: string[];
    readonly extensions?: TokenExtensions;
}
export declare type TokenInfoMap = Map<string, TokenInfo>;
export declare const CLUSTER_SLUGS: {
    [id: string]: ENV;
};
export declare class GitHubTokenListResolutionStrategy {
    repositories: string[];
    resolve: () => Promise<TokenInfo[]>;
}
export declare class CDNTokenListResolutionStrategy {
    repositories: string[];
    resolve: () => Promise<TokenInfo[]>;
}
export declare enum Strategy {
    GitHub = "GitHub",
    Static = "Static",
    Solana = "Solana",
    CDN = "CDN"
}
export declare class SolanaTokenListResolutionStrategy {
    resolve: () => never;
}
export declare class StaticTokenListResolutionStrategy {
    resolve: () => ({
        chainId: number;
        address: string;
        symbol: string;
        name: string;
        decimals: number;
        logoURI: string;
        tags: never[];
        extensions: {
            website: string;
            serumV3Usdc: string;
            serumV3Usdt: string;
            coingeckoId: string;
            waterfallbot: string;
        };
    } | {
        chainId: number;
        address: string;
        symbol: string;
        name: string;
        decimals: number;
        logoURI: string;
        tags: string[];
        extensions: {
            website: string;
            coingeckoId: string;
            serumV3Usdt: string;
            serumV3Usdc?: undefined;
            waterfallbot?: undefined;
        };
    } | {
        chainId: number;
        address: string;
        symbol: string;
        name: string;
        decimals: number;
        logoURI: string;
        tags: string[];
        extensions: {
            website: string;
            serumV3Usdc?: undefined;
            serumV3Usdt?: undefined;
            coingeckoId?: undefined;
            waterfallbot?: undefined;
        };
    })[];
}
export declare class TokenListProvider {
    static strategies: {
        GitHub: GitHubTokenListResolutionStrategy;
        Static: StaticTokenListResolutionStrategy;
        Solana: SolanaTokenListResolutionStrategy;
        CDN: CDNTokenListResolutionStrategy;
    };
    resolve: (strategy?: Strategy) => Promise<TokenListContainer>;
}
export declare class TokenListContainer {
    private tokenList;
    constructor(tokenList: TokenInfo[]);
    filterByTag: (tag: string) => TokenListContainer;
    filterByChainId: (chainId: number | ENV) => TokenListContainer;
    excludeByChainId: (chainId: number | ENV) => TokenListContainer;
    excludeByTag: (tag: string) => TokenListContainer;
    filterByClusterSlug: (slug: string) => TokenListContainer;
    getList: () => TokenInfo[];
}
