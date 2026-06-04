import request from 'supertest';
import { app } from '../server.ts';
import { afterEach } from 'vitest';
import {
  createTestUser,
  createTestHabit,
  cleanupDatabase,
} from './helpers/db.helpers.ts';

describe('Habits API', () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  describe('POST /api/v1/habits', () => {
    it('should create a new habit', async () => {
      const { token } = await createTestUser();

      const response = await request(app)
        .post('/api/v1/habits')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Exercise daily',
          description: 'Daily exercise routine',
          frequency: 'daily',
          targetCount: 1,
        });

      expect(response.status).toBe(201);
      expect(response.body.habit).toBeDefined();
      expect(response.body.habit.name).toBe('Exercise daily');
    });

    it('should require authentication', async () => {
      const response = await request(app).post('/api/v1/habits').send({
        name: 'Exercise',
        frequency: 'daily',
      });

      expect(response.status).toBe(401);
    });

    it('should validate input data', async () => {
      const { token } = await createTestUser();

      const response = await request(app)
        .post('/api/v1/habits')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '',
          frequency: 'invalid',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/v1/habits', () => {
    it('should get all user habits', async () => {
      const { user, token } = await createTestUser();
      await createTestHabit(user.id);

      const response = await request(app)
        .get('/api/v1/habits')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.habits)).toBe(true);
      expect(response.body.habits.length).toBeGreaterThan(0);
    });

    it('should return empty array for user with no habits', async () => {
      const { token } = await createTestUser();

      const response = await request(app)
        .get('/api/v1/habits')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.habits)).toBe(true);
      expect(response.body.habits.length).toBe(0);
    });
  });

  describe('PUT /api/v1/habits/:id', () => {
    it('should update a habit', async () => {
      const { user, token } = await createTestUser();
      const habit = await createTestHabit(user.id);

      const response = await request(app)
        .put(`/api/v1/habits/${habit.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Read for 30 minutes',
          description: 'Extended reading time',
        });

      expect(response.status).toBe(200);
      expect(response.body.habit.name).toBe('Read for 30 minutes');
    });

    it('should return 404 for non-existent habit', async () => {
      const { token } = await createTestUser();
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app)
        .put(`/api/v1/habits/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated name',
        });

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/v1/habits/:id/complete', () => {
    it('should mark habit as completed', async () => {
      const { user, token } = await createTestUser();
      const habit = await createTestHabit(user.id);

      const response = await request(app)
        .post(`/api/v1/habits/${habit.id}/complete`)
        .send({})
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(201);
      expect(response.body.entry).toBeDefined();
    });

    // it('should prevent duplicate completion on same day', async () => {
    //   const { user, token } = await createTestUser();
    //   const habit = await createTestHabit(user.id);

    //   // Complete habit first time
    //   await request(app)
    //     .post(`/api/v1/habits/${habit.id}/complete`)
    //     .set('Authorization', `Bearer ${token}`)
    //     .send({})
    //     .expect(201);

    //   // Try to complete again
    //   const response = await request(app)
    //     .post(`/api/v1/habits/${habit.id}/complete`)
    //     .set('Authorization', `Bearer ${token}`);

    //   expect(response.status).toBe(400);
    // });
  });

  describe('DELETE /api/v1/habits/:id', () => {
    it('should delete a habit', async () => {
      const { user, token } = await createTestUser();
      const habit = await createTestHabit(user.id, {
        name: 'Temporary habit',
        description: 'To be deleted',
      });

      const response = await request(app)
        .delete(`/api/v1/habits/${habit.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Habit deleted successfully');
    });

    it('should return 404 for non-existent habit', async () => {
      const { token } = await createTestUser();
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app)
        .delete(`/api/v1/habits/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });
});
