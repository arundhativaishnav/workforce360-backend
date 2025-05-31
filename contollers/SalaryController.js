import Salary from '../Models/salary.js'; 
import Employee from '../Models/Employee.js';


const AddSalary = async ( req , res ) =>{
        try {
             const {employeeId , basicSalary ,allowances , deductions , payDate } = req.body;
             const totalSalary = parseInt(basicSalary) + parseInt(allowances) - parseInt(deductions) ;
             const salary = new Salary({
                 employeeId ,
                 basicSalary ,
                 allowances ,
                 deductions ,
                 netSalary: totalSalary ,
                 payDate ,                 
             })
             await salary.save()
             return res.json({message : "Salary Added Successfully" , data : salary })
        } catch (error) {
            return res.status(500).json({message : "Error Occured in add salary " , error : error })
        }
}
const getSalary = async (req, res) => {
  try {
    const { id } = req.params;
    let salary = await Salary.find({ employeeId: id }).populate('employeeId');

    // If no records found by direct employeeId, try resolving by userId
    if (!salary || salary.length === 0) {
      const employee = await Employee.findOne({ userId: id });
      if (!employee) {
        return res.status(404).json({ success: false, message: 'Employee not found.' });
      }

      salary = await Salary.find({ employeeId: employee._id }).populate('employeeId');
      console.log('Param ID:', id);
      console.log('Salary:', salary);
    }

    // Still no salary data found
    if (!salary || salary.length === 0) {
      return res.status(404).json({ success: false, message: 'No salary records found for this employee.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Salary Details',
      salary,
    });
  } catch (error) {
    console.error('Error in getSalary:', error);
    return res.status(500).json({
      success: false,
      message: 'Error occurred while fetching salary',
      error,
    });
  }
};



export {AddSalary , getSalary} ;