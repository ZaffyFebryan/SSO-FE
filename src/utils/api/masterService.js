import axiosInstance from '../axios';

/**
 * Master Data Service - Semua endpoint API Master Data V2
 * Base URL: https://api.bispro.digitaltech.my.id/api/v2/master
 */

const masterService = {
  /**
   * Get all unit kerja
   * @returns {Promise} Response dengan list unit kerja
   */
  getUnitKerja: async () => {
    try {
      const response = await axiosInstance.get('/v2/master/unit-kerja');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all dinas
   * @returns {Promise} Response dengan list dinas
   */
  getDinas: async () => {
    try {
      const response = await axiosInstance.get('/v2/master/dinas');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all roles
   * @returns {Promise} Response dengan list roles
   */
  getRoles: async () => {
    try {
      const response = await axiosInstance.get('/v2/master/roles');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default masterService;
