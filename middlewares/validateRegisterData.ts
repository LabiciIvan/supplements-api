import { Request, Response, NextFunction } from 'express';

const validateRegisterData = (req: Request, res: Response, next: NextFunction): Response | void => {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400).json({ message: 'Username, email, and password are required.' });
        return;
    }

    req.body.username   = username.trim();
    req.body.email      = email.trim().toLowerCase();
    req.body.password   = password.trim();

    next();
};

export default validateRegisterData;