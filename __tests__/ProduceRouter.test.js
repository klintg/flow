import request from 'supertest-as-promised';
import Api from '../src/Api';



const app = new Api().express;

describe('Flow API', () => {
  describe('GET /api/v1/produce - get all produce', () => {
    // properties expected on an obj in the response
    let expectedProps = ['id', 'name', 'quantity', 'price'];

    // testing whether we get an array back.
    it('should return JSON array', () => {
      return request(app).get('/api/v1/produce')
      .expect(200)
      .then(res => {
        // checking that it return an array.
        expect(res.body).toBeInstanceOf(Array);
      });
    });

    // testing whether the objects in the array have the required properties.
    it('should return objs w/ correct props', () => {
      return request(app).get('/api/v1/produce')
      .expect(200)
      .then(res => {
        // check for the expected properties
        let sampleKeys = Object.keys(res.body[0]);
        expectedProps.forEach((key) => {
          expect(sampleKeys.includes(key)).toBe(true);
        });
      });
    });

    // testing whether the objects in the array do not have extra propeties.
    it('shouldn\'t return objs w/ extra props', () => {
      return request(app).get('/api/v1/produce')
      .expect(200)
      .then(res => {
        // check for only expected properties
        let extraProps = Object.keys(res.body[0]).filter((key) => {
          return !expectedProps.includes(key);
        });
        expect(extraProps.length).toBe(0);
      });
    });
  });


  // gettng by id.
  describe('GET /api/v1/produce/:id - get produce item by id', () => {
    it('should return an obj of type Produce', () => {
      return request(app).get('/api/v1/produce/1')
      .expect(200)
      .then((res) => {
        const reqKeys = ['id', 'name', 'price', 'quantity'];
        const {item} = res.body;

        // checking whether it has correct keys
        reqKeys.forEach((key) => {
          expect(Object.keys(item)).toContain(key);
        });
        // checking the type of each field.
        expect(typeof item.id).toBe('number');
        expect(typeof item.name).toBe('string');
        expect(typeof item.quantity).toBe('number');
        expect(typeof item.price).toBe('number');
      });
    });

    it('should return a Produce with requested id', () => {
      return request(app).get('/api/v1/produce/1')
      .expect(200)
      .then((res) => {
        expect(res.body.item).toEqual({
          id: 1,
          name: 'banana',
          quantity: 15,
          price: 1
        });
      });
    });

    it('should return 400 on a nonexistant id', () => {
      return Promise.all([
        request(app).get('/api/v1/produce/-3')
        .expect(400)
        .then((res) => {
          expect(res.body.message).toBe('No item found with id: -3');
        }),
        request(app).get('/api/v1/produce/9999')
        .expect(400)
        .then((res) => {
          expect(res.body.message).toBe('No item found with id: 9999')
        })
      ])
    })
  })


  // POST - CREATING A NEW ITEM.
  describe('POST /api/v1/produce - create new item', () => {
    let peach = {
      name: 'peach',
      quantity: 10,
      price: 6
    };
    it('should accept and add a valid new item', () => {
      return request(app).post('/api/v1/produce')
      .send(peach)
      .then((res) => {
        expect(res.body.status).toBe(200);
        expect(res.body.message).toBe('Success!');
        return request(app).get('/api/v1/produce');
      })
      .then((res) => {
        let returnPeach = res.body.find(item => item.name === 'peach');
        expect(res.status).toBe(200);
        expect(returnPeach.quantity).toBe(10);
        expect(returnPeach.price).toBe(6);
      });
    });

    it('should reject post w/o name, price, or quantity', () => {
      let badItems = [
        {
          name: peach.name,
          quantity: peach.quantity
        },
        {
          quantity: peach.quantity,
          price: peach.price
        },
        {
          name: peach.name,
          price: peach.price
        }
      ];
      return Promise.all(badItems.map(badItem => {
        return request(app).post('/api/v1/produce')
        .send(badItem)
        .then((res) => {
          expect(res.body.status).toBe(400);
          expect(res.body.message.startsWith('Bad Request')).toBe(true);
        });
      }));
    });
  })


// testing put request.
  describe('PUT /api/v1/produce/:id - update an item', () => {
  it('allows updates to props other than id', () => {
    return request(app).put('/api/v1/produce/1')
    .send({ quantity: 20 })
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Success!');
      expect(res.body.item.quantity).toBe(20);
    });
  });
  it('rejects updates to id prop', () => {
    return request(app).put('/api/v1/produce/1')
    .send({ id: 10 })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.message.startsWith('Update failed')).toBe(true);
    });
  });
});


//  DELETE request
  describe('DELETE /api/v1/produce/:id - delete an item', () => {
    it('deletes when given a valid ID', () => {
      return request(app).delete('/api/v1/produce/4')
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Success!');
        expect(res.body.deleted.id).toBe(4);
      });
    });
    it('responds w/ error if given invalid ID', () => {
      return Promise.all([-2, 100].map((id) => {
        return request(app).delete(`/api/v1/produce/${id}`)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.message).toBe('No item found with given ID.');
        });
      }));
    });
  });

});