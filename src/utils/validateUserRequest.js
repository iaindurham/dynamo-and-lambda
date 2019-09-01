const yup = require('yup')

const userInput = yup
  .object()
  .shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup
      .string()
      .email()
      .required(),
    credentials: yup.string().required()
  })
  .noUnknown()

const userUpdate = yup
  .object()
  .shape({
    firstName: yup.string(),
    lastName: yup.string(),
    email: yup.string().email(),
    credentials: yup.string()
  })
  .noUnknown()

module.exports = {
  add: userData => userInput.validate(userData),
  update: userData => userUpdate.validate(userData)
}
