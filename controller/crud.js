const express=require("express");
const Router=express.Router();
const db=require("../db");

Router.use(express.json());
Router.use(express.urlencoded({ extended: true }));

function isAdmin(role){
	return role==="admin";
}

Router.get("/tasks",async (req,res)=>{
	const role=req.query.role;
	const name=req.query.name;

	if(!role || !name){
		return res.status(400).json({message:"Please provide role and name"});
	}

	if(isAdmin(role)){
		const tasks=await db.query("SELECT * FROM tasks ORDER BY id DESC");
		return res.status(200).json({message:"All tasks fetched successfully",tasks:tasks.rows});
	}

	const tasks=await db.query("SELECT * FROM tasks WHERE name=$1 ORDER BY id DESC",[name]);
	return res.status(200).json({message:"User tasks fetched successfully",tasks:tasks.rows});
});

Router.post("/tasks",async (req,res)=>{
	const {task,name,role}=req.body;

	if(!task || !name || !role){
		return res.status(400).json({message:"Please provide task, name and role"});
	}

	const created=await db.query(
		"INSERT INTO tasks(task,name) VALUES($1,$2) RETURNING *",
		[task,name]
	);

	return res.status(201).json({
		message:"Task created successfully",
		task:created.rows[0]
	});
});

Router.put("/tasks/:id",async (req,res)=>{
	const {id}=req.params;
	const {task,name,role}=req.body;

	if(!task || !name || !role){
		return res.status(400).json({message:"Please provide task, name and role"});
	}

	let updated;

	if(isAdmin(role)){
		updated=await db.query(
			"UPDATE tasks SET task=$1, name=$2 WHERE id=$3 RETURNING *",
			[task,name,id]
		);
	}else{
		updated=await db.query(
			"UPDATE tasks SET task=$1 WHERE id=$2 AND name=$3 RETURNING *",
			[task,id,name]
		);
	}

	if(updated.rows.length===0){
		return res.status(404).json({message:"Task not found or not allowed"});
	}

	return res.status(200).json({
		message:"Task updated successfully",
		task:updated.rows[0]
	});
});

Router.delete("/tasks/:id",async (req,res)=>{
	const {id}=req.params;
	const {name,role}=req.body;

	if(!name || !role){
		return res.status(400).json({message:"Please provide name and role"});
	}

	let deleted;

	if(isAdmin(role)){
		deleted=await db.query("DELETE FROM tasks WHERE id=$1 RETURNING *",[id]);
	}else{
		deleted=await db.query("DELETE FROM tasks WHERE id=$1 AND name=$2 RETURNING *",[id,name]);
	}

	if(deleted.rows.length===0){
		return res.status(404).json({message:"Task not found or not allowed"});
	}

	return res.status(200).json({
		message:"Task deleted successfully",
		task:deleted.rows[0]
	});
});

module.exports=Router;
