DROP INDEX `organizations_name_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `org_user_idx` ON `organizations` (`name`,`user_id`);