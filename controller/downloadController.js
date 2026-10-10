import Download from '../models/downloadModel.js';

export async function trackDownload(req, res) {
    try {
        const { productId, productName, downloadLink } = req.body;

        if (
            productId === undefined ||
            productId === null ||
            String(productId).trim() === '' ||
            !productName ||
            !downloadLink
        ) {
            return res.status(400).json({
                error: 'productId, productName and downloadLink are required',
            });
        }

        // productId is the product's Mongo ObjectId string (see
        // productController.js's serialize()), not a number — do not
        // coerce it with Number(), that only produced NaN and rejected
        // every real download.
        const download = await Download.create({
            productId: String(productId).trim(),
            productName,
            downloadLink,
        });

        return res.status(201).json({
            message: 'Download tracked successfully',
            data: {
                id: download._id,
                productId: download.productId,
                productName: download.productName,
                createdAt: download.createdAt,
            },
        });
    } catch (error) {
        console.error('Track download error:', error);
        return res.status(500).json({ error: 'Failed to track download' });
    }
}
