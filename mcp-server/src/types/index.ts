import { z } from 'zod'

// Product Types
export const ProductCategorySchema = z.enum(['DRAIN_WIZ_1_0', 'DRAIN_WIZ_MINI', 'DRAIN_WIZ_SENSOR'])
export type ProductCategory = z.infer<typeof ProductCategorySchema>

export const CustomerTypeSchema = z.enum(['homeowner', 'hvac-professional', 'city-official'])
export type CustomerType = z.infer<typeof CustomerTypeSchema>

export const UserRoleSchema = z.enum(['HOMEOWNER', 'HVAC_PROFESSIONAL', 'CITY_OFFICIAL', 'ADMIN'])
export type UserRole = z.infer<typeof UserRoleSchema>

export const PricingTierSchema = z.enum(['retail', 'pro', 'bulk', 'contact'])
export type PricingTier = z.infer<typeof PricingTierSchema>

// Product Schema
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  shortDescription: z.string(),
  price: z.number(),
  proPrice: z.number().optional(),
  bulkPrice: z.number().optional(),
  image: z.string(),
  images: z.array(z.string()),
  category: ProductCategorySchema,
  features: z.array(z.string()),
  specifications: z.record(z.any()).optional(),
  iccCompliance: z.array(z.string()),
  inStock: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
})
export type Product = z.infer<typeof ProductSchema>

// Customer Configuration Schema
export const CustomerTypeConfigSchema = z.object({
  type: CustomerTypeSchema,
  title: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  cta: z.string(),
  pricing: PricingTierSchema
})
export type CustomerTypeConfig = z.infer<typeof CustomerTypeConfigSchema>

// ICC Code Schema
export const ICCCodeSchema = z.object({
  code: z.string(),
  title: z.string(),
  description: z.string(),
  applicableProducts: z.array(ProductCategorySchema),
  complianceNotes: z.string(),
  referenceUrl: z.string().optional()
})
export type ICCCode = z.infer<typeof ICCCodeSchema>

// Installation Guide Schema
export const InstallationGuideSchema = z.object({
  id: z.string(),
  productId: z.string(),
  title: z.string(),
  difficulty: z.enum(['easy', 'moderate', 'professional']),
  estimatedTime: z.string(),
  toolsRequired: z.array(z.string()),
  steps: z.array(z.object({
    step: z.number(),
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    warning: z.string().optional()
  })),
  safetyNotes: z.array(z.string()),
  troubleshooting: z.array(z.object({
    problem: z.string(),
    solution: z.string()
  }))
})
export type InstallationGuide = z.infer<typeof InstallationGuideSchema>

// Lead Schema
export const LeadSchema = z.object({
  id: z.string(),
  type: z.enum(['DEMO_REQUEST', 'BULK_ORDER_INQUIRY', 'PRODUCT_INQUIRY', 'SUPPORT_REQUEST', 'PARTNERSHIP_INQUIRY']),
  company: z.string().optional(),
  contactName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string(),
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'CLOSED']),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})
export type Lead = z.infer<typeof LeadSchema>

// Analytics Schema
export const AnalyticsDataSchema = z.object({
  date: z.date(),
  pageViews: z.number(),
  uniqueVisitors: z.number(),
  conversions: z.number(),
  revenue: z.number(),
  topPages: z.array(z.object({
    page: z.string(),
    views: z.number()
  })),
  customerTypeBreakdown: z.record(z.number())
})
export type AnalyticsData = z.infer<typeof AnalyticsDataSchema>
