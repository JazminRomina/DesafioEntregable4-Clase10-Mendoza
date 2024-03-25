import express from 'express'
import { ProductManager } from '../controllers/ProductManager.js'
const router = express.Router()
const products = new ProductManager()

router.get('/', async(req, res) => {
    const allProds = await products.readProducts()
    res.render("home", {prods: allProds})
})

router.get('/realtimeproducts', async(req, res) => {
    const allProds = await products.readProducts()
    res.render("realTimeProducts", {prods: allProds})
})

export default router