
import { useContext } from 'react';
import { DataContext } from '../context/DataContext';

export const useAppData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within a DataProvider');
  }
  return context;
};
