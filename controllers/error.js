exports.getError404 = (req, res, next) => {
    // res.send("<h1>PAGE NOT FOUND!</h1>");
    // res.status(404).sendFile(path.join(__dirname, './', 'views', '404.html'));

    // res.status(404).sendFile(path.join(routeDir, 'views', '404.html'));

    // const cartQuantity = req.cart;
    res.status(404).render('error/404', { pageTitle: 'Page Not Found!', path: '/404' });
};

exports.getError500 = (req, res, next) => {
    // res.send("<h1>PAGE NOT FOUND!</h1>");
    // res.status(404).sendFile(path.join(__dirname, './', 'views', '404.html'));

    // res.status(404).sendFile(path.join(routeDir, 'views', '404.html'));
    // const cartQuantity = req.cart;
    res.status(500).render('error/500', { pageTitle: 'ERROR!', path: '/500' });
};