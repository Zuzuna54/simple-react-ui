# NLP1 Schema Documentation

## Database Connection Details

- **Host**: 194.110.175.36
- **Port**: 5000
- **Database**: conversation-intelligence
- **Username**: postgres
- **Password**: GSrCfnHCLGbg
- **PostgreSQL Version**: 17.5 (Ubuntu 17.5-1.pgdg22.04+1)

## Schema Overview

The `nlp1` schema is designed for Natural Language Processing and conversation intelligence. It uses PostgreSQL's table inheritance feature and the pgvector extension for storing and searching vector embeddings.

## Tables Structure

### 1. channel
Stores information about communication channels/platforms.

| Column      | Type   | Constraints | Description |
|-------------|--------|-------------|-------------|
| id          | bigint | PRIMARY KEY | Unique channel identifier |
| name        | text   |             | Channel name |
| description | text   |             | Channel description |
| platform    | text   | NOT NULL    | Platform identifier (e.g., slack, discord, etc.) |

**Indexes:**
- `channel_pkey`: PRIMARY KEY on (id)

**Referenced by:**
- `nlp1.message` → channel_id
- `nlp1.message_edge` → channel_id

---

### 2. message (Parent Table)
Base table for all message types. Uses PostgreSQL table inheritance.

| Column      | Type                        | Constraints                    | Description |
|-------------|-----------------------------|--------------------------------|-------------|
| id          | bigint                      | PRIMARY KEY (with channel_id)  | Message identifier |
| channel_id  | bigint                      | NOT NULL, FK → channel(id)     | Associated channel |
| content     | text                        | NOT NULL                       | Message content |
| author_name | text                        |                                | Author's display name |
| author_id   | bigint                      | NOT NULL                       | Author identifier |
| written_at  | timestamp without time zone | NOT NULL                       | Message timestamp |

**Indexes:**
- `message_pkey`: PRIMARY KEY on (id, channel_id)

**Foreign Keys:**
- `message_channel_id_fkey`: channel_id → nlp1.channel(id) ON DELETE CASCADE

**Child Tables:**
- `nlp1.contextual_message`
- `nlp1.noise_message`

---

### 3. contextual_message (Inherits from message)
Messages with semantic embeddings for NLP analysis.

| Column      | Type                        | Constraints                    | Description |
|-------------|-----------------------------|--------------------------------|-------------|
| id          | bigint                      | PRIMARY KEY (with channel_id)  | Message identifier |
| channel_id  | bigint                      | NOT NULL                       | Associated channel |
| content     | text                        | NOT NULL                       | Message content |
| author_name | text                        |                                | Author's display name |
| author_id   | bigint                      | NOT NULL                       | Author identifier |
| written_at  | timestamp without time zone | NOT NULL                       | Message timestamp |
| embedding   | vector(768)                 | NOT NULL                       | 768-dimensional embedding vector |

**Indexes:**
- `contextual_message_pkey`: PRIMARY KEY on (id, channel_id)
- `message_embedding_idx`: HNSW index on embedding using vector_cosine_ops
  - Parameters: m='16', ef_construction='64'

**Referenced by:**
- `nlp1.message_edge` → source_message_id
- `nlp1.message_edge` → target_message_id

---

### 4. noise_message (Inherits from message)
Messages classified as noise/irrelevant.

| Column       | Type                        | Constraints                    | Description |
|--------------|-----------------------------|--------------------------------|-------------|
| id           | bigint                      | PRIMARY KEY (with channel_id)  | Message identifier |
| channel_id   | bigint                      | NOT NULL                       | Associated channel |
| content      | text                        | NOT NULL                       | Message content |
| author_name  | text                        |                                | Author's display name |
| author_id    | bigint                      | NOT NULL                       | Author identifier |
| written_at   | timestamp without time zone | NOT NULL                       | Message timestamp |
| noise_reason | text                        | NOT NULL                       | Reason for noise classification |

**Indexes:**
- `noise_message_pkey`: PRIMARY KEY on (id, channel_id)

---

### 5. message_edge
Defines relationships between messages (replies, semantic links).

| Column            | Type             | Constraints                                      | Description |
|-------------------|------------------|--------------------------------------------------|-------------|
| id                | uuid             | PRIMARY KEY, DEFAULT gen_random_uuid()           | Edge identifier |
| channel_id        | bigint           | NOT NULL, FK → channel(id)                       | Associated channel |
| source_message_id | bigint           | NOT NULL, FK → contextual_message                | Source message |
| target_message_id | bigint           | NOT NULL, FK → contextual_message                | Target message |
| edge_type         | text             | NOT NULL, CHECK ('reply_to', 'semantic_link')   | Type of relationship |
| strength          | double precision | NOT NULL, CHECK (0.0 ≤ strength ≤ 1.0)          | Relationship strength |

**Indexes:**
- `message_edge_pkey`: PRIMARY KEY on (id)

**Check Constraints:**
- `message_edge_edge_type_check`: edge_type IN ('reply_to', 'semantic_link')
- `message_edge_strength_check`: strength BETWEEN 0.0 AND 1.0

**Foreign Keys:**
- `message_edge_channel_id_fkey`: channel_id → nlp1.channel(id) ON DELETE CASCADE
- `message_edge_source_message_id_channel_id_fkey`: (source_message_id, channel_id) → nlp1.contextual_message(id, channel_id) ON DELETE CASCADE
- `message_edge_target_message_id_channel_id_fkey`: (target_message_id, channel_id) → nlp1.contextual_message(id, channel_id) ON DELETE CASCADE

