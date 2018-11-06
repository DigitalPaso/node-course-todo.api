const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require ('mongodb');


const {app} = require ('../server.js');
const {Todo} = require ('../models/todo.js');

var todos = [
    {_id: new ObjectID(),
    text: "First test todo"},
    {_id: new ObjectID(),
    text: "Second test todo",
    completed: "true",
    completedAt: 239474864}
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
