# my-postit-app

## Guía para correr el proyecto
En Ubuntu, abrir el terminal y comprobar que node está instalado escribiendo `node` y dandole a **enter**.  
Si no esta instalado:
- Hacer `sudo apt update`, y después `sudo apt install nodejs npm`.
  
A continuación nos situamos en el directorio en el que hayamos hecho clone del github, 
o donde hayamos descomprimido el .zip.  
Una vez que estamos en el directorio **my-postit-app** realizar `npm install` para instalar las dependencias.  
Después, realizamos `npm run dev` para lanzar el proyecto.  
Por último, hacer ctrl click sobre el link o ir al navegador, escribir `http://localhost:5173/` y dar a enter.

## Descripción
Aplicación que crea postits en un lugar aleatorio de la página, con un color aleatorio.  
Para crear un post it, pulse el botón + que aparece en la esquina superior derecha.  
Una vez creado, se puede mover por la página al mantener pulsado el botón izquierdo del ratón en la parte superior del postit.  
También se puede redimensionar al hacer click y arrastrar el ratón en la esquina inferior derecha del postit.
Cuando se crea un postit, se puede escribir en él. Para editar el mensaje, hacer click en el botón del postit con un símbolo de un lápiz.  
Para eliminar un postit, hacer click en el botón con una "X".  
Los postits, sus mensajes, dimensiones y posición son almacenados en localStorage.

## Funcionalidad, UX/UI y persistencia de datos
- CRUD de los postit.
- Eventos en la interfaz.
- Diseño responsivo y accesible.
- Uso de Tailwind CSS para estilos.
- Utilización de localStorage para almacenar y recuperar datos.

