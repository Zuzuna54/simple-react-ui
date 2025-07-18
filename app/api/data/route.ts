import { NextRequest, NextResponse } from 'next/server';
import { 
  getChannels, 
  getChannelGraphData, 
  testConnection 
} from '@/app/lib/database';
import { createLogger } from '@/app/utils/logger';

const logger = createLogger('api/data/route.ts');

// GET /api/data - Get all channels
export async function GET(_request: NextRequest) {
  try {
    logger.info('GET /api/data - Fetching channels');
    
    // Test database connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      logger.error('Database connection failed');
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const channels = await getChannels();
    
    // Convert BigInt to string for JSON serialization
    const serializedChannels = channels.map(channel => ({
      ...channel,
      id: channel.id.toString(),
    }));
    
    const response = { channels: serializedChannels };
    logger.info('Channels fetched successfully', { count: channels.length });
    
    return NextResponse.json(response);
  } catch (error) {
    logger.error('Failed to fetch channels', error);
    return NextResponse.json(
      { error: 'Failed to fetch channels' },
      { status: 500 }
    );
  }
}

// POST /api/data - Get graph data for a specific channel
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { channelId, options } = body;
    
    logger.info('POST /api/data - Fetching graph data', { channelId, options });
    
    if (!channelId) {
      return NextResponse.json(
        { error: 'channelId is required' },
        { status: 400 }
      );
    }

    // Parse channelId to bigint
    const parsedChannelId = BigInt(channelId);
    
    // Fetch raw data from database
    const { messages, edges } = await getChannelGraphData(parsedChannelId, {
      timeRange: options?.timeRange ? {
        start: options.timeRange.start ? new Date(options.timeRange.start) : undefined,
        end: options.timeRange.end ? new Date(options.timeRange.end) : undefined,
      } : undefined,
      semanticThreshold: options?.semanticThreshold,
      limit: options?.limit || 1000,
    });

    // Convert BigInt to string for JSON serialization
    const serializedMessages = messages.map(message => ({
      ...message,
      id: message.id.toString(),
      channel_id: message.channel_id.toString(),
      author_id: message.author_id.toString(),
    }));
    
    const serializedEdges = edges.map(edge => ({
      ...edge,
      channel_id: edge.channel_id.toString(),
      source_message_id: edge.source_message_id.toString(),
      target_message_id: edge.target_message_id.toString(),
    }));

    const response = {
      messages: serializedMessages,
      edges: serializedEdges,
      total_count: messages.length,
    };
    
    logger.info('Graph data fetched successfully', { 
      messageCount: messages.length, 
      edgeCount: edges.length 
    });
    
    return NextResponse.json(response);
  } catch (error) {
    logger.error('Failed to fetch graph data', error);
    return NextResponse.json(
      { error: 'Failed to fetch graph data' },
      { status: 500 }
    );
  }
}