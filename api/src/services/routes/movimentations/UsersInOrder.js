const Router = require('express');
const errorResponseTreatment = require('../../../shared/utils/utils');

const router = Router();

const GetUsersInOrder = require('../../session/movimentations/usersInOrder/GetUsersInOrder');

router.get('/', async (req, res, next) => {
  try {
    const response = await new GetUsersInOrder().run(req);

    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

// router.post('/get-report-requester', async (req, res, next) => {
//   try {
//     const response = await listReportRequester.run(req);

//     next();
//     res.status(200).send(response);
//   } catch (err) {
//     const responseError = errorResponseTreatment(err);
    
//     res.status(responseError.status).send(responseError);
//   }
// });

// router.post('/register', async (req, res, next) => {
//   try {
//     const response = await register.run(req);

//     next();
//     res.status(200).send(response);
//   } catch (err) {
//     const responseError = errorResponseTreatment(err);
    
//     res.status(responseError.status).send(responseError);
//   }
// });

// router.post('/get-geral-user', async (req, res, next) => {
//   try {
//     const response = await getusergeral.run(req);

//     next();
//     res.status(200).send(response);
//   } catch (err) {
//     const responseError = errorResponseTreatment(err);
    
//     res.status(responseError.status).send(responseError);
//   }
// });

// router.put('/:id', async (req, res, next) => {
//   try {
//     const response = await update.run(req);

//     next();
//     res.status(200).send(response);
//   } catch (err) {
//     const responseError = errorResponseTreatment(err);
    
//     res.status(responseError.status).send(responseError);
//   }
// });


module.exports = router;
