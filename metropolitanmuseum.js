// CAPTURAR ELEMENTOS DEL DOM

const btnCargar = document.getElementById("btnCargar");

const contenedor = document.getElementById("museo-contenedor");

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

    //obtener solamente los primeros 58 IDs

    const listaObras = datos.objectIDs.slice(0, 58);

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
        "bg-slate-800 border border-blue-600 rounded-lg p-4 text-center shadow-lg";

      //crear imagen

      const imagen = document.createElement("img");

      imagen.src = obra.primaryImageSmall;

      imagen.alt = obra.title;

      imagen.className =
        "w-40 h-40 mx-auto object-cover rounded cursor-pointer hover:scale-110 transition";

      //crear número

      const numero = document.createElement("span");

      numero.className = "text-xs font-bold text-white block mt-3";

      numero.textContent = "#" + obra.objectID;

      //crear título

      const titulo = document.createElement("h2");

      titulo.className = "text-lg font-bold text-white mt-2";

      titulo.textContent = obra.title;

      //crear artista

      const artista = document.createElement("p");

      artista.className = "text-yellow-400 text-sm";

      artista.textContent = obra.artistDisplayName || "Artista desconocido";

      //agregar elementos

      tarjeta.appendChild(imagen);

      tarjeta.appendChild(numero);

      tarjeta.appendChild(titulo);

      tarjeta.appendChild(artista);

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

// EVENTO BOTÓN CARGAR

btnCargar.addEventListener("click", obtenerMuseo);
