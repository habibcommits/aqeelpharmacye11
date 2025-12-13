const fs = require('fs');
const cheerio = require('cheerio');

const files = fs.readdirSync('attached_assets').filter(f => f.endsWith('.xls'));
console.log('XLS files found:', files.length);

const allProducts = [];
const imageMap = {};

files.forEach(file => {
  const content = fs.readFileSync('attached_assets/' + file, 'utf-8');
  const $ = cheerio.load(content);
  
  const imgMatches = content.match(/https?:\/\/cdn\.shopify\.com[^\s"'<>]+\.(jpg|png|jpeg|webp)/gi);
  
  let productIndex = 0;
  $('tr').slice(1).each(function() {
    const cells = [];
    $(this).find('td').each(function() {
      cells.push($(this).text().trim());
    });
    
    if (cells.length > 0 && cells[1]) {
      const handle = cells[0];
      const imageSrc = cells[24];
      const variantImage = cells[43];
      
      let image = imageSrc || variantImage || '';
      
      if (!image && imgMatches && imgMatches[productIndex]) {
        image = imgMatches[productIndex];
      }
      
      const product = {
        handle: handle,
        title: cells[1],
        description: cells[2] ? cells[2].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 500) : '',
        vendor: cells[3] || 'Unknown',
        type: cells[4] || '',
        tags: cells[5] || '',
        price: parseFloat(cells[19]) || 0,
        comparePrice: parseFloat(cells[20]) || null,
        image: image,
        sku: cells[13] || ''
      };
      
      allProducts.push(product);
      productIndex++;
    }
  });
});

console.log('Total products parsed:', allProducts.length);

const uniqueProducts = [];
const seenHandles = new Set();
allProducts.forEach(p => {
  if (p.handle && !seenHandles.has(p.handle)) {
    seenHandles.add(p.handle);
    uniqueProducts.push(p);
  }
});

console.log('Unique products:', uniqueProducts.length);

const categoryMap = {
  'Powder Milk': 'baby',
  'Baby Powder Milk': 'baby',
  'Baby': 'baby',
  'Face Oil': 'skin-care',
  'Perfume': 'fragrance',
  'Deodorant': 'fragrance',
  'Body Spray': 'fragrance',
  'Skincare': 'skin-care',
  'Skin Care': 'skin-care',
  'Hair Care': 'hair-care',
  'Shampoo': 'hair-care',
  'Lotion': 'skin-care',
  'Cream': 'skin-care',
  'Sunscreen': 'sunscreen',
  'Makeup': 'makeup',
  'Vitamins': 'vitamins',
  'Medicine': 'medicines',
  'Nutritional Supplement': 'vitamins',
};

const vendorToBrandSlug = {
  'Abbott': 'abbott',
  'AcneRid': 'acnerid',
  'Aichun Beauty': 'aichun-beauty',
  'Aichun': 'aichun-beauty',
  'Anexa': 'anexa',
  'ANUA': 'anua',
  'Anua': 'anua',
  'Aptamil': 'aptamil',
  'Armani': 'armani',
  'Giorgio Armani': 'armani',
  'Aveeno': 'aveeno',
  'Axe': 'axe',
  'Babi Mild': 'babi-mild',
  'Babi-Mild': 'babi-mild',
};

function getCategorySlug(type, tags) {
  if (categoryMap[type]) return categoryMap[type];
  
  const allTags = (tags || '').split(',').map(t => t.trim());
  for (const tag of allTags) {
    if (categoryMap[tag]) return categoryMap[tag];
  }
  
  if (type && type.toLowerCase().includes('baby')) return 'baby';
  if (type && type.toLowerCase().includes('milk')) return 'baby';
  if (type && type.toLowerCase().includes('skin')) return 'skin-care';
  if (type && type.toLowerCase().includes('hair')) return 'hair-care';
  if (type && type.toLowerCase().includes('perfume')) return 'fragrance';
  if (type && type.toLowerCase().includes('spray')) return 'fragrance';
  if (type && type.toLowerCase().includes('oil')) return 'skin-care';
  
  return 'skin-care';
}

function getBrandSlug(vendor) {
  if (vendorToBrandSlug[vendor]) return vendorToBrandSlug[vendor];
  return vendor.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const seededProducts = uniqueProducts.map(p => {
  const slug = p.handle || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return {
    name: p.title,
    slug: slug,
    description: p.description || 'Quality product for your daily needs.',
    price: p.price,
    comparePrice: p.comparePrice,
    images: p.image ? [p.image] : [],
    categorySlug: getCategorySlug(p.type, p.tags),
    brandSlug: getBrandSlug(p.vendor),
    stock: 50,
    isFeatured: Math.random() > 0.8,
    isActive: true,
    sku: p.sku || slug.substring(0, 20).toUpperCase(),
    weight: null,
    tags: (p.tags || '').split(',').map(t => t.trim()).filter(t => t)
  };
});

const brandSlugs = [...new Set(seededProducts.map(p => p.brandSlug))];
const brands = brandSlugs.map(slug => ({
  name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
  slug: slug,
  description: 'Quality brand products'
}));

console.log('\nBrands needed:', brands.length);
console.log('Products by category:');
const catCounts = {};
seededProducts.forEach(p => {
  catCounts[p.categorySlug] = (catCounts[p.categorySlug] || 0) + 1;
});
Object.entries(catCounts).forEach(([cat, count]) => {
  console.log(`  ${cat}: ${count}`);
});

fs.writeFileSync('seeded-products.json', JSON.stringify({
  brands: brands,
  products: seededProducts
}, null, 2));

console.log('\nSaved seeded-products.json');

const productsWithImages = seededProducts.filter(p => p.images.length > 0);
console.log(`Products with images: ${productsWithImages.length}/${seededProducts.length}`);
