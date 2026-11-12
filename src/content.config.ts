import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const category = z.enum(['MMA', 'Grappling']);

const organisations = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/organisations' }),
  schema: z.object({
    name: z.string(),
    mark: z.string().min(1).max(3),
    kind: z.enum(['professionnelle', 'amateur']),
    place: z.string(),
    description: z.string(),
    example: z.boolean(),
  }),
});

const athletes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/athletes' }),
  schema: z.object({
    name: z.string(),
    nickname: z.string().optional(),
    record: z.object({
      wins: z.number().int().nonnegative(),
      losses: z.number().int().nonnegative(),
      draws: z.number().int().nonnegative(),
    }),
    weightClass: z.string(),
    team: z.string(),
    country: z.string().default('France'),
    discipline: category,
    organisation: reference('organisations'),
    example: z.boolean(),
    fights: z
      .array(
        z.object({
          date: z.coerce.date(),
          opponent: z.string(),
          opponentRecord: z.string().optional(),
          result: z.enum(['Victoire', 'Défaite', 'Nul']),
          method: z.string(),
          eventName: z.string(),
          event: reference('events').optional(),
          round: z.number().int().positive().optional(),
        }),
      )
      .default([]),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    city: z.string(),
    venue: z.string(),
    organisation: reference('organisations'),
    discipline: z.enum(['MMA', 'Grappling', 'Mixte']),
    example: z.boolean(),
    broadcast: z
      .object({
        when: z.string(),
        channel: z.string(),
      })
      .optional(),
    fights: z
      .array(
        z.object({
          weightClass: z.string(),
          red: z.string(),
          blue: z.string(),
          redRecord: z.string().optional(),
          blueRecord: z.string().optional(),
          redAthlete: reference('athletes').optional(),
          blueAthlete: reference('athletes').optional(),
          winner: z.enum(['red', 'blue', 'draw']).optional(),
          method: z.string().optional(),
          round: z.number().int().positive().optional(),
          main: z.boolean().optional(),
        }),
      )
      .default([]),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string(),
    category: category,
    format: z.enum(['breve', 'diffusion', 'resultats', 'decryptage']).default('breve'),
    section: z.enum(['une', 'fight']).default('fight'),
    tile: z.enum(['landscape', 'square', 'portrait']).default('landscape'),
    spotlight: z.boolean().default(false),
    organisation: reference('organisations'),
    athletes: z.array(reference('athletes')).default([]),
    event: reference('events').optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    example: z.boolean(),
    video: z
      .object({
        provider: z.enum(['youtube', 'instagram', 'fichier']),
        id: z.string().optional(),
        duration: z.string(),
      })
      .optional(),
  }),
});

export const collections = { articles, athletes, events, organisations };
