CREATE TABLE "physical_assets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"description" text,
	"capacity" integer
);
--> statement-breakpoint
CREATE TABLE "asset_bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"asset_id" integer NOT NULL,
	"booked_by" integer NOT NULL,
	"booking_date" text NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"purpose" text,
	"status" text DEFAULT 'confirmed',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "asset_bookings" ADD CONSTRAINT "asset_bookings_asset_id_physical_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."physical_assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_bookings" ADD CONSTRAINT "asset_bookings_booked_by_users_id_fk" FOREIGN KEY ("booked_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
