"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupPage = void 0;
const signupPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const locals = {
        title: "Stanley's Note App",
        description: "Express.ts"
    };
    res.render('signup/index', {
        locals,
        layout: '../my-views/layouts/signup'
    });
});
exports.signupPage = signupPage;
/**export const signupUser = async (req: Request, res: Response) => {
    try {
        // Check if user with the same email already exists
        const existingUser = await User.findOne({ where: { email: req.body.email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // If not, create a new user
        const newUser = await User.create({
            fullname: req.body.fullname,
            email: req.body.email,
            gender: req.body.gender,
            phone: req.body.phone,
            address: req.body.address,
            password: hashedPassword,
        });

        // Redirect to the login page after successful signup
        return res.redirect('/login');
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};**/
