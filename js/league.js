// ==================================================
//          Schedule Data: Provided by Instructor
// ==================================================

var sched4 = [ [ [1, 4], [2, 3] ], [ [1, 3], [2, 4] ], [ [1, 2], [3, 4] ] ]; 
var sched6 = [ [ [1, 6], [2, 5], [3, 4] ], [ [1, 5], [4, 6], [2, 3] ], [ [1, 4], [3, 5], [2, 6] ], [ [1, 3], [2, 4], [5, 6] ], [ [1, 2], [3, 6], [4, 5] ], ]; 
var sched8 = [ [ [1, 8], [2, 7], [3, 6], [4, 5] ], [ [1, 7], [6, 8], [2, 5], [3, 4] ], [ [1, 6], [5, 7], [4, 8], [2, 3] ], [ [1, 5], [4, 6], [3, 7], [2, 8] ], [ [1, 4], [3, 5], [2, 6], [7, 8] ], [ [1, 3], [2, 4], [5, 8], [6, 7] ], [ [1, 2], [3, 8], [4, 7], [5, 6] ], ];
// ==================================================

// ==================================================
//          Load existing team data
// ==================================================
$(document).ready(function () {
  // get from database: Purpose, fill array with data if exists
  $.ajax({
    url: 'backliftapp/teamInfo',
    type: "GET",
    dataType: "json",
    success: function (data) {
      leagueAll = data;
      for (var i = 0; i < data.length; i++) {
        addTeamToTable(data[i]);
        populateTeamList(data[i]);
        // populateWeeklyScores(data[i]);
      }
      populateWeeklyScores(data);
    }
  }); // end ajax
}); // end ready
// ==================================================
//          END: Load existing team data
// ==================================================


// ==================================================
// Add team info from form to backlift JSON data file
// ==================================================
var leagueAll = [];
// add team to league
function addTeam() {
  var teamInfo = {
    teamName: $("#teamName").val(),
    firstName: $("#firstName").val(),
    lastName: $("#lastName").val(),
    phone: $("#phone").val(),
    email: $("#email").val(),
    sponsor: $("#sponsor").val(),
    zipcode: $("#zipcode").val(),
    week01runs: 0,
    week02runs: 0,
    week03runs: 0,
    week04runs: 0,
    week05runs: 0,
    week06runs: 0,
    week07runs: 0,
    week08runs: 0,
    totalWins: 0, //(((Math.floor)(Math.random()*11))+1),   //random number generated at this time
    totalLosses: 0, //(((Math.floor)(Math.random()*6))+1)
  };

  $.ajax({
    url: 'backliftapp/teamInfo',
    type: "POST",
    dataType: "json",
    data: teamInfo,
    success: function (data) {
      // console.dir(data);
      leagueAll.push(data);
      addTeamToTable(data);
      populateTeamList(data);
      populateWeeklyScores(data);
    }
  });

};
// ==================================================
// END: add team
// ==================================================




// ==================================================
// Write each Active Team to screen
// ==================================================
function populateTeamList(team) {
  $(
    "<h4 class='show'>" + team.teamName + " <em>sponsored by</em> " + team.sponsor + " </h4>" + 
    "<p class='more'>" +
    "Manager: " + team.firstName + " " + team.lastName + "<br>" +
    "Phone: " + team.phone + "<br>" +
    "E-mail: " + team.email + "<br>" +
    "<button aria-hidden='true' class='btn' onclick='addWeeklyScores(\"" + team.id + "\", \"" + team.teamName + "\")'>Add Weekly Scores for the "+ team.teamName + "</button>" + "<br>" +
    "Team ID = " + team.id + "<br>" +
    "<button aria-hidden='true' class='btn btn-danger' onclick='deleteTeam(\"" + team.id + "\")'>Delete Team "+ team.teamName + "</button>" + "<br>" +
    "</p>").appendTo('#teamList');
};
// ==================================================
// END: Write each Active Team to screen
// ==================================================

