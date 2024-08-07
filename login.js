const $submit = document.getElementById("submit"),
  $password = document.getElementById("password"),
  $username = document.getElementById("username"),
  $visible = document.getElementById("visible");

document.addEventListener("change", (e) => {
  if (e.target === $visible) {
    if ($visible.checked === false) $password.type = "password";
    else $password.type = "text";
  }
});

document.addEventListener("click", (e) => {
  if (e.target === $submit) {
    e.preventDefault();
    const usernameValue = $username.value;
    const passwordValue = $password.value;


    if (usernameValue === "admin" && passwordValue === "12345") {
      alert("Ingresaste correctamente");
      window.location.href = "indexAdmin.html";
    } else if (usernameValue === "clientes" && passwordValue === "1234") {

      alert("Ingresaste correctamente");
      window.location.href = "indexClientes.html";
    } else {
        alert("Usuario o contraseña incorrectos");
    }
  }
});

