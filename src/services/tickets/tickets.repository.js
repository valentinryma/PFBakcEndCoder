class TicketsRepository {
    constructor(dao, ticketDto) {
        this.dao = dao;
        this.dto = ticketDto;
    }

    async getManyByEmail(email) {
        const tickets = await this.dao.getManyByEmail(email);

        const formatTickets = []
        for (const ticket of tickets) {
            const ticketFormat = await new this.dto(ticket);
            formatTickets.push(ticketFormat)
        }

        return formatTickets;
    }
}
module.exports = { TicketsRepository };