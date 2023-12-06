"use strict";
/**import { Request, Response } from 'express';
import Note from '../model/note';
import User from '../model/user';

export const createNote = async (req: Request, res: Response) => {
  try {
    // Check if the specified user exists
    const user = await User.findByPk(req.body.userId);
    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    // Create a new note associated with the user
    const newNote = await Note.create({
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      status: req.body.status,
      userId: user.id,
    });

    return res.status(201).json(newNote);
  } catch (error) {
    console.error('Error creating note:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllNotes = async (req: Request, res: Response) => {
  try {
    const notes = await Note.findAll();
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getNote = async (req: Request, res: Response) => {
  const noteId = req.params.noteId;

  try {
    const note = await Note.findByPk(noteId);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};**/
