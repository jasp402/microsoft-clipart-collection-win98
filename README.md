# Microsoft Clipart Collection - Win98

Microsoft Clipart Collection - Win98 | MC Office 98

Descripción
----------
Colección de clipart estilo Windows 98 / Microsoft Office 98. Proyecto frontend en TypeScript que muestra la galería de imágenes/clips.

Vista previa
-----------
![Captura del home](assets/home.png)

(La imagen anterior debe estar en `assets/home.png` dentro del repositorio. Si prefieres usar una URL pública, reemplaza `assets/home.png` por la URL.)

Publicación con GitHub Pages (despliegue automático)
--------------------------------------------------
Este repositorio incluye un workflow de GitHub Actions que construye el proyecto (si existe un script de build) y despliega el resultado en GitHub Pages automáticamente cada vez que haces push a la rama `main`.

El workflow busca en este orden una carpeta para publicar: `dist`, `build`, `docs`. Si ninguna existe subirá la raíz del repositorio.

Instalación y ejecución local
-----------------------------
1. Clona el repositorio:
   git clone https://github.com/jasp402/microsoft-clipart-collection-win98.git
2. Entra en la carpeta del proyecto:
   cd microsoft-clipart-collection-win98
3. Instala dependencias (si usas npm):
   npm install
4. Ejecuta en modo desarrollo (ajusta el comando según el proyecto):
   npm run dev
   o
   npm start

Notas sobre el workflow
----------------------
- El workflow ejecuta `npm ci` y `npm run build` si detecta un `package.json`.
- Asegúrate de que el comando `build` genere una carpeta `dist` o `build`, o coloca los archivos finales en `docs/`.
- Si no hay build, el workflow publicará la carpeta `docs/` o, como último recurso, la raíz del repo.

Cómo añadir la imagen del home
------------------------------
- Opción A (subir al repo): coloca la captura como `assets/home.png`. El README ya la referencia.
- Opción B (URL pública): sube la imagen a un host y reemplaza la ruta en la línea `![Captura del home](assets/home.png)` por la URL.

Contribuir
----------
Si quieres mejorar el README o la documentación de la colección, abre un PR o añade un issue con lo que quieras cambiar.

Licencia
--------
Añade la licencia que prefieras (por ejemplo MIT) en un archivo `LICENSE`.
