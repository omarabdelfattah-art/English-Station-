# API Documentation

Base URL: `http://localhost:5000`

## Endpoints

### Users

- `GET /users`  
  List all users.

- `GET /users/:id`  
  Get a user by ID.

- `POST /users`  
  Create a new user.

- `PUT /users/:id`  
  Update a user.

- `DELETE /users/:id`  
  Delete a user.

### Lessons

- `GET /lessons`  
  List all lessons.

- `GET /lessons/:id`  
  Get a lesson by ID.

- `POST /lessons`  
  Create a new lesson.

- `PUT /lessons/:id`  
  Update a lesson.

- `DELETE /lessons/:id`  
  Delete a lesson.

### Quizzes

- `GET /quizzes`  
  List all quizzes.

- `GET /quizzes/:id`  
  Get a quiz by ID.

- `POST /quizzes`  
  Create a new quiz.

- `PUT /quizzes/:id`  
  Update a quiz.

- `DELETE /quizzes/:id`  
  Delete a quiz.

## Notes

- All endpoints return JSON.
- Data is stored in [`server/db.json`](server/db.json).
- For more advanced queries, see [JSON Server Docs](https://github.com/typicode/json-server).