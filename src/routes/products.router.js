import express from 'express'
import { ProductManager } from '../controllers/ProductManager.js'

const router = express.Router()
const products = new ProductManager()

router.get('/', async(req, res) => {
    let limit = parseInt(req.query.limit)
    const allProds = await products.readProducts()
    const limitProducts = allProds.slice(0, limit)
    if(limit){
        res.send(limitProducts)
    }
    else{
        res.send(allProds)
    }
})

router.get('/:pid', async(req, res) => {
    let pid = parseInt(req.params.pid)
    const allProds = await products.readProducts()
    const findId = allProds.find( p => p.id === pid)
    if(findId){
        res.send(findId)
    }
    else{
        res.send('This Product does not exist')
    }
})

router.post('/', async(req, res) => {
    const newProduct = req.body
    const addProduct = await products.addProducts(newProduct)
    const allProds = await products.readProducts()
    if(addProduct === 'error'){
        res.status(404).send({message: "There are two products that had the same code."})
    }
    else{
        allProds.push(addProduct)
        res.status(201).send({message: "This product has been added."})
    }
})

router.put('/:pid', async(req,res) => {
    let pid = parseInt(req.params.pid)
    const prod = req.body
    const updateProduct = await products.updateProduct(prod, pid)
    const allProds = await products.readProducts()
    const found = allProds.find((p) => p.id === pid)
    if(found){
        res.status(201).send({message: "This product has been changed."})
        return updateProduct
    }
    else{
        res.status(404).send({message: "There is a problem with the ID"})
    }
})

router.delete('/:pid', async(req, res) => {
    let pid = parseInt(req.params.pid)
    const deleteProduct = products.deleteProduct(pid)
    const allProds = await products.readProducts()
    const findId = allProds.find((p) => p.id === pid)
    if(findId){
        res.status(201).send({message: "This product has been eliminated"})
        return deleteProduct
    }
    else{
        res.status(404).send({message: "there is an error"})
    }
})

export default router