export default function validateRegister(values) {
  let errors = {};

  if (values.username.length < 3) {
    errors.username = "Username must be at least 3 characters";
  }

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
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  } else if (values.password !== values.passwordConfirm) {
    errors.passwordConfirm = "Passwords do not match";
  }

  return errors;
}
