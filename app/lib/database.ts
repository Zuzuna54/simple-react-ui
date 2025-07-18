import { Pool, PoolClient } from 'pg';
import type { 
  Channel, 
  ContextualMessage, 
  MessageEdge
} from '../types';
import { createLogger } from '../utils/logger';

const logger = createLogger('database.ts');

// Database configuration
const dbConfig = {
  host: process.env.POSTGRES_HOST || '194.110.175.36',
  port: parseInt(process.env.POSTGRES_PORT || '5000'),
  database: process.env.POSTGRES_DB || 'conversation-intelligence',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'GSrCfnHCLGbg',
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Create connection pool
const pool = new Pool(dbConfig);

// Handle pool errors
pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
});

// Test database connection
export async function testConnection(): Promise<boolean> {
  let client: PoolClient | null = null;
  try {
    logger.info('Testing database connection');
    client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    logger.info('Database connection successful', { time: result.rows[0].now });
    return true;
  } catch (error) {
    logger.error('Database connection failed', error);
    return false;
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Get all available channels
export async function getChannels(): Promise<Channel[]> {
  let client: PoolClient | null = null;
  try {
    logger.info('Fetching channels from database');
    client = await pool.connect();
    
    const query = `
      SELECT id, name, description, platform
      FROM nlp1.channel
      ORDER BY name
    `;
    
    const result = await client.query(query);
    logger.info('Channels fetched successfully', { count: result.rows.length });
    
    return result.rows.map(row => ({
      id: BigInt(row.id),
      name: row.name,
      description: row.description,
      platform: row.platform,
    }));
  } catch (error) {
    logger.error('Failed to fetch channels', error);
    throw new Error('Database query failed');
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Get messages for a specific channel with optional time range
export async function getChannelMessages(
  channelId: bigint, 
  timeRange?: { start?: Date; end?: Date },
  limit: number = 1000
): Promise<ContextualMessage[]> {
  let client: PoolClient | null = null;
  try {
    logger.info('Fetching channel messages', { 
      channelId: channelId.toString(), 
      timeRange, 
      limit 
    });
    
    client = await pool.connect();
    
    let query = `
      SELECT 
        id, 
        channel_id, 
        content, 
        author_name, 
        author_id, 
        written_at,
        embedding
      FROM nlp1.contextual_message
      WHERE channel_id = $1
    `;
    
    const params: (string | number)[] = [channelId.toString()];
    let paramIndex = 2;
    
    if (timeRange?.start) {
      query += ` AND written_at >= $${paramIndex}`;
      params.push(timeRange.start.toISOString());
      paramIndex++;
    }
    
    if (timeRange?.end) {
      query += ` AND written_at <= $${paramIndex}`;
      params.push(timeRange.end.toISOString());
      paramIndex++;
    }
    
    query += ` ORDER BY written_at DESC LIMIT $${paramIndex}`;
    params.push(limit);
    
    const result = await client.query(query, params);
    logger.info('Messages fetched successfully', { count: result.rows.length });
    
    return result.rows.map(row => ({
      id: BigInt(row.id),
      channel_id: BigInt(row.channel_id),
      content: row.content,
      author_name: row.author_name,
      author_id: BigInt(row.author_id),
      written_at: new Date(row.written_at),
      embedding: row.embedding ? JSON.parse(row.embedding) : [],
    }));
  } catch (error) {
    logger.error('Failed to fetch channel messages', error);
    throw new Error('Database query failed');
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Get semantic edges for messages in a channel
export async function getSemanticEdges(
  channelId: bigint, 
  threshold?: number
): Promise<MessageEdge[]> {
  let client: PoolClient | null = null;
  try {
    logger.info('Fetching semantic edges', { 
      channelId: channelId.toString(), 
      threshold 
    });
    
    client = await pool.connect();
    
    let query = `
      SELECT 
        id, 
        channel_id, 
        source_message_id, 
        target_message_id, 
        edge_type, 
        strength
      FROM nlp1.message_edge
      WHERE channel_id = $1
    `;
    
    const params: (string | number)[] = [channelId.toString()];
    
    if (threshold !== undefined) {
      query += ` AND strength >= $2`;
      params.push(threshold);
    }
    
    query += ` ORDER BY strength DESC`;
    
    const result = await client.query(query, params);
    logger.info('Edges fetched successfully', { count: result.rows.length });
    
    return result.rows.map(row => ({
      id: row.id,
      channel_id: BigInt(row.channel_id),
      source_message_id: BigInt(row.source_message_id),
      target_message_id: BigInt(row.target_message_id),
      edge_type: row.edge_type as 'reply_to' | 'semantic_link',
      strength: row.strength,
    }));
  } catch (error) {
    logger.error('Failed to fetch semantic edges', error);
    throw new Error('Database query failed');
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Get graph data for a channel (messages + edges)
export async function getChannelGraphData(
  channelId: bigint,
  options?: {
    timeRange?: { start?: Date; end?: Date };
    semanticThreshold?: number;
    limit?: number;
  }
): Promise<{ messages: ContextualMessage[]; edges: MessageEdge[] }> {
  try {
    logger.info('Fetching complete graph data for channel', { 
      channelId: channelId.toString(), 
      options 
    });
    
    const [messages, edges] = await Promise.all([
      getChannelMessages(channelId, options?.timeRange, options?.limit),
      getSemanticEdges(channelId, options?.semanticThreshold),
    ]);
    
    // Filter edges to only include those connecting fetched messages
    const messageIds = new Set(messages.map(m => m.id.toString()));
    const filteredEdges = edges.filter(edge => 
      messageIds.has(edge.source_message_id.toString()) && 
      messageIds.has(edge.target_message_id.toString())
    );
    
    logger.info('Graph data assembled', { 
      messageCount: messages.length, 
      edgeCount: filteredEdges.length 
    });
    
    return { messages, edges: filteredEdges };
  } catch (error) {
    logger.error('Failed to fetch graph data', error);
    throw error;
  }
}

// Cleanup function to close pool connections
export async function closePool(): Promise<void> {
  try {
    await pool.end();
    logger.info('Database pool closed');
  } catch (error) {
    logger.error('Error closing database pool', error);
  }
} 