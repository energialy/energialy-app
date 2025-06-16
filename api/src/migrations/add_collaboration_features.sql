-- Migration script to add collaboration features to Energialy API
-- Execute these commands in your PostgreSQL database

-- 1. Add new columns to Users table
ALTER TABLE "Users" 
ADD COLUMN IF NOT EXISTS "permissions" TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS "invitedBy" UUID,
ADD COLUMN IF NOT EXISTS "invitationStatus" VARCHAR(255) DEFAULT 'accepted' CHECK ("invitationStatus" IN ('pending', 'accepted', 'rejected')),
ADD COLUMN IF NOT EXISTS "invitationToken" VARCHAR(255);

-- 2. Update the role enum to include new company roles
ALTER TYPE "enum_Users_role" ADD VALUE IF NOT EXISTS 'company_owner';
ALTER TYPE "enum_Users_role" ADD VALUE IF NOT EXISTS 'company_collaborator';

-- 3. Create CompanyInvitations table
CREATE TABLE IF NOT EXISTS "CompanyInvitations" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "invitationToken" VARCHAR(255) NOT NULL UNIQUE,
    "permissions" TEXT[] NOT NULL DEFAULT '{}',
    "status" VARCHAR(255) DEFAULT 'pending' CHECK ("status" IN ('pending', 'accepted', 'rejected', 'expired')),
    "invitedBy" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "position" VARCHAR(255),
    "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 4. Add foreign key constraints for CompanyInvitations
ALTER TABLE "CompanyInvitations" 
ADD CONSTRAINT "fk_companyinvitations_invitedby" 
FOREIGN KEY ("invitedBy") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CompanyInvitations" 
ADD CONSTRAINT "fk_companyinvitations_company" 
FOREIGN KEY ("companyId") REFERENCES "Companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 5. Add foreign key constraint for Users.invitedBy (self-reference)
ALTER TABLE "Users" 
ADD CONSTRAINT "fk_users_invitedby" 
FOREIGN KEY ("invitedBy") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- 6. Add indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_companyinvitations_email" ON "CompanyInvitations"("email");
CREATE INDEX IF NOT EXISTS "idx_companyinvitations_token" ON "CompanyInvitations"("invitationToken");
CREATE INDEX IF NOT EXISTS "idx_companyinvitations_status" ON "CompanyInvitations"("status");
CREATE INDEX IF NOT EXISTS "idx_companyinvitations_company" ON "CompanyInvitations"("companyId");
CREATE INDEX IF NOT EXISTS "idx_users_role" ON "Users"("role");
CREATE INDEX IF NOT EXISTS "idx_users_invitedby" ON "Users"("invitedBy");

-- 7. Update existing company users to be company_owner by default
-- (You may want to customize this based on your specific needs)
UPDATE "Users" 
SET "role" = 'company_owner' 
WHERE "role" = 'admin' 
AND "CompanyId" IS NOT NULL;

-- Optional: Add comments to document the new columns
COMMENT ON COLUMN "Users"."permissions" IS 'Array of permissions for company collaborators';
COMMENT ON COLUMN "Users"."invitedBy" IS 'ID of the user who invited this collaborator';
COMMENT ON COLUMN "Users"."invitationStatus" IS 'Status of the invitation for collaborators';
COMMENT ON COLUMN "Users"."invitationToken" IS 'Token for invitation verification';

COMMENT ON TABLE "CompanyInvitations" IS 'Table to manage company collaborator invitations';
COMMENT ON TABLE "Permissions" IS 'Available permissions that can be assigned to collaborators';

-- Verify the changes
SELECT 'Migration completed successfully' as status;
