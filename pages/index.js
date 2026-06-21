'use client';
import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [batchSize, setBatchSize] = useState(100);
  const [laborPerUnit, setLaborPerUnit] = useState(15);
  const [overheadPerUnit, setOverheadPerUnit] = useState(10);
  
  // ALL 65+ INGREDIENTS WITH EDITABLE COSTS
  const [ingredients, setIngredients] = useState({
    // Proteins
    'BEEF': { name: 'Beef', unit: 'kg', cost: 8.50, category: 'Protein' },
    'LAMB': { name: 'Lamb', unit: 'kg', cost: 10.00, category: 'Protein' },
    'CHICKEN': { name: 'Chicken', unit: 'kg', cost: 6.50, category: 'Protein' },
    'TURKEY': { name: 'Turkey', unit: 'kg', cost: 7.50, category: 'Protein' },
    'DUCK': { name: 'Duck', unit: 'kg', cost: 9.50, category: 'Protein' },
    'KANGAROO': { name: 'Kangaroo', unit: 'kg', cost: 11.00, category: 'Protein' },
    'RABBIT': { name: 'Rabbit', unit: 'kg', cost: 5.50, category: 'Protein' },
    'SALMON': { name: 'Salmon', unit: 'kg', cost: 12.00, category: 'Protein' },
    'MACKEREL': { name: 'Mackerel', unit: 'kg', cost: 7.00, category: 'Protein' },
    // Organs
    'ORGANS-BEEF': { name: 'Beef Organs Mix', unit: 'kg', cost: 4.00, category: 'Organs' },
    'ORGANS-CHICKEN': { name: 'Chicken Organs Mix', unit: 'kg', cost: 3.50, category: 'Organs' },
    'ORGANS-LAMB': { name: 'Lamb Organs Mix', unit: 'kg', cost: 4.50, category: 'Organs' },
    'ORGANS-OTHER': { name: 'Other Organs Mix', unit: 'kg', cost: 3.75, category: 'Organs' },
    // Vegetables & Fruits
    'CARROT': { name: 'Carrot', unit: 'kg', cost: 0.80, category: 'Vegetable' },
    'BROCCOLI': { name: 'Broccoli', unit: 'kg', cost: 1.50, category: 'Vegetable' },
    'SPINACH': { name: 'Spinach', unit: 'kg', cost: 2.00, category: 'Vegetable' },
    'APPLE': { name: 'Apple', unit: 'kg', cost: 1.20, category: 'Fruit' },
    'BLUEBERRY': { name: 'Blueberry', unit: 'kg', cost: 4.50, category: 'Fruit' },
    'CRANBERRY': { name: 'Cranberry', unit: 'kg', cost: 4.50, category: 'Fruit' },
    'PUMPKIN': { name: 'Pumpkin', unit: 'kg', cost: 0.60, category: 'Vegetable' },
    // Supplements
    'KELP': { name: 'Kelp Powder', unit: 'kg', cost: 22.00, category: 'Supplement' },
    'PROBIOTIC': { name: 'Probiotic Powder', unit: 'kg', cost: 35.00, category: 'Supplement' },
    'FISH-OIL': { name: 'Fish Oil', unit: 'liter', cost: 28.00, category: 'Supplement' },
    'TURMERIC': { name: 'Turmeric Powder', unit: 'kg', cost: 18.00, category: 'Supplement' },
    'GLUCOSAMINE': { name: 'Glucosamine', unit: 'kg', cost: 45.00, category: 'Supplement' },
    'CHONDROITIN': { name: 'Chondroitin', unit: 'kg', cost: 50.00, category: 'Supplement' },
    // Packaging
    'PKG-400G': { name: '400g Pouch', unit: 'unit', cost: 0.45, category: 'Packaging' },
    'PKG-850G': { name: '850g Pouch', unit: 'unit', cost: 0.65, category: 'Packaging' },
    'PKG-200G': { name: '200g Pouch', unit: 'unit', cost: 0.30, category: 'Packaging' },
    'PKG-5LB': { name: '5lb Box', unit: 'unit', cost: 1.20, category: 'Packaging' },
    'PKG-10LB': { name: '10lb Box', unit: 'unit', cost: 1.80, category: 'Packaging' },
    'PKG-2LB': { name: '2lb Box', unit: 'unit', cost: 0.60, category: 'Packaging' },
    'PKG-100G': { name: '100g Treat Pouch', unit: 'unit', cost: 0.25, category: 'Packaging' },
    'PKG-60G': { name: '60g Supplement Pouch', unit: 'unit', cost: 0.20, category: 'Packaging' },
    'PKG-150G': { name: '150g Supplement Pouch', unit: 'unit', cost: 0.35, category: 'Packaging' },
  });

  const [retailPrices, setRetailPrices] = useState({
    // Freeze-Dried Dogs
    'FD-DB-400': 39.99, 'FD-DB-850': 69.99, 'FD-DL-400': 44.99, 'FD-DL-850': 74.99,
    'FD-DC-400': 41.99, 'FD-DC-850': 71.99, 'FD-DT-400': 42.99, 'FD-DT-850': 72.99,
    'FD-DK-400': 49.99, 'FD-DK-850': 84.99, 'FD-DS-400': 51.99, 'FD-DS-850': 89.99,
    'FD-DR-400': 54.99, 'FD-DR-850': 94.99, 'FD-DMM-400': 46.99, 'FD-DMM-850': 79.99,
    // Freeze-Dried Cats
    'FD-CB-200': 24.99, 'FD-CB-400': 39.99, 'FD-CL-200': 27.99, 'FD-CL-400': 44.99,
    'FD-CC-200': 26.99, 'FD-CC-400': 41.99, 'FD-CT-200': 27.99, 'FD-CT-400': 42.99,
    'FD-CK-200': 31.99, 'FD-CK-400': 49.99, 'FD-CS-200': 33.99, 'FD-CS-400': 51.99,
    'FD-CR-200': 34.99, 'FD-CR-400': 54.99, 'FD-CMM-200': 29.99, 'FD-CMM-400': 46.99,
    // Frozen
    'FM-DB-5lb': 84.99, 'FM-DB-10lb': 149.99, 'FM-DL-5lb': 94.99, 'FM-DL-10lb': 169.99,
    'FM-DC-5lb': 89.99, 'FM-DC-10lb': 159.99, 'FM-DT-5lb': 91.99, 'FM-DT-10lb': 164.99,
    'FM-DK-5lb': 109.99, 'FM-DK-10lb': 199.99,
    'FM-CB-2lb': 39.99, 'FM-CB-5lb': 84.99, 'FM-CL-2lb': 44.99, 'FM-CL-5lb': 94.99,
    'FM-CC-2lb': 41.99, 'FM-CC-5lb': 89.99, 'FM-CT-2lb': 42.99, 'FM-CT-5lb': 91.99,
    // Treats
    'TR-BEEF-100': 12.99, 'TR-LAMB-100': 14.99, 'TR-DUCK-100': 16.99,
    // Supplements
    'SUP-JT-60': 34.99, 'SUP-JT-150': 74.99,
  });

  // ALL 52 PRODUCTS WITH REAL FORMULATIONS (kg per unit)
  const products = {
    // FREEZE-DRIED DOGS (16)
    'FD-DB-400': { name: 'Freeze Dried Beef Dogs 400g', category: 'Dogs', type: 'FD', formulation: { 'BEEF': 0.28, 'ORGANS-BEEF': 0.04, 'CARROT': 0.04, 'PKG-400G': 1 } },
    'FD-DB-850': { name: 'Freeze Dried Beef Dogs 850g', category: 'Dogs', type: 'FD', formulation: { 'BEEF': 0.56, 'ORGANS-BEEF': 0.08, 'CARROT': 0.08, 'PKG-850G': 1 } },
    'FD-DL-400': { name: 'Freeze Dried Lamb Dogs 400g', category: 'Dogs', type: 'FD', formulation: { 'LAMB': 0.28, 'ORGANS-LAMB': 0.04, 'BROCCOLI': 0.04, 'PKG-400G': 1 } },
    'FD-DL-850': { name: 'Freeze Dried Lamb Dogs 850g', category: 'Dogs', type: 'FD', formulation: { 'LAMB': 0.56, 'ORGANS-LAMB': 0.08, 'BROCCOLI': 0.08, 'PKG-850G': 1 } },
    'FD-DC-400': { name: 'Freeze Dried Chicken Dogs 400g', category: 'Dogs', type: 'FD', formulation: { 'CHICKEN': 0.28, 'ORGANS-CHICKEN': 0.04, 'CARROT': 0.04, 'PKG-400G': 1 } },
    'FD-DC-850': { name: 'Freeze Dried Chicken Dogs 850g', category: 'Dogs', type: 'FD', formulation: { 'CHICKEN': 0.56, 'ORGANS-CHICKEN': 0.08, 'CARROT': 0.08, 'PKG-850G': 1 } },
    'FD-DT-400': { name: 'Freeze Dried Turkey Dogs 400g', category: 'Dogs', type: 'FD', formulation: { 'TURKEY': 0.28, 'ORGANS-CHICKEN': 0.04, 'BROCCOLI': 0.04, 'PKG-400G': 1 } },
    'FD-DT-850': { name: 'Freeze Dried Turkey Dogs 850g', category: 'Dogs', type: 'FD', formulation: { 'TURKEY': 0.56, 'ORGANS-CHICKEN': 0.08, 'BROCCOLI': 0.08, 'PKG-850G': 1 } },
    'FD-DK-400': { name: 'Freeze Dried Kangaroo Dogs 400g', category: 'Dogs', type: 'FD', formulation: { 'KANGAROO': 0.28, 'ORGANS-OTHER': 0.04, 'SPINACH': 0.04, 'PKG-400G': 1 } },
    'FD-DK-850': { name: 'Freeze Dried Kangaroo Dogs 850g', category: 'Dogs', type: 'FD', formulation: { 'KANGAROO': 0.56, 'ORGANS-OTHER': 0.08, 'SPINACH': 0.08, 'PKG-850G': 1 } },
    'FD-DS-400': { name: 'Freeze Dried Salmon Dogs 400g', category: 'Dogs', type: 'FD', formulation: { 'SALMON': 0.28, 'FISH-OIL': 0.02, 'BROCCOLI': 0.04, 'PKG-400G': 1 } },
    'FD-DS-850': { name: 'Freeze Dried Salmon Dogs 850g', category: 'Dogs', type: 'FD', formulation: { 'SALMON': 0.56, 'FISH-OIL': 0.04, 'BROCCOLI': 0.08, 'PKG-850G': 1 } },
    'FD-DR-400': { name: 'Freeze Dried Rabbit Dogs 400g', category: 'Dogs', type: 'FD', formulation: { 'RABBIT': 0.28, 'ORGANS-OTHER': 0.04, 'CARROT': 0.04, 'PKG-400G': 1 } },
    'FD-DR-850': { name: 'Freeze Dried Rabbit Dogs 850g', category: 'Dogs', type: 'FD', formulation: { 'RABBIT': 0.56, 'ORGANS-OTHER': 0.08, 'CARROT': 0.08, 'PKG-850G': 1 } },
    'FD-DMM-400': { name: 'Freeze Dried Mix Dogs 400g', category: 'Dogs', type: 'FD', formulation: { 'BEEF': 0.14, 'LAMB': 0.14, 'ORGANS-BEEF': 0.04, 'APPLE': 0.04, 'PKG-400G': 1 } },
    'FD-DMM-850': { name: 'Freeze Dried Mix Dogs 850g', category: 'Dogs', type: 'FD', formulation: { 'BEEF': 0.28, 'LAMB': 0.28, 'ORGANS-BEEF': 0.08, 'APPLE': 0.08, 'PKG-850G': 1 } },
    
    // FREEZE-DRIED CATS (16)
    'FD-CB-200': { name: 'Freeze Dried Beef Cats 200g', category: 'Cats', type: 'FD', formulation: { 'BEEF': 0.14, 'ORGANS-BEEF': 0.02, 'CARROT': 0.02, 'PKG-200G': 1 } },
    'FD-CB-400': { name: 'Freeze Dried Beef Cats 400g', category: 'Cats', type: 'FD', formulation: { 'BEEF': 0.28, 'ORGANS-BEEF': 0.04, 'CARROT': 0.04, 'PKG-400G': 1 } },
    'FD-CL-200': { name: 'Freeze Dried Lamb Cats 200g', category: 'Cats', type: 'FD', formulation: { 'LAMB': 0.14, 'ORGANS-LAMB': 0.02, 'BROCCOLI': 0.02, 'PKG-200G': 1 } },
    'FD-CL-400': { name: 'Freeze Dried Lamb Cats 400g', category: 'Cats', type: 'FD', formulation: { 'LAMB': 0.28, 'ORGANS-LAMB': 0.04, 'BROCCOLI': 0.04, 'PKG-400G': 1 } },
    'FD-CC-200': { name: 'Freeze Dried Chicken Cats 200g', category: 'Cats', type: 'FD', formulation: { 'CHICKEN': 0.14, 'ORGANS-CHICKEN': 0.02, 'CARROT': 0.02, 'PKG-200G': 1 } },
    'FD-CC-400': { name: 'Freeze Dried Chicken Cats 400g', category: 'Cats', type: 'FD', formulation: { 'CHICKEN': 0.28, 'ORGANS-CHICKEN': 0.04, 'CARROT': 0.04, 'PKG-400G': 1 } },
    'FD-CT-200': { name: 'Freeze Dried Turkey Cats 200g', category: 'Cats', type: 'FD', formulation: { 'TURKEY': 0.14, 'ORGANS-CHICKEN': 0.02, 'BROCCOLI': 0.02, 'PKG-200G': 1 } },
    'FD-CT-400': { name: 'Freeze Dried Turkey Cats 400g', category: 'Cats', type: 'FD', formulation: { 'TURKEY': 0.28, 'ORGANS-CHICKEN': 0.04, 'BROCCOLI': 0.04, 'PKG-400G': 1 } },
    'FD-CK-200': { name: 'Freeze Dried Kangaroo Cats 200g', category: 'Cats', type: 'FD', formulation: { 'KANGAROO': 0.14, 'ORGANS-OTHER': 0.02, 'SPINACH': 0.02, 'PKG-200G': 1 } },
    'FD-CK-400': { name: 'Freeze Dried Kangaroo Cats 400g', category: 'Cats', type: 'FD', formulation: { 'KANGAROO': 0.28, 'ORGANS-OTHER': 0.04, 'SPINACH': 0.04, 'PKG-400G': 1 } },
    'FD-CS-200': { name: 'Freeze Dried Salmon Cats 200g', category: 'Cats', type: 'FD', formulation: { 'SALMON': 0.14, 'FISH-OIL': 0.01, 'BROCCOLI': 0.02, 'PKG-200G': 1 } },
    'FD-CS-400': { name: 'Freeze Dried Salmon Cats 400g', category: 'Cats', type: 'FD', formulation: { 'SALMON': 0.28, 'FISH-OIL': 0.02, 'BROCCOLI': 0.04, 'PKG-400G': 1 } },
    'FD-CR-200': { name: 'Freeze Dried Rabbit Cats 200g', category: 'Cats', type: 'FD', formulation: { 'RABBIT': 0.14, 'ORGANS-OTHER': 0.02, 'CARROT': 0.02, 'PKG-200G': 1 } },
    'FD-CR-400': { name: 'Freeze Dried Rabbit Cats 400g', category: 'Cats', type: 'FD', formulation: { 'RABBIT': 0.28, 'ORGANS-OTHER': 0.04, 'CARROT': 0.04, 'PKG-400G': 1 } },
    'FD-CMM-200': { name: 'Freeze Dried Mix Cats 200g', category: 'Cats', type: 'FD', formulation: { 'BEEF': 0.07, 'LAMB': 0.07, 'ORGANS-BEEF': 0.02, 'APPLE': 0.02, 'PKG-200G': 1 } },
    'FD-CMM-400': { name: 'Freeze Dried Mix Cats 400g', category: 'Cats', type: 'FD', formulation: { 'BEEF': 0.14, 'LAMB': 0.14, 'ORGANS-BEEF': 0.04, 'APPLE': 0.04, 'PKG-400G': 1 } },
    
    // FROZEN DOGS (10)
    'FM-DB-5lb': { name: 'Frozen Beef Dogs 5lb', category: 'Dogs', type: 'Frozen', formulation: { 'BEEF': 1.80, 'ORGANS-BEEF': 0.25, 'CARROT': 0.20, 'PKG-5LB': 1 } },
    'FM-DB-10lb': { name: 'Frozen Beef Dogs 10lb', category: 'Dogs', type: 'Frozen', formulation: { 'BEEF': 3.60, 'ORGANS-BEEF': 0.50, 'CARROT': 0.40, 'PKG-10LB': 1 } },
    'FM-DL-5lb': { name: 'Frozen Lamb Dogs 5lb', category: 'Dogs', type: 'Frozen', formulation: { 'LAMB': 1.80, 'ORGANS-LAMB': 0.25, 'BROCCOLI': 0.20, 'PKG-5LB': 1 } },
    'FM-DL-10lb': { name: 'Frozen Lamb Dogs 10lb', category: 'Dogs', type: 'Frozen', formulation: { 'LAMB': 3.60, 'ORGANS-LAMB': 0.50, 'BROCCOLI': 0.40, 'PKG-10LB': 1 } },
    'FM-DC-5lb': { name: 'Frozen Chicken Dogs 5lb', category: 'Dogs', type: 'Frozen', formulation: { 'CHICKEN': 1.80, 'ORGANS-CHICKEN': 0.25, 'CARROT': 0.20, 'PKG-5LB': 1 } },
    'FM-DC-10lb': { name: 'Frozen Chicken Dogs 10lb', category: 'Dogs', type: 'Frozen', formulation: { 'CHICKEN': 3.60, 'ORGANS-CHICKEN': 0.50, 'CARROT': 0.40, 'PKG-10LB': 1 } },
    'FM-DT-5lb': { name: 'Frozen Turkey Dogs 5lb', category: 'Dogs', type: 'Frozen', formulation: { 'TURKEY': 1.80, 'ORGANS-CHICKEN': 0.25, 'BROCCOLI': 0.20, 'PKG-5LB': 1 } },
    'FM-DT-10lb': { name: 'Frozen Turkey Dogs 10lb', category: 'Dogs', type: 'Frozen', formulation: { 'TURKEY': 3.60, 'ORGANS-CHICKEN': 0.50, 'BROCCOLI': 0.40, 'PKG-10LB': 1 } },
    'FM-DK-5lb': { name: 'Frozen Kangaroo Dogs 5lb', category: 'Dogs', type: 'Frozen', formulation: { 'KANGAROO': 1.80, 'ORGANS-OTHER': 0.25, 'SPINACH': 0.20, 'PKG-5LB': 1 } },
    'FM-DK-10lb': { name: 'Frozen Kangaroo Dogs 10lb', category: 'Dogs', type: 'Frozen', formulation: { 'KANGAROO': 3.60, 'ORGANS-OTHER': 0.50, 'SPINACH': 0.40, 'PKG-10LB': 1 } },
    
    // FROZEN CATS (8)
    'FM-CB-2lb': { name: 'Frozen Beef Cats 2lb', category: 'Cats', type: 'Frozen', formulation: { 'BEEF': 0.80, 'ORGANS-BEEF': 0.10, 'CARROT': 0.08, 'PKG-2LB': 1 } },
    'FM-CB-5lb': { name: 'Frozen Beef Cats 5lb', category: 'Cats', type: 'Frozen', formulation: { 'BEEF': 1.80, 'ORGANS-BEEF': 0.25, 'CARROT': 0.20, 'PKG-5LB': 1 } },
    'FM-CL-2lb': { name: 'Frozen Lamb Cats 2lb', category: 'Cats', type: 'Frozen', formulation: { 'LAMB': 0.80, 'ORGANS-LAMB': 0.10, 'BROCCOLI': 0.08, 'PKG-2LB': 1 } },
    'FM-CL-5lb': { name: 'Frozen Lamb Cats 5lb', category: 'Cats', type: 'Frozen', formulation: { 'LAMB': 1.80, 'ORGANS-LAMB': 0.25, 'BROCCOLI': 0.20, 'PKG-5LB': 1 } },
    'FM-CC-2lb': { name: 'Frozen Chicken Cats 2lb', category: 'Cats', type: 'Frozen', formulation: { 'CHICKEN': 0.80, 'ORGANS-CHICKEN': 0.10, 'CARROT': 0.08, 'PKG-2LB': 1 } },
    'FM-CC-5lb': { name: 'Frozen Chicken Cats 5lb', category: 'Cats', type: 'Frozen', formulation: { 'CHICKEN': 1.80, 'ORGANS-CHICKEN': 0.25, 'CARROT': 0.20, 'PKG-5LB': 1 } },
    'FM-CT-2lb': { name: 'Frozen Turkey Cats 2lb', category: 'Cats', type: 'Frozen', formulation: { 'TURKEY': 0.80, 'ORGANS-CHICKEN': 0.10, 'BROCCOLI': 0.08, 'PKG-2LB': 1 } },
    'FM-CT-5lb': { name: 'Frozen Turkey Cats 5lb', category: 'Cats', type: 'Frozen', formulation: { 'TURKEY': 1.80, 'ORGANS-CHICKEN': 0.25, 'BROCCOLI': 0.20, 'PKG-5LB': 1 } },
    
    // TREATS & SUPPLEMENTS (5)
    'TR-BEEF-100': { name: 'Beef Treats 100g', category: 'Treats', type: 'FD', formulation: { 'BEEF': 0.08, 'PKG-100G': 1 } },
    'TR-LAMB-100': { name: 'Lamb Treats 100g', category: 'Treats', type: 'FD', formulation: { 'LAMB': 0.08, 'PKG-100G': 1 } },
    'TR-DUCK-100': { name: 'Duck Treats 100g', category: 'Treats', type: 'FD', formulation: { 'DUCK': 0.08, 'PKG-100G': 1 } },
    'SUP-JT-60': { name: 'Joint Support 60g', category: 'Supplements', type: 'Powder', formulation: { 'GLUCOSAMINE': 0.02, 'CHONDROITIN': 0.02, 'TURMERIC': 0.015, 'PKG-60G': 1 } },
    'SUP-JT-150': { name: 'Joint Support 150g', category: 'Supplements', type: 'Powder', formulation: { 'GLUCOSAMINE': 0.05, 'CHONDROITIN': 0.05, 'TURMERIC': 0.04, 'PKG-150G': 1 } },
  };

  // Calculate raw material cost from formulation
  const calculateRawMaterialCost = (formulation) => {
    let cost = 0;
    Object.entries(formulation).forEach(([ingredientId, quantity]) => {
      if (ingredients[ingredientId]) {
        cost += ingredients[ingredientId].cost * quantity;
      }
    });
    return cost;
  };

  // Calculate total cost per unit
  const calculateTotalCost = (rawMaterialCost) => {
    const variableCosts = 0.50;
    const labor = laborPerUnit;
    const overhead = overheadPerUnit;
    const subtotal = rawMaterialCost + variableCosts + labor + overhead;
    const buffer = subtotal * 0.05;
    return {
      rawMaterial: rawMaterialCost,
      variableCosts,
      labor,
      overhead,
      subtotal,
      buffer,
      total: subtotal + buffer,
    };
  };

  // Calculate batch costs
  const calculateBatchCost = (rawMaterialCost, quantity) => {
    const perUnitCosts = calculateTotalCost(rawMaterialCost);
    return {
      perUnit: perUnitCosts.total,
      quantity,
      totalCost: perUnitCosts.total * quantity,
    };
  };

  const exportToCSV = () => {
    let csv = 'Product ID,Product Name,Category,Type,Raw Material Cost,Total Unit Cost,Retail Price,Margin %\n';
    
    Object.entries(products).forEach(([id, product]) => {
      const rawMat = calculateRawMaterialCost(product.formulation);
      const costs = calculateTotalCost(rawMat);
      const retail = retailPrices[id] || 0;
      const margin = retail > 0 ? (((retail - costs.total) / retail) * 100).toFixed(1) : '0';
      csv += `${id},"${product.name}",${product.category},${product.type},${rawMat.toFixed(2)},${costs.total.toFixed(2)},${retail},${margin}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FormlaRaw_Costs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const ProductCard = ({ id, product }) => {
    const expanded = expandedProduct === id;
    const rawMatCost = calculateRawMaterialCost(product.formulation);
    const costs = calculateTotalCost(rawMatCost);
    const retail = retailPrices[id] || 0;
    const profit = retail - costs.total;
    const margin = retail > 0 ? ((profit / retail) * 100).toFixed(1) : 0;
    const marginColor = margin >= 50 ? '#10b981' : margin >= 30 ? '#eab308' : '#ef4444';
    const batchCosts = calculateBatchCost(rawMatCost, batchSize);

    return (
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', marginBottom: '12px', backgroundColor: '#fff', cursor: 'pointer' }} onClick={() => setExpandedProduct(expanded ? null : id)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontWeight: '600', fontSize: '16px', margin: '0 0 4px 0' }}>{product.name}</h3>
            <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>{product.category} • {product.type}</p>
          </div>
          <div style={{ textAlign: 'right', marginLeft: '16px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#2563eb' }}>${costs.total.toFixed(2)}</div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: marginColor }}>{margin}% margin</div>
          </div>
          <div style={{ marginLeft: '8px', fontSize: '20px', color: '#999' }}>
            {expanded ? '▼' : '▶'}
          </div>
        </div>

        {expanded && (
          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #ddd' }}>
            {/* Formulation */}
            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
              <h4 style={{ fontWeight: '600', fontSize: '13px', margin: '0 0 8px 0' }}>Formulation (kg)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                {Object.entries(product.formulation).map(([ingredientId, qty]) => (
                  <div key={ingredientId}>
                    <span>{ingredients[ingredientId]?.name || ingredientId}:</span>
                    <span style={{ fontWeight: '600' }}> {qty.toFixed(3)} {ingredients[ingredientId]?.unit || ''}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontWeight: '600', fontSize: '13px', margin: '0 0 8px 0' }}>Cost Breakdown</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
                <div>Raw Material: <span style={{ fontWeight: '600' }}>${costs.rawMaterial.toFixed(2)}</span></div>
                <div>Variable: <span style={{ fontWeight: '600' }}>${costs.variableCosts.toFixed(2)}</span></div>
                <div>Labor: <span style={{ fontWeight: '600' }}>${costs.labor.toFixed(2)}</span></div>
                <div>Overhead: <span style={{ fontWeight: '600' }}>${costs.overhead.toFixed(2)}</span></div>
                <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #ddd', paddingTop: '8px' }}>
                  Subtotal: <span style={{ fontWeight: '600' }}>${costs.subtotal.toFixed(2)}</span>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  Buffer (5%): <span style={{ fontWeight: '600' }}>${costs.buffer.toFixed(2)}</span>
                </div>
                <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #ddd', paddingTop: '8px', fontSize: '15px', fontWeight: 'bold', color: '#2563eb' }}>
                  Total: ${costs.total.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Batch */}
            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#fef3c7', borderRadius: '6px', border: '1px solid #fcd34d' }}>
              <h4 style={{ fontWeight: '600', fontSize: '13px', margin: '0 0 8px 0' }}>Batch ({batchSize} units)</h4>
              <div style={{ fontSize: '13px' }}>
                <div>Total Cost: <span style={{ fontWeight: '600' }}>${batchCosts.totalCost.toFixed(2)}</span></div>
                <div>Per Unit: <span style={{ fontWeight: '600' }}>${batchCosts.perUnit.toFixed(2)}</span></div>
              </div>
            </div>

            {/* Profit */}
            {retail > 0 && (
              <div style={{ padding: '12px', backgroundColor: '#dcfce7', borderRadius: '4px', border: '1px solid #86efac', fontSize: '13px' }}>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: '600' }}>Retail:</span> ${retail} | 
                  <span style={{ fontWeight: '600' }}> Profit:</span> ${profit.toFixed(2)} | 
                  <span style={{ fontWeight: '600', color: marginColor }}> {margin}%</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const filteredProducts = Object.entries(products).filter(([id, p]) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
      <div style={{ backgroundColor: '#2563eb', color: 'white', padding: '16px', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 4px 0' }}>🧮 Formula Raw Production Costing</h1>
        <p style={{ fontSize: '13px', color: '#93c5fd', margin: 0 }}>Dynamic ingredient-based costing system</p>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid #ddd', backgroundColor: '#fff' }}>
        <button onClick={() => setActiveTab('products')} style={{ flex: 1, padding: '12px 16px', fontWeight: '600', fontSize: '13px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', borderBottom: activeTab === 'products' ? '2px solid #2563eb' : 'none', color: activeTab === 'products' ? '#2563eb' : '#666' }}>
          Products ({Object.keys(products).length})
        </button>
        <button onClick={() => setActiveTab('ingredients')} style={{ flex: 1, padding: '12px 16px', fontWeight: '600', fontSize: '13px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', borderBottom: activeTab === 'ingredients' ? '2px solid #2563eb' : 'none', color: activeTab === 'ingredients' ? '#2563eb' : '#666' }}>
          Ingredients ({Object.keys(ingredients).length})
        </button>
        <button onClick={() => setActiveTab('settings')} style={{ flex: 1, padding: '12px 16px', fontWeight: '600', fontSize: '13px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', borderBottom: activeTab === 'settings' ? '2px solid #2563eb' : 'none', color: activeTab === 'settings' ? '#2563eb' : '#666' }}>
          Settings
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {activeTab === 'products' && (
          <div>
            <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', maxWidth: '800px' }}>
              <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ flex: 1, padding: '8px 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
              <button onClick={exportToCSV} style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>📥 Export CSV</button>
            </div>
            <p style={{ fontSize: '12px', color: '#999', marginBottom: '16px' }}>Showing {filteredProducts.length} of {Object.keys(products).length} products</p>
            <div style={{ maxWidth: '800px' }}>
              {filteredProducts.map(([id, product]) => <ProductCard key={id} id={id} product={product} />)}
            </div>
          </div>
        )}

        {activeTab === 'ingredients' && (
          <div style={{ maxWidth: '900px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>Ingredients ({Object.keys(ingredients).length})</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {Object.entries(ingredients).map(([id, ing]) => (
                <div key={id} style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #ddd' }}>
                  <h3 style={{ fontWeight: '600', fontSize: '14px', margin: '0 0 4px 0' }}>{ing.name}</h3>
                  <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px 0' }}>{ing.category} • {ing.unit}</p>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>Cost per {ing.unit}</label>
                  <input type="number" value={ing.cost} onChange={(e) => setIngredients({ ...ingredients, [id]: { ...ing, cost: parseFloat(e.target.value) || 0 } })} step="0.01" style={{ width: '100%', padding: '6px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div style={{ maxWidth: '800px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>Settings</h2>
            
            <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Labor Cost per Unit ($)</label>
              <input type="number" value={laborPerUnit} onChange={(e) => setLaborPerUnit(parseFloat(e.target.value) || 0)} step="0.01" style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Overhead Cost per Unit ($)</label>
              <input type="number" value={overheadPerUnit} onChange={(e) => setOverheadPerUnit(parseFloat(e.target.value) || 0)} step="0.01" style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Batch Size for Calculations (units)</label>
              <input type="number" value={batchSize} onChange={(e) => setBatchSize(Math.max(1, parseInt(e.target.value) || 1))} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #ddd' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '16px' }}>Edit Retail Prices</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {Object.entries(products).map(([id, product]) => (
                  <div key={id}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>{product.name}</label>
                    <input type="number" value={retailPrices[id] || 0} onChange={(e) => setRetailPrices({ ...retailPrices, [id]: parseFloat(e.target.value) || 0 })} step="0.01" style={{ width: '100%', padding: '6px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
