$(document).ready(function(){	//executed after the page has loaded

	$.ajax({	//create an ajax request to heroku apps
        type: "GET",
        url: "http://cherry-timely.herokuapp.com",
        data: '',
        dataType: "html",	//expect html to be returned
        success: function(msg){
        	console.log("SUCCESS: Returned from cherry-timely!");
        	console.log(msg);
        },
        error:  function(msg){
        	console.log("ERROR: Returned from cherry-timely!");
        	console.log(msg);
        }
    });

	$.ajax({	//create an ajax request to heroku apps
        type: "GET",
        url: "http://knowthyselfie.herokuapp.com",
        data: '',
        dataType: "html",	//expect html to be returned
        success: function(msg){
        	console.log("SUCCESS: Returned from KTS!");
        	console.log(msg);
        },
        error:  function(msg){
        	console.log("ERROR: Returned from KTS!");
        	console.log(msg);
        }
    });

	$.ajax({	//create an ajax request to heroku apps
        type: "GET",
        url: "http://cheap-new-york.herokuapp.com/",
        data: '',
        dataType: "html",	//expect html to be returned
        success: function(msg){
        	console.log("SUCCESS: Returned from CNY!");
        	console.log(msg);
        },
        error:  function(msg){
        	console.log("ERROR: Returned from CNY!");
        	console.log(msg);
        }
    });

});


