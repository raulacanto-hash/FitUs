# Poner FitTrack en línea con Firebase

## Estado de este proyecto

- **Proyecto:** `fitus-ccbd7`
- **URL publicada:** https://fitus-ccbd7.web.app
- **Firestore:** base de datos creada y reglas desplegadas.
- **Autenticación:** proveedor de Google habilitado.
- **Hosting:** desplegado.

La app ya está en línea. Esta guía queda como referencia para volver a desplegar o configurar otro proyecto.

Esta guía deja la app publicada en una URL `https://TU-PROYECTO.web.app` y sincroniza automáticamente el historial, las rutinas, las medidas y el perfil con Firestore.

La app usa:

- **Firebase Authentication** con Google.
- **Cloud Firestore** para guardar los datos de cada usuario.
- **Firebase Hosting** para publicar la web.

## 1. Añadir la app web al proyecto

1. Entra a [Firebase Console](https://console.firebase.google.com/) y abre tu proyecto.
2. Ve a **Configuración del proyecto → General → Tus apps**.
3. Pulsa el icono **Web** (`</>`) para registrar una app.
4. Copia los valores de `firebaseConfig`.

Crea un archivo `.env.local` en la carpeta `FitUs` (junto a `package.json`):

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Puedes usar `.env.example` como plantilla. `.env.local` está ignorado por Git y no se sube al repositorio.

> La configuración web de Firebase no es un secreto: la seguridad real la dan las reglas de Firestore. Aun así, no publiques claves de administración ni archivos de cuenta de servicio.

## 2. Activar el inicio de sesión con Google

1. Ve a **Authentication → Sign-in method**.
2. Pulsa **Agregar proveedor → Google**.
3. Actívalo, elige un correo de soporte y guarda.

Si al iniciar sesión Google muestra **"Acceso bloqueado"** o la app aparece como no verificada, entra a [Google Cloud Console](https://console.cloud.google.com/) → **APIs y servicios → Pantalla de consentimiento OAuth** y añade tu correo como **usuario de prueba** (o publica la app si quieres que cualquiera pueda entrar).

### Origen autorizado para el botón de Google

La app usa **Google Identity Services** para iniciar sesión sin salir de la app. Ese botón necesita que el dominio esté autorizado como **origen JavaScript**:

1. Entra a [Credenciales de Google Cloud](https://console.cloud.google.com/apis/credentials?project=fitus-ccbd7).
2. Abre el cliente **Web client (auto created by Google Service)**.
3. En **Orígenes JavaScript autorizados**, añade:
   - `https://fitus-ccbd7.web.app`
   - `http://localhost:3000` (para desarrollo)
4. Guarda y espera unos minutos.

Si Google muestra `origin_mismatch`, falta este paso.

## 3. Crear Firestore y aplicar las reglas

1. Ve a **Firestore Database → Crear base de datos**.
2. Elige **Modo de producción** y una ubicación cercana.
3. En la pestaña **Reglas**, pega el contenido de [`firestore.rules`](firestore.rules) y publica.

Las reglas permiten que cada usuario lea y escriba únicamente sus propios datos:

```text
users/{uid}
users/{uid}/workouts/{workoutId}
```

También puedes desplegarlas por CLI:

```bash
npm run deploy:rules
```

## 4. Autorizar los dominios de inicio de sesión

En **Authentication → Settings → Authorized domains** deben aparecer:

- `localhost` (para desarrollo)
- `TU-PROYECTO.web.app`
- `TU-PROYECTO.firebaseapp.com`
- Tu dominio personalizado, si añades uno

Sin esto, Google devolverá `auth/unauthorized-domain`.

## 5. Probar en local

```bash
cd FitUs
npm install
npm run dev
```

Abre `http://localhost:3000`. Debería aparecer la pantalla **"Tu progreso, siempre contigo"** con el botón de Google.

Al iniciar sesión:

- Si es la primera vez, se sube el historial que ya tengas en `localStorage`.
- Si ya hay datos en la nube, se combinan con los locales.
- A partir de ahí, cada cambio se guarda en Firestore automáticamente.

Puedes comprobar la sincronización en **Ajustes → Cuenta y Sincronización**.

## 6. Publicar en Firebase Hosting

```bash
cd FitUs
npm run firebase:login
npm run firebase:use
npm run deploy
```

- `firebase:login` abre el navegador para autenticar la CLI.
- `firebase:use` te permite elegir el proyecto y crea `.firebaserc`.
- `deploy` compila la app, publica Hosting y despliega las reglas de Firestore.

La URL final será:

```text
https://TU-PROYECTO.web.app
```

## 7. Instalarla en el móvil o escritorio

La app ya incluye `manifest.webmanifest`, iconos y service worker.

- **Android/Chrome:** abre la URL → menú → **Instalar aplicación**.
- **iPhone/Safari:** Compartir → **Agregar a pantalla de inicio**.
- **Windows/Mac (Chrome/Edge):** icono de instalar en la barra de direcciones.

La app instalada abre en modo standalone. Necesita conexión para cargar desde la nube; si ya está abierta y se queda sin internet, los cambios se guardan localmente y se reintentan al recuperar la conexión.

## Cómo se guardan los datos

- `users/{uid}`: perfil, rutina actual, plantillas, ejercicios personalizados, pesajes y medidas.
- `users/{uid}/workouts/{workoutId}`: un documento por entrenamiento del historial.

Esto evita el límite de 1 MiB por documento de Firestore y permite crecer durante años.

## Notas importantes

- **Primer inicio de sesión:** si ya usabas la app sin cuenta, tu historial local se fusiona con el de la nube. Si aparecen los entrenamientos de ejemplo, bórralos manualmente una vez.
- **Cambio de cuenta:** si en el mismo navegador inicias sesión con otra cuenta, la app limpia los datos locales de la cuenta anterior antes de cargar la nueva.
- **Cerrar sesión:** los datos permanecen en Firestore. Al volver a entrar con la misma cuenta se recuperan.
- **Borrar todo:** la opción de Ajustes borra los datos locales y, con la sincronización activa, también los de la nube. Úsala solo si estás seguro.
- **Respaldo adicional:** la exportación/importación JSON de Ajustes sigue funcionando.

## Migrar tu historial actual

El historial de `localStorage` pertenece al dominio donde lo creaste, así que la URL nueva empieza vacía. Tienes dos formas de moverlo:

### Opción A: subirlo desde la versión local (recomendada)

1. Ejecuta `npm run dev` en `FitUs`.
2. Abre `http://localhost:3000` (asegúrate de que sea el puerto 3000, no 3001).
3. Inicia sesión con Google. La app sube tu historial, rutinas y medidas locales a Firestore.
4. Abre https://fitus-ccbd7.web.app con la misma cuenta: los datos aparecerán allí.

### Opción B: exportar e importar

1. En la versión antigua, ve a **Ajustes → Exportar Copia** y guarda el JSON.
2. En la versión nueva, inicia sesión y ve a **Ajustes → Importar Copia**.
3. Selecciona el JSON. Se reemplazan los entrenamientos y rutinas actuales y se sincronizan con la nube.

## Problemas frecuentes

| Error | Solución |
|---|---|
| `auth/unauthorized-domain` | Añade el dominio en Authentication → Settings → Authorized domains. |
| `auth/operation-not-allowed` | Activa el proveedor Google en Authentication → Sign-in method. |
| `auth/popup-blocked` | Permite ventanas emergentes o inicia sesión desde el móvil (usa redirección). |
| `permission-denied` | Revisa que las reglas de Firestore estén publicadas y que el usuario esté autenticado. |
| Google muestra "Acceso bloqueado" | Añade tu correo como usuario de prueba en la pantalla de consentimiento OAuth de Google Cloud. |
| Google muestra `origin_mismatch` | Añade `https://fitus-ccbd7.web.app` en **Orígenes JavaScript autorizados** del cliente OAuth. |
| La app no muestra el login | Faltan las variables en `.env.local` o no reiniciaste `npm run dev`. |
| Los cambios no llegan a Firestore | Revisa la tarjeta de Ajustes y la consola del navegador; la app reintenta cada 30 segundos. |
| Cambié `.env.local` y no se aplica | Vite lee las variables al arrancar: detén y vuelve a ejecutar `npm run dev`, o vuelve a compilar antes de desplegar. |

## Coste

El plan gratuito **Spark** de Firebase incluye Hosting y una cuota de Firestore suficiente para uso personal. Puedes revisar los límites actuales en [firebase.google.com/pricing](https://firebase.google.com/pricing).
