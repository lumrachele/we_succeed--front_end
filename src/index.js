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
  const myChart = document.getElementById("myChart")
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

    if (e.target.innerText === 'My Goals') {
      navBar.style.display = "none"
      fetch(URL)
      .then(r => r.json())
      .then(userJson => findUser(userEmail, userJson))
      .then((user) => renderGoals(user))
      // .then((user) => filterGoals(user))
      // .then((goals) => console.log((goals)))
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


  function filterGoals (user) {
    return user.goals.filter(goal => goal.reached)
  }

  function goalActivities(user, goalId) {
    return user.user_activities.filter(ua => ua.goal_id === goalId)
  }

function goalPoints () {

}
  function renderGoals(user){
    const reducer = (acc, curr) => acc + curr

    const renderGoalsList = document.querySelector("#goals-list")
    const goalsList = filterGoals(user)
    const goalActivity = goalsList.map(function(goal){
      return goalActivities(user, goal.id)
      })
    const goalNameArray = goalsList.map(goal => goal.name)
    console.log(goalsList);
    const goalActpoints = goalActivity.map(function(act) {
      return act.map(function(act){return act.points}).reduce(reducer, 0)
    })

    const goalValues = goalsList.map(goal => goal.value)
    console.log(goalValues)
    const goalPercentages = goalValues.map(function(value, i) {
      return (goalActpoints[i] / value) * 100
    })
    return `${new Chart(myChart, {
    type: 'bar',
    data: {
      labels: goalNameArray,
      datasets: [{
          label: 'total points (%)',
          data: goalPercentages,
          backgroundColor: [
              'rgba(255, 99, 132)',
              'rgba(54, 162, 235)',
              'rgba(255, 206, 86)',
              'rgba(75, 192, 192)',
              'rgba(153, 102, 255)',
              'rgba(255, 159, 64)'
          ],
          borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
      }]
    },
    options: {
      scales: {
          yAxes: [{
              ticks: {
                  beginAtZero:true
              }
          }]
      }
    }
    })}`
    }

});//end of DOMContentLoaded
