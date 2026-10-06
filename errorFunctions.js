
export const notFoundError = (req, res, itemName) => {
    res.status(404).json({ error: `not found`, message: `${itemName} at ${req.path} not found` })
};
