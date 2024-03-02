const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  duplicateId: {
    type: String,
  },
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
  answer: {
    type: Schema.Types.Mixed,
    // required: [true, "Answer is required"],
  },
  required: {
    type: Boolean,
    default: true,
  },
});

// Packages sub-schema
const packagesSchema = new Schema(
  {
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    numberOfPackages: { type: Number, required: true },
  },
  {
    _id: false,
  }
);

// Main BloodRequest schema
const BloodRequestSchema = new Schema(
  {
    available: { type: Boolean, default: true },
    linkedEntity: {
      distributor: {
        type: Schema.Types.ObjectId,
        ref: "BloodDistributor",
        required: false,
      },
      hospital: {
        type: Schema.Types.ObjectId,
        ref: "Hospital",
        required: false,
      },
    },
    description: { type: String, required: true },
    status: { type: String },
    packages: { type: [packagesSchema], required: true },
    approvals: [
      {
        account: {
          type: Schema.Types.ObjectId,
          ref: "Account",
          required: true,
        },
        level: {
          type: Number,
          required: true,
        },
        individualMaxResponseTime: {
          type: Number,
          validate: {
            validator: function (value) {
              return value > 0;
            },
            message: (props) =>
              `${props.value} is not a valid response. It must be greater than 0.`,
          },
        },
        action: {
          type: String,
          enum: ["Rejection", "Approval", "Revision"],
        },
        approved: {
          type: Boolean,
          default: false,
        },
        actionComment: {
          type: String, // eg: comment on rejection or request of adjustment
        },
        questionnaireAction: [QuestionSchema],
        processingTime: {
          type: Number,
        },
        approvedAt: Date,
        actionAt: Date,
      },
    ],
    questionnaireClarification: [QuestionSchema],
    questionnaireRejection: [QuestionSchema],
    questionnaireAnswer: [QuestionSchema],
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true, // Enables automatic creation of createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("BloodRequest", BloodRequestSchema);
