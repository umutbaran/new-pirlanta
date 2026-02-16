'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight, Eye, EyeOff, Edit2, X, Check } from 'lucide-react';
import { CategoryData as Category } from '@/lib/db';

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for adding new main category
  const [newCatName, setNewCatName] = useState('');
  const [isAddingMain, setIsAddingMain] = useState(false);

  // State for subcategories modal/expansion
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [newSubCatName, setNewSubCatName] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Kategoriler yüklenemedi', err);
    } finally {
      setLoading(false);
    }
  };

  const saveChanges = async (newCategories: Category[]) => {
    setCategories(newCategories); // Optimistic update
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategories),
      });
    } catch (err) {
      console.error(err);
      alert('Hata oluştu.');
      fetchCategories(); // Revert on error
    }
  };

  // --- Main Category Actions ---

  const addMainCategory = () => {
    if (!newCatName.trim()) return;
    const newCat: Category = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCatName,
      slug: slugify(newCatName),
      isActive: true,
      subCategories: []
    };
    saveChanges([...categories, newCat]);
    setNewCatName('');
    setIsAddingMain(false);
  };

  const deleteCategory = (id: string) => {
    if (confirm('Bu kategoriyi ve içindeki tüm alt kategorileri silmek istediğinize emin misiniz?')) {
      saveChanges(categories.filter(c => c.id !== id));
    }
  };

  const toggleVisibility = (id: string) => {
    const updated = categories.map(cat => 
      cat.id === id ? { ...cat, isActive: !cat.isActive } : cat
    );
    saveChanges(updated);
  };

  const startEditing = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const saveEditing = () => {
    const updated = categories.map(cat => 
      cat.id === editingId ? { ...cat, name: editName, slug: slugify(editName) } : cat
    );
    saveChanges(updated);
    setEditingId(null);
  };

  // --- Sub Category Actions ---

  const addSubCategory = (parentId: string) => {
    if (!newSubCatName.trim()) return;
    const updated = categories.map(cat => {
      if (cat.id === parentId) {
        return {
          ...cat,
          subCategories: [...cat.subCategories, { name: newSubCatName, slug: slugify(newSubCatName) }]
        };
      }
      return cat;
    });
    saveChanges(updated);
    setNewSubCatName('');
  };

  const removeSubCategory = (parentId: string, subSlug: string) => {
    if (confirm('Alt kategoriyi silmek istediğinize emin misiniz?')) {
      const updated = categories.map(cat => {
        if (cat.id === parentId) {
          return {
            ...cat,
            subCategories: cat.subCategories.filter(s => s.slug !== subSlug)
          };
        }
        return cat;
      });
      saveChanges(updated);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Yükleniyor...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kategori Yönetimi</h1>
          <p className="text-gray-500 text-sm mt-1">Menü yapısını buradan tamamen özelleştirebilirsiniz.</p>
        </div>
        <button 
          onClick={() => setIsAddingMain(true)}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Ana Kategori Ekle
        </button>
      </div>

      {/* New Category Form */}
      {isAddingMain && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-2">
           <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Kategori Adı (Örn: Altın Kolyeler)" 
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="flex-1 border p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                autoFocus
              />
              <button onClick={addMainCategory} className="bg-[#D4AF37] text-white px-4 py-2 rounded-lg text-sm font-bold">Ekle</button>
              <button onClick={() => setIsAddingMain(false)} className="text-gray-500 px-4 py-2 hover:bg-gray-200 rounded-lg"><X className="h-4 w-4" /></button>
           </div>
        </div>
      )}

      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.id} className={`bg-white rounded-xl shadow-sm border transition-all ${!cat.isActive ? 'border-red-100 bg-red-50/30 opacity-75' : 'border-gray-200'}`}>
            
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
               <div className="flex items-center gap-4 flex-1">
                  <button onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)} className="p-1 hover:bg-gray-100 rounded text-gray-400">
                     {expandedCat === cat.id ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  </button>
                  
                  {editingId === cat.id ? (
                    <div className="flex items-center gap-2">
                       <input 
                         type="text" 
                         value={editName} 
                         onChange={(e) => setEditName(e.target.value)} 
                         className="border border-[#D4AF37] rounded px-2 py-1 text-lg font-bold outline-none"
                       />
                       <button onClick={saveEditing} className="p-1 bg-green-100 text-green-700 rounded"><Check className="h-4 w-4" /></button>
                       <button onClick={() => setEditingId(null)} className="p-1 bg-red-100 text-red-700 rounded"><X className="h-4 w-4" /></button>
                    </div>
                  ) : (
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                            {cat.name}
                            {!cat.isActive && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Gizli</span>}
                        </h3>
                        <div className="text-xs text-gray-400 font-mono">/{cat.slug}</div>
                    </div>
                  )}
               </div>

               <div className="flex items-center gap-2">
                  <button 
                    onClick={() => startEditing(cat)} 
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="İsmi Düzenle"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => toggleVisibility(cat.id)}
                    className={`p-2 rounded-lg transition-colors ${cat.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                    title={cat.isActive ? "Gizle" : "Göster"}
                  >
                    {cat.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button 
                    onClick={() => deleteCategory(cat.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
               </div>
            </div>

            {/* Subcategories (Expanded) */}
            {expandedCat === cat.id && (
               <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Alt Kategoriler</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                     {cat.subCategories.map((sub, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white p-3 rounded border border-gray-200 group hover:border-[#D4AF37] transition-colors">
                           <span className="text-sm font-medium text-gray-700">{sub.name}</span>
                           <button 
                             onClick={() => removeSubCategory(cat.id, sub.slug)}
                             className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                              <X className="h-4 w-4" />
                           </button>
                        </div>
                     ))}
                  </div>

                  <div className="flex gap-2 mt-4">
                     <input 
                        type="text" 
                        placeholder="Yeni Alt Kategori Ekle..." 
                        value={newSubCatName}
                        onChange={(e) => setNewSubCatName(e.target.value)}
                        className="flex-1 border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:border-[#D4AF37]"
                        onKeyDown={(e) => e.key === 'Enter' && addSubCategory(cat.id)}
                     />
                     <button 
                       onClick={() => addSubCategory(cat.id)}
                       className="px-4 py-2 bg-gray-900 text-white rounded-md text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
                     >
                       Ekle
                     </button>
                  </div>
               </div>
            )}
          </div>
        ))}

        {categories.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
                Henüz kategori eklenmemiş.
            </div>
        )}
      </div>
    </div>
  );
}

