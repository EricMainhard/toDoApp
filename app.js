const $d = document,
$template = $d.getElementById('task-template').content,
$form = $d.getElementsByClassName('app-form')[0],
$taskList = $d.getElementsByClassName('tasks')[0],
$addTask = $d.getElementsByClassName('add-task')[0],
$input = $d.getElementById('input'),
errorMsg = $d.getElementById('errorMsg'),
closeError = $d.getElementById('closeError'),
$fragment = $d.createDocumentFragment();

let tareas = {}

$form.addEventListener('submit',function(e){
    e.preventDefault();
    console.log($input.value);

    addTask($input.value);
})

document.addEventListener('DOMContentLoaded',function(){
    if(localStorage.getItem('tareas')){
        tareas = JSON.parse(localStorage.getItem('tareas'));
    }
    printTasks()
    if (tareas.length == 0){
        console.log('Sin tareas pendientes');
    }
})

function printTasks(){

    taskToJSON = JSON.stringify(tareas);
    localStorage.setItem('tareas',taskToJSON);

    if(Object.values(tareas).length === 0){
        $taskList.innerHTML = `
        <div id="emptyTasks" class="text-center">
            <p> Sin tareas pendientes <i class="fas fa-laugh-beam p-2 happyFace"></i> </p> 
        </div>`
        return
    }

    $taskList.innerHTML = '';

    Object.values(tareas).forEach(function(tarea){
        const clone = $template.cloneNode(true);
        clone.querySelector('h3').textContent = tarea.content;

        if(tarea.done){
            clone.querySelector('.task').classList.add('done');
            clone.querySelector('.fa-check').classList.replace('fa-check','fa-undo-alt');
         } 
        else if (!tarea.done){
            clone.querySelector('.task').classList.remove('done');
         }

        clone.querySelectorAll('.fas')[0].dataset.id = tarea.id;
        clone.querySelectorAll('.fas')[1].dataset.id = tarea.id;
        $fragment.appendChild(clone);   
    })

    $taskList.appendChild($fragment);
}

function addTask(task){ 
    if (task.trim() != '') {
        let created = Object.keys(tareas).length + 1;
        task = {
            id: created,
            content: task
    };

        tareas[task.id] = task;
        printTasks();
    }
    else {
       errorMsg.style.display = "flex";
       return;
    }
    
    $form.reset();
    $input.focus();
}

$taskList.addEventListener('click',function(e){
    btnAction(e);
})

const btnAction = function(e){
    if (e.target.classList.contains('fa-times')){
        delete tareas[e.target.dataset.id]
        checkSound();
        printTasks();
        
    }
    else if (e.target.classList.contains('fa-check')) {
        tareas[e.target.dataset.id].done = true;
        printTasks();
     }
     else if (e.target.classList.contains('fa-undo-alt')) {
        tareas[e.target.dataset.id].done = false;
        printTasks();
     }
     e.stopPropagation();
}

function checkSound(){
    const audio = new Audio('./checkSound.mp3');
    audio.play();
}

closeError.addEventListener('click',function(){
    errorMsg.style.display = 'none';
})