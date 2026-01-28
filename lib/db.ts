import fs from 'fs/promises';
import path from 'path';
import { Product } from '@/data/products';

const dbPath = path.join(process.cwd(), 'data/db.json');
const settingsPath = path.join(process.cwd(), 'data/settings.json');

export interface Settings {
  siteTitle: string;
  contactEmail: string;
  phoneNumber: string;
  address: string;
  currency: string;
  goldPriceMargin: number;
}

export async function getSettings(): Promise<Settings> {
  try {
    const data = await fs.readFile(settingsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return {
      siteTitle: "New Pırlanta",
      contactEmail: "",
      phoneNumber: "",
      address: "",
      currency: "TRY",
      goldPriceMargin: 0
    };
  }
}

export async function saveSettings(settings: Settings) {
  await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');
}

export async function getProducts(): Promise<Product[]> {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export async function saveProducts(products: Product[]) {
  await fs.writeFile(dbPath, JSON.stringify(products, null, 2), 'utf-8');
}

export async function addProduct(product: Product) {
  const products = await getProducts();
  products.push(product);
  await saveProducts(products);
}

export async function updateProduct(id: string, updatedProduct: Product) {
  const products = await getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = updatedProduct;
    await saveProducts(products);
  }
}

export async function deleteProduct(id: string) {
  const products = await getProducts();
  const filtered = products.filter(p => p.id !== id);
  await saveProducts(filtered);
}
