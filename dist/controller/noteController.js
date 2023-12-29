"use strict";
// noteController.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllNotes = exports.deleteNote = exports.renderEditNotePage = exports.editNote = exports.getNotes = exports.createNote = void 0;
const note_1 = __importDefault(require("../model/note"));
const user_1 = __importDefault(require("../model/user"));
const sequelize_1 = require("sequelize");
// noteController.ts
const createNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, description, dueDate, status, content } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
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
        const note = yield note_1.default.create({
            title,
            description,
            dueDate,
            status,
            content,
            userId,
        });
        // Return the created note including the id
        return note;
    }
    catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        throw error;
    }
});
exports.createNote = createNote;
const getNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { title, fullName } = req.query;
        let whereClause = { userId };
        if (title) {
            // If title is provided, filter notes by title
            whereClause.title = {
                [sequelize_1.Op.iLike]: `%${title}%`, // Case-insensitive search
            };
        }
        if (fullName) {
            // If fullName is provided, filter notes by user's full name
            const users = yield user_1.default.findAll({
                where: {
                    fullName: {
                        [sequelize_1.Op.iLike]: `%${fullName}%`, // Case-insensitive search
                    },
                },
            });
            const userIds = users.map((user) => user.id);
            whereClause.userId = userIds;
        }
        // Retrieve notes based on the constructed where clause
        const notes = yield note_1.default.findAll({ where: whereClause });
        res.status(200).json({ notes });
    }
    catch (error) {
        console.error('Error retrieving notes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getNotes = getNotes;
const editNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const noteId = req.params.id;
        const { title, description, dueDate, status, content } = req.body;
        const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
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
        const existingNote = yield note_1.default.findOne({ where: { id: noteId, userId } });
        if (!existingNote) {
            res.status(404).json({ error: 'Note not found' });
            return;
        }
        // Update the note in the database
        yield existingNote.update({
            title,
            description,
            dueDate,
            status,
            content,
        });
        res.status(200).json({ message: 'Note updated successfully' });
    }
    catch (error) {
        console.error('Error editing note:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.editNote = editNote;
const renderEditNotePage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const noteId = req.params.id;
        console.log('Received noteId:', noteId);
        const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
        // Fetch the note from the database
        const note = yield note_1.default.findOne({ where: { id: noteId, userId } });
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
        res.status(200).json({ note, layout: 'layouts/dashboard', locals });
    }
    catch (error) {
        console.error('Error rendering edit page:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.renderEditNotePage = renderEditNotePage;
const deleteNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const noteId = req.params.id;
        const userId = (_e = req.user) === null || _e === void 0 ? void 0 : _e.id;
        // Check if noteId is provided
        if (!noteId) {
            res.status(400).json({ error: 'Note ID is required' });
            return;
        }
        // Check if the note belongs to the authenticated user
        const existingNote = yield note_1.default.findOne({ where: { id: noteId, userId } });
        if (!existingNote) {
            res.status(404).json({ error: 'Note not found' });
            return;
        }
        // Delete the note from the database
        yield existingNote.destroy();
        // res.status(200).json({ message: 'Note deleted successfully' });
        console.log('Redirecting to the dashboard');
        res.redirect('/dashboard/index');
    }
    catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.deleteNote = deleteNote;
// Helper function to validate dueDate format (YYYY-MM-DD)
const isValidDueDate = (dueDate) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(dueDate);
};
const getAllNotes = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notes = yield note_1.default.findAll();
        const locals = {
            title: 'All Notes',
            description: 'View all notes.',
            notes,
        };
        res.render('notes', { layout: 'layouts/main', locals });
    }
    catch (error) {
        console.error('Error retrieving all notes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getAllNotes = getAllNotes;
