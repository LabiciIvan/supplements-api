const express = require('express');
const router = express.Router();

import { Request, Response, NextFunction, Router } from 'express';

interface RouterParams {
    req: Request;
    res: Response;
    next: NextFunction;
}

router.get('/', ({ req, res, next }: RouterParams) => {
    res.json({
        message: 'Message from the index route',
    });
});

router.get('/product', ({ req, res, next}: RouterParams) => {
    res.json({
        message: 'Message from the product route',
    });
});

module.exports = router;