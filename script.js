const ADMIN_PASSWORD="admin123";

/* ================= DEFAULT QUESTIONS ================= */

const defaultQuestions={
technical:[
{q:"What does DOM stand for?",options:["Document Object Model","Data Object Management","Digital Order Method"],answer:0},
{q:"What is closure in JS?",options:["Function with preserved scope","Loop","Object"],answer:0},
{q:"Time complexity of binary search?",options:["O(n)","O(log n)","O(n²)"],answer:1},
{q:"Which is backend language?",options:["HTML","CSS","Node.js"],answer:2},
{q:"REST stands for?",options:["Representational State Transfer","Remote Execute System","Random State Tech"],answer:0},
{q:"HTTP status 404 means?",options:["OK","Not Found","Server Error"],answer:1},
{q:"SQL command to retrieve?",options:["GET","SELECT","FETCH"],answer:1},
{q:"Which is JS framework?",options:["React","Laravel","Django"],answer:0},
{q:"CSS Flexbox used for?",options:["Layout","Database","Security"],answer:0},
{q:"API stands for?",options:["Application Programming Interface","Advanced Program Internet","App Private Integration"],answer:0},
{q:"Which tag creates link?",options:["<a>","<link>","<href>"],answer:0},
{q:"Which is NoSQL DB?",options:["MongoDB","MySQL","Oracle"],answer:0},
{q:"Git command to clone repo?",options:["git clone","git copy","git fork"],answer:0},
{q:"JS data type?",options:["Boolean","Float32","Character"],answer:0},
{q:"Promise handles?",options:["Async operations","Loops","CSS"],answer:0}
],

aptitude:[
{q:"2x=20,x=?",options:["10","20","5"],answer:0},
{q:"15% of 300?",options:["30","45","60"],answer:1},
{q:"Next:5,10,20,40,?",options:["60","80","100"],answer:1},
{q:"Average of 4,6,8?",options:["6","5","7"],answer:0},
{q:"12²=?",options:["144","124","122"],answer:0},
{q:"LCM of 3 & 4?",options:["12","24","7"],answer:0},
{q:"Profit=SP-?",options:["CP","MP","Loss"],answer:0},
{q:"Simple Interest formula?",options:["P×R×T/100","P+R+T","P×T"],answer:0},
{q:"Speed 50km/h for 2h?",options:["100km","120km","90km"],answer:0},
{q:"25% of 80?",options:["20","25","15"],answer:0},
{q:"Next:1,1,2,3,5,?",options:["8","7","9"],answer:0},
{q:"Square root of 81?",options:["9","8","7"],answer:0},
{q:"If A=1,B=2 then AB?",options:["12","21","3"],answer:0},
{q:"3³=?",options:["9","27","6"],answer:1},
{q:"Ratio 2:4 equals?",options:["1:2","2:2","4:2"],answer:0}
],

hr:[
{q:"Why should we hire you?",options:["Skill match","Need job","No reason"],answer:0},
{q:"Strength?",options:["Hardworking","Lazy","None"],answer:0},
{q:"Weakness?",options:["Overthinking","Nothing","Late"],answer:0},
{q:"Team player?",options:["Yes","No","Sometimes"],answer:0},
{q:"5 year goal?",options:["Growth","Same role","Not sure"],answer:0},
{q:"Handle pressure?",options:["Stay calm","Panic","Avoid"],answer:0},
{q:"Relocate?",options:["Yes","No","Maybe"],answer:0},
{q:"Leadership means?",options:["Guide team","Control","Ignore"],answer:0},
{q:"Conflict resolution?",options:["Communicate","Fight","Ignore"],answer:0},
{q:"Why this company?",options:["Brand value","Salary only","No idea"],answer:0},
{q:"Work under deadlines?",options:["Yes","No","Sometimes"],answer:0},
{q:"Biggest achievement?",options:["Project success","Nothing","Skip"],answer:0},
{q:"Preferred work style?",options:["Team","Alone","Both"],answer:2},
{q:"Adapt to change?",options:["Yes","No","Maybe"],answer:0},
{q:"Motivation source?",options:["Growth","Money only","Pressure"],answer:0}
]
};

/* ================= STORAGE ================= */

function getQuestions(){
    return JSON.parse(localStorage.getItem("questions"))||defaultQuestions;
}
function saveQuestions(data){
    localStorage.setItem("questions",JSON.stringify(data));
}

