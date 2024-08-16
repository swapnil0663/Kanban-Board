const addbtn = document.querySelector('.add-btn');
const modal = document.querySelector('.model-container');
const TextArea = document.querySelector('.model-testarea');
const MainCont = document.querySelector('.main-contaier');
const Pricolor = document.querySelectorAll('.pri-color');
const deleteflag = document.querySelector('.delete-btn');
const allFilterColor = document.querySelectorAll('.color');

let colors = ['red','green','blue','black'];
let ticketArr = [];
let isModalOpen = false;
let isDeletebtn = false;
let ticketColor = 'red';
const uid = new ShortUniqueId();

if(localStorage.getItem('TicketDetails')){
    let stringfiedarr = localStorage.getItem('TicketDetails');
    let arr = JSON.parse(stringfiedarr);
    for(let i=0;i<arr.length;i++) {
        let ticketObj = arr[i];
        console.log(ticketObj);
        createTicket(ticketObj.id,ticketObj.task,ticketObj.color);
    }
}

addbtn.addEventListener('click',function(){
    if(isModalOpen){
        modal.style.display = 'none';
        // isModalOpen = false;
    } else {
        modal.style.display = 'flex';
        // isModalOpen = true;
    }
    isModalOpen = !isModalOpen;
})

for(let i=0;i<allFilterColor.length;i++) {
    allFilterColor[i].addEventListener('click',function(e){
        let selectedColor = e.target.classList[1];
        // console.log(selectedColor);
        let ticketconatiner = document.querySelectorAll('.ticket-color');
        // console.log(ticketColor);
        for(let j=0;j<ticketconatiner.length;j++) {

            let targetColor = ticketconatiner[j].classList[1];
            if(selectedColor == targetColor) {
                ticketconatiner[j].parentElement.style.display = 'block';
            } else 
            {
                ticketconatiner[j].parentElement.style.display = 'none';
            }
        }
        
    })

    allFilterColor[i].addEventListener('dblclick',function(){
        const allTickets = document.querySelectorAll('.ticket-container');
        // console.log(allTickets);
        for(let j=0;j<allTickets.length;j++){
            allTickets[j].style.display = 'block'; // show the tickets
        }
    })
}

deleteflag.addEventListener('click',function(){
    if(isDeletebtn) {
        isDeletebtn = false;
        deleteflag.style.color = 'black';
    }else {
        isDeletebtn = true;
        deleteflag.style.color = 'red';
    }
    
})

TextArea.addEventListener('keydown',function(e){
    if(e.key == 'Enter') {
        modal.style.display = 'none';
        isModalOpen= false;
        const ModalValue = TextArea.value;
        TextArea.value = '';
        createTicket(undefined,ModalValue,ticketColor);    
    }
})

function createTicket(ticketID,task,ticketColor) {
    if(task == ''){
        alert('Please Enter a Task !!!')
        return;
    }
    let id;
    if(ticketID) {
        id = ticketID;
    } else {
        id = uid.rnd();
    }
    
    let ticket = document.createElement('div');
    ticket.className = 'ticket-container';
    ticket.innerHTML = `<div class="ticket-color ${ticketColor}"></div>
            <div class="ticket-id">#${id}</div>
            <div class="task-area">${task}</div>
            <div class='lock-unlock'><i class="fa-solid fa-lock"></i></div>`;
    MainCont.appendChild(ticket); 
    let ticketObj = {id:id,task:task,color:ticketColor};
    ticketArr.push(ticketObj);
    updatelocalStorage();

    ticket.addEventListener('click',function(){
        if(isDeletebtn) {
            ticket.remove();

            let index = ticketArr.findIndex(function(ticketObj){
                return ticketObj.id == id;
            })
            ticketArr.splice(index,1);
            updatelocalStorage();
        }
    })

    //lock and Unlock
    let lockUnlockIcon = ticket.querySelector('.fa-solid');
    let TaskArea = ticket.querySelector('.task-area');
    lockUnlockIcon.addEventListener('click',function(e){
        if(e.target.classList.contains('fa-lock')) {
            e.target.classList.remove('fa-lock');
            e.target.classList.add('fa-lock-open');
            TaskArea.setAttribute('contenteditable',true);
        } else {
            e.target.classList.remove('fa-lock-open');
            e.target.classList.add('fa-lock');
            TaskArea.setAttribute('contenteditable',false);
            let index = ticketArr.findIndex(function(ticketObj){
                return ticketObj.id == id;
            })
            ticketArr[index].task = TaskArea.innerText;
            updatelocalStorage();
        }
    })



    let changecolor = ticket.querySelector('.ticket-color');
    // console.log(changecolor);
    changecolor.addEventListener('click',function(e){
        let colorOfClass = changecolor.classList[1];
        let currenClassindex = colors.indexOf(colorOfClass);
        e.target.classList.remove(colorOfClass);
        // for(let i=0;i<colors.length;i++) {
        //     if(colors[i] == colorOfClass) {
        //         currenClassindex = i;
        //         break;
        //     }
        // }
        let nextIndexClass = (currenClassindex+1)%colors.length;
        let nextclass = colors[nextIndexClass];
        e.target.classList.add(nextclass);
        let index = ticketArr.findIndex(function(ticketObj){
            return ticketObj.id == id;
        })
        ticketArr[index].color = nextclass;
        updatelocalStorage();
    })
}

for(let i=0;i<Pricolor.length;i++) {
    Pricolor[i].addEventListener('click',function(e){
        for(let j=0;j<Pricolor.length;j++) {
            if(Pricolor[j].classList.contains('active')) {
                Pricolor[j].classList.remove('active');
            }
        }
        e.target.classList.add('active');
        ticketColor = e.target.classList[1]; 
    })
}


function updatelocalStorage(){
    let stringfiedticketArr = JSON.stringify(ticketArr);
    localStorage.setItem('TicketDetails',stringfiedticketArr);
}