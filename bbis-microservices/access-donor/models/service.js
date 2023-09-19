const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define Question Schema
const QuestionSchema = new Schema({
  questionText: {
    type: String,
    required: [true, "Question text is required"],
  },
  options: [
    {
      type: String,
    },
  ],
  answerType: {
    // for example, 'text', 'multipleChoice', etc
    type: String,
    required: [true, "Answer type is required"],
  },
});

// Create Service schema
const ServiceSchema = new Schema(
  {
    available: {
      type: Boolean,
      default: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "ServiceCategory",
      required: [true, "category field is required"],
    },
    description: {
      type: String,
      trim: true,
    },
    maxResponseTime: {
      type: Number,
    },
    name: {
      type: String,
      required: [true, "file.name field is required"],
      trim: true,
      unique: true,
    },
    files: [
      {
        file: {
          type: Array,
        },
        name: {
          type: String,
          required: [true, "file.name field is required"],
        },
      },
    ],
    institution: {
      type: String,
      required: [true, "Institution field is required"],
      trim: true,
    },
    approver: {
      type: [
        {
          ippisNumber: {
            type: String,
            required: [true, "ippsNumber field is required"],
            unique: true,
            trim: true,
          },
          position: {
            type: Schema.Types.ObjectId,
            ref: "Position",
            required: [true, "position field is required"],
          },
        },
      ],
      validate: {
        validator: function (v) {
          if (!v) return true; // If null or undefined, it's valid
          return (
            Array.isArray(v) &&
            v.every((approver) => approver.ippisNumber && approver.position)
          );
        },
        message: "Invalid approver information",
      },
    },
    questionnaire: [QuestionSchema],
  },
  {
    timestamps: true,
    index: {
      name: 1,
    },
  }
);

// Create the model based on the schema
const Service = mongoose.model("Service", ServiceSchema);

module.exports = Service;
