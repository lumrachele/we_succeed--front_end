const URL = 'http://localhost:3000/api/v1/users'
let userEmail = ""
let pointOptions = []
let currentUser = ""

document.addEventListener("DOMContentLoaded", function(event) {
  const loginForm = document.querySelector("#login-form")
  const loginEmail = document.querySelector("#login-email")
  const loginContainer = document.querySelector("#login-container")
  const errorContainer = document.querySelector("#error-container")

  const body = document.querySelector("body")
  const navBarButton = document.querySelector("#open-nav-bar")
  const navBar = document.querySelector(".sidenav")
  const splashPage = document.querySelector(".splash-page")
  const contentBody = document.querySelector("#content-body")
  const createActivityForm = document.querySelector("#hidden-new-activity-form")
  const pointField = document.querySelector("#points")
  const myChart = document.getElementById("myChart")

  const inputCategory = document.querySelector("[data-input-id='category-select']")
  const inputGoal = document.querySelector("[data-input-id='goal']")
  const inputNote = document.querySelector("[data-input-id='note']")
  const inputPoints = document.querySelector("[data-input-id='points']")


//**************** EVENT LISTENERS **********************//

// Event Listener for Login Splash Page

  loginForm.addEventListener("submit", function(event) {
    event.preventDefault()
    //Grabs the email
    const displayEmail = document.querySelector("#display-email")
    userEmail = loginEmail.value

    fetch(URL)
    .then(r => r.json())
    .then(userJson => findUser(userEmail, userJson))
    .then(foundUser => {
      if (foundUser){
        //Hides the Splash Page
        splashPage.style.display = "none";
        //Shows the nav bar button - three horizontal lines
        navBarButton.style.display = "inline-block";
        currentUser = foundUser
        userEmail = foundUser.email
        renderUserHomePage(foundUser)
      } else{
        errorContainer.innerHTML="You do not have an account."
        loginForm.reset()
      }
    })




    displayEmail.innerHTML = `${loginEmail.value}`
  })//end of loginform event listener

// Event Listener for Nav Bar Button - 3 horizontal lines
  navBarButton.addEventListener("click", (e)=>{
    // navBar.style.display = 'block'
    //Displays the nav bar
    navBar.style.width = "250px"
  })//end of navbar button event listener

// Event Listener for Nav Bar
  navBar.addEventListener('click', e => {
    //Hides Nav Bar
    if(e.target == document.querySelector(".closebtn")){
      navBar.style.width = "0"
    }
    //profile
    if (e.target.id === "display-email"){//user show page
      navBar.style.width = "0"
      contentBody.innerHTML = ""
      createActivityForm.style.display = "none"
      contentBody.innerHTML = `<div id="activity-chart" style="width:50%"><canvas id="myChart"></canvas></div>`
      fetch(URL)
      .then(r => r.json())
      .then(userJson => findUser(userEmail, userJson))
      .then((user) => renderUserHomePage(user))
    }//end of render home page

    //Activity Page
    if (e.target.innerText === 'My Activities') {
      myChart.style.display = "none"
      contentBody.innerHTML = ""
      // navBar.style.display = "none"
      createActivityForm.style.display = "block";
      // console.log(pointFieldDropDown());
      // pointField.options = mapPointOption(pointOptions)
      navBar.style.width = "0"
      fetch(URL)
      .then(r => r.json())
      .then(userJson => findUser(userEmail, userJson))
      .then((user) => renderMyActivities(user))
      .then((user)=>{colorCard()})
    }//end of activity

    //Goals Event Listener
    if (e.target.innerText === 'My Goals') {
      // myChart.style.display = "none"
      createActivityForm.style.display = "none"
      contentBody.innerHTML = ""
      navBar.style.width = "0"
      fetch(URL)
      .then(r => r.json())
      .then(userJson => findUser(userEmail, userJson))
      .then((user) =>
      myChart.innerHTML = renderGoals(user))
    }//end of goals

  })//end of navBar event Listener

  createActivityForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    console.log(e, category.value);
  })



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

  //formatActivities
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

  // function toggleNavBar () {
  //
  // }

  //filter goals function
  function filterGoals (user) {
    return user.goals.filter(goal => goal.reached)
  }//end of filter goals

  // goal Activities function
  function goalActivities(user, goalId) {
    return user.user_activities.filter(ua => ua.goal_id === goalId)
  }//end of goalActivities

  // unreachedGoal
  function unreachedGoal(user){
    return user.goals.find( goal => goal.reached == false)
  }//end of unreachedGoal

  //currentActivities
  function currentActivities(user, goalId){
    return user.user_activities.filter( ua => ua.goal_id == goalId)
  }//currentActivities

  //renderUserHomePage
  function renderUserHomePage(user){
    const reducer = (accumulator, currentValue) => accumulator + currentValue;

    const currentGoal = unreachedGoal(user)
    const allActivities = currentActivities(user, currentGoal.id)
    const workOuts = allActivities.filter( activity => activity.activity_id == 1)
    const meals = allActivities.filter( activity => activity.activity_id == 2)
    const mindfullness = allActivities.filter( activity => activity.activity_id == 3)

    const workOutpts = workOuts.map(act => act.points).reduce(reducer, 0)
    const mealpts = meals.map(act => act.points).reduce(reducer, 0)
    const mindfullnesspts = mindfullness.map(act => act.points).reduce(reducer, 0)

    const remainingPts = (currentGoal.value - [workOutpts, mealpts, mindfullnesspts].reduce(reducer, 0))

    const ctx = document.getElementById('myChart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ["Work Outs", "Meals", "Mindfullness", "Remaining Points for Goal"],
        datasets: [{
          backgroundColor: ['rgb(204, 255, 204, 0.9)','rgb(255, 255, 204, 0.9)','rgb(204, 229, 255, 0.9)','rgb(255, 255, 255, 0.9)' ],
          borderColor: 'rgb(192, 192, 192, 0.5)',
          data: [`${workOutpts}`,`${mealpts}`,`${mindfullnesspts}`, `${remainingPts}`],
        }]//end of datasets
      },
      options: {}
    })//end of const chart
  }//end of renderUserHomePage

  //renderGoals
  function renderGoals(user){
    const reducer = (acc, curr) => acc + curr

    const renderGoalsList = document.querySelector("#goals-list")
    const goalsList = filterGoals(user)

    const goalActivity = goalsList.map(function(goal){
      return goalActivities(user, goal.id)
      })
    const goalNameArray = goalsList.map(goal => goal.name)
    const goalActpoints = goalActivity.map(function(act) {
      return act.map(function(act){return act.points}).reduce(reducer, 0)
    })

    const goalValues = goalsList.map(goal => goal.value)
    const goalPercentages = goalValues.map(function(value, i) {
      return (goalActpoints[i] / value) * 100
    })

    return new Chart(myChart, {
      type: 'bar',
        data: {
          labels: goalNameArray,
          datasets: [{
              label: 'total points (%)',
              data: goalPercentages,
              backgroundColor: ['rgba(255, 99, 132)','rgba(54, 162, 235)','rgba(255, 206, 86)','rgba(75, 192, 192)','rgba(153, 102, 255)','rgba(255, 159, 64)'],
              borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'],
              borderWidth: 1
          }]// end of datasets
        },//end of data
        options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }//end of ticks
              }]//end of yAxes
          }//end of scales
        }//end of options
    })//end of new Chart
  }//end of renderGoals

});//end of DOMContentLoaded
