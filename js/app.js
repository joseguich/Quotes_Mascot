//function global
const log = log => console.log(log);
const $ = selector => document.querySelector(selector);
const $createElement = create => document.createElement(create);


//Seletioning the element of the HTML
const mascot = $('#mascota');
const proprietor = $('#propietario');
const telephone = $('#telefono');
const date = $('#fecha');
const hour = $('#hora')
const symptoms = $('#sintomas');
const form = $('#nueva-cita');
const listQuotes = $('#citas');
let editting;


//Object information quotes
const dateQuotePatient = {

    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: '',
}

//Add Event Listener
logEventListener();
function logEventListener() {
    mascot.addEventListener('blur', valitedDate);
    proprietor.addEventListener('blur', valitedDate);
    telephone.addEventListener('blur', valitedDate);
    date.addEventListener('blur', valitedDate);
    hour.addEventListener('blur', valitedDate);
    symptoms.addEventListener('blur', valitedDate);

    //Valited form
    form.addEventListener('submit', addQuotes);

}


// class
class AdministrationQuotes {
    constructor() {
        this.quotes = [];
    }

    //Create the method for add the copy of the object quotes
    newQuotes(quote) {
        this.quotes = [...this.quotes, quote];
    }

    //REMOVE QUOETES 
    removeQuotes(quote) {
        this.quotes = this.quotes.filter(removeQuoete => removeQuoete.id !== quote);
    }

    //Apdate quotes
    editQuotes(apdateQuote){
        this.quotes = this.quotes.map(quote => quote.id === apdateQuote.id ? apdateQuote : quote);
    }
}

class UI {

    showAlert(message, type) {

        //Call the method of remove alert previous
        this.removeAlertPreviuos();

        //Create element for show alert from error or exict
        const messageAlert = $createElement('P');
        messageAlert.className = 'text-center text-uppercase text-white fw-semibold alert remove';

        //Validation alert error 
        if (type === 'error') {
            messageAlert.classList.add('bg-danger', 'animate__bounceIn');
        } else {
            messageAlert.classList.add('bg-success', 'animate__rotateInDownLeft');
        }

        //Show message de alert
        messageAlert.textContent = message;

        //Insertting  to alert in the HTML
        const insertAlert = $('.container');
        insertAlert.insertBefore(messageAlert, document.querySelector('#contenido'))

        //Delete alert after of 5 second
        setTimeout(() => {
            messageAlert.remove();
        }, 3000);
    }

    //Delet alert previuos
    removeAlertPreviuos() {
        const removeAlert = $('.remove');
        if (removeAlert !== null) {
            removeAlert.remove();
        }
    }

    //Show the patient in the HTML of quotes
    showQuotes({ quotes }) {

        //Clean 
        this.clean();

        //Scroll through the array of citations and display it in the HTML.
        quotes.forEach(quote => {
            const { mascota, propietario, telefono, fecha, hora, sintomas, id } = quote;
            // Created element to display in the HMTL
            const contentQuotes = $createElement('div');
            contentQuotes.className = 'cita p-2 ';
            contentQuotes.dataset.id = id;

            //Mascot
            const textMascot = $createElement('h2');
            textMascot.classList.add('font-weight-bold');
            textMascot.textContent = mascota;

            //Proprietor
            const textProprietor = $createElement('p');
            textProprietor.innerHTML = `
                <span class ="font-weight-bold">Propietario:</span> ${propietario}
            `;
            //Telephone
            const textTelephone = $createElement('p');
            textTelephone.innerHTML = `
                <span class ="font-weight-bold">Telefono:</span> ${telefono}
            `;
            //Date
            const textDate = $createElement('p');
            textDate.innerHTML = `
                <span class ="font-weight-bold">Fecha:</span> ${formatDate(fecha)}
            `;
            //Hour
            const textHour = $createElement('p');
            textHour.innerHTML = `
                <span class ="font-weight-bold">Hora:</span> ${hora}
            `;
            //Symptoms
            const textSymptoms = $createElement('p');
            textSymptoms.innerHTML = `
                <span class ="font-weight-bold">Sintomas:</span> ${sintomas}
            `;

            //Delete button the quotes
            const deleteQuotes = $createElement('button');
            deleteQuotes.classList.add('btn', 'btn-danger');
            deleteQuotes.innerHTML = `<span> Borrar <i class='bx bxs-trash'></i> </span>`;

            deleteQuotes.onclick = () => {
                removeQuotes(id);
            }

            //Created the button the edition quote
            const editionQuote = $createElement('button');
            editionQuote.classList.add('btn', 'btn-info', 'mx-2');
            editionQuote.innerHTML = `  <span> Edition <i class='bx bxs-edit-alt'></i> </span>`;
            editionQuote.onclick = () => modifyEdit(quote);


            //Insert in the content of quotes
            //Mascot
            contentQuotes.appendChild(textMascot);
            //Proprietor
            contentQuotes.appendChild(textProprietor);
            //Telephone
            contentQuotes.appendChild(textTelephone);
            //Date
            contentQuotes.appendChild(textDate);
            //Hour
            contentQuotes.appendChild(textHour);
            //Symptoms
            contentQuotes.appendChild(textSymptoms);
            //Delete button
            contentQuotes.appendChild(deleteQuotes);
            //Edition button
            contentQuotes.appendChild(editionQuote);
            //Insert quotes in the HTML
            listQuotes.appendChild(contentQuotes);
        });

    }

