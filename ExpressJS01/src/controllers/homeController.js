const getHomepage = (req, res) => {
    return res.render("index.ejs"); // Hoặc res.send("Hello")
}

module.exports = {
    getHomepage // Phải có dòng này!
}