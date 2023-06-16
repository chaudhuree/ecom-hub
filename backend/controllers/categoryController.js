const Category = require("../models/categoryModel");

// create category
const addCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ name: req.body.name });
    if (category) {
      return res.status(400).json({ msg: "Category already exists" });
    }
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.json(newCategory);
  } catch (error) {
    res.send("something went wrong");
    console.log(error);
  }
};

// get category
const getCategory = async (req, res) => {
  try {
    const category = await Category.find();
    res.send(category);
  } catch (error) {
    console.log(error);
  }
};

// update category
const updateCategory = async (req, res) => {
  try {
    const categoryUpdate = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.send(categoryUpdate);
  } catch (error) {
    console.log(error);
  }
};

// delete category
const deleteCategory = async (req, res) => {
  try {
    const categoryDelete = await Category.findByIdAndDelete(req.params.id);
    res.send(categoryDelete);
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  addCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};
