import { z } from 'zod';
import { PLANT_CATEGORIES } from './categories';

export const plantFormSchema = z.object({
  name: z.string().min(1, 'Plant name is required').max(100, 'Name too long'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  categories: z
    .array(z.enum(PLANT_CATEGORIES as any))
    .min(1, 'At least one category is required'),
  stock: z.number().min(0, 'Stock cannot be negative'),
  imageUrl: z.string().url('Please enter a valid image URL'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description too long'),
  careTips: z
    .string()
    .min(10, 'Care tips must be at least 10 characters')
    .max(300, 'Care tips too long'),
});

export type PlantFormData = z.infer<typeof plantFormSchema>;