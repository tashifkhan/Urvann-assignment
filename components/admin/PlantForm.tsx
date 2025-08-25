'use client';

// Import react-hook-form at runtime to avoid a named-export/typing mismatch in the build environment
// eslint-disable-next-line @typescript-eslint/no-var-requires
const RHook = require('react-hook-form') as any;
import { zodResolver } from '@hookform/resolvers/zod';
import { Plant } from '@/types/plant';
import { plantFormSchema, PlantFormData } from '@/lib/plant-form-schema';
import { PLANT_CATEGORIES } from '@/lib/categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface PlantFormProps {
  plant?: Plant;
  onSubmit: (data: PlantFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function PlantForm({
  plant,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: PlantFormProps) {
  const form = RHook.useForm({
    resolver: zodResolver(plantFormSchema),
    defaultValues: plant
      ? {
          name: plant.name,
          price: plant.price,
          categories: plant.categories as any,
          stock: plant.stock,
          imageUrl: plant.imageUrl,
          description: plant.description,
          careTips: plant.careTips,
        }
      : {
          name: '',
          price: 0,
          categories: [],
          stock: 0,
          imageUrl: '',
          description: '',
          careTips: '',
        },
  }) as any;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{plant ? 'Edit Plant' : 'Add New Plant'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Plant Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Monstera Deliciosa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={e =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={e =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://images.pexels.com/..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter a valid image URL from Pexels or other sources
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categories"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Categories</FormLabel>
                    <FormDescription>
                      Select all categories that apply to this plant
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {PLANT_CATEGORIES.map(category => (
                      <FormField
                        key={category}
                        control={form.control}
                        name="categories"
                        render={({ field }: any) => {
                          return (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(category)}
                                  onCheckedChange={checked => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          category,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value: any) => value !== category
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {category}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the plant, its features, and benefits..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="careTips"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Care Tips</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide care instructions for this plant..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Saving...'
                  : plant
                    ? 'Update Plant'
                    : 'Create Plant'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
