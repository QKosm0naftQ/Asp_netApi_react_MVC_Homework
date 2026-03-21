namespace Core.Models;

public class ServiceResponse
{
    public bool IsSuccess { get; set; }
    public string Message { get; set; } = string.Empty;
    public object? Data { get; set; } // Опціонально, якщо треба щось повернути
}
