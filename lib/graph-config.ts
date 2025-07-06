/**
 * Graph Protocol Configuration
 * Contains endpoint URLs and IDs for accessing backtest data via Graph Protocol
 */

export const GRAPH_CONFIG = {
  // Space and Entity IDs from hypergraph-cat-sync
  SPACE_ID: 'ca0fca4e-992a-45ca-9628-f11e76187fc6',
  BACKTEST_RUN_ID: 'de13c264-e638-4f6d-ab5b-33eb3db37e08',
  
  // API Endpoints
  API_BASE: 'https://hypergraph-v2-testnet.up.railway.app',
  GRAPHQL_ENDPOINT: 'https://hypergraph-v2-testnet.up.railway.app/graphql',
  
  // IPFS Configuration
  IPFS_CID: 'bafkreidxhriq3pkmf7oncjb55qcbyvh7yh3e637vc6rgci36rw6usbm4ui',
  IPFS_GATEWAYS: [
    'https://ipfs.io/ipfs/',
    'https://ipfs.hypergraph.xyz/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
    'https://gateway.pinata.cloud/ipfs/',
  ],
  
  // Browser Fallback
  BROWSER_URL: 'https://www.geobrowser.io/space/ca0fca4e-992a-45ca-9628-f11e76187fc6',
} as const;

/**
 * Generate REST API endpoint URLs
 */
export const getRestEndpoints = (entityId: string) => [
  `${GRAPH_CONFIG.API_BASE}/space/${GRAPH_CONFIG.SPACE_ID}/entity/${entityId}`,
  `${GRAPH_CONFIG.API_BASE}/entity/${entityId}`,
  `${GRAPH_CONFIG.API_BASE}/spaces/${GRAPH_CONFIG.SPACE_ID}/entities/${entityId}`,
];

/**
 * Generate IPFS URLs for all gateways
 */
export const getIpfsUrls = () => 
  GRAPH_CONFIG.IPFS_GATEWAYS.map(gateway => `${gateway}${GRAPH_CONFIG.IPFS_CID}`);