function escapeRegExp(text) {
  return text.replace(/[-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

// only printing chars .match(/^[\u0020-\u007e]*$/)