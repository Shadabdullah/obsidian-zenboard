
import React from "react";
import {   DollarSign, Clock, Sparkles } from 'lucide-react';

const ExpensesView = () => {
  return (<div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-xl border border-gray-200 relative overflow-hidden">
    {/* Background decoration */}
    <div className="absolute inset-0 bg-gray-100/30"></div>
    <div className="absolute top-4 right-4 opacity-20">
      <Sparkles className="w-8 h-8 text-gray-400" />
    </div>
    
    {/* Main content */}
    <div className="relative z-10 text-center">
      <div className="mb-4 p-4 bg-white rounded-full shadow-sm border border-gray-200">
        <DollarSign className="w-12 h-12 text-gray-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">Expense Manager</h3>
      <p className="text-gray-600 mb-3">Track spending, manage your budget</p>
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 font-medium">
        <Clock className="w-4 h-4" />
        <span>Coming Soon</span>
      </div>
    </div>
  </div>
);

};

export default ExpensesView;
