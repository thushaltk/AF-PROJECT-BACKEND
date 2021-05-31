const mongoose = require("mongoose");
const supertest = require("supertest")
const wspresenterController = require("../controllers/ws-presenter-controller");

beforeEach((done) => {
    mongoose.connect(
        'mongodb+srv://thushaltk:thushal1234@cluster0.tivsh.mongodb.net/icafLog?retryWrites=true&w=majority'
    ).then(() => {
        console.log("Connected to Database :)....");
        app.listen(5000, () => {
            console.log("Listening on port 5000....");
        });
    }).catch((err) => {
        console.log(err);
    });
    done();
});

afterEach((done) => {
    mongoose.connection.close(() => done());
})

test("GET all wspresenter data", async() => {
    const wspresenter = await wspresenterController.getAllWSPresenterDetails();
    await supertest(app).get("/api/wspresenter/")
    .expect(200)
    .then((response) => {
        expect(response.body[0].fullName).toBe(wspresenter.fullName);
        expect(response.body[0].address).toBe(wspresenter.address);
        expect(response.body[0].email).toBe(wspresenter.email);
        expect(response.body[0].mobileNo).toBe(wspresenter.mobileNo);
        expect(response.body[0].wsProposalLink).toBe(wspresenter.wsProposalLink);
        expect(response.body[0].status).toBe(wspresenter.status);

    })
})