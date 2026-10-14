var cl=console.log;
const Base_url = "https://xhrcrud-default-rtdb.firebaseio.com";
const Post_URL=`${Base_url}/NewTodo.json`

const form=document.getElementById("form");
const list=document.getElementById("list");
const formInput = document.getElementById('formInput');
const submitBtn = document.getElementById("submitBtn")
const updateBtn = document.getElementById("updateBtn")

// / Local state
let state = {
    NewTodoArr: [],
    Edit_id: null
};

// Spinner
function Spinnerhandler() {
    spinner.classList.toggle("d-none");
}

// Snackbar
function snackBar(msg, icon) {
    Swal.fire({
        text: msg,
        icon: icon,
        timer: 2500,
        showConfirmButton: false
    });
}



// makApi

async function MakeApiCall(url,method,msgbody=null){
    try{
        let body=msgbody? JSON.stringify(msgbody) :null;
    let res= await fetch(url,{
        method:method,
        body:body,
        headers:{
             "Content-Type": "Application/json",
                "Security": "JWT Token"
    
        }
    });
    if(!res.ok){
        throw new Error(`HTTP Error status:${res.status}`);
        
    }
    let data=await res.json();
    return data;
}catch(err){
    throw err;

}finally{
    Spinnerhandler();
}

    }


// templating

function Templating(array){
	let result=``;
	array.forEach(ele => {
			result+=`<li class="list-group-item d-flex justify-content-between align-items-center mb-2" id="${ele.id}">
                    <strong>${ele.title}</strong>
					<div>
                    <i onclick="onEdit(this)"class="fa-solid fa-pen-to-square fa-2x text-primary"></i>
                    <i onclick="onDelete(this)" class="fa-solid fa-trash-can fa-2x text-danger"></i>
                        </div>
                </li>`;

		
	});
	list.innerHTML = result;
}


// read

async function showList(){
    Spinnerhandler();
    try{
        let data=await MakeApiCall(Post_URL,"GET")
        state.NewTodoArr=[];
        for(const key in data){
            data[key].id=key
            state.NewTodoArr.push(data[key])
        }   
        Templating(state.NewTodoArr)

    }catch(err){
        cl(err)

    }
    

}
showList();

// create

async function Oncraete(eve){
    Spinnerhandler();
    eve.preventDefault();
    try{
    let obj={
        title:formInput.value.trim()
    }
    let data= await MakeApiCall(Post_URL,"POST",obj)
    let li=document.createElement("li")
    li.id=data.name
    obj.id=data.name
    state.NewTodoArr.push(obj)
    li.className="list-group-item d-flex justify-content-between align-items-center mb-2"
    li.innerHTML=`<strong>${obj.title}</strong>
					<div>
                    <i onclick="onEdit(this)"class="fa-solid fa-pen-to-square fa-2x text-primary"></i>
                    <i onclick="onDelete(this)" class="fa-solid fa-trash-can fa-2x text-danger"></i>
                        </div>`
                        list.append(li)
                        snackBar("data added successfully!", "success");
                        form.reset();
                        

    }catch(err){
        cl(err)
    }

}

// edit

function onEdit(ele){

let editId = ele.closest('li').id;
state.Edit_id=editId
    let editObj = state.NewTodoArr.find(t=> t.id === editId);
    formInput.value = editObj.title;
    submitBtn.classList.add('d-none');
    updateBtn.classList.remove('d-none');
}


//update

async function UpdateHandler(eve){
    Spinnerhandler();
    let updateId=state.Edit_id
    try{
        let ubobj={
            title:formInput.value,
            id:updateId
        }
        let Update_url=`${Base_url}/NewTodo/${updateId}.json`
        let data = await MakeApiCall(Update_url,"PATCH",ubobj)
        let index= state.NewTodoArr.findIndex(t=>t.id===updateId)
        state.NewTodoArr[index]=ubobj
        let li= document.getElementById(updateId)
        li.querySelector("strong").innerHTML=formInput.value
        submitBtn.classList.remove('d-none');
    updateBtn.classList.add('d-none');
    snackBar("Data Updated successfully!", "success");

    form.reset();



    }catch(err){
        cl(err)
    }

}


// delete
async function onDelete(eve){
    let Remove_id= eve.closest("li").id;
    let result =await Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
});
  if (result.isConfirmed) {
    Spinnerhandler();
    try{
        let Remove_url=`${Base_url}/NewTodo/${Remove_id}.json`
        
        let res =await MakeApiCall(Remove_url,"DELETE")
        let index= state.NewTodoArr.findIndex(d=>d.id===Remove_id);
        state.NewTodoArr.splice(index,1)
        eve.closest("li").remove();
                        snackBar("data Remove successfully!", "success");
        
    
       
    }catch (err){
        cl(err)

    }
  }


}

form.addEventListener("submit",Oncraete)
updateBtn.addEventListener("click",UpdateHandler)