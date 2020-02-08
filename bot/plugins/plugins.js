let plugins = [
    {
        name: "Advisor",
        slug: "advisor",
        enabled: true,
        emits: ["advice", "stratReady"],
        modes: [
            "realtime",
            "paper"
        ],
        candleConsumer: true,
        subscriptions: []
    }
];

module.exports = plugins;