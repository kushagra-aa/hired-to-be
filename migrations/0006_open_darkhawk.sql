PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user_credentials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`provider` text NOT NULL,
	`scopes` text DEFAULT '' NOT NULL,
	`expiry` integer NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_user_credentials`("id", "user_id", "access_token", "refresh_token", "provider", "scopes", "expiry", "is_active", "created_at", "updated_at") SELECT "id", "user_id", "access_token", "refresh_token", "provider", "scopes", "expiry", "is_active", "created_at", "updated_at" FROM `user_credentials`;--> statement-breakpoint
DROP TABLE `user_credentials`;--> statement-breakpoint
ALTER TABLE `__new_user_credentials` RENAME TO `user_credentials`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `user_provider_idx` ON `user_credentials` (`user_id`,`provider`);