const User = require("mongoose").model("User");


exports.getAllUsers = (req, res) => {
    User.find({},  (err, users) => {
        if (err) {
            res.send({code: 500, message: 'unable to get active customers'})
            return
          }
          if (!users) {
            res.json({
              code: 404,
              message: "No users found "
            });
            return;
          }
          if(users) {
            res.send({code: 200, message: 'user obj', data: users})
            return;
          }
    }).select('-password -salt')
}


exports.getUser = (req, res) => {
    let userId = req.params.id
    User.findOne({hce_id: userId}, (err, user) => {
        if (err) {
            res.send({code: 500, message: 'unable to get active customers'})
            return
          }

          if(user) {
            res.status(200).send({code: 200, message: 'user obj', data: user})
            return;
          }
    }).select('-password -salt')
}   


exports.updateUser = (req, res) => {
    let data = req.body.user
    User.findOneAndUpdate({hce_id: data.hce_id}, data, (err, user) => {
      if (err) {
        res.status(500).send({ code: 500, message: err.message });
        return;
      } else {
           res
          .status(200)
          .send({
            code: 200,
            message: "user has been updated successfully",
            data: user
          });
        return;
      }
    })
  
  }


  exports.deleteUser = (req, res ) => {
    let id = req.pramas.hce_id;
    User.findOneAndDelete({hce_id: id}, (err, d) => {
      if (err) {
        res.status(500).send({ code: 500, message: err.message });
        return;
      } else {
        res
          .status(200)
          .send({
            code: 200,
            message: "user has been deleted successfully",
          });
        return;
      }
    })
  }
  