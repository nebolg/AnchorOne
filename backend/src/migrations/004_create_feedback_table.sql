-- Author: -GLOBENXCC-
-- Description: Create feedback table for private user feedback collection

CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    area VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    user_id VARCHAR(255),
    device_info JSONB,
    status VARCHAR(50) DEFAULT 'pending',
    response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback(created_at DESC);

-- Comments
COMMENT ON TABLE feedback IS 'Private user feedback - visible only to developers';
COMMENT ON COLUMN feedback.status IS 'pending, reviewed, implemented, closed';
COMMENT ON COLUMN feedback.response IS 'Developer response to feedback';

-- --- End of 004_create_feedback_table.sql ---
