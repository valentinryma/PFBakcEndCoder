module.exports = {
    /**
     * Representa los niveles de Log y cada nivel esta asociado a un numero.
     */
    levels:
    {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },

    /**
     * Color del Log.
     */
    colors:
    {
        fatal: "red",
        error: "magenta",
        warning: "yellow",
        info: "blue",
        http: "blue",
        debug: "white",
    }
}
