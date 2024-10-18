// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  integer,
  pgTableCreator,
  primaryKey,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `acin_dev_${name}`);

export const projects = createTable("project", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 1024 }),
  githubUrl: varchar("githubUrl", { length: 1024 }).notNull(),
  siteUrl: varchar("siteUrl", { length: 1024 }),
  priority: integer("priority").default(1).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const projectRelations = relations(projects, ({ many }) => ({
  projectsToTags: many(projectsToTags),
}));

export const tags = createTable("tag", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 16 }).notNull(),
  url: varchar("url", { length: 1024 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const tagRelations = relations(tags, ({ many }) => ({
  projectsToTags: many(projectsToTags),
}));

export const projectsToTags = createTable(
  "projects_to_tags",
  {
    projectId: integer("projectId")
      .notNull()
      .references(() => projects.id),
    tagId: integer("tagId")
      .notNull()
      .references(() => tags.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.projectId, t.tagId] }),
  }),
);

export const projectsToTagsRelations = relations(projectsToTags, ({ one }) => ({
  project: one(projects, {
    fields: [projectsToTags.projectId],
    references: [projects.id],
  }),
  tag: one(tags, {
    fields: [projectsToTags.tagId],
    references: [tags.id],
  }),
}));
