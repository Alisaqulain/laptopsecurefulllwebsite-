import type { RepairService } from "@/types";

export const repairServices: RepairService[] = [
  {
    id: "r-001",
    slug: "screen-replacement",
    name: "Screen Replacement",
    icon: "Monitor",
    shortDesc: "Cracked, flickering, or dead pixels? We have you covered.",
    description:
      "We replace LED, IPS, OLED, and touch panels for every major laptop brand. Original-grade screens with 6-month warranty on parts and labor.",
    startingPrice: 4999,
    duration: "2 - 4 hours",
    features: [
      "Original / OEM-grade panels",
      "Free pickup & drop",
      "6-month replacement warranty",
      "Same-day service available",
    ],
  },
  {
    id: "r-002",
    slug: "battery-replacement",
    name: "Battery Replacement",
    icon: "Battery",
    shortDesc:
      "Restore all-day battery life with genuine high-capacity cells.",
    description:
      "Brand-new genuine batteries with original cycle counts. Fast diagnostics and on-the-spot replacement for most models.",
    startingPrice: 2999,
    duration: "1 - 2 hours",
    features: [
      "100% genuine batteries",
      "12-month battery warranty",
      "Battery health report included",
      "Free calibration service",
    ],
  },
  {
    id: "r-003",
    slug: "keyboard-repair",
    name: "Keyboard Repair",
    icon: "Keyboard",
    shortDesc: "Sticky, missing, or unresponsive keys? Repaired or replaced.",
    description:
      "Single-key replacement for spills and worn-out keys, or full keyboard module replacements with backlight support intact.",
    startingPrice: 1499,
    duration: "1 - 3 hours",
    features: [
      "Single key or full keyboard",
      "Backlight functionality preserved",
      "Cleaning of liquid spills",
      "OEM grade parts",
    ],
  },
  {
    id: "r-004",
    slug: "motherboard-repair",
    name: "Motherboard Repair",
    icon: "Cpu",
    shortDesc: "Chip-level repair by certified engineers.",
    description:
      "Component-level diagnosis using thermal cameras and microscopes. We fix BGA, GPU re-balling, charging IC, and power section issues.",
    startingPrice: 5999,
    duration: "1 - 5 days",
    features: [
      "Chip-level diagnosis",
      "Thermal-camera testing",
      "GPU re-balling support",
      "90-day repair warranty",
    ],
  },
  {
    id: "r-005",
    slug: "water-damage",
    name: "Water Damage Recovery",
    icon: "Droplets",
    shortDesc: "Liquid spill? Don't panic — we recover most laptops.",
    description:
      "Ultrasonic cleaning, board-level drying, and corrosion removal. Up to 80% of cases recovered with no data loss.",
    startingPrice: 3999,
    duration: "2 - 7 days",
    features: [
      "Ultrasonic cleaning",
      "Corrosion removal",
      "Component-level diagnosis",
      "Free initial assessment",
    ],
  },
  {
    id: "r-006",
    slug: "software-installation",
    name: "Software & OS Install",
    icon: "MonitorDot",
    shortDesc:
      "Genuine Windows, macOS, productivity suites, and driver installs.",
    description:
      "Fresh OS installs, dual-boot setup, anti-virus, and full software bundles. Data backup before reinstall is included.",
    startingPrice: 999,
    duration: "1 - 3 hours",
    features: [
      "Genuine Windows / macOS install",
      "Dual-boot setup available",
      "Free data backup",
      "Driver and update install",
    ],
  },
  {
    id: "r-007",
    slug: "ssd-ram-upgrade",
    name: "SSD & RAM Upgrade",
    icon: "HardDrive",
    shortDesc: "Speed up your laptop with NVMe SSD and RAM upgrades.",
    description:
      "Upgrade from HDD to NVMe SSD and bump your RAM for instant performance gains. Free data migration included.",
    startingPrice: 2499,
    duration: "1 - 2 hours",
    features: [
      "Free data cloning",
      "Top-tier SSD/RAM brands",
      "Performance benchmarks",
      "Same-day service",
    ],
  },
  {
    id: "r-008",
    slug: "thermal-paste-cleaning",
    name: "Thermal Paste & Cleaning",
    icon: "Wind",
    shortDesc: "Fix overheating with deep cleaning and premium thermal paste.",
    description:
      "Complete deep cleaning, fan service, and Arctic / Thermalright thermal paste application for cooler, quieter performance.",
    startingPrice: 1499,
    duration: "1 - 2 hours",
    features: [
      "Premium thermal paste",
      "Heatpipe & fan cleaning",
      "Temperature stress test",
      "Same-day service",
    ],
  },
];

export const repairProcess = [
  {
    step: "01",
    title: "Diagnosis",
    description:
      "Drop in or schedule a free pickup — our engineers inspect the device and send a transparent quote.",
    icon: "Search",
  },
  {
    step: "02",
    title: "Approval",
    description:
      "You approve the quote on WhatsApp or email. No hidden charges, ever.",
    icon: "CheckCircle2",
  },
  {
    step: "03",
    title: "Repair",
    description:
      "Certified technicians fix your device using genuine parts in our in-house lab.",
    icon: "Wrench",
  },
  {
    step: "04",
    title: "Quality Check",
    description:
      "Every device is stress-tested across 30+ checkpoints before delivery.",
    icon: "ShieldCheck",
  },
  {
    step: "05",
    title: "Delivery",
    description:
      "Free home delivery, fully cleaned, with detailed warranty card.",
    icon: "Truck",
  },
];

export const getRepairServiceBySlug = (slug: string) =>
  repairServices.find((r) => r.slug === slug);
