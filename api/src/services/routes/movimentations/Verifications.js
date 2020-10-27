const errorResponseTreatment = require('../../../shared/utils/utils');

const Router = require('express');
const router = Router();

//const GetVerifications = require('../../session/movimentations/verifications/GetVerifications');
// const RegisterVerification = require('../../session/movimentations/verifications/RegisterVerification');

// router.post('/', async (req, res, next) => {
//   try {
//     const response = await new RegisterVerification().run(req);

//     next();
//     res.status(200).send(response);
//   } catch (err) {
//     const responseError = errorResponseTreatment(err);
    
//     res.status(responseError.status).send(responseError);
//   }
// });

module.exports = router;
