// authRoutes.ts

import express, { Request, Response } from 'express';
import authController from '../controller/authController';
import {
  createNote,
  getNotes,
  editNote,
  deleteNote,
  renderEditNotePage,
  getAllNotes,
} from '../controller/noteController';
import { authenticateToken } from '../middleware/authMiddleware';
import User from '../model/user';
import Note from '../model/note';

const router = express.Router();

// Authentication routes for signup and login
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Routes for notes
router.post('/notes', authenticateToken, createNote);
router.get('/notes', getAllNotes);
router.get('/notes', authenticateToken, getNotes);
router.put('/notes/:id', authenticateToken, editNote);
router.delete('/notes/:id', authenticateToken, deleteNote);

router
  .route('/dashboard/edit/:id')
  .get(authenticateToken, renderEditNotePage)
  .put(authenticateToken, editNote);

// Render front-page
router.get('/', (req, res) => {
  console.log('Root URL accessed');
  const locals = {
    title: 'Note App',
    description: 'Express, Node.js, Ejs, Sqlite',
  };
  res.render('index', { locals });
});

// Render About-page
router.get('/about', (req, res) => {
  console.log('About page accessed');
  const locals = {
    title: 'About Us',
    description: 'Learn more about our app.',
  };
  res.render('about', { locals });
});

// Render signup page
router.get('/signup', (req, res) => {
  const locals = {
    title: 'Sign Up',
    description: 'Create a new account.',
    error: '',
  };
  res.render('signup/index', { layout: 'layouts/signup', locals });
});

// Render login page
router.get('/login', (req, res) => {
  const locals = {
    title: 'Log In',
    description: 'Login to your account.',
    error: '',
  };
  res.render('login/index', { layout: 'layouts/login', locals });
});

// Render Dashboard
router.get(
  '/dashboard',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const user = await User.findOne({ where: { id: req.user?.id } });

      if (!user) {
        // Redirect to login if not logged in
        res.redirect('/login');
        return;
      }

      const notes = await Note.findAll({ where: { userId: user.id } });

      const locals = {
        title: 'Dashboard',
        description: 'Your personal space.',
        userName: user.fullname || '',
        notes: notes || [],
      };

      res.render('dashboard/index', {
        layout: 'layouts/dashboard',
        locals,
      });
    } catch (error) {
      console.error('Error retrieving user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

// Render Add Note page
router.get(
  '/dashboard/add',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const user = await User.findOne({ where: { id: req.user?.id } });

      if (!user) {
        // Redirect to login if not logged in
        return res.redirect('/login');
      }

      const locals = {
        title: 'Add Note',
        description: 'Create a new note.',
        userName: user.fullname,
      };

      // Send the rendered view and terminate the function
      res.render('dashboard/add', {
        layout: 'layouts/dashboard',
        locals,
      });
    } catch (error) {
      console.error('Error retrieving user:', error);
      // Send an error response and terminate the function
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);
router.post('/dashboard/add', authenticateToken, async (req: Request, res: Response) => {
  try {
      const note = await createNote(req, res);

      if (!note || !note.id) {
          throw new Error('Invalid note object or missing note id');
      }

      if (res.statusCode === 201) {
          // Send the noteId in the response
          res.status(201).json({ noteId: note.id });
      } else {
          res.status(res.statusCode).json({ error: 'Internal Server Error' });
      }
  } catch (error) {
      console.error('Error creating note:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});





router.get(
  '/dashboard/edit/:id',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const noteId = req.params.id;
      const user = await User.findOne({ where: { id: req.user?.id } });

      if (!user) {
        res.redirect('/login');
        return;
      }

      const note = await Note.findOne({
        where: { id: noteId, userId: user.id },
      });

      if (!note) {
        res.status(404).json({ error: 'Note not found' });
        return;
      }

      const locals = {
        title: 'Edit Note',
        description: 'Edit your note.',
        userName: user.fullname,
        note,
      };

      res.render('dashboard/edit', {
        layout: 'layouts/dashboard',
        locals,
      });
    } catch (error) {
      console.error('Error retrieving user or note:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

router.put('/dashboard/edit/:id', authenticateToken, editNote);

router.get(
  '/dashboard/delete/:id',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const noteId = req.params.id;
      const user = await User.findOne({ where: { id: req.user?.id } });

      if (!user) {
        res.redirect('/login');
        return;
      }

      const note = await Note.findOne({
        where: { id: noteId, userId: user.id },
      });

      if (!note) {
        res.status(404).json({ error: 'Note not found' });
        return;
      }

      const locals = {
        title: 'Delete Note',
        description: 'Confirm note deletion.',
        userName: user.fullname,
        note,
      };

      res.render('dashboard/delete', {
        layout: 'layouts/dashboard',
        locals,
      });
    } catch (error) {
      console.error('Error retrieving user or note:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

router.delete(
  '/dashboard/delete/:id',
  authenticateToken,
  deleteNote
);

export default router;
