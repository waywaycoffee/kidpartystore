/**
 * AI Inventory Prediction Page
 */

'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Prediction {
  productId: string;
  productName: string;
  currentMonthlyAverage: number;
  predictedNextMonth: number;
  recommendation: 'increase-stock' | 'clearance' | 'maintain';
}

export default function AIInventoryPage() {
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [slowMoving, setSlowMoving] = useState<Array<{
    productId: string;
    productName: string;
    daysSinceLastSale?: number;
    totalSold: number;
  }>>([]);
  const [highDemand, setHighDemand] = useState<Array<{
    productId: string;
    productName: string;
    averageMonthlySales: number;
  }>>([]);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/ai/inventory-prediction');
      if (res.ok) {
        const data = await res.json();
        setPredictions(data.predictions || []);
        setSlowMoving(data.slowMoving || []);
        setHighDemand(data.highDemand || []);
      }
    } catch {
      toast.error('Failed to load predictions');
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'increase-stock':
        return 'bg-green-100 text-green-800';
      case 'clearance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getRecommendationLabel = (rec: string) => {
    switch (rec) {
      case 'increase-stock':
        return 'Increase Stock';
      case 'clearance':
        return 'Clearance Sale';
      default:
        return 'Maintain';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading predictions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Inventory Predictions</h1>
          <p className="text-gray-500 mt-2">
            Predict demand and identify slow-moving products using AI analysis
          </p>
        </div>
        <button
          onClick={fetchPredictions}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-2xl font-bold text-green-600">{highDemand.length}</div>
          <div className="text-sm text-gray-600 mt-1">High Demand Products</div>
          <p className="text-xs text-gray-500 mt-2">Products with increasing sales trend</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-2xl font-bold text-red-600">{slowMoving.length}</div>
          <div className="text-sm text-gray-600 mt-1">Slow-Moving Products</div>
          <p className="text-xs text-gray-500 mt-2">No sales in 60+ days</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-2xl font-bold text-blue-600">{predictions.length}</div>
          <div className="text-sm text-gray-600 mt-1">Total Products Analyzed</div>
          <p className="text-xs text-gray-500 mt-2">AI predictions for next month</p>
        </div>
      </div>

      {/* High Demand Products */}
      {highDemand.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">High Demand Products (Consider Increasing Stock)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Monthly Sales</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trend</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {highDemand.map((product) => (
                  <tr key={product.productId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{product.productName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {product.averageMonthlySales.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Increasing</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slow-Moving Products */}
      {slowMoving.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Slow-Moving Products (Consider Clearance)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Since Last Sale</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Sold</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {slowMoving.map((product) => (
                  <tr key={product.productId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{product.productName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {product.daysSinceLastSale?.toFixed(0) || 'N/A'} days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.totalSold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* All Predictions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">All Product Predictions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Avg/Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Predicted Next Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recommendation</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {predictions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No predictions available
                  </td>
                </tr>
              ) : (
                predictions.map((prediction) => (
                  <tr key={prediction.productId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{prediction.productName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {prediction.currentMonthlyAverage.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {prediction.predictedNextMonth.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${getRecommendationColor(prediction.recommendation)}`}>
                        {getRecommendationLabel(prediction.recommendation)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

