// Model 
const TicketModel = require(`${__dirname}/../../models/ticket.model.js`);

class TicketsMongoDAO {
    constructor() { }
    async prepare() {
        if (TicketModel.db.readyState != 1) {
            throw new Error('Must connect to MongoDB');
        }
    }

    async getManyByEmail(email) {
        const tickets = await TicketModel.find({ purchaser: email }).lean();
        if (!tickets) throw new Error('not found');

        return tickets;
    }
}

module.exports = { TicketsMongoDAO }