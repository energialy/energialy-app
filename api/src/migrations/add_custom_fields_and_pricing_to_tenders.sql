-- Agregar campos personalizados y funcionalidades de servicios/precios a la tabla Tenders
-- Ejecutar esta migración para soportar campos personalizados, tipos de precio y servicios variables

-- Agregar columna para campos personalizados (JSON)
ALTER TABLE "Tenders" 
ADD COLUMN "customFields" JSONB DEFAULT '[]'::jsonb;

-- Agregar comentario a la columna customFields
COMMENT ON COLUMN "Tenders"."customFields" IS 'Campos personalizados para recopilar información específica de los proveedores';

-- Agregar columna para tipo de precio (fixed o per_unit)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_Tenders_priceType') THEN
        CREATE TYPE "enum_Tenders_priceType" AS ENUM('fixed', 'per_unit');
    END IF;
END $$;

ALTER TABLE "Tenders" 
ADD COLUMN "priceType" "enum_Tenders_priceType" DEFAULT 'fixed';

-- Agregar comentario a la columna priceType
COMMENT ON COLUMN "Tenders"."priceType" IS 'Tipo de precio: fijo o por unidad';

-- Agregar columna para unidad de precio
ALTER TABLE "Tenders" 
ADD COLUMN "priceUnit" VARCHAR(255);

-- Agregar comentario a la columna priceUnit
COMMENT ON COLUMN "Tenders"."priceUnit" IS 'Unidad de precio cuando es per_unit (kilometro, hora, dia, etc.)';

-- Agregar columna para servicios con precios (JSON)
ALTER TABLE "Tenders" 
ADD COLUMN "servicePrices" JSONB DEFAULT '[]'::jsonb;

-- Agregar comentario a la columna servicePrices
COMMENT ON COLUMN "Tenders"."servicePrices" IS 'Array de servicios con precios variables';

-- Agregar índices para mejorar el rendimiento de consultas JSON
CREATE INDEX IF NOT EXISTS "idx_tenders_custom_fields" ON "Tenders" USING GIN ("customFields");
CREATE INDEX IF NOT EXISTS "idx_tenders_service_prices" ON "Tenders" USING GIN ("servicePrices");

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Migración completada: Se agregaron campos personalizados y funcionalidades de servicios/precios a la tabla Tenders';
END $$;