// ==================================================
// Create Modal to enter weekly scores
// ==================================================
// This function is called by populateWeeklyScores()
function populateWeeklyScoresModal(teamCount, teamID, teamName){
    console.log("TeamCount: " + teamCount)
    clearForm(); 
    $('#enter_weekly_scores').empty()
    $("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button><h3>Enter Weekly Scores for " + teamName + ":</h3></div>").appendTo('#enter_weekly_scores') 
    $("<br>").appendTo('#enter_weekly_scores');
    
    var html = '<form id="my-form-id" class="form-horizontal control-group">';

    for (var i = 1; i <= teamCount; i++) {
         html += "<div class='Bbox'><label class='control-label' for='week0" + i +"runs'>Week " + i + 
           " Run total:</label> <div class='controls'> <input type='text' class='team_inputs span1' id='week0" + i +
           "runs' name='week0" + i + "runs'> <br> </div></div></div>";
     }

     html += '</form>';

     $(html).appendTo('#enter_weekly_scores');

     $("<div class='modal-footer'><button id='updateScores' type='submit' class='btn offset2' data-dismiss='modal' aria-hidden='true' onclick='updateTeamScore(\"" + teamID + "\", \"" + teamCount + "\")'> Submit</button></div>").appendTo('#enter_weekly_scores');
     // $('#enter_weekly_scores').empty()
     
}
//onclick='addTeam()'
// ==================================================
// END: Create Modal to enter weekly scores
// ==================================================

function updateTeamScore(teamID, teamCount){
  var form = $('#my-form-id');
  var data = form.serialize();
  console.log('Form: ', form);
  console.log('Data: ', data);
  $.ajax({
    url: 'backliftapp/teamInfo/' + teamID,
    type: "PUT",
    dataType: "json",
    data: data,
    success: function(data){
      console.log('Success: ', data);
    }
  });
}  
  

function populateWeeklyScores(team){
  $('#weeklyScores').empty()
  $.ajax({
    url: 'backliftapp/teamInfo',
    type: "GET",
    dataType: "json",
    success: function (data) {
      even = data;
      console.log("data.length: " + data.length)
      if (data.length===4){
        SCHED = sched4;
      }
      else if ((data.length === 5) || (data.length === 6)){
        SCHED = sched6;
      }
      else if ((data.length === 7) || (data.length === 8)){
        SCHED = sched8;
      }
      if (data.length % 2 === 0) {
        billy = data.length % 2;
        writeSCHEDeven(even, SCHED)
      }
      else {
        writeSCHEDodd(data, SCHED)
        console.log("odd write SCHED")
      }
    } // end success
  }) 
  //"").appendTo('weeklyScores');
} //end function

//writes schedule table for even-# leagues (4,6,8 teams)
function writeSCHEDeven(data, SCHED) { 
  
  //This resets all Wins and Losses to ZERO
  for (var clearScores = 0; clearScores < data.length; clearScores++){
    teamID = data[clearScores].id;
    $.ajax({
      url: 'backliftapp/teamInfo/' + teamID,
      type: "PUT",
      dataType: "json",
      data: {
        totalWins: 0,
        totalLosses: 0,
      },
      success: function(data){
        console.log('Success: ', data);
      }
    })
  }


  $("<tr><th><h4>Week</h4></th><th><h4>Home Team</h4></th><th><h4>Runs</h4></th><th><h4>Runs</h4></th><th><h4>Away Team</h4></th></tr>").appendTo('#weeklyScores');
        for (var i = 0; i < SCHED.length; i++) {   //weeks loop
          if (data.length === 4){
            var numOfGamesEachWeek = 1;
          }
          else if (data.length === 6){
            var numOfGamesEachWeek = 2;
          }
          else if (data.length === 8){
            var numOfGamesEachWeek = 3;
          }
          //loop within a loop
            for (var k =0; k < (SCHED.length-numOfGamesEachWeek); k++) { 
              var l = 0; //alternates between home and away team.teamName
              writeWinsAndLosses(data, SCHED,k,l,i)
              $("<tr><td>"+(i+1)+"</td><td>" +
               data[((SCHED[i][k][l])-1)].teamName  +
                "</td><td>" + eval("data[((SCHED[i][k][l])-1)].week0" +(i+1) +"runs") + "</td><td>"+ eval("data[((SCHED[i][k][l+1])-1)].week0" +(i+1)+"runs")+"</td><td>"+
                data[((SCHED[i][k][l+1])-1)].teamName+
                "</td></tr>").appendTo('#weeklyScores');
              

            };
        };
      };

