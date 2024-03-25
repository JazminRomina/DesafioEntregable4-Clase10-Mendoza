import fs from 'fs'
import { ProductManager } from './ProductManager.js'

const products = new ProductManager()
export class CartManager{
    constructor(){
        this.path = './src/models/carts.json'
    }

    writeCart = async(carts) =>{
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))
    }

    createCart = async() => {
        const readFile = await this.readCart()
        readFile.push({id: this.generateId(readFile), products: []})
        await this.writeCart(readFile)
    }

    findProductsInCart = async(id) => {
        const readFile = await this.readCart()
        const found = readFile.find((p) => p.id === id)
        if(!found){
            return -1
        }
        else{
            const index = readFile.findIndex((p) => p.id === id)
            return readFile[index].products
        }
    }

    addToTheCart = async(cid, pid) => {
        const readFile = await this.readCart()
        const productsFile = await products.readProducts()
        const foundIdCart = readFile.find((p) => p.id === cid)
        const foundIdProduct = productsFile.find((p) => p.id === pid)
        const filterCarts = readFile.filter((p) => p.id != cid)
        if(!foundIdCart){
            return 'This cart ID not exist.'
        }
        if(!foundIdProduct){
            return 'This product ID not exist'
        }
        if(foundIdCart.products.some((p) => p.id === pid)){
            const moreProductsInTheCart = foundIdCart.products.find((p) => p.id === pid)
            moreProductsInTheCart.quantity++
            await this.writeCart([foundIdCart, ... filterCarts])
            return 'Producto sumado al carrito'
        }
        foundIdCart.products.push({id: pid, quantity: 1})
        await this.writeCart([foundIdCart, ...filterCarts])
        return 'Producto agregado al carrito'
    }

    generateId = (array) => {
        return (array.length === 0) ? 1 : array[array.length-1].id + 1
    }

    readCart = async() => {
        const data = await fs.promises.readFile(this.path, 'utf-8')
        return JSON.parse(data)
    }
}