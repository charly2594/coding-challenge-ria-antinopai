const jsonData = pm.response.json();

// ✅ Test POST 2.1: Check the status code is 200
//pm.test("POST 2.1: Status code is 200", function () {
//    pm.response.to.have.status(200);
//});
pm.test("POST 2.1: Status code is 200 or 201", function () {
    pm.expect(pm.response.code).to.be.oneOf([200, 201]);
});

// ✅ Test POST 2.2a: Check the response body "topping" property has "bacon", "cheese" and "mushroom":
pm.test("POST 2.2a: Response body contains the 'topping' property with the expected values", function () {
    pm.expect(jsonData.json).to.have.property('topping');
    const expected_values = ["bacon", "cheese", "mushroom"];
    pm.expect(jsonData.json.topping).to.have.members(expected_values);
});

// ✅ Test POST 2.2b: Check the response body "topping" property does not contain "chicken"
pm.test("POST 2.2b: Response body contains the 'topping' property does not contain 'chicken'", function () {
    pm.expect(jsonData.json).to.have.property('topping');
    pm.expect(jsonData.json.topping).to.not.include('chicken');
});