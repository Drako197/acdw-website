// AC Drain Wiz shared types

export type Audience =
  | "HVAC Contractors"
  | "HVAC Distributors/Wholesalers"
  | "City/Code Officials (AHJs)"
  | "Homeowners (via contractors)";

export type Market =
  | "Residential HVAC"
  | "Condominiums/Apartments"
  | "Light Commercial (select installs)";

export interface PricingTier {
  pack: string;
  tier_1_qty?: string;
  tier_1_price?: number | string;
  tier_2_qty?: string;
  tier_2_price?: number | string;
  tier_3_qty?: string;
  tier_3_price?: number | string;
  margin?: string[]; // e.g., ["25%","30%","35%"]
  suggested_contractor_price?: number;
  distributor_prices?: number[];
}

export interface BaseProduct {
  product_id: string;
  name: string;
  status: "GA" | "Pre-launch (spec draft)";
  description: string;
  key_benefits: string[];
  codes_and_compliance?: {
    references?: string[];
    notes?: string;
  };
  pricing?: {
    msrp_usd?: number | string;
    contractor_tiers?: PricingTier[];
    distributor_tiers?: PricingTier[];
  };
  open_items?: string[];
}

export interface CoreProduct extends BaseProduct {
  compatibility?: {
    drain_line_size?: string;
    transfer_pump_compatible?: boolean;
  };
  install?: {
    typical_time_minutes?: number;
    tools_required?: string;
    process_highlights?: string[];
  };
}

export interface MiniProduct extends BaseProduct {
  form_factor?: {
    overall_length_in?: number;
    primary_port?: string;
    o_ring_gland?: string;
  };
  connections?: {
    ends?: string;
    compatibility?: string[];
  };
  attachments_included?: string[];
  attachments_optional?: Array<{
    name: string;
    direction: string;
    limits?: Record<string, string>;
  }>;
  ui_markings?: string[];
  materials?: {
    body?: string;
    uv_stabilization?: string;
    min_wall_thickness_mm?: string | number;
  };
  installation?: {
    typical_time_minutes?: number;
    steps?: string[];
  };
  packaging?: {
    single_unit_includes?: string[];
    case_packs?: string;
  };
}

export interface SensorModel {
  model_id: string;
  power: string;
  ac_shutoff: boolean;
  shutoff_threshold_pct?: number;
}

export interface SensorProduct extends BaseProduct {
  models?: SensorModel[];
  measurement_logic?: {
    method?: string;
    range_pct?: string | number;
    normal_band_pct?: string | number;
    alert_threshold_pct?: number;
    shutoff_threshold_pct?: number;
  };
  alerts_reporting?: {
    channels?: string[];
    daily_report?: boolean;
    battery_level_reporting?: boolean;
  };
  provisioning?: {
    technician_installed?: boolean;
    requires_homeowner_wifi?: boolean;
    steps?: string[];
  };
  hardware?: {
    interface?: string;
    housing?: string;
    led_states?: Record<string, string>;
  };
  integration?: {
    dashboard?: string;
    features?: string[];
  };
  packaging?: {
    battery_model_includes?: string[];
    dc_model_includes?: string[];
  };
}

export interface CatalogMeta {
  acdw_catalog_version: string;
  brand: string;
  mission: string;
  audiences: Audience[];
  primary_markets: Market[];
  contact: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  go_to_market_notes?: {
    messages_contractors?: string[];
    messages_distributors?: string[];
    messages_ahj?: string[];
  };
  global_open_items?: string[];
}
