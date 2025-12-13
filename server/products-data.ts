import type { SeedProductData } from './seed-data';

const pharmacyBrands = [
  'Abbott', 'Pfizer', 'GSK', 'Sanofi', 'Novartis', 'Roche', 'Johnson & Johnson',
  'Bayer', 'AstraZeneca', 'Merck', 'Eli Lilly', 'Bristol-Myers', 'Amgen',
  'Gilead', 'Biogen', 'Regeneron', 'Vertex', 'Alexion', 'Incyte', 'BioMarin',
  'CeraVe', 'La Roche-Posay', 'Neutrogena', 'Eucerin', 'Cetaphil', 'Aveeno',
  'Nivea', 'Dove', 'Garnier', 'Olay', "L'Oreal", 'Maybelline', 'Revlon', 'Clinique',
  'Estee Lauder', 'MAC', 'NARS', 'Urban Decay', 'Too Faced', 'Fenty Beauty',
  'Himalaya', 'Patanjali', 'Dabur', 'Hamdard', 'Qarshi', 'Marhaba', 'Hashmi',
  'Vitamin World', 'Nature Made', 'Centrum', 'One A Day', 'Alive', 'Rainbow Light',
  'Enfamil', 'Similac', 'Nestle', 'Gerber', 'Hipp', 'Holle', 'Aptamil', 'Kendamil',
  'Pampers', 'Huggies', 'MamyPoko', 'Seventh Generation', 'Honest Company',
  'Isdin', 'Bioderma', 'Avene', 'Vichy', 'Kiehl\'s', 'Origins', 'Fresh', 'Drunk Elephant',
  'The Ordinary', 'Paula\'s Choice', 'Skinceuticals', 'Murad', 'Peter Thomas Roth',
  'Sunday Riley', 'Tatcha', 'Glow Recipe', 'Herbivore', 'Youth To The People',
  'Innisfree', 'COSRX', 'Some By Mi', 'Klairs', 'Missha', 'Laneige', 'Sulwhasoo',
  'Biore', 'Hada Labo', 'Shiseido', 'SK-II', 'Kose', 'Canmake', 'Kate', 'Majolica',
];

const skinCareProducts = [
  { name: 'Hydrating Facial Cleanser', price: 1250, desc: 'Gentle cleanser for daily use' },
  { name: 'Foaming Face Wash', price: 850, desc: 'Deep cleansing formula' },
  { name: 'Micellar Water', price: 1100, desc: 'All-in-one makeup remover' },
  { name: 'Oil-Free Moisturizer', price: 1450, desc: 'Lightweight hydration' },
  { name: 'Rich Moisturizing Cream', price: 1850, desc: 'Intense hydration for dry skin' },
  { name: 'Anti-Aging Serum', price: 2500, desc: 'Reduces fine lines and wrinkles' },
  { name: 'Vitamin C Serum', price: 2200, desc: 'Brightening and antioxidant protection' },
  { name: 'Hyaluronic Acid Serum', price: 1950, desc: 'Deep hydration boost' },
  { name: 'Retinol Night Cream', price: 2800, desc: 'Anti-aging night treatment' },
  { name: 'Niacinamide Serum', price: 1650, desc: 'Pore-minimizing treatment' },
  { name: 'Exfoliating Toner', price: 1350, desc: 'AHA/BHA exfoliation' },
  { name: 'Hydrating Toner', price: 1100, desc: 'Prep and hydrate skin' },
  { name: 'Eye Cream', price: 1750, desc: 'Reduces dark circles and puffiness' },
  { name: 'Face Oil', price: 1900, desc: 'Nourishing facial oil' },
  { name: 'Clay Mask', price: 1200, desc: 'Deep pore cleansing mask' },
  { name: 'Sheet Mask Pack', price: 450, desc: 'Instant hydration boost' },
  { name: 'Sleeping Mask', price: 1550, desc: 'Overnight intensive treatment' },
  { name: 'Lip Balm', price: 350, desc: 'Moisturizing lip care' },
  { name: 'Hand Cream', price: 550, desc: 'Nourishing hand treatment' },
  { name: 'Body Lotion', price: 950, desc: 'Full body moisturizer' },
  { name: 'Acne Spot Treatment', price: 750, desc: 'Targeted acne solution' },
  { name: 'Pimple Patches', price: 450, desc: 'Hydrocolloid acne patches' },
  { name: 'Salicylic Acid Cleanser', price: 1150, desc: 'Acne-fighting cleanser' },
  { name: 'Benzoyl Peroxide Gel', price: 650, desc: 'Acne treatment gel' },
  { name: 'Oil Control Moisturizer', price: 1250, desc: 'Mattifying hydration' },
];

