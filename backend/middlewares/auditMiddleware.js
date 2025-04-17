const AuditLog = require("../models/AuditLog");

const createAuditLog = (schema, entityName) => {
    schema.pre("save", async function (next) {
        if (this.isNew) {
            await AuditLog.create({
                action: "create",
                entity: entityName,
                entityId: this._id,
                performedBy: this.createdBy || null,
                performedByModel: "Staff", // Adjust if patients can create records
                after: this.toObject(),
                timestamp: new Date(),
            });
        } else {
            const original = await this.constructor.findById(this._id).lean();
            await AuditLog.create({
                action: "update",
                entity: entityName,
                entityId: this._id,
                performedBy: this.updatedBy || null,
                performedByModel: "Staff",
                before: original,
                after: this.toObject(),
                timestamp: new Date(),
            });
        }
        next();
    });

    schema.pre("deleteOne", { document: true, query: false }, async function (next) {
        await AuditLog.create({
            action: "delete",
            entity: entityName,
            entityId: this._id,
            performedBy: this.deletedBy || null,
            performedByModel: "Staff",
            before: this.toObject(),
            timestamp: new Date(),
        });
        next();
    });
};

module.exports = createAuditLog;
