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
})