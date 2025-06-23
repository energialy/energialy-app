-- Migration to change token columns from VARCHAR(255) to TEXT
-- This fixes the "value too long for type character varying(255)" error

BEGIN;

-- Alter Users table token columns
ALTER TABLE "Users" ALTER COLUMN "refreshToken" TYPE TEXT;
ALTER TABLE "Users" ALTER COLUMN "resetToken" TYPE TEXT;

-- Alter CompanyInvitations table token column
ALTER TABLE "CompanyInvitations" ALTER COLUMN "invitationToken" TYPE TEXT;

COMMIT;
