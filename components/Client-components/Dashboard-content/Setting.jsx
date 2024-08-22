import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import SettingLoading from '../Loading/SettingLoading';
import { RiRefreshLine } from 'react-icons/ri';
import Swal from 'sweetalert2';
import { useTranslations } from 'next-intl';

const Setting = ({ id }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const t = useTranslations('setting');
  const roles = localStorage.getItem('roles');
  const umaxUrl = process.env.NEXT_PUBLIC_API_URL;

  const getMetricByCampaign = useCallback(async () => {
    if (!id) {
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
  }, [id, umaxUrl]);

  useEffect(() => {
    getMetricByCampaign();
  }, [getMetricByCampaign]);

  const handleChange = (index, field, value) => {
    const newData = [...data]; // Create a copy of the data array
    newData[index][field] = value; // Update the specific field at the given index
    setData(newData); // Update the state with the modified data array
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const convertedValues = data.map(item => ({
        rar: parseInt(item.rar),
        ctr: parseInt(item.ctr),
        oclp: parseInt(item.oclp),
        roas: parseFloat(item.roas),
        cpr: parseInt(item.cpr),
        cpc: parseInt(item.cpc),
      }));

      await axios.put(
        `${umaxUrl}/metrics-settings?campaign_id=${id}`,
        convertedValues[0], // Assuming there's only one item in data array
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      
      // Show success message using Swal
      Swal.fire({
        icon: 'success',
        title: 'Data Berhasil Disimpan',
        showConfirmButton: true,
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.isConfirmed) {
          // window.location.reload(); // Reload the page if needed
        }
      });
    } catch (error) {
      console.error('Error updating:', error);
      // Handle error display if necessary
    }
  };

  const handleRefresh = () => {
    getMetricByCampaign();
  };

  return (
    <div className=''>
      {id === '' ? (
          <SettingLoading />
      ) : (
          <div className='h-fit w-full flex flex-col bg-white dark:bg-gray-800'>
              <div className='w-full float-right h-2 flex justify-end mb-3 items-center'>
                  <button
                      className='transition duration-300'
                      onClick={handleRefresh}
                      disabled={loading}
                      title='Refresh'
                  >
                      <RiRefreshLine size={24} className='me-7 text-gray-700 dark:text-gray-300'/>
                  </button>
              </div>
              {data.map((item, index) => (
                  <div key={index} className='p-6 mb-8 bg-white dark:bg-gray-800 rounded-lg'>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-10 mb-8'>
                          <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                              Reach Amount Ratio (RAR)
                            </label>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>{t('recommended')} &gt; 5%</p>
                            <div className='mt-1 flex items-center'>
                              <input
                                type="number"
                                className='block w-full border border-gray-300 dark:border-gray-700 p-3 rounded-s-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-200'
                                value={item.rar}
                                onChange={(e) => handleChange(index, 'rar', e.target.value)}
                              />
                              <div className='w-14 py-3 bg-blue-600 flex justify-center items-center font-semibold text-[17px] border dark:border-none rounded-e-md text-white'>
                                %
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                              Click Through Rate (CTR)
                            </label>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>{t('recommended')} &gt; 1.5%</p>
                            <div className='mt-1 flex items-center'>
                              <input
                                type="number"
                                className='block w-full border border-gray-300 dark:border-gray-700 p-3 rounded-s-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-200'
                                value={item.ctr}
                                onChange={(e) => handleChange(index, 'ctr', e.target.value)}
                              />
                              <div className='w-14 py-3 bg-blue-600 flex justify-center items-center font-semibold text-[17px] border dark:border-none rounded-e-md text-white'>
                                %
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                              Outbound Click Landing Page (OCLP)
                            </label>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>{t('recommended')} &gt; 80%</p>
                            <div className='mt-1 flex items-center'>
                              <input
                                type="number"
                                className='block w-full border border-gray-300 dark:border-gray-700 p-3 rounded-s-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-200'
                                value={item.oclp}
                                onChange={(e) => handleChange(index, 'oclp', e.target.value)}
                              />
                              <div className='w-14 py-3 bg-blue-600 flex justify-center items-center font-semibold text-[17px] border dark:border-none rounded-e-md text-white'>
                                %
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                              Return on AD Spent (ROAS)
                            </label>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>{t('recommended')} &gt; 3.0x</p>
                            <div className='mt-1 flex items-center'>
                              <input
                                type="number"
                                className='block w-full border border-gray-300 dark:border-gray-700 p-3 rounded-s-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-200'
                                value={item.roas}
                                onChange={(e) => handleChange(index, 'roas', e.target.value)}
                              />
                              <div className='w-14 py-3 bg-blue-600 flex justify-center items-center font-semibold text-[17px] border dark:border-none rounded-e-md text-white'>
                                %
                              </div>
                            </div>
                          </div>
                          <div>
                          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                            Cost per Result (CPR)
                          </label>
                          <p className='text-xs text-gray-500 dark:text-gray-400'>{t('recommended')} &lt; Rp. 5000</p>
                          <div className='mt-1 flex items-center'>
                            <div className='w-14 py-3 bg-blue-600 flex justify-center items-center font-semibold text-[17px] border dark:border-none rounded-s-md text-white'>
                              Rp.
                            </div>
                            <input
                              type="number"
                              className='block w-full border border-gray-300 dark:border-gray-700 p-3 rounded-e-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-200'
                              value={item.cpr}
                              onChange={(e) => handleChange(index, 'cpr', e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                            Cost per Click (CPC)
                          </label>
                          <p className='text-xs text-gray-500 dark:text-gray-400'>{t('recommended')} &lt; Rp. 1000</p>
                          <div className='mt-1 flex items-center'>
                            <div className='w-14 py-3 bg-blue-600 flex justify-center items-center font-semibold text-[17px] border dark:border-none rounded-s-md text-white'>
                              Rp.
                            </div>
                            <input
                              type="number"
                              className='block w-full border border-gray-300 dark:border-gray-700 p-3 rounded-e-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-200'
                              value={item.cpc}
                              onChange={(e) => handleChange(index, 'cpc', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <button 
                          className='w-full bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300'
                          onClick={handleSubmit}
                      >
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
