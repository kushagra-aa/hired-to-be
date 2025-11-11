PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_recruiters` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`org_id` integer NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`linkedin` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`org_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_recruiters`("id", "user_id", "org_id", "name", "email", "phone", "linkedin", "is_active", "created_at", "updated_at") SELECT "id", "user_id", "org_id", "name", "email", "phone", "linkedin", "is_active", "created_at", "updated_at" FROM `recruiters`;--> statement-breakpoint
DROP TABLE `recruiters`;--> statement-breakpoint
ALTER TABLE `__new_recruiters` RENAME TO `recruiters`;--> statement-breakpoint
PRAGMA foreign_keys=ON;