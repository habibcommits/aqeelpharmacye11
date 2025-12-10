import mongoose, { Schema, Document } from 'mongoose';

// User Model
export interface IUser extends Document {
  username: string;
  password: string;
  email?: string;
  phone?: string;
  isAdmin: boolean;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  isAdmin: { type: Boolean, default: false },
});

// Category Model
export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String },
  parentId: { type: String },
});

// Brand Model
export interface IBrand extends Document {
  name: string;
  slug: string;
  logo?: string;
  description?: string;
}

const BrandSchema = new Schema<IBrand>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  logo: { type: String },
  description: { type: String },
});

// Product Model
export interface IProduct extends Document {
  name: string;
  slug: string;
  description?: string;
  price: number;
  comparePrice?: number;
  images: string[];
  categoryId?: string;
  brandId?: string;
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  sku?: string;
  weight?: string;
  tags: string[];
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number, required: true },
  comparePrice: { type: Number },
  images: { type: [String], default: [] },
  categoryId: { type: String },
  brandId: { type: String },
  stock: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  sku: { type: String },
  weight: { type: String },
  tags: { type: [String], default: [] },
});

// Order Model
export interface IOrder extends Document {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  postalCode?: string;
  notes?: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  items: IOrderItem[];
}

export interface IOrderItem {
  productId: string;
  productName: string;
  productImage?: string;
  price: number;
  quantity: number;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  productImage: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const OrderSchema = new Schema<IOrder>({
  orderNumber: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  shippingAddress: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String },
  notes: { type: String },
  subtotal: { type: Number, required: true },
  shippingCost: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  paymentMethod: { type: String, default: 'cod' },
  createdAt: { type: String, required: true },
  items: { type: [OrderItemSchema], default: [] },
});

// Banner Model
export interface IBanner extends Document {
  title?: string;
  subtitle?: string;
  image: string;
  link?: string;
  isActive: boolean;
  order: number;
}

const BannerSchema = new Schema<IBanner>({
  title: { type: String },
  subtitle: { type: String },
  image: { type: String, required: true },
  link: { type: String },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
});

// Client Model
export interface IClient extends Document {
  email: string;
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  isVerified: boolean;
  createdAt: string;
}

const ClientSchema = new Schema<IClient>({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  phone: { type: String },
  address: { type: String },
  city: { type: String },
  postalCode: { type: String },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: String, required: true },
});

// OTP Verification Model
export interface IOtpVerification extends Document {
  email: string;
  otp: string;
  expiresAt: string;
  isUsed: boolean;
  createdAt: string;
}

const OtpVerificationSchema = new Schema<IOtpVerification>({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: String, required: true },
  isUsed: { type: Boolean, default: false },
  createdAt: { type: String, required: true },
});

// Export models - check if already registered to avoid OverwriteModelError
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
export const Brand = mongoose.models.Brand || mongoose.model<IBrand>('Brand', BrandSchema);
export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export const Banner = mongoose.models.Banner || mongoose.model<IBanner>('Banner', BannerSchema);
export const Client = mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);
export const OtpVerification = mongoose.models.OtpVerification || mongoose.model<IOtpVerification>('OtpVerification', OtpVerificationSchema);