function writeWinsAndLosses(data, SCHED,k,l,i){
      if (eval("data[((SCHED[i][k][l])-1)].week0" +(i+1) +"runs") > eval("data[((SCHED[i][k][l+1])-1)].week0" +(i+1)+"runs")){

        console.log (eval("data[((SCHED[i][k][l])-1)].week0" +(i+1) +"runs") + " first is bigger than second " + eval("data[((SCHED[i][k][l+1])-1)].week0" +(i+1)+"runs"))

        teamIDWin = data[((SCHED[i][k][l])-1)].id;
        teamIDLose =data[((SCHED[i][k][l+1])-1)].id;
        teamNameWin = data[((SCHED[i][k][l])-1)].teamName;
        teamNameLose = data[((SCHED[i][k][l+1])-1)].teamName;
        $.ajax({
          url: 'backliftapp/teamInfo/' + teamIDWin,
          type: "GET",
          dataType: "json",
          async: false,
          success: function(currentTeam) { 
            currentWins = currentTeam.totalWins;
            currentWins = (eval(currentWins) + 1); // add one digit
            console.log("before Ajax " + teamNameWin + " has " + currentWins + " wins")

            $.ajax({
              url: 'backliftapp/teamInfo/' + teamIDWin,
              type: "PUT",
              dataType: "json",
              async: false,
              data: {
                totalWins: currentWins
              },
              success: function(data){
              }
            })
          }
        })
//========================================================================
        // Now the losers............
//========================================================================        
        $.ajax({
          url: 'backliftapp/teamInfo/' + teamIDLose,
          type: "GET",
          dataType: "json",
          async: false,
          success: function(currentTeam) { 
            currentLosses = currentTeam.totalLosses;
            currentLosses = (eval(currentLosses) + 1); // add one digit
            console.log("before Ajax losses" + teamNameLose + " has " + currentLosses + " wins")

            $.ajax({
              url: 'backliftapp/teamInfo/' + teamIDLose,
              type: "PUT",
              dataType: "json",
              async: false,
              data: {
                totalLosses: currentLosses
              },
              success: function(data){
                //console.log('currentWinsSuccess: ', data.totalWins);
              }// end successFunction
            })// end ajax PUT
          }// end GET success
        }) // end ajax GET
      } // end if statment  


      else if (eval("data[((SCHED[i][k][l+1])-1)].week0" +(i+1) +"runs") > eval("data[((SCHED[i][k][l])-1)].week0" +(i+1)+"runs")){
        console.log (eval("data[((SCHED[i][k][l])-1)].week0" +(i+1) +"runs") + " first is SMALLER than second " + eval("data[((SCHED[i][k][l+1])-1)].week0" +(i+1)+"runs"))
//////////////////////
        console.log (eval("data[((SCHED[i][k][l])-1)].week0" +(i+1) +"runs") + " first is bigger than second " + eval("data[((SCHED[i][k][l+1])-1)].week0" +(i+1)+"runs"))

        teamIDWin = data[((SCHED[i][k][l+1])-1)].id;
        teamIDLose =data[((SCHED[i][k][l])-1)].id;
        teamNameWin = data[((SCHED[i][k][l+1])-1)].teamName;
        teamNameLose = data[((SCHED[i][k][l])-1)].teamName;
        $.ajax({
          url: 'backliftapp/teamInfo/' + teamIDWin,
          type: "GET",
          dataType: "json",
          async: false,
          success: function(currentTeam) { 
            currentWins = currentTeam.totalWins;
            currentWins = (eval(currentWins) + 1); // add one digit
            console.log("before Ajax " + teamNameWin + " has " + currentWins + " wins")

            $.ajax({
              url: 'backliftapp/teamInfo/' + teamIDWin,
              type: "PUT",
              dataType: "json",
              async: false,
              data: {
                totalWins: currentWins
              },
              success: function(data){
              }
            })
          }
        })
//========================================================================
        // Now the losers............
//========================================================================        
        $.ajax({
          url: 'backliftapp/teamInfo/' + teamIDLose,
          type: "GET",
          dataType: "json",
          async: false,
          success: function(currentTeam) { 
            currentLosses = currentTeam.totalLosses;
            currentLosses = (eval(currentLosses) + 1); // add one digit
            console.log("before Ajax losses" + teamNameLose + " has " + currentLosses + " wins")

            $.ajax({
              url: 'backliftapp/teamInfo/' + teamIDLose,
              type: "PUT",
              dataType: "json",
              async: false,
              data: {
                totalLosses: currentLosses
              },
              success: function(data){
              }// end successFunction
            })// end ajax PUT
          }// end GET success
        }) // end ajax GET
      } // end if statment 
/////////////////////
      //}
} // END: function writeWinsAndLosses 


    function writeSCHEDodd(data, SCHED) { //writes scheduletable for odd-# leagues (5,7 teams)
      $("<tr><th>Week</th><th>Home Team</th><th>Runs</th><th>Runs</th><th>Away Team</th></tr>").appendTo('#weeklyScores');
        console.log("SCHED.length = " + SCHED.length)
        for (var i = 0; i < SCHED.length; i++) {   //weeks loop
          if (data.length === 5){
            var numOfGamesEachWeek = 3;
          }
          else if (data.length === 7){
            var numOfGamesEachWeek = 4;
          }
            for (var k =1; k < numOfGamesEachWeek; k++) { //loop within a loop
              var l = 0; //alternates between 1st and 2nd team listed for each game
              //writeWinsAndLosses(data, SCHED,k,l,i)
              console.log("i = " + i)
              console.log("k = " + k)
              console.log("FAILS ((SCHED[i][k][l+1])-1) = " + ((SCHED[i][k][l+1])-1))
              //console.log("num, teamName = " + ((SCHED[i][k][l+1])-1) + " "+ data[((SCHED[i][k][l+1])-1)].teamName)
              $("<tr><td>"+(i+1)+"</td><td>" +
               data[((SCHED[i][k][l])-1)].teamName  +
                "</td><td>" + data[((SCHED[i][k][l])-1)].week01runs + "</td><td>"+ data[((SCHED[i][k][l+1])-2)].week01runs +"</td><td>"+
                data[((SCHED[i][k][l+1])-2)].teamName+
                "</td></tr>").appendTo('#weeklyScores');
            };        
        };
      };

