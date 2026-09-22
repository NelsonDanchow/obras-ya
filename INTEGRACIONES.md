# Cómo activar login / SMS / WhatsApp de verdad

La app hoy tiene el flujo visual (demo). Para producción:

## 1) Google Login
1. https://console.cloud.google.com → crear proyecto "Obras Ya"
2. APIs & Services → OAuth consent screen
3. Credentials → OAuth client ID (Web)
4. En la app: Google Identity Services / Firebase Auth

## 2) Meta (Facebook / Instagram)
1. https://developers.facebook.com → Create App
2. Productos: Facebook Login (+ Instagram si aplica)
3. Agregar dominios permitidos (obrasya.github.io)
4. App ID + Secret en backend (nunca solo en el HTML público)

## 3) SMS con código (OTP)
Opciones: Twilio Verify, Firebase Phone Auth, o MessageBird.
1. Crear cuenta Twilio
2. Comprar/activar número o Verify Service
3. Backend: endpoint "enviar código" + "validar código"
4. Reemplazar el OTP demo de la app por esas APIs

## 4) Aviso al prestador (WhatsApp / mail)
- WhatsApp: Meta WhatsApp Cloud API o Twilio WhatsApp
- Mail: Resend, SendGrid o Gmail API
Al pedir presupuesto: backend manda "Tenés un pedido nuevo en Obras Ya" + link al chat.

## Orden recomendado
1. Firebase Auth (Google + teléfono) — más rápido para arrancar
2. Mail de aviso
3. WhatsApp Business
4. Meta Login completo
