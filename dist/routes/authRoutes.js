"use strict";
// authRoutes.ts
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
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../controller/authController"));
const noteController_1 = require("../controller/noteController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const user_1 = __importDefault(require("../model/user"));
const note_1 = __importDefault(require("../model/note"));
const router = express_1.default.Router();
// Authentication routes for signup and login
router.post('/signup', authController_1.default.signup);
router.post('/login', authController_1.default.login);
// Routes for notes
router.post('/notes', authMiddleware_1.authenticateToken, noteController_1.createNote);
router.get('/notes', noteController_1.getAllNotes);
router.get('/notes', authMiddleware_1.authenticateToken, noteController_1.getNotes);
router.put('/notes/:id', authMiddleware_1.authenticateToken, noteController_1.editNote);
router.delete('/notes/:id', authMiddleware_1.authenticateToken, noteController_1.deleteNote);
router
    .route('/dashboard/edit/:id')
    .get(authMiddleware_1.authenticateToken, noteController_1.renderEditNotePage)
    .put(authMiddleware_1.authenticateToken, noteController_1.editNote);
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
router.get('/dashboard', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield user_1.default.findOne({ where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id } });
        if (!user) {
            // Redirect to login if not logged in
            res.redirect('/login');
            return;
        }
        const notes = yield note_1.default.findAll({ where: { userId: user.id } });
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
    }
    catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Render Add Note page
router.get('/dashboard/add', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const user = yield user_1.default.findOne({ where: { id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id } });
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
    }
    catch (error) {
        console.error('Error retrieving user:', error);
        // Send an error response and terminate the function
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
router.post('/dashboard/add', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const note = yield (0, noteController_1.createNote)(req, res);
        if (!note || !note.id) {
            throw new Error('Invalid note object or missing note id');
        }
        if (res.statusCode === 201) {
            // Send the noteId in the response
            res.status(201).json({ noteId: note.id });
        }
        else {
            res.status(res.statusCode).json({ error: 'Internal Server Error' });
        }
    }
    catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
router.get('/dashboard/edit/:id', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const noteId = req.params.id;
        const user = yield user_1.default.findOne({ where: { id: (_c = req.user) === null || _c === void 0 ? void 0 : _c.id } });
        if (!user) {
            res.redirect('/login');
            return;
        }
        const note = yield note_1.default.findOne({
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
    }
    catch (error) {
        console.error('Error retrieving user or note:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
router.put('/dashboard/edit/:id', authMiddleware_1.authenticateToken, noteController_1.editNote);
router.get('/dashboard/delete/:id', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const noteId = req.params.id;
        const user = yield user_1.default.findOne({ where: { id: (_d = req.user) === null || _d === void 0 ? void 0 : _d.id } });
        if (!user) {
            res.redirect('/login');
            return;
        }
        const note = yield note_1.default.findOne({
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
    }
    catch (error) {
        console.error('Error retrieving user or note:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
router.delete('/dashboard/delete/:id', authMiddleware_1.authenticateToken, noteController_1.deleteNote);
exports.default = router;
