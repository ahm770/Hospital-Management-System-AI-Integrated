const mongoose = require("mongoose");

const BlacklistedTokenSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true } // Expiry same as JWT expiration
});

module.exports = mongoose.model("BlacklistedToken", BlacklistedTokenSchema);
