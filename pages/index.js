'use client';
import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [laborPerUnit, setLaborPerUnit] = useState(15);
  const [overheadPerUnit, setOverheadPerUnit] = useState(10);
  const [batchSize, setBatchSize] = useState(100);
  const [retailPrices, setRetailPrices] = useState({
    'FD-DB-400': 39.99, 'FD-DB-850': 69.99, 'FD-DL-400': 44.99, 'FD-DL-850': 74.99,
    'FD-DC-400': 41.99, 'FD-DC-850': 71.99, 'FD-DT-400': 42.99, 'FD-DT-850': 72.99,
    'FD-DK-400': 49.99, 'FD-DK-850': 84.99, 'FD-DS-400': 51.99, 'FD-DS-850': 89.99,
    'FD-DR-400': 54.99, 'FD-DR-850': 94.99, 'FD-DMM-400': 46.99, 'FD-DMM-850': 79.99,
    'FD-CB-200': 24.99, 'FD-CB-400': 39.99, 'FD-CL-200': 27.99, 'FD-CL-400': 44.99,
    'FD-CC-200': 26.99, 'FD-CC-400': 41.99, 'FD-CT-200': 27.99, 'FD-CT-400': 42.99,
    'FD-CK-200': 31.99, 'FD-CK-400': 49.99, 'FD-CS-200': 33.99, 'FD-CS-400': 51.99,
    'FD-CR-200': 34.99, 'FD-CR-400': 54.99, 'FD-CMM-200': 29.99, 'FD-CMM-400': 46.99,
    'FM-DB-5lb': 84.99, 'FM-DB-10lb': 149.99, 'FM-DL-5lb': 94.99, 'FM-DL-10lb': 169.99,
    'FM-DC-5lb': 89.99, 'FM-DC-10lb': 159.99, 'FM-DT-5lb': 91.99, 'FM-DT-10lb': 164.99,
    'FM-DK-5lb': 109.99, 'FM-DK-10lb': 199.99,
    'FM-CB-2lb': 39.99, 'FM-CB-5lb': 84.99, 'FM-CL-2lb': 44.99, 'FM-CL-5lb': 94.99,
    'FM-CC-2lb': 41.99, 'FM-CC-5lb': 89.99, 'FM-CT-2lb': 42.99, 'FM-CT-5lb': 91.99,
    'TR-BEEF-100': 12.99, 'TR-LAMB-100': 14.99, 'TR-DUCK-100': 16.99,
    'SUP-JT-60': 34.99, 'SUP-JT-150': 74.99,
  });

  const products = {
    // FREEZE-DRIED DOGS (16)
    'FD-DB-400': { name: 'Freeze Dried Beef Dogs 400g', category: 'Dogs', type: 'Freeze-Dried', cost: 8.50, formulation: { 'Beef': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    'FD-DB-850': { name: 'Freeze Dried Beef Dogs 850g', category: 'Dogs', type: 'Freeze-Dried', cost: 17.00, formulation: { 'Beef': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    'FD-DL-400': { name: 'Freeze Dried Lamb Dogs 400g', category: 'Dogs', type: 'Freeze-Dried', cost: 9.20, formulation: { 'Lamb': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    'FD-DL-850': { name: 'Freeze Dried Lamb Dogs 850g', category: 'Dogs', type: 'Freeze-Dried', cost: 18.40, formulation: { 'Lamb': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    'FD-DC-400': { name: 'Freeze Dried Chicken Dogs 400g', category: 'Dogs', type: 'Freeze-Dried', cost: 8.75, formulation: { 'Chicken': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    'FD-DC-850': { name: 'Freeze Dried Chicken Dogs 850g', category: 'Dogs', type: 'Freeze-Dried', cost: 17.50, formulation: { 'Chicken': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    'FD-DT-400': { name: 'Freeze Dried Turkey Dogs 400g', category: 'Dogs', type: 'Freeze-Dried', cost: 8.90, formulation: { 'Turkey': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    'FD-DT-850': { name: 'Freeze Dried Turkey Dogs 850g', category: 'Dogs', type: 'Freeze-Dried', cost: 17.80, formulation: { 'Turkey': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    'FD-DK-400': { name: 'Freeze Dried Kangaroo Dogs 400g', category: 'Dogs', type: 'Freeze-Dried', cost: 10.20, formulation: { 'Kangaroo': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    'FD-DK-850': { name: 'Freeze Dried Kangaroo Dogs 850g', category: 'Dogs', type: 'Freeze-Dried', cost: 20.40, formulation: { 'Kangaroo': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    'FD-DS-400': { name: 'Freeze Dried Salmon Dogs 400g', category: 'Dogs', type: 'Freeze-Dried', cost: 10.75, formulation: { 'Salmon': 0.35, 'Fish Oil': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    'FD-DS-850': { name: 'Freeze Dried Salmon Dogs 850g', category: 'Dogs', type: 'Freeze-Dried', cost: 21.50, formulation: { 'Salmon': 0.35, 'Fish Oil': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    'FD-DR-400': { name: 'Freeze Dried Rabbit Dogs 400g', category: 'Dogs', type: 'Freeze-Dried', cost: 11.20, formulation: { 'Rabbit': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    'FD-DR-850': { name: 'Freeze Dried Rabbit Dogs 850g', category: 'Dogs', type: 'Freeze-Dried', cost: 22.40, formulation: { 'Rabbit': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    'FD-DMM-400': { name: 'Freeze Dried Mix Dogs 400g', category: 'Dogs', type: 'Freeze-Dried', cost: 9.50, formulation: { 'Mixed Meats': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    'FD-DMM-850': { name: 'Freeze Dried Mix Dogs 850g', category: 'Dogs', type: 'Freeze-Dried', cost: 19.00, formulation: { 'Mixed Meats': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    
    // FREEZE-DRIED CATS (16)
    'FD-CB-200': { name: 'Freeze Dried Beef Cats 200g', category: 'Cats', type: 'Freeze-Dried', cost: 5.50, formulation: { 'Beef': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    'FD-CB-400': { name: 'Freeze Dried Beef Cats 400g', category: 'Cats', type: 'Freeze-Dried', cost: 8.50, formulation: { 'Beef': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    'FD-CL-200': { name: 'Freeze Dried Lamb Cats 200g', category: 'Cats', type: 'Freeze-Dried', cost: 6.00, formulation: { 'Lamb': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    'FD-CL-400': { name: 'Freeze Dried Lamb Cats 400g', category: 'Cats', type: 'Freeze-Dried', cost: 9.20, formulation: { 'Lamb': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    'FD-CC-200': { name: 'Freeze Dried Chicken Cats 200g', category: 'Cats', type: 'Freeze-Dried', cost: 5.70, formulation: { 'Chicken': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    'FD-CC-400': { name: 'Freeze Dried Chicken Cats 400g', category: 'Cats', type: 'Freeze-Dried', cost: 8.75, formulation: { 'Chicken': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    'FD-CT-200': { name: 'Freeze Dried Turkey Cats 200g', category: 'Cats', type: 'Freeze-Dried', cost: 5.80, formulation: { 'Turkey': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    'FD-CT-400': { name: 'Freeze Dried Turkey Cats 400g', category: 'Cats', type: 'Freeze-Dried', cost: 8.90, formulation: { 'Turkey': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    'FD-CK-200': { name: 'Freeze Dried Kangaroo Cats 200g', category: 'Cats', type: 'Freeze-Dried', cost: 6.65, formulation: { 'Kangaroo': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    'FD-CK-400': { name: 'Freeze Dried Kangaroo Cats 400g', category: 'Cats', type: 'Freeze-Dried', cost: 10.20, formulation: { 'Kangaroo': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    'FD-CS-200': { name: 'Freeze Dried Salmon Cats 200g', category: 'Cats', type: 'Freeze-Dried', cost: 7.00, formulation: { 'Salmon': 0.35, 'Fish Oil': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    'FD-CS-400': { name: 'Freeze Dried Salmon Cats 400g', category: 'Cats', type: 'Freeze-Dried', cost: 10.75, formulation: { 'Salmon': 0.35, 'Fish Oil': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    'FD-CR-200': { name: 'Freeze Dried Rabbit Cats 200g', category: 'Cats', type: 'Freeze-Dried', cost: 7.30, formulation: { 'Rabbit': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    'FD-CR-400': { name: 'Freeze Dried Rabbit Cats 400g', category: 'Cats', type: 'Freeze-Dried', cost: 11.20, formulation: { 'Rabbit': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    'FD-CMM-200': { name: 'Freeze Dried Mix Cats 200g', category: 'Cats', type: 'Freeze-Dried', cost: 6.20, formulation: { 'Mixed Meats': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    'FD-CMM-400': { name: 'Freeze Dried Mix Cats 400g', category: 'Cats', type: 'Freeze-Dried', cost: 9.50, formulation: { 'Mixed Meats': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
    
    // FROZEN DOGS (10)
    'FM-DB-5lb': { name: 'Frozen Beef Dogs 5lb', category: 'Dogs', type: 'Frozen', cost: 45.00, formulation: { 'Beef': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
    'FM-DB-10lb': { name: 'Frozen Beef Dogs 10lb', category: 'Dogs', type: 'Frozen', cost: 85.00, formulation: { 'Beef': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
    'FM-DL-5lb': { name: 'Frozen Lamb Dogs 5lb', category: 'Dogs', type: 'Frozen', cost: 50.00, formulation: { 'Lamb': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
    'FM-DL-10lb': { name: 'Frozen Lamb Dogs 10lb', category: 'Dogs', type: 'Frozen', cost: 95.00, formulation: { 'Lamb': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
    'FM-DC-5lb': { name: 'Frozen Chicken Dogs 5lb', category: 'Dogs', type: 'Frozen', cost: 48.00, formulation: { 'Chicken': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
    'FM-DC-10lb': { name: 'Frozen Chicken Dogs 10lb', category: 'Dogs', type: 'Frozen', cost: 90.00, formulation: { 'Chicken': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
    'FM-DT-5lb': { name: 'Frozen Turkey Dogs 5lb', category: 'Dogs', type: 'Frozen', cost: 49.00, formulation: { 'Turkey': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
    'FM-DT-10lb': { name: 'Frozen Turkey Dogs 10lb', category: 'Dogs', type: 'Frozen', cost: 92.00, formulation: { 'Turkey': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
    'FM-DK-5lb': { name: 'Frozen Kangaroo Dogs 5lb', category: 'Dogs', type: 'Frozen', cost: 58.00, formulation: { 'Kangaroo': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
    'FM-DK-10lb': { name: 'Frozen Kangaroo Dogs 10lb', category: 'Dogs', type: 'Frozen', cost: 108.00, formulation: { 'Kangaroo': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
    
    // FROZEN CATS (8)
    'FM-CB-2lb': { name: 'Frozen Beef Cats 2lb', category: 'Cats', type: 'Frozen', cost: 22.00, formulation: { 'Beef': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
    'FM-CB-5lb': { name: 'Frozen Beef Cats 5lb', category: 'Cats', type: 'Frozen', cost: 45.00, formulation: { 'Beef': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
    'FM-CL-2lb': { name: 'Frozen Lamb Cats 2lb', category: 'Cats', type: 'Frozen', cost: 24.00, formulation: { 'Lamb': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
    'FM-CL-5lb': { name: 'Frozen Lamb Cats 5lb', category: 'Cats', type: 'Frozen', cost: 50.00, formulation: { 'Lamb': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
    'FM-CC-2lb': { name: 'Frozen Chicken Cats 2lb', category: 'Cats', type: 'Frozen', cost: 23.00, formulation: { 'Chicken': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
    'FM-CC-5lb': { name: 'Frozen Chicken Cats 5lb', category: 'Cats', type: 'Frozen', cost: 48.00, formulation: { 'Chicken': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
    'FM-CT-2lb': { name: 'Frozen Turkey Cats 2lb', category: 'Cats', type: 'Frozen', cost: 23.50, formulation: { 'Turkey': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
    'FM-CT-5lb': { name: 'Frozen Turkey Cats 5lb', category: 'Cats', type: 'Frozen', cost: 49.00, formulation: { 'Turkey': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
    
    // TREATS & SUPPLEMENTS (5)
    'TR-BEEF-100': { name: 'Beef Treats 100g', category: 'Treats', type: 'Freeze-Dried', cost: 3.50, formulation: { 'Beef': 0.90, 'Packaging': 0.10 } },
    'TR-LAMB-100': { name: 'Lamb Treats 100g', category: 'Treats', type: 'Freeze-Dried', cost: 4.00, formulation: { 'Lamb': 0.90, 'Packaging': 0.10 } },
    'TR-DUCK-100': { name: 'Duck Treats 100g', category: 'Treats', type: 'Freeze-Dried', cost: 4.50, formulation: { 'Duck': 0.90, 'Packaging': 0.10 } },
    'SUP-JT-60': { name: 'Joint Support 60g', category: 'Supplements', type: 'Powder', cost: 12.50, formulation: { 'Supplements': 0.80, 'Carrier': 0.15, 'Packaging': 0.05 } },
    'SUP-JT-150': { name: 'Joint Support 150g', category: 'Supplements', type: 'Powder', cost: 28.00, formulation: { 'Supplements': 0.80, 'Carrier': 0.15, 'Packaging': 0.05 } },
  };

  const calculateTotalCost = (productCost) => {
    const variableCosts = 0.50;
    const overheadCost = overheadPerUnit;
    const rawMaterial = productCost;
    const labor = laborPerUnit;
    const subtotal = rawMaterial + variableCosts + labor + overheadCost;
    const buffer = subtotal * 0.05;
    return {
      rawMaterial,
      variableCosts,
      labor,
      overhead: overheadCost,
      subtotal,
      buffer,
      total: subtotal + buffer,
    };
  };

  const calculateBatchCost = (productCost, quantity) => {
    const perUnit = calculateTotalCost(productCost);
    return {
      perUnit: perUnit.total,
      quantity,
      totalCost: perUnit.total * quantity,
      rawMaterialTotal: perUnit.rawMaterial * quantity,
      laborTotal: perUnit.labor * quantity,
    };
  };

  const exportToCSV = () => {
    let csv = 'Product ID,Product Name,Category,Type,Unit Cost,Retail Price,Margin %\n';
    
    Object.entries(products).forEach(([id, product]) => {
      const costs = calculateTotalCost(product.cost);
      const retail = retailPrices[id] || 0;
      const margin = retail > 0 ? (((retail - costs.total) / retail) * 100).toFixed(1) : '0';
      csv += `${id},"${product.name}",${product.category},${product.type},${costs.total.toFixed(2)},${retail},${margin}\n`;
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
    const costs = calculateTotalCost(product.cost);
    const retail = retailPrices[id] || 0;
    const profit = retail - costs.total;
    const margin = retail > 0 ? ((profit / retail) * 100).toFixed(1) : 0;
    const marginColor = margin >= 50 ? '#10b981' : margin >= 30 ? '#eab308' : '#ef4444';
    const batchCosts = calculateBatchCost(product.cost, batchSize);

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
            {/* Cost Breakdown */}
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontWeight: '600', fontSize: '13px', margin: '0 0 8px 0' }}>Cost Breakdown (Per Unit)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
                <div>Raw Materials: <span style={{ fontWeight: '600' }}>${costs.rawMaterial.toFixed(2)}</span></div>
                <div>Variable: <span style={{ fontWeight: '600' }}>${costs.variableCosts.toFixed(2)}</span></div>
                <div>Labor: <span style={{ fontWeight: '600' }}>${costs.labor.toFixed(2)}</span></div>
                <div>Overhead: <span style={{ fontWeight: '600' }}>${costs.overhead.toFixed(2)}</span></div>
                <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #ddd', paddingTop: '8px' }}>
                  Subtotal: <span style={{ fontWeight: '600' }}>${costs.subtotal.toFixed(2)}</span>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  Buffer (5%): <span style={{ fontWeight: '600' }}>${costs.buffer.toFixed(2)}</span>
                </div>
                <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #ddd', paddingTop: '8px', fontSize: '16px', fontWeight: 'bold', color: '#2563eb' }}>
                  Total: ${costs.total.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Formulation */}
            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
              <h4 style={{ fontWeight: '600', fontSize: '13px', margin: '0 0 8px 0' }}>Formulation</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
                {Object.entries(product.formulation).map(([ingredient, percentage]) => (
                  <div key={ingredient}>{ingredient}: <span style={{ fontWeight: '600' }}>{(percentage * 100).toFixed(0)}%</span></div>
                ))}
              </div>
            </div>

            {/* Batch Yield */}
            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#fef3c7', borderRadius: '6px', border: '1px solid #fcd34d' }}>
              <h4 style={{ fontWeight: '600', fontSize: '13px', margin: '0 0 8px 0' }}>Batch Yield ({batchSize} units)</h4>
              <div style={{ fontSize: '13px' }}>
                <div>Total Batch Cost: <span style={{ fontWeight: '600' }}>${batchCosts.totalCost.toFixed(2)}</span></div>
                <div>Raw Materials Total: <span style={{ fontWeight: '600' }}>${batchCosts.rawMaterialTotal.toFixed(2)}</span></div>
                <div>Labor Total: <span style={{ fontWeight: '600' }}>${batchCosts.laborTotal.toFixed(2)}</span></div>
                <div style={{ borderTop: '1px solid #fcd34d', paddingTop: '8px', marginTop: '8px' }}>
                  Cost per Unit: <span style={{ fontWeight: '600' }}>${batchCosts.perUnit.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Profit */}
            {retail > 0 && (
              <div style={{ padding: '8px', backgroundColor: '#dcfce7', borderRadius: '4px', border: '1px solid #86efac' }}>
                <p style={{ fontSize: '13px', margin: 0 }}>
                  <span style={{ fontWeight: '600' }}>Retail:</span> ${retail} | 
                  <span style={{ fontWeight: '600' }}> Profit per Unit:</span> ${profit.toFixed(2)} | 
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
        <p style={{ fontSize: '13px', color: '#93c5fd', margin: 0 }}>Professional batch costing calculator with formulations & export</p>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid #ddd', backgroundColor: '#fff' }}>
        <button
          onClick={() => setActiveTab('products')}
          style={{ flex: 1, padding: '12px 16px', fontWeight: '600', fontSize: '13px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', borderBottom: activeTab === 'products' ? '2px solid #2563eb' : 'none', color: activeTab === 'products' ? '#2563eb' : '#666' }}
        >
          Products ({Object.keys(products).length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          style={{ flex: 1, padding: '12px 16px', fontWeight: '600', fontSize: '13px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', borderBottom: activeTab === 'settings' ? '2px solid #2563eb' : 'none', color: activeTab === 'settings' ? '#2563eb' : '#666' }}
        >
          Settings
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {activeTab === 'products' && (
          <div>
            <div style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ flex: 1, padding: '8px 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', maxWidth: '600px' }}
              />
              <button
                onClick={exportToCSV}
                style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
              >
                📥 Export CSV
              </button>
            </div>
            <p style={{ fontSize: '12px', color: '#999', marginBottom: '16px' }}>Showing {filteredProducts.length} of {Object.keys(products).length} products</p>
            <div style={{ maxWidth: '800px' }}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(([id, product]) => (
                  <ProductCard key={id} id={id} product={product} />
                ))
              ) : (
                <p style={{ color: '#999' }}>No products found</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div style={{ maxWidth: '800px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>Settings</h2>
            
            <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Labor Cost per Unit ($)</label>
              <input
                type="number"
                value={laborPerUnit}
                onChange={(e) => setLaborPerUnit(parseFloat(e.target.value) || 0)}
                step="0.01"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Overhead Cost per Unit ($)</label>
              <input
                type="number"
                value={overheadPerUnit}
                onChange={(e) => setOverheadPerUnit(parseFloat(e.target.value) || 0)}
                step="0.01"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Batch Size for Yield Calculation (units)</label>
              <input
                type="number"
                value={batchSize}
                onChange={(e) => setBatchSize(Math.max(1, parseInt(e.target.value) || 1))}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
              />
              <p style={{ fontSize: '12px', color: '#999', marginTop: '4px', margin: '4px 0 0 0' }}>Change this to see batch costs for different quantities</p>
            </div>

            <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #ddd' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '16px' }}>Edit Retail Prices</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {Object.entries(products).map(([id, product]) => (
                  <div key={id}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>{product.name}</label>
                    <input
                      type="number"
                      value={retailPrices[id] || 0}
                      onChange={(e) => setRetailPrices({ ...retailPrices, [id]: parseFloat(e.target.value) || 0 })}
                      step="0.01"
                      style={{ width: '100%', padding: '6px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }}
                    />
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
