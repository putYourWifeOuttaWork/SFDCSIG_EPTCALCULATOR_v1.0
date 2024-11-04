import React, { useState } from 'react';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CalculationResult } from './types';
import { FileText, Download, FileDown } from 'lucide-react';

function App() {
  const [results, setResults] = useState<CalculationResult[]>([]);
  const [formCount, setFormCount] = useState(1);
  const [lastAddedForm, setLastAddedForm] = useState<number | null>(null);

  const handleCalculate = (result: CalculationResult, index: number) => {
    const newResults = [...results];
    newResults[index] = result;
    setResults(newResults);
  };

  const handleAddForm = () => {
    setFormCount(prev => prev + 1);
    setLastAddedForm(formCount);
  };

  const handleExportCSV = () => {
    if (results.length === 0) return;

    const headers = [
      'Role', 'Cost/Employee', 'Employees', 'Expected Tasks/Day',
      'Actual Tasks/Day', 'Productivity %', 'Value Produced',
      'Expected Value', 'True Cost', 'Total Role Value'
    ];

    const csvContent = [
      headers.join(','),
      ...results.map(r => [
        r.role,
        r.cost,
        r.employees,
        r.expectedTasks,
        r.tasksPerDay,
        r.productivity.toFixed(2),
        r.valueProduced.toFixed(2),
        r.expectedValue.toFixed(2),
        r.trueCost.toFixed(2),
        r.totalRoleValue.toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'productivity_analysis.csv';
    link.click();
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 print:bg-white">
      <Header />

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex gap-4 flex-wrap print:hidden">
            <button
              onClick={handleAddForm}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <FileText size={20} />
              Add Role Calculation
            </button>
            
            {results.length > 0 && (
              <>
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <Download size={20} />
                  Export to CSV
                </button>
                <button
                  onClick={handleExportPDF}
                  className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors flex items-center gap-2"
                >
                  <FileDown size={20} />
                  Export to PDF
                </button>
              </>
            )}
          </div>

          {Array.from({ length: formCount }).map((_, index) => (
            <div key={index} className="space-y-4">
              <CalculatorForm 
                onCalculate={(result) => handleCalculate(result, index)}
                formIndex={index}
                autoScroll={index === lastAddedForm}
              />
              {results[index] && <ResultsDisplay result={results[index]} />}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;