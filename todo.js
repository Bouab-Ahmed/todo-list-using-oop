const addTodo = document.querySelector('#button-todo');
const input = document.querySelector('#input-field');
const settime = document.querySelector('.set_time');

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

class Task {
  constructor(content) {
    this.content = content;
    this.isCompleted = false;
    const today = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    this.time = today;
  }
}

class ToDoList {
  constructor(selectedHtmlElement) {
    this.tasks = JSON.parse(window.localStorage.getItem('tasks')) || [];
    this.completed = [];
    this.toBeDone = [];
    this.searchedTask = '';
    this.foundTasks = [];
    this.selectedHtmlElement =
      selectedHtmlElement || document.querySelector('#container');
    this.render(this.tasks);
  }

  render(chosenTaskArray) {
    document.querySelector('#container').innerHTML = '';
    this.addTime();
    this.addPromptFormForAddingTasks();
    this.addFilteringButtons();
    this.addListWithTasks(chosenTaskArray);
  }

  addTime() {
    const divWrapper = document.createElement('div');
    divWrapper.classList.add(
      'mt-3',
      'text-sm',
      'text-[#8ea6c8]',
      'flex',
      'justify-between',
      'items-center'
    );
    const dateP = document.createElement('p');
    dateP.className = 'set_date';
    const timeP = document.createElement('p');
    dateP.className = 'set_time';
    const d = new Date();
    const dayName = days[d.getDay()];
    const dayNum = d.getDate();
    const monthName = months[d.getMonth()];
    const today = d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    setInterval(() => {
      dateP.innerHTML = `${dayName} ${dayNum} ${monthName}`;
      timeP.innerHTML = today;
    }, 500);
    divWrapper.appendChild(dateP);
    divWrapper.appendChild(timeP);
    this.selectedHtmlElement.appendChild(divWrapper);
  }

  addTaskToList(text) {
    if (text === '' || text === null) {
      alert('It would be too easy for you :)');
    } else {
      this.tasks.push(new Task(text));
      this.saveTaskInLocalStorage();
    }
    this.render(this.tasks);
  }

  addListWithTasks(chosenTaskArray) {
    const ul = document.createElement('ul');
    chosenTaskArray.forEach((task, i) => {
      let li = document.createElement('li');
      li.classList.add('mt-4');
      li.setAttribute('id', task.length);
      //outer Div
      let outerDiv = document.createElement('div');
      outerDiv.classList.add('flex', 'gap-2');
      // time span
      let timeSpan = document.createElement('span');
      timeSpan.classList.add(
        'w-1/4',
        'h-12',
        'bg-[#e0ebff]',
        'rounded-[7px]',
        'flex',
        'justify-center',
        'text-sm',
        'text-[#5b7a9d]',
        'font-semibold',
        'items-center'
      ); // appending time span to the outer div
      const timeNode = document.createTextNode(task.time);
      timeSpan.appendChild(timeNode);
      // inner div
      let innerDiv = document.createElement('div');
      innerDiv.classList.add(
        'w-9/12',
        'h-12',
        'bg-[#e0ebff]',
        'rounded-[7px]',
        'flex',
        'justify-start',
        'items-center',
        'px-3'
      ); // check span
      let checkSpan = document.createElement('span');
      checkSpan.classList.add(
        'w-7',
        'h-7',
        'bg-white',
        'rounded-full',
        'border',
        'border-white',
        'transition-all',
        'cursor-pointer',
        'hover:border-[#36d344]',
        'flex',
        'justify-center',
        'items-center'
      );
      checkSpan.setAttribute('id', `check${i + 1}`);
      let checkIcon = document.createElement('i');
      checkIcon.classList.add('text-white', 'fa', 'fa-check');
      innerDiv.appendChild(checkSpan);

      // p todo
      let pTodo = document.createElement('p');
      pTodo.classList.add(
        'w-full',
        'strike_none',
        'text-sm',
        'ml-4',
        'text-[#5b7a9d]',
        'font-semibold',
        'line-through',
        'flex',
        'items-center',
        'justify-between'
      );
      pTodo.setAttribute('id', `strike${i + 1}`);
      const textNode = document.createTextNode(task.content);
      pTodo.appendChild(textNode);
      innerDiv.appendChild(pTodo);
      outerDiv.appendChild(innerDiv);
      outerDiv.appendChild(timeSpan);

      const trash = document.createElement('i');
      trash.classList.add('fa', 'fa-trash', 'text-red-500', 'cursor-pointer');
      trash.setAttribute('aria-hidden', true);
      trash.addEventListener('click', () => {
        ul.removeChild(li);
        this.tasks = [...this.tasks.slice(0, i), ...this.tasks.slice(i + 1)];
        this.saveTaskInLocalStorage();
        this.render(this.tasks);
      });
      innerDiv.appendChild(trash);
      task.isCompleted === true
        ? checkSpan.classList.add('green')
        : checkSpan.classList.remove('green');
      task.isCompleted === true
        ? checkSpan.classList.add('check')
        : checkSpan.classList.remove('check');
      checkSpan.addEventListener('click', (e) => {
        e.target.classList.toggle('green');
        e.target.classList.toggle('check');
        document
          .querySelector(`#strike${i + 1}`)
          .classList.toggle('strike_none');
        task.isCompleted = !task.isCompleted;

        this.saveTaskInLocalStorage();
      });
      li.appendChild(outerDiv);
      ul.appendChild(li);
    });
    this.selectedHtmlElement.appendChild(ul);
  }

