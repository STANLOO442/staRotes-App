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
exports.loginPage = void 0;
const loginPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const locals = {
        title: "Stanley's Note App",
        description: "Express.ts"
    };
    res.render('login/index', {
        locals,
        layout: '../my-views/layouts/login'
    });
});
exports.loginPage = loginPage;
/**export const loginUser = async (req: Request, res: Response) => {
  const { fullname, password } = req.body;

try {
  // Check if the user exists
  const user = await User.findOne({ where: { fullname } });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Check if the password is correct
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate a token
  const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });

  return res.status(200).json({ token });
} catch (error) {
  console.error('Error logging in user:', error);
  return res.status(500).json({ message: 'Internal server error' });
}
};**/ 
