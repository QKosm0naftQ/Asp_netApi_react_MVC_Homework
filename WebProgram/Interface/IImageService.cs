namespace WebProgram.Interface
{
    public interface IImageService
    {
        Task<string> SaveImageAsync(IFormFile file);
        Task<string> SaveImageFromUrlAsync(string imageUrl);
        Task<string> SaveImageFromBase64Async(string input);
        Task DeleteImageAsync(string fileName);

        Task<IFormFile> GetImageAsync(string name);
    }
}
