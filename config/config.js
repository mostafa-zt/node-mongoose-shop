const config = {
    production: {
        SECRET: process.env.SECRET,
        DATABASE: process.env.MONGODB_URI,
        STRIP_API: process.env.STRIP_API
    },
    default: {
        SECRET: 'SUPERSECRETPASSWORD',
        DATABASE: 'mongodb+srv://mostafa:LUjiZggnXA6agN2f@cluster0.wvo17.mongodb.net/shop?retryWrites=true&w=majority',
        STRIP_API: 'sk_test_51HyqDyB64RoBKGh8IU6zHriFpW17QZ7cnLsO8TMaYAiyg74hxdDSD9rKyt0m8xs9wFBbzcnUb0nPWr9Pj3Yan15600PU6kknKB'
    }
}

exports.get = function get(env) {
    return config[env] || config.default
}