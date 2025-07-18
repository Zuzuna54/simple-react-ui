import { NextRequest, NextResponse } from 'next/server';
import { getChannelGraphData } from '@/app/lib/database';
import { createLogger } from '@/app/utils/logger';

const logger = createLogger('api/data/graph/[channelId]/route.ts');

// GET /api/data/graph/[channelId] - Get graph data for specific channel
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const { channelId } = await params;
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const startDate = searchParams.get('start');
    const endDate = searchParams.get('end');
    const semanticThreshold = searchParams.get('threshold');
    const limit = searchParams.get('limit');
    
    logger.info('GET /api/data/graph/[channelId] - Fetching graph data', { 
      channelId,
      startDate,
      endDate,
      semanticThreshold,
      limit,
    });
    
    if (!channelId) {
      return NextResponse.json(
        { error: 'channelId is required' },
        { status: 400 }
      );
    }

    // Parse channelId to bigint
    const parsedChannelId = BigInt(channelId);
    
    // Build options object
    const options: {
      timeRange?: { start?: Date; end?: Date };
      semanticThreshold?: number;
      limit?: number;
    } = {};
    
    if (startDate || endDate) {
      options.timeRange = {};
      if (startDate) options.timeRange.start = new Date(startDate);
      if (endDate) options.timeRange.end = new Date(endDate);
    }
    
    if (semanticThreshold) {
      options.semanticThreshold = parseFloat(semanticThreshold);
    }
    
    if (limit) {
      options.limit = parseInt(limit);
    }
    
    // Fetch raw data from database
    const { messages, edges } = await getChannelGraphData(parsedChannelId, options);

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

// POST /api/data/graph/[channelId] - Get graph data with complex options
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const { channelId } = await params;
    const body = await request.json();
    const { options } = body;
    
    logger.info('POST /api/data/graph/[channelId] - Fetching graph data with options', { 
      channelId, 
      options 
    });
    
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