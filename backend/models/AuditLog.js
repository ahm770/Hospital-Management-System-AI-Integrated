const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema(
  {
    action: { 
      type: String, 
      required: true, 
      enum: ["create", "update", "delete", "access"] 
    },
    entity: { 
      type: String, 
      required: true 
    }, // Tracks entity type (e.g., "Patient", "Appointment")
    entityId: { 
      type: mongoose.Schema.Types.ObjectId, 
      refPath: "entity", 
      required: false 
    }, // Optional, links to affected entity
    performedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      refPath: "performedByModel", 
      required: false 
    }, // Who performed the action
    performedByModel: { 
      type: String, 
      enum: ["Staff", "Patient", "System"], 
      required: false 
    }, // Identifies if action was done by staff, patient, or system
    details: { 
      type: String 
    }, // Extra details about the action
    before: { 
      type: mongoose.Schema.Types.Mixed 
    }, // Stores previous data (for updates/deletes)
    after: { 
      type: mongoose.Schema.Types.Mixed 
    }, // Stores new data (for updates)
    timestamp: { 
      type: Date, 
      default: Date.now 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", AuditLogSchema);
