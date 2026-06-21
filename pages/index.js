'use client';
import { useState } from 'react';

export default function Home() {
    const [selectedProduct, setSelectedProduct] = useState('FD-DB-400');
  
    const products = {
          'FD-DB-400': { name: 'Freeze Dried Beef 400g', cost: 8.50 },
          'FD-DL-400': { name: 'Freeze Dried Lamb 400g', cost: 9.20 },
          'FM-DM-5lb': { name: 'Duck & Mackerel 5lb', cost: 45.00 },
    };
  
    const currentProduct = products[selectedProduct];
  
    return (
          <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>🧮 Batch Costing Calculator</h1>
        <p>Formula Raw batch costing dashboard</p>
        <p>Status: ✅ Live</p>
  
      <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Select Product:
          </label>
                    <select 
                      value={selectedProduct} 
                                  onChange={(e) => setSelectedProduct(e.target.value)}
                                              style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
{Object.entries(products).map(([key, product]) => (
              <option key={key} value={key}>{product.name}</option>
            ))}
</select>
  </div>
  
      <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f0f0', borderRadius: '8px' }}>
        <p><strong>Selected:</strong> {currentProduct.name}</p>
          <p><strong>Cost per Unit:</strong> ${currentProduct.cost.toFixed(2)}</p>
  </div>
  </div>
    );
}export default function Home() {
  return (
      <div style={{ padding: '2rem' }}>
            <h1>🧮 Batch Costing Calculator</h1>
                  <p>Formula Raw batch costing dashboard</p>
                        <p>Status: ✅ Live</p>
                            </div>
                              );
                              }
