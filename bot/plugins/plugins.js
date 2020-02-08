let plugins = [
    {
        name: "Advisor",
        slug: "advisor",
        enabled: true,
        modes: [
            "realtime",
            "paper"
        ],
        candleConsumer: true,
        subscriptions: []
    },
    {
        name: "Trader",
        slug: "trader",
        enabled: true,
        modes: ["realtime"],
        candleConsumer: true,
        subscriptions: [
            {
                emitter: "advisor",
                event: "advice",
                handler: "processAdvice"
            }
        ]
    }
];

module.exports = plugins;