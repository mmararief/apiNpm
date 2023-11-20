const express = require('express');
const midtransClient = require('midtrans-client');
var uniqid = require('uniqid'); 

const router = express.Router()

router.post("/process-transaction", (req, res) => {
    try{
        const snap = new midtransClient.Snap({
            isProduction: true,
            serverKey: "Mid-server-ghl2e7gz9cTrYx_xD3gV3-s3",
            clientkey: "Mid-client-1w_hoQvcRMGZuXA5",
        })

        const parameter = {
            transaction_details: {
                order_id: req.order_id,
                gross_amount: req.body.total
            },
            customer_details: {
                first_name: req.body.nama,
                email: req.body.email,
            }
        }

        snap.createTransaction(parameter).then((transaction) => {
            const dataPayment = {
                response: JSON.stringify(transaction)
            }

            const token = transaction.token

        res.status(200).json({message: "berhasil", dataPayment, token: token})
        })
           

    }catch (error){
        res.status(500).json({message: error.message})

    }
})
module.exports = router