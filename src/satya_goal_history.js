//filter goals function
  function filterGoals (user) {
    return user.goals.filter(goal => goal.reached)
  }//end of filter goals

  // goal Activities function
  function goalActivities(user, goalId) {
    return user.user_activities.filter(ua => ua.goal_id === goalId)
  }//end of goalActivities




  //Goals Event Listener
   if (e.target.innerText === 'My Goals') {
     navBar.style.width = "0"
     fetch(URL)
     .then(r => r.json())
     .then(userJson => findUser(userEmail, userJson))
     .then((user) => renderGoals(user))
   }//end of goals




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
