Para inicializar el servidor una vez descargado el proyecto `cd src/`, luego `node app.js`
Ubicar archivo `.env` en `/src` (Misma ruta que el app y de donde se ejecutará node app.js)

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
- [ ] Middleware de autorización en conjunto con current
    - admin: crear, actualizar y eliminar: productos
    - user: enviar mensaje al chat
    - user: agregar productos a su carrito 
- [ ] Modelo Ticket
- [ ] Ruta: /api/carts/:cid/purchase: Ver condiciones!.

- [ ] Views: Ver como separar en capa
- [ ] User:  router / controller / service / storage | view: /profile
- [ ] Sessions: router / controller / service / storage
- [ ] Custom response
- [ ] Estandarizar mensajes de error / success

