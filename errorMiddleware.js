
export const notFoundError = (req, res) => {
    res.status(404).json({ error: `not found`, message: `pokemon at ${req.path} not found` })
};
