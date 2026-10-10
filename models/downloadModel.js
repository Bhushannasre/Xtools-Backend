import mongoose from 'mongoose';

const downloadSchema = new mongoose.Schema(
    {
        productId: {
            // Products are Mongo documents and their public id is the
            // ObjectId string (see productController.js's serialize()),
            // not a numeric id. This used to be `Number`, which made
            // every download request fail validation below (Number() of
            // an ObjectId string is NaN) and silently drop every
            // download — the dashboard's "Total Downloads" stat and
            // graph were never wrong, they just never received any data.
            type: String,
            required: [true, 'Product ID is required'],
            trim: true,
            index: true,
        },
        productName: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            maxlength: 100,
        },
        downloadLink: {
            type: String,
            required: [true, 'Download link is required'],
            trim: true,
        },
    },
    {
        timestamps: true,
        collection: 'downloads',
    }
);

downloadSchema.index({ createdAt: -1 });
downloadSchema.index({ productId: 1, createdAt: -1 });

const Download = mongoose.model('Download', downloadSchema);

export default Download;
