-- Migration: Create TenderInvitations table
-- Description: Create table to store tender invitations for registered and non-registered users

CREATE TABLE IF NOT EXISTS "TenderInvitations" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "tenderId" UUID NOT NULL REFERENCES "Tenders"("id") ON DELETE CASCADE,
    "userEmail" VARCHAR(255) NOT NULL,
    "userId" UUID REFERENCES "Users"("id") ON DELETE SET NULL,
    "isRegistered" BOOLEAN DEFAULT false,
    "status" VARCHAR(20) DEFAULT 'invited' CHECK ("status" IN ('invited', 'viewed', 'proposal_sent', 'declined')),
    "invitedBy" UUID NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_tender_invitations_tender_id" ON "TenderInvitations"("tenderId");
CREATE INDEX IF NOT EXISTS "idx_tender_invitations_user_email" ON "TenderInvitations"("userEmail");
CREATE INDEX IF NOT EXISTS "idx_tender_invitations_user_id" ON "TenderInvitations"("userId");
CREATE INDEX IF NOT EXISTS "idx_tender_invitations_status" ON "TenderInvitations"("status");

-- Create unique constraint to prevent duplicate invitations
CREATE UNIQUE INDEX IF NOT EXISTS "idx_unique_tender_user_invitation" 
ON "TenderInvitations"("tenderId", "userEmail");

-- Add comments
COMMENT ON TABLE "TenderInvitations" IS 'Stores invitations sent to users for specific tenders';
COMMENT ON COLUMN "TenderInvitations"."tenderId" IS 'Reference to the tender';
COMMENT ON COLUMN "TenderInvitations"."userEmail" IS 'Email of the invited user';
COMMENT ON COLUMN "TenderInvitations"."userId" IS 'Reference to registered user (null for email invitations)';
COMMENT ON COLUMN "TenderInvitations"."isRegistered" IS 'Whether the invited user is registered in the platform';
COMMENT ON COLUMN "TenderInvitations"."status" IS 'Current status of the invitation';
COMMENT ON COLUMN "TenderInvitations"."invitedBy" IS 'User who sent the invitation';
