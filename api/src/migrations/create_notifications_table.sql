-- Migration script to create notifications table
-- Run this script in your PostgreSQL database

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'CHAT_MESSAGE',
        'NEW_ACCOUNT',
        'TENDER_PUBLISHED',
        'PROPOSAL_RECEIVED',
        'PROPOSAL_ACCEPTED',
        'CONTRACT_AWARDED',
        'TENDER_COMPLETED',
        'TENDER_CANCELLED',
        'BANK_ACCOUNT_APPROVED',
        'BANK_ACCOUNT_REJECTED',
        'FINANCE_PRODUCT_REQUESTED',
        'FINANCE_PRODUCT_APPROVED',
        'FINANCE_PRODUCT_REJECTED',
        'GENERAL'
    )),
    "isRead" BOOLEAN DEFAULT FALSE,
    "relatedId" UUID,
    "relatedType" VARCHAR(50),
    priority VARCHAR(20) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    "emailSent" BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY ("userId") REFERENCES "Users"(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications("userId");
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications("isRead");
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications("createdAt");
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications("userId", "isRead");

-- Add trigger to update updatedAt automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notifications_updated_at 
    BEFORE UPDATE ON notifications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE notifications IS 'Stores all user notifications and in-app alerts';
COMMENT ON COLUMN notifications."relatedId" IS 'ID of related entity (tender, proposal, etc.)';
COMMENT ON COLUMN notifications."relatedType" IS 'Type of related entity (tender, proposal, message, etc.)';
COMMENT ON COLUMN notifications.metadata IS 'Additional data for the notification in JSON format';
