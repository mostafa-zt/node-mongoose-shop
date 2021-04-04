const config = {
    production: {
        SECRET: process.env.SECRET,
        DATABASE: process.env.MONGODB_URI,
        STRIP_API: process.env.STRIP_API,
        CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
        CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
        CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
    },
    default: {
        SECRET: 'SUPERSECRETPASSWORD',
        DATABASE: 'mongodb+srv://mostafa:LUjiZggnXA6agN2f@cluster0.wvo17.mongodb.net/shop_dev?retryWrites=true&w=majority',
        STRIP_API: 'sk_test_51HyqDyB64RoBKGh8IU6zHriFpW17QZ7cnLsO8TMaYAiyg74hxdDSD9rKyt0m8xs9wFBbzcnUb0nPWr9Pj3Yan15600PU6kknKB',
        CLOUDINARY_NAME: 'dca1dcmnz',
        CLOUDINARY_API_KEY: '143316274758971',
        CLOUDINARY_API_SECRET: 'GNiNTeUzPmF3c_f9mfB3YzDD0xk'
    }
}

exports.get = function get(env) {
    return config[env] || config.default
}