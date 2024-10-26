const NodeMailer = require('./vendor/node-mailer');
let obj = {
    email: 'moniqueerezo98@gmail.com',
    name: 'Ms. Erezo',
    from: '"Genesis Troy Torrecampo" <no-reply@class-scheduler.asc-bislig.com>',
    subject: 'Meeting Reminder',
    location: 'Sala de reuniones',
    time: '10:00 AM',
    date: '2022-08-15',
    event: 'Reunión de equipo',
    description: 'Discutir nuevos proyectos y objetivos',
    targetLang: 'ja',
};

obj.message = `Estimado ${obj.name},<br><br>
Le recordamos que tenemos un evento próximo en la ${obj.location} a las ${obj.time} del ${obj.date}. Este evento se denomina "${obj.event}".<br><br>
${obj.description}<br><br>
Atentamente,<br>
${obj.from}`;
const mailer = new NodeMailer();
mailer.sendMail(obj);