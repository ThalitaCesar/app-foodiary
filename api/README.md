
# Foodiary API Documentation

Foodiary API is a serverless backend built with Node.js, TypeScript, AWS Lambda, API Gateway, S3, SQS, and PostgreSQL (via Neon and Drizzle ORM). It provides endpoints for user authentication, meal management, and nutritional goal calculation.

## Main Feature

* User Authentication: Sign up and sign in with JWT-based authentication.
* Meal Management: Create, list, and retrieve meals, including file uploads (audio/image) for meal analysis.
* Nutritional Goals: Automatically calculates daily nutritional goals based on user profile.
* Serverless Architecture: Uses AWS Lambda, S3 for file storage, and SQS for meal processing queue.

## Directory Structure

- `src/clients/`: AWS SDK clients (S3, SQS)
- `src/controllers/`: Business logic for API endpoints
- `src/db/`: Database schema and connection
- `src/functions/`: Lambda handlers for each endpoint/event
- `src/lib/`: Utility libraries (JWT, goal calculation)
- `src/queues/`: Queue processors (e.g., meal analysis)
- `src/types/`: TypeScript types
- `src/utils/`: Helper functions

## Environment Variables

See `.env.example` for required variables:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT signing

## API Endpoints

| Endpoint            | Method | Description                        | Auth Required |
|---------------------|--------|------------------------------------|--------------|
| `/signin`           | POST   | User sign in                       | No           |
| `/signup`           | POST   | User sign up                       | No           |
| `/me`               | GET    | Get current user profile           | Yes          |
| `/meals`            | POST   | Create a new meal (get upload URL) | Yes          |
| `/meals`            | GET    | List meals for a specific date     | Yes          |
| `/meals/{mealId}`   | GET    | Get meal by ID                     | Yes          |

## File Upload & Processing

- **Create Meal:** Returns a presigned S3 URL for uploading a meal file.
- **File Uploaded Event:** Triggered when a file is uploaded to S3, sends a message to SQS.
- **Process Meal:** SQS-triggered Lambda processes the meal, updates status and analysis results.

## Database Schema

See `src/db/schema.ts`:

- **usersTable:** Stores user profile and nutritional goals.
- **mealsTable:** Stores meal records, status, input type, analysis results.

## Development

- Install dependencies: `npm install`
- Local development: `npm run dev`
- Deploy: `serverless deploy`

## References

- `serverless.yml`: Serverless configuration
- `drizzle.config.ts`: ORM configuration

