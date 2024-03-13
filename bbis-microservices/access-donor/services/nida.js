require("dotenv").config();

const config = require("../commons/config/app-config");
const {
  filterDates,
  filterIds,
  processArrayQuery,
  processExactQuery,
} = require("../commons/utils/general-filters");
const axios = require('axios');

console.log("nida api key",process.env.NIDA_API_KEY);

class Nida {


    
    static async create(req) {
        const { documentNumber } = req.body;
        try {
            const response = await axios.post('https://nid.hmis.moh.gov.rw/Citizen', {documentNumber, secretKey:`${process.env.NIDA_API_KEY}`});
            return response.data;
        } catch (error) {
        
            return {
                status: error.response.data,
                message: "your document number is not valid or not found in the NIDA database. Please try again."
            };
        }
    }


    }

module.exports = Nida; 
