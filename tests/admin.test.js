const mongoose = require("mongoose");
const supertest = require("supertest")
const editorController = require("../controllers/editor-controller");

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

test("GET conference topic details", async() => {
    const topics = await editorController.getAllTopics();
    await supertest(app).post("/api/admin/login")
    .expect(200)
    .then((response) => {
        expect(response.body[0].topicTitle).toBe(topics.topicTitle);
        expect(response.body[0].description).toBe(topics.description);
        expect(response.body[0].coverImgURL).toBe(topics.coverImgURL);
        expect(response.body[0].status).toBe(topics.status);
     })
})