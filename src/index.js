const URL = 'http://localhost:3000/api/v1/users'
let userEmail = ""
let pointOptions = []
let currentUser = ""
let currentGoal = ""
const reducer = (accumulator, currentValue) => accumulator + currentValue;

document.addEventListener("DOMContentLoaded", function(event) {
  Chart.defaults.global.defaultFontColor = "#666"
  const loginForm = document.querySelector("#login-form")
  const loginEmail = document.querySelector("#login-email")
  const loginContainer = document.querySelector("#login-container")
  const errorContainer = document.querySelector("#error-container")
  const successMessage = document.querySelector("#success-message")

  const body = document.querySelector("body")
  const navBarButton = document.querySelector("#open-nav-bar")
  const navBar = document.querySelector(".sidenav")
  const splashPage = document.querySelector(".splash-page")
  const contentBody = document.querySelector("#content-body")
  const createActivityForm = document.querySelector("#hidden-new-activity-form")
  const goalForm = document.querySelector("#goal-form")
  const inputGoalName = document.querySelector("#input-goal-name")
  // const inputUserId = document.querySelector("#input-user-id")
  const inputPointValue = document.querySelector("#input-point-value")


  const pointField = document.querySelector("#points")
  const myChart = document.getElementById("myChart")
  const myChart2 = document.getElementById("myChart2")

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
    //profile / home page
    if (e.target.id === "display-email"){//user show page
      myChart2.style.display = "none"
      navBar.style.width = "0"
      contentBody.innerHTML = ""
      createActivityForm.style.display = "none"
      contentBody.innerHTML += `<div id="activity-chart" style="width:50%"><canvas id="myChart3"></canvas></div>`
      fetch(URL)
      .then(r => r.json())
      .then(userJson => findUser(userEmail, userJson))
      .then((user) => renderUserHomePage(user))
    }//end of render home page

    //Activity Page
    if (e.target.innerText === 'My Activities') {
      myChart2.style.display = "none"
      createActivityForm.style.display = "block"
      // contentBody.innerHTML = ""
      if (!currentGoal.reached){
        createActivityForm.style.display = "block";
      }
      else {
        createActivityForm.style.display = "none";
      }
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
      myChart2.style.display = "block"
      // myChart.style.display = "none"
      createActivityForm.style.display = "none"
      contentBody.innerHTML = ""
      navBar.style.width = "0"
      fetch(URL)
      .then(r => r.json())
      .then(userJson => findUser(userEmail, userJson))
      .then((user) =>
      myChart2.innerHTML = renderGoals(user))
    }//end of goals

  })//end of navBar event Listener

// create activity form event listener
  createActivityForm.addEventListener('submit', (e)=>{
    e.preventDefault()

    //creating a new user_activity
    //input goal value should be the goal that has goal.reached=false
    const createUserId = currentUser.id
    const createActivityId = inputCategory.value
    const createCategory = inputCategory.value
    const createNote = inputNote.value
    const createPoints = inputPoints.value

    inputGoal.value = unreachedGoal(currentUser).id
    const createGoalId = inputGoal.value

    fetch("http://localhost:3000/api/v1/user_activities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },//end of headers
      body: JSON.stringify({
        user_id: createUserId,
        activity_id: createActivityId,
        goal_id: createGoalId,
        points: createPoints,
        note: createNote
      })//end of body stringify
    })// end of fetch
    .then((res)=>{
      return res.json()
    })
    // .then((createdUA)=>{
    //   console.log(createdUA)
    // })
    .then(createdUA =>{
      fetch(`${URL}/${createUserId}`)
      .then(r => r.json())
      .then((updatedUser)=>{
        renderMyActivities(updatedUser)
        colorCard()
        currentUser = updatedUser
        if (goalReached(updatedUser)) {
          createActivityForm.style.display = "none"
          successMessage.style.display = "block"
          // successMessage.innerHTML += `goalname`


          fetch(`http://localhost:3000/api/v1/goals/${createGoalId}`,{
            method: "PATCH",
            headers: {
              "Content-Type" : "application/json",
              "Accept": "application/json"
            },
            body : JSON.stringify({
              reached: true,
              current: false
            })//end of body
          })//end of fetch

        }//end of if statement if goal reached
      })//end of 2nd then
    })//end of created ua then

  })//end of create User activity form

  goalForm.addEventListener('submit', (e)=>{
    e.preventDefault()

    const submittedGoalName = inputGoalName.value
    const submittedUserId = currentUser.id
    const submittedPointValue = inputPointValue.value

    fetch("http://localhost:3000/api/v1/goals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        name: submittedGoalName,
        value: submittedPointValue,
        user_id: submittedUserId
      })//end of body
    })//end of fetch
    .then(res=>res.json())
    .then((createdGoal) =>{

      // goalForm.style.display = "none"

      currentGoal = unreachedGoal(currentUser)
      successMessage.style.display = "none"
      createActivityForm.style.display = "block"

    })

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

  function goalReached(user) {
    const currentGoal = unreachedGoal(user)
    const currentGoalActivities = goalActivities(user, currentGoal.id)
    const currentGoalPts = currentGoalActivities.map(function(act) {
      return act.points}).reduce(reducer, 0)

    return currentGoalPts >= currentGoal.value
  }
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

    const currentGoal = unreachedGoal(user)
    const allActivities = currentActivities(user, currentGoal.id)
    const workOuts = allActivities.filter( activity => activity.activity_id == 1)
    const meals = allActivities.filter( activity => activity.activity_id == 2)
    const mindfullness = allActivities.filter( activity => activity.activity_id == 3)

    const workOutpts = workOuts.map(act => act.points).reduce(reducer, 0)
    const mealpts = meals.map(act => act.points).reduce(reducer, 0)
    const mindfullnesspts = mindfullness.map(act => act.points).reduce(reducer, 0)

    let remainingPts = (currentGoal.value - [workOutpts, mealpts, mindfullnesspts].reduce(reducer, 0))
    if (remainingPts <= 0){
      remainingPts = 0
    }

    const ctx = document.getElementById('myChart3').getContext('2d');
    const chart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ["Work Outs", "Meals", "Mindfullness", "Remaining Points for Goal"],
            datasets: [{
              backgroundColor: ['rgb(204, 229, 255, 1)','rgb(255, 255, 204, 1)','rgb(204, 255, 204, 1)','rgb(255, 255, 255, 1)' ],
              borderColor: 'rgb(192, 192, 192, 0.5)',
              data: [`${workOutpts}`,`${mealpts}`,`${mindfullnesspts}`, `${remainingPts}`],
            }]//end of datasets
          },
          options: {
            title: {
              display: true,
              text: `${currentGoal.name}`,
              fontSize: 50,
              fontStyle: "bold"
            },//end of title
            legend:{
              labels: {
                fontSize: 20,
                fontStyle: "bold"
              }//end of lables
            }//end of legend
          }//end of options
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

    return new Chart(myChart2, {
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
          legend: {
            labels: {
                fontColor: "black",
                fontSize: 24
            }
        },
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
