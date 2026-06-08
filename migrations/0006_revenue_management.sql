-- Create Revenue Management Tables

-- Table: startup_revenue_details
-- Purpose: Store startup-specific revenue information (Part A)
CREATE TABLE IF NOT EXISTS "startup_revenue_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"startup_id" integer NOT NULL,
	"gstin" text,
	"current_agreement_period" text,
	"increment_proposed_date" text,
	"without_gst" integer,
	"rent_increase_five_percent" integer,
	"monthly_ic_current" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "startup_revenue_details" ADD CONSTRAINT "startup_revenue_details_startup_id_startups_id_fk" FOREIGN KEY ("startup_id") REFERENCES "public"."startups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint

-- Table: startup_training_fees
-- Purpose: Store training fee entries (Part B)
CREATE TABLE IF NOT EXISTS "startup_training_fees" (
	"id" serial PRIMARY KEY NOT NULL,
	"startup_id" integer NOT NULL,
	"description" text,
	"amount" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "startup_training_fees" ADD CONSTRAINT "startup_training_fees_startup_id_startups_id_fk" FOREIGN KEY ("startup_id") REFERENCES "public"."startups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint

-- Table: startup_consultancy_fees
-- Purpose: Store consultancy fee entries (Part C)
CREATE TABLE IF NOT EXISTS "startup_consultancy_fees" (
	"id" serial PRIMARY KEY NOT NULL,
	"startup_id" integer NOT NULL,
	"description" text,
	"amount" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "startup_consultancy_fees" ADD CONSTRAINT "startup_consultancy_fees_startup_id_startups_id_fk" FOREIGN KEY ("startup_id") REFERENCES "public"."startups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint

-- Table: startup_registration_fees
-- Purpose: Store registration fee entries (Part D)
CREATE TABLE IF NOT EXISTS "startup_registration_fees" (
	"id" serial PRIMARY KEY NOT NULL,
	"startup_id" integer NOT NULL,
	"description" text,
	"amount" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "startup_registration_fees" ADD CONSTRAINT "startup_registration_fees_startup_id_startups_id_fk" FOREIGN KEY ("startup_id") REFERENCES "public"."startups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint

-- Table: startup_monthly_collections
-- Purpose: Store monthly collection records
CREATE TABLE IF NOT EXISTS "startup_monthly_collections" (
	"id" serial PRIMARY KEY NOT NULL,
	"startup_id" integer NOT NULL,
	"financial_year" text NOT NULL,
	"month" text NOT NULL,
	"previous_balance" integer,
	"taxable_amount" integer,
	"cgst" integer,
	"sgst" integer,
	"igst" integer,
	"total_amount_receivable" integer,
	"amount_received" integer,
	"tds_receivable" integer,
	"amount_receipt_date" text,
	"gst_payment_status" text,
	"actual_gst_paid_in_month" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "startup_monthly_collections" ADD CONSTRAINT "startup_monthly_collections_startup_id_startups_id_fk" FOREIGN KEY ("startup_id") REFERENCES "public"."startups"("id") ON DELETE no action ON UPDATE no action;
