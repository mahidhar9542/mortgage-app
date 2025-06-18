import axios from 'axios';
import mongoose from 'mongoose';
import Rate from '../models/Rate.js';

// Mock data for mortgage rates
const MOCK_RATES = [
  { term: 30, type: 'fixed', rate: 6.75, apr: 6.85, points: 0.5 },
  { term: 20, type: 'fixed', rate: 6.25, apr: 6.40, points: 0.5 },
  { term: 15, type: 'fixed', rate: 5.75, apr: 5.90, points: 0.5 },
  { term: 10, type: 'fixed', rate: 5.50, apr: 5.70, points: 0.5 },
  { term: 7, type: 'arm', rate: 5.25, apr: 5.45, points: 0.5 },
  { term: 5, type: 'arm', rate: 5.00, apr: 5.25, points: 0.5 },
];

/**
 * Fetches the latest mortgage rates from an external API or returns mock data
 * @returns {Promise<Array>} Array of rate objects
 */
const fetchLatestRates = async () => {
  try {
    // In a real application, you would call an external API here
    // For example:
    // const response = await axios.get('https://api.mortgagerates.com/latest');
    // return response.data.rates;
    
    // For now, return mock data with some randomization
    return MOCK_RATES.map(rate => ({
      ...rate,
      rate: (rate.rate + (Math.random() * 0.5 - 0.25)).toFixed(2),
      lastUpdated: new Date()
    }));
  } catch (error) {
    console.error('Error fetching rates:', error);
    // Fallback to mock data if API call fails
    return MOCK_RATES.map(rate => ({
      ...rate,
      lastUpdated: new Date()
    }));
  }
};

/**
 * Updates the rates in the database with the latest rates
 * @returns {Promise<void>}
 */
export const updateRates = async () => {
  try {
    const latestRates = await fetchLatestRates();
    
    // Update or create each rate in the database
    await Promise.all(
      latestRates.map(rateData => 
        Rate.findOneAndUpdate(
          { term: rateData.term, type: rateData.type },
          { 
            ...rateData,
            lastUpdated: new Date() 
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        ).exec()
      )
    );
    
    console.log('Rates updated successfully');
  } catch (error) {
    console.error('Error updating rates:', error);
    throw error;
  }
};

/**
 * Gets the current rates from the database
 * @returns {Promise<Array>} Array of rate documents
 */
export const getCurrentRates = async () => {
  try {
    return await Rate.find({}).sort({ term: 1 }).exec();
  } catch (error) {
    console.error('Error getting current rates:', error);
    throw error;
  }
};

/**
 * Gets historical rate data for a specific rate type
 * @param {string} rateType - The type of rate (e.g., '30-year-fixed', '15-year-fixed')
 * @param {number} days - Number of days of history to retrieve
 * @returns {Promise<Array>} Array of historical rate data
 */
export const getRateHistory = async (rateType, days = 30) => {
  try {
    // In a real application, you would query your database for historical rates
    // For now, we'll return mock data
    const history = [];
    const today = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Generate a random rate around a base value for demonstration
      const baseRate = rateType.includes('30') ? 6.5 : 
                      rateType.includes('15') ? 5.8 :
                      rateType.includes('5') ? 5.2 : 6.0;
      
      history.push({
        date,
        rate: (baseRate + (Math.random() * 0.5 - 0.25)).toFixed(3),
        points: 0.5
      });
    }
    
    return history;
  } catch (error) {
    console.error('Error getting rate history:', error);
    throw error;
  }
};

export default {
  updateRates,
  getCurrentRates
};
