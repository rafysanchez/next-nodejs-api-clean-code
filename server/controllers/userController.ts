import { Request, Response } from 'express';
import { userRepository } from '../db/inMemoryStore.ts';
import { UserStatus } from '../types/user.ts';

export class UserController {
  public async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const { search, role, department, status, sortBy, sortOrder } = req.query;

      const result = await userRepository.findAll({
        search: typeof search === 'string' ? search : undefined,
        role: typeof role === 'string' ? role : undefined,
        department: typeof department === 'string' ? department : undefined,
        status: typeof status === 'string' ? status : undefined,
        sortBy: typeof sortBy === 'string' ? sortBy : undefined,
        sortOrder: sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : undefined,
      });

      res.status(200).json({
        success: true,
        data: result.data,
        total: result.total,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erro interno ao buscar usuários.',
        error: error.message,
      });
    }
  }

  public async getStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await userRepository.getStats();
      res.status(200).json({
        success: true,
        stats,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erro ao compilar estatísticas.',
        error: error.message,
      });
    }
  }

  public async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await userRepository.findById(id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Usuário não encontrado.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar usuário.',
        error: error.message,
      });
    }
  }

  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, role, department, phone, status, bio } = req.body;

      if (!name || typeof name !== 'string' || name.trim().length < 3) {
        res.status(400).json({
          success: false,
          message: 'O nome é obrigatório e deve ter no mínimo 3 caracteres.',
        });
        return;
      }

      if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        res.status(400).json({
          success: false,
          message: 'Endereço de e-mail inválido.',
        });
        return;
      }

      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        res.status(409).json({
          success: false,
          message: 'Já existe um usuário cadastrado com este e-mail.',
        });
        return;
      }

      const newUser = await userRepository.create({
        name,
        email,
        role,
        department,
        phone,
        status,
        bio,
      });

      res.status(201).json({
        success: true,
        message: 'Usuário cadastrado com sucesso!',
        data: newUser,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erro ao cadastrar usuário.',
        error: error.message,
      });
    }
  }

  public async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, email, role, department, phone, status, bio } = req.body;

      const user = await userRepository.findById(id);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Usuário não encontrado para atualização.',
        });
        return;
      }

      if (name && (typeof name !== 'string' || name.trim().length < 3)) {
        res.status(400).json({
          success: false,
          message: 'O nome deve ter no mínimo 3 caracteres.',
        });
        return;
      }

      if (email && (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))) {
        res.status(400).json({
          success: false,
          message: 'Endereço de e-mail inválido.',
        });
        return;
      }

      if (email) {
        const existingWithEmail = await userRepository.findByEmail(email);
        if (existingWithEmail && existingWithEmail.id !== id) {
          res.status(409).json({
            success: false,
            message: 'Este e-mail já pertence a outro usuário cadastrado.',
          });
          return;
        }
      }

      const updated = await userRepository.update(id, {
        name,
        email,
        role,
        department,
        phone,
        status,
        bio,
      });

      res.status(200).json({
        success: true,
        message: 'Usuário atualizado com sucesso!',
        data: updated,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar usuário.',
        error: error.message,
      });
    }
  }

  public async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['active', 'inactive', 'pending'].includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Status inválido. Use "active", "inactive" ou "pending".',
        });
        return;
      }

      const updated = await userRepository.updateStatus(id, status as UserStatus);
      if (!updated) {
        res.status(404).json({
          success: false,
          message: 'Usuário não encontrado.',
        });
        return;
      }

      const statusLabels: Record<string, string> = {
        active: 'Ativo',
        inactive: 'Inativo',
        pending: 'Pendente',
      };

      res.status(200).json({
        success: true,
        message: `Status do usuário alterado para "${statusLabels[status]}".`,
        data: updated,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar status.',
        error: error.message,
      });
    }
  }

  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await userRepository.delete(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Usuário não encontrado para exclusão.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: `Usuário "${deleted.name}" foi removido com sucesso.`,
        data: deleted,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erro ao excluir usuário.',
        error: error.message,
      });
    }
  }

  public async resetData(_req: Request, res: Response): Promise<void> {
    try {
      const users = await userRepository.reset();
      res.status(200).json({
        success: true,
        message: 'Base de usuários restaurada para o estado padrão.',
        data: users,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erro ao reiniciar banco em memória.',
        error: error.message,
      });
    }
  }
}

export const userController = new UserController();
