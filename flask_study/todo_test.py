# https://pybit.es/simple-flask-api.html
# https://github.com/pybites/blog_code/blob/master/flaskapi/test_app.py
import json
from todo import app, TODOS
import unittest

# TODOS = {
#     'todo1': {'task': 'build an API'},
#     'todo2': {'task': '?????'},
#     'todo3': {'task': 'profit!'},
# }

class TestApi(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    def test_get_todos(self):
        response = self.app.get('/todos')
        self.assertEqual(json.loads(response.get_data().decode()), TODOS)

    def test_post_todos(self):
        response = self.app.post('/todos',
                                     data=json.dumps({'task':'walk'}),
                                     content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(json.loads(response.get_data().decode()), {'task':'walk'})

    def test_get_todo1(self):
        response = self.app.get('/todos/todo1')
        self.assertEqual(json.loads(response.get_data().decode()), TODOS['todo1'])

    def test_put_todo1(self):
        item = {'task': 'make a love'}
        response = self.app.put('/todos/todo1',
                                   data=json.dumps(item),
                                   content_type='application/json')
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.get_data().decode())
        self.assertEqual(data, item)

    def test_delete_todo2(self):
        response = self.app.delete('/todos/todo2')
        self.assertEqual(response.status_code, 204)
        response = self.app.delete('/todos/todo5')
        self.assertEqual(response.status_code, 404)

if __name__ == '__main__':
    unittest.main()