const hairCareProducts = [
  { name: 'Strengthening Shampoo', price: 950, desc: 'Reduces hair fall' },
  { name: 'Volumizing Shampoo', price: 850, desc: 'Adds body and volume' },
  { name: 'Moisturizing Shampoo', price: 900, desc: 'For dry and damaged hair' },
  { name: 'Anti-Dandruff Shampoo', price: 750, desc: 'Fights flakes and itching' },
  { name: 'Color Protection Shampoo', price: 1100, desc: 'Preserves hair color' },
  { name: 'Conditioner', price: 850, desc: 'Softens and detangles' },
  { name: 'Deep Conditioner', price: 1200, desc: 'Intensive repair treatment' },
  { name: 'Leave-In Conditioner', price: 950, desc: 'Daily conditioning spray' },
  { name: 'Hair Mask', price: 1350, desc: 'Weekly deep treatment' },
  { name: 'Hair Oil', price: 750, desc: 'Nourishing hair treatment' },
  { name: 'Argan Oil', price: 1450, desc: 'Premium hair oil' },
  { name: 'Hair Serum', price: 1100, desc: 'Shine and frizz control' },
  { name: 'Heat Protection Spray', price: 950, desc: 'Protects from heat styling' },
  { name: 'Dry Shampoo', price: 850, desc: 'Refreshes hair between washes' },
  { name: 'Scalp Treatment', price: 1550, desc: 'Promotes healthy scalp' },
  { name: 'Hair Growth Serum', price: 2200, desc: 'Stimulates hair growth' },
  { name: 'Keratin Treatment', price: 1850, desc: 'Smoothing treatment' },
  { name: 'Biotin Hair Supplement', price: 1650, desc: 'Hair growth vitamins' },
];

const makeupProducts = [
  { name: 'Foundation', price: 1850, desc: 'Full coverage foundation' },
  { name: 'BB Cream', price: 1250, desc: 'Lightweight coverage with SPF' },
  { name: 'CC Cream', price: 1350, desc: 'Color correcting cream' },
  { name: 'Concealer', price: 950, desc: 'Covers dark circles and blemishes' },
  { name: 'Setting Powder', price: 1100, desc: 'Locks makeup in place' },
  { name: 'Blush', price: 850, desc: 'Adds color to cheeks' },
  { name: 'Bronzer', price: 1150, desc: 'Sun-kissed glow' },
  { name: 'Highlighter', price: 1050, desc: 'Luminous glow' },
  { name: 'Contour Kit', price: 1650, desc: 'Sculpting palette' },
  { name: 'Eyeshadow Palette', price: 2200, desc: 'Multiple shades' },
  { name: 'Eyeliner', price: 650, desc: 'Precision liner' },
  { name: 'Mascara', price: 950, desc: 'Volumizing lashes' },
  { name: 'Eyebrow Pencil', price: 550, desc: 'Defines brows' },
  { name: 'Lipstick', price: 850, desc: 'Long-lasting color' },
  { name: 'Lip Gloss', price: 650, desc: 'Shiny finish' },
  { name: 'Lip Liner', price: 450, desc: 'Defines lips' },
  { name: 'Makeup Primer', price: 1350, desc: 'Prep skin for makeup' },
  { name: 'Setting Spray', price: 1150, desc: 'Extends makeup wear' },
  { name: 'Makeup Remover', price: 850, desc: 'Gentle cleansing' },
  { name: 'False Lashes', price: 350, desc: 'Dramatic eyes' },
];

const fragranceProducts = [
  { name: 'Eau de Parfum 100ml', price: 8500, desc: 'Long-lasting fragrance' },
  { name: 'Eau de Toilette 100ml', price: 6500, desc: 'Fresh daily scent' },
  { name: 'Cologne 100ml', price: 5500, desc: 'Light refreshing scent' },
  { name: 'Body Mist 250ml', price: 1850, desc: 'Light all-over fragrance' },
  { name: 'Deodorant Spray 150ml', price: 650, desc: 'All-day freshness' },
  { name: 'Roll-On Deodorant 50ml', price: 450, desc: 'Compact protection' },
  { name: 'Perfume Gift Set', price: 12500, desc: 'Complete fragrance collection' },
  { name: 'Travel Size Perfume 30ml', price: 3500, desc: 'On-the-go fragrance' },
  { name: 'Perfume Oil 10ml', price: 2500, desc: 'Concentrated fragrance' },
  { name: 'Scented Body Lotion 200ml', price: 1650, desc: 'Moisturizing with fragrance' },
];

