import React from 'react';
import { useRates } from '../../contexts/RatesContext';
import { ArrowUpIcon, ArrowDownIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const formatRateType = (rateType: string): string => {
  return rateType
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace('Arm', 'ARM');
};

const formatDate = (date: Date | null): string => {
  if (!date) return 'Never';
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const Rates: React.FC = () => {
  const { rates, loading, error, lastUpdated, refreshRates } = useRates();

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Current Mortgage Rates</h2>
        <div className="flex items-center space-x-4">
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              Updated: {formatDate(lastUpdated)}
            </p>
          )}
          <button
            onClick={refreshRates}
            disabled={loading}
            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Updating...
              </>
            ) : (
              <>
                <ArrowPathIcon className="-ml-1 mr-2 h-4 w-4" />
                Refresh Rates
              </>
            )}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loan Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Interest Rate
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                APR
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Points
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Change
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && !rates?.length ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  Loading rates...
                </td>
              </tr>
            ) : (
              rates?.map((rate) => (
                <tr key={rate._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatRateType(rate.rateType)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rate.rate?.toFixed(3)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rate.apr?.toFixed(3)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rate.points}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {rate.change > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <ArrowUpIcon className="h-3 w-3 mr-1" />
                        {Math.abs(rate.change).toFixed(3)}%
                      </span>
                    ) : rate.change < 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <ArrowDownIcon className="h-3 w-3 mr-1" />
                        {Math.abs(rate.change).toFixed(3)}%
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        No change
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Rates are updated daily at 6:00 AM EST. Last updated: {formatDate(lastUpdated)}</p>
        <p>APR = Annual Percentage Rate. Rates are subject to change without notice.</p>
      </div>
    </div>
  );
};

export default Rates;
