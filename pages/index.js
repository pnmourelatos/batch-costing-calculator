'use client';
import { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

// Your Firebase config (uses environment variables from .env.local)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Lazy-initialize: module runs in Node during `next build` (no window, no env vars)
const _fbApp = typeof window !== 'undefined'
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp())
  : null;
const auth = _fbApp ? getAuth(_fbApp) : null;
const db = _fbApp ? getFirestore(_fbApp) : null;
const googleProvider = _fbApp ? new GoogleAuthProvider() : null;

const DEFAULT_INGREDIENT_COSTS = {
  'Beef': 3.50, 'Lamb': 4.20, 'Chicken': 2.80, 'Turkey': 3.10, 'Kangaroo': 5.50,
  'Salmon': 6.20, 'Rabbit': 5.80, 'Duck': 4.90, 'Fish Oil': 2.00, 'Organs': 1.50,
  'Mixed Meats': 3.80, 'Vegetables': 0.80, 'Supplements': 8.00, 'Carrier': 1.20,
};

const DEFAULT_PRODUCTS = {
  'FD-DB-400': { name: 'Beef', category: 'Freeze-Dried Dogs', size: '400g', cost: 8.50, formulation: { 'Beef': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FD-DB-850': { name: 'Beef', category: 'Freeze-Dried Dogs', size: '850g', cost: 17.00, formulation: { 'Beef': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FD-DL-400': { name: 'Lamb', category: 'Freeze-Dried Dogs', size: '400g', cost: 9.20, formulation: { 'Lamb': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FD-DL-850': { name: 'Lamb', category: 'Freeze-Dried Dogs', size: '850g', cost: 18.40, formulation: { 'Lamb': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FD-DC-400': { name: 'Chicken', category: 'Freeze-Dried Dogs', size: '400g', cost: 8.75, formulation: { 'Chicken': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FD-DC-850': { name: 'Chicken', category: 'Freeze-Dried Dogs', size: '850g', cost: 17.50, formulation: { 'Chicken': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FD-DT-400': { name: 'Turkey', category: 'Freeze-Dried Dogs', size: '400g', cost: 8.90, formulation: { 'Turkey': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FD-DT-850': { name: 'Turkey', category: 'Freeze-Dried Dogs', size: '850g', cost: 17.80, formulation: { 'Turkey': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FD-DK-400': { name: 'Kangaroo', category: 'Freeze-Dried Dogs', size: '400g', cost: 10.20, formulation: { 'Kangaroo': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FD-DK-850': { name: 'Kangaroo', category: 'Freeze-Dried Dogs', size: '850g', cost: 20.40, formulation: { 'Kangaroo': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FD-DS-400': { name: 'Salmon', category: 'Freeze-Dried Dogs', size: '400g', cost: 10.75, formulation: { 'Salmon': 0.35, 'Fish Oil': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FD-DS-850': { name: 'Salmon', category: 'Freeze-Dried Dogs', size: '850g', cost: 21.50, formulation: { 'Salmon': 0.35, 'Fish Oil': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FD-DR-400': { name: 'Rabbit', category: 'Freeze-Dried Dogs', size: '400g', cost: 11.20, formulation: { 'Rabbit': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FD-DR-850': { name: 'Rabbit', category: 'Freeze-Dried Dogs', size: '850g', cost: 22.40, formulation: { 'Rabbit': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FD-DMM-400': { name: 'Mix', category: 'Freeze-Dried Dogs', size: '400g', cost: 9.50, formulation: { 'Mixed Meats': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FD-DMM-850': { name: 'Mix', category: 'Freeze-Dried Dogs', size: '850g', cost: 19.00, formulation: { 'Mixed Meats': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FD-CB-200': { name: 'Beef', category: 'Freeze-Dried Cats', size: '200g', cost: 5.50, formulation: { 'Beef': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FD-CB-400': { name: 'Beef', category: 'Freeze-Dried Cats', size: '400g', cost: 8.50, formulation: { 'Beef': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FD-CL-200': { name: 'Lamb', category: 'Freeze-Dried Cats', size: '200g', cost: 6.00, formulation: { 'Lamb': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FD-CL-400': { name: 'Lamb', category: 'Freeze-Dried Cats', size: '400g', cost: 9.20, formulation: { 'Lamb': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FD-CC-200': { name: 'Chicken', category: 'Freeze-Dried Cats', size: '200g', cost: 5.70, formulation: { 'Chicken': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FD-CC-400': { name: 'Chicken', category: 'Freeze-Dried Cats', size: '400g', cost: 8.75, formulation: { 'Chicken': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FD-CT-200': { name: 'Turkey', category: 'Freeze-Dried Cats', size: '200g', cost: 5.80, formulation: { 'Turkey': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FD-CT-400': { name: 'Turkey', category: 'Freeze-Dried Cats', size: '400g', cost: 8.90, formulation: { 'Turkey': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FD-CK-200': { name: 'Kangaroo', category: 'Freeze-Dried Cats', size: '200g', cost: 6.65, formulation: { 'Kangaroo': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FD-CK-400': { name: 'Kangaroo', category: 'Freeze-Dried Cats', size: '400g', cost: 10.20, formulation: { 'Kangaroo': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FD-CS-200': { name: 'Salmon', category: 'Freeze-Dried Cats', size: '200g', cost: 7.00, formulation: { 'Salmon': 0.35, 'Fish Oil': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FD-CS-400': { name: 'Salmon', category: 'Freeze-Dried Cats', size: '400g', cost: 10.75, formulation: { 'Salmon': 0.35, 'Fish Oil': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FD-CR-200': { name: 'Rabbit', category: 'Freeze-Dried Cats', size: '200g', cost: 7.30, formulation: { 'Rabbit': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FD-CR-400': { name: 'Rabbit', category: 'Freeze-Dried Cats', size: '400g', cost: 11.20, formulation: { 'Rabbit': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FD-CMM-200': { name: 'Mix', category: 'Freeze-Dried Cats', size: '200g', cost: 6.20, formulation: { 'Mixed Meats': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FD-CMM-400': { name: 'Mix', category: 'Freeze-Dried Cats', size: '400g', cost: 9.50, formulation: { 'Mixed Meats': 0.35, 'Organs': 0.05, 'Vegetables': 0.08, 'Packaging': 0.02 } },
  'FM-DB-5lb': { name: 'Beef', category: 'Frozen Dogs', size: '5lb', cost: 45.00, formulation: { 'Beef': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
  'FM-DB-10lb': { name: 'Beef', category: 'Frozen Dogs', size: '10lb', cost: 85.00, formulation: { 'Beef': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
  'FM-DL-5lb': { name: 'Lamb', category: 'Frozen Dogs', size: '5lb', cost: 50.00, formulation: { 'Lamb': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
  'FM-DL-10lb': { name: 'Lamb', category: 'Frozen Dogs', size: '10lb', cost: 95.00, formulation: { 'Lamb': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
  'FM-DC-5lb': { name: 'Chicken', category: 'Frozen Dogs', size: '5lb', cost: 48.00, formulation: { 'Chicken': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
  'FM-DC-10lb': { name: 'Chicken', category: 'Frozen Dogs', size: '10lb', cost: 90.00, formulation: { 'Chicken': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
  'FM-DT-5lb': { name: 'Turkey', category: 'Frozen Dogs', size: '5lb', cost: 49.00, formulation: { 'Turkey': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
  'FM-DT-10lb': { name: 'Turkey', category: 'Frozen Dogs', size: '10lb', cost: 92.00, formulation: { 'Turkey': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
  'FM-DK-5lb': { name: 'Kangaroo', category: 'Frozen Dogs', size: '5lb', cost: 58.00, formulation: { 'Kangaroo': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
  'FM-DK-10lb': { name: 'Kangaroo', category: 'Frozen Dogs', size: '10lb', cost: 108.00, formulation: { 'Kangaroo': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
  'FM-CB-2lb': { name: 'Beef', category: 'Frozen Cats', size: '2lb', cost: 22.00, formulation: { 'Beef': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
  'FM-CB-5lb': { name: 'Beef', category: 'Frozen Cats', size: '5lb', cost: 45.00, formulation: { 'Beef': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
  'FM-CL-2lb': { name: 'Lamb', category: 'Frozen Cats', size: '2lb', cost: 24.00, formulation: { 'Lamb': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
  'FM-CL-5lb': { name: 'Lamb', category: 'Frozen Cats', size: '5lb', cost: 50.00, formulation: { 'Lamb': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
  'FM-CC-2lb': { name: 'Chicken', category: 'Frozen Cats', size: '2lb', cost: 23.00, formulation: { 'Chicken': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
  'FM-CC-5lb': { name: 'Chicken', category: 'Frozen Cats', size: '5lb', cost: 48.00, formulation: { 'Chicken': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
  'FM-CT-2lb': { name: 'Turkey', category: 'Frozen Cats', size: '2lb', cost: 23.50, formulation: { 'Turkey': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
  'FM-CT-5lb': { name: 'Turkey', category: 'Frozen Cats', size: '5lb', cost: 49.00, formulation: { 'Turkey': 0.40, 'Organs': 0.08, 'Vegetables': 0.10, 'Packaging': 0.05 } },
  'TR-BEEF-100': { name: 'Beef Treats', category: 'Treats & Supplements', size: '100g', cost: 3.50, formulation: { 'Beef': 0.90, 'Packaging': 0.10 } },
  'TR-LAMB-100': { name: 'Lamb Treats', category: 'Treats & Supplements', size: '100g', cost: 4.00, formulation: { 'Lamb': 0.90, 'Packaging': 0.10 } },
  'TR-DUCK-100': { name: 'Duck Treats', category: 'Treats & Supplements', size: '100g', cost: 4.50, formulation: { 'Duck': 0.90, 'Packaging': 0.10 } },
  'SUP-JT-60': { name: 'Joint Support', category: 'Treats & Supplements', size: '60g', cost: 12.50, formulation: { 'Supplements': 0.80, 'Carrier': 0.15, 'Packaging': 0.05 } },
  'SUP-JT-150': { name: 'Joint Support', category: 'Treats & Supplements', size: '150g', cost: 28.00, formulation: { 'Supplements': 0.80, 'Carrier': 0.15, 'Packaging': 0.05 } },
};

const generateSku = (name, category, size, existingProducts) => {
  const catPrefix = {
    'Freeze-Dried Dogs': 'FD-D', 'Freeze-Dried Cats': 'FD-C',
    'Frozen Dogs': 'FM-D',       'Frozen Cats': 'FM-C',
    'Treats & Supplements': 'TR',
  }[category] || category.split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 4);
  const nameCode = name.split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 4);
  const sizeCode = size.replace(/\s+/g, '').replace(/(\d+)g$/, '$1');
  const base = `${catPrefix}${nameCode}-${sizeCode}`;
  if (!existingProducts[base]) return base;
  let i = 2;
  while (existingProducts[`${base}-${i}`]) i++;
  return `${base}-${i}`;
};

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSize, setExpandedSize] = useState({});
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [batchModal, setBatchModal] = useState(null);
  const [laborPerUnit, setLaborPerUnit] = useState(15);
  const [overheadPerUnit, setOverheadPerUnit] = useState(10);
  const [ingredientCosts, setIngredientCosts] = useState(DEFAULT_INGREDIENT_COSTS);
  const [batchData, setBatchData] = useState({});
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
  const [wholesalePrices, setWholesalePrices] = useState({
    'FD-DB-400': 24.99, 'FD-DB-850': 44.99, 'FD-DL-400': 29.99, 'FD-DL-850': 49.99,
    'FD-DC-400': 26.99, 'FD-DC-850': 46.99, 'FD-DT-400': 27.99, 'FD-DT-850': 47.99,
    'FD-DK-400': 34.99, 'FD-DK-850': 59.99, 'FD-DS-400': 36.99, 'FD-DS-850': 64.99,
    'FD-DR-400': 39.99, 'FD-DR-850': 69.99, 'FD-DMM-400': 31.99, 'FD-DMM-850': 54.99,
    'FD-CB-200': 16.99, 'FD-CB-400': 24.99, 'FD-CL-200': 18.99, 'FD-CL-400': 29.99,
    'FD-CC-200': 18.49, 'FD-CC-400': 26.99, 'FD-CT-200': 18.99, 'FD-CT-400': 27.99,
    'FD-CK-200': 21.99, 'FD-CK-400': 34.99, 'FD-CS-200': 23.99, 'FD-CS-400': 36.99,
    'FD-CR-200': 24.49, 'FD-CR-400': 39.99, 'FD-CMM-200': 20.49, 'FD-CMM-400': 31.99,
    'FM-DB-5lb': 59.99, 'FM-DB-10lb': 104.99, 'FM-DL-5lb': 64.99, 'FM-DL-10lb': 119.99,
    'FM-DC-5lb': 62.99, 'FM-DC-10lb': 112.99, 'FM-DT-5lb': 64.99, 'FM-DT-10lb': 114.99,
    'FM-DK-5lb': 76.99, 'FM-DK-10lb': 139.99,
    'FM-CB-2lb': 27.99, 'FM-CB-5lb': 59.99, 'FM-CL-2lb': 30.99, 'FM-CL-5lb': 64.99,
    'FM-CC-2lb': 29.49, 'FM-CC-5lb': 62.99, 'FM-CT-2lb': 29.99, 'FM-CT-5lb': 64.99,
    'TR-BEEF-100': 8.99, 'TR-LAMB-100': 9.99, 'TR-DUCK-100': 11.99,
    'SUP-JT-60': 23.99, 'SUP-JT-150': 51.99,
  });

  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [addIngredientModal, setAddIngredientModal] = useState(false);
  const [addProductModal, setAddProductModal] = useState(false);
  const [editIngredientModal, setEditIngredientModal] = useState(null); // { oldName, name, cost }
  const [editProductModal, setEditProductModal] = useState(null); // productId

  useEffect(() => {
    if (!auth) { setLoading(false); return; }
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Load user's batch data from Firestore
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setBatchData(data.batchData || {});
            setLaborPerUnit(data.laborPerUnit || 15);
            setOverheadPerUnit(data.overheadPerUnit || 10);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
        try {
          const catalogRef = doc(db, 'shared', 'catalog');
          const catalogSnap = await getDoc(catalogRef);
          if (catalogSnap.exists()) {
            const cat = catalogSnap.data();
            if (cat.products) setProducts(cat.products);
            if (cat.ingredientCosts) setIngredientCosts(cat.ingredientCosts);
          } else {
            await setDoc(catalogRef, {
              products: DEFAULT_PRODUCTS,
              ingredientCosts: DEFAULT_INGREDIENT_COSTS,
              updatedAt: new Date().toISOString(),
              updatedBy: currentUser.email,
            });
          }
        } catch (error) {
          console.error('Error loading catalog:', error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Save batch data to Firestore
  const saveBatchToFirestore = async (productId, batch) => {
    if (!user || !db) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const newBatchData = { ...batchData, [productId]: batch };
      await setDoc(userDocRef, {
        batchData: newBatchData,
        laborPerUnit,
        overheadPerUnit,
        email: user.email,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
      setBatchData(newBatchData);
    } catch (error) {
      console.error('Error saving batch:', error);
    }
  };

  const saveCatalogToFirestore = async (nextProducts, nextIngredientCosts) => {
    if (!user || !db) return;
    try {
      await setDoc(doc(db, 'shared', 'catalog'), {
        products: nextProducts,
        ingredientCosts: nextIngredientCosts,
        updatedAt: new Date().toISOString(),
        updatedBy: user.email,
      });
    } catch (error) {
      console.error('Error saving catalog:', error);
    }
  };

  const calculateTotalCost = (productCost) => {
    const variableCosts = 0.50;
    const overheadCost = overheadPerUnit;
    const rawMaterial = productCost;
    const labor = laborPerUnit;
    const subtotal = rawMaterial + variableCosts + labor + overheadCost;
    const buffer = subtotal * 0.05;
    return { rawMaterial, variableCosts, labor, overhead: overheadCost, subtotal, buffer, total: subtotal + buffer };
  };

  const groupProductsByCategory = () => {
    const grouped = {};
    Object.entries(products).forEach(([id, product]) => {
      if (!grouped[product.category]) grouped[product.category] = {};
      if (!grouped[product.category][product.size]) grouped[product.category][product.size] = {};
      grouped[product.category][product.size][product.name] = { id, ...product };
    });
    return grouped;
  };

  const groupedProducts = groupProductsByCategory();

  const BatchModal = ({ productId, product }) => {
    const __defIng = {}; Object.keys(product.formulation).forEach(function(ing){ __defIng[ing] = { kg: 1, costPerKg: ingredientCosts[ing] || 0 }; }); const __sv = batchData[productId]; const batch = __sv ? Object.assign({ unitsToMake: 25, packagingUnitPrice: 0.50, laborHours: 4, hourlyRate: 25, retailPrice: retailPrices[productId] || 0, wholesalePrice: wholesalePrices[productId] || 0 }, __sv, { ingredients: Object.assign({}, __defIng, __sv.ingredients || {}) }) : { unitsToMake: 25, packagingUnitPrice: 0.50, laborHours: 4, hourlyRate: 25, ingredients: __defIng, retailPrice: retailPrices[productId] || 0, wholesalePrice: wholesalePrices[productId] || 0 };
    const [localBatch, setLocalBatch] = useState(batch);

    const calculateBatchResults = () => {
      const unitsToMake = parseInt(localBatch.unitsToMake) || 0;
      const laborHours = parseFloat(localBatch.laborHours) || 0;
      const hourlyRate = parseFloat(localBatch.hourlyRate) || 0;
      const packagingUnitPrice = parseFloat(localBatch.packagingUnitPrice) || 0;
      
      let ingredientTotal = 0;
      Object.entries(localBatch.ingredients || {}).forEach(([ingredient, data]) => {
        const kg = parseFloat(data.kg) || 0;
        const costPerKg = parseFloat(data.costPerKg) || 0;
        ingredientTotal += kg * costPerKg;
      });

      const laborTotal = laborHours * hourlyRate;
      const packagingTotal = unitsToMake * packagingUnitPrice;
      const overheadTotal = overheadPerUnit * unitsToMake;
      const variableTotal = 0.50 * unitsToMake;
      const subtotal = ingredientTotal + laborTotal + packagingTotal + overheadTotal + variableTotal;
      const buffer = subtotal * 0.05;
      const totalBatchCost = subtotal + buffer;
      const costPerUnit = unitsToMake > 0 ? totalBatchCost / unitsToMake : 0;

      return { ingredientTotal, laborTotal, packagingTotal, overheadTotal, variableTotal, subtotal, buffer, totalBatchCost, costPerUnit, unitsToMake };
    };

    const results = calculateBatchResults();
    const retailPrice = localBatch.retailPrice !== undefined ? parseFloat(localBatch.retailPrice) : (retailPrices[productId] || 0);
    const wholesalePrice = localBatch.wholesalePrice !== undefined ? parseFloat(localBatch.wholesalePrice) : (wholesalePrices[productId] || 0);
    const retailMargin = retailPrice > 0 ? (((retailPrice - results.costPerUnit) / retailPrice) * 100).toFixed(1) : '0';
    const wholesaleMargin = wholesalePrice > 0 ? (((wholesalePrice - results.costPerUnit) / wholesalePrice) * 100).toFixed(1) : '0';
    const retailColor = retailMargin >= 30 ? '#10b981' : retailMargin >= 15 ? '#eab308' : '#ef4444';
    const wholesaleColor = wholesaleMargin >= 20 ? '#10b981' : wholesaleMargin >= 10 ? '#eab308' : '#ef4444';

    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', maxWidth: '700px', width: '95%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Batch Costing: {product.name} {product.size}</h2>
            <button onClick={() => setBatchModal(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>✕</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '13px' }}>Units/Boxes to Make</label>
              <input type="number" value={localBatch.unitsToMake || 25} onChange={(e) => setLocalBatch({ ...localBatch, unitsToMake: e.target.value })} min="1" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '13px' }}>Packaging Cost/Unit ($)</label>
              <input type="number" value={localBatch.packagingUnitPrice || 0.50} onChange={(e) => setLocalBatch({ ...localBatch, packagingUnitPrice: e.target.value })} step="0.01" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '6px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontWeight: '600', fontSize: '13px' }}>Labor</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', fontSize: '12px' }}>Hours</label>
                <input type="number" value={localBatch.laborHours || 4} onChange={(e) => setLocalBatch({ ...localBatch, laborHours: e.target.value })} step="0.5" style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', fontSize: '12px' }}>Hourly Rate ($)</label>
                <input type="number" value={localBatch.hourlyRate || 25} onChange={(e) => setLocalBatch({ ...localBatch, hourlyRate: e.target.value })} step="0.5" style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }} />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontWeight: '600', fontSize: '13px' }}>Ingredients (KG for entire batch)</h4>
            {Object.entries(product.formulation).map(([ingredient]) => {
              const ingData = localBatch.ingredients?.[ingredient] || { kg: 1, costPerKg: ingredientCosts[ingredient] || 0 };
              return (
                <div key={ingredient} style={{ marginBottom: '12px', padding: '12px', border: '1px solid #ddd', borderRadius: '6px' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '13px' }}>{ingredient}</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>KG</label>
                      <input type="number" value={ingData.kg} onChange={(e) => setLocalBatch({ ...localBatch, ingredients: { ...localBatch.ingredients, [ingredient]: { ...ingData, kg: e.target.value } } })} step="0.1" style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>Cost/KG ($)</label>
                      <input type="number" value={ingData.costPerKg} onChange={(e) => setLocalBatch({ ...localBatch, ingredients: { ...localBatch.ingredients, [ingredient]: { ...ingData, costPerKg: e.target.value } } })} step="0.01" style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }} />
                    </div>
                  </div>
                  <div style={{ marginTop: '6px', fontSize: '11px', color: '#666' }}>= ${(parseFloat(ingData.kg) * parseFloat(ingData.costPerKg)).toFixed(2)}</div>
                </div>
              );
            })}
          </div>

          <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#fef3c7', borderRadius: '6px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontWeight: '600', fontSize: '13px' }}>Pricing</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', fontSize: '12px' }}>Retail Price ($)</label>
                <input type="number" value={localBatch.retailPrice !== undefined ? localBatch.retailPrice : (retailPrices[productId] || 0)} onChange={(e) => setLocalBatch({ ...localBatch, retailPrice: e.target.value })} step="0.01" style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', fontSize: '12px' }}>Wholesale Price ($)</label>
                <input type="number" value={localBatch.wholesalePrice !== undefined ? localBatch.wholesalePrice : (wholesalePrices[productId] || 0)} onChange={(e) => setLocalBatch({ ...localBatch, wholesalePrice: e.target.value })} step="0.01" style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }} />
              </div>
            </div>
          </div>

          <div style={{ padding: '16px', backgroundColor: '#dcfce7', borderRadius: '8px', marginBottom: '16px', fontSize: '12px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontWeight: '600', fontSize: '13px' }}>📊 Batch Results</h4>
            <div style={{ lineHeight: '1.8' }}>
              <div>Raw Materials: <span style={{ fontWeight: '600' }}>${results.ingredientTotal.toFixed(2)}</span></div>
              <div>Labor: <span style={{ fontWeight: '600' }}>${results.laborTotal.toFixed(2)}</span></div>
              <div>Packaging ({results.unitsToMake} × ${(parseFloat(localBatch.packagingUnitPrice) || 0).toFixed(2)}): <span style={{ fontWeight: '600' }}>${results.packagingTotal.toFixed(2)}</span></div>
              <div>Overhead: <span style={{ fontWeight: '600' }}>${results.overheadTotal.toFixed(2)}</span></div>
              <div>Variable: <span style={{ fontWeight: '600' }}>${results.variableTotal.toFixed(2)}</span></div>
              <div style={{ borderTop: '1px solid #86efac', paddingTop: '8px', marginTop: '8px' }}>
                <div>Subtotal: <span style={{ fontWeight: '600' }}>${results.subtotal.toFixed(2)}</span></div>
                <div>Buffer (5%): <span style={{ fontWeight: '600' }}>${results.buffer.toFixed(2)}</span></div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#2563eb', marginTop: '6px' }}>
                  Total Batch Cost: ${results.totalBatchCost.toFixed(2)}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#059669', marginTop: '4px' }}>
                  Cost/Unit: ${results.costPerUnit.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '12px', backgroundColor: '#f3e8ff', borderRadius: '6px', fontSize: '12px' }}>
              <h5 style={{ margin: '0 0 8px 0', fontWeight: '600' }}>💰 RETAIL</h5>
              <div>Price: <span style={{ fontWeight: '600' }}>${retailPrice.toFixed(2)}</span></div>
              <div>Cost: <span style={{ fontWeight: '600' }}>${results.costPerUnit.toFixed(2)}</span></div>
              <div>Profit: <span style={{ fontWeight: '600' }}>${(retailPrice - results.costPerUnit).toFixed(2)}</span></div>
              <div style={{ borderTop: '1px solid #d8b4fe', paddingTop: '6px', marginTop: '6px', fontSize: '13px', fontWeight: 'bold', color: retailColor }}>
                Margin: {retailMargin}%
              </div>
            </div>

            <div style={{ padding: '12px', backgroundColor: '#e0e7ff', borderRadius: '6px', fontSize: '12px' }}>
              <h5 style={{ margin: '0 0 8px 0', fontWeight: '600' }}>🏪 WHOLESALE</h5>
              <div>Price: <span style={{ fontWeight: '600' }}>${wholesalePrice.toFixed(2)}</span></div>
              <div>Cost: <span style={{ fontWeight: '600' }}>${results.costPerUnit.toFixed(2)}</span></div>
              <div>Profit: <span style={{ fontWeight: '600' }}>${(wholesalePrice - results.costPerUnit).toFixed(2)}</span></div>
              <div style={{ borderTop: '1px solid #c7d2fe', paddingTop: '6px', marginTop: '6px', fontSize: '13px', fontWeight: 'bold', color: wholesaleColor }}>
                Margin: {wholesaleMargin}%
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button onClick={() => setBatchModal(null)} style={{ padding: '10px 16px', backgroundColor: '#ddd', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>Close</button>
            <button onClick={() => { saveBatchToFirestore(productId, Object.assign({}, localBatch, { costPerUnit: results.costPerUnit, totalBatchCost: results.totalBatchCost, retailPrice: (typeof retailPrice === 'number' && !isNaN(retailPrice)) ? retailPrice : 0, wholesalePrice: (typeof wholesalePrice === 'number' && !isNaN(wholesalePrice)) ? wholesalePrice : 0 })); setBatchModal(null); }} style={{ padding: '10px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>💾 Save to Cloud</button>
          </div>
        </div>
      </div>
    );
  };

  const AddIngredientModal = () => {
    const [ingName, setIngName] = useState('');
    const [ingCost, setIngCost] = useState('');
    const [checkedProds, setCheckedProds] = useState({});

    const grouped = groupProductsByCategory();
    const allIdsInCategory = (sizes) =>
      Object.values(sizes).flatMap(sp => Object.values(sp).map(p => p.id));

    const handleSave = () => {
      const name = ingName.trim();
      if (!name) return;
      const cost = parseFloat(ingCost) || 0;
      const nextIngredients = { ...ingredientCosts, [name]: cost };
      const nextProducts = { ...products };
      Object.entries(checkedProds).forEach(([id, on]) => {
        if (on && nextProducts[id]) nextProducts[id] = { ...nextProducts[id], formulation: { ...nextProducts[id].formulation, [name]: 0 } };
      });
      setIngredientCosts(nextIngredients);
      setProducts(nextProducts);
      saveCatalogToFirestore(nextProducts, nextIngredients);
      setAddIngredientModal(false);
    };

    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', maxWidth: '600px', width: '95%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Add Ingredient</h2>
            <button onClick={() => setAddIngredientModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>✕</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '13px' }}>Ingredient Name</label>
              <input value={ingName} onChange={e => setIngName(e.target.value)} placeholder="e.g. Tuna" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '13px' }}>Cost ($/kg)</label>
              <input type="number" value={ingCost} onChange={e => setIngCost(e.target.value)} step="0.01" placeholder="0.00" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '10px', fontSize: '13px' }}>Add to products (optional)</label>
            {Object.entries(grouped).map(([category, sizes]) => {
              const ids = allIdsInCategory(sizes);
              const allOn = ids.length > 0 && ids.every(id => checkedProds[id]);
              return (
                <div key={category} style={{ marginBottom: '10px', border: '1px solid #e5e7eb', borderRadius: '6px', overflow: 'hidden' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', backgroundColor: '#f3f4f6', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                    <input type="checkbox" checked={allOn} onChange={e => { const next = { ...checkedProds }; ids.forEach(id => { next[id] = e.target.checked; }); setCheckedProds(next); }} />
                    {category}
                  </label>
                  <div style={{ padding: '8px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                    {Object.entries(sizes).flatMap(([size, sp]) =>
                      Object.entries(sp).map(([speciesName, { id }]) => (
                        <label key={id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                          <input type="checkbox" checked={!!checkedProds[id]} onChange={e => setCheckedProds(prev => ({ ...prev, [id]: e.target.checked }))} />
                          {speciesName} {size}
                        </label>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button onClick={() => setAddIngredientModal(false)} style={{ padding: '10px 16px', backgroundColor: '#ddd', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>Cancel</button>
            <button onClick={handleSave} disabled={!ingName.trim()} style={{ padding: '10px 16px', backgroundColor: ingName.trim() ? '#2563eb' : '#93c5fd', color: 'white', border: 'none', borderRadius: '6px', cursor: ingName.trim() ? 'pointer' : 'not-allowed', fontWeight: '600', fontSize: '13px' }}>Save Ingredient</button>
          </div>
        </div>
      </div>
    );
  };

  const AddProductModal = () => {
    const categories = [...new Set(Object.values(products).map(p => p.category))];
    const [form, setForm] = useState({ name: '', category: categories[0] || '', size: '', retailPrice: '', wholesalePrice: '' });
    const [checkedIngredients, setCheckedIngredients] = useState({});
    const canSave = form.name.trim() && form.category && form.size.trim();

    const handleSave = () => {
      if (!canSave) return;
      const sku = generateSku(form.name.trim(), form.category, form.size.trim(), products);
      const formulation = {};
      Object.entries(checkedIngredients).forEach(([ing, on]) => { if (on) formulation[ing] = 0; });
      const nextProducts = { ...products, [sku]: { name: form.name.trim(), category: form.category, size: form.size.trim(), cost: 0, formulation } };
      setProducts(nextProducts);
      setRetailPrices(prev => ({ ...prev, [sku]: parseFloat(form.retailPrice) || 0 }));
      setWholesalePrices(prev => ({ ...prev, [sku]: parseFloat(form.wholesalePrice) || 0 }));
      saveCatalogToFirestore(nextProducts, ingredientCosts);
      setAddProductModal(false);
    };

    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', maxWidth: '600px', width: '95%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Add Product</h2>
            <button onClick={() => setAddProductModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>✕</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '13px' }}>Product Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Tuna" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '13px' }}>Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '13px' }}>Size</label>
              <input value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))} placeholder="e.g. 400g" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '13px' }}>Retail Price ($)</label>
              <input type="number" value={form.retailPrice} onChange={e => setForm(f => ({ ...f, retailPrice: e.target.value }))} step="0.01" placeholder="0.00" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '13px' }}>Wholesale Price ($)</label>
              <input type="number" value={form.wholesalePrice} onChange={e => setForm(f => ({ ...f, wholesalePrice: e.target.value }))} step="0.01" placeholder="0.00" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '10px', fontSize: '13px' }}>Ingredients (optional)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', maxHeight: '160px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '10px' }}>
              {Object.keys(ingredientCosts).map(ing => (
                <label key={ing} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={!!checkedIngredients[ing]} onChange={e => setCheckedIngredients(prev => ({ ...prev, [ing]: e.target.checked }))} />
                  {ing}
                </label>
              ))}
            </div>
          </div>

          {form.name.trim() && form.size.trim() && (
            <div style={{ marginBottom: '16px', padding: '8px 12px', backgroundColor: '#f0f9ff', borderRadius: '6px', fontSize: '12px', color: '#1e40af' }}>
              SKU: <strong>{generateSku(form.name.trim(), form.category, form.size.trim(), products)}</strong>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button onClick={() => setAddProductModal(false)} style={{ padding: '10px 16px', backgroundColor: '#ddd', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>Cancel</button>
            <button onClick={handleSave} disabled={!canSave} style={{ padding: '10px 16px', backgroundColor: canSave ? '#2563eb' : '#93c5fd', color: 'white', border: 'none', borderRadius: '6px', cursor: canSave ? 'pointer' : 'not-allowed', fontWeight: '600', fontSize: '13px' }}>Save Product</button>
          </div>
        </div>
      </div>
    );
  };

  const EditIngredientModal = () => {
    const [name, setName] = useState(editIngredientModal.name);
    const [cost, setCost] = useState(String(editIngredientModal.cost));
    const oldName = editIngredientModal.oldName;

    const handleSave = () => {
      const trimmed = name.trim();
      if (!trimmed) return;
      const newCost = parseFloat(cost) || 0;
      const nextIngredients = { ...ingredientCosts };
      if (trimmed !== oldName) delete nextIngredients[oldName];
      nextIngredients[trimmed] = newCost;
      let nextProducts = products;
      if (trimmed !== oldName) {
        nextProducts = {};
        for (const [id, p] of Object.entries(products)) {
          if (p.formulation && oldName in p.formulation) {
            const f = { ...p.formulation };
            f[trimmed] = f[oldName];
            delete f[oldName];
            nextProducts[id] = { ...p, formulation: f };
          } else {
            nextProducts[id] = p;
          }
        }
      }
      setIngredientCosts(nextIngredients);
      setProducts(nextProducts);
      saveCatalogToFirestore(nextProducts, nextIngredients);
      setEditIngredientModal(null);
    };

    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', maxWidth: '400px', width: '95%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Edit Ingredient</h2>
            <button onClick={() => setEditIngredientModal(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>✕</button>
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Name</label>
            <input value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>$/kg</label>
            <input type="number" value={cost} onChange={e => setCost(e.target.value)} step="0.01" style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button onClick={() => setEditIngredientModal(null)} style={{ padding: '10px 16px', backgroundColor: '#ddd', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>Cancel</button>
            <button onClick={handleSave} disabled={!name.trim()} style={{ padding: '10px 16px', backgroundColor: name.trim() ? '#2563eb' : '#93c5fd', color: 'white', border: 'none', borderRadius: '6px', cursor: name.trim() ? 'pointer' : 'not-allowed', fontWeight: '600', fontSize: '13px' }}>Save</button>
          </div>
        </div>
      </div>
    );
  };

  const EditProductModal = () => {
    const pid = editProductModal;
    const p = products[pid];
    const [form, setForm] = useState({
      name: p.name || pid,
      category: p.category,
      size: p.size,
      retailPrice: String(retailPrices[pid] || ''),
      wholesalePrice: String(wholesalePrices[pid] || ''),
    });
    const f = v => setForm(prev => ({ ...prev, ...v }));
    const categories = [...new Set(Object.values(products).map(p => p.category))];
    const canSave = form.name.trim() && form.size.trim();

    const handleSave = () => {
      if (!canSave) return;
      const newSku = generateSku(form.name.trim(), form.category, form.size.trim(), Object.fromEntries(Object.entries(products).filter(([k]) => k !== pid)));
      const updated = { ...p, name: form.name.trim(), category: form.category, size: form.size.trim() };
      const nextProducts = { ...products };
      if (newSku !== pid) { delete nextProducts[pid]; nextProducts[newSku] = updated; } else { nextProducts[pid] = updated; }
      setProducts(nextProducts);
      if (newSku !== pid) {
        setRetailPrices(prev => { const n = { ...prev }; n[newSku] = parseFloat(form.retailPrice) || 0; delete n[pid]; return n; });
        setWholesalePrices(prev => { const n = { ...prev }; n[newSku] = parseFloat(form.wholesalePrice) || 0; delete n[pid]; return n; });
        setBatchData(prev => { const n = { ...prev }; if (n[pid]) { n[newSku] = n[pid]; delete n[pid]; } return n; });
      } else {
        setRetailPrices(prev => ({ ...prev, [pid]: parseFloat(form.retailPrice) || 0 }));
        setWholesalePrices(prev => ({ ...prev, [pid]: parseFloat(form.wholesalePrice) || 0 }));
      }
      saveCatalogToFirestore(nextProducts, ingredientCosts);
      setEditProductModal(null);
    };

    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', maxWidth: '500px', width: '95%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Edit Product</h2>
            <button onClick={() => setEditProductModal(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>✕</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Product Name</label>
              <input value={form.name} onChange={e => f({ name: e.target.value })} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Category</label>
              <select value={form.category} onChange={e => f({ category: e.target.value })} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Size</label>
              <input value={form.size} onChange={e => f({ size: e.target.value })} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Retail Price ($)</label>
              <input type="number" value={form.retailPrice} onChange={e => f({ retailPrice: e.target.value })} step="0.01" style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Wholesale Price ($)</label>
              <input type="number" value={form.wholesalePrice} onChange={e => f({ wholesalePrice: e.target.value })} step="0.01" style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
          </div>
          {form.name.trim() && form.size.trim() && (
            <div style={{ marginBottom: '16px', padding: '8px 12px', backgroundColor: '#f0f9ff', borderRadius: '6px', fontSize: '12px', color: '#1e40af' }}>
              New SKU: <strong>{generateSku(form.name.trim(), form.category, form.size.trim(), Object.fromEntries(Object.entries(products).filter(([k]) => k !== pid)))}</strong>
            </div>
          )}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button onClick={() => setEditProductModal(null)} style={{ padding: '10px 16px', backgroundColor: '#ddd', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>Cancel</button>
            <button onClick={handleSave} disabled={!canSave} style={{ padding: '10px 16px', backgroundColor: canSave ? '#2563eb' : '#93c5fd', color: 'white', border: 'none', borderRadius: '6px', cursor: canSave ? 'pointer' : 'not-allowed', fontWeight: '600', fontSize: '13px' }}>Save Product</button>
          </div>
        </div>
      </div>
    );
  };

  const ProductItem = ({ id, species, product }) => {
    const isExpanded = expandedProduct === id;
    const standardCosts = calculateTotalCost(product.cost);
    const __sv = batchData[id]; const hasBatch = __sv && __sv.costPerUnit !== undefined && __sv.costPerUnit > 0; const displayCost = hasBatch ? __sv.costPerUnit : standardCosts.total; const retail = (__sv && __sv.retailPrice !== undefined && __sv.retailPrice !== '' && !isNaN(parseFloat(__sv.retailPrice))) ? parseFloat(__sv.retailPrice) : (retailPrices[id] || 0);
    const wholesale = (__sv && __sv.wholesalePrice !== undefined && __sv.wholesalePrice !== '' && !isNaN(parseFloat(__sv.wholesalePrice))) ? parseFloat(__sv.wholesalePrice) : (wholesalePrices[id] || 0);
    const retailProfit = retail - displayCost;
    const wholesaleProfit = wholesale - displayCost;
    const retailMargin = retail > 0 ? ((retailProfit / retail) * 100).toFixed(1) : 0;
    const wholesaleMargin = wholesale > 0 ? ((wholesaleProfit / wholesale) * 100).toFixed(1) : 0;
    const retailColor = retailMargin >= 30 ? '#10b981' : retailMargin >= 15 ? '#eab308' : '#ef4444';
    const wholesaleColor = wholesaleMargin >= 20 ? '#10b981' : wholesaleMargin >= 10 ? '#eab308' : '#ef4444';

    return (
      <div style={{ marginBottom: '8px', border: '1px solid #ddd', borderRadius: '4px', padding: '12px', backgroundColor: '#fff', cursor: 'pointer' }} onClick={() => setExpandedProduct(isExpanded ? null : id)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontWeight: '600', fontSize: '14px' }}>{species}</h4>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{product.size}</p>
          </div>
          <div style={{ textAlign: 'right', marginRight: '12px' }}>
            <div style={{ fontSize: '12px', marginBottom: '4px' }}>
              <span style={{ color: retailColor, fontWeight: '600' }}>🛒 {retailMargin}%</span> | 
              <span style={{ color: wholesaleColor, fontWeight: '600', marginLeft: '8px' }}>🏪 {wholesaleMargin}%</span>
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#2563eb' }}>${displayCost.toFixed(2)}</div>
          </div>
          <div style={{ fontSize: '16px', color: '#999' }}>{isExpanded ? '▼' : '▶'}</div>
        </div>

        {isExpanded && (
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #ddd' }}>
            <div style={{ marginBottom: '12px', fontSize: '12px' }}>
              <h5 style={{ fontWeight: '600', margin: '0 0 6px 0' }}>{hasBatch ? 'Cost Summary (Per Unit)' : 'Standard Estimate (Per Unit)'}</h5>
              <div>Raw Materials: <span style={{ fontWeight: '600' }}>${standardCosts.rawMaterial.toFixed(2)}</span></div>
              <div>Labor: <span style={{ fontWeight: '600' }}>${standardCosts.labor.toFixed(2)}</span></div>
              <div>Overhead: <span style={{ fontWeight: '600' }}>${standardCosts.overhead.toFixed(2)}</span></div>
              <div>Variable: <span style={{ fontWeight: '600' }}>${standardCosts.variableCosts.toFixed(2)}</span></div>
              <div style={{ borderTop: '1px solid #ddd', paddingTop: '6px', marginTop: '6px' }}>
                <div>Subtotal: <span style={{ fontWeight: '600' }}>${standardCosts.subtotal.toFixed(2)}</span></div>
                <div>Buffer (5%): <span style={{ fontWeight: '600' }}>${standardCosts.buffer.toFixed(2)}</span></div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#2563eb', marginTop: '4px' }}>{hasBatch ? 'Batch Cost/Unit: $' : 'Total: $'}{displayCost.toFixed(2)}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div style={{ padding: '12px', backgroundColor: '#f3e8ff', borderRadius: '6px', fontSize: '12px' }}>
                <h5 style={{ margin: '0 0 8px 0', fontWeight: '600' }}>💰 Retail</h5>
                <div>Price: ${retail.toFixed(2)}</div>
                <div>Profit: ${retailProfit.toFixed(2)}</div>
                <div style={{ borderTop: '1px solid #d8b4fe', paddingTop: '6px', marginTop: '6px', fontWeight: 'bold', color: retailColor }}>
                  {retailMargin}% margin
                </div>
              </div>

              <div style={{ padding: '12px', backgroundColor: '#e0e7ff', borderRadius: '6px', fontSize: '12px' }}>
                <h5 style={{ margin: '0 0 8px 0', fontWeight: '600' }}>🏪 Wholesale</h5>
                <div>Price: ${wholesale.toFixed(2)}</div>
                <div>Profit: ${wholesaleProfit.toFixed(2)}</div>
                <div style={{ borderTop: '1px solid #c7d2fe', paddingTop: '6px', marginTop: '6px', fontWeight: 'bold', color: wholesaleColor }}>
                  {wholesaleMargin}% margin
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <button onClick={(e) => { e.stopPropagation(); setEditProductModal(id); }} style={{ flex: 1, padding: '8px', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>Edit</button>
              <button onClick={(e) => { e.stopPropagation(); if (window.confirm(`Delete "${species} ${product.size}"? This cannot be undone.`)) { const nextProducts = { ...products }; delete nextProducts[id]; setProducts(nextProducts); setRetailPrices(prev => { const n = { ...prev }; delete n[id]; return n; }); setWholesalePrices(prev => { const n = { ...prev }; delete n[id]; return n; }); setBatchData(prev => { const n = { ...prev }; delete n[id]; return n; }); saveCatalogToFirestore(nextProducts, ingredientCosts); setExpandedProduct(null); } }} style={{ flex: 1, padding: '8px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>Delete</button>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setBatchModal(id); }} style={{ width: '100%', padding: '8px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>📊 Batch Costing</button>
          </div>
        )}
      </div>
    );
  };

  const CategorySection = ({ categoryName, sizes }) => {
    const isExpanded = expandedCategory === categoryName;
    
    return (
      <div style={{ marginBottom: '12px', border: '2px solid #2563eb', borderRadius: '8px', overflow: 'hidden' }}>
        <button onClick={() => setExpandedCategory(isExpanded ? null : categoryName)} style={{ width: '100%', padding: '16px', backgroundColor: '#2563eb', color: 'white', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '16px', textAlign: 'left' }}>
          {isExpanded ? '▼' : '▶'} {categoryName}
        </button>
        {isExpanded && (
          <div style={{ padding: '12px' }}>
            {Object.entries(sizes).map(([size, species]) => (
              <div key={size} style={{ marginBottom: '12px', border: '1px solid #bfdbfe', borderRadius: '6px', overflow: 'hidden' }}>
                <button onClick={() => setExpandedSize({ ...expandedSize, [`${categoryName}-${size}`]: !expandedSize[`${categoryName}-${size}`] })} style={{ width: '100%', padding: '12px', backgroundColor: '#dbeafe', color: '#1e40af', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px', textAlign: 'left' }}>
                  {expandedSize[`${categoryName}-${size}`] ? '▼' : '▶'} {size}
                </button>
                {expandedSize[`${categoryName}-${size}`] && (
                  <div style={{ padding: '12px', marginLeft: '12px' }}>
                    {Object.entries(species).map(([speciesName, { id, ...prod }]) => (
                      <ProductItem key={id} id={id} species={speciesName} product={prod} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
      <div style={{ backgroundColor: '#2563eb', color: 'white', padding: '16px', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 4px 0' }}>🧮 Formula Raw Production Costing</h1>
            <p style={{ fontSize: '13px', color: '#93c5fd', margin: 0 }}>Retail vs Wholesale Margin Analysis</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            {user ? (
              <div>
                <div style={{ fontSize: '13px', marginBottom: '8px', color: '#93c5fd' }}>👤 {user.email}</div>
                <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>Logout</button>
              </div>
            ) : (
              <button onClick={handleGoogleLogin} style={{ padding: '8px 16px', backgroundColor: '#fff', color: '#2563eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>🔐 Login with Google</button>
            )}
          </div>
        </div>
      </div>

      {!user && (
        <div style={{ padding: '20px', backgroundColor: '#fef3c7', borderBottom: '1px solid #fcd34d', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#92400e' }}>📝 Login to save your batch data to the cloud</p>
        </div>
      )}

      <div style={{ display: 'flex', borderBottom: '1px solid #ddd', backgroundColor: '#fff' }}>
        <button onClick={() => setActiveTab('products')} style={{ flex: 1, padding: '12px 16px', fontWeight: '600', fontSize: '13px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', borderBottom: activeTab === 'products' ? '2px solid #2563eb' : 'none', color: activeTab === 'products' ? '#2563eb' : '#666' }}>
          Products ({Object.keys(products).length})
        </button>
        <button onClick={() => setActiveTab('ingredients')} style={{ flex: 1, padding: '12px 16px', fontWeight: '600', fontSize: '13px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', borderBottom: activeTab === 'ingredients' ? '2px solid #2563eb' : 'none', color: activeTab === 'ingredients' ? '#2563eb' : '#666' }}>
          Ingredients
        </button>
        <button onClick={() => setActiveTab('settings')} style={{ flex: 1, padding: '12px 16px', fontWeight: '600', fontSize: '13px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', borderBottom: activeTab === 'settings' ? '2px solid #2563eb' : 'none', color: activeTab === 'settings' ? '#2563eb' : '#666' }}>
          Settings
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {activeTab === 'products' && (
          <div style={{ maxWidth: '900px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '14px', color: '#666' }}>{Object.keys(products).length} products</span>
              <button onClick={() => setAddProductModal(true)} style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>+ Add Product</button>
            </div>
            {Object.entries(groupedProducts).map(([category, sizes]) => (
              <CategorySection key={category} categoryName={category} sizes={sizes} />
            ))}
          </div>
        )}

        {activeTab === 'ingredients' && (
          <div style={{ maxWidth: '900px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Ingredient Costs</h2>
              <button onClick={() => setAddIngredientModal(true)} style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>+ Add Ingredient</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {Object.entries(ingredientCosts).map(([ingredient, cost]) => (
                <div key={ingredient} style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #ddd' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600' }}>{ingredient}</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => setEditIngredientModal({ oldName: ingredient, name: ingredient, cost })} style={{ padding: '3px 8px', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>Edit</button>
                      <button onClick={() => { const usedIn = Object.values(products).filter(p => p.formulation && ingredient in p.formulation).length; if (window.confirm(usedIn > 0 ? `"${ingredient}" is used in ${usedIn} product${usedIn > 1 ? 's' : ''} — remove from all?` : `Delete "${ingredient}"?`)) { const nextIngredients = { ...ingredientCosts }; delete nextIngredients[ingredient]; const nextProducts = {}; for (const [id, p] of Object.entries(products)) { if (p.formulation && ingredient in p.formulation) { const f = { ...p.formulation }; delete f[ingredient]; nextProducts[id] = { ...p, formulation: f }; } else { nextProducts[id] = p; } } setIngredientCosts(nextIngredients); setProducts(nextProducts); saveCatalogToFirestore(nextProducts, nextIngredients); } }} style={{ padding: '3px 8px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>Delete</button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#666' }}>$/kg</span>
                    <input type="number" value={cost} onChange={(e) => setIngredientCosts({ ...ingredientCosts, [ingredient]: parseFloat(e.target.value) || 0 })} step="0.01" style={{ flex: 1, padding: '6px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div style={{ maxWidth: '900px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>Settings</h2>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Labor Cost per Unit ($)</label>
              <input type="number" value={laborPerUnit} onChange={(e) => setLaborPerUnit(parseFloat(e.target.value) || 0)} step="0.01" style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Overhead Cost per Unit ($)</label>
              <input type="number" value={overheadPerUnit} onChange={(e) => setOverheadPerUnit(parseFloat(e.target.value) || 0)} step="0.01" style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
          </div>
        )}
      </div>

      {batchModal && <BatchModal productId={batchModal} product={products[batchModal]} />}
      {addIngredientModal && <AddIngredientModal />}
      {addProductModal && <AddProductModal />}
      {editIngredientModal && <EditIngredientModal />}
      {editProductModal && products[editProductModal] && <EditProductModal />}
    </div>
  );
}