const sunscreenProducts = [
  { name: 'Sunscreen SPF 30 50ml', price: 1250, desc: 'Daily sun protection' },
  { name: 'Sunscreen SPF 50 50ml', price: 1550, desc: 'High protection' },
  { name: 'Sunscreen SPF 60 60g', price: 1850, desc: 'Maximum protection' },
  { name: 'Sunscreen SPF 100 50ml', price: 2200, desc: 'Ultra protection' },
  { name: 'Tinted Sunscreen 50ml', price: 1750, desc: 'Sun protection with color' },
  { name: 'Mineral Sunscreen 50ml', price: 1950, desc: 'Physical sun protection' },
  { name: 'Sunscreen Spray 150ml', price: 1650, desc: 'Easy application' },
  { name: 'Water-Resistant Sunscreen 50ml', price: 1850, desc: 'For swimming and sports' },
  { name: 'Face Sunscreen 30ml', price: 1450, desc: 'Lightweight for face' },
  { name: 'Body Sunscreen 100ml', price: 1350, desc: 'Full body protection' },
  { name: 'Kids Sunscreen 100ml', price: 1250, desc: 'Gentle for children' },
  { name: 'After Sun Lotion 200ml', price: 950, desc: 'Soothes sun-exposed skin' },
];

const babyProducts = [
  { name: 'Baby Formula Stage 1 400g', price: 2800, desc: 'Infant nutrition 0-6 months' },
  { name: 'Baby Formula Stage 2 400g', price: 2900, desc: 'Follow-on formula 6-12 months' },
  { name: 'Baby Formula Stage 3 400g', price: 2700, desc: 'Growing up milk 1-3 years' },
  { name: 'Baby Formula 800g', price: 4500, desc: 'Value size formula' },
  { name: 'Organic Baby Formula 400g', price: 4200, desc: 'Organic nutrition' },
  { name: 'Baby Cereal 250g', price: 650, desc: 'First foods' },
  { name: 'Baby Food Puree', price: 350, desc: 'Ready to eat' },
  { name: 'Baby Shampoo 200ml', price: 550, desc: 'Tear-free formula' },
  { name: 'Baby Shampoo 500ml', price: 950, desc: 'Value size' },
  { name: 'Baby Body Wash 200ml', price: 550, desc: 'Gentle cleansing' },
  { name: 'Baby Lotion 200ml', price: 650, desc: 'Moisturizing care' },
  { name: 'Baby Oil 200ml', price: 550, desc: 'Massage oil' },
  { name: 'Baby Powder 200g', price: 450, desc: 'Keeps baby dry' },
  { name: 'Baby Cream 100g', price: 350, desc: 'Protective cream' },
  { name: 'Diaper Rash Cream 100g', price: 550, desc: 'Heals and protects' },
  { name: 'Baby Wipes 80pcs', price: 350, desc: 'Gentle cleansing wipes' },
  { name: 'Diapers Small 40pcs', price: 1250, desc: '3-6kg' },
  { name: 'Diapers Medium 34pcs', price: 1250, desc: '6-11kg' },
  { name: 'Diapers Large 28pcs', price: 1250, desc: '9-14kg' },
  { name: 'Diapers XL 24pcs', price: 1250, desc: '12-17kg' },
  { name: 'Pull-Up Pants M 30pcs', price: 1350, desc: 'Training pants' },
  { name: 'Baby Bottle 250ml', price: 650, desc: 'Anti-colic design' },
  { name: 'Baby Pacifier', price: 350, desc: 'Orthodontic shape' },
  { name: 'Teething Gel 10g', price: 450, desc: 'Soothes gums' },
  { name: 'Gripe Water 150ml', price: 350, desc: 'Relieves colic' },
];

