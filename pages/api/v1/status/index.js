function status(request, response) {
  response.status(200).json({ text: "Hello 😁" });
}

export default status;
