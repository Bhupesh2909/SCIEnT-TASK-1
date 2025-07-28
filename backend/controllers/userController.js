import User from "../models/User.js";

export const createUser = async (req, res) => {
  const user = req.body;
  if (!user.name || !user.email || !user.password || !user.role) {
    return res.status(400).json({ message: 'Please fill in all Details' });
  }
  try {
    const newUser = new User(user);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error in creating User: ", error.message);
    res.status(500).json({ message: 'Server Error' });
  }
}

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in fetching Users: ", error.message);
    res.status(500).json({ message: 'Server Error' });
  }
}

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in fetching User: ", error.message);
    res.status(500).json({ message: 'Server Error' });
  }
}

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in updating User: ", error.message);
    res.status(500).json({ message: 'Server Error' });
  }
}

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error("Error in deleting User: ", error.message);
    res.status(500).json({ message: 'Server Error' });
  }
}
