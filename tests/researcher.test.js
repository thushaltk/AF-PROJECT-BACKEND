const mongoose = require("mongoose");
const supertest = require("supertest")
const researcherController = require("../controllers/researcher-controller");

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

test("GET all researcher data", async() => {
    const researcher = await researcherController.getAllResearcherData();
    await supertest(app).get("/api/researcher/")
    .expect(200)
    .then((response) => {
        expect(response.body[0].fullName).toBe(researcher.fullName);
        expect(response.body[0].address).toBe(researcher.address);
        expect(response.body[0].email).toBe(researcher.email);
        expect(response.body[0].mobileNo).toBe(researcher.mobileNo);
        expect(response.body[0].isPaid).toBe(researcher.isPaid);
        expect(response.body[0].researchPaperURL).toBe(researcher.researchPaperURL);
        expect(response.body[0].status).toBe(researcher.status);
    })
})