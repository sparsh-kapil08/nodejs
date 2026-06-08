const login=document.getElementById("login");
const register=document.getElementById("Register");
const loginform=document.getElementById("loginform");
const home=document.getElementById("home");
const signupform=document.getElementById("signupform");
const signbtn=document.getElementById("signbtn");
const logbtn=document.getElementById("logbtn");
const logout=document.getElementById("logout");
const logoutadmin=document.getElementById("logoutadmin");
const welcome=document.getElementById("welcome");
const adminwelcome=document.getElementById("adminwelcome");
const greet=document.getElementById("greet");
const userrole=document.getElementById("userrole");
const admingreet=document.getElementById("admingreet");
const adminrole=document.getElementById("adminrole");
const taskpanel=document.getElementById("taskpanel");
const tasktitle=document.getElementById("tasktitle");
const tasktext=document.getElementById("tasktext");
const taskid=document.getElementById("taskid");
const addtask=document.getElementById("addtask");
const updatetask=document.getElementById("updatetask");
const deletetask=document.getElementById("deletetask");
const refreshtask=document.getElementById("refreshtask");
const taskmessage=document.getElementById("taskmessage");
const tasklist=document.getElementById("tasklist");

let currentUserName="";
let currentUserRole="";

login.addEventListener("click",()=>{
    loginform.classList.remove("hidden");
    home.classList.add("hidden");
});
register.addEventListener("click",()=>{
    signupform.classList.remove("hidden");
    home.classList.add("hidden");
});
signbtn.addEventListener("click",()=>{
    const signupdata={
    email:document.getElementById("email2").value,
    password:document.getElementById("pass2").value,
    name:document.getElementById("username").value,
    role:document.getElementById("role2").value
}
    console.log(signupdata);
    if(signupdata.email && signupdata.password && signupdata.name && signupdata.role){
        getSignup(signupdata)
            .then((signupResponse)=>{
                if(signupResponse.message==="User created successfully"){
                    currentUserName=signupResponse.user;
                    currentUserRole=signupResponse.role;
                    signupform.classList.add("hidden");
                    home.classList.add("hidden");
                    loginform.classList.add("hidden");
                    if(signupResponse.role==="admin"){
                        welcome.classList.add("hidden");
                        adminwelcome.classList.remove("hidden");
                        admingreet.textContent=signupResponse.message;
                        adminrole.textContent=`Name: ${signupResponse.user} | Role: ${signupResponse.role}`;
                    }else{
                        adminwelcome.classList.add("hidden");
                        welcome.classList.remove("hidden");
                        greet.textContent=signupResponse.message;
                        userrole.textContent=`Name: ${signupResponse.user} | Role: ${signupResponse.role}`;
                    }
                    showTaskPanel(signupResponse.user,signupResponse.role);
                }else{
                    const signupnote=document.getElementById("signupnote") || createSignupNote();
                    signupnote.textContent=signupResponse.message || "User already exists";
                    signupform.classList.remove("hidden");
                }
            })
            .catch((error)=>{
                console.error(error);
            });
    }
});
logbtn.addEventListener("click",()=>{
    const logindata={
    email:document.getElementById("email1").value,
    password:document.getElementById("pass1").value,
    role:document.getElementById("role1").value
}
    if (logindata.email && logindata.password && logindata.role){
        getLogin(logindata)
            .then((loginResponse)=>{
                if(loginResponse.message==="User logged in successfully"){
                    currentUserName=loginResponse.user;
                    currentUserRole=loginResponse.role;
                    if(loginResponse.role==="admin"){
                        loginform.classList.add("hidden");
                        welcome.classList.add("hidden");
                        home.classList.add("hidden");
                        adminwelcome.classList.remove("hidden");
                        admingreet.textContent=loginResponse.message;
                        adminrole.textContent=`Name: ${loginResponse.user} | Role: ${loginResponse.role}`;
                        showTaskPanel(loginResponse.user,loginResponse.role);
                    }else{
                        loginform.classList.add("hidden");
                        adminwelcome.classList.add("hidden");
                        home.classList.add("hidden");
                        welcome.classList.remove("hidden");
                        greet.textContent=loginResponse.message;
                        userrole.textContent=`Name: ${loginResponse.user} | Role: ${loginResponse.role}`;
                        showTaskPanel(loginResponse.user,loginResponse.role);
                    }
                }else{
                    console.log(loginResponse.message);
                }
                
            })
            .catch((error)=>{
                console.error(error);
            });
    }
});
logout.addEventListener("click",()=>{
    logoutUser();
});
logoutadmin.addEventListener("click",()=>{
    logoutUser();
});
addtask.addEventListener("click",()=>{
    if(tasktext.value && currentUserName && currentUserRole){
        createTask({
            task:tasktext.value,
            name:currentUserName,
            role:currentUserRole
        });
    }
});
updatetask.addEventListener("click",()=>{
    if(taskid.value && tasktext.value && currentUserName && currentUserRole){
        updateTask(taskid.value,{
            task:tasktext.value,
            name:currentUserName,
            role:currentUserRole
        });
    }
});
deletetask.addEventListener("click",()=>{
    if(taskid.value && currentUserName && currentUserRole){
        deleteTask(taskid.value,{name:currentUserName,role:currentUserRole});
    }
});
refreshtask.addEventListener("click",()=>{
    if(currentUserName && currentUserRole){
        loadTasks();
    }
});
    
