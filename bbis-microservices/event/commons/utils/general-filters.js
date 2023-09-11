/*
general filters
*/

const generalFilters = {
    filterDates: (query = {}, filters = {}) => {
      const { startCreatedAt, endCreatedAt } = filters;
      const updatedQuery = { ...query };
  
      if (startCreatedAt || endCreatedAt) {
        updatedQuery.createdAt = { ...updatedQuery.createdAt };
  
        if (startCreatedAt) {
          updatedQuery.createdAt.$gte = new Date(startCreatedAt);
        }
        if (endCreatedAt) {
          updatedQuery.createdAt.$lte = new Date(endCreatedAt);
        }
      }
  
      return updatedQuery;
    },
  
    filterIds: (query = {}, filters = {}) => {
      const { id, ids, startId } = filters;
      const updatedQuery = { ...query };
  
      if (id && startId) {
        // Handle scenario where both id and startId are present
        // ...
      } else {
        if (id) {
          updatedQuery._id = id;
        }
        if (startId) {
          updatedQuery._id = { $lt: startId };
        }
      }
  
      if (ids) {
        updatedQuery.ids = { $in: ids };
      }
  
      return updatedQuery;
    },
  
    processArrayQuery: (query, key, value) => {
      if (value) {
          query[key] = { "$in": value };
      }
    },
    
    processExactQuery: (query, key, value) => {
      if (value) {
          query[key] = value;
      }
    }
  };
  
  module.exports = generalFilters;
  