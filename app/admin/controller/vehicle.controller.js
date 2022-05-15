const Cars = require("mongoose").model("Vehicle");
const MogedEMail = require("../../../utils/send.email");

exports.register = (req, res, next) => {
  let email = req.params.email;
  let _main = req.body.car
  let new_car = new Cars(_main);

  let possibleId = "MO_VIC" + (Math.random() * 1000).toFixed();
  Cars.setHceId(possibleId, null, function (generatedId) {
      new_car.hce_id = generatedId;
      new_car.save((err, data) => {
        if (err) {
          console.log(err)
          res.status(500).send({ code: 500, message: err.message });
          return;
        } else {
          let mail = {
            to: email,
            subject: "Moged Car Rental Solutions Notification",
            head: `Your car with plate # ${new_car.plate_num} has been signed up for Moged Car Rental Solutions, Welcome!  &#127881 &#127881`,
            title: "Happy to ride with you &#128525; !! ",
            content: `You can monitor and get status of you vehicle through Moged app`,
            action: "download mobile app",
            extra:
              "Its with pleasure we welcome you to this new solution and we are keen to start this journey with you.  we hope you will enjoy our system and customer care!",
          };

          // send password
          let sms = {
            // to: car.owner.phone,
            message: `Your car with plate # ${new_car.plate_num} has been signed up for Moged Car Rental Solutions, Welcome!`,
          };

          MogedEMail(mail);
          res.status(200).json(data);
          return;
        }
      });
    },
    (err) => {
      console.log(err)
      res.send({ code: 500, message: "unable to create car" });
    }
  );
};

exports.getCar = (req, res, next) => {
  let userId = req.params.id;
  Cars.findOne({ hce_id: userId })
  .populate('owner')
  .exec(function(err, cars) {
        if (err) {
          res.send({ code: 500, message: "unable to find vehicles" });
          return;
        }
        if (!cars) {
          res.json({
            code: 404,
            message: "No vehicle found ",
          });
          return;
        }
        if (cars) {
          // console.log(cars)
          res.send({ code: 200, message: "vehicle objs", data: cars });
          return;
        }

  })
}

exports.updateCar = (req, res) => {
  let id = req.params.hce_id;
  let data = req.body;
  // console.log(data.hce_id)
  Cars.findOneAndUpdate({ hce_id: data.hce_id }, data, (err, vehicle) => {
    if (err) {
      res.status(500).send({ code: 500, message: err.message });
      return;
    } else {
      // console.log(vehicle)
      res.status(200).json(vehicle);
      return;
    }
  });
};

exports.getAllCars = (req, res) => {
  Cars.find({}, (err, users) => {
    if (err) {
      res.send({ code: 500, message: "unable to get active customers" });
      return;
    }
    if (!users) {
      res.json({
        code: 404,
        message: "No users found ",
      });
      return;
    }
    if (users) {
      res.send({ code: 200, message: "vehicle objs", data: users });
      return;
    }
  });
};

// exports.getCar = (req, res) => {
//   let userId = req.params.id;
//   Cars.findOne({ hce_id: userId }, (err, user) => {
//     if (err) {
//       res.send({ code: 500, message: "unable to get active customers" });
//       return;
//     }
//     if (!user) {
//       res.json({
//         code: 404,
//         message: "No acount matches given id ",
//       });
//       return;
//     }
//     if (user) {
//       res.send({ code: 200, message: "user obj", data: user });
//       return;
//     }
//   });
// };

exports.deleteCar = (req, res) => {
  let id = req.pramas.hce_id;
  Cars.findOneAndDelete({ hce_id: id }, (err, d) => {
    if (err) {
      res.status(500).send({ code: 500, message: err.message });
      return;
    } else {
      res.status(200).send({
        code: 200,
        message: "user has been deleted successfully",
      });
      return;
    }
  });
};
