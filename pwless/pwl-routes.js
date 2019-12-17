const pwl = require("./pwl-functions");

module.exports = function(app){

    app.get("/login",pwl.loginForm);
    app.post("/login",pwl.login);
    app.get("/confirmation",pwl.confirmationForm);
    app.post("/confirmation",pwl.confirmation);

}