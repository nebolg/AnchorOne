# AnchorOne Backend

Node.js + Express backend for the AnchorOne multi-addiction recovery app.

## Setup

1. **Copy environment file:**
```bash
cp .env.example .env
```

2. **Configure .env with your credentials:**
- PostgreSQL database URL
- Firebase Admin credentials (optional)
- Cloudinary credentials (optional)
- JWT secret

3. **Install dependencies:**
```bash
npm install
```

4. **Create PostgreSQL database:**
```sql
CREATE DATABASE anchorone;
```

5. **Run migrations:**
```bash
npm run migrate
```

6. **Seed default data:**
```bash
npm run seed
```

7. **Start the server:**
```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/anonymous` - Create anonymous user
- `POST /api/auth/set-username` - Set username
- `POST /api/auth/refresh` - Refresh token

### Users
- `GET /api/users/me` - Get profile
- `PATCH /api/users/me` - Update profile
- `DELETE /api/users/me` - Delete account
- `GET /api/users/me/export` - Export all data (GDPR)

### Addictions
- `GET /api/addictions` - List all addictions
- `GET /api/addictions/mine` - Get user's addictions
- `POST /api/addictions/mine` - Add addiction
- `POST /api/addictions/custom` - Create custom addiction
- `DELETE /api/addictions/mine/:id` - Remove addiction

### Sobriety
- `GET /api/sobriety/streaks` - Get all streaks
- `GET /api/sobriety/streak/:id` - Get single streak
- `POST /api/sobriety/log` - Log day (clean/slip)
- `POST /api/sobriety/slip` - Log slip
- `POST /api/sobriety/restart/:id` - Restart streak

### Cravings
- `POST /api/cravings` - Log craving
- `GET /api/cravings` - Get cravings history
- `POST /api/cravings/mood` - Log mood

### Community
- `GET /api/posts` - Get feed
- `POST /api/posts` - Create post
- `GET /api/comments/post/:id` - Get comments
- `POST /api/comments` - Add comment
- `POST /api/reactions/toggle` - Toggle reaction

### Messages
- `GET /api/messages/conversations` - Get conversations
- `GET /api/messages/with/:userId` - Get chat messages
- `POST /api/messages` - Send message

### Insights
- `GET /api/insights/craving-heatmap` - Get heatmap data
- `GET /api/insights/triggers` - Get trigger analysis
- `GET /api/insights/patterns` - Get AI-safe patterns

## Database Schema

Tables: `users`, `addictions`, `user_addictions`, `sobriety_logs`, `craving_logs`, `mood_logs`, `posts`, `comments`, `reactions`, `messages`

Run `npm run migrate` to create all tables.

## License

Private - All rights reserved.
