const assert = require('assert')
const request = require('supertest')
const app = require('../../app')
const mongoose = require('mongoose')

const Driver = mongoose.model('driver')

describe('Drivers controller', () => {
  it('Post to /api/drivers creates a new driver', (done) => {
    Driver.countDocuments().then(count => {
      request(app)
        .post('/api/drivers')
        .send({ email: 'test@test.com' })
        .end(() => {
          Driver.countDocuments().then(newCount => {
            assert(count + 1 === newCount)
            done()
          })
        })
    })
  })

  it('PUT to /api/drivers/id edits an existing driver', async () => {
    const driver = new Driver({ email: 't@t.com', driving: false });

    await driver.save();

    await request(app)
      .put(`/api/drivers/${driver._id}`)
      .send({ driving: true });

    const updatedDriver = await Driver.findOne({ email: 't@t.com' });
    assert(updatedDriver.driving === true);
  });

  it('DELETE to /api/drivers/id deletes an existing driver', async () => {
    const driver = new Driver({ email: 'testi@testi.com' });

    await driver.save();

    await request(app)
      .delete(`/api/drivers/${driver._id}`)
      .send();

    const updatedDriver = await Driver.findOne({ email: 'testi@testi.com' });
    assert(updatedDriver === null);
  });

  it('GET to /api/drivers finds drivers in a location', done => {
    const seattleDriver = new Driver({
      email: 'seattle@test.com',
      geometry: {
        type: 'Point',
        coordinates: [-122.4759902, 47.6147628]
      }
    })
    const miamiDriver = new Driver({
      email: 'miami@test.com',
      geometry: {
        type: 'Point',
        coordinates: [-80.253, 25.791]
      }
    })

    Promise.all([seattleDriver.save(), miamiDriver.save()])
      .then(() => {
        request(app)
          .get('/api/drivers?lng=-80&lat=25')
          .end((err, response) => {
            console.log(response)
            assert(response.body.length === 1)
            assert(response.body[0].email === 'miami@test.com')
            done()
          })
      })
  })
})