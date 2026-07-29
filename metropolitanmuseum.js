// CAPTURAR ELEMENTOS DEL DOM

const btnCargar = document.getElementById("btnCargar");

const btnFavoritos = document.getElementById("btnFavoritos");

const contenedor = document.getElementById("museo-contenedor");

const btnModoOscuro = document.getElementById("btnModoOscuro");

const txtBuscar = document.getElementById("txtBuscar");

// FAVORITOS

// Cargar favoritos guardados
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

// FUNCIÓN PARA OBTENER LAS OBRAS

async function obtenerMuseo() {
  try {
    //mensaje mientras carga

    contenedor.innerHTML = `
      <p class="text-center col-span-full font-bold
      text-blue-500 animate-pulse text-xl">

      Conectando al servidor...

      </p>
    `;

    //consumir API

    const respuesta = await fetch(
      "https://collectionapi.metmuseum.org/public/collection/v1/objects",
    );

    //validar respuesta

    if (!respuesta.ok) {
      throw new Error("El servidor no responde");
    }

    //convertir respuesta a JSON

    const datos = await respuesta.json();

    //obtener solamente los primeros 70 IDs

    const listaObras = datos.objectIDs.slice(0, 70);

    //limpiar contenedor

    contenedor.innerHTML = "";

    console.log("Datos recibidos:", listaObras);

    //recorrer IDs

    for (let i = 0; i < listaObras.length; i++) {
      const id = listaObras[i];

      //consultar detalle de la obra

      const respuestaDetalle = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`,
      );

      const obra = await respuestaDetalle.json();

      //si no tiene imagen no se muestra

      if (!obra.primaryImageSmall) {
        continue;
      }

      //crear tarjeta

      const tarjeta = document.createElement("div");

      tarjeta.className =
        "bg-amber-900 border border-yellow-600 rounded-lg p-4 text-center shadow-lg";

      tarjeta.classList.add("tarjetaMuseo");

      //crear imagen

      const imagen = document.createElement("img");

      imagen.src = obra.primaryImageSmall;

      imagen.alt = obra.title;

      imagen.className =
        "w-40 h-40 mx-auto object-cover rounded cursor-pointer hover:scale-110 transition brightness-90 contrast-110 saturate-125";

      //crear número

      const numero = document.createElement("span");

      numero.className = "text-xs font-bold block mt-3";

      numero.textContent = "#" + obra.objectID;

      //crear título

      const titulo = document.createElement("h2");

      titulo.className = "text-lg font-bold mt-2";

      titulo.textContent = obra.title;

      //crear artista

      const artista = document.createElement("p");

      artista.className = "text-yellow-400 text-sm";

      artista.textContent = obra.artistDisplayName || "Artista desconocido";

      // Guardar datos para la búsqueda

      tarjeta.dataset.titulo = obra.title.toLowerCase();

      tarjeta.dataset.artista = (obra.artistDisplayName || "").toLowerCase();

      // Crear botón Favorito

      const btnFavorito = document.createElement("button");

      btnFavorito.className =
        "bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded mt-3";

      btnFavorito.textContent = "❤️ Favorito";

      btnFavorito.addEventListener("click", () => {
        // Verificar si la obra ya está en favoritos

        if (!favoritos.includes(obra.objectID)) {
          favoritos.push(obra.objectID);

          localStorage.setItem("favoritos", JSON.stringify(favoritos));

          alert("Obra agregada a favoritos");
        } else {
          alert("Esta obra ya está en favoritos");
        }
      });

      //agregar elementos

      tarjeta.appendChild(imagen);

      tarjeta.appendChild(numero);

      tarjeta.appendChild(titulo);

      tarjeta.appendChild(artista);

      tarjeta.appendChild(btnFavorito);

      //evento click en imagen

      imagen.addEventListener("click", () => {
        mostrarDetalle(obra);
      });

      //mostrar tarjeta

      contenedor.appendChild(tarjeta);
    }
  } catch (error) {
    contenedor.innerHTML = `
    
      <p class="text-center text-red-500 text-xl font-bold">

      Error al cargar las obras.

      </p>

    `;

    console.error(error);
  }
}

// MOSTRAR FAVORITOS

async function mostrarFavoritos() {
  // Limpiar el contenedor
  contenedor.innerHTML = "";

  // Si no hay favoritos
  if (favoritos.length === 0) {
    contenedor.innerHTML = `
      <p class="text-center text-red-500 text-2xl font-bold">
        No tienes obras favoritas.
      </p>
    `;
    return;
  }

  // Recorrer favoritos
  for (let i = 0; i < favoritos.length; i++) {
    const id = favoritos[i];

    const respuesta = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`,
    );

    const obra = await respuesta.json();

    // Crear tarjeta

    const tarjeta = document.createElement("div");

    tarjeta.className =
      "bg-amber-900 border border-yellow-600 rounded-lg p-4 text-center shadow-lg";

    tarjeta.classList.add("tarjetaMuseo");

    // Crear imagen

    const imagen = document.createElement("img");

    imagen.src = obra.primaryImageSmall;

    imagen.alt = obra.title;

    imagen.className =
      "w-40 h-40 mx-auto object-cover rounded cursor-pointer hover:scale-110 transition brightness-90 contrast-110 saturate-125";

    // Crear número

    const numero = document.createElement("span");

    numero.className = "text-xs font-bold block mt-3";

    numero.textContent = "#" + obra.objectID;

    // Crear título

    const titulo = document.createElement("h2");

    titulo.className = "text-lg font-bold mt-2";

    titulo.textContent = obra.title;

    // Crear artista

    const artista = document.createElement("p");

    artista.className = "text-yellow-400 text-sm";

    artista.textContent = obra.artistDisplayName || "Artista desconocido";

    // Botón Favorito

    const btnFavorito = document.createElement("button");

    btnFavorito.className =
      "bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded mt-3";

    btnFavorito.textContent = "❤️ Favorito";

    // Agregar elementos

    tarjeta.appendChild(imagen);

    tarjeta.appendChild(numero);

    tarjeta.appendChild(titulo);

    tarjeta.appendChild(artista);

    tarjeta.appendChild(btnFavorito);

    // Abrir modal

    imagen.addEventListener("click", () => {
      mostrarDetalle(obra);
    });

    // Mostrar tarjeta

    contenedor.appendChild(tarjeta);
  }
}

