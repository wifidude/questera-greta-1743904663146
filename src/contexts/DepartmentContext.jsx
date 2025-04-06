import React, { createContext, useContext, useState, useCallback } from 'react';
import { DEFAULT_COLORS, isValidColor } from '../utils/colorUtils';

const DepartmentContext = createContext();

export const useDepartmentColors = () => {
  const context = useContext(DepartmentContext);
  if (!context) {
    throw new Error('useDepartmentColors must be used within a DepartmentProvider');
  }
  return context;
};

export const DepartmentProvider = ({ children }) => {
  const [departmentColors, setDepartmentColors] = useState(DEFAULT_COLORS);
  const [departments, setDepartments] = useState(Object.keys(DEFAULT_COLORS));

  const updateDepartmentColor = useCallback((department, color) => {
    if (!isValidColor(color)) return false;
    
    setDepartmentColors(prev => ({
      ...prev,
      [department]: color
    }));
    return true;
  }, []);

  const addDepartment = useCallback((department, color = '#808080') => {
    if (!department || departments.includes(department)) return false;
    
    setDepartments(prev => [...prev, department]);
    setDepartmentColors(prev => ({
      ...prev,
      [department]: color
    }));
    return true;
  }, [departments]);

  const removeDepartment = useCallback((department) => {
    if (department in DEFAULT_COLORS) return false;
    
    setDepartments(prev => prev.filter(d => d !== department));
    setDepartmentColors(prev => {
      const newColors = { ...prev };
      delete newColors[department];
      return newColors;
    });
    return true;
  }, []);

  const resetToDefaults = useCallback(() => {
    setDepartmentColors(DEFAULT_COLORS);
    setDepartments(Object.keys(DEFAULT_COLORS));
  }, []);

  return (
    <DepartmentContext.Provider value={{
      departmentColors,
      departments,
      updateDepartmentColor,
      addDepartment,
      removeDepartment,
      resetToDefaults
    }}>
      {children}
    </DepartmentContext.Provider>
  );
};