

const BASE_URL="http://192.168.0.14:3000";//mi casa
//const BASE_URL="http://10.12.13.46:3000";//gcs
//const BASE_URL="http://localhost:3000";//gbh
//const BASE_URL="http://192.168.30.151:3000";//gbh 
//const BASE_URL = "https://protected-beyond-92029.herokuapp.com";// heroku
const NOT_WORK_MSG = "No task in progress...";
let token='';

    /**
     * Handles the hardware key events.
     * @private
     * @param {Object} event - The object contains data of key event
     */
    function keyEventHandler(event){
        
        if (event.keyName == "back") { 
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    }

    function login() {
    	
    	// $("#get_btn").text("Get Task");
        let userData={
            token: '',
            user:$("#user_name").val(),
            pass:$("#pass").val()
        };
        
    	const jqxhr = $.post( BASE_URL+"/login",userData, (_token)=> {
    		
            userData.token=_token;
            
            userData=storeUserData(userData)
            
    	    console.info("UserData : "+userData.token +" Save!. ");
            token=_token;
            
//    	  $("#togll-task").text(json.data.description);
    	  alert(`Welcome!  ${userData.user}`);
    	  $("#toggl-task").text(NOT_WORK_MSG);
    	  $("#login-container").hide("slow");
    	  $("#login_btn").hide("slow");

          
		  loadCurrentTask();
		  
    	})
    	  .fail((e)=> {
    	    console.error( "error",e);
    		alert("Error: The task could not be finished ");
    	  })
    	  .always(() => {
    	    console.log( "complete" );
    	  });   	 
    } 
    
    function startStopTask() {
        
        const token=storeUserData(null).token;
    	
    	$("#get_btn").text("Get Task");
    	const taskId=$("#toggl-taskId").val();
//    	alert(taskId);
        
        const URL=BASE_URL+`/stop/${taskId}?token=${token}`;
        console.info(URL);
        
        
    	const jqxhr = $.getJSON(URL , (json)=> {
    		
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
        
        // const token=userData.token;
        
        cancelAnimationFrame
        
        $("#area-news").show("slow");
        $("#get_btn").show("slow");
    	$("#toggl-task").text("loading...");
        	
        
        const URL=BASE_URL+`/current?token=${token}`;
        
        console.info(URL);
        
          const jqxhr = $.getJSON( URL, (json)=> {
              console.log( json.data );

              if(json.data===null){

                  $("#toggl-task").text(NOT_WORK_MSG);
                  $("#stop_btn").hide("slow");
                  $("#get_btn").show("fast");

              }else{
                  
                  console.log(json.data.description);
                  if(json.data.description===undefined)
                      $("#toggl-task").text("No description");
                  else {   			  
                      $("#toggl-task").text(json.data.description);
                      localStorage.setItem("JSON", JSON.stringify(json.data));
                  }
                  $("#toggl-taskId").val(json.data.id);
            //    	  alert("Tarea Cargada ");
                  $("#get_btn").hide("slow");
                  $("#stop_btn").show(); 
              }
          })
    	  .fail((e)=> {

            console.error( "error" );
            alert("Error: The task could not  be loaded ");
            $("#stop_btn").hide();
            $("#get_btn").show();
            $("#toggl-task").text("The task could not be loaded");
            //  		  	$("#login-container").show("show");
            //  		  	$("#login-container").show("show");
  		  	
  		  	
    	  })
    	  .always(() => {
    		  
    	    console.debug( "complete" );
    	  });   	 
    }

    function storeUserData(userData){
        console.info("######### LOCAL STORE ######");
        console.info(userData);

        if(userData!=null){
            localStorage.setItem("token", userData.token);
            localStorage.setItem("user",  userData.user);
            localStorage.setItem("pass",  userData.pass);

        } 
    //   	 	console.info(localStorage.getItem("JSON"));
    //  	 localStorage.setItem("lastname", "Smith");
//        if(localStorage.getItem("token")!=null)
            return {token: localStorage.getItem("token"),user: localStorage.getItem("user"),pass: localStorage.getItem("pass")}
        
//        return null;
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
        $("#login_btn").click(login);
//        $("#get_btn").hide();
    }



    /**
     * Initiates the application.
     * @private
     */
    function init() {
        setDefaultEvents();
        
        $("#stop_btn").hide();
        
        const userData=storeUserData(null);
        console.info(userData);
        
        if(userData.token==null){
            
            $("#login-container").show("show");
            $("#login_btn").show("show");
            
            $("#area-news").hide(); 
            
        }else{
            token=userData.token;
//            userData.token=null;
            
            
            loadCurrentTask();
//            storeUserData(userData);
        }
    
        

    }
    
    window.onload = init;
}());