// ==================================================
// Add team to Standings
// ==================================================
function addTeamToTable(team) {
  $(
     "<tr>" +
    // Deleted the non-needed information 
    "<td><span rel='popover' class='show link' data-original-title='Team Info' data-content='Manager: " + team.firstName + " " + team.lastName + "<br/>Phone: " + team.phone + "<br/>Sponsor: " + team.sponsor + "<br/>Zipcode: " + team.zipcode + "'>" + team.teamName + "</span></td>" +
    "<td>" + team.totalWins + "</td>" +
    "<td>" + team.totalLosses + "</td>" +
    "<td>" + wlPercent(team) + "</td>" +
    "</tr>").appendTo('#standings'); //tbody

    $( "#standings" ).popover({
      selector: 'span.link',
      trigger: "hover focus" ,
      html:true,  
      placement: "right"
    });

};
// ==================================================
// END: Add team to Standings
// ==================================================


// ==================================================
// Create a new Team? if the team count is less >=8 show new team modal, if not show tooFewTeams modal
// ==================================================
function howManyTeams(){
  $.ajax({
    url: 'backliftapp/teamInfo',
    type: "GET",
    dataType: "json",
    success: function (data) {
      //howManyTeamsAreThere();
      if (data.length>=8){
       //alert("Sorry the league is FULL. \n(6 teams total allowed)")
       $('#full_league').modal('show')
      }
      else{
        $('#create_team').modal('show')
        //howManyTeamsAreThere()
        clearForm(); 
      }  //end else
    } //end of success function
  })  //end of ajax
};    //end of function

//$(document).ready(

// ==================================================
// Calls modal for either too few teams or adding weekly scores
// ==================================================
function addWeeklyScores(teamID, teamName){
    console.log("teamID: " + teamID + "teamName: " + teamName)
    $.ajax({
      url: 'backliftapp/teamInfo',
      type: "GET",
      dataType: "json",
      success: function (data) {
        if (data.length<=8 && data.length>=4){
         $('#enter_weekly_scores').modal('show')
         populateWeeklyScoresModal(data.length, teamID, teamName)
        }
        else if (data.length<4){
          $('#less_than_4_teams').modal('show')
        }
      }
    }) // end ajax
}; // end function
// ==================================================
// END: Calls modal for either too few teams or adding weekly scores
// ==================================================


function howManyWeeksOfScores(){
    $.ajax({
      url: 'backliftapp/teamInfo',
      type: "GET",
      dataType: "json",
      success: function (data) {
        console.log("data.length= " + data.length)
      } //end of success
    })// end of ajax
} // end of howManyWeeksOfScores


// ==================================================
// Clears both modals when called
// ==================================================
   function clearForm(){
     $(".team_inputs").each(function(){
       $(this).val("");
      });
     $(".enter_weekly_scores").each(function(){
       $(this).val("");
      });
  }
// ==================================================
// END: Clears both modals when called
// ==================================================

// ==================================================
// Calculate WL%
// ==================================================
function wlPercent(team){
	wl = ((+team.totalWins)/((+team.totalWins)+(+team.totalLosses)));
	if(isNaN(wl)){
		return "No Games Played"
	}
	else {
		var formatWL = (wl.toFixed(3)).toString().replace(/^0+/, '')
		return formatWL
	}
};
// ==================================================
// END:Calculate WL%
// ==================================================

// ==================================================
// Delete selected team
// ==================================================
function deleteTeam(id) {
  console.log(id)
  var conf = confirm("Are you sure you want to delete this team?");
  if (conf == true) {
    $.ajax({
      url: "backliftapp/teamInfo/" + id,
      type: "DELETE",
      dataType: "json",
    });
  //track("deleted: " + id)
  //$(this).closest('tr').remove()
  }
};
// ==================================================
// END: Delete selected team
// ==================================================