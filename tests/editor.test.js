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

test("GET all editor data", async() => {
    const editors = await editorController.getAllEditorDetails();
    await supertest(app).get("/api/editor/")
    .expect(200)
    .then((response) => {
        expect(response.body[0].fullName).toBe(editors.fullName);
        expect(response.body[0].address).toBe(editors.address);
        expect(response.body[0].email).toBe(editors.email);
        expect(response.body[0].mobileNo).toBe(editors.mobileNo);
        expect(response.body[0].password).toBe(editors.password);

    })
})