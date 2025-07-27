import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

interface Rate {
  _id: string;
  rateType: string;
  rate: number;
  apr: number;
  points: number;
  change: number;
  lastUpdated: string;
}

interface RatesContextType {
  rates: Rate[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refreshRates: () => Promise<void>;
}

const RatesContext = createContext<RatesContextType | undefined>(undefined);

export const RatesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchRates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/rates');
      setRates(response.data.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching rates:', err);
      setError('Failed to fetch interest rates. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const refreshRates = async () => {
    try {
      setLoading(true);
      await api.get('/api/rates/refresh');
      await fetchRates();
    } catch (err) {
      console.error('Error refreshing rates:', err);
      setError('Failed to refresh interest rates.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch rates on component mount
  useEffect(() => {
    fetchRates();

    // Refresh rates every hour
    const interval = setInterval(fetchRates, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <RatesContext.Provider value={{ rates, loading, error, lastUpdated, refreshRates }}>
      {children}
    </RatesContext.Provider>
  );
};

export const useRates = (): RatesContextType => {
  const context = useContext(RatesContext);
  if (context === undefined) {
    throw new Error('useRates must be used within a RatesProvider');
  }
  return context;
};
