import React, { useState, useRef, useEffect } from 'react';
import { Plus, Search, MoreHorizontal, ArrowUpDown, Sparkles, FileUp, FileDown, Users, ShoppingBag, ChevronLeft, ChevronRight, Eye, Trash2, ListPlus, Palette, Star, MessageSquare, X, Copy, Archive, CheckCircle, AlertTriangle, Image as ImageIcon, RefreshCw, Upload, Percent, Calendar } from 'lucide-react';
<<<<<<< HEAD
import { Product, ProductAttribute, ProductVariant } from '../types';
import { generateProductDescription } from '../services/geminiService';
import { fetchProducts, createProduct, updateProduct, deleteProduct, importProducts } from '../services/api';
import { DashboardView } from './DashboardView';
=======
import { MOCK_PRODUCTS, MOCK_BRANDS } from '../constants'; // Fallback
import { Product, ProductAttribute, ProductVariant } from '../types';
import { generateProductDescription } from '../services/geminiService';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../services/api';
>>>>>>> 1e65977e (connnect)

interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

interface ProductsViewProps {
  initialSearchTerm?: string;
}

export const ProductsView: React.FC<ProductsViewProps> = ({ initialSearchTerm = '' }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Selection State for Bulk Actions
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Action Menu State
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  // Reviews Modal State
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedProductReviews, setSelectedProductReviews] = useState<Review[]>([]);
  const [selectedProductName, setSelectedProductName] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);

  // Search State
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [searchInput, setSearchInput] = useState(initialSearchTerm);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const productImageInputRef = useRef<HTMLInputElement>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState<Partial<Product>>({
    id: undefined,
    name: '',
    category: 'Computers',
<<<<<<< HEAD
=======
    brand: '',
>>>>>>> 1e65977e (connnect)
    b2cPrice: 0,
    compareAtPrice: 0,
    b2bPrice: 0,
    description: '',
    status: 'Active',
    image: '',
    attributes: [],
    variants: [],
<<<<<<< HEAD
    // Regular discounts (permanent)
    b2cDiscount: 0,
    b2bDiscount: 0,
    // Active offer fields (time-limited)
    b2cOfferPercentage: 0,
    b2cOfferPrice: 0,
    b2cOfferStartDate: '',
    b2cOfferEndDate: '',
    b2bOfferPercentage: 0,
    b2bOfferPrice: 0,
    b2bOfferStartDate: '',
    b2bOfferEndDate: '',
    // Tax and Compliance
    sgst: 0,
    cgst: 0,
    hsn: '',
    returnPolicy: '',
    // Dimensions
    height: 0,
    weight: 0,
    breadth: 0,
    length: 0
=======
    b2cOfferPercentage: 0,
    b2cOfferStartDate: '',
    b2cOfferEndDate: '',
    b2bOfferPercentage: 0,
    b2bOfferStartDate: '',
    b2bOfferEndDate: ''
>>>>>>> 1e65977e (connnect)
  });

  const [newAttribute, setNewAttribute] = useState({ name: '', value: '' });
  const [newVariant, setNewVariant] = useState<ProductVariant>({ color: '', colorCode: '#000000', stock: 0 });

<<<<<<< HEAD
  // Color name to hex converter
  const getColorHex = (colorName: string): string => {
    const colors: { [key: string]: string } = {
      // Basic colors
      'red': '#FF0000', 'blue': '#0000FF', 'green': '#008000', 'yellow': '#FFFF00',
      'black': '#000000', 'white': '#FFFFFF', 'gray': '#808080', 'grey': '#808080',
      'orange': '#FFA500', 'purple': '#800080', 'pink': '#FFC0CB', 'brown': '#A52A2A',
      'cyan': '#00FFFF', 'magenta': '#FF00FF', 'lime': '#00FF00', 'navy': '#000080',
      'teal': '#008080', 'olive': '#808000', 'maroon': '#800000', 'aqua': '#00FFFF',
      'silver': '#C0C0C0', 'gold': '#FFD700', 'beige': '#F5F5DC', 'ivory': '#FFFFF0',
      'violet': '#EE82EE', 'indigo': '#4B0082', 'turquoise': '#40E0D0', 'coral': '#FF7F50',
      'salmon': '#FA8072', 'khaki': '#F0E68C', 'lavender': '#E6E6FA', 'plum': '#DDA0DD',
      'crimson': '#DC143C', 'mint': '#98FF98', 'peach': '#FFDAB9', 'rose': '#FF007F',
      // Common product colors
      'sky blue': '#87CEEB', 'dark blue': '#00008B', 'light blue': '#ADD8E6',
      'dark green': '#006400', 'light green': '#90EE90', 'forest green': '#228B22',
      'dark red': '#8B0000', 'light red': '#FF6B6B', 'bright red': '#FF0000',
      'dark gray': '#A9A9A9', 'light gray': '#D3D3D3', 'charcoal': '#36454F'
    };

    const normalized = colorName.toLowerCase().trim();
    return colors[normalized] || '#000000';
  };

  // Load Data from API
  // Load products on mount
  useEffect(() => {
    loadProducts();

    // Auto-refresh every 60 seconds to check for expired offers
    const intervalId = setInterval(() => {
      console.log('Auto-refreshing products to check for expired offers...');
      loadProducts();
    }, 60000); // 60 seconds

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (e: any) {
      console.error("Failed to load products from backend:", e);
      setError(e.message || "Failed to load products. Please check if the backend is running.");
      setProducts([]);
=======
  // Load Data from API
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (e) {
      console.warn("Backend not available, using MOCK data.");
      setProducts(MOCK_PRODUCTS);
>>>>>>> 1e65977e (connnect)
    } finally {
      setLoading(false);
    }
  };

  // Sync with global search prop
  useEffect(() => {
    if (initialSearchTerm !== undefined) {
      setSearchTerm(initialSearchTerm);
      setSearchInput(initialSearchTerm);
      setCurrentPage(1);
    }
  }, [initialSearchTerm]);

  // Click outside to close action menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setOpenActionMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filtering and Pagination logic
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
<<<<<<< HEAD
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
=======
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase()))
>>>>>>> 1e65977e (connnect)
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // --- Search Handlers ---
  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  // --- Bulk Selection Handlers ---
  const toggleSelectAll = () => {
    const currentIds = currentProducts.map(p => p.id);
    const allSelected = currentIds.every(id => selectedProductIds.includes(id));

    if (allSelected) {
      setSelectedProductIds(prev => prev.filter(id => !currentIds.includes(id)));
    } else {
      const newIds = currentIds.filter(id => !selectedProductIds.includes(id));
      setSelectedProductIds(prev => [...prev, ...newIds]);
    }
  };

  const toggleSelectProduct = (id: string) => {
    setSelectedProductIds(prev =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedProductIds.length === 0) return;
    setIsBulkDelete(true);
    setShowDeleteModal(true);
  };

  const handleGenerateDescription = async () => {
    if (!formData.name) return;
    setIsGenerating(true);
    const description = await generateProductDescription(formData.name, formData.category || 'Electronics');
    setFormData(prev => ({ ...prev, description }));
    setIsGenerating(false);
  };

  const resetForm = () => {
    setFormData({
      id: undefined,
      name: '',
      category: 'Computers',
<<<<<<< HEAD
=======
      brand: '',
>>>>>>> 1e65977e (connnect)
      b2cPrice: 0,
      compareAtPrice: 0,
      b2bPrice: 0,
      description: '',
      status: 'Active',
      image: '',
      attributes: [],
      variants: [],
<<<<<<< HEAD
      // Regular discounts (permanent)
      b2cDiscount: 0,
      b2bDiscount: 0,
      // Active offer fields (time-limited)
      b2cOfferPercentage: 0,
      b2cOfferPrice: 0,
      b2cOfferStartDate: '',
      b2cOfferEndDate: '',
      b2bOfferPercentage: 0,
      b2bOfferPrice: 0,
      b2bOfferStartDate: '',
      b2bOfferEndDate: '',
      // Tax and Compliance
      sgst: 0,
      cgst: 0,
      hsn: '',
      returnPolicy: '',
      // Dimensions
      height: 0,
      weight: 0,
      breadth: 0,
      length: 0
=======
      b2cOfferPercentage: 0,
      b2cOfferStartDate: '',
      b2cOfferEndDate: '',
      b2bOfferPercentage: 0,
      b2bOfferStartDate: '',
      b2bOfferEndDate: ''
>>>>>>> 1e65977e (connnect)
    });
    setNewAttribute({ name: '', value: '' });
    setNewVariant({ color: '', colorCode: '#000000', stock: 0 });
  };

  const handleEditProduct = (product: Product) => {
    setFormData({
      ...product,
<<<<<<< HEAD
      description: product.description || '',
      compareAtPrice: product.compareAtPrice || 0,
      attributes: product.attributes || [],
      variants: product.variants || [],
      // Regular discounts (always visible)
      b2cDiscount: product.b2cDiscount || 0,
      b2bDiscount: product.b2bDiscount || 0,
      // Active offer fields - separate from regular discounts
      b2cOfferPercentage: product.b2cOfferPercentage || 0,
      b2cOfferPrice: product.b2cOfferPrice || 0,
      b2cOfferStartDate: product.b2cOfferStartDate || '',
      b2cOfferEndDate: product.b2cOfferEndDate || '',
      b2bOfferPercentage: product.b2bOfferPercentage || 0,
      b2bOfferPrice: product.b2bOfferPrice || 0,
      b2bOfferStartDate: product.b2bOfferStartDate || '',
      b2bOfferEndDate: product.b2bOfferEndDate || '',
      // Tax and Compliance
      sgst: product.sgst || 0,
      cgst: product.cgst || 0,
      hsn: product.hsn || '',
      returnPolicy: product.returnPolicy || '',
      // Dimensions
      height: product.height || 0,
      weight: product.weight || 0,
      breadth: product.breadth || 0,
      length: product.length || 0
=======
      compareAtPrice: product.compareAtPrice || 0,
      attributes: product.attributes || [],
      variants: product.variants || [],
      b2cOfferPercentage: product.b2cOfferPercentage || 0,
      b2cOfferStartDate: product.b2cOfferStartDate || '',
      b2cOfferEndDate: product.b2cOfferEndDate || '',
      b2bOfferPercentage: product.b2bOfferPercentage || 0,
      b2bOfferStartDate: product.b2bOfferStartDate || '',
      b2bOfferEndDate: product.b2bOfferEndDate || ''
>>>>>>> 1e65977e (connnect)
    });
    setShowModal(true);
    setOpenActionMenuId(null);
  };

  const handleDuplicateProduct = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    try {
      const newProduct = {
        ...product,
        id: undefined, // Let backend generate
        name: `${product.name} (Copy)`,
        status: 'Draft' as const
      };
      await createProduct(newProduct);
      loadProducts(); // Refresh
    } catch (e) {
<<<<<<< HEAD
      console.error("Backend unavailable:", e);
      alert("Failed to duplicate product. Please check your connection.");
=======
      console.warn("Backend unavailable, duplicating in local state");
      const newProduct = {
        ...product,
        id: `prod_${Date.now()}`,
        name: `${product.name} (Copy)`,
        status: 'Draft' as const
      };
      setProducts(prev => [newProduct, ...prev]);
>>>>>>> 1e65977e (connnect)
    } finally {
      setOpenActionMenuId(null);
    }
  };

