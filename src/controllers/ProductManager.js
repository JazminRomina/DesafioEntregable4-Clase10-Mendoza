import fs from 'fs'

export class ProductManager{
    constructor() {
        this.path = './src/models/products.json'
    }
    writeProducts = async(product) => {
        await fs.promises.writeFile(this.path, JSON.stringify(product, null, 2))
    }

    addProducts = async({title, description, price, thumbnail, code, stock, status, category}) => {
        if(!title || !description || !price || !thumbnail || !code || !stock || !status || !category){
            console.log({error: 'You forgot to put something.'})
        }
        else{
            const productsOld = await this.readProducts()
            const found = productsOld.find((array) => array.code === code)
            if (found){
               console.log('There are two products that had the same code.')
               return 'error'
            }
            else{
                productsOld.push({title, description, price, thumbnail, code, stock, status, category, id: this.generateId(productsOld)})
                await this.writeProducts(productsOld)
            }
        }
    }

    generateId = (array) => {
        return (array.length === 0) ? 1 : array[array.length-1].id + 1
    }

    getProductById = async(id) => {
        const productsOld = await this.readProducts()
        const idProduct = productsOld.find((array) => array.id === id)
        if(idProduct){
            console.log(idProduct)
        }
        else{
            console.log('Not found')
        }
    }

    updateProduct = async({title, description, price, thumbnail, code, stock, status, category}, id) =>{
        const file = await fs.promises.readFile(this.path, 'utf-8')
        const fileProducts = JSON.parse(file)
        const index = fileProducts.findIndex((p) => p.id === id)
        if(index === -1){
            console.log('We did not found that ID')
        }
        else{
            fileProducts[index] = {title, description, price, thumbnail, code, stock, status, category, id}
            await fs.promises.writeFile(this.path, JSON.stringify(fileProducts, null, 2))
        }
    }

    deleteProduct = async(id) => {
        const file = await fs.promises.readFile(this.path, 'utf-8')
        const fileProducts = JSON.parse(file)
        const findProduct = fileProducts.filter((p) => p.id !== id)
        if(findProduct.length !== fileProducts.length){
            await fs.promises.writeFile(this.path, JSON.stringify(findProduct, null, 2))
        }
        else{
            console.log({error: 'This ID do not exist. Try with another ID'})
        }
    }

    readProducts = async() => {
        const data = await fs.promises.readFile(this.path, 'utf-8')
        return JSON.parse(data)
    }

    findProductByCode = async(code) => {
        const productsOld = await this.readProducts()
        const codeProduct = productsOld.find((array) => array.code === code)
        if(codeProduct){
            return codeProduct.id
        }
    }
}