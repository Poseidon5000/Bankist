'use strict';

/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Goodnews Okon',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Blessing Peters',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Ediomo Ekpenyong',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'UyaiAbasi Etuk',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const displayMovements = function(movements){
containerMovements.innerHTML = " "

  movements.forEach((mov, i) => {
    const type = mov>0 ? 'deposit' : 'withdrawal'
    
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}€</div>
  </div>`


  containerMovements.insertAdjacentHTML("afterbegin", html)
  });
}

// displayMovements(account1.movements)


 const calcDisplayBalance = function(acc){
    acc.balance =acc. movements.reduce((acc, mov) => acc + mov, 0)
    labelBalance.textContent = `${acc.balance} €`
 }

//  calcDisplayBalance(account1.movements);


 const calcDisplaySummary = function(arr){
  const incomes = arr.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0)
  labelSumIn.textContent = `${incomes} €`;

  const out = arr.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)} €`;

  const interest = arr.movements.filter(mov => mov > 0).map(deposit => (deposit * arr.interestRate) / 100).filter(int=> int >= 1).reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest} €`;
 }

//  calcDisplaySummary(account1.movements)



const userNames = (accs) =>{
  accs.forEach(function(acc){
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('')
  })
}

userNames(accounts)

const updateInterface = function(acc){
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
}

//implementing login

let currentAccount;
let timer;

btnLogin.addEventListener('click', function(e){
  e.preventDefault();

  //find the account
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)
  if(!currentAccount) alert('Invalid username');
  else if(currentAccount.pin !== Number(inputLoginPin.value)) alert('Invalid pin');
  else{
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();


    updateInterface(currentAccount)

    if(timer) clearInterval(timer)
    timer = startTimer()

   
  }
  
})

//Implementing timer

const startTimer = function(){
  let time = 120;

  const tick = function(){
  let min = String(Math.trunc(time/60)).padStart(2, 0);
  let sec = String(Math.trunc(time%60)).padStart(2, 0);
    

    labelTimer.textContent = `${min}:${sec}`


    if(time == 0){
      clearInterval(timer)
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log in to get started`

    }

    time--
  }
  
  tick()
 
  const timer = setInterval(tick, 1000)

  return timer
}


// Implementing transfers

btnTransfer.addEventListener("click", function(e){
e.preventDefault()

  const amount =Number(inputTransferAmount.value)
  const receiverAcc = accounts.find((acc)=> acc.username == inputTransferTo.value );

  if(!receiverAcc)alert("Please input transfer account");
  else if(!amount)alert("Please input transfer amount");
  else if(amount < 0)alert("Transfer has to greater than 0");
  else if(amount > currentAccount.balance)alert("Transfer amount cannot be higher than account balance");
  else if (receiverAcc.username == currentAccount.username)alert("Cannot transfer to same account")


else{
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateInterface(currentAccount)
  }

  inputTransferAmount.value = inputTransferTo.value = ""

})

btnLoan.addEventListener("click", function(e){
  e.preventDefault()

  console.log("hello");

  const amount = Number(inputLoanAmount.value)
  console.log(amount);

  if(amount > 0 && currentAccount.movements.some((mov => mov >= amount * 0.3))){
    currentAccount.movements.push(amount);

    updateInterface(currentAccount)
  }
  inputLoanAmount.value = ""
})



btnClose.addEventListener("click", function(e){
  e.preventDefault();

  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value)=== currentAccount.pin){
    const index = accounts.findIndex(acc => acc.username === currentAccount.username)
    accounts.splice(index, 1)
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`
  }
  inputCloseUsername.value = inputCloseUsername.value = ""
})




