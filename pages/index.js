'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('FD-DB-400');
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
    const [expanded, setExpanded] = useState(false);
    const costs = calculateTotalCost(product.cost);
    const retail = retailPrices[id] || 0;
    const profit = retail - costs.total;
    const margin = retail > 0 ? ((profit / retail) * 100).toFixed(1) : 0;
    const marginColor = margin >= 50 ? 'text-green-600' : margin >= 30 ? 'text-yellow-600' : 'text-red-600';

    return (
      <div className="border rounded-lg p-4 mb-3 bg-white hover:shadow-md transition">
        <div className="flex justify-between items-start cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.category} • {product.type}</p>
          </div>
          <div className="text-right ml-4">
            <div className="font-bold text-lg text-blue-600">${costs.total.toFixed(2)}</div>
            <div className={`text-sm font-semibold ${marginColor}`}>
              {margin}% margin
            </div>
          </div>
          {expanded ? <ChevronUp className="w-5 h-5 ml-2 text-gray-400" /> : <ChevronDown className="w-5 h-5 ml-2 text-gray-400" />}
        </div>

        {expanded && (
          <div className="mt-4 space-y-2 border-t pt-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Raw Materials: <span className="font-semibold">${costs.rawMaterial.toFixed(2)}</span></div>
              <div>Variable: <span className="font-semibold">${costs.variableCosts.toFixed(2)}</span></div>
              <div>Labor: <span className="font-semibold">${costs.labor.toFixed(2)}</span></div>
              <div>Overhead: <span className="font-semibold">${costs.overhead.toFixed(2)}</span></div>
              <div className="col-span-2 border-t pt-2">
                Subtotal: <span className="font-semibold">${costs.subtotal.toFixed(2)}</span>
              </div>
              <div className="col-span-2">
                Buffer (5%): <span className="font-semibold">${costs.buffer.toFixed(2)}</span>
              </div>
              <div className="col-span-2 border-t pt-2 text-lg font-bold text-blue-600">
                Total Cost: ${costs.total.toFixed(2)}
              </div>
            </div>
            {retail > 0 && (
              <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
                <p className="text-sm">
                  <span className="font-semibold">Retail:</span> ${retail} | 
                  <span className="font-semibold"> Profit:</span> ${profit.toFixed(2)} | 
                  <span className={`font-semibold ${marginColor}`}> {margin}%</span>
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
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold">🧮 Formula Raw Production Costing</h1>
        <p className="text-blue-100 text-sm">Professional batch costing calculator</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b bg-white">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-3 px-4 font-semibold text-sm ${activeTab === 'products' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
        >
          Products ({Object.keys(products).length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-3 px-4 font-semibold text-sm ${activeTab === 'settings' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
        >
          Settings
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'products' && (
          <div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="max-w-2xl space-y-2">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(([id, product]) => (
                  <ProductCard key={id} id={id} product={product} />
                ))
              ) : (
                <p className="text-gray-500">No products found</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold mb-6">Cost Settings</h2>
            
            <div className="bg-white p-6 rounded-lg border mb-4">
              <label className="block text-sm font-semibold mb-2">Labor Cost per Unit ($)</label>
              <input
                type="number"
                value={laborPerUnit}
                onChange={(e) => setLaborPerUnit(parseFloat(e.target.value) || 0)}
                step="0.01"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-xs text-gray-500 mt-1">Applied to all products</p>
            </div>

            <div className="bg-white p-6 rounded-lg border mb-4">
              <label className="block text-sm font-semibold mb-2">Overhead Cost per Unit ($)</label>
              <input
                type="number"
                value={overheadPerUnit}
                onChange={(e) => setOverheadPerUnit(parseFloat(e.target.value) || 0)}
                step="0.01"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-xs text-gray-500 mt-1">Applied to all products</p>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold mb-4">Retail Prices</h3>
              <div className="space-y-3">
                {Object.entries(products).map(([id, product]) => (
                  <div key={id}>
                    <label className="block text-sm font-semibold mb-1">{product.name}</label>
                    <input
                      type="number"
                      value={retailPrices[id] || 0}
                      onChange={(e) => setRetailPrices({ ...retailPrices, [id]: parseFloat(e.target.value) || 0 })}
                      step="0.01"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
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
