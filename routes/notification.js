const midtransClient = require('midtrans-client');
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

router.post("/notification", async (req, res) => {
    let apiClient = new midtransClient.Snap({
        isProduction: true,
        serverKey: 'Mid-server-ghl2e7gz9cTrYx_xD3gV3-s3',
        clientKey: 'Mid-client-1w_hoQvcRMGZuXA5'
    });

    const notificationJson = req.body;

    try {
        const statusResponse = await apiClient.transaction.notification(notificationJson);
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;

        console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

        // Sample transactionStatus handling logic

        if (transactionStatus === 'capture') {
            // capture only applies to card transaction, which you need to check for the fraudStatus
            if (fraudStatus === 'challenge') {
                await updatePaymentStatus(orderId, 'challenge');
            } else if (fraudStatus === 'accept') {
                await updatePaymentStatus(orderId, 'success');
            }
        } else if (transactionStatus === 'settlement') {
            await updatePaymentStatus(orderId, 'success');
        } else if (transactionStatus === 'deny') {
            // you can ignore 'deny' because most of the time it allows payment retries
            // and later can become success
        } else if (transactionStatus === 'cancel' || transactionStatus === 'expire') {
            await updatePaymentStatus(orderId, 'failure');
        } else if (transactionStatus === 'pending') {
            await updatePaymentStatus(orderId, 'pending');
        }

        res.status(200).end();
    } catch (error) {
        console.error('Error handling Midtrans notification:', error);
        res.status(500).end();
    }
});

router.get('/getuser', async(req, res) => {
    const users = await prisma.userPayment.findMany({
        where: {
          payment_status: "success",
        },
      })

      res.json(users)
} )

async function updatePaymentStatus(orderId, status) {
    // Update the corresponding record in the database with the given status
    await prisma.userPayment.update({
        where: { order_id: orderId },
        data: {
            payment_status: status,
        },
    });
}

module.exports = router;
