import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CalculationResult } from '../types';

interface ResultsDisplayProps {
  result: CalculationResult;
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  const chartData = [
    {
      name: 'Benchmark\nWage',
      value: result.cost,
      color: '#3B82F6'
    },
    {
      name: 'Value\nProduced',
      value: result.valueProduced,
      color: result.valueProduced >= result.expectedValue ? '#10B981' : '#8B5CF6'
    },
    {
      name: 'Cost/\nBenefit',
      value: result.trueCost,
      color: result.trueCost >= 0 ? '#10B981' : '#EF4444'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Productivity Analysis</h3>
            <p className="text-3xl font-bold text-blue-600">{result.productivity.toFixed(1)}%</p>
            <p className="text-sm text-gray-500">of expected productivity</p>
          </div>

          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Tasks Per Day</p>
              <p className="text-lg font-semibold">{result.tasksPerDay} / {result.expectedTasks}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Max Clicks/Day</p>
              <p className="text-lg font-semibold">{result.maxClicksPerDay.toFixed(0)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">True Labor Cost</p>
              <p className={`text-lg font-semibold ${result.trueCost >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${result.trueCost.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Role Value</p>
              <p className={`text-lg font-semibold ${result.totalRoleValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${result.totalRoleValue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="md:w-3/5 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 80, right: 20, top: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={80}
                tick={{ 
                  fontSize: 12,
                  fontWeight: 600,
                  fill: '#374151',
                  dy: 0
                }}
              />
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb' }}
              />
              <Bar 
                dataKey="value" 
                fill="#3B82F6"
                radius={[0, 4, 4, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}