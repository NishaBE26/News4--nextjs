"use client";
import { useSearchParams } from "next/navigation";
import React,{useState,useEffect} from "react";
import { getTaskById,createPost } from "@/app/services/Api";

const TaskWork =()=>{
    const[taskdata,setTaskData]=useState("");
    const searchParams=useSearchParams();
    const id =searchParams.get("id");
    useEffect=>{
        const fetchData =async ()=>{
        const task=await getTaskById(id);
        setTaskData(task);
        }
    }

    return(
        <div className="">
            task work
        </div>
    )

}
export default TaskWork;