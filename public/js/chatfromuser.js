
input.addEventListener("keydown",(event)=>{
   if(event.key==="Enter"){
    askAI();
   } 
});
function aiResponse(Answer){
    let pAi =document.createElement("p");
    let line = document.createElement("hr");
    pAi.innerHTML=`<h5>AI:</h5><p>${Answer}</p>`;
    pAi.setAttribute("class","bg-secondary text-md-start p-3 mb-3 rounded");
    body.appendChild(pAi);
    body.appendChild(line);
}


async function askAI(){
    let userInput = document.getElementById("prompt").value;
    let pUser =document.createElement("p");
    pUser.setAttribute("class","bg-light text-md-end p-3 rounded");
    pUser.innerHTML=`<h5>User:</h5><p>${userInput}</p>`;
    body.appendChild(pUser);
    document.getElementById("prompt").value = "";
    let response = await fetch('/ask',{
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({prompt: userInput})
    });
    let data = await response.json();
    console.log(data);
    aiResponse(data.answer);
}