---

## Key Features

### 1. Table Inheritance
- PostgreSQL inheritance allows `contextual_message` and `noise_message` to inherit all columns from `message`
- Queries on `message` table will include rows from child tables
- Each child table can have additional columns specific to its purpose

### 2. Vector Embeddings
- Uses pgvector extension for storing 768-dimensional embeddings
- HNSW (Hierarchical Navigable Small World) index for fast approximate nearest neighbor searches
- Suitable for semantic similarity searches and clustering

### 3. Message Classification
- Messages are classified into:
  - **Contextual**: Messages with semantic meaning and embeddings
  - **Noise**: Messages filtered out with a specific reason

### 4. Relationship Mapping
- `message_edge` table creates a graph structure between messages
- Supports reply chains and semantic relationships
- Strength attribute allows weighted relationships

## Example Queries

### Find similar messages using vector similarity
```sql
SELECT id, content, 1 - (embedding <=> query_embedding) as similarity
FROM nlp1.contextual_message
WHERE channel_id = ?
ORDER BY embedding <=> query_embedding
LIMIT 10;
```

### Get conversation threads
```sql
SELECT 
  s.content as source_content,
  t.content as target_content,
  e.edge_type,
  e.strength
FROM nlp1.message_edge e
JOIN nlp1.contextual_message s ON (e.source_message_id = s.id AND e.channel_id = s.channel_id)
JOIN nlp1.contextual_message t ON (e.target_message_id = t.id AND e.channel_id = t.channel_id)
WHERE e.edge_type = 'reply_to'
ORDER BY s.written_at;
```

### View all messages (including noise)
```sql
SELECT * FROM nlp1.message
WHERE channel_id = ?
ORDER BY written_at;
```

## Notes

- The 768-dimensional vectors likely come from transformer-based models (e.g., BERT, RoBERTa)
- The system is designed for real-time conversation analysis and intelligence
- TimescaleDB extensions are available for time-series analysis
- ON DELETE CASCADE ensures referential integrity when channels are deleted

## Data Storage Process Analysis

Based on the message processing function, here's how data flows into the NLP1 schema:

### Input Payload Structure

The system receives a `ProcessedMessagesEvent` with the following structure:

```typescript
{
  groupId: number,              // Maps to channel_id in database
  messages: Array<{
    id: number,                 // Message identifier
    timestamp: number,          // Unix timestamp (seconds)
    fromUserId: number,         // Maps to author_id
    fromUserName: string | null,// Maps to author_name
    content: string,           // Message text content
    replyToMessageId: number | null,  // For reply chains
    type: 'noise' | 'contextual',     // Message classification
    
    // For contextual messages only:
    embedding?: number[],       // 768-dimensional vector
    
    // For noise messages only:
    noiseReason?: string        // Reason for noise classification
  }>
}
```

### Data Mapping

| Payload Field | Database Column | Table | Transformation |
|---------------|-----------------|-------|----------------|
| `groupId` | `channel_id` | All tables | Direct mapping |
| `message.id` | `id` | message tables | Direct mapping |
| `message.timestamp` | `written_at` | message tables | Unix timestamp → PostgreSQL timestamp (`new Date(timestamp * 1000)`) |
| `message.fromUserId` | `author_id` | message tables | Direct mapping |
| `message.fromUserName` | `author_name` | message tables | Direct mapping (nullable) |
| `message.content` | `content` | message tables | Direct mapping |
| `message.embedding` | `embedding` | contextual_message | Array → vector via `JSON.stringify()` |
| `message.noiseReason` | `noise_reason` | noise_message | Direct mapping |

### Processing Logic

1. **Message Sorting**: Messages are sorted by timestamp in descending order before processing

2. **Transaction Processing**: All operations occur within a single PostgreSQL transaction

3. **Contextual Message Processing**:
   - Insert into `nlp1.contextual_message` with embedding
   - **Reply Edge Creation**: If `replyToMessageId` exists:
     - Verify target message exists
     - Create edge with `edge_type = 'reply_to'` and `strength = 1.0`
   - **Semantic Link Creation**: If no reply relationship:
     - Find most similar message using vector cosine distance
     - Threshold: distance < 0.5
     - Create edge with `edge_type = 'semantic_link'`
     - Edge strength = 1 - distance

4. **Noise Message Processing**:
   - Insert into `nlp1.noise_message` with noise reason
   - No edges created for noise messages

### Key Implementation Details

1. **Vector Similarity Search**:
   ```sql
   SELECT id, embedding <=> $2::vector AS distance
   FROM nlp1.contextual_message
   WHERE channel_id = $1
   AND distance < 0.5
   ORDER BY distance
   LIMIT 1
   ```
   - Uses pgvector's cosine distance operator (`<=>`)
   - Only links messages with distance < 0.5 (similarity > 0.5)

2. **Edge Constraints**:
   - Reply edges: Always have strength = 1.0
   - Semantic links: Strength = 1 - cosine_distance
   - Only contextual messages can have edges (not noise messages)
   - Source and target must exist in `contextual_message` table

3. **Data Integrity**:
   - Checks existence of reply target before creating edge
   - Logs warning for invalid reply references
   - All operations wrapped in transaction for atomicity

### Missing Channel Data

Note: The function doesn't create channel entries. The `channel` table must be pre-populated as `channel_id` (groupId) is used as a foreign key. 