export type ProductCategory =
  | "gaming"
  | "business"
  | "student"
  | "refurbished"
  | "new"
  | "macbook"
  | "accessories"
  | "spare-parts";

export type ProductCondition =
  | "Brand New"
  | "Like New"
  | "Excellent"
  | "Good"
  | "Refurbished";

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  condition: ProductCondition;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  warranty: string;
  shortDescription: string;
  description: string;
  images: string[];
  thumbnail: string;
  specs: {
    processor: string;
    ram: string;
    storage: string;
    display: string;
    graphics: string;
    os: string;
    battery: string;
    weight: string;
    ports?: string;
  };
  highlights: string[];
  inBox: string[];
  tags: string[];
}

export interface Accessory {
  id: string;
  slug: string;
  name: string;
  category:
    | "mouse"
    | "keyboard"
    | "cooling-pad"
    | "charger"
    | "ssd"
    | "ram"
    | "bag"
    | "headphones"
    | "monitor"
    | "other";
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
  description: string;
  inStock: boolean;
}

export interface RepairService {
  id: string;
  slug: string;
  name: string;
  icon: string;
  shortDesc: string;
  description: string;
  startingPrice: number;
  duration: string;
  features: string[];
}

export interface PCBuild {
  id: string;
  slug: string;
  name: string;
  category: "gaming" | "office" | "workstation" | "streaming";
  price: number;
  originalPrice?: number;
  image: string;
  tagline: string;
  components: {
    cpu: string;
    gpu: string;
    ram: string;
    storage: string;
    motherboard: string;
    psu: string;
    case: string;
    cooler: string;
  };
  performance: {
    label: string;
    score: number;
  }[];
  features: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  category: string;
  tags: string[];
  date: string;
  readingTime: string;
  featured?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
  product?: string;
  city: string;
  date: string;
  verified: boolean;
  videoThumb?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: "store" | "products" | "repair" | "team" | "events";
  width?: number;
  height?: number;
}

export interface Brand {
  name: string;
  logo: string;
  href?: string;
}
