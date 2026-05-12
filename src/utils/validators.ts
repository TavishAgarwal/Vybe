import { z } from 'zod';

export const emailSchema = z
  .string()
  .trim()
  .email('Enter a valid email address')
  .max(254);

export const handleSchema = z
  .string()
  .trim()
  .min(3, 'Handle must be at least 3 characters')
  .max(20, 'Handle must be 20 characters or fewer')
  .regex(/^[A-Za-z0-9_]+$/, 'Use only letters, numbers, and underscores');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[0-9\W]/, 'Password must include a number or special character');

export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(value => value.password === value.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must match',
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const profileSetupSchema = z.object({
  displayName: z.string().trim().min(1, 'Display name is required').max(50),
  handle: handleSchema,
  bio: z.string().trim().max(160).optional().default(''),
});

export const editProfileSchema = profileSetupSchema;

export const captionSchema = z.object({
  text: z.string().trim().max(200, 'Caption must be 200 characters or fewer'),
});

export const commentSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'Comment is required')
    .max(500, 'Comment must be 500 characters or fewer'),
});

export const reportSchema = z.object({
  reason: z.enum([
    'harassment',
    'hate',
    'sexual_content',
    'violence',
    'spam',
    'self_harm',
    'other',
  ]),
  details: z.string().trim().max(500).optional().default(''),
});

export const appealSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'Appeal is required')
    .max(300, 'Appeal must be 300 characters or fewer'),
});
