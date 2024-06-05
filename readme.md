# 🚀 Run:
1. Instalar package.json: `npm i`
2. Ubicar .rar con el archivo *.env* por **fuera** de la carpeta `/src`
3. Ejecutar: `npm start`

## Endpoint
**Mocks:** `/mocking/`
- products: `/mocking/products`

### 📄 TO-DO:
- [ ] View: Ticket - Mensaje de error si no pudo completar la compra 
- [ ] errors: Terminar customErrors para los users y ticket.

En respository/services catcheo los errores que tenga que ver con los parametros (ida al dao: service -> dao)
En dao catcheo los errores que tenga que ver con el retorno de los resultados (ej. Product not found) (vuelta: service <- dao)