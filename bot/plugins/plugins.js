let plugins = [
    {
        name: "Advisor",
        slug: "advisor",
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
                emitter: "advisor",
                event: "advice",
                handler: "processAdvice"
            },
            {
                emitter: "advisor",
                event: "stratReady",
                handler: "stratReady"
            }
        ]
    }
];

module.exports = plugins;