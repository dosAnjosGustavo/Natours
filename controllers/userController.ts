import express from 'express';

// Route Handlers

// Get All Users
const getAllUsers = (req: express.Request, res: express.Response) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

// Get User by ID
const getUserById = (req: express.Request, res: express.Response) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

// Create User
const createUser = (req: express.Request, res: express.Response) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

// Update User
const updateUser = (req: express.Request, res: express.Response) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

// Delete User
const deleteUser = (req: express.Request, res: express.Response) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
