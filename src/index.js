const URL = 'http://localhost:3000/api/v1/users'
let userEmail = ""
document.addEventListener("DOMContentLoaded", function(event) {
  const loginForm = document.querySelector("#login-form")
  const email = document.querySelector("#login-email")
  const body = document.querySelector("body")
  const navBarButton = document.querySelector("#open-nav-bar")
  const navBar = document.querySelector(".sidenav")
  const splashPage = document.querySelector(".splash-page")
  const contentBody = document.querySelector("#content-body")

  loginForm.addEventListener("submit", function(event) {
    event.preventDefault()
    const displayEmail = document.querySelector("#display-email")

    splashPage.style.display = "none";
    navBarButton.style.display = "block";
    userEmail = email.value

    displayEmail.innerHTML = `${email.value}`
    })//end of loginform event listener

  navBarButton.addEventListener("click", (e)=>{
    navBar.style.display = 'block'
  })//end of nav bar button event listener

  navBar.addEventListener('click', e => {
    if (e.target.innerText === 'My Activities') {
      navBar.style.display = "none"
      fetch(URL)
      .then(r => r.json())
      .then(userJson => findUser(userEmail, userJson))
      .then((user) => renderMyActivities (user))
    }
  })



  function findUser (email, json) {
    return json.find(user => {
      return user.email === email
    })
  }

  function renderMyActivities (user) {
    contentBody.innerHTML = formatActivities(user)
  }


  function formatActivities(user) {
    return user.user_activities.map(ua => {
      return `
      <div class="card">
        <h1> ${user.activities.find(activity => {
          return activity.id == ua.activity_id
        }).name}</h1>
        <h2>${ua.points}</h2>
        <h3>${ua.note}</h3>
      </div>
      `
    }).join('')
  }
  function toggleNavBar () {

  }


});//end of DOMContentLoaded
