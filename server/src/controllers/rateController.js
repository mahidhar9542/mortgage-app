import { updateRates, getCurrentRates, getRateHistory } from '../services/rateService.js';

export const getRates = async (req, res) => {
  try {
    const rates = await getCurrentRates();
    res.json({ success: true, data: rates });
  } catch (error) {
    console.error('Error getting rates:', error);
    res.status(500).json({ success: false, message: 'Failed to get rates' });
  }
};

export const refreshRates = async (req, res) => {
  try {
    const result = await updateRates();
    res.json(result);
  } catch (error) {
    console.error('Error refreshing rates:', error);
    res.status(500).json({ success: false, message: 'Failed to refresh rates' });
  }
};

export const getHistory = async (req, res) => {
  try {
    const { rateType } = req.params;
    const days = parseInt(req.query.days, 10) || 30;
    
    if (!rateType) {
      return res.status(400).json({ success: false, message: 'Rate type is required' });
    }
    
    const history = await getRateHistory(rateType, days);
    res.json({ success: true, data: history });
  } catch (error) {
    console.error('Error getting rate history:', error);
    res.status(500).json({ success: false, message: 'Failed to get rate history' });
  }
};
