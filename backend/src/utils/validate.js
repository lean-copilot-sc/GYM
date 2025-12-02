export function validate(schema, payload) {
  const { value, error } = schema.validate(payload, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    return { error: error.details.map((d) => d.message) };
  }

  return { value };
}
