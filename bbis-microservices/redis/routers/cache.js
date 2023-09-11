/*
cache redis
*/

const express = require("express");
const router = express.Router();
const {getAsync, setAsync, delAsync} = require('../redisService');

// Utility function to build Redis key and Redis set key for a category
const buildRedisKey = (key, category) => {
  return category ? `${category}:${key}` : key;
};
const buildCategorySetKey = (category) => `set:${category}`;

// Get Data
router.get(routeUrl, async (req, res, next) => {
  try {
    if (req.query.category && !req.query.key) {
      const setKey = buildCategorySetKey(req.query.category);
      const keys = await client.smembersAsync(setKey);
      const results = [];

      // Fetch each key in the category
      for (const key of keys) {
        const value = await getAsync(key);
        if (value) results.push(JSON.parse(value));
      }

      res.send(results);

    } else {
      const key = buildRedisKey(req.query.key, req.query.category);
      const value = await getAsync(key);
      res.send(value ? JSON.parse(value) : null);
    }
  } catch (error) {
    next(error);
  }
});

// Create or Update Data
router.post(routeUrl, async (req, res, next) => {
  try {
    const key = buildRedisKey(req.query.key, req.query.category);
    const setKey = buildCategorySetKey(req.query.category);

    if (req.query.category) {
      await client.saddAsync(setKey, key);
    }

    await setAsync(key, JSON.stringify(req.body), 'EX', 60);
    res.status(201).send();
  } catch (error) {
    next(error);
  }
});

// Delete Data
router.delete(routeUrl, async (req, res, next) => {
  try {
    if (req.query.category && !req.query.key) {
      const setKey = buildCategorySetKey(req.query.category);
      const keys = await client.smembersAsync(setKey);

      for (const key of keys) {
        await delAsync(key);
      }

      await client.delAsync(setKey);
    } else {
      const key = buildRedisKey(req.query.key, req.query.category);
      await delAsync(key);
    }

    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