// MOSTRAR MODAL

function mostrarDetalle(obra) {
  const modal = document.getElementById("modal");

  const detalle = document.getElementById("detalle");

  detalle.innerHTML = `

    <img
      src="${obra.primaryImageSmall}"
      class="w-60 h-60 object-cover rounded mx-auto">

    <h2 class="text-3xl font-bold text-center mt-4 text-blue-600">

      ${obra.title}

    </h2>

    <div class="mt-6 space-y-2">

      <p>

        <strong>ID:</strong>

        ${obra.objectID}

      </p>

      <p>

        <strong>Artista:</strong>

        ${obra.artistDisplayName || "No disponible"}

      </p>

      <p>

        <strong>Fecha:</strong>

        ${obra.objectDate || "No disponible"}

      </p>

      <p>

        <strong>Departamento:</strong>

        ${obra.department || "No disponible"}

      </p>

      <p>

        <strong>País:</strong>

        ${obra.country || "No disponible"}

      </p>

      <p>

        <strong>Cultura:</strong>

        ${obra.culture || "No disponible"}

      </p>

      <p>

        <strong>Material:</strong>

        ${obra.medium || "No disponible"}

      </p>

    </div>

  `;

  //mostrar modal

  modal.classList.remove("hidden");

  modal.classList.add("flex");
}

// BOTÓN CERRAR MODAL

const btnCerrar = document.getElementById("btnCerrar");

const modal = document.getElementById("modal");

btnCerrar.addEventListener("click", () => {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
});

//cerrar haciendo clic fuera del modal

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
});

// MODO OSCURO

btnModoOscuro.addEventListener("click", () => {
  document.body.classList.toggle("bg-white");
  document.body.classList.toggle("text-black");

  document.body.classList.toggle("bg-slate-900");
  document.body.classList.toggle("text-slate-100");

  if (document.body.classList.contains("bg-slate-900")) {
    localStorage.setItem("modo", "oscuro");
  } else {
    localStorage.setItem("modo", "claro");
  }
});

// EVENTO BOTÓN CARGAR

btnCargar.addEventListener("click", obtenerMuseo);

// BÚSQUEDA LOCAL

txtBuscar.addEventListener("keyup", () => {
  const texto = txtBuscar.value.toLowerCase();

  const tarjetas = document.querySelectorAll(".tarjetaMuseo");

  tarjetas.forEach((tarjeta) => {
    const titulo = tarjeta.dataset.titulo;

    const artista = tarjeta.dataset.artista;

    if (titulo.includes(texto) || artista.includes(texto)) {
      tarjeta.style.display = "block";
    } else {
      tarjeta.style.display = "none";
    }
  });
});

// EVENTO BOTÓN FAVORITOS

btnFavoritos.addEventListener("click", mostrarFavoritos);