  addFilteringButtons() {
    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.classList.add(
      'my-4',
      'flex',
      'justify-evenly',
      'items-center',
      'w-full'
    );
    const buttonAllTasks = document.createElement('button');
    const buttonCompletedTasks = document.createElement('button');
    const buttonTasksToBeDone = document.createElement('button');
    buttonsWrapper.appendChild(buttonAllTasks);
    buttonsWrapper.appendChild(buttonCompletedTasks);
    buttonsWrapper.appendChild(buttonTasksToBeDone);
    buttonAllTasks.classList.add(
      'w-1/4',
      'h-12',
      'bg-[#e0ebff]',
      'rounded-[7px]',
      'flex',
      'justify-center',
      'text-sm',
      'text-[#5b7a9d]',
      'font-semibold',
      'items-center'
    );
    buttonCompletedTasks.classList.add(
      'w-1/4',
      'h-12',
      'bg-[#e0ebff]',
      'rounded-[7px]',
      'flex',
      'justify-center',
      'text-sm',
      'text-[#5b7a9d]',
      'font-semibold',
      'items-center'
    );
    buttonTasksToBeDone.classList.add(
      'w-1/4',
      'h-12',
      'bg-[#e0ebff]',
      'rounded-[7px]',
      'flex',
      'justify-center',
      'text-sm',
      'text-[#5b7a9d]',
      'font-semibold',
      'items-center'
    );
    buttonAllTasks.innerText = 'All';
    buttonCompletedTasks.innerText = 'Completed';
    buttonTasksToBeDone.innerText = 'To be done';

    buttonAllTasks.addEventListener('click', () => this.render(this.tasks));

    buttonCompletedTasks.addEventListener('click', () => {
      this.completed = this.tasks.filter((task) => task.isCompleted === true);
      console.log(this.tasks.completed);
      this.render(this.completed);
    });
    buttonTasksToBeDone.addEventListener('click', () => {
      this.toBeDone = this.tasks.filter((task) => task.isCompleted === false);
      this.render(this.toBeDone);
    });

    this.selectedHtmlElement.appendChild(buttonsWrapper);
  }

  addPromptFormForAddingTasks() {
    const title = document.createElement('p');
    title.classList.add('text-xl', 'font-semibold', 'mt-2', 'text-[#063c76]');
    title.innerHTML = 'To-do List';
    this.selectedHtmlElement.appendChild(title);

    const inputWrapper = document.createElement('div');
    inputWrapper.classList.add('flex', 'gap-2');
    const input = document.createElement('input');
    input.classList.add(
      'w-9/12',
      'h-12',
      'bg-[#e0ebff]',
      'rounded-[7px]',
      'flex',
      'justify-start',
      'items-center',
      'px-3'
    );
    input.setAttribute('type', 'text');
    input.placeholder = 'Add / Search task';
    inputWrapper.appendChild(input);

    const addTodo = document.createElement('button');
    addTodo.classList.add(
      'w-1/4',
      'h-12',
      'bg-[#e0ebff]',
      'rounded-[7px]',
      'flex',
      'justify-center',
      'text-sm',
      'text-[#5b7a9d]',
      'font-semibold',
      'items-center'
    );
    addTodo.innerHTML = 'Add Todo';
    inputWrapper.appendChild(addTodo);
    this.selectedHtmlElement.appendChild(inputWrapper);

    const sep = document.createElement('div');
    sep.classList.add('w-full', 'h-1', 'bg-[#8ea6c8]', 'mt-4');
    this.selectedHtmlElement.appendChild(sep);

    addTodo.addEventListener('click', () => this.addTaskToList(input.value));
  }

  saveTaskInLocalStorage() {
    window.localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
}

const todo = new ToDoList();
