import { Request, Response } from "express";
import Task, { ITask } from "../models/task.model";



// create task
export const createTask = async (req: Request<{}, {}, ITask>, res: Response)=>{

    try{

        // console.log("Logged in user ID:", req.user?._id);
          const {title,description,priority,status,due_date} = req.body;

        // create Task
        const task = await Task.create({
            title,
            priority,
            description,
            status,
            due_date,
            user_id: req.user?._id
        })

        // task owner
        const populatedTask = await task.populate("user_id", "name email");
        
        // send response
        res.status(200).json({
            success:true,
            data:populatedTask,
            message:"task created succeesfully"
        })
    }catch (error: any) {
    console.error("Mongoose Error Detail:", error.message); 
    res.status(400).json({
        success: false,
        message: error.message 
    });
    }


}

// get all tasks with filtering
export const getAllTasks = async (req: Request, res: Response) => {

    try {
        // destructure query parameters
        const { status, priority, page = 1, limit = 10 } = req.query;

        // always filter by the logged-in user for security
        let query: any = { user_id: req.user?._id };

        // optional filters if they exist in the URL
        if (status) query.status = status;
        if (priority) query.priority = priority;

        // pagination Logic
        const skip = (Number(page) - 1) * Number(limit);
        const totalTasks = await Task.countDocuments(query);
        const totalPages = Math.ceil(totalTasks / Number(limit));

        // query with Sort, Skip, and Limit
        const tasks = await Task.find(query)
            .sort({ createdAt: -1 }) // Newest first
            .skip(skip)
            .limit(Number(limit))
            .populate({
        path: 'user_id',
        select: 'name email' 
    });

        // send response
        res.status(200).json({
            success: true,
            data: tasks,
            pagination: {
                current_page: Number(page),
                total_pages: totalPages,
                total_tasks: totalTasks
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error while fetching tasks"
        });
    }
};

// get single task
export const getTaskById = async(req:Request,res:Response)=>{

    try{
        const {id} = req.params;

        // find task by ID
        const task = await Task.findById(id).populate('user_id', 'name email');;
        
        // check if task exists
        if(!task){
            return res.status(404).json({
                success:false,
                message:"Task doesn't exists"
            });
        }

        // authorization check: compare owner ID with logged-in user ID

        if(task.user_id.toString() !== req.user?._id.toString()){
           return res.status(403).json({
                success: false,
                message: "Not authorized to view this task"
            });
        }

        // send the task
        res.status(200).json({
            success: true,
            data: task
        });
    }catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error while fetching a single tasks"
        });
    }

}


// update the task
export const updateTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // find the task first to check ownership
        let task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        // ownership check: only the owner can update the task
        if (task.user_id.toString() !== req.user?._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this task"
            });
        }

        // update the task
        // { new: true } returns the updated document
        // { runValidators: true } ensures the new data follows schema rules
        task = await Task.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: task
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server Error while updating the task"
        });
    }
};


export const deleteTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // find the task first to check ownership
        let task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        // ownership check: only the owner can update the task
        if (task.user_id.toString() !== req.user?._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this task"
            });
        }

        // delete the task
        await Task.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
           
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server Error while deleting the task"
        });
    }
};


