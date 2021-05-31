const mongoose = require("mongoose");
const supertest = require("supertest")
const reviewerController = require("../controllers/reviewer-controller");

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

test("GET all reviewer data", async() => {
    const reviewer = await reviewerController.getAllReviewerDetails();
    await supertest(app).get("/api/reviewer/")
    .expect(200)
    .then((response) => {
        expect(response.body[0].fullName).toBe(reviewer.fullName);
        expect(response.body[0].address).toBe(reviewer.address);
        expect(response.body[0].email).toBe(reviewer.email);
        expect(response.body[0].mobileNo).toBe(reviewer.mobileNo);
        expect(response.body[0].password).toBe(reviewer.password);
    })
})