import React, { createContext, useContext, useState, useCallback } from 'react';
import { DEFAULT_COLORS, isValidColor } from '../utils/colorUtils';
import { contextLogger } from '../utils/debugLogger';

const DepartmentContext = createContext();

export const useDepartmentColors = () => {
  const context = useContext(DepartmentContext);
  if (!context) {
    contextLogger.error('Department Context Error', 'useDepartmentColors must be used within a DepartmentProvider');
    throw new Error('useDepartmentColors must be used within a DepartmentProvider');
  }
  return context;
};

export const DepartmentProvider = ({ children }) => {
  const [departmentColors, setDepartmentColors] = useState(() => {
    contextLogger.debug('Initializing department colors', { colors: DEFAULT_COLORS });
    return DEFAULT_COLORS;
  });

  const [departments, setDepartments] = useState(() => {
    const deps = Object.keys(DEFAULT_COLORS);
    contextLogger.debug('Initializing departments', { departments: deps });
    return deps;
  });

  const updateDepartmentColor = useCallback((department, color) => {
    if (!isValidColor(color)) {
      contextLogger.warn('Invalid color provided', { department, color });
      return false;
    }
    
    setDepartmentColors(prev => {
      const newColors = { ...prev, [department]: color };
      contextLogger.info('Department color updated', {
        department,
        oldColor: prev[department],
        newColor: color
      });
      return newColors;
    });
    return true;
  }, []);

  const addDepartment = useCallback((department, color = '#808080') => {
    if (!department || departments.includes(department)) {
      contextLogger.warn('Invalid department or already exists', {
        department,
        exists: departments.includes(department)
      });
      return false;
    }

    setDepartments(prev => [...prev, department]);
    setDepartmentColors(prev => ({
      ...prev,
      [department]: color
    }));

    contextLogger.info('Department added', { department, color });
    return true;
  }, [departments]);

  const removeDepartment = useCallback((department) => {
    if (department in DEFAULT_COLORS) {
      contextLogger.warn('Cannot remove default department', { department });
      return false;
    }

    setDepartments(prev => prev.filter(d => d !== department));
    setDepartmentColors(prev => {
      const newColors = { ...prev };
      delete newColors[department];
      return newColors;
    });

    contextLogger.info('Department removed', { department });
    return true;
  }, []);

  const resetToDefaults = useCallback(() => {
    contextLogger.info('Resetting to default colors');
    setDepartmentColors(DEFAULT_COLORS);
    setDepartments(Object.keys(DEFAULT_COLORS));
  }, []);

  const value = {
    departmentColors,
    departments,
    updateDepartmentColor,
    addDepartment,
    removeDepartment,
    resetToDefaults
  };

  return (
    <DepartmentContext.Provider value={value}>
      {children}
    </DepartmentContext.Provider>
  );
};