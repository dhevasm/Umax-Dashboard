import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SettingLoading from '../Loading/SettingLoading';
import { RiRefreshLine } from 'react-icons/ri';

const Setting = ({ id }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const umaxUrl = 'https://umaxxnew-1-d6861606.deta.app';

  const getMetricByCampaign = async () => {
    if (!id) {
      console.warn('No campaign ID provided');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(`${umaxUrl}/metrics-settings-by?campaign_id=${id}&tenantId=${localStorage.getItem('tenantId')}`, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`,
        },
      });
      setData([response.data.Data[0]]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getMetricByCampaign();
  }, []);

  const handleChange = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  const handleRefresh = () => {
    getMetricByCampaign();
  };

  return (
    <div className=''>
      {id === '' ? (
        <SettingLoading />
      ) : (
        <div className='h-screen w-full flex flex-col bg-white'>
          <div className='w-full float-right h-2 flex justify-end mb-3 items-center'>
            <button
              className='transition duration-300'
              onClick={handleRefresh}
              disabled={loading}
              title='Refresh'
            >
              <RiRefreshLine size={24} className='me-7'/>
            </button>
          </div>
          {data.map((item, index) => (
            <div key={index} className='p-6 mb-8 bg-white rounded-lg'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-10 mb-8'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Reach Amount Ratio (RAR)
                  </label>
                  <p className='text-xs text-gray-500'>Recommended value &gt; 5%</p>
                  <input
                    type="text"
                    className='mt-1 block w-full border border-gray-300 p-3 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                    value={item.rar}
                    onChange={(e) => handleChange(index, 'rar', e.target.value)}
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Click Through Rate (CTR)
                  </label>
                  <p className='text-xs text-gray-500'>Recommended value &gt; 1.5%</p>
                  <input
                    type="text"
                    className='mt-1 block w-full border border-gray-300 p-3 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                    value={item.ctr}
                    onChange={(e) => handleChange(index, 'ctr', e.target.value)}
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Outbound Click Landing Page (OCLP)
                  </label>
                  <p className='text-xs text-gray-500'>Recommended value &gt; 80%</p>
                  <input
                    type="text"
                    className='mt-1 block w-full border border-gray-300 p-3 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                    value={item.oclp}
                    onChange={(e) => handleChange(index, 'oclp', e.target.value)}
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Return on AD Spent (ROAS)
                  </label>
                  <p className='text-xs text-gray-500'>Recommended value &gt; 3.0x</p>
                  <input
                    type="text"
                    className='mt-1 block w-full border border-gray-300 p-3 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                    value={item.roas}
                    onChange={(e) => handleChange(index, 'roas', e.target.value)}
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Cost per Result (CPR)
                  </label>
                  <p className='text-xs text-gray-500'>Recommended value &lt; Rp. 5000</p>
                  <input
                    type="text"
                    className='mt-1 block w-full border border-gray-300 p-3 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                    value={item.cpr}
                    onChange={(e) => handleChange(index, 'cpr', e.target.value)}
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Cost per Click (CPC)
                  </label>
                  <p className='text-xs text-gray-500'>Recommended value &lt; Rp. 1000</p>
                  <input
                    type="number"
                    className='mt-1 block w-full border border-gray-300 p-3 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                    value={item.cpc}
                    onChange={(e) => handleChange(index, 'cpc', e.target.value)}
                  />
                </div>
              </div>
              <button className='w-full bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300'>
                Save
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Setting;
