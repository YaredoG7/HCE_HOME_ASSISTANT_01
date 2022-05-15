const users = require('../controller/users.controller');
const vehicles = require('../controller/vehicle.controller');

module.exports = function(router) { 
    router.get('/users', users.getAllUsers)
          .get('/user/:id', users.getUser)
          .put('/user/:id', users.updateUser)
          .delete('/user/:id', users.deleteUser)
          .post('/new-vehicle/:email', vehicles.register)
          .get('/vechicles', vehicles.getAllCars)
          .get('/vehicle/:id', vehicles.getCar)
          .put('/vehicle/:id', vehicles.updateCar)
          .delete('/vehicle/:id', vehicles.deleteCar)


}