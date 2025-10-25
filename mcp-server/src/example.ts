// example.ts
import type {
  CatalogMeta,
  CoreProduct,
  MiniProduct,
  SensorProduct
} from "./types/acdw";

// Sample data for demonstration
const miniSample: MiniProduct = {
  product_id: "ACDW-MINI",
  name: "ACDW Mini",
  status: "Pre-launch (spec draft)",
  description: "Compact maintenance manifold",
  key_benefits: ["One port for all services"],
  form_factor: {
    overall_length_in: 5,
    primary_port: "Bayonet, quarter-turn with lock detent",
    o_ring_gland: "Present; size/material TBD"
  },
  attachments_optional: [
    { name: "Water Hose Attachment", direction: "Outward only", limits: { "max_psi": "TBD", "max_gpm": "TBD" } },
    { name: "Air Hose Attachment", direction: "Outward only", limits: { "max_psi": "TBD", "max_cfm": "TBD" } }
  ],
  materials: {
    body: "Clear/translucent polymer (ABS vs clear PVC TBD)",
    uv_stabilization: "TBD",
    min_wall_thickness_mm: "TBD"
  },
  packaging: {
    single_unit_includes: ["Mini manifold with bi-directional plug"],
    case_packs: "TBD"
  },
  pricing: { msrp_usd: "TBD" },
  open_items: [
    "Finalize bayonet spec (lug width/height, 90° throw, detent force)",
    "O-ring material/size (e.g., NBR/EPDM, durometer)",
    "Socket depth/chamfer and tolerance table"
  ]
};

const sensorSample: SensorProduct = {
  product_id: "ACDW-SENSOR",
  name: "ACDW Sensor",
  status: "Pre-launch (spec draft)",
  description: "No-contact capacitive water-level sensor",
  key_benefits: ["No moving parts; no direct water contact"],
  models: [
    { model_id: "ACDW-SENSOR-WIFI-BATT", power: "Battery (target life ~2 years)", ac_shutoff: false },
    { model_id: "ACDW-SENSOR-WIFI-DC", power: "DC primary + backup battery", ac_shutoff: true }
  ],
  measurement_logic: {
    method: "Capacitive; measures air volume proxy inside Mini manifold",
    range_pct: "10–100 (indicative, calibration TBD)",
    normal_band_pct: "5–15",
    alert_threshold_pct: 50,
    shutoff_threshold_pct: 90
  },
  pricing: { msrp_usd: "TBD" },
  open_items: [
    "Battery chemistry and exact life claim",
    "DC input voltage/current range",
    "Relay type and rating (A/V), NO/NC"
  ]
};

// Example: list TBD fields to route to engineering
function findTBD(obj: unknown, path: string[] = []): string[] {
  if (obj === null || typeof obj !== "object") return [];
  const out: string[] = [];
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    const p = [...path, k];
    if (typeof v === "string" && v.toUpperCase().includes("TBD")) out.push(p.join("."));
    else out.push(...findTBD(v, p));
  }
  return out;
}

console.log("MINI TBD:", findTBD(miniSample));
console.log("SENSOR TBD:", findTBD(sensorSample));
