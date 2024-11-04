import React, { useState, useEffect, useRef } from 'react';
import { CalculationResult } from '../types';

interface CalculatorFormProps {
  onCalculate: (result: CalculationResult) => void;
  formIndex: number;
  autoScroll?: boolean;
}

export function CalculatorForm({ onCalculate, formIndex, autoScroll }: CalculatorFormProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const [role, setRole] = useState('Service Agent');
  const [cost, setCost] = useState(45000);
  const [employees, setEmployees] = useState(1000);
  const [ept, setEpt] = useState(2.4);
  const [tasksPerDay, setTasksPerDay] = useState(90);
  const [clicksPerTask, setClicksPerTask] = useState(20);

  // EPT values in descending order with their corresponding clicks per minute
  const eptToClicksMap: [number, number][] = [
    [3.20, 3.47],
    [3.00, 3.66],
    [2.80, 3.73],
    [2.60, 3.89],
    [2.40, 4.15],
    [2.20, 4.52],
    [2.00, 5.05],
    [1.80, 5.76],
    [1.60, 6.73],
    [1.40, 8.05],
    [1.20, 9.07],
    [1.00, 12.47],
    [0.80, 16.41],
    [0.60, 22.93],
    [0.40, 35.85],
    [0.30, 48.55]
  ];

  const roleDefaults = {
    'Service Agent': { tasks: 90, clicks: 23 },
    'Sales Development Rep': { tasks: 120, clicks: 22 },
    'Account Executive': { tasks: 22, clicks: 200 }
  };

  useEffect(() => {
    if (autoScroll && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [autoScroll]);

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    const defaults = roleDefaults[newRole as keyof typeof roleDefaults];
    setTasksPerDay(defaults.tasks);
    setClicksPerTask(defaults.clicks);
  };

  const handleCalculate = () => {
    const minutesPerDay = 360; // 6 working hours
    const clicksPerMinute = eptToClicksMap.find(([e]) => e === ept)?.[1] || 4.15;
    const maxClicksPerDay = clicksPerMinute * minutesPerDay;
    const actualTasksPerDay = Math.floor(maxClicksPerDay / clicksPerTask);
    const productivity = (actualTasksPerDay / tasksPerDay) * 100;
    const expectedValue = cost * 2;
    const valueProduced = (productivity / 100) * expectedValue;
    const trueCost = valueProduced - expectedValue;
    const totalRoleValue = trueCost * employees;

    onCalculate({
      role,
      cost,
      expectedTasks: tasksPerDay,
      tasksPerDay: actualTasksPerDay,
      maxClicksPerDay,
      productivity,
      valueProduced,
      expectedValue,
      trueCost,
      totalRoleValue,
      employees
    });
  };

  return (
    <div ref={formRef} className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Role Calculator {formIndex + 1}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Employee Role</label>
          <select
            value={role}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="mt-1"
          >
            <option>Service Agent</option>
            <option>Sales Development Rep</option>
            <option>Account Executive</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Cost per Employee ($)</label>
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
            min="35000"
            max="220000"
            step="5000"
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Number of Employees</label>
          <input
            type="number"
            value={employees}
            onChange={(e) => setEmployees(Number(e.target.value))}
            min="1"
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Expected Tasks/Day</label>
          <input
            type="number"
            value={tasksPerDay}
            onChange={(e) => setTasksPerDay(Number(e.target.value))}
            min="1"
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Est. Clicks/Task</label>
          <input
            type="number"
            value={clicksPerTask}
            onChange={(e) => setClicksPerTask(Number(e.target.value))}
            min="1"
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">EPT (seconds)</label>
          <select
            value={ept}
            onChange={(e) => setEpt(Number(e.target.value))}
            className="mt-1"
          >
            {eptToClicksMap.map(([eptValue]) => (
              <option key={eptValue} value={eptValue}>{eptValue.toFixed(2)}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Calculate
      </button>
    </div>
  );
}