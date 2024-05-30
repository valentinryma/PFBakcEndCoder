const formatDate = (datetime) => {
    return datetime.toLocaleString();
}

class TicketDTO {
    constructor(ticket) {
        this.code = ticket.code;
        this.time = formatDate(ticket.purchase_datatime);
        this.amount = ticket.amount;
        this.email = ticket.purchaser;
    }
}

module.exports = { TicketDTO }