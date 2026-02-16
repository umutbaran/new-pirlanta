import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import process from 'process';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Veri taşıma işlemi başlıyor...');

  // --- 1. Kategoriler ---
  try {
    const categoriesData = await fs.readFile(path.join(process.cwd(), 'data/categories.json'), 'utf-8');
    const categories = JSON.parse(categoriesData);
    for (const cat of categories) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {
          name: cat.name,
          isActive: cat.isActive,
          isSpecial: cat.isSpecial || false,
          subCategories: cat.subCategories || []
        },
        create: {
          name: cat.name,
          slug: cat.slug,
          isActive: cat.isActive,
          isSpecial: cat.isSpecial || false,
          subCategories: cat.subCategories || []
        }
      });
    }
    console.log('✅ Kategoriler taşındı.');
  } catch (e) { console.log('❌ Kategoriler taşınırken hata veya dosya yok:', e.message); }

  // --- 2. Ürünler ---
  try {
    const productsData = await fs.readFile(path.join(process.cwd(), 'data/db.json'), 'utf-8');
    const products = JSON.parse(productsData);
    for (const p of products) {
      await prisma.product.upsert({
        where: { sku: p.sku || p.id }, // SKU yoksa ID'yi kullan
        update: {
          name: p.name,
          category: p.category,
          subCategory: p.subCategory,
          price: parseFloat(p.price),
          oldPrice: p.oldPrice ? parseFloat(p.oldPrice) : null,
          isNew: p.isNew || false,
          description: p.description,
          images: p.images || [],
          details: p.details || {}
        },
        create: {
          id: p.id.length > 10 ? p.id : undefined, // Eğer uuid değilse prisma oluştursun
          sku: p.sku || p.id,
          name: p.name,
          category: p.category,
          subCategory: p.subCategory,
          price: parseFloat(p.price),
          oldPrice: p.oldPrice ? parseFloat(p.oldPrice) : null,
          isNew: p.isNew || false,
          description: p.description,
          images: p.images || [],
          details: p.details || {}
        }
      });
    }
    console.log('✅ Ürünler taşındı.');
  } catch (e) { console.log('❌ Ürünler taşınırken hata veya dosya yok:', e.message); }

  // --- 3. Ayarlar ---
  try {
    const settingsData = await fs.readFile(path.join(process.cwd(), 'data/settings.json'), 'utf-8');
    const settings = JSON.parse(settingsData);
    await prisma.settings.upsert({
      where: { id: 1 },
      update: settings,
      create: { ...settings, id: 1 }
    });
    console.log('✅ Ayarlar taşındı.');
  } catch (e) { console.log('❌ Ayarlar taşınırken hata:', e.message); }

  // --- 4. UI Config ---
  try {
    const uiConfigData = await fs.readFile(path.join(process.cwd(), 'data/ui-config.json'), 'utf-8');
    const uiConfig = JSON.parse(uiConfigData);
    await prisma.uiConfig.upsert({
      where: { id: 1 },
      update: { config: uiConfig },
      create: { id: 1, config: uiConfig }
    });
    console.log('✅ UI Konfigürasyonu taşındı.');
  } catch (e) { console.log('❌ UI Config taşınırken hata:', e.message); }

  console.log('🏁 Taşıma işlemi başarıyla tamamlandı.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
