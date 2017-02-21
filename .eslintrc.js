module.exports = {
    "extends": ["standard"],
    "rules": { "comma-dangle": [2, "always-multiline"] },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true,
        },
    },
    "globals": {
        "Mousetrap": true,
        "newrelic": true,
        "__nr_require": true,
    },
    "env": {
        "browser": true,
        "node": true,
        "es6": true,
        "mocha": true,
        "node": true,
    }
};
