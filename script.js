let users = [
  { name: "RSRawat", email: "rsrawat@gmail.com" },
  { name: "Lucky", email: "lucky@gmail.com" },
  { name: "Ashutosh Sir", email: "ashutoshsir@gmail.com" },
];

let form = document.getElementById("user-form");
let nameInput = document.getElementById("name");
let emailInput = document.getElementById("email");

let loadDataButton = document.getElementById("load-data-btn");
loadDataButton.style.backgroundColor = "#395AFF";
loadDataButton.style.color = "#fff";
loadDataButton.style.padding = "10px 20px";
loadDataButton.style.border = "none";
loadDataButton.style.borderRadius = "3px";
loadDataButton.style.fontSize = "1rem";
loadDataButton.style.cursor = "pointer";
loadDataButton.style.fontFamily = `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`;



let tableBody = document.querySelector("#userTable tbody");
let submitButton = document.querySelector("#user-form button[type='submit']");


let editingIndex = null;



loadDataButton.addEventListener("click",()=>{


function fetchUsersPromise(){
  return fetch("https://jsonplaceholder.typicode.com/users").then(result=>{
    if(!result.ok){
      throw new Error("data nahi mila");
    }
    return result.json();
  })

.then(data => data.map(user => ({
  ...user,
  email: user.email.toLowerCase()
})));
}

fetchUsersPromise().then(data=>{
  console.log(data)
  users = data;
  listUsers()
}).catch(error=>{
  console.log(error)
})


})




function listUsers() {
  tableBody.innerHTML = "";
  users.forEach((user, index) => {
    let row = document.createElement("tr");
    row.innerHTML = `
          <td>${index + 1}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td class="action">
            <button class="edit" onClick="editUser(${index})">Edit</button>
            <button class="delete" data-index="${index}">Delete</button>
</td>
         
        `;
    tableBody.appendChild(row);
  });

  // Attach delete button event listeners

  document.querySelectorAll(".delete").forEach((button) => {
    button.addEventListener("click", function () {
      const index = parseInt(this.getAttribute("data-index"));
      deleteUser(index);
    });
  });
}

// Delete function call

// function deleteUser(index) {
//   let confirmDelete = confirm("Are you sure, you want to delete this user?");
//   if (confirmDelete) {
//     users.splice(index, 1);
    
//     listUsers();
    
//   }
// }
function deleteUser(index) {
Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: "Yes, delete it!",
  cancelButtonText: "Cancel",
  customClass: {
    popup: "my-swal-popup-color",
    title: "my-swal-title-color",
    confirmButton: "my-swal-confirm-color",
    cancelButton: "my-swal-cancel-color",
    icon: "my-swal-icon-color"
  },
  buttonsStyling: false // to use your own button styles



  }).then((result) => {
    if (result.isConfirmed) {
      // Delete the user
      users.splice(index, 1);
      listUsers();

      // Show success message
      Swal.fire({
        title: "Deleted!",
        text: "User has been deleted.",
        icon: "success",
        customClass:{
            popup: "my-swal-popup",
    title: "my-swal-title",
    htmlContainer: "my-swal-text",
    confirmButton: "my-swal-confirm",
    icon: "my-swal-icon"
        },
         buttonsStyling: false

      });
      
    }
  });
}

// Edit users call function
function editUser(index) {
  
  let user = users[index];
  nameInput.value = user.name;
  emailInput.value = user.email;
  editingIndex = index;
  submitButton.textContent = "Update User";

  
}


function adduser(name, email) {
  users.push({ name: name, email: email });
  listUsers();


  
}



form.addEventListener("submit", function (event) {
  event.preventDefault();
  let name = nameInput.value;
  let email = emailInput.value;
  if (!name || !email)  {
    // alert("Fill Your Name");
    // return;
    nameInput.required = true;
    emailInput.required=true;
    return;
  }





  // if (!email) {
  //   // alert("Fill Your Email");
  //   emailInput.required = true;

  //   return;
  // }

// Duplicate email will not add in user list except name

// Email will covert into lowerCase
email = email.toLowerCase();


//   let isDuplicateEmail = false; // Firstly assume duplicatee email will be false
// for(let i = 0; i < users.length; i++) {
//   let userKaEmail = users[i].email.toLowerCase();

//   if (userKaEmail === email && i !== editingIndex) {
//     isDuplicateEmail = true;
//     break; 
//   }
// }


let isDuplicateEmail = users.some((userKaEmail, i) => {
  return userKaEmail.email.toLowerCase() === email.toLowerCase() && i !== editingIndex;
});

if (isDuplicateEmail) {
  // Swal.fire("Duplicate Email", "This email already exists in the user list.", "error", );

    Swal.fire({
    title: "Duplicate Email",
    text: "This email already exists in the user list.",
    icon: "error"
    
    
  });
  return;
} 





  
  if (editingIndex != null) {
    // Update Existing Users
    users[editingIndex].name = name;
    users[editingIndex].email = email;
    editingIndex = null;
    submitButton.textContent = "Add A new User";


    listUsers();



    //     Swal.fire({
    // icon: "success",
    // title: "Done",
    // text: "This User Has Been Updated",
    // confirmButtonColor: "#3085d6",


 Swal.fire({
  title: "Do you want to save the changes?",
  showDenyButton: true,
  showCancelButton: true,
  confirmButtonText: "Save",
  denyButtonText: `Don't save`,
  
}).then((result) => {
  /* Read more about isConfirmed, isDenied below */
  if (result.isConfirmed) {
    Swal.fire("Saved!", "", "success");
  } else if (result.isDenied) {
    Swal.fire("Changes are not saved", "", "info");
  }

  });
  } else {
    // Add New Users

    adduser(name, email);

     Swal.fire({
    icon: "success",
    title: "Success!",
    text: "Your form has been submitted.",
    confirmButtonColor: "#3085d6",
  });
  }

  // Reset the form
  nameInput.value = "";
  emailInput.value = "";


  listUsers();

});
listUsers();





