Para inicializar el servidor una vez descargado el proyecto `cd src/`, luego `node app.js`

******
# Endpoints
## *Carts*:
**GET**
- getAll: `/api/carts/`
- getById: `/api/carts/id`

**POST**
- createOne: `/api/carts/`
- addProductInCart: `/api/carts/id`

**PUT**
- deleteById: `/api/carts/id`
- updateCartProductArray: `/api/carts/id`
- updateCartProductQuantity: `/api/carts/cid/products/pid`

## *Products*:
TODO

******

# TO-DO:
- [ ] Views: Ver como separar en capa
- [ ] User:  router / controller / service / storage | view: /profile
- [ ] Sessions: router / controller / service / storage
- [ ] ver: getTotalProducts (/api/carts/:cid/total/products)
- [ ] Custom response
- [ ] Estandarizar mensajes de error / success
- [ ] Revisar login with GitHub
