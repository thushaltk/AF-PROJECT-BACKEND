const mongoose = require("mongoose");
const attendeeController = require("../controllers/attendee-controller");

const ATTENDEE_TEST_DATA = {
    fullName: "Tester 01",
    address: "Tester 01 City",
    email: "testertester.com",
    mobileNo: "0987654321",
    isPaid: "true"
}


test('Check whether the attendee mobileNo is equal to 0987654321', async () => {
    const res = await attendeeController.getAllAttendeeDetails();
    console.log(res);
    //mongoose.connection.close();
    expect(res.mobileNo).toEqual("0987654321");
    //done();

}, 13000)