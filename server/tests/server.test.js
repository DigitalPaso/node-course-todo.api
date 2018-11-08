const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require ('mongodb');

const {app} = require ('../server.js');
const {Todo} = require ('../models/todo.js');
const {User} = require ('../models/user.js');
const {todos, populateTodos, users, populateUsers} = require ('./seed.js');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe ('POST /todos', () =>
{
    it('should create a new todo', (done) => {
	var text = 'Test todo test';
	request(app)
	    .post('/todos')
	    .send({text})
	    .expect(200)
	    .expect((res) => {
		expect(res.body.text).toBe(text);
	    })
	    .end((err, res) => {
		if (err){
		    return done(err);
		}
		Todo.find({text}).then((todos) => {
		    expect(todos.length).toBe(1);
		    expect(todos[0].text).toBe(text);
		    done();
		}).catch((e) => done(e));
	    });
    });

    it ('should not create a todo with invalid body', (done) => {
	request(app)
	    .post('/todos')
	    .send({})
	    .expect(400)
	    .end((err, res) => {
		if (err){
		    return done(err);
		}
		Todo.find().then((todos) => {
		    expect(todos.length).toBe(2);
		    done();
		}).catch((e) => done(e));
	    });
    });

});

describe ('POST /todos', () =>
{
    it ('should get all todos', (done) => {
	request(app)
	.get('/todos')
	.expect(200)
	.expect((res) => {
	    expect(res.body.todos.length).toBe(2);
	})
	.end(done);
    });
});

describe ('GET /todos:id', () =>
{
    it ('should get a todo byId', (done) => {
	request(app)
	.get(`/todos/${todos[0]._id.toHexString()}`)
	.expect(200)
	.expect((res) => {
	    expect(res.body.todo.text).toBe(todos[0].text);
	})
	.end(done);
    });

    it ('should return 404 if todo not found', (done) => {
	var id = new ObjectID().toHexString();
	request(app)
	.get(`/todos/${id}`)
	.expect(404)
	.end(done);
    });

    it ('should return 404 if for invalid object ids ', (done) => {
	request(app)
	.get('/todos/123abc')
	.expect(404)
	.end(done);
    });


});

describe ('DELETE /todos/:id', () =>
{
    it('should remove a todo', (done) => {
	var id = todos[1]._id.toHexString();
	request(app)
	.delete(`/todos/${id}`)
	.expect(200)
	.expect((res) => {
	    expect(res.body.todo._id).toBe(id);
	})
	.end((err, res) => {
	    if (err) {
		return done(err);
	    }
	    Todo.findById(id).then((todo) => {
		expect(todo).not.toBeTruthy();
		done();
	    }).catch((e) => done(e));
	});
    });

    it ('should return 404 if todo not found', (done) => {
	var id = new ObjectID().toHexString();
	request(app)
	.delete(`/todos/${id}`)
	.expect(404)
	.end(done);
    });

    if ('should return 404 if for invalid object ids ', (done) => {
	request(app)
	.delete('/todos/123abc')
	.expect(404)
	.end(done);
    });
});

describe ('PATCH /todos/:id', () =>
{
    it('should update the todo', (done) => {
	var id = todos[0]._id.toHexString();
	var text = "Patching data";

	request(app)
	.patch(`/todos/${id}`)
	.send({
	    completed: true,
	    text: text
	})
	.expect(200)
	.expect((res) => {
	    expect(res.body.todo.text).toBe(text);
	    expect(res.body.todo.completed).toBe(true);
	    expect(typeof(res.body.todo.completedAt)).toBe("number");
	})
	.end(done);
    });

    it('should clear completedAt when todo is not complted', (done) => {

	var id = todos[1]._id.toHexString();
	var text = "Patching data for second test";

	request(app)
	.patch(`/todos/${id}`)
	.send({
	    completed: false,
	    text: text
	})
	.expect(200)
	.expect((res) => {
	    expect(res.body.todo.text).toBe(text);
	    expect(res.body.todo.completed).toBe(false);
	    expect(res.body.todo.completedAt).not.toBeTruthy();
	})
	.end(done);
    });
});


describe ('GET /users/me', () =>
{
    it('should return a user if authenticated', (done) => {
	request(app)
	    .get('/users/me')
	    .set('x-auth', users[0].tokens[0].token)
	    .expect(200)
	    .expect((res) => {
		expect(res.body._id).toBe(users[0]._id.toHexString());
		expect(res.body.email).toBe(users[0].email);
	    })
	    .end(done);
    });

    it('should return a 401 if not authenticated', (done) => {
	request(app)
	    .get('/users/me')
	    .expect(401)
	    .expect((res) => {
		expect(res.body).toEqual({});
	    })
	.end(done);
    });
});

describe ('POST /users', () => {

    it('should create a user', (done) => {
	var email = 'example@example.com';
	var password = 'password123!';
	request(app)
	    .post('/users')
	    .send({email, password})
	    .expect(200)
	    .expect((res) => {
		expect(res.headers['x-auth']).toBeTruthy();
		expect(res.body._id).toBeTruthy();
		expect(res.body.email).toBe(email);
	    })
	.end((err) => {
	    // fancy end...
	    if (err) {
		return done(err);
	    };
	    User.findOne({email}).then((user) => {
		expect(user).toBeTruthy();
		expect(user.password).not.toEqual(password);
		done();
	    });
	});
    });

    it('should return validation error is request is invalid', (done) => {

	var email = 'example@example';
	var password = 'pass';
	request(app)
	    .post('/users')
	    .send({email, password})
	    .expect(400)
	    .end(done);
    });

    it('should not create a user if email in use', (done) => {
	var email = users[0].email;
	request(app)
	    .post('/users')
	    .send({email})
	    .expect(400)
	    .end(done);
    });
});
