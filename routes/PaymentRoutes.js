const express = require('express');
const midtransClient = require('midtrans-client');


const router = express.Router()

router.post("/process-transaction", (req, res) => {
    try{
        const snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: "SB-Mid-server-kTU-XrUBkcjUdGwiCjAQPjxd",
            clientkey: "SB-Mid-client-DzVbx68_qEYH-c4Y",
        })

        const parameter = {
            transaction_details: {
                order_id: req.body.order_id,
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