const vitaminProducts = [
  { name: 'Multivitamin 60 tablets', price: 1250, desc: 'Complete daily nutrition' },
  { name: 'Vitamin C 1000mg 60 tablets', price: 850, desc: 'Immune support' },
  { name: 'Vitamin D3 1000IU 60 softgels', price: 750, desc: 'Bone health' },
  { name: 'Vitamin E 400IU 60 softgels', price: 950, desc: 'Antioxidant' },
  { name: 'Vitamin B Complex 60 tablets', price: 850, desc: 'Energy support' },
  { name: 'Vitamin B12 1000mcg 60 tablets', price: 750, desc: 'Nervous system health' },
  { name: 'Iron 65mg 60 tablets', price: 550, desc: 'Prevents anemia' },
  { name: 'Calcium 600mg 60 tablets', price: 650, desc: 'Strong bones' },
  { name: 'Calcium + Vitamin D 60 tablets', price: 850, desc: 'Bone health combo' },
  { name: 'Zinc 50mg 60 tablets', price: 650, desc: 'Immune support' },
  { name: 'Magnesium 400mg 60 tablets', price: 750, desc: 'Muscle relaxation' },
  { name: 'Omega-3 Fish Oil 60 softgels', price: 1250, desc: 'Heart health' },
  { name: 'Omega-3 1000mg 90 softgels', price: 1650, desc: 'High potency' },
  { name: 'Cod Liver Oil 60 softgels', price: 950, desc: 'Traditional supplement' },
  { name: 'Flaxseed Oil 60 softgels', price: 850, desc: 'Plant-based omega' },
  { name: 'Biotin 5000mcg 60 tablets', price: 950, desc: 'Hair, skin, nails' },
  { name: 'Collagen 500mg 60 tablets', price: 1450, desc: 'Skin elasticity' },
  { name: 'CoQ10 100mg 30 softgels', price: 1650, desc: 'Heart and energy' },
  { name: 'Probiotics 30 capsules', price: 1250, desc: 'Digestive health' },
  { name: 'Prebiotics Fiber 30 sachets', price: 950, desc: 'Gut health' },
  { name: 'Glucosamine 500mg 60 tablets', price: 1350, desc: 'Joint health' },
  { name: 'Chondroitin 400mg 60 tablets', price: 1450, desc: 'Joint support' },
  { name: 'Turmeric Curcumin 60 capsules', price: 1150, desc: 'Anti-inflammatory' },
  { name: 'Ginkgo Biloba 60 tablets', price: 950, desc: 'Memory support' },
  { name: 'Ashwagandha 60 capsules', price: 850, desc: 'Stress relief' },
  { name: 'Melatonin 3mg 60 tablets', price: 650, desc: 'Sleep support' },
  { name: 'Protein Powder 1kg', price: 3500, desc: 'Muscle building' },
  { name: 'Whey Protein 2kg', price: 6500, desc: 'Premium protein' },
  { name: 'Weight Gainer 3kg', price: 4500, desc: 'Mass building' },
  { name: 'Pre-Workout 300g', price: 2500, desc: 'Energy boost' },
  { name: 'BCAA 300g', price: 2200, desc: 'Amino acids' },
  { name: 'Creatine 300g', price: 1850, desc: 'Strength building' },
];

const medicineProducts = [
  { name: 'Paracetamol 500mg 100 tablets', price: 150, desc: 'Pain relief' },
  { name: 'Ibuprofen 400mg 30 tablets', price: 250, desc: 'Anti-inflammatory' },
  { name: 'Aspirin 75mg 100 tablets', price: 180, desc: 'Blood thinner' },
  { name: 'Antacid Tablets 30pcs', price: 220, desc: 'Heartburn relief' },
  { name: 'Omeprazole 20mg 14 capsules', price: 350, desc: 'Acid reducer' },
  { name: 'Loperamide 2mg 10 capsules', price: 180, desc: 'Anti-diarrheal' },
  { name: 'ORS Sachets 10pcs', price: 150, desc: 'Oral rehydration' },
  { name: 'Cough Syrup 100ml', price: 250, desc: 'Cough relief' },
  { name: 'Cold & Flu Tablets 10pcs', price: 180, desc: 'Multi-symptom relief' },
  { name: 'Nasal Spray 15ml', price: 350, desc: 'Decongestion' },
  { name: 'Throat Lozenges 24pcs', price: 180, desc: 'Sore throat relief' },
  { name: 'Antihistamine Tablets 10pcs', price: 220, desc: 'Allergy relief' },
  { name: 'Eye Drops 10ml', price: 280, desc: 'Eye relief' },
  { name: 'Ear Drops 10ml', price: 320, desc: 'Ear care' },
  { name: 'Antiseptic Cream 20g', price: 180, desc: 'Wound care' },
  { name: 'Bandages 10pcs', price: 150, desc: 'First aid' },
  { name: 'Cotton Balls 100pcs', price: 120, desc: 'Medical cotton' },
  { name: 'Gauze Pads 10pcs', price: 150, desc: 'Wound dressing' },
  { name: 'Medical Tape 2.5cm', price: 120, desc: 'Securing dressings' },
  { name: 'Thermometer Digital', price: 550, desc: 'Temperature check' },
  { name: 'Blood Pressure Monitor', price: 3500, desc: 'BP monitoring' },
  { name: 'Glucometer', price: 2500, desc: 'Blood sugar monitor' },
  { name: 'Glucose Test Strips 50pcs', price: 1500, desc: 'Diabetes testing' },
  { name: 'Pulse Oximeter', price: 1850, desc: 'Oxygen level monitor' },
  { name: 'Face Masks 50pcs', price: 350, desc: '3-ply protection' },
  { name: 'N95 Masks 10pcs', price: 550, desc: 'High protection' },
  { name: 'Hand Sanitizer 500ml', price: 450, desc: 'Antibacterial' },
  { name: 'Rubbing Alcohol 500ml', price: 250, desc: 'Disinfectant' },
  { name: 'Hydrogen Peroxide 100ml', price: 120, desc: 'Antiseptic' },
  { name: 'First Aid Kit', price: 1250, desc: 'Complete emergency kit' },
];

