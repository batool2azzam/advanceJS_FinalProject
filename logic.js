
  const token = localStorage.getItem("token");
  const user=getCurrentUser();


  /////// Get All Posts Handling /////////
  function getPosts(page=1){
    toggleLoader(false)
    axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=4&page=${page}`)
    .then(response => {
      toggleLoader(true)
      localStorage.setItem("last_page", response.data.meta.last_page);
      const posts = response.data.data;
      posts.forEach(post => {
        
        let buttons=``
        if(user!=null && user.id==post.author.id){
          buttons=`<button type="button" class="btn btn-danger" onclick="setEditPostModal(${post.id})" data-bs-toggle="modal" data-bs-target="#deleteModal" style="float : right">Delete</button>
          <button type="button" class="btn btn-secondary edit-post-button" data-bs-toggle="modal" data-bs-target="#editPostModal" onclick="setEditPostModal(${post.id}, '${post.body}')" style="float : right; margin-right:5px">Edit</button>`      }
        document.getElementById("posts").innerHTML +=
          `<div class="container" id="post_${post.id}">
            <div class="d-flex justify-content-center">
                <div class="col-9">
                    <div class="card mt-5 shadow"  style="cursor: pointer;">
                        <div class="card-header " style:"cursor: pointer;">
                            <img id="avatar" onclick="profileClicked(${post.author.id})" class="rounded-circle border border-1" src="${post.author.profile_image}" alt="" style="width: 40px; height: 40px;">
                            <b id="username" onclick="profileClicked(${post.author.id})">@${post.author.username}</b>
                            ${buttons}
                        </div>
                        <div class="card-body" onclick=postClicked(${post.id})>
                            <img id="img" class="w-100 object-fit-cover" src="${post.image}" alt="" style="height: 500px;">
                            <h6 id="time" class="mt-1 text-black-50">${post.created_at}</h6>
                            <h5 id="tit" class="card-title my-2">${post.title}</h5>
                            <p id="body" class="card-text">${post.body}</p>
                            <hr>
                            <h6>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                                  </svg>
                                  (<span>${post.comments_count}</span>) Comments
                            </h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
      });
    })
    .catch(error => console.log('error', error));
  }


  /////// Create-New-Post Handling /////////
  function CreatePost() {
    const image = document.getElementById("postImg").files[0];
    const title = document.getElementById("posttitle").value;
    const body = document.getElementById("postBody").value;

    const form = new FormData();
    form.append("image", image);
    form.append("title", title);
    form.append("body", body);

    const token = localStorage.getItem("token");

    axios.post("https://tarmeezacademy.com/api/v1/posts", form, {
      headers: {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
      }
    })
      .then((response) => {
        getPosts()
        console.log(response);
        const modal = document.getElementById('createPostModal');
        bootstrap.Modal.getInstance(modal).hide();
        showAlert("New Post has been added successfully!");
        const post = response.data.data;
        if(user!=null && user.id==post.author.id){
          buttons=`<button type="button" class="btn btn-danger" onclick="setEditPostModal(${post.id})" data-bs-toggle="modal" data-bs-target="#deleteModal" style="float : right">Delete</button>
          <button type="button" class="btn btn-secondary edit-post-button" data-bs-toggle="modal" data-bs-target="#editPostModal" onclick="setEditPostModal(${post.id}, '${post.body}')" style="float : right; margin-right:5px">Edit</button>`      
        
         }
        // Directly append the new post to the HTML
        
        document.getElementById("posts").innerHTML =
          `<div class="container">
            <div class="d-flex justify-content-center">
                <div class="col-9">
                    <div class="card mt-5 shadow">
                        <div class="card-header ">
                            <img id="avatar" class="rounded-circle border border-1" src="${post.author.profile_image}" alt="" style="width: 40px; height: 40px;">
                            <b id="username">@${post.author.username}</b>
                            ${buttons}
                        </div>
                        <div class="card-body ">
                            <img id="img" class="w-100 object-fit-cover" src="${post.image}" alt="" style="height: 500px;">
                            <h6 id="time" class="mt-1 text-black-50">${post.created_at}</h6>
                            <h5 id="tit" class="card-title my-2">${post.title}</h5>
                            <p id="body" class="card-text">${post.body}</p>
                            <hr>
                            <h6>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                                  </svg>
                                  (<span>${post.comments_count}</span>) Comments
                            </h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>` + document.getElementById("posts").innerHTML;
      })
      .catch((error) => {
        console.error('An error occurred:', error);
        showAlert(error.response.data.message + "!", "alert-danger");
      });
  }


  //////==== UI Starts =======/////////
  function changeButtons() {
      const varToken = localStorage.getItem("token");

      if (varToken) {
          document.getElementById("buttons").innerHTML = 
              `<div class="card-header" style="margin-right:12px">
              <img id="currentUserImg" class="rounded-circle border border-1" src="./assets/explorePic5.jpg" alt="" style="width: 40px; height: 40px;">
              <b id="currentUsername">@Batool22</b>
          </div>
          <button onclick="handleLogout()" type="button" class="btn btn-outline-danger">Logout</button>`;
          document.getElementById("add").classList.remove("d-none")
          document.getElementById("currentUserImg").src=user.profile_image;
          document.getElementById("currentUsername").innerHTML="@"+user.username
      } else {
          document.getElementById("buttons").innerHTML = 
              ` <button id="loginModal" data-bs-toggle="modal" data-bs-target="#loginModal" type="button" class="btn btn-outline-success mx-2">Login</button>
              <button id="regModal" data-bs-toggle="modal" data-bs-target="#regesterModal" type="button" class="btn btn-outline-success">Register</button>`;
          document.getElementById("add").classList.add("d-none")

          }
  }
  //////==== UI end =======/////////
  getPosts()
  ////// Geting Current User/////////

  function getCurrentUser(){
    let currentUser=null
    const storageUser= localStorage.getItem("user");
    if (storageUser!=null){
      currentUser= JSON.parse(storageUser)
    }
    return currentUser;
  }


  ////// Login Handling Starts/////////
  function handleLogin(){
    const username=document.getElementById("username").value;
    const password=document.getElementById("password").value;

    axios.post("https://tarmeezacademy.com/api/v1/login",{
        "username" : username,
        "password" : password
    }).then((response)=> {
        console.log(response)
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))
        const modal=document.getElementById('loginModal')
        bootstrap.Modal.getInstance(modal).hide()
        showAlert("Login successful!")
        changeButtons()

        }
    ).catch((error) => {
        console.error('An error occurred:', error);
        showAlert(error.response.data.message+"!", "alert-danger")
    });
  }
  ////// Login Handling End/////////

  ////// Regester Handling Start/////////
  function handleRegester(){
    const name=document.getElementById("reg-name").value;
    const username=document.getElementById("reg-username").value;
    const password=document.getElementById("reg-password").value;

    axios.post("https://tarmeezacademy.com/api/v1/register",{
        "name" : name,
        "username" : username,
        "password" : password
    }).then((response)=> {
        console.log(response)
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))
        const modal=document.getElementById('regesterModal')
        bootstrap.Modal.getInstance(modal).hide()
        showAlert("You Have been Register successfuly!")
        changeButtons()

        }
    ).catch((error) => {
        console.error('An error occurred:', error);
        showAlert(error.response.data.message +"!", "alert-danger")
    });
  } 
  ////// Regester Handling End/////////

  ////// Logout Handling Starts/////////

  function handleLogout(){
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    showAlert("You Have been Loged-out successfuly", "alert-primary")
    changeButtons()

  } 
  changeButtons()
  ////// Show Alerts/////////

  function showAlert(message,colorClass = 'alert-success') {
      const successAlert = document.getElementById('successAlert');
      successAlert.innerHTML = message
      successAlert.classList.remove('d-none');
      successAlert.classList.add(colorClass);
      setTimeout(() => {
          successAlert.classList.add('d-none');
          successAlert.classList.remove(colorClass);
      }, 3000);
  }

  ////// Handle Infinite Scrolling/////////
  let currentPage = 1;
  let last_page = localStorage.getItem("last_page");
  window.addEventListener("scroll", ()=>{
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
    if (endOfPage && currentPage!=last_page) {
      getPosts(currentPage++)
    }
  });

  ////// Go To comments page/////////
  function postClicked(postId){
    window.location=`comments.html?postId=${postId}`
  }

    ////// Go To profile page/////////
  function profileClicked(userId=user.id){
    window.location=`profile.html?userId=${userId}`
  }
  //////// Loader Handling /////////
  function toggleLoader(Show=false){
    if(Show){
      document.getElementById("loader").style.visibility='hidden'
    }
    else{
      document.getElementById("loader").style.visibility='visible'
    }
  }
  //////// Current PostId /////////
  let currentPostId;
  function setEditPostModal(postId, postBody="") {
    currentPostId = postId;
    document.getElementById("edit-postBody").value = postBody;

  }


  //////// Edit Post Handling /////////

  function editPost(){
    const body = document.getElementById("edit-postBody").value;

    axios.put(`https://tarmeezacademy.com/api/v1/posts/${currentPostId}`, {
      "body":body
    }, {
      headers: {
        "authorization": `Bearer ${token}`
      }
    })
      .then((response) => {
        const modal = document.getElementById('editPostModal');
        bootstrap.Modal.getInstance(modal).hide();
        showAlert("Post has been Edited successfully!");
    }).catch((error) => {
      console.error('An error occurred:', error);
      showAlert(error.response.data.message + "!", "alert-danger");
    });
  }

  //////// Delete Post Handling /////////
  function deletePost(){
    axios.delete(`https://tarmeezacademy.com/api/v1/posts/${currentPostId}`,{
      headers: {
        "authorization": `Bearer ${token}`
      }
    })
      .then((response) => {
        console.log(response);
        const modal = document.getElementById('deleteModal');
        bootstrap.Modal.getInstance(modal).hide();
        showAlert("Post has been Deleted successfully!");
        // Remove the deleted post from the DOM
        const deletedPost = document.getElementById(`post_${currentPostId}`);
        if (deletedPost) {
          deletedPost.remove();
        }

    }).catch((error) => {
      console.error('An error occurred:', error);
      showAlert(error.response.data.message + "!", "alert-danger");
    });
  }



