# Expense Tracker API

A REST API for logging personal expenses, organising them into categories, and
tracking spending summaries. Each user can only see and modify their own data.

Built for the SkillsForge Backend Development selection task.

## Tech stack

- Node.js, Express 5, TypeScript
- PostgreSQL with Prisma ORM (v7)
- Zod for request validation
- JWT authentication, bcrypt password hashing
- Swagger UI (OpenAPI 3) for documentation

## Features

Implemented:
- User registration and login (JWT)
- CRUD for categories
- CRUD for expenses (title, amount, category, date, payment method)
- Filter by category, date range, payment method
- Sort by date or amount, ascending or descending
- Pagination
- Spending summary (total and per category, optional month filter)

Not implemented:
- Docker Conternaization
- Monthly Budget Planning

## Getting started

### Prerequisites
- Node.js v22.23.1

### Setup

1. Clone and install:
   ```bash
   git clone https://github.com/abdulrahmansoyooye/skillsforge.git
   cd api
   npm install
   ```
2. Copy the environment file and review the values:
   ```bash
   cp .env.example .env
   ```
3. Apply the database migrations and generate the client:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
6. Check it is running: open http://localhost:4000/health

### Environment variables

| Variable       | Description                                   | Example |
|----------------|-----------------------------------------------|---------|
| DATABASE_URL   | Connection string the app uses                | <example> |
| DIRECT_URL     | Direct connection string used by migrations   | <example> |
| JWT_SECRET     | Secret used to sign tokens                    | <example> |
| PORT           | Server port                                   | 4000 |

## API documentation

- Swagger UI: http://localhost:4000/api
- Raw OpenAPI spec: http://localhost:4000/api/openapi.json (can be imported into Postman)
- Postman documentation link: https://documenter.getpostman.com/view/32087662/2sBYHXPdA7

To call protected endpoints in Swagger: register, log in, copy the token, click
Authorize, and paste it.

## Endpoints

| Method | Path               | Auth | Description                          |
|--------|--------------------|------|--------------------------------------|
| POST   | /auth/register     | No   | Create an account                    |
| POST   | /auth/login        | No   | Receive a JWT                        |
| GET    | /categories        | Yes  | List your categories                 |


## Project structure

```
src/
  modules/        one folder per feature: routes, schemas, service
  middleware/     auth and error handling
  config/         Prisma client
  utils/          shared helpers
  docs/           OpenAPI spec
```

## How it works


- **Request flow:** For a protected route A request from the router firsts hit a requrieAuth route then it gets validated using parse function provided by zod, then hits the service where the prisma is asynchronously called, A response is returned either with details or error message and the status of the response is returned along .
- **Authentication:** A user registers using his email and password, it gets validated and the password gets hased using bcrypt, the original password is never stored int the databse, only the user id and email is retured when successful. A registered user logs in with  credentials that also gets validated the password with the hashed lookedup user's password, , wrong email or password gets rejected, the user id is tored in the sub and the token is signed using the JWT_SECRET it due to exprie in 1 day returned 
- -**Data ownership:** Every proteted request must pass through  requireAuth where the user id recieved to look up expense, category  in the databse using, not request body, Every query include the userId, another user's record returns 403(forbidden) instead of 404.
- **Filtering, sorting and pagination:** Every query request is first validated and  queried in the database using prisma's prebuilt method(skip, take), sortBy and order have predifined values defined in the zod schema and the reponse includes the total query a
-s well as total pages
- **Summary:** The totals are computed using prisma's groupBy method. the months have an optional filter from a start date to an end date, uncategorized expenses appear on their own


## Design decisions

- **Money is stored as a decimal, not a float, and returned as a string.** Javascript numbers are binary floating point, which cannot represent many decimal values exactly, the databse stores the numbers as decimal, computes the arithmetics and return them as string to javascript
- **Deleting a category keeps its expenses (their category becomes empty).**
  Expenses are kept when the category is deleted because the catego field is optional, expenses might not neccessarily have a category.
- **Validation with Zod.** Client input cannot be tusted, so it's checked before it reaches the server or database, types and rules are definedo once in the schema so that typescript infers the types from it, A failure could return a 400 error showing the field and the problem.
- **Errors:** one central handler maps errors to HTTP responses. Every error has the same JSON shape, Unexeected errors are logged in on the server and a generic 500 internal server error never leaks other errors

## Section One: algorithms

Located in algorithm`.

### 1. Two sum, unsorted list
Approach: Checking every pair is correct but it runs on O(N²)) time, because each element is comapared with later ones(for loop), this takes more time, to run on O(N), the complement of the current value(K-x) is lookedup up in a map and the index is returned alongside the subtracting if found, otherwise, it's stored in the map

Time: O(N). Space: O(N). The time is O(N) because the list traversed once and each map lookup and insert is constant on averge. 
The Space is O(N) because as the array grows the map grows with it, when the pair is found at the end(worst case), every value of the array is stored in the map

### 2. Two sum, descending list
Approach: The first and last elements are summed up and checked with the target, when found, it's returned, otherwise the left value is increased to the next element when lesser(than the total target), while the right value is decreased when larger than the target, until the whole array is traversed, when the left is too big, it has already been compared with the smallest corresponding value on the right, so it can't be summed up to the target, it can be discarded and when the right is too small, it has been compared with the corresponding value at the left, so it can be discarded


Time: O(N). Space: O(1). The array is traversed through all elements without a loop or comaprism with later ones so the time complexity is O(N), 

Run File 1: `node twoSumsUnSorted.ts`
![alt text](image.png)
Run File 2: `node twoSumsDescending.ts`
![alt text](image-1.png)
