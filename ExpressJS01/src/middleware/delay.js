const delay = (req, res, next) => {
    setTimeout(() => {
        next();
    }, 3000); // delay 3 giây
}

module.exports = delay;