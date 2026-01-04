using Core.SMTP;

namespace Core.Interface;

public interface ISmtpService
{
    Task<bool> SendEmailAsync(EmailMessage message);
}