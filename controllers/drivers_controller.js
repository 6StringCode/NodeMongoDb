const Driver = require('../models/driver')

module.exports = {
  greeting(req, res) {
    res.send({ hi: 'there' })
  },

  index(req, res, next) {
    const { lng, lat } = req.query

    if (!lng || !lat) {
      return res.status(422).send({ error: 'You must provide lng and lat query parameters' });
    }

    Driver.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] }, //must coerce to int because query will be string
          distanceField: 'dist.calculated',
          spherical: true,
          maxDistance: 200000,
        }
      }
    ])
      .then(drivers => res.send(drivers))
      .catch(next)
  },

  create(req, res, next) {
    // console.log(req.body)
    const driverProps = req.body

    Driver.create(driverProps)
      .then(driver => res.send(driver))
      .catch(next)
  },

  edit(req, res, next) {
    const driverId = req.params.id;
    const driverProps = req.body;

    Driver.findByIdAndUpdate(driverId, driverProps, { new: true })
      .then(driver => res.send(driver)) // The updated driver is returned directly
      .catch(next);
  },

  delete(req, res, next) {
    const driverId = req.params.id;

    Driver.findByIdAndDelete(driverId)
      .then(driver => res.status(204).send({ message: `driver with id ${driverId} deleted` }))
      .catch(next);
  }
}