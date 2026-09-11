const jsonData = pm.response.json();

// ✅ Test GET 1.1: Check the status code is 200
pm.test("GET 1.1: Status code is 200", function () {
    pm.response.to.have.status(200);
});

// ✅ Test GET 1.2a: Response body has the expected fields
pm.test("GET 1.2a: All elements have a 'body' and 'title' property", function () {
    // Ensure the response is an array before looping
    pm.expect(jsonData).to.be.an('array');
    
    // Loop through each item in the array
    jsonData.forEach((item, index) => {
        pm.expect(item, `Item at index ${index} is missing the 'body' property`).to.have.property('body');
        pm.expect(item, `Item at index ${index} is missing the 'title' property`).to.have.property('title');
    });
});

// ✅ Test GET 1.2b: Response body fields does not contain the word zombie
pm.test("GET 1.2b: Response body fields does not contain the word zombie", function () {
    pm.expect(pm.response.text()).to.not.include("zombie");
});

