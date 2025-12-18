export const countWords = (text = "") => {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
};

export const validateProject = ({ title, description }) => {
  const errors = {};

  if (!title || !title.trim()) {
    errors.title = "Project title is required";
  }

  if (countWords(description) > 100) {
    errors.description = "Description cannot exceed 100 words";
  }

  return errors;
};
