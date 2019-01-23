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
    if (e.target.id === "display-email"){//user show page
      navBar.style.display = "none"
      contentBody.innerHTML = `<div id="activity-chart"><canvas id="myChart"></canvas></div>`
      fetch(URL)
      .then(r => r.json())
      .then(userJson => findUser(userEmail, userJson))
      .then((user) => renderUserHomePage(user))

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


  function unreachedGoal(user){
    return user.goals.find( goal => goal.reached == false)
  }
  function currentActivities(user, goalId){
    return user.user_activities.filter( ua => ua.goal_id == goalId)

  }

  function renderUserHomePage(user){
    const reducer = (accumulator = 0, currentValue) => accumulator + currentValue;

    const currentGoal = unreachedGoal(user)
    const allActivities = currentActivities(user, currentGoal.id)
    const workOuts = allActivities.filter( activity => activity.activity_id == 1)
    const meals = allActivities.filter( activity => activity.activity_id == 2)
    const mindfullness = allActivities.filter( activity => activity.activity_id == 3)

    const workOutpts = workOuts.map(act => act.points).reduce(reducer, 0)
    const mealpts = meals.map(act => act.points).reduce(reducer, 0)
    const mindfullnesspts = mindfullness.map(act => act.points).reduce(reducer, 0)

    console.log(workOutpts, mealpts, mindfullnesspts)


    const ctx = document.getElementById('myChart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ["Work Outs", "Meals", "Mindfullness"],
        datasets: [{
          label: `${currentGoal.name}`,
          backgroundColor: ['rgb(204, 255, 204)','rgb(255, 255, 204)','rgb(255, 229, 204)'],
          borderColor: 'rgb(255, 255, 255)',
          data: [`${workOutpts}`,`${mealpts}`,`${mindfullnesspts}`],
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
    });
  }

  function toggleNavBar () {
  }

});//end of DOMContentLoaded