/* ================= NAVIGATION ================= */

function showSection(id){
    document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

function showHome(){ showSection("homeSection"); renderLeaderboard(); }
function showAdminLogin(){ showSection("adminLoginSection"); }

/* ================= QUIZ ================= */

let currentIndex=0,score=0,timer,timeLeft=15,selectedQuestions;

function startGame(){
    let round=document.getElementById("roundType").value;
    selectedQuestions=[...getQuestions()[round]].sort(()=>0.5-Math.random());
    currentIndex=0;score=0;
    showSection("quizSection");
    loadQuestion();
}

function loadQuestion(){
    if(currentIndex>=selectedQuestions.length){endGame();return;}
    let q=selectedQuestions[currentIndex];
    document.getElementById("question").innerText=q.q;
    let optionsDiv=document.getElementById("options");
    optionsDiv.innerHTML="";
    q.options.forEach((opt,i)=>{
        let btn=document.createElement("button");
        btn.innerText=opt;
        btn.onclick=()=>checkAnswer(i);
        optionsDiv.appendChild(btn);
    });
    startTimer();
}

function startTimer(){
    timeLeft=15;
    document.getElementById("timer").innerText="Time: "+timeLeft;
    timer=setInterval(()=>{
        timeLeft--;
        document.getElementById("timer").innerText="Time: "+timeLeft;
        if(timeLeft<=0){clearInterval(timer);currentIndex++;loadQuestion();}
    },1000);
}

function checkAnswer(i){
    clearInterval(timer);
    if(i===selectedQuestions[currentIndex].answer)score++;
    currentIndex++;loadQuestion();
}

function endGame(){
    showSection("resultSection");
    let percent=Math.round((score/selectedQuestions.length)*100);
    let username=document.getElementById("username").value||"Guest";

    document.getElementById("finalResult").innerText=
        percent>=70?"🟢 Hire Ready!":"🔴 Keep Practicing!";
    document.getElementById("percentage").innerText=
        "Score: "+score+"/"+selectedQuestions.length+" ("+percent+"%)";

    saveScore(username,percent);
    renderLeaderboard();
}

/* ================= LEADERBOARD ================= */

function saveScore(name,score){
    let board=JSON.parse(localStorage.getItem("leaderboard"))||[];
    board.push({name,score});
    board.sort((a,b)=>b.score-a.score);
    board=board.slice(0,5);
    localStorage.setItem("leaderboard",JSON.stringify(board));
}

function renderLeaderboard(){
    let board=JSON.parse(localStorage.getItem("leaderboard"))||[];
    let div=document.getElementById("leaderboard");
    if(!div) return;
    div.innerHTML="";
    board.forEach((p,i)=>{
        div.innerHTML+=`<p>${i+1}. ${p.name} - ${p.score}%</p>`;
    });
}

/* ================= ADMIN ================= */

function checkAdmin(){
    if(document.getElementById("adminPass").value===ADMIN_PASSWORD){
        showSection("adminSection");
        renderQuestions();
    } else alert("Wrong Password");
}

function addQuestion(){
    let round=document.getElementById("adminRound").value;
    let q=document.getElementById("newQuestion").value;
    let o1=document.getElementById("opt1").value;
    let o2=document.getElementById("opt2").value;
    let o3=document.getElementById("opt3").value;
    let ans=parseInt(document.getElementById("correctIndex").value);

    if(!q||!o1||!o2||!o3||isNaN(ans)) return alert("Fill all fields");

    let questions=getQuestions();
    questions[round].push({q,options:[o1,o2,o3],answer:ans});
    saveQuestions(questions);
    renderQuestions();
}

function renderQuestions(){
    let list=document.getElementById("questionList");
    list.innerHTML="";
    let questions=getQuestions();
    for(let round in questions){
        questions[round].forEach((q,i)=>{
            list.innerHTML+=
            `<div class="question-item">
            <b>${round.toUpperCase()}</b>: ${q.q}
            <button onclick="deleteQuestion('${round}',${i})">Delete</button>
            </div>`;
        });
    }
}

function deleteQuestion(round,index){
    let questions=getQuestions();
    questions[round].splice(index,1);
    saveQuestions(questions);
    renderQuestions();
}

function resetQuestions(){
    localStorage.clear();
    renderQuestions();
}
