let plugins = [
    {
        name: "Candle Writer",
        slug: "candleWriter",
        enabled: true,
        modes: [
            "realtime",
            "paper"
        ],
        // candleConsumer: true,
        subscriptions: [
            {
                emitter: "market",
                event: "trades",
                handler: "processTrades"
            },
            {
                emitter: "poopie",
                event: "poop",
                handler: "testPoop"
            }
        ]
    },
    
    {
        name: "Trading Advisor",
        slug: "tradingAdvisor",
        enabled: true,
        emits: ["advice"],
        modes: [
            "realtime",
            "paper"
        ],
        candleConsumer: true,
        subscriptions: [
            // {
            //     emitter: "poopie",
            //     event: "poop",
            //     handler: "testPoop"
            // },
            // {
            //     emitter: "candleWriter",
            //     event: "candleWriteDone",
            //     handler: "afterCandleWrite"
            // },
            // {
            //     emitter: "trader",
            //     event: "tradeStarted",
            //     handler: "processTradeStarted"
            // },
            // {
            //     emitter: "paperTrader",
            //     event: "tradeStarted",
            //     handler: "processTradeStarted"
            // }
        ]
    },
    {
        name: "Poopie Pants",
        slug: "poopie",
        enabled: true,
        modes: ["realtime"],
        emits: "poop",
        subscriptions: [
            {
                emitter: "tradingAdvisor",
                event: "advice",
                handler: "processAdvice"
            }
        ]
    }
];

module.exports = plugins;