const express = require ('express');
const router = express.Router();

const Category = require ('../models/Category');

//Creating. a new category 
router.post('/', async(req, res)=> {
    const {userId, name, icon} = req.body;
    if (!name)
    {
        return res.status(400).json({message: 'Category name is required'});
    }
    try {
        const newCategory = new Category ({
            user: userId,
            name,
            icon,
        });
        await newCategory.save();
        res.status(201).json({message:'Category created successfully',category: newCategory })
    } catch (error) {
        console.error ('Error creating category:'. error);
        res.status(500).json({message: 'Server error'});
    }
});

//Getting all categories for a user 
router.get('/:userId',async (req,res)=> {
    try {
        const categories = await Category.find({user: req.params.userId});
        res.json(categories); 
    } catch(error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({message: 'Server error'});
    }
});

//updating category name 
router.put('/:id', async (req, res) => {
  const { name, icon } = req.body;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, icon },
      { new: true }
    );
    res.json({ message: 'Category updated', category: updatedCategory });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


//Deleting Category
router.delete('/:id', async (req,res)=> {
    try{
        await Category.findByIdAndDelete(req.params.id);
        res.json({message: 'Category deleted'});
    }catch(error) {
        console.error('Error deleting category',error);
        res.status(500).json({message: 'Server error'});
    }
});
module.exports =router;