<<<<<<< HEAD
  const handleToggleStatus = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const newStatus = product.status === 'Archived' ? 'Active' : 'Archived';

    // Optimistic Update
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: newStatus } : p));
    setOpenActionMenuId(null);

    try {
      await updateProduct(product.id, { status: newStatus });
    } catch (e) {
      console.error("Failed to update status:", e);
      alert("Failed to update status. Reverting changes.");
      // Revert
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: product.status } : p));
    }
=======
  const handleToggleStatus = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    // Optimistic Update
    const newStatus = product.status === 'Archived' ? 'Active' : 'Archived';
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: newStatus } : p));
    setOpenActionMenuId(null);
>>>>>>> 1e65977e (connnect)
  };

  // Trigger Delete Modal
  const confirmDeleteProduct = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setProductToDelete(id);
    setIsBulkDelete(false);
    setShowDeleteModal(true);
    setOpenActionMenuId(null);
  };

  // Execute Deletion
  const executeDelete = async () => {
    if (isBulkDelete) {
<<<<<<< HEAD
      try {
        // Delete all selected products
        await Promise.all(selectedProductIds.map(id => deleteProduct(id)));
        loadProducts(); // Refresh from server
      } catch (e) {
        console.error("Error deleting products:", e);
        alert("Failed to delete products. Please check your connection.");
      }
=======
      // Bulk delete logic would go here
      // For fallback, we filter locally
      setProducts(prev => prev.filter(p => !selectedProductIds.includes(p.id)));
>>>>>>> 1e65977e (connnect)
      setSelectedProductIds([]);
      setIsBulkDelete(false);
    } else if (productToDelete) {
      try {
        await deleteProduct(productToDelete);
        loadProducts(); // Refresh
      } catch (e) {
<<<<<<< HEAD
        console.error("Backend unavailable:", e);
        alert("Failed to delete product. Please check your connection.");
=======
        console.warn("Backend unavailable, deleting from local state");
        // Fallback for mock environment
        setProducts(prev => prev.filter(p => p.id !== productToDelete));
>>>>>>> 1e65977e (connnect)
      }
      setProductToDelete(null);
    }
    setShowDeleteModal(false);
  };

  const handleSaveProduct = async () => {
<<<<<<< HEAD
    // Validation
    if (!formData.name || formData.name.trim() === '') {
      alert("Please enter a product name.");
      return;
    }

    if ((!formData.b2cPrice || formData.b2cPrice <= 0) && (!formData.b2bPrice || formData.b2bPrice <= 0)) {
      alert("Please enter a valid price (B2C or B2B).");
      return;
    }

=======
>>>>>>> 1e65977e (connnect)
    let finalStock = formData.stock || 0;
    if (formData.variants && formData.variants.length > 0) {
      finalStock = formData.variants.reduce((sum, v) => sum + v.stock, 0);
    }

<<<<<<< HEAD
    let b2cOfferPrice = formData.b2cOfferPrice || 0;
    let b2bOfferPrice = formData.b2bOfferPrice || 0;

    // Only calculate active offer if admin actually sets the offer percentage
    const hasActiveB2COffer =
      formData.b2cOfferPercentage > 0 &&
      formData.b2cOfferStartDate &&
      formData.b2cOfferEndDate;

    const hasActiveB2BOffer =
      formData.b2bOfferPercentage > 0 &&
      formData.b2bOfferStartDate &&
      formData.b2bOfferEndDate;

    // Only THEN calculate active offer price
    if (hasActiveB2COffer) {
      b2cOfferPrice = Math.round(
        formData.b2cPrice - (formData.b2cPrice * (formData.b2cOfferPercentage / 100))
      );
    }

    if (hasActiveB2BOffer) {
      b2bOfferPrice = Math.round(
        formData.b2bPrice - (formData.b2bPrice * (formData.b2bOfferPercentage / 100))
      );
    }

    // If admin didn't set an active offer → keep offer price = 0
    if (!hasActiveB2COffer) b2cOfferPrice = 0;
    if (!hasActiveB2BOffer) b2bOfferPrice = 0;

    const productData = {
      ...formData,
      description: formData.description || '',
      stock: finalStock,
      image: formData.image || `https://picsum.photos/200/200?random=${Date.now()}`,
      // Set active offer prices
      b2cOfferPrice: b2cOfferPrice > 0 ? b2cOfferPrice : 0,
      b2bOfferPrice: b2bOfferPrice > 0 ? b2bOfferPrice : 0,
      // Sanitize dates: Convert empty strings to null/undefined
      b2cOfferStartDate: formData.b2cOfferStartDate || null,
      b2cOfferEndDate: formData.b2cOfferEndDate || null,
      b2bOfferStartDate: formData.b2bOfferStartDate || null,
      b2bOfferEndDate: formData.b2bOfferEndDate || null
=======
    const productData = {
      ...formData,
      stock: finalStock,
      image: formData.image || `https://picsum.photos/200/200?random=${Date.now()}`
>>>>>>> 1e65977e (connnect)
    };

    try {
      if (formData.id) {
        await updateProduct(formData.id, productData);
      } else {
        await createProduct(productData);
      }
      loadProducts(); // Refresh from server
    } catch (e) {
<<<<<<< HEAD
      console.error("Backend unavailable:", e);
      alert("Failed to save product. Please check your connection.");
=======
      console.warn("Backend unavailable, saving to local state");
      if (formData.id) {
        // Update existing
        setProducts(prev => prev.map(p => p.id === formData.id ? { ...p, ...productData } as Product : p));
      } else {
        // Create new
        const newProduct = {
          ...productData,
          id: `prod_${Date.now()}`,
          rating: 0,
          reviews: 0
        } as Product;
        setProducts(prev => [newProduct, ...prev]);
      }
>>>>>>> 1e65977e (connnect)
    }
    setShowModal(false);
    resetForm();
  };

  // ... Attribute and Variant handlers ...
  const handleAddAttribute = () => {
    if (newAttribute.name && newAttribute.value) {
      setFormData(prev => ({
        ...prev,
        attributes: [...(prev.attributes || []), newAttribute]
      }));
      setNewAttribute({ name: '', value: '' });
    }
  };

  const handleRemoveAttribute = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attributes: (prev.attributes || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddVariant = () => {
    if (newVariant.color && newVariant.stock >= 0) {
      setFormData(prev => ({
        ...prev,
        variants: [...(prev.variants || []), newVariant]
      }));
      setNewVariant({ color: '', colorCode: '#000000', stock: 0 });
    }
  };

  const handleRemoveVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: (prev.variants || []).filter((_, i) => i !== index)
    }));
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const handleViewReviews = (product: Product) => {
    const count = product.reviews || 0;
    const baseRating = product.rating || 4.0;

    const mockReviews: Review[] = Array.from({ length: Math.min(count, 8) }).map((_, i) => ({
      id: i,
      user: `Customer ${Math.floor(Math.random() * 10000)}`,
      rating: Math.min(5, Math.max(1, baseRating + (Math.random() * 2 - 1))),
      comment: [
        "Great product, really happy with the quality!",
        "Delivery was fast, but the packaging could be better.",
        "Excellent value for money.",
        "Works exactly as described.",
        "Customer service was helpful.",
        "A bit expensive, but worth it.",
        "Solid build quality.",
        "Would recommend to a friend."
      ][Math.floor(Math.random() * 8)],
      date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString()
    }));

    setSelectedProductReviews(mockReviews);
    setSelectedProductName(product.name);
    setShowReviewsModal(true);
  };

