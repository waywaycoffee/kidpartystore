/**
 * Bulk Product Import Page
 * Import products from CSV or JSON file
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface ImportResult {
  success: number;
  failed: number;
  errors: Array<{ row: number; error: string }>;
}

export default function ImportProductsPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'csv' | 'json'>('csv');
  const [preview, setPreview] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    
    if (extension === 'csv') {
      setFileType('csv');
      await parseCSV(selectedFile);
    } else if (extension === 'json') {
      setFileType('json');
      await parseJSON(selectedFile);
    } else {
      toast.error('Unsupported file format. Please use CSV or JSON.');
      setFile(null);
    }
  };

  const parseCSV = async (file: File) => {
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast.error('CSV file must have at least a header row and one data row');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim());
      const products: any[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length !== headers.length) {
          continue;
        }

        const product: any = {};
        headers.forEach((header, index) => {
          const value = values[index].trim();
          if (value) {
            // Handle nested attributes
            if (header === 'ageRange' || header === 'size' || header === 'material' || header === 'certification') {
              if (!product.attributes) product.attributes = {};
              product.attributes[header] = value;
            } else if (header === 'price' || header === 'stock' || header === 'estimatedDelivery') {
              product[header] = parseFloat(value) || 0;
            } else if (header === 'featured' || header === 'freeShipping') {
              product[header] = value.toLowerCase() === 'true';
            } else {
              product[header] = value;
            }
          }
        });

        // Set defaults
        if (!product.status) product.status = 'draft';
        if (!product.stock) product.stock = 0;
        if (product.featured === undefined) product.featured = false;

        products.push(product);
      }

      setPreview(products.slice(0, 5)); // Show first 5 for preview
      toast.success(`Parsed ${products.length} products. Preview shows first 5.`);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      toast.error('Failed to parse CSV file');
    }
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    
    return result;
  };

  const parseJSON = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const products = Array.isArray(data) ? data : [data];
      
      setPreview(products.slice(0, 5));
      toast.success(`Parsed ${products.length} products. Preview shows first 5.`);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      toast.error('Failed to parse JSON file. Please check the file format.');
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileType', fileType);

      const res = await fetch('/api/admin/products/import', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        toast.success(`Successfully imported ${data.imported} products. ${data.failed} failed.`);
        router.push('/admin/products');
      } else {
        toast.error(`Import failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Error importing products:', error);
      toast.error('Failed to import products');
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = (type: 'csv' | 'json') => {
    if (type === 'csv') {
      const csvContent = `name,price,stock,category,status,description,image,theme,featured,ageRange,size,material,certification,estimatedDelivery,freeShipping
Disney Princess Party Package,49.99,100,themePackages,active,"Complete Disney Princess themed party package",https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200,disney-princess,true,"3-8 years",Standard Party Size,"Premium Cardboard & Latex","ASTM, EN 71",7,false
Unicorn Magic Party Package,59.99,50,themePackages,active,"Magical unicorn themed party package",https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200,unicorn,true,"3-8 years",Standard Party Size,"Premium Latex & Cardboard","ASTM, EN 71",7,true`;

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products-template.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      const jsonContent = JSON.stringify([
        {
          name: "Disney Princess Party Package",
          price: 49.99,
          stock: 100,
          category: "themePackages",
          status: "active",
          description: "Complete Disney Princess themed party package",
          image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200",
          theme: "disney-princess",
          featured: true,
          attributes: {
            ageRange: "3-8 years",
            size: "Standard Party Size",
            material: "Premium Cardboard & Latex",
            certification: "ASTM, EN 71"
          },
          estimatedDelivery: 7,
          freeShipping: false
        }
      ], null, 2);

      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products-template.json';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bulk Import Products</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-3">Import Instructions</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
          <li>Download a template file (CSV or JSON)</li>
          <li>Fill in your product information</li>
          <li>Upload the file below</li>
          <li>Preview the imported products</li>
          <li>Confirm the import</li>
        </ol>
      </div>

      {/* Template Downloads */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Download Template</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => downloadTemplate('csv')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Download CSV Template
          </button>
          <button
            onClick={() => downloadTemplate('json')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Download JSON Template
          </button>
        </div>
      </div>

      {/* File Upload */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Upload File</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select File (CSV or JSON)
            </label>
            <input
              type="file"
              accept=".csv,.json"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {file && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                Selected: <span className="font-semibold">{file.name}</span>
              </p>
              <p className="text-sm text-gray-600">
                Type: <span className="font-semibold">{fileType.toUpperCase()}</span>
              </p>
              <p className="text-sm text-gray-600">
                Size: <span className="font-semibold">{(file.size / 1024).toFixed(2)} KB</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview */}
      {preview.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Preview (First 5 Products)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {preview.map((product, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {product.name || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      ${product.price || '0.00'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {product.category || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {product.status || 'draft'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Import Button */}
      {file && preview.length > 0 && (
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
              setFile(null);
              setPreview([]);
            }}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={importing}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {importing ? 'Importing...' : 'Import Products'}
          </button>
        </div>
      )}
    </div>
  );
}

