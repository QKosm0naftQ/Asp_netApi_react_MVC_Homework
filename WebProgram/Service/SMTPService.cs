using System.Net.Mime;
using MailKit.Net.Smtp;
using MimeKit;
using WebProgram.Interface;
using WebProgram.SMTP;

namespace WebProgram.Service;

public class SMTPService : ISMTPService
{

    public async Task<bool> SendMessageAsync(Message message)
    {
        using var emailMessage = new MimeMessage();
    
        var body = new TextPart("html")
        {
            Text = message.Body
        };
    
        var multipart = new Multipart("mixed");
        multipart.Add(body);

        emailMessage.From.Add(new MailboxAddress("Відправник", EmailConfiguration.From));
        emailMessage.To.Add(new MailboxAddress("Отримувач", message.To));
        emailMessage.Subject = message.Subject;
        emailMessage.Body = multipart;

        using var client = new SmtpClient();
        try
        {
            await client.ConnectAsync(EmailConfiguration.SmtpServer, EmailConfiguration.Port, true);
            await client.AuthenticateAsync(EmailConfiguration.UserName, EmailConfiguration.Password);
            await client.SendAsync(emailMessage);
            await client.DisconnectAsync(true);

            return true;
        }
        catch (Exception ex)
        {
            // Краще використовувати ILogger замість Console.WriteLine
            Console.WriteLine("Error send EMAIL {0}", ex.Message);
            return false;
        }
    }
}