<<<<<<< HEAD
  // Helper function to format date with time for Excel export
  const formatDateTime = (dateValue: string | null | undefined): string => {
    if (!dateValue) return '';
    const d = new Date(dateValue);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
  };

  // --- Export/Import Logic ---
  const handleExport = async () => {
    try {
      // Dynamically import xlsx library
      const XLSX = await import('xlsx');

      const productsToExport = selectedProductIds.length > 0
        ? products.filter(p => selectedProductIds.includes(p.id))
        : products;

      // Prepare data for Excel export
      const excelData = productsToExport.map(p => ({
        'Product ID': p.id,
        'Name': p.name,
        'Category': p.category,
        'B2C Price': p.b2cPrice || 0,
        'B2B Price': p.b2bPrice || 0,
        'MRP': p.compareAtPrice || 0,
        'B2C Discount %': p.b2cDiscount || 0,
        'B2B Discount %': p.b2bDiscount || 0,
        'B2C Active Offer %': p.b2cOfferPercentage || 0,
        'B2C Offer Price': p.b2cOfferPrice || 0,
        'B2C Offer Start Date': formatDateTime(p.b2cOfferStartDate),
        'B2C Offer End Date': formatDateTime(p.b2cOfferEndDate),
        'B2B Active Offer %': p.b2bOfferPercentage || 0,
        'B2B Offer Price': p.b2bOfferPrice || 0,
        'B2B Offer Start Date': formatDateTime(p.b2bOfferStartDate),
        'B2B Offer End Date': formatDateTime(p.b2bOfferEndDate),
        'Stock': p.stock || 0,
        'Variants (Colors)': p.variants && p.variants.length > 0
          ? p.variants.map(v => `${v.color} (Stock: ${v.stock})`).join(', ')
          : '',
        'Description': p.description || '',
        'Status': p.status,
        'SGST %': p.sgst || 0,
        'CGST %': p.cgst || 0,
        'HSN Code': p.hsn || '',
        'Return Policy': p.returnPolicy || '',
        'Height (cm)': p.height || 0,
        'Weight (kg)': p.weight || 0,
        'Breadth (cm)': p.breadth || 0,
        'Length (cm)': p.length || 0,

        'Image URL': p.image || '',
        'Rating': p.rating || 0,
        'Reviews': p.reviews || 0,
        'Created Date': p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ''
      }));

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      const columnWidths = [
        { wch: 15 }, // Product ID
        { wch: 30 }, // Name
        { wch: 15 }, // Category
        { wch: 12 }, // B2C Price
        { wch: 12 }, // B2B Price
        { wch: 12 }, // MRP
        { wch: 15 }, // B2C Discount %
        { wch: 15 }, // B2B Discount %
        { wch: 18 }, // B2C Active Offer %
        { wch: 15 }, // B2C Offer Price
        { wch: 18 }, // B2C Offer Start Date
        { wch: 18 }, // B2C Offer End Date
        { wch: 18 }, // B2B Active Offer %
        { wch: 15 }, // B2B Offer Price
        { wch: 18 }, // B2B Offer Start Date
        { wch: 18 }, // B2B Offer End Date
        { wch: 10 }, // Stock
        { wch: 30 }, // Variants (Colors)
        { wch: 40 }, // Description
        { wch: 10 }, // Status
        { wch: 10 }, // SGST %
        { wch: 10 }, // CGST %
        { wch: 15 }, // HSN Code
        { wch: 30 }, // Return Policy
        { wch: 12 }, // Height
        { wch: 12 }, // Weight
        { wch: 12 }, // Breadth
        { wch: 12 }, // Length

        { wch: 50 }, // Image URL
        { wch: 10 }, // Rating
        { wch: 10 }, // Reviews
        { wch: 15 }  // Created Date
      ];
      worksheet['!cols'] = columnWidths;

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

      // Generate Excel file
      const fileName = selectedProductIds.length > 0
        ? `selected_products_${new Date().toISOString().split('T')[0]}.xlsx`
        : `all_products_${new Date().toISOString().split('T')[0]}.xlsx`;

      XLSX.writeFile(workbook, fileName);

      console.log(`✅ Exported ${productsToExport.length} products as Excel file`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export products. Installing xlsx library...');
      // Fallback to CSV if xlsx is not available
      window.open('https://www.npmjs.com/package/xlsx', '_blank');
=======
  // --- Export/Import Logic ---
  const handleExport = () => {
    const headers = [
      'ID', 'Name', 'Category', 'Brand', 'B2C Selling Price', 'MRP', 'B2C Offer %', 'B2B Selling Price', 'B2B Offer %', 'Stock', 'Status'
    ];

    const productsToExport = selectedProductIds.length > 0
      ? products.filter(p => selectedProductIds.includes(p.id))
      : products;

    const rows = productsToExport.map(p => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.category,
      p.brand || '',
      p.b2cPrice,
      p.compareAtPrice || 0,
      `${p.b2cOfferPercentage || 0}%`,
      p.b2bPrice,
      `${p.b2bOfferPercentage || 0}%`,
      p.stock,
      p.status
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', selectedProductIds.length > 0 ? 'selected_products.csv' : 'all_products.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
>>>>>>> 1e65977e (connnect)
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

<<<<<<< HEAD
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type - accept both Excel and CSV
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
      alert("Please upload an Excel file (.xlsx, .xls) or CSV file (.csv)");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      setLoading(true);
      const result = await importProducts(file);

      let message = `Import Complete!\n\n✅ Successfully imported: ${result.success} products`;
      if (result.failed > 0) {
        message += `\n❌ Failed: ${result.failed} products`;
        if (result.errors && result.errors.length > 0) {
          message += `\n\nErrors:\n${result.errors.slice(0, 5).join('\n')}`;
          if (result.errors.length > 5) {
            message += `\n... and ${result.errors.length - 5} more errors`;
          }
        }
      }

      alert(message);

      // Wait a bit to ensure database commit completes before refreshing
      setTimeout(() => {
        loadProducts(); // Refresh the product list
      }, 500);
    } catch (error: any) {
      console.error("Import failed:", error);
      alert(`Import failed: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
=======
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      // Mock Import Logic - Simplified
      alert("Import functionality mocked for demo.");
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
>>>>>>> 1e65977e (connnect)
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData(prev => ({ ...prev, image: event.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
<<<<<<< HEAD
        {[...Array(5)].map((_, i) => {
          const fillPercentage = Math.max(0, Math.min(1, rating - i));
          return (
            <div key={i} className="relative w-3 h-3 mr-0.5">
              {/* Background star (gray) */}
              <Star
                size={12}
                className="absolute text-gray-300"
              />
              {/* Filled star (yellow) - clipped based on rating */}
              <div
                className="absolute overflow-hidden"
                style={{ width: `${fillPercentage * 100}%` }}
              >
                <Star
                  size={12}
                  className="text-yellow-400 fill-yellow-400"
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };
=======
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={12}
            className={`${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

>>>>>>> 1e65977e (connnect)
  const calculateDiscount = (original: number, selling: number) => {
    if (!original || original <= selling) return 0;
    return Math.round(((original - selling) / original) * 100);
  };

  const checkOfferStatus = (percentage?: number, startStr?: string, endStr?: string) => {
    if (!percentage || !startStr || !endStr) return false;
    const now = new Date();
    const start = new Date(startStr);
    const end = new Date(endStr);
    return now >= start && now <= end;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <RefreshCw size={32} className="animate-spin mb-4 text-indigo-500" />
        <p>Loading Inventory...</p>
      </div>
    );
  }

<<<<<<< HEAD
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <AlertTriangle size={32} className="mb-4" />
        <p className="font-semibold">Error Loading Products</p>
        <p className="text-sm text-gray-600 mt-1">{error}</p>
        <button
          onClick={loadProducts}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

=======
>>>>>>> 1e65977e (connnect)
  return (
    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Products</h2>
          <p className="text-muted-foreground">Manage your electrical and electronics inventory ({products.length.toLocaleString()} items).</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Bulk Delete Button */}
          {selectedProductIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-red-600 text-white shadow-sm hover:bg-red-700 h-9 px-4 py-2 animate-in fade-in duration-200"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete ({selectedProductIds.length})
            </button>
          )}
          <button
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-white shadow-sm hover:bg-gray-100 h-9 px-4 py-2 text-gray-900"
            onClick={handleExport}
          >
            <FileDown className="mr-2 h-4 w-4" /> Export {selectedProductIds.length > 0 ? `(${selectedProductIds.length})` : 'All'}
          </button>
<<<<<<< HEAD
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".xlsx,.xls,.csv" className="hidden" />
=======
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv" className="hidden" />
>>>>>>> 1e65977e (connnect)
          <button
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-white shadow-sm hover:bg-gray-100 h-9 px-4 py-2 text-gray-900"
            onClick={handleImportClick}
          >
            <FileUp className="mr-2 h-4 w-4" /> Import
          </button>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-gray-900 text-white shadow hover:bg-gray-800 h-9 px-4 py-2"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 py-4">
        <div className="flex w-full max-w-md items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
<<<<<<< HEAD
              placeholder="Search by name or category..."
=======
              placeholder="Search by name, brand or category..."
>>>>>>> 1e65977e (connnect)
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="h-9 w-full rounded-md border border-input bg-white px-3 py-1 pl-9 text-sm shadow-sm outline-none focus:ring-1 focus:ring-gray-900 text-gray-900"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="h-9 px-4 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 shadow-sm transition-colors"
          >
            Search
          </button>
          {(searchTerm !== '') && (
            <button
              onClick={handleClearSearch}
              className="h-9 px-3 border border-gray-300 bg-white text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 shadow-sm transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Product Table */}
      <div className="rounded-md border border-border bg-white shadow-sm">
        <div className="relative w-full overflow-auto" style={{ minHeight: '400px' }}>
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b bg-gray-50/50">
              <tr className="border-b border-border transition-colors hover:bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[40px]">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    checked={currentProducts.length > 0 && currentProducts.every(p => selectedProductIds.includes(p.id))}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[80px]">Image</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
<<<<<<< HEAD
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground max-w-[200px]">Description</th>
=======
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name & Brand</th>
>>>>>>> 1e65977e (connnect)
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Rating</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  <div className="flex items-center gap-1"><ShoppingBag size={14} /> Price (B2C)</div>
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  <div className="flex items-center gap-1 text-blue-600"><Users size={14} /> Price (B2B)</div>
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Active Offer (B2C)</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Active Offer (B2B)</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Stock</th>
<<<<<<< HEAD
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">SGST %</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">CGST %</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">HSN</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Dimensions</th>
=======
>>>>>>> 1e65977e (connnect)
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {currentProducts.map((product) => {
                const retailDiscount = calculateDiscount(product.compareAtPrice || 0, product.b2cPrice);
<<<<<<< HEAD

                // Backend only sets offerPrice > 0 for ACTIVE offers
                // If offerPrice is 0 or null, there's no active offer
                const hasActiveB2COffer = product.b2cOfferPrice && product.b2cOfferPrice > 0;
                const hasActiveB2BOffer = product.b2bOfferPrice && product.b2bOfferPrice > 0;

                // Use offer price if available, otherwise use base price
                const displayB2CPrice = hasActiveB2COffer ? product.b2cOfferPrice : product.b2cPrice;
                const displayB2BPrice = hasActiveB2BOffer ? product.b2bOfferPrice : product.b2bPrice;
=======
                const isB2COfferActive = checkOfferStatus(product.b2cOfferPercentage, product.b2cOfferStartDate, product.b2cOfferEndDate);
                const isB2BOfferActive = checkOfferStatus(product.b2bOfferPercentage, product.b2bOfferStartDate, product.b2bOfferEndDate);

                const offerB2CPrice = isB2COfferActive ? product.b2cPrice * (1 - (product.b2cOfferPercentage || 0) / 100) : product.b2cPrice;
                const offerB2BPrice = isB2BOfferActive ? product.b2bPrice * (1 - (product.b2bOfferPercentage || 0) / 100) : product.b2bPrice;
>>>>>>> 1e65977e (connnect)

                return (
                  <tr key={product.id} className={`border-b border-border transition-colors hover:bg-gray-50 relative ${selectedProductIds.includes(product.id) ? 'bg-indigo-50/50 hover:bg-indigo-50' : ''}`}>
                    <td className="p-4 align-middle">
                      <input
                        type="checkbox"
<<<<<<< HEAD
                        checked={selectedProductIds.includes(product.id)}
                        onChange={() => toggleSelectProduct(product.id)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{product.name}</span>
                          <span className="text-xs text-gray-500">ID: {product.id}</span>
                        </div>
                      </div>
=======
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        checked={selectedProductIds.includes(product.id)}
                        onChange={(e) => { e.stopPropagation(); toggleSelectProduct(product.id); }}
                      />
                    </td>
                    <td className="p-4 align-middle">
                      <img src={product.image} alt={product.name} className="aspect-square rounded-md object-cover h-10 w-10 border border-gray-200" />
>>>>>>> 1e65977e (connnect)
                    </td>
                    <td className="p-4 align-middle">
                      <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${product.status === 'Active' ? 'border-transparent bg-green-100 text-green-800' : 'border-transparent bg-gray-100 text-gray-800'
                        }`}>
                        {product.status}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="font-medium text-gray-900">{product.name}</div>
<<<<<<< HEAD
                    </td>
                    <td className="p-4 align-middle max-w-[200px]">
                      <div className="text-sm text-gray-600 truncate" title={product.description || ''}>
                        {product.description || <span className="text-gray-400 italic">No description</span>}
                      </div>
=======
                      <div className="text-xs text-gray-500">{product.brand}</div>
>>>>>>> 1e65977e (connnect)
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex flex-col gap-1">
                        {renderStars(product.rating || 0)}
                        <span className="text-xs font-medium text-gray-500">{product.rating?.toFixed(1)} ({product.reviews})</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex flex-col">
                        {product.compareAtPrice && product.compareAtPrice > (product.b2cPrice || 0) && (
                          <span className="text-xs text-gray-400 line-through">₹{product.compareAtPrice.toLocaleString()}</span>
                        )}
                        <div className="flex items-center gap-1">
<<<<<<< HEAD
                          {hasActiveB2COffer ? (
                            <span className="font-bold text-green-600">₹{displayB2CPrice?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                          ) : (
                            <span className="font-medium text-gray-900">₹{(displayB2CPrice || 0).toLocaleString()}</span>
                          )}
                        </div>
                        {!hasActiveB2COffer && retailDiscount > 0 && (
=======
                          {isB2COfferActive ? (
                            <>
                              <span className="text-xs text-gray-400 line-through">₹{(product.b2cPrice || 0).toLocaleString()}</span>
                              <span className="font-bold text-green-600">₹{offerB2CPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            </>
                          ) : (
                            <span className="font-medium text-gray-900">₹{(product.b2cPrice || 0).toLocaleString()}</span>
                          )}
                        </div>
                        {!isB2COfferActive && retailDiscount > 0 && (
>>>>>>> 1e65977e (connnect)
                          <span className="text-[10px] text-green-600 font-medium bg-green-50 px-1 rounded w-fit">
                            {retailDiscount}% off MRP
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex flex-col">
                        {/* MRP */}
                        {product.compareAtPrice && product.compareAtPrice > (product.b2bPrice || 0) && (
                          <span className="text-xs text-gray-400 line-through">₹{product.compareAtPrice.toLocaleString()}</span>
                        )}
                        <div className="flex items-center gap-1">
<<<<<<< HEAD
                          {hasActiveB2BOffer ? (
                            <span className="font-bold text-blue-600">₹{displayB2BPrice?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                          ) : (
                            <span className="font-medium text-blue-600">₹{(displayB2BPrice || 0).toLocaleString()}</span>
                          )}
                        </div>
                        {/* Discount Badge */}
                        {!hasActiveB2BOffer && (product.compareAtPrice && product.compareAtPrice > (product.b2bPrice || 0)) && (
=======
                          {isB2BOfferActive ? (
                            <>
                              <span className="text-xs text-gray-400 line-through">₹{(product.b2bPrice || 0).toLocaleString()}</span>
                              <span className="font-bold text-blue-600">₹{offerB2BPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            </>
                          ) : (
                            <span className="font-medium text-blue-600">₹{(product.b2bPrice || 0).toLocaleString()}</span>
                          )}
                        </div>
                        {/* Discount Badge */}
                        {!isB2BOfferActive && (product.compareAtPrice && product.compareAtPrice > (product.b2bPrice || 0)) && (
>>>>>>> 1e65977e (connnect)
                          <span className="text-[10px] text-blue-600 font-medium bg-blue-50 px-1 rounded w-fit">
                            {calculateDiscount(product.compareAtPrice, product.b2bPrice || 0)}% off MRP
                          </span>
                        )}
                      </div>
                    </td>
                    {/* B2C Offer Column */}
                    <td className="p-4 align-middle">
<<<<<<< HEAD
                      {hasActiveB2COffer ? (
                        <div className="flex flex-col">
                          <span className="text-xs font-bold px-2 py-0.5 rounded w-fit mb-1 bg-green-100 text-green-700">
                            Active {product.b2cOfferPercentage}% Off
                          </span>
                          {product.b2cOfferEndDate && (
                            <div className="text-[10px] text-gray-500 flex items-center gap-1">
                              <Calendar size={10} /> Ends: {new Date(product.b2cOfferEndDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No active offer</span>
=======
                      {product.b2cOfferPercentage && product.b2cOfferPercentage > 0 ? (
                        <div className="flex flex-col">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded w-fit mb-1 ${isB2COfferActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {isB2COfferActive ? 'Active' : 'Scheduled'} {product.b2cOfferPercentage}% Off
                          </span>
                          <div className="text-[10px] text-gray-500 flex items-center gap-1">
                            <Calendar size={10} /> Ends: {new Date(product.b2cOfferEndDate!).toLocaleDateString()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
>>>>>>> 1e65977e (connnect)
                      )}
                    </td>
                    {/* B2B Offer Column */}
                    <td className="p-4 align-middle">
<<<<<<< HEAD
                      {hasActiveB2BOffer ? (
                        <div className="flex flex-col">
                          <span className="text-xs font-bold px-2 py-0.5 rounded w-fit mb-1 bg-blue-100 text-blue-700">
                            Active {product.b2bOfferPercentage}% Off
                          </span>
                          {product.b2bOfferEndDate && (
                            <div className="text-[10px] text-gray-500 flex items-center gap-1">
                              <Calendar size={10} /> Ends: {new Date(product.b2bOfferEndDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No active offer</span>
=======
                      {product.b2bOfferPercentage && product.b2bOfferPercentage > 0 ? (
                        <div className="flex flex-col">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded w-fit mb-1 ${isB2BOfferActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                            {isB2BOfferActive ? 'Active' : 'Scheduled'} {product.b2bOfferPercentage}% Off
                          </span>
                          <div className="text-[10px] text-gray-500 flex items-center gap-1">
                            <Calendar size={10} /> Ends: {new Date(product.b2bOfferEndDate!).toLocaleDateString()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
>>>>>>> 1e65977e (connnect)
                      )}
                    </td>
                    <td className="p-4 align-middle">
                      <div>
                        <span className="font-medium text-gray-900">{product.stock}</span>
                        {product.variants && product.variants.length > 0 && (
                          <div className="flex items-center gap-1 mt-1 flex-wrap max-w-[100px]">
                            {product.variants.map((variant, idx) => (
<<<<<<< HEAD
                              <div
                                key={idx}
                                className="w-2 h-2 rounded-full border border-gray-300"
                                style={{ backgroundColor: variant.colorCode }}
                                title={`${variant.color}: ${variant.stock} in stock`}
                              />
=======
                              <div key={idx} className="w-2 h-2 rounded-full border border-gray-300" style={{ backgroundColor: variant.colorCode }} title={`${variant.color}`} />
>>>>>>> 1e65977e (connnect)
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
<<<<<<< HEAD
                    {/* SGST Column */}
                    <td className="p-4 align-middle">
                      <span className="text-sm text-gray-700">{product.sgst ? `${product.sgst}%` : '-'}</span>
                    </td>
                    {/* CGST Column */}
                    <td className="p-4 align-middle">
                      <span className="text-sm text-gray-700">{product.cgst ? `${product.cgst}%` : '-'}</span>
                    </td>
                    {/* HSN Column */}
                    <td className="p-4 align-middle">
                      <span className="text-sm text-gray-700 font-mono">{product.hsn || '-'}</span>
                    </td>
                    {/* Dimensions Column */}
                    <td className="p-4 align-middle">
                      <div className="text-xs text-gray-600">
                        {(product.length || product.breadth || product.height || product.weight) ? (
                          <>
                            {product.length || product.breadth || product.height ? (
                              <div className="flex items-center gap-1">

                                <span>{product.length || 0}×{product.breadth || 0}×{product.height || 0} cm</span>
                              </div>
                            ) : null}
                            {product.weight ? (
                              <div className="flex items-center gap-1 mt-0.5">

                                <span>{product.weight} kg</span>
                              </div>
                            ) : null}
                          </>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </td>
=======
>>>>>>> 1e65977e (connnect)
                    <td className="p-4 align-middle text-gray-700">{product.category}</td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-2 relative">
                        <button onClick={() => handleEditProduct(product)} className="text-gray-600 hover:text-blue-600 p-1 rounded hover:bg-gray-100" title="View Details">
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Action Menu Trigger */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionMenuId(openActionMenuId === product.id ? null : product.id);
                          }}
                          className={`p-1 rounded ${openActionMenuId === product.id ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {openActionMenuId === product.id && (
                          <div
                            ref={actionMenuRef}
                            className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right"
                          >
                            <div className="py-1">
                              <button
                                onClick={(e) => handleDuplicateProduct(e, product)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Copy size={14} /> Duplicate
                              </button>
                              <button
                                onClick={(e) => handleToggleStatus(e, product)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                {product.status === 'Archived' ? <CheckCircle size={14} /> : <Archive size={14} />}
                                {product.status === 'Archived' ? 'Activate' : 'Archive'}
                              </button>
                              <div className="border-t border-gray-100 my-1"></div>
                              <button
                                onClick={(e) => confirmDeleteProduct(e, product.id)}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredProducts.length > 0 ? startIndex + 1 : 0}</span> to <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredProducts.length)}</span> of <span className="font-medium">{filteredProducts.length}</span> results
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"><ChevronLeft size={16} /></button>
<<<<<<< HEAD
            {(() => {
              const pages = [];
              const maxPagesToShow = 5;
              let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
              let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

              // Adjust start if we're near the end
              if (endPage - startPage < maxPagesToShow - 1) {
                startPage = Math.max(1, endPage - maxPagesToShow + 1);
              }

              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <button
                    key={`page-${i}`}
                    onClick={() => handlePageChange(i)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium border ${currentPage === i ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  >
                    {i}
                  </button>
                );
              }
              return pages;
            })()}
=======
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = i + 1;
              if (totalPages > 5 && currentPage > 3) {
                pageNum = currentPage - 2 + i;
                if (pageNum > totalPages) pageNum = pageNum - (pageNum - totalPages);
              }
              if (pageNum > totalPages || pageNum < 1) return null;
              return (
                <button key={pageNum} onClick={() => handlePageChange(pageNum)} className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium border ${currentPage === pageNum ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>{pageNum}</button>
              );
            })}
>>>>>>> 1e65977e (connnect)
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* Modal for Adding/Editing Product */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="relative grid w-full max-w-2xl gap-4 border border-gray-200 bg-white p-6 shadow-lg sm:rounded-lg animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <h3 className="text-lg font-semibold leading-none tracking-tight text-gray-900">{formData.id ? 'Edit Product' : 'Create Product'}</h3>
              <p className="text-sm text-muted-foreground">Add or update inventory details.</p>
            </div>

            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
              {/* Image Preview & Upload - Modified */}
              <div className="flex flex-col items-center justify-center gap-4 mb-2 p-4 border border-dashed border-gray-200 rounded-lg bg-gray-50/50">
                <div className="w-40 h-40 rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden relative group">
                  <img
                    src={formData.image || 'https://via.placeholder.com/150?text=No+Image'}
                    alt="Product"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error'; }}
                  />
                  {!formData.image && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                      <ImageIcon size={40} />
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <input
                    type="file"
                    ref={productImageInputRef}
                    onChange={handleProductImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                  <button
                    onClick={() => productImageInputRef.current?.click()}
                    className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 shadow-sm flex items-center gap-2 transition-colors"
                  >
                    <Upload size={14} /> Upload Image
                  </button>
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-700">Product Name</label>
                <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="flex h-9 w-full rounded-md border border-input bg-white px-3 text-sm text-gray-900" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="flex h-9 w-full rounded-md border border-input bg-white px-3 text-sm text-gray-900">
                    <option value="Computers">Computers & Laptops</option>
                    <option value="Mobile">Smartphones & Accessories</option>
                    <option value="Audio">Audio & Sound</option>
                    <option value="Home Appliances">Home Appliances</option>
                    <option value="Smart Home">Smart Home & IoT</option>
                    <option value="Cameras">Cameras & Photography</option>
                    <option value="Wearables">Wearable Technology</option>
                  </select>
                </div>
<<<<<<< HEAD

              </div>

              {/* Regular Pricing Section */}
              <div className="space-y-4 border-b border-gray-100 pb-4">
                <h4 className="text-sm font-semibold text-gray-900">Regular Pricing</h4>

                {/* MRP */}
=======
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-700">Brand</label>
                  <select value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="flex h-9 w-full rounded-md border border-input bg-white px-3 text-sm text-gray-900">
                    <option value="">Select Brand</option>
                    {MOCK_BRANDS.map(brand => <option key={brand.id} value={brand.name}>{brand.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Retail Pricing */}
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-700">B2C Price (Selling)</label>
                  <input
                    type="number"
                    value={formData.b2cPrice}
                    onChange={(e) => {
                      const newPrice = parseFloat(e.target.value) || 0;
                      setFormData({ ...formData, b2cPrice: newPrice });
                    }}
                    className="flex h-9 w-full rounded-md border border-input bg-white px-3 text-sm text-gray-900"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-700">Discount (%)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.compareAtPrice && formData.compareAtPrice > 0
                      ? ((formData.compareAtPrice - (formData.b2cPrice || 0)) / formData.compareAtPrice * 100).toFixed(1)
                      : ''}
                    onChange={(e) => {
                      const discount = parseFloat(e.target.value) || 0;
                      const original = formData.compareAtPrice || 0;
                      if (original > 0) {
                        const newPrice = original - (original * (discount / 100));
                        setFormData({ ...formData, b2cPrice: Math.round(newPrice) });
                      }
                    }}
                    disabled={!formData.compareAtPrice || formData.compareAtPrice <= 0}
                    className="flex h-9 w-full rounded-md border border-input bg-white px-3 text-sm text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                  />
                </div>
>>>>>>> 1e65977e (connnect)
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-500">MRP (Actual Price)</label>
                  <input
                    type="number"
                    value={formData.compareAtPrice}
<<<<<<< HEAD
                    onChange={(e) => {
                      const newMRP = parseFloat(e.target.value) || 0;
                      const b2cPrice = formData.b2cPrice || 0;
                      const b2bPrice = formData.b2bPrice || 0;

                      let b2cDiscount = 0;
                      let b2bDiscount = 0;

                      if (newMRP > 0) {
                        if (b2cPrice > 0) {
                          b2cDiscount = parseFloat(((newMRP - b2cPrice) / newMRP * 100).toFixed(1));
                        }
                        if (b2bPrice > 0) {
                          b2bDiscount = parseFloat(((newMRP - b2bPrice) / newMRP * 100).toFixed(1));
                        }
                      }

                      setFormData({
                        ...formData,
                        compareAtPrice: newMRP,
                        b2cDiscount: b2cDiscount,
                        b2bDiscount: b2bDiscount
                      });
                    }}
=======
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: parseFloat(e.target.value) })}
>>>>>>> 1e65977e (connnect)
                    className="flex h-9 w-full rounded-md border border-input bg-white px-3 text-sm text-gray-900"
                    placeholder="Unified MRP"
                  />
                </div>
<<<<<<< HEAD

                {/* Retail Pricing */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-gray-700">B2C Price (Selling)</label>
                    <input
                      type="number"
                      value={formData.b2cPrice}
                      onChange={(e) => {
                        const newPrice = parseFloat(e.target.value) || 0;
                        const original = formData.compareAtPrice || 0;
                        let newDiscount = 0;
                        if (original > 0) {
                          newDiscount = parseFloat(((original - newPrice) / original * 100).toFixed(1));
                        }
                        // Only update regular discount, not active offer
                        setFormData({
                          ...formData,
                          b2cPrice: newPrice,
                          b2cDiscount: newDiscount
                        });
                      }}
                      className="flex h-9 w-full rounded-md border border-input bg-white px-3 text-sm text-gray-900"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-gray-700">B2C Discount (%)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.b2cDiscount || ''}
                      onChange={(e) => {
                        const discount = parseFloat(e.target.value) || 0;
                        const original = formData.compareAtPrice || 0;
                        if (original > 0) {
                          const newPrice = original - (original * (discount / 100));
                          setFormData({
                            ...formData,
                            b2cPrice: Math.round(newPrice),
                            b2cDiscount: discount
                          });
                        } else {
                          setFormData({ ...formData, b2cDiscount: discount });
                        }
                      }}
                      disabled={!formData.compareAtPrice || formData.compareAtPrice <= 0}
                      className="flex h-9 w-full rounded-md border border-input bg-white px-3 text-sm text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                    />
                  </div>
                </div>

                {/* Bulk Pricing */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-blue-600">B2B Price (Bulk)</label>
                    <input
                      type="number"
                      value={formData.b2bPrice}
                      onChange={(e) => {
                        const newPrice = parseFloat(e.target.value) || 0;
                        const original = formData.compareAtPrice || 0;
                        let newDiscount = 0;
                        if (original > 0) {
                          newDiscount = parseFloat(((original - newPrice) / original * 100).toFixed(1));
                        }
                        // Only update regular discount, not active offer
                        setFormData({
                          ...formData,
                          b2bPrice: newPrice,
                          b2bDiscount: newDiscount
                        });
                      }}
                      className="flex h-9 w-full rounded-md border border-blue-200 bg-white px-3 text-sm text-gray-900"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-gray-700">B2B Discount (%)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.b2bDiscount || ''}
                      onChange={(e) => {
                        const discount = parseFloat(e.target.value) || 0;
                        const original = formData.compareAtPrice || 0; // Uses Unified MRP
                        if (original > 0) {
                          const newPrice = original - (original * (discount / 100));
                          setFormData({
                            ...formData,
                            b2bPrice: Math.round(newPrice),
                            b2bDiscount: discount
                          });
                        } else {
                          setFormData({ ...formData, b2bDiscount: discount });
                        }
                      }}
                      disabled={!formData.compareAtPrice || formData.compareAtPrice <= 0}
                      className="flex h-9 w-full rounded-md border border-input bg-white px-3 text-sm text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-400 italic">
                  Note: These are regular discounts that apply all the time (permanent).
                </p>
              </div>

              {/* Limited Time Offers Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900">Time-Limited Active Offers</h4>
                <p className="text-xs text-gray-500 mb-3">These offers are active only during the specified date range and override regular prices.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* B2C Retail Offer */}
                  <div className="border border-green-200 rounded-lg p-3 bg-green-50/30">
                    <h4 className="text-sm font-bold text-green-800 flex items-center gap-2 mb-3">
                      <Percent size={14} /> Retail (B2C) Active Offer
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Discount %</label>
                        <input
                          type="number"
                          placeholder="e.g. 10"
                          className="w-full h-8 px-2 border border-green-200 rounded text-sm text-gray-900 focus:ring-green-500 focus:border-green-500"
                          value={formData.b2cOfferPercentage || ''}
                          onChange={(e) => setFormData({ ...formData, b2cOfferPercentage: parseFloat(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                        <input
                          type="datetime-local"
                          className="w-full h-8 px-2 border border-green-200 rounded text-sm text-gray-900"
                          value={formData.b2cOfferStartDate || ''}
                          onChange={(e) => setFormData({ ...formData, b2cOfferStartDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                        <input
                          type="datetime-local"
                          className="w-full h-8 px-2 border border-green-200 rounded text-sm text-gray-900"
                          value={formData.b2cOfferEndDate || ''}
                          onChange={(e) => setFormData({ ...formData, b2cOfferEndDate: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* B2B Bulk Offer */}
                  <div className="border border-blue-200 rounded-lg p-3 bg-blue-50/30">
                    <h4 className="text-sm font-bold text-blue-800 flex items-center gap-2 mb-3">
                      <Percent size={14} /> Bulk (B2B) Active Offer
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Discount %</label>
                        <input
                          type="number"
                          placeholder="e.g. 5"
                          className="w-full h-8 px-2 border border-blue-200 rounded text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                          value={formData.b2bOfferPercentage || ''}
                          onChange={(e) => setFormData({ ...formData, b2bOfferPercentage: parseFloat(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                        <input
                          type="datetime-local"
                          className="w-full h-8 px-2 border border-blue-200 rounded text-sm text-gray-900"
                          value={formData.b2bOfferStartDate || ''}
                          onChange={(e) => setFormData({ ...formData, b2bOfferStartDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                        <input
                          type="datetime-local"
                          className="w-full h-8 px-2 border border-blue-200 rounded text-sm text-gray-900"
                          value={formData.b2bOfferEndDate || ''}
                          onChange={(e) => setFormData({ ...formData, b2bOfferEndDate: e.target.value })}
                        />
                      </div>
=======
              </div>

              {/* Limited Time Offers Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* B2C Retail Offer */}
                <div className="border border-green-200 rounded-lg p-3 bg-green-50/30">
                  <h4 className="text-sm font-bold text-green-800 flex items-center gap-2 mb-3">
                    <Percent size={14} /> Retail (B2C) Offer
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Discount %</label>
                      <input
                        type="number"
                        placeholder="e.g. 10"
                        className="w-full h-8 px-2 border border-green-200 rounded text-sm text-gray-900 focus:ring-green-500 focus:border-green-500"
                        value={formData.b2cOfferPercentage || ''}
                        onChange={(e) => setFormData({ ...formData, b2cOfferPercentage: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                      <input
                        type="datetime-local"
                        className="w-full h-8 px-2 border border-green-200 rounded text-sm text-gray-900"
                        value={formData.b2cOfferStartDate || ''}
                        onChange={(e) => setFormData({ ...formData, b2cOfferStartDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                      <input
                        type="datetime-local"
                        className="w-full h-8 px-2 border border-green-200 rounded text-sm text-gray-900"
                        value={formData.b2cOfferEndDate || ''}
                        onChange={(e) => setFormData({ ...formData, b2cOfferEndDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* B2B Bulk Offer */}
                <div className="border border-blue-200 rounded-lg p-3 bg-blue-50/30">
                  <h4 className="text-sm font-bold text-blue-800 flex items-center gap-2 mb-3">
                    <Percent size={14} /> Bulk (B2B) Offer
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Discount %</label>
                      <input
                        type="number"
                        placeholder="e.g. 5"
                        className="w-full h-8 px-2 border border-blue-200 rounded text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.b2bOfferPercentage || ''}
                        onChange={(e) => setFormData({ ...formData, b2bOfferPercentage: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                      <input
                        type="datetime-local"
                        className="w-full h-8 px-2 border border-blue-200 rounded text-sm text-gray-900"
                        value={formData.b2bOfferStartDate || ''}
                        onChange={(e) => setFormData({ ...formData, b2bOfferStartDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                      <input
                        type="datetime-local"
                        className="w-full h-8 px-2 border border-blue-200 rounded text-sm text-gray-900"
                        value={formData.b2bOfferEndDate || ''}
                        onChange={(e) => setFormData({ ...formData, b2bOfferEndDate: e.target.value })}
                      />
>>>>>>> 1e65977e (connnect)
                    </div>
                  </div>
                </div>
              </div>

<<<<<<< HEAD
=======
              {/* Bulk Pricing */}
              <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-blue-600">B2B Price (Bulk)</label>
                  <input
                    type="number"
                    value={formData.b2bPrice}
                    onChange={(e) => {
                      const newPrice = parseFloat(e.target.value) || 0;
                      setFormData({ ...formData, b2bPrice: newPrice });
                    }}
                    className="flex h-9 w-full rounded-md border border-blue-200 bg-white px-3 text-sm text-gray-900"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-700">Bulk Discount (%)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.compareAtPrice && formData.compareAtPrice > 0
                      ? ((formData.compareAtPrice - (formData.b2bPrice || 0)) / formData.compareAtPrice * 100).toFixed(1)
                      : ''}
                    onChange={(e) => {
                      const discount = parseFloat(e.target.value) || 0;
                      const original = formData.compareAtPrice || 0; // Uses Unified MRP
                      if (original > 0) {
                        const newPrice = original - (original * (discount / 100));
                        setFormData({ ...formData, b2bPrice: Math.round(newPrice) });
                      }
                    }}
                    disabled={!formData.compareAtPrice || formData.compareAtPrice <= 0}
                    className="flex h-9 w-full rounded-md border border-input bg-white px-3 text-sm text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                  />
                </div>
                <div className="grid gap-2 pt-6">
                  <p className="text-xs text-gray-400 italic">
                    B2B discount is calculated on the same MRP as B2C.
                  </p>
                </div>
              </div>

>>>>>>> 1e65977e (connnect)
              <div className="grid gap-2 mt-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <button onClick={handleGenerateDescription} disabled={isGenerating || !formData.name} className="text-xs flex items-center gap-1 text-blue-600 hover:underline disabled:opacity-50 font-medium">
                    <Sparkles size={12} /> {isGenerating ? 'Generating...' : 'Auto-generate AI'}
                  </button>
                </div>
<<<<<<< HEAD
                <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="flex min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-900" />
              </div>

              {/* Stock Input (Global) */}
              <div className="grid gap-2 mt-2">
                <label className="text-sm font-medium text-gray-700">Total Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                  className="flex h-9 w-full rounded-md border border-input bg-white px-3 text-sm text-gray-900"
                  disabled={formData.variants && formData.variants.length > 0}
                  placeholder="Enter stock quantity"
                />
                {formData.variants && formData.variants.length > 0 && (
                  <p className="text-xs text-gray-500">Stock is calculated automatically from variants.</p>
                )}
              </div>

              {/* Tax and Compliance Section */}
              <div className="space-y-4 border-t border-gray-100 pt-4 mt-4">
                <h4 className="text-sm font-semibold text-gray-900">Tax & Compliance</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-gray-700">SGST (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.sgst || ''}
                      onChange={(e) => setFormData({ ...formData, sgst: parseFloat(e.target.value) || 0 })}
                      className="flex h-9 w-full rounded-md border border-input bg-white px-3 text-sm text-gray-900"
                      placeholder="e.g. 9"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-gray-700">CGST (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.cgst || ''}
                      onChange={(e) => setFormData({ ...formData, cgst: parseFloat(e.target.value) || 0 })}
                      className="flex h-9 w-full rounded-md border border-input bg-white px-3 text-sm text-gray-900"
                      placeholder="e.g. 9"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-gray-700">HSN Code</label>
                    <input
                      type="text"
                      value={formData.hsn || ''}
                      onChange={(e) => setFormData({ ...formData, hsn: e.target.value })}
                      className="flex h-9 w-full rounded-md border border-input bg-white px-3 text-sm text-gray-900"
                      placeholder="e.g. 85366990"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-700">Return Policy</label>
                  <textarea
                    value={formData.returnPolicy || ''}
                    onChange={(e) => setFormData({ ...formData, returnPolicy: e.target.value })}
                    className="flex min-h-[60px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-900"
                    placeholder="e.g. 7 days return policy. Product must be unused and in original packaging."
                  />
                </div>
              </div>

              {/* Dimensions Section */}
              <div className="space-y-4 border-t border-gray-100 pt-4 mt-4">
                <h4 className="text-sm font-semibold text-gray-900">Dimensions (for Shipping)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-gray-700">Length (cm)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.length || ''}
                      onChange={(e) => setFormData({ ...formData, length: parseFloat(e.target.value) || 0 })}
                      className="flex h-9 w-full rounded-md border border-input bg-white px-3 text-sm text-gray-900"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-gray-700">Breadth (cm)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.breadth || ''}
                      onChange={(e) => setFormData({ ...formData, breadth: parseFloat(e.target.value) || 0 })}
                      className="flex h-9 w-full rounded-md border border-input bg-white px-3 text-sm text-gray-900"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-gray-700">Height (cm)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.height || ''}
                      onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) || 0 })}
                      className="flex h-9 w-full rounded-md border border-input bg-white px-3 text-sm text-gray-900"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-gray-700">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.weight || ''}
                      onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                      className="flex h-9 w-full rounded-md border border-input bg-white px-3 text-sm text-gray-900"
                      placeholder="0.00"
                    />
                  </div>
                </div>
=======
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="flex min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-900" />
>>>>>>> 1e65977e (connnect)
              </div>

              {/* Variants UI */}
              <div className="space-y-3 border-t border-gray-100 pt-4 mt-2">
                <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><Palette size={16} /> Variants</h4>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-3">
                  {formData.variants && formData.variants.length > 0 ? (
                    <div className="space-y-2">
                      {formData.variants.map((variant, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm bg-white p-2 rounded border border-gray-200">
                          <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: variant.colorCode }} />
                          <div className="flex-1 font-medium text-gray-700">{variant.color}</div>
                          <div className="text-gray-500">Qty: <span className="font-bold text-gray-900">{variant.stock}</span></div>
                          <button onClick={() => handleRemoveVariant(idx)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={14} /></button>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-xs text-gray-400 text-center py-2">No variants added.</p>}
                  <div className="flex gap-2 pt-2 border-t border-gray-200 items-end">
<<<<<<< HEAD
                    <input
                      placeholder="Color (e.g., Red, Blue)"
                      className="flex-1 h-8 text-xs border rounded px-2 text-gray-900"
                      value={newVariant.color}
                      onChange={(e) => {
                        const colorName = e.target.value;
                        const hexCode = getColorHex(colorName);
                        setNewVariant({ ...newVariant, color: colorName, colorCode: hexCode });
                      }}
                    />
                    <input
                      type="color"
                      className="w-8 h-8 p-0 border rounded cursor-pointer"
                      value={newVariant.colorCode}
                      onChange={(e) => setNewVariant({ ...newVariant, colorCode: e.target.value })}
                      title="Click to pick custom color"
                    />
=======
                    <input placeholder="Color" className="flex-1 h-8 text-xs border rounded px-2 text-gray-900" value={newVariant.color} onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })} />
                    <input type="color" className="w-8 h-8 p-0 border rounded cursor-pointer" value={newVariant.colorCode} onChange={(e) => setNewVariant({ ...newVariant, colorCode: e.target.value })} />
>>>>>>> 1e65977e (connnect)
                    <input type="number" placeholder="Qty" className="w-20 h-8 text-xs border rounded px-2 text-gray-900" value={newVariant.stock} onChange={(e) => setNewVariant({ ...newVariant, stock: parseInt(e.target.value) || 0 })} />
                    <button onClick={handleAddVariant} className="bg-gray-900 text-white h-8 px-3 rounded text-xs font-medium" disabled={!newVariant.color}>Add</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              <button onClick={() => setShowModal(false)} className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-white shadow-sm hover:bg-gray-100 h-9 px-4 py-2 mt-2 sm:mt-0 text-gray-900">Cancel</button>
              <button onClick={handleSaveProduct} className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-gray-900 text-white shadow hover:bg-gray-800 h-9 px-4 py-2">{formData.id ? 'Update Product' : 'Save Product'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Modal */}
      {showReviewsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 max-h-[80vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-lg text-gray-900">Product Reviews</h3>
              <button onClick={() => setShowReviewsModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"><X size={20} /></button>
            </div>
            <div className="overflow-y-auto p-6 space-y-4 flex-1">
              {selectedProductReviews.length === 0 ? <p className="text-center text-gray-500">No reviews yet.</p> :
                selectedProductReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-semibold text-gray-900">{review.user}</span>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">{renderStars(review.rating)}</div>
                    <p className="text-sm text-gray-600">"{review.comment}"</p>
                  </div>
                ))
              }
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
              <button onClick={() => setShowReviewsModal(false)} className="text-sm font-medium text-gray-600 hover:text-gray-900">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {isBulkDelete ? `Delete ${selectedProductIds.length} Products?` : 'Delete Product?'}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {isBulkDelete
                  ? "Are you sure you want to delete the selected products? This action cannot be undone."
                  : "Are you sure you want to delete this product? This action cannot be undone."
                }
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={executeDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 shadow-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
<<<<<<< HEAD
};


=======
};
>>>>>>> 1e65977e (connnect)
