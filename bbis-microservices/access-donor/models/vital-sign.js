const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VitalSignSchema = new Schema(
  {
    
      donor:{
          type:Schema.Types.ObjectId,
          ref:"Donor",
          required:true
      },
      examQuestionnaire:[
          {
              measure:{
                  type:String,
                  required:true
              },
              value:{
                  type:String,
                  required:true
              },
              time:{
                  type:Date,
                  default:Date.now
               
              },
              initial:{
                  type:String 
              }
          },
      
      ],
     eligible:{
        isEligible:{
            type:Boolean,
            required:true
        },
        reason:{
            type:String
        }
     },
     equipment:{
      type:Schema.Types.ObjectId,
      ref:"Equipment",
     },
     comment:[{
        account:{
            type:Schema.Types.ObjectId,
            ref:"Account",
            required:true
        },
        comment:{
            type:String,
            required:true
        
        },
        time:{
            type:Date,
            default:Date.now
        }
     }]
  },
  { 
    timestamps: true,
  }
);

const VitalSign = mongoose.model("VitalSign", VitalSignSchema);

module.exports = VitalSign;
