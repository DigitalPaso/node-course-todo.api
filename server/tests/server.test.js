const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require ('mongodb');


const {app} = require ('../server.js');
const {Todo} = require ('../models/todo.js');

var todos = [
    {_id: new ObjectID(),
    text: "First test todo"},
    {_id: new ObjectID(),
    text: "Second test todo"}
];

beforeEach((done) => {
    Todo.remove({}).then(() => {
	Todo.insertMany (todos);
    }).then(() => done());
});

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

    if ('should return 404 if todo not found', (done) => {
	var id = new ObjectID().toHexString();
	request(app)
	.get(`/todos/${id}`)
	.expect(404)
	.end(done);
    });

    if ('should return 404 if for invalid object ids ', (done) => {
	var badId = '123';
	request(app)
	.get(`/todos/${badId.toHexString()}`)
	.expect(404)
	.end(done);
    });


});