async function logoutUser(){
    const res=await fetch(import.meta.env.VITE_URL+"/logout",{
        method:"POST",});
    const data=await res.json();
    welcome.classList.add("hidden");
    adminwelcome.classList.add("hidden");
    taskpanel.classList.add("hidden");
    home.classList.remove("hidden");
    const h=document.createElement("h1");
    h.textContent=data.message;
    home.appendChild(h);
    currentUserName="";
    currentUserRole="";
    tasklist.innerHTML="";
    taskmessage.textContent="";
}

function showTaskPanel(name,role){
    taskpanel.classList.remove("hidden");
    tasktitle.textContent=role==="admin" ? `Admin Tasks for ${name}` : `Tasks for ${name}`;
    taskmessage.textContent="";
    tasktext.value="";
    taskid.value="";
    loadTasks();
}

function renderTasks(tasks){
    tasklist.innerHTML="";
    if(!tasks || tasks.length===0){
        tasklist.textContent="No tasks found";
        return;
    }

    tasks.forEach((item)=>{
        const box=document.createElement("div");
        const text=document.createElement("p");
        const owner=document.createElement("p");
        const edit=document.createElement("button");
        const remove=document.createElement("button");

        text.textContent=`ID: ${item.id} | Task: ${item.task}`;
        owner.textContent=`Name: ${item.name}`;
        edit.textContent="Edit";
        remove.textContent="Delete";

        edit.addEventListener("click",()=>{
            taskid.value=item.id;
            tasktext.value=item.task;
        });

        remove.addEventListener("click",()=>{
            deleteTask(item.id,{name:currentUserName,role:currentUserRole});
        });

        box.appendChild(text);
        box.appendChild(owner);
        box.appendChild(edit);
        box.appendChild(remove);
        tasklist.appendChild(box);
    });
}

function createSignupNote(){
    const note=document.createElement("p");
    note.id="signupnote";
    signupform.appendChild(note);
    return note;
}

async function getLogin(logindata){
    const res=await fetch(import.meta.env.VITE_URL+"/login",{
            method:"POST",
            withCredentials:true,
            credentials:"include",
            body:JSON.stringify(logindata),
            headers:{
                "Content-Type":"application/json"
            }
        });
    const data=await res.json();
    return data;
}
async function getSignup(signupdata){
    const res=await fetch(import.meta.env.VITE_URL+"/signup",{
            method:"POST",
            withCredentials:true,
            credentials:"include",
            body:JSON.stringify(signupdata),
            headers:{
                "Content-Type":"application/json"
            }
        });
    const data=await res.json();
    return data;
}

    async function loadTasks(){
        const res=await fetch(`${import.meta.env.VITE_URL}/tasks?name=${encodeURIComponent(currentUserName)}&role=${encodeURIComponent(currentUserRole)}`,{
            credentials:"include"
        });
        const data=await res.json();
        taskmessage.textContent=data.message;
        renderTasks(data.tasks);
    }

    async function createTask(taskdata){
        const res=await fetch(import.meta.env.VITE_URL+"/tasks",{
            method:"POST",
            credentials:"include",
            body:JSON.stringify(taskdata),
            headers:{
                "Content-Type":"application/json"
            }
        });
        const data=await res.json();
        taskmessage.textContent=data.message;
        tasktext.value="";
        taskid.value="";
        loadTasks();
    }

    async function updateTask(id,taskdata){
        const res=await fetch(import.meta.env.VITE_URL+`/tasks/${id}`,{
            method:"PUT",
            credentials:"include",
            body:JSON.stringify(taskdata),
            headers:{
                "Content-Type":"application/json"
            }
        });
        const data=await res.json();
        taskmessage.textContent=data.message;
        tasktext.value="";
        taskid.value="";
        loadTasks();
    }

    async function deleteTask(id,taskdata){
        const res=await fetch(import.meta.env.VITE_URL+`/tasks/${id}`,{
            method:"DELETE",
            credentials:"include",
            body:JSON.stringify(taskdata),
            headers:{
                "Content-Type":"application/json"
            }
        });
        const data=await res.json();
        taskmessage.textContent=data.message;
        tasktext.value="";
        taskid.value="";
        loadTasks();
    }
