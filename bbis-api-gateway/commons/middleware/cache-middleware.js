const axios = require('axios');
const crypto = require('crypto');
const appConfig = require('../config/app-config');
const cacheServiceURL = appConfig.cacheServiceURL; // Replace with your cache service URL

const hashString = (str) => {
  return crypto.createHash('sha256').update(str).digest('hex');
};

const generateCacheKey = (req) => {
  const paramsString = JSON.stringify(req.params);
  const key = hashString(paramsString);
  return key;
};

const cacheMiddleware = {
  getCacheMiddleware: async (req, res, next) => {
    const key = generateCacheKey(req);
    const category = req.originalUrl;
    try {
      const response = await axios.get(`${cacheServiceURL}/${key}`, {
        params: { category }
      });
      res.send(response.data);
    } catch (error) {
      next(error);
    }
  },

  addCacheMiddleware: async (req, res, next) => {
    const key = generateCacheKey(req);
    const category = req.originalUrl;
    const data = { ...req.body, category };
    try {
      await axios.post(`${cacheServiceURL}/${key}`, data);
      res.status(201).send('Cached successfully');
    } catch (error) {
      next(error);
    }
  },

  deleteCacheMiddleware: async (req, res, next) => {
    const key = generateCacheKey(req);
    const category = req.originalUrl;
    try {
      await axios.delete(`${cacheServiceURL}/${key}`, {
        params: { category }
      });
      res.status(200).send('Cache deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};

module.exports = cacheMiddleware;
