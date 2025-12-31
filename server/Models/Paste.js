const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const pasteSchema = new mongoose.Schema(
  {
    pasteId: {
      type: String,
      required: true,
      unique: true,
      default: () => nanoid(10),
    },

    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    maxViews: {
      type: Number,
      default: null,
      validate: {
        validator: function (v) {
          return v === null || (Number.isInteger(v) && v >= 1);
        },
        message: "maxViews must be an integer ≥ 1 or null",
      },
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

pasteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

pasteSchema.methods.isAvailable = function (now = new Date()) {
  if (this.maxViews !== null && this.views >= this.maxViews) {
    return false;
  }

  if (this.expiresAt !== null && now > this.expiresAt) {
    return false;
  }

  return true;
};

pasteSchema.methods.incrementViews = async function () {
  if (this.maxViews === null || this.views < this.maxViews) {
    this.views += 1;
    await this.save();
  }
};

const Paste = mongoose.model("Paste", pasteSchema);

module.exports = Paste;
