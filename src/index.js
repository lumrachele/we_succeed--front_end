const URL = 'http://localhost:3000/api/v1/users'
let userEmail = ""
let pointOptions = []

document.addEventListener("DOMContentLoaded", function(event) {
  const loginForm = document.querySelector("#login-form")
  const email = document.querySelector("#login-email")
  const body = document.querySelector("body")
  const navBarButton = document.querySelector("#open-nav-bar")
  const navBar = document.querySelector(".sidenav")
  const splashPage = document.querySelector(".splash-page")
  const contentBody = document.querySelector("#content-body")
  const newActivityForm = document.querySelector("#hidden-new-activity-form")
  const pointField = document.querySelector("#points")


//**************** EVENT LISTENERS **********************//

// Event Listener for Login Splash Page
  loginForm.addEventListener("submit", function(event) {
    event.preventDefault()
    //Grabs the email
    const displayEmail = document.querySelector("#display-email")
    //Hides the Splash Page
    splashPage.style.display = "none";
    //Shows the nav bar button - three horizontal lines
    navBarButton.style.display = "inline-block";
    //Displays email on nav bar
    userEmail = email.value
    displayEmail.innerHTML = `${email.value}`
  })//end of loginform event listener

// Event Listener for Nav Bar Button - 3 horizontal lines
  navBarButton.addEventListener("click", (e)=>{
    // navBar.style.display = 'block'

    //Displays the nav bar
    navBar.style.width = "250px"
  })//end of navbar button event listener

// Event Listener for Nav Bar
  navBar.addEventListener('click', e => {

    //Activity Page
    if (e.target.innerText === 'My Activities') {
      // navBar.style.display = "none"
      newActivityForm.style.display = "block";
      // console.log(pointFieldDropDown());
      // pointField.options = mapPointOption(pointOptions)

      navBar.style.width = "0"
      fetch(URL)
      .then(r => r.json())
      .then(userJson => findUser(userEmail, userJson))
      .then((user) => renderMyActivities (user))
      .then((user)=>{colorCard()})
    }
    //Hides Nav Bar
    else if(e.target == document.querySelector(".closebtn")){
      navBar.style.width = "0"
    }

  })//end of navBar event Listener

  //******************** HELPER FUNCTIONS ********************//
  //Find User
  function findUser (email, json) {
    return json.find(user => {
      return user.email === email
    })
  }//end of find User

  //Render Activities - set content body inner html
  function renderMyActivities (user) {
    contentBody.innerHTML = formatActivities(user)
  }

  // create individual cards for each user_activity
  function formatActivities(user) {
    return user.user_activities.map(ua => {
      const activityName = user.activities.find(activity => {
        return activity.id == ua.activity_id
      }).name

      return `
      <div style="width:230px;margin:10px;  border-width: 5px;
        border-color: white;
        border-style: solid;" class="card" data-activity-name=${user.activities.find(activity => {
        return activity.id == ua.activity_id
      }).name}>

      <h1 align="center">${ua.note}</h1>
        <div style="width:239px;margin:auto" class="container">
        <h2>${ua.points} points</h2>
        <h3> ${user.activities.find(activity => {
          return activity.id == ua.activity_id
        }).name}</h3>
        </div>
      </div>
      `
    }).join('') //end of map
  }//end of formatActivities


  // colorCard changes color of activity card based on category
  function colorCard(){
    const mindfulness = document.querySelectorAll("[data-activity-name='mindfulness']")
    const workout = document.querySelectorAll("[data-activity-name='workout']")
    const meal = document.querySelectorAll("[data-activity-name='meal']")

    mindfulness.forEach((div)=>{
      div.style.backgroundColor = "#CEFED9"
    })
    workout.forEach((div)=>{
      div.style.backgroundColor="#CEF1FE"
    })
    meal.forEach((div)=>{
      div.style.backgroundColor="#FEFDCE"
    })
  }// end of colorCard
  // 
  // function pointFieldDropDown (){
  //   for (let i=1; i<10; i++){
  //     pointOptions.push(`<option value=${i}></option>`)
  //   }
  //   return pointOptions
  // }
  //
  // function mapPointOption(pointsHTML){
  //   pointsHTML.forEach((html)=>{
  //     return pointField.appendChild = html
  //   })
  // }

  // function toggleNavBar () {
  //
  // }


});//end of DOMContentLoaded
