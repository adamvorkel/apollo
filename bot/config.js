let config = {
    watch: {
        exchange: process.env.EXCHANGE,
        key: process.env.EXCHANGE_KEY,
        secret: process.env.EXCHANGE_SECRET
    },
    db: {
        uri: process.env.DB_URI
    },
    api: {
        port: 3001
    }
};