if (e.target.id === "display-email"){//user show page
   navBar.style.display = "none"
   contentBody.innerHTML = `<div id="activity-chart" style="width:50%"><canvas id="myChart2"></canvas></div>`
   fetch(URL)
   .then(r => r.json())
   .then(userJson => findUser(userEmail, userJson))
   .then((user) => renderUserHomePage(user))
 }





function unreachedGoal(user){
    return user.goals.find( goal => goal.reached == false)
  }
  function currentActivities(user, goalId){
    return user.user_activities.filter( ua => ua.goal_id == goalId)
  }

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

    const ctx = document.getElementById('myChart2').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ["Work Outs", "Meals", "Mindfullness", "Remaining Points for Goal"],
        datasets: [{
          backgroundColor: ['rgb(204, 255, 204, 0.9)','rgb(255, 255, 204, 0.9)','rgb(204, 229, 255, 0.9)','rgb(255, 255, 255, 0.9)' ],
          borderColor: 'rgb(192, 192, 192, 0.5)',
          data: [`${workOutpts}`,`${mealpts}`,`${mindfullnesspts}`, `${remainingPts}`],
        }]
      },
      options: {}
    })
  }
