// noteController.ts

import { Request, Response } from 'express';
import Note from '../model/note';
import User from '../model/user';
import { Op } from 'sequelize'; 



 // noteController.ts

 export const createNote = async (req: Request, res: Response): Promise<Note> => {
  try {
    const { title, description, dueDate, status, content } = req.body;
    const userId = req.user?.id;

    // Check if all required fields are provided
    if (!title || !description || !status || !userId || !content) {
      res.status(400).json({ error: 'All fields are required' });
    }

    // Validate the status field
    const validStatusValues = ['Pending', 'InProgress', 'Completed'];
    if (!validStatusValues.includes(status)) {
      res.status(400).json({ error: 'Invalid status value' });
    }

    // Validate the dueDate format (optional)
    if (dueDate && !isValidDueDate(dueDate)) {
      res.status(400).json({ error: 'Invalid dueDate format' });
    }

    // Create the note in the database
    const note = await Note.create({
      title,
      description,
      dueDate,
      status,
      content,
      userId,
    });

    // Return the created note including the id
    return note;
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Internal Server Error' });
    throw error;
  }
};




export const getNotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { title, fullName } = req.query;

    let whereClause: any = { userId };

    if (title) {
      // If title is provided, filter notes by title
      whereClause.title = {
        [Op.iLike]: `%${title}%`, // Case-insensitive search
      };
    }

    if (fullName) {
      // If fullName is provided, filter notes by user's full name
      const users = await User.findAll({
        where: {
          fullName: {
            [Op.iLike]: `%${fullName}%`, // Case-insensitive search
          },
        },
      });

      const userIds = users.map((user) => user.id);
      whereClause.userId = userIds;
    }

    // Retrieve notes based on the constructed where clause
    const notes = await Note.findAll({ where: whereClause });

    res.status(200).json({ notes });
  } catch (error) {
    console.error('Error retrieving notes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const editNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const noteId = req.params.id;
    const { title, description, dueDate, status, content } = req.body;
    const userId = req.user?.id;

    // Check if all required fields are provided
    if (!title || !description || !status || !userId || !noteId || !content) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    // Validate the status field
    const validStatusValues = ['Pending', 'InProgress', 'Completed'];
    if (!validStatusValues.includes(status)) {
      res.status(400).json({ error: 'Invalid status value' });
      return;
    }

    // Validate the dueDate format (optional)
    if (dueDate && !isValidDueDate(dueDate)) {
      res.status(400).json({ error: 'Invalid dueDate format' });
      return;
    }

    // Check if the note belongs to the authenticated user
    const existingNote = await Note.findOne({ where: { id: noteId, userId } });
    if (!existingNote) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    // Update the note in the database
    await existingNote.update({
      title,
      description,
      dueDate,
      status,
      content,
    });

    res.status(200).json({ message: 'Note updated successfully' });
  } catch (error) {
    console.error('Error editing note:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const renderEditNotePage = async (req: Request, res: Response): Promise<void> => {
  try {
    const noteId = req.params.id;
    console.log('Received noteId:', noteId);
    const userId = req.user?.id;
    

    // Fetch the note from the database
    const note = await Note.findOne({ where: { id: noteId, userId } });

    if (!note) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    const locals = {
      title: 'Edit Note',
      description: 'Edit your note.',
      note,
    };

    // res.render('dashboard/edit', { layout: 'layouts/dashboard', locals });
    res.status(200).json({ note, layout: 'layouts/dashboard', locals  });
  } catch (error) {
    console.error('Error rendering edit page:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const noteId = req.params.id;
    const userId = req.user?.id;

    // Check if noteId is provided
    if (!noteId) {
      res.status(400).json({ error: 'Note ID is required' });
      return;
    }

    // Check if the note belongs to the authenticated user
    const existingNote = await Note.findOne({ where: { id: noteId, userId } });
    if (!existingNote) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    // Delete the note from the database
    await existingNote.destroy();

    // res.status(200).json({ message: 'Note deleted successfully' });
    console.log('Redirecting to the dashboard');

    res.redirect('/dashboard/index');
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Helper function to validate dueDate format (YYYY-MM-DD)
const isValidDueDate = (dueDate: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(dueDate);
};

export const getAllNotes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const notes = await Note.findAll();
    const locals = {
      title: 'All Notes',
      description: 'View all notes.',
      notes,
    };
    res.render('notes', { layout: 'layouts/main', locals });
  } catch (error) {
    console.error('Error retrieving all notes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

