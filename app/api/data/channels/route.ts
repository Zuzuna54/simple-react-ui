import { NextRequest, NextResponse } from 'next/server';
import { getChannels, testConnection } from '@/app/lib/database';
import { createLogger } from '@/app/utils/logger';

const logger = createLogger('api/data/channels/route.ts');

// GET /api/data/channels - Get all available channels
export async function GET(_request: NextRequest) {
  try {
    logger.info('GET /api/data/channels - Fetching all channels');
    
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