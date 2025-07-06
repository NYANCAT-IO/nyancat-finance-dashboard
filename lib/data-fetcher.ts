/**
 * Experimental Graph Protocol Data Fetcher
 * Attempts to fetch dashboard data from multiple endpoints with graceful fallback to local data
 */

import { request, gql } from 'graphql-request';
import { GRAPH_CONFIG, getRestEndpoints, getIpfsUrls } from './graph-config';
import backtestDataFallback from '../data/backtest-data.json';

// GraphQL Queries
const GET_BACKTEST_QUERY = gql`
  query GetBacktest($id: String!, $spaceId: String!) {
    entity(id: $id, spaceId: $spaceId) {
      id
      name
      description
      values {
        property
        value
      }
      relations {
        id
        type
        toEntity
      }
    }
  }
`;

const GET_POSITIONS_QUERY = gql`
  query GetPositions($backtestId: String!, $spaceId: String!) {
    relations(
      fromEntity: $backtestId
      spaceId: $spaceId
      type: "has_position"
    ) {
      toEntity {
        id
        name
        values {
          property
          value
        }
      }
    }
  }
`;

const GET_EQUITY_CURVE_QUERY = gql`
  query GetEquityCurve($backtestId: String!, $spaceId: String!) {
    relations(
      fromEntity: $backtestId
      spaceId: $spaceId
      type: "has_equity_point"
    ) {
      toEntity {
        id
        values {
          property
          value
        }
      }
    }
  }
`;

/**
 * GraphQL Data Client with multiple fallback methods
 */
class GraphDataClient {
  private readonly timeout = 10000; // 10 second timeout

  /**
   * Attempt to fetch data via GraphQL endpoint
   */
  async fetchViaGraphQL(): Promise<any> {
    console.log('🔍 Attempting GraphQL endpoint:', GRAPH_CONFIG.GRAPHQL_ENDPOINT);
    
    try {
      const backtestData = await Promise.race([
        request(GRAPH_CONFIG.GRAPHQL_ENDPOINT, GET_BACKTEST_QUERY, {
          id: GRAPH_CONFIG.BACKTEST_RUN_ID,
          spaceId: GRAPH_CONFIG.SPACE_ID,
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('GraphQL timeout')), this.timeout)
        )
      ]);

      console.log('✅ GraphQL endpoint successful');
      return backtestData;
    } catch (error) {
      console.log('❌ GraphQL endpoint failed:', error instanceof Error ? error.message : error);
      throw error;
    }
  }

  /**
   * Attempt to fetch data via REST API endpoints
   */
  async fetchViaREST(): Promise<any> {
    const endpoints = getRestEndpoints(GRAPH_CONFIG.BACKTEST_RUN_ID);
    
    for (const endpoint of endpoints) {
      try {
        console.log('🔍 Attempting REST endpoint:', endpoint);
        
        const response = await Promise.race([
          fetch(endpoint),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('REST timeout')), this.timeout)
          )
        ]);

        if (response.ok) {
          const data = await response.json();
          console.log('✅ REST endpoint successful:', endpoint);
          return data;
        } else {
          console.log(`❌ REST endpoint failed with status ${response.status}:`, endpoint);
        }
      } catch (error) {
        console.log('❌ REST endpoint failed:', endpoint, error instanceof Error ? error.message : error);
      }
    }

    throw new Error('All REST endpoints failed');
  }

  /**
   * Attempt to fetch data via IPFS gateways
   */
  async fetchViaIPFS(): Promise<any> {
    const ipfsUrls = getIpfsUrls();
    
    for (const url of ipfsUrls) {
      try {
        console.log('🔍 Attempting IPFS gateway:', url);
        
        const response = await Promise.race([
          fetch(url),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('IPFS timeout')), this.timeout)
          )
        ]);

        if (response.ok) {
          // Try to parse as JSON first, fallback to binary data
          const contentType = response.headers.get('content-type');
          let data;
          
          if (contentType?.includes('application/json')) {
            data = await response.json();
          } else {
            // Handle binary data - convert to text and try parsing
            const arrayBuffer = await response.arrayBuffer();
            const text = new TextDecoder().decode(arrayBuffer);
            data = JSON.parse(text);
          }
          
          console.log('✅ IPFS gateway successful:', url);
          return data;
        } else {
          console.log(`❌ IPFS gateway failed with status ${response.status}:`, url);
        }
      } catch (error) {
        console.log('❌ IPFS gateway failed:', url, error instanceof Error ? error.message : error);
      }
    }

    throw new Error('All IPFS gateways failed');
  }

  /**
   * Transform Graph Protocol entity data to dashboard format
   */
  private transformGraphData(graphData: any): any {
    // This would need to be implemented based on the actual Graph Protocol data structure
    // For now, return the data as-is since we expect it to fail and fall back
    console.log('📊 Transforming Graph Protocol data to dashboard format...');
    return graphData;
  }

  /**
   * Main data fetching method with cascading fallbacks
   */
  async fetchBacktestData(): Promise<any> {
    console.log('🚀 Starting experimental Graph Protocol data fetch...');
    
    // Try GraphQL first
    try {
      const graphqlData = await this.fetchViaGraphQL();
      return this.transformGraphData(graphqlData);
    } catch (error) {
      console.warn('GraphQL method failed, trying REST...');
    }

    // Try REST endpoints
    try {
      const restData = await this.fetchViaREST();
      return this.transformGraphData(restData);
    } catch (error) {
      console.warn('REST method failed, trying IPFS...');
    }

    // Try IPFS gateways
    try {
      const ipfsData = await this.fetchViaIPFS();
      return this.transformGraphData(ipfsData);
    } catch (error) {
      console.warn('IPFS method failed, falling back to local cached data...');
    }

    // Final fallback to local data
    console.log('✅ Falling back to local cached data');
    console.log('📄 You can view the data in the browser at:', GRAPH_CONFIG.BROWSER_URL);
    return backtestDataFallback;
  }
}

/**
 * Main export: Fetch backtest data with automatic fallback
 */
export async function fetchBacktestData(): Promise<any> {
  const client = new GraphDataClient();
  return client.fetchBacktestData();
}

/**
 * Export configuration for external reference
 */
export { GRAPH_CONFIG };