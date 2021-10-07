const express = require('express');

const router = express.Router();

const student = require('../model/student.model');
router.post('',async (req,res) => {

    try{
    const studentpost = await student.create(req.body);
    res.status(201).json({studentpost});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({type:"error",msg:err.message});
    }

});

router.get('',async (req,res) => 
{
    let getStudentDetails = null;
    let page = req.query.page;
    if (!page) { page = 1};
    if(req.query)
    getStudentDetails = await student.find(req.query).skip((page-1)*4).limit(4).lean().exec();
    else
    getStudentDetails = await student.find().skip((page-1)*4).limit(4).lean().exec();
    

    let count = null;
    if(req.query)
    count = await student.find(req.query).lean().exec();
    else
    count = await student.find(req.query).lean().exec();
    
    const pageCount = Math.ceil(count.length / 4);

    res.status(200).json({getStudentDetails,pageCount});
});

router.delete('/:id',async (req,res) => {
    const id=req.params.id;
    const sDelete = await student.findByIdAndDelete(id);
res.status(200).json({sDelete});
} );

router.get('/:id',async (req,res) => {
    const studentDetails = await student.findById(req.params.id);
    res.status(200).json({studentDetails});
});

router.patch('/:id',async (req,res) => {

    const updatestudentDetails = await student.findByIdAndUpdate(req.params.id,req.body);
    res.status(200).json({updatestudentDetails});
});




module.exports = router;