function generateProducts(): SeedProductData[] {
  const allProducts: SeedProductData[] = [];
  let productId = 1;

  const categories = [
    { products: skinCareProducts, slug: 'skin-care', count: 200 },
    { products: hairCareProducts, slug: 'hair-care', count: 150 },
    { products: makeupProducts, slug: 'makeup', count: 150 },
    { products: fragranceProducts, slug: 'fragrance', count: 80 },
    { products: sunscreenProducts, slug: 'sunscreen', count: 80 },
    { products: babyProducts, slug: 'baby', count: 150 },
    { products: vitaminProducts, slug: 'vitamins', count: 150 },
    { products: medicineProducts, slug: 'medicines', count: 140 },
  ];

  const sizes = ['25ml', '30ml', '50ml', '75ml', '100ml', '150ml', '200ml', '250ml', '300ml', '400ml', '500ml'];
  const tabletCounts = ['30', '60', '90', '100', '120', '180'];
  const weights = ['50g', '100g', '150g', '200g', '250g', '400g', '500g', '800g', '1kg'];

  for (const category of categories) {
    let count = 0;
    while (count < category.count) {
      for (const product of category.products) {
        if (count >= category.count) break;
        
        const brandIndex = Math.floor(Math.random() * pharmacyBrands.length);
        const brand = pharmacyBrands[brandIndex];
        const brandSlug = brand.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
        
        let size = '';
        if (category.slug === 'vitamins' || category.slug === 'medicines') {
          size = tabletCounts[Math.floor(Math.random() * tabletCounts.length)] + ' tablets';
        } else if (category.slug === 'baby' && product.name.includes('Formula')) {
          size = weights[Math.floor(Math.random() * weights.length)];
        } else {
          size = sizes[Math.floor(Math.random() * sizes.length)];
        }
        
        const variation = Math.floor(Math.random() * 3);
        let variantName = product.name;
        if (variation === 1) variantName = product.name + ' Plus';
        if (variation === 2) variantName = product.name + ' Pro';
        
        const fullName = `${brand} ${variantName}`;
        const slug = `${brandSlug}-${variantName.toLowerCase().replace(/\s+/g, '-')}-${productId}`;
        
        const priceVariation = 0.8 + Math.random() * 0.4;
        const price = Math.round(product.price * priceVariation);
        const hasDiscount = Math.random() > 0.7;
        const comparePrice = hasDiscount ? Math.round(price * (1.15 + Math.random() * 0.2)) : null;
        
        const isFeatured = Math.random() > 0.9;
        const stock = Math.floor(Math.random() * 200) + 10;
        
        allProducts.push({
          name: fullName,
          slug,
          description: `${fullName} - ${product.desc}. High quality product from ${brand}. ${size}.`,
          price,
          comparePrice,
          images: [],
          categorySlug: category.slug,
          brandSlug: brandSlug || 'generic',
          stock,
          isFeatured,
          isActive: true,
          sku: `SKU-${category.slug.toUpperCase().slice(0, 3)}-${productId}`,
          tags: [category.slug.replace('-', ' '), brand],
        });
        
        productId++;
        count++;
      }
    }
  }

  return allProducts;
}

export const extendedProducts = generateProducts();
export const extendedBrands = pharmacyBrands.map(name => ({
  name,
  slug: name.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-'),
  description: `Quality products from ${name}`,
}));
