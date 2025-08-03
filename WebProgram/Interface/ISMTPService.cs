using WebProgram.SMTP;

namespace WebProgram.Interface;

public interface ISMTPService
{
    Task<bool> SendMessageAsync(Message message);
}