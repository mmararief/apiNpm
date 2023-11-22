const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

router.get('/getuser', async(req, res) => {
    const users = await prisma.userPayment.findMany({
        where: {
          payment_status: "success",
        },
      })

      res.json(users)
} )