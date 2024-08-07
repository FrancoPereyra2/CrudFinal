document.addEventListener('DOMContentLoaded', function () {
    ReadData();

    document.getElementById('inputPaymentMethod').addEventListener('change', function () {
        var paymentMethod = this.value;
        var installmentsGroup = document.getElementById('installmentsGroup');
        installmentsGroup.style.display = paymentMethod === 'tarjeta' ? 'block' : 'none';
    });

    document.getElementById('btnAdd').addEventListener('click', AddData);

    document.getElementById('btnUpdate').addEventListener('click', function() {
        let index = this.getAttribute('data-index');
        UpdateData(index);
    });

    window.addEventListener('storage', function(event) {
        if (event.key === 'listPeople') {
            ReadData();
        }
    });
});

function ValidateForm() {
    let name = document.getElementById('inputName').value;
    let email = document.getElementById('inputEmail').value;
    let telefono = document.getElementById('ImputNumero').value;
    let Ingreso = document.getElementById('ImputIngreso').value;
    let Salida = document.getElementById('ImputSalida').value;
    let paymentMethod = document.getElementById('inputPaymentMethod').value;
    let roomType = document.getElementById('inputRoomType').value;

    if (!name) {
        alert('Debe agregar un nombre');
        return false;
    }

    if (!email) {
        alert('El campo correo es requerido');
        return false;
    } else if (!email.includes('@')) {
        alert('El correo no es valido');
        return false;
    }

    if (!telefono) {
        alert('El campo telefono es requerido');
        return false;
    }

    if (!Ingreso) {
        alert('Debe Agregar una Fecha de Ingreso');
        return false;
    }

    if (!Salida) {
        alert('Debe Agregar una Fecha de Salida');
        return false;
    }

    if (new Date(Salida) < new Date(Ingreso)) {
        alert('La fecha de salida no puede ser antes de la fecha de ingreso');
        return false;
    }

    if (!paymentMethod) {
        alert('Debe seleccionar una forma de pago');
        return false;
    }

    if (!roomType) {
        alert('Debe seleccionar un tipo de habitación');
        return false;
    }

    return true;
}

function ReadData() {
    let listPeople = JSON.parse(localStorage.getItem('listPeople')) || [];
    let html = "";

    listPeople.forEach(function (element, index) {
        html += "<tr>";
        html += "<td>" + element.name + "</td>";
        html += "<td>" + element.email + "</td>";
        html += "<td>" + element.telefono + "</td>";
        html += "<td>" + element.Ingreso + "</td>";
        html += "<td>" + element.Salida + "</td>";
        html += "<td>" + element.paymentMethod + "</td>";
        html += "<td>" + (element.paymentMethod === 'tarjeta' ? element.installments : '-') + "</td>";
        html += "<td>" + element.roomType + "</td>";
        html += "<td>$" + element.totalPrice.toFixed(2) + "</td>";
        html += '<td><div class="btn-container"><button onclick="deleteData(' + index + ')" class="btn btn-danger mx-2">Eliminar</button><button onclick="loadDataForEdit(' + index + ')" class="btn btn-warning">Editar</button></div></td>';
        html += "</tr>";
    });

    document.querySelector('#tableData tbody').innerHTML = html;
}


function AddData() {
    if (ValidateForm()) {
        if (confirm('¿Está seguro de que desea guardar la reserva?')) {
            let name = document.getElementById('inputName').value;
            let email = document.getElementById('inputEmail').value;
            let telefono = document.getElementById('ImputNumero').value;
            let Ingreso = document.getElementById('ImputIngreso').value;
            let Salida = document.getElementById('ImputSalida').value;
            let paymentMethod = document.getElementById('inputPaymentMethod').value;
            let roomType = document.getElementById('inputRoomType').value;
            let installments = paymentMethod === 'tarjeta' ? document.getElementById('inputInstallments').value : null;
            let totalPrice = calculatePrice(roomType, paymentMethod, installments);

            let listPeople = JSON.parse(localStorage.getItem('listPeople')) || [];

            listPeople.push({
                name: name,
                email: email,
                telefono: telefono,
                Ingreso: Ingreso,
                Salida: Salida,
                paymentMethod: paymentMethod,
                installments: installments,
                roomType: roomType,
                totalPrice: totalPrice
            });

            localStorage.setItem('listPeople', JSON.stringify(listPeople));
            ReadData();

            document.getElementById('reservationForm').reset();
            document.getElementById('installmentsGroup').style.display = 'none';
        }
    }
}

function deleteData(index) {
    let listPeople = JSON.parse(localStorage.getItem('listPeople')) || [];
    listPeople.splice(index, 1);
    localStorage.setItem('listPeople', JSON.stringify(listPeople));
    ReadData();
}

function loadDataForEdit(index) {
    let listPeople = JSON.parse(localStorage.getItem('listPeople')) || [];
    document.getElementById('inputName').value = listPeople[index].name;
    document.getElementById('inputEmail').value = listPeople[index].email;
    document.getElementById('ImputNumero').value = listPeople[index].telefono;
    document.getElementById('ImputIngreso').value = listPeople[index].Ingreso;
    document.getElementById('ImputSalida').value = listPeople[index].Salida;
    document.getElementById('inputPaymentMethod').value = listPeople[index].paymentMethod;
    document.getElementById('inputRoomType').value = listPeople[index].roomType;

    if (listPeople[index].paymentMethod === 'tarjeta') {
        document.getElementById('installmentsGroup').style.display = 'block';
        document.getElementById('inputInstallments').value = listPeople[index].installments;
    } else {
        document.getElementById('installmentsGroup').style.display = 'none';
    }

    document.getElementById('btnUpdate').style.display = 'block';
    document.getElementById('btnAdd').style.display = 'none';
    document.getElementById('btnUpdate').setAttribute('data-index', index);
}

function UpdateData(index) {
    let listPeople = JSON.parse(localStorage.getItem('listPeople')) || [];
    listPeople[index].name = document.getElementById('inputName').value;
    listPeople[index].email = document.getElementById('inputEmail').value;
    listPeople[index].telefono = document.getElementById('ImputNumero').value;
    listPeople[index].Ingreso = document.getElementById('ImputIngreso').value;
    listPeople[index].Salida = document.getElementById('ImputSalida').value;
    listPeople[index].paymentMethod = document.getElementById('inputPaymentMethod').value;
    listPeople[index].roomType = document.getElementById('inputRoomType').value;
    listPeople[index].installments = listPeople[index].paymentMethod === 'tarjeta' ? document.getElementById('inputInstallments').value : null;
    listPeople[index].totalPrice = calculatePrice(listPeople[index].roomType, listPeople[index].paymentMethod, listPeople[index].installments);

    localStorage.setItem('listPeople', JSON.stringify(listPeople));
    ReadData();

    document.getElementById('reservationForm').reset();
    document.getElementById('installmentsGroup').style.display = 'none';
    document.getElementById('btnUpdate').style.display = 'none';
    document.getElementById('btnAdd').style.display = 'block';
}

function calculatePrice(roomType, paymentMethod, installments) {
    let price;
    switch (roomType) {
        case "deluxe":
            price = 400;
            break;
        case "normal":
            price = 150;
            break;
        case "parejas":
            price = 140;
            break;
        default:
            price = 0;
            break;
    }

    if (paymentMethod === 'tarjeta' && installments) {
        installments = parseInt(installments) || 1;
        price += price * 0.05 * installments; // 5% de interés por cada cuota
    }

    return price;
}
