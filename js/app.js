

//const BASE_URL="http://192.168.0.12:3000";//mi casa
//const BASE_URL="http://192.168.30.151:3000";//gbh
const BASE_URL="https://protected-beyond-92029.herokuapp.com";// heroku
const NOT_WORK_MSG="No task in progress...";

    /**
     * Handles the hardware key events.
     * @private
     * @param {Object} event - The object contains data of key event
     */
    function keyEventHandler(event) {
        if (event.keyName === "back") {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    }
    
    function startStopTask() {
    	
    	$("#get_btn").text("Get Task");
    	const taskId=$("#toggl-taskId").val();
//    	alert(taskId);
//    	
    	const jqxhr = $.getJSON( BASE_URL+"/stop/"+taskId, (json)=> {
    		
    	  console.debug("Work : "+json.data.description +" Done!. ");
    	  $("#togll-task").text(json.data.description);
    	  alert("Done!  ");
    	  $("#toggl-task").text(NOT_WORK_MSG);
    	  $("#stop_btn").hide("slow");
		  $("#get_btn").show();
		  
    	})
    	  .fail((e)=> {
    	    console.error( "error",e);
    		alert("Error: The task could not be finished ");
    	  })
    	  .always(() => {
    	    console.log( "complete" );
    	  });   	 
    }
    
    function loadCurrentTask() {
    	
    	$("#toggl-task").text("loading...");
    	const jqxhr = $.getJSON( BASE_URL+"/current", (json)=> {
    	  console.log( json.data );
    	  
    	  if(json.data===null){
    		  $("#toggl-task").text(NOT_WORK_MSG);
    		  $("#stop_btn").hide("slow");
    		  $("#get_btn").show("fast");
    	  }else{
    		  console.log(json.data.description);
    		  if(json.data.description===undefined)
    			  $("#toggl-task").text("No description");
    		  else    			  
    			  $("#toggl-task").text(json.data.description);
    		  
			  $("#toggl-taskId").val(json.data.id);
		//    	  alert("Tarea Cargada ");
    		  $("#get_btn").hide("slow");
    		  $("#stop_btn").show();
    	  }
    	})
    	  .fail((e)=> {
    		  
    	    console.error( "error" );
    	    alert("Error: The task could not be loaded ");
    	    $("#stop_btn").hide();
  		  	$("#get_btn").show();
  		  	$("#toggl-task").text("The task could not be loaded");
  		  	
    	  })
    	  .always(() => {
    		  
    	    console.debug( "complete" );
    	  });   	 
    }
    

(function() {
   

    /**
     * Sets default event listeners.
     * @private
     */
    function setDefaultEvents() {
        document.addEventListener("tizenhwkey", keyEventHandler);
        $("#stop_btn").click(startStopTask);
        $("#get_btn").click(loadCurrentTask);
//        $("#get_btn").hide();
    }

    /**
     * Initiates the application.
     * @private
     */
    function init() {
        setDefaultEvents();
        loadCurrentTask();
    }
    
    window.onload = init;
}());