'use client';
import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [laborPerUnit, setLaborPerUnit] = useState(15);
  const [overheadPerUnit, setOverheadPerUnit] = useState(10);
  const [retailPrices, setRetailPrices] = useState({
    'FD-DB-400': 39.99,
    'FD-DL-400': 44.99,
    'FM-DM-5lb': 89.99,
  });

  const products = {
    'FD-DB-400': { name: 'Freeze Dried Beef 400g', category: 'Dogs', type: 'Freeze-Dried', cost: 8.50 },
    'FD-DL-400': { name: 'Freeze Dried Lamb 400g', category: 'Dogs', type: 'Freeze-Dried', cost: 9.20 },
    'FM-DM-5lb': { name: 'Duck & Mackerel 5lb', category: 'Dogs', type: 'Frozen', cost: 45.00 },
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

  const ProductCard = ({ id, product }) => {
    const expanded = expandedProduct === id;
    const costs = calculateTotalCost(product.cost);
    const retail = retailPrices[id] || 0;
    const profit = retail - costs.total;
    const margin = retail > 0 ? ((profit / retail) * 100).toFixed(1) : 0;
    const marginColor = margin >= 50 ? '#10b981' : margin >= 30 ? '#eab308' : '#ef4444';

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
                Total Cost: ${costs.total.toFixed(2)}
              </div>
            </div>
            {retail > 0 && (
              <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#dcfce7', borderRadius: '4px', border: '1px solid #86efac' }}>
                <p style={{ fontSize: '13px', margin: 0 }}>
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
      {/* Header */}
      <div style={{ backgroundColor: '#2563eb', color: 'white', padding: '16px', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 4px 0' }}>🧮 Formula Raw Production Costing</h1>
        <p style={{ fontSize: '13px', color: '#93c5fd', margin: 0 }}>Professional batch costing calculator</p>
      </div>

      {/* Tabs */}
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

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {activeTab === 'products' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '8px 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
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
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>Cost Settings</h2>
            
            <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Labor Cost per Unit ($)</label>
              <input
                type="number"
                value={laborPerUnit}
                onChange={(e) => setLaborPerUnit(parseFloat(e.target.value) || 0)}
                step="0.01"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
              />
              <p style={{ fontSize: '12px', color: '#999', marginTop: '4px', margin: '4px 0 0 0' }}>Applied to all products</p>
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
              <p style={{ fontSize: '12px', color: '#999', marginTop: '4px', margin: '4px 0 0 0' }}>Applied to all products</p>
            </div>

            <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #ddd' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '16px' }}>Retail Prices</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.entries(products).map(([id, product]) => (
                  <div key={id}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>{product.name}</label>
                    <input
                      type="number"
                      value={retailPrices[id] || 0}
                      onChange={(e) => setRetailPrices({ ...retailPrices, [id]: parseFloat(e.target.value) || 0 })}
                      step="0.01"
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
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
