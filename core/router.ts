import express          from 'express';
import authRouter       from '../routes/auth';
import productRouter    from '../routes/products';
import categoriesRouter from '../routes/categories';
import ordersRouter     from '../routes/orders';
import invoicesRouter   from '../routes/invoices'
import shippingRouter   from '../routes/shipping';
import usersRouter      from '../routes/users';
import dashboardRouter  from '../routes/dashboard';


const router = express.Router();


router.use('/auth', authRouter);

router.use('/products', productRouter);

router.use('/category', categoriesRouter);

router.use('/orders', ordersRouter);

router.use('/invoices', invoicesRouter);

router.use('/shipping-methods', shippingRouter);

router.use('/users', usersRouter);

router.use('/dashboard', dashboardRouter);


export default router;