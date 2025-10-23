// consumer.js
import amqp from "amqplib";
import nodemailer from "nodemailer";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://guest:guest@rabbitmq:5672";
const QUEUE = "notificaciones";

// ⚙️ Configuración para Gmail con contraseña de aplicación
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER, // tu correo real
        pass: process.env.GMAIL_PASS, // contraseña de aplicación
    },
});

// Dirección de envío
const fromAddress = `"Compras App" <${process.env.GMAIL_USER}>`;

async function start() {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(QUEUE, { durable: true });

        console.log(`✅ Esperando mensajes en la cola "${QUEUE}"...\n`);

        channel.consume(
            QUEUE,
            async (msg) => {
                if (msg !== null) {
                    const contenido = msg.content.toString();
                    const data = JSON.parse(contenido);

                    console.log("📩 Mensaje recibido:", data);

                    // ✉️ Enviar correo real
                    try {
                        await transporter.sendMail({
                            from: fromAddress,
                            to: data.usuario_email || process.env.GMAIL_USER,
                            subject: `✅ Pago Confirmado`,
                            html: `
                                <div style="
                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                max-width: 600px;
                                margin: 2rem auto;
                                padding: 2rem;
                                border-radius: 12px;
                                background: linear-gradient(145deg, #f0f4ff, #d9e4ff);
                                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                                color: #333;
                                ">
                                <h1 style="color: #1890ff; text-align: center;">¡Pago Confirmado!</h1>
                                <p style="font-size: 16px; text-align: center;">
                                    Hemos recibido tu pago correctamente.
                                </p>
                                <div style="
                                    margin-top: 1.5rem;
                                    padding: 1rem;
                                    background-color: #ffffff;
                                    border-radius: 8px;
                                    text-align: center;
                                    box-shadow: inset 0 0 10px rgba(0,0,0,0.05);
                                ">
                                    <p style="margin: 0; font-size: 16px;">Tu compra ha sido procesada con éxito.</p>
                                    <p style="margin: 0; font-size: 16px;">Gracias por confiar en nosotros.</p>
                                </div>
                                <p style="margin-top: 2rem; font-size: 14px; color: #555; text-align: center;">
                                    Este es un mensaje automático, por favor no respondas.
                                </p>
                                </div>
                            `,
                        });


                        console.log(`✅ Correo enviado al usuario ${data.usuario_id} (${data.usuario_email})\n`);
                    } catch (error) {
                        console.error("❌ Error enviando correo:", error.message);
                    }

                    // Confirmar que el mensaje fue procesado
                    channel.ack(msg);
                }
            },
            { noAck: false }
        );
    } catch (error) {
        console.error("❌ Error conectando a RabbitMQ:", error);
    }
}

start();
