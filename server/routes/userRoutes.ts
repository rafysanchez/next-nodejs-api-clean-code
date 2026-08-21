import { Router } from 'express';
import { userController } from '../controllers/userController.ts';

export const userRoutes = Router();

// Stats route (before :id)
userRoutes.get('/stats', (req, res) => {
  userController.getStats(req, res);
});

// Reset seed data
userRoutes.post('/reset', (req, res) => {
  userController.resetData(req, res);
});

// Collection routes
userRoutes.get('/', (req, res) => {
  userController.getUsers(req, res);
});

userRoutes.post('/', (req, res) => {
  userController.createUser(req, res);
});

// Document routes
userRoutes.get('/:id', (req, res) => {
  userController.getUserById(req, res);
});

userRoutes.put('/:id', (req, res) => {
  userController.updateUser(req, res);
});

userRoutes.patch('/:id/status', (req, res) => {
  userController.updateStatus(req, res);
});

userRoutes.delete('/:id', (req, res) => {
  userController.deleteUser(req, res);
});
