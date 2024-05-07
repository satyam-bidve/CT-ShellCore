const ovelvalues = [];   
const corevalues = [];
const ovelX = [];
const ovelY = [];
const coreX = [];
const coreY = [];
const corediag = [];
let pairs = [];
const coreArea = [];
const ovalInscribeRectAreas = [];


//------------------------------------------------------------------------------------ BESIC VALUES

let coreCount = 0;      // hOW MANY CORE USER CREATED 

let foundOvelX = 0;   // FOUNDED VALUES OF FINAL SHELL WIDTH
let foundOvelY = 0;   // FOUNDED VALUES OF FINAL SHELL hEIGHT
let major = 0;         // FOUNDED VALUES OF FINAL SHELL MAJOR LENGTH AXIS
let minor = 0;         // FOUNDED VALUES OF FINAL SHELL MINOR LENGTH AXIS
let sumdiag = 0;
let sumCoreArea = 0;
let maxofcoreX  = 0;
let maxofcoreY  = 0;

//-------------------------------------------------------------------------------------------lOGICAL vALUES







//################################################################################### start of $Doc.ready
$(document).ready(function(){
     //$(document).on('dblclick', '.draggable', rotateMe);
     // lets change ovels shape here user value 
     // access that ovel div -> change css property width and height
     // take care of array index to match correctly with ovel x and y values :)
     // getting values x -y  from the number input for creating shell
    $("#btngetVal").click(function(){ 

    
      var box = document.getElementById("showOvels");
      var htmlString = ""
       for(var i = 1 ; i <= 6 ; i++){
           htmlString = `
                    <div class="oval" id="ovel${i}" style = "width :${$(`#ox${i}`).val()}; height :${$(`#oy${i}`).val()};"></div>
                  
                  `
                      box.innerHTML += htmlString;
                      ovelvalues.push($(`#ox${i}`).val());
                      ovelX.push($(`#ox${i}`).val());
                      ovelvalues.push($(`#oy${i}`).val());
                      ovelX.push($(`#oy${i}`).val());
                      
                      ovalInscribeRectAreas.push({
                        inscribeAreaRect: 2*($(`#ox${i}`).val()/2)*($(`#oy${i}`).val()/2),
                        width: $(`#ox${i}`).val(),
                        height: $(`#oy${i}`).val()
                    });
                      
       };
       $("#pBar").css({"width": "30%"});
      
      ovalInscribeRectAreas.sort((a, b) => a.inscribeAreaRect - b.inscribeAreaRect);
      console.log(ovalInscribeRectAreas);
      
  })

   

    
    

  
  
// here we get the user value of how many core he wants
// Function to create table dynamically so that we get all cores diamention
 $("#btnGetCoreCount").click(function(){
  coreCount = $("#getCoreCount").val()
    var table = document.getElementById("DynamicTable");
     for(var i = 1 ; i <= coreCount ; i++){
        var row = `
                    <tr>
                    <td>core ${i}</td>
                    <td><input type="number" id="cx${i}"></td>
                    <td><input type="number" id="cy${i}"></td>
                    </tr>
                    `
            table.innerHTML += row;
     }
    })
    // step 2 - creating core from user input diamensions
    // now need to make this dynamic
    // function to display the created cores with given diamension
    $("#btnCreateCore").click(function(){
        var box = document.getElementById("coreBox");
        var htmlString = ""
         for(var i = 1 ; i <= coreCount ; i++){
             htmlString = `
                      <div class="core" id="core${i}" style = "width :${$(`#cx${i}`).val()}; height :${$(`#cy${i}`).val()};"></div>
                    
                    `
                        box.innerHTML += htmlString;
                        corevalues.push($(`#cx${i}`).val());
                        coreX.push($(`#cx${i}`).val());
                        corevalues.push($(`#cy${i}`).val());
                        coreY.push($(`#cy${i}`).val());
                     
                        coreArea.push($(`#cx${i}`).val() * $(`#cy${i}`).val());
                        
         };
         $("#pBar").css({"width": "60%"});
        
         sumCoreArea = coreArea.reduce((partialSum, a) => Number(partialSum)+ Number(a), 0);
         maxofcoreX = Math.max(...coreX);
         maxofcoreY = Math.max(...coreY);
       
         
        })


      

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@_Main Logic_@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
   // STEP 3  on click find max area all cores - fit to the ovel --
   $("#btnfindOvel").click(function(){
   

 
    // check area condition AREA > TOTAL CORE AREA AND jan5
    
    for(let i = 0 ; i < ovalInscribeRectAreas.length ; i++){
      if((ovalInscribeRectAreas[i].inscribeAreaRect > sumCoreArea)&&(((ovalInscribeRectAreas[i].width > maxofcoreX || ovalInscribeRectAreas[i].height > maxofcoreX)&&(ovalInscribeRectAreas[i].width > maxofcoreY || ovalInscribeRectAreas[i].height > maxofcoreY)))){
        console.log("found the shell -"+ ovalInscribeRectAreas[i].inscribeAreaRect + "for the core area total "+ sumCoreArea);
        foundOvelX = ovalInscribeRectAreas[i].width;
        foundOvelY = ovalInscribeRectAreas[i].height;
        break;
      }

    }


     // if no shell is there to fit requred core
    if(foundOvelX == 0 && foundOvelY == 0){
       alert("No shell found here to fit all cores");
       location.reload(); // clear everything
    }
    
    // if shell found then change shell diamensions of found one
    $("#ellipse").css({"width":foundOvelX , "height":foundOvelY}) //<- change the eclips diamention here 
    

   
     $("#pBar").css({"width": "100%"});

    
   // on this  button here we create dynamic tables to show core sizes on runtime when resizing
   var table = document.getElementById("DynamicCoreSizes");
   for(var i = 1 ; i <= coreCount ; i++){
      var row = `
                  <tr>
                  <td>core ${i}</td>
                  <td><p id="widthInfo${i}"></p></td>
                  <td><p id="heightInfo${i}"></p></td>
                  </tr>
                  `
          table.innerHTML += row;
   }


   });
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


   // on click we create the  of cores  dynamically inside of shell  
  $("#btnCreateCoreSVG").click(function() {

   
    
    for (var i = 1; i <= coreCount; i++) {  // positioning problem 
      createBox(i);
    }
   
   
     

   function createBox(i) {
    var box = document.createElement('div');
    box.className = 'box';
    box.dataset.id = i;
   
   //box.style.zIndex = `var(--zi-${i})`;
    box.style.width = `${$(`#cx${i}`).val()}px`; // Assuming #cx${i} is an input field for width
    box.style.height = `${$(`#cy${i}`).val()}px`; // Assuming #cy${i} is an input field for height
    box.style.backgroundColor = `var(--bg-1)`;

    initializeBox(box);

    // Append the new box to the container
    document.getElementById('ellipse').appendChild(box);
   }
    
});


                    







function initializeBox(box) {



  $(function() {
    // Make the box draggable, resizable, and rotatable
    
   $(box).draggable({
    containment: "parent" // This ensures the box stays within its parent
  });

  
   
  
  var params = {
    start: function(event, ui) {
       // console.log("Rotating started")
       //console.log(box.dataset.id);
    },
    rotate: function(event, ui) {
        if (Math.abs(ui.angle.current > 6)) {
          //console.log("Rotating " + ui.angle.current);
        }
    },
    stop: function(event, ui) {
       // console.log("Rotating stopped");
    },
};
   $(box).rotatable(params);
    $(box).resizable({
      
       handles: "n, e, s, w, ne, se, sw, nw",
       resize: function(event, ui) {
        // Display the current width and height runtime
        $(`#widthInfo${box.dataset.id}`).text( Math.round(ui.size.width));  
        $(`#heightInfo${box.dataset.id}`).text( Math.round(ui.size.height));
       
       
    }
     });



 
  });
 

 
}








  



  
});
//################################################################################### End of $Doc.ready



/**
 *   on btncreatecore -> corediag.push(Math.sqrt(Math.pow($(`#cx${i}`).val(), 2) + Math.pow($(`#cy${i}`).val(), 2)));
 *  this sum should < minor -> sumdiag = corediag.reduce((partialSum, a) => Number(partialSum)+ Number(a), 0);
                    console.log(sumdiag + " this is sum of diag");
 * 
 */