    //Clean content of children previuos
    clean() {
        while (listQuotes.firstChild) {
            listQuotes.removeChild(listQuotes.firstChild);
        }
    }

    //Reset the object
    resetOBJ() {
        dateQuotePatient.mascota = "";
        dateQuotePatient.propietario = "";
        dateQuotePatient.telefono = "";
        dateQuotePatient.fecha = "";
        dateQuotePatient.hora = "";
        dateQuotePatient.sintomas = "";
    }
}

//Instance

// Quotes
const administrationQuotes = new AdministrationQuotes();

//User
const ui = new UI();

//Functions

//ADD DATE TO OBJECT OF QUOTES
function valitedDate(e) {

    //Validation of  the input corresponding
    dateQuotePatient[e.target.name] = e.target.value;
}

//Add quotes
function addQuotes(e) {
    e.preventDefault();

    //Extract information from object of quotes
    //Destructuring
    const { mascota, propietario, telefono, fecha, hora, sintomas } = dateQuotePatient;

    //Validation the field patient
    if (mascota.trim() === "" || propietario.trim() === "" || telefono.trim() === "" || fecha === "" || hora === "" || sintomas.trim() === "") {
        ui.showAlert('The fields are required', 'error');
        return;
    }else if(isNaN(telefono)){
        ui.showAlert('Only Number in the field telephone', 'error');
        return;
    }

    if (editting) {
        ui.showAlert('Edited correctly');

        //Modify button stactu normal
        form.querySelector('button[type = "submit"]').textContent = 'Crear Cita';

        // Pasarle object the at quotes in edition
        administrationQuotes.editQuotes({...dateQuotePatient})

        editting = false;

    } else {

        //Generate a unique id for the object
        dateQuotePatient.id = Date.now();

        //Add in the array the object
        administrationQuotes.newQuotes({ ...dateQuotePatient }); //To not rewrite to the created object, it would be to make a copy.

        //Show alert the message the exict
        ui.showAlert('Quote created correctly');
    }

    //Show quotes
    ui.showQuotes(administrationQuotes);

    //Resetting the object of quotes
    ui.resetOBJ();

    //Show alert the exict
    // ui.showAlert('New quote add correctting');

    //Resetting the form
    form.reset();

}

function removeQuotes(id) {
    //DELETE THE QUOTE
    administrationQuotes.removeQuotes(id);
    //Refresh the quotes
    ui.showQuotes(administrationQuotes);

    //Alert the remove correctting
    ui.showAlert('Quote delete correctting!');

}

function modifyEdit(quote) {

    //Cargar los datos
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = quote;

    //Fill the input
    mascot.value = mascota;
    proprietor.value = propietario;
    telephone.value = telefono;
    date.value = fecha;
    hour.value = hora;
    symptoms.value = sintomas;

    //Change text the button 
    form.querySelector('button[type = "submit"]').textContent = 'Guardar Modificacion';

    editting = true;

    //Object the quotes
    dateQuotePatient.mascota = mascota;
    dateQuotePatient.propietario = propietario;
    dateQuotePatient.telefono = telefono;
    dateQuotePatient.fecha = fecha;
    dateQuotePatient.hora = hora;
    dateQuotePatient.sintomas = sintomas;
    dateQuotePatient.id = id;
}

function formatDate(date) {
    //moment().locale();
    return date = moment().format('LL');
}



