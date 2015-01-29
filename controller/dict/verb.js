var b = {
        am: {},
        is: {},
        was: {},
        are: {},
        were: {}
    },
    c = {
        am: {
            similar: ["is", "was", "are", "were"]
        },
        is: {
            similar: ["am", "was", "are", "were"]
        },
        was: {
            similar: ["is", "am", "are", "were"]
        },
        are: {
            similar: ["is", "was", "am", "were"]
        },
        were: {
            similar: ["is", "was", "are", "am"]
        },
        want: {},
        would: {},
        will: {},
        like: {
            similar: ["love"]
        },
        love: {
            similar: ["like"]
        },
        walk: {},
        eat: {
            LE: {
                happy: .2,
                hurt: -.1
            }
        },
        give: {},
        go: {},
        fuck: {
            LE: {
                hurt: .01,
                happy: .1
            }
        },
        kill: {
            LE: {
                hurt: 1,
                happy: .5
            }
        },
        kiss: {
            LE: {
                hurt: -.5,
                happy: .5
            }
        },
        run: {}
    };

exports.dict = c;
exports.beVerbDict = b
