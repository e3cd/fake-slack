export default function validateAddChanel(values) {
  let errors = {};

  if (!values.channelName) {
    errors.channelName = "Please provide a name";
  } else if (!values.channelDetails) {
    errors.channelDetails = "Please provide a description";
  }

  return errors;
}
