import express from 'express'
import { CartManager } from '../controllers/CartManager.js'

const router = express.Router()
const carts = new CartManager()

router.post('/', async(req, res) => {
    const createCard = await carts.createCart()
    res.send(createCard)
})

router.get('/:id', async(req, res) => {
    const id = parseInt(req.params.id)
    const productInCart = await carts.findProductsInCart(id)
    if(productInCart == -1){
        res.send({error: 'ID Not found.'})
    }
    else{
        return res.json({Products: productInCart})
    }
})

router.post('/:cid/product/:pid', async(req, res) => {
    const cid = parseInt(req.params.cid)
    const pid = parseInt(req.params.pid)
    const addToTheCart = await carts.addToTheCart(cid,pid)
    return res.send(addToTheCart)
})

export default router