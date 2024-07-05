// TODO: Comentar
const getPersistenceMethod = () => {
    return process.env.PERSISTENCE || process.argv.PERSISTENCE || 'MONGO';
};

// Aplica el DTO para cada producto y lo devuelve en product.payload (contiene metadatos)
// Le podes pasar cualquier DTO (Para dependiendo de donde lo llames, puedas traer mas o menos info.)
const getDTO = (resultsDao, dto) => {
    // Collection de user, products, carts, etc.
    const results = resultsDao.docs.map(
        (result) => {
            return new dto(result);
        }
    )[0];

    return results;
}

module.exports = {
    getPersistenceMethod,
    getDTO
};