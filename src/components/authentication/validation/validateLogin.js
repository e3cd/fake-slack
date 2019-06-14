export default function validateLogin(values) {
  let errors = {};

  //email validation errors

  //empty input
  if (!values.email) {
    errors.email = "Email required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  //password validation errors
  if (!values.password) {
    errors.password = "Password required";
  }

  